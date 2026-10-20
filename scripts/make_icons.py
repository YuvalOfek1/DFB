"""Generate the Notes-style icons and plain launch screens for the web app and the native apps.

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
    make(1024).save(assets / "AppIcon.appiconset/AppIcon-512@2x.png")
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
        rounded(make(px * 4).resize((px, px), Image.LANCZOS), 0.2).save(folder / "ic_launcher.png")
        circle(make(px * 4).resize((px, px), Image.LANCZOS)).save(folder / "ic_launcher_round.png")
        # Adaptive icon foreground: 108dp canvas, the launcher masks it to its own shape.
        fg = px * 108 // 48
        make(fg).save(folder / "ic_launcher_foreground.png")
    for splash in res.glob("drawable*/splash.png"):
        with Image.open(splash) as im:
            size = im.size
        Image.new("RGB", size, LIGHT_BG).save(splash, optimize=True)


web()
ios()
android()
print("icons and launch screens written")
