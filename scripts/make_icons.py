"""Generate the icons and plain launch screens.

The web app keeps the Notes-style disguise icon; the native store apps use the Mindfold brand icon
(Apple requires the installed app to match its store listing).

Run from the repo root after `npx cap add ios/android` (needs Pillow).
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
LIGHT_BG = (242, 242, 247)
DARK_BG = (0, 0, 0)


def make(size: int) -> Image.Image:
    """Square Notes-style icon: yellow header, perforation, ruled lines (iOS rounds the corners)."""
    s = size / 180
    img = Image.new("RGB", (size, size), (255, 255, 255))
    d = ImageDraw.Draw(img)
    top, bottom = (255, 214, 72), (250, 190, 20)
    band = int(52 * s)
    for y in range(band):
        t = y / max(band - 1, 1)
        d.line([(0, y), (size, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    for x in range(int(6 * s), size, max(1, int(12 * s))):
        d.ellipse([x, band + 3 * s, x + 4 * s, band + 7 * s], fill=(205, 205, 210))
    for i in range(5):
        y = int((82 + i * 20) * s)
        d.line([(0, y), (size, y)], fill=(222, 222, 226), width=max(1, int(2 * s)))
    return img


def brand(size: int) -> Image.Image:
    """Mindfold icon: a white note with a folded corner on a deep violet gradient, plus a spark."""
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    top, bottom = (91, 63, 214), (40, 20, 110)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    s = size / 1024
    # The note, its top-right corner folded down
    x0, y0, x1, y1, fold = 300 * s, 250 * s, 724 * s, 790 * s, 150 * s
    d.polygon([(x0, y0), (x1 - fold, y0), (x1, y0 + fold), (x1, y1), (x0, y1)], fill=(255, 255, 255))
    d.polygon([(x1 - fold, y0), (x1 - fold, y0 + fold), (x1, y0 + fold)], fill=(196, 184, 255))
    # Ruled lines
    for i in range(4):
        y = (450 + i * 80) * s
        d.rounded_rectangle([x0 + 70 * s, y, x1 - (70 + (120 if i == 3 else 0)) * s, y + 22 * s], 11 * s, fill=(214, 207, 245))
    # Spark above the fold: the "mind" in Mindfold
    cx, cy, r = 760 * s, 205 * s, 70 * s
    d.polygon([(cx, cy - r), (cx + r * 0.28, cy - r * 0.28), (cx + r, cy), (cx + r * 0.28, cy + r * 0.28),
               (cx, cy + r), (cx - r * 0.28, cy + r * 0.28), (cx - r, cy), (cx - r * 0.28, cy - r * 0.28)], fill=(255, 214, 72))
    return img


def rounded(img: Image.Image, radius_ratio: float = 0.225) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1], int(img.width * radius_ratio), fill=255)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out


def circle(img: Image.Image) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).ellipse([0, 0, img.width - 1, img.height - 1], fill=255)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out


def web():
    out = ROOT / "icons"
    out.mkdir(exist_ok=True)
    for px in (180, 512):
        make(px).save(out / f"icon-{px}.png")


def ios():
    assets = ROOT / "ios/App/App/Assets.xcassets"
    if not assets.exists():
        return
    brand(1024).save(assets / "AppIcon.appiconset/AppIcon-512@2x.png")
    # Plain launch screen (like opening Notes), with a dark-mode variant.
    splash = assets / "Splash.imageset"
    for old in splash.glob("*.png"):
        old.unlink()
    Image.new("RGB", (64, 64), LIGHT_BG).save(splash / "splash.png")
    Image.new("RGB", (64, 64), DARK_BG).save(splash / "splash-dark.png")
    (splash / "Contents.json").write_text(json.dumps({
        "images": [
            {"idiom": "universal", "filename": "splash.png"},
            {"idiom": "universal", "filename": "splash-dark.png",
             "appearances": [{"appearance": "luminosity", "value": "dark"}]},
        ],
        "info": {"version": 1, "author": "xcode"},
    }, indent=2) + "\n")


def android():
    res = ROOT / "android/app/src/main/res"
    if not res.exists():
        return
    for density, px in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
        folder = res / f"mipmap-{density}"
        rounded(brand(1024).resize((px, px), Image.LANCZOS), 0.2).save(folder / "ic_launcher.png")
        circle(brand(1024).resize((px, px), Image.LANCZOS)).save(folder / "ic_launcher_round.png")
        # Adaptive icon foreground: 108dp canvas, the launcher masks it to its own shape.
        fg = px * 108 // 48
        brand(1024).resize((fg, fg), Image.LANCZOS).save(folder / "ic_launcher_foreground.png")
    for splash in res.glob("drawable*/splash.png"):
        with Image.open(splash) as im:
            size = im.size
        Image.new("RGB", size, LIGHT_BG).save(splash, optimize=True)


web()
brand(1024).save(ROOT / "icons/mindfold-1024.png")  # for store listings and marketing
ios()
android()
print("icons and launch screens written")
