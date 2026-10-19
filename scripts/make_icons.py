"""Generate the Notes-style home screen icons (iOS rounds the corners itself)."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"


def make(size: int) -> Image.Image:
    s = size / 180
    img = Image.new("RGB", (size, size), (255, 255, 255))
    d = ImageDraw.Draw(img)
    # Yellow header with a slight vertical gradient
    top, bottom = (255, 214, 72), (250, 190, 20)
    band = int(52 * s)
    for y in range(band):
        t = y / max(band - 1, 1)
        d.line([(0, y), (size, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    # Perforation dots under the header
    for x in range(int(6 * s), size, int(12 * s)):
        d.ellipse([x, band + 3 * s, x + 4 * s, band + 7 * s], fill=(205, 205, 210))
    # Ruled lines
    for i in range(5):
        y = int((82 + i * 20) * s)
        d.line([(0, y), (size, y)], fill=(222, 222, 226), width=max(1, int(2 * s)))
    return img


OUT.mkdir(exist_ok=True)
for px in (180, 512):
    make(px).save(OUT / f"icon-{px}.png")
print("wrote", sorted(p.name for p in OUT.iterdir()))
