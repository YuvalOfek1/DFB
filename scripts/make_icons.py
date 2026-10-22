"""Generate the icons and plain launch screens.

The web app keeps the Notes-style disguise icon; the native store apps use the Foldwise brand icon
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
    """Foldwise icon: a white note with a folded corner on a deep violet gradient, plus a spark."""
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
    # Spark above the fold: the "mind" in Foldwise
    cx, cy, r = 760 * s, 205 * s, 70 * s
    d.polygon([(cx, cy - r), (cx + r * 0.28, cy - r * 0.28), (cx + r, cy), (cx + r * 0.28, cy + r * 0.28),
               (cx, cy + r), (cx - r * 0.28, cy + r * 0.28), (cx - r, cy), (cx - r * 0.28, cy - r * 0.28)], fill=(255, 214, 72))
    return img


# ----- Alternate icons (Setup → App Icon) -----
# Our own notepad designs for the Notes trick. None of them copies Apple's Notes icon (App Store
# guideline 5.2.5); they're offered under guideline 4.6: chosen by the user, with Foldwise to go back.

def _supersampled(draw_at, size: int) -> Image.Image:
    big = draw_at(size * 2)
    return big.resize((size, size), Image.LANCZOS)


def legal_pad(size: int) -> Image.Image:
    """A yellow legal pad: maroon binding strip, red margin, blue ruled lines."""
    def draw(px):
        s = px / 1024
        img = Image.new("RGB", (px, px), (252, 232, 120))
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, px, 210 * s], fill=(122, 30, 38))
        d.rectangle([0, 210 * s, px, 232 * s], fill=(92, 20, 28))
        for i in range(8):
            y = (330 + i * 92) * s
            d.rectangle([0, y, px, y + 7 * s], fill=(120, 170, 220))
        d.rectangle([200 * s, 232 * s, 210 * s, px], fill=(214, 70, 70))
        d.rectangle([222 * s, 232 * s, 230 * s, px], fill=(214, 70, 70))
        return img
    return _supersampled(draw, size)


def index_card(size: int) -> Image.Image:
    """A white index card, slightly turned, on a teal background."""
    def draw(px):
        s = px / 1024
        img = Image.new("RGB", (px, px))
        d = ImageDraw.Draw(img)
        top, bottom = (38, 166, 154), (12, 98, 104)
        for y in range(px):
            t = y / (px - 1)
            d.line([(0, y), (px, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
        card = Image.new("RGBA", (int(760 * s), int(520 * s)), (255, 255, 255, 255))
        c = ImageDraw.Draw(card)
        c.rectangle([0, 96 * s, card.width, 104 * s], fill=(226, 72, 72))
        for i in range(4):
            y = (190 + i * 82) * s
            c.rectangle([0, y, card.width, y + 5 * s], fill=(140, 190, 235))
        shadow = Image.new("RGBA", card.size, (0, 0, 0, 70))
        card = card.rotate(-8, expand=True, resample=Image.BICUBIC)
        shadow = shadow.rotate(-8, expand=True, resample=Image.BICUBIC)
        x, y = (px - card.width) // 2, (px - card.height) // 2
        img.paste(shadow, (x + int(14 * s), y + int(22 * s)), shadow)
        img.paste(card, (x, y), card)
        return img
    return _supersampled(draw, size)


def sticky_note(size: int) -> Image.Image:
    """An orange sticky note with a lifted corner on a graphite background."""
    def draw(px):
        s = px / 1024
        img = Image.new("RGB", (px, px), (46, 48, 56))
        d = ImageDraw.Draw(img)
        x0, y0, x1, y1, curl = 212 * s, 212 * s, 812 * s, 812 * s, 170 * s
        d.polygon([(x0 + 18 * s, y0 + 26 * s), (x1 + 18 * s, y0 + 26 * s), (x1 + 18 * s, y1 - curl + 26 * s),
                   (x1 - curl + 18 * s, y1 + 26 * s), (x0 + 18 * s, y1 + 26 * s)], fill=(30, 31, 37))
        d.polygon([(x0, y0), (x1, y0), (x1, y1 - curl), (x1 - curl, y1), (x0, y1)], fill=(255, 176, 59))
        d.polygon([(x1, y1 - curl), (x1 - curl, y1), (x1 - curl * 0.82, y1 - curl * 0.82)], fill=(222, 134, 28))
        for i, w in enumerate((420, 360, 250)):
            y = (330 + i * 110) * s
            d.rounded_rectangle([x0 + 70 * s, y, x0 + (70 + w) * s, y + 26 * s], 13 * s, fill=(205, 120, 30))
        return img
    return _supersampled(draw, size)


ALTERNATES = {"LegalPad": legal_pad, "IndexCard": index_card, "StickyNote": sticky_note}


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
    # Thumbnails for Setup → App Icon (the page rounds their corners)
    picker = out / "app-icons"
    picker.mkdir(exist_ok=True)
    brand(1024).resize((120, 120), Image.LANCZOS).save(picker / "Foldwise.png")
    for name, draw in ALTERNATES.items():
        draw(120).save(picker / f"{name}.png")


def ios():
    assets = ROOT / "ios/App/App/Assets.xcassets"
    if not assets.exists():
        return
    brand(1024).save(assets / "AppIcon.appiconset/AppIcon-512@2x.png")
    # Alternate icons, listed in the App target's ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES
    for name, draw in ALTERNATES.items():
        folder = assets / f"AppIcon-{name}.appiconset"
        folder.mkdir(exist_ok=True)
        draw(1024).save(folder / "icon-1024.png")
        (folder / "Contents.json").write_text(json.dumps({
            "images": [{"filename": "icon-1024.png", "idiom": "universal", "platform": "ios", "size": "1024x1024"}],
            "info": {"author": "xcode", "version": 1},
        }, indent=2) + "\n")
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
        # Alternate icons, one launcher activity-alias each (AndroidManifest.xml)
        for name, draw in ALTERNATES.items():
            key = name.lower()
            art = draw(1024)
            rounded(art.resize((px, px), Image.LANCZOS), 0.2).save(folder / f"ic_launcher_{key}.png")
            circle(art.resize((px, px), Image.LANCZOS)).save(folder / f"ic_launcher_{key}_round.png")
            art.resize((fg, fg), Image.LANCZOS).save(folder / f"ic_launcher_{key}_foreground.png")
    adaptive = res / "mipmap-anydpi-v26"
    for name in ALTERNATES:
        key = name.lower()
        xml = ('<?xml version="1.0" encoding="utf-8"?>\n'
               '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
               '    <background android:drawable="@color/ic_launcher_background"/>\n'
               f'    <foreground android:drawable="@mipmap/ic_launcher_{key}_foreground"/>\n'
               '</adaptive-icon>\n')
        (adaptive / f"ic_launcher_{key}.xml").write_text(xml)
        (adaptive / f"ic_launcher_{key}_round.xml").write_text(xml)
    for splash in res.glob("drawable*/splash.png"):
        with Image.open(splash) as im:
            size = im.size
        Image.new("RGB", size, LIGHT_BG).save(splash, optimize=True)


web()
brand(1024).save(ROOT / "icons/foldwise-1024.png")  # for store listings and marketing
ios()
android()
print("icons and launch screens written")
