#!/bin/zsh
# Pack the latest clickable app for GitHub + Vercel.
# Playground and older studies stay in Prototype/ and are not copied.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/Prototype"
DEST="$ROOT/share"

python3 - "$SRC" "$DEST" <<'PY'
import json, re, shutil, sys
from pathlib import Path

src, dest = Path(sys.argv[1]), Path(sys.argv[2])
if dest.exists():
    shutil.rmtree(dest)
dest.mkdir(parents=True)
(dest / "trailers").mkdir()

html_files = [
    "ah-gummy-now.html",
    "ah-gummy-ask-smear.html",
    "ah-gummy-my-stuff.html",
    "ah-gummy-following.html",
    "ah-gummy-search.html",
]
assets = [
    "star.svg",
    "ask-close.svg",
    "honey-stain-mask.svg",
    "Netflix logo.webp",
    "hbo-max-new-logo.jpg",
    "apple tv logo.jpg",
    "streamz-logo.jpg",
    "vrt-max-logo.png",
    "vtm-go-logo.png",
    "play-logo.png",
    "disney-plus-logo.png",
    "play sports logo.png",
    "icon-180.png",
    "icon-192.png",
    "icon-512.png",
    "sw.js",
]

def strip_playground(text: str) -> str:
    text = re.sub(r'(?: · )?<a href="playground\.html">Playground</a>(?: · )?', "", text)
    text = re.sub(r'<p class="note">\s*</p>', '<p class="note"></p>', text)
    return text

for name in html_files:
    text = strip_playground((src / name).read_text())
    (dest / name).write_text(text)

index = (dest / "ah-gummy-now.html").read_text()
(dest / "index.html").write_text(index)

manifest = json.loads((src / "manifest.webmanifest").read_text())
manifest["id"] = "./"
manifest["start_url"] = "./?app=1"
manifest["scope"] = "./"
(dest / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")

for name in assets:
    path = src / name
    if not path.exists():
        raise SystemExit(f"missing asset: {name}")
    shutil.copy2(path, dest / name)

ids = set()
for name in html_files:
    ids.update(re.findall(r'youtube:\s*"([^"]+)"', (src / name).read_text()))
ids = sorted(ids)
missing = []
for vid in ids:
    clip = src / "trailers" / f"{vid}.mp4"
    if not clip.exists():
        missing.append(vid)
        continue
    shutil.copy2(clip, dest / "trailers" / f"{vid}.mp4")
if missing:
    raise SystemExit("missing trailers: " + ", ".join(missing))

def size(path: Path) -> int:
    if path.is_file():
        return path.stat().st_size
    return sum(p.stat().st_size for p in path.rglob("*") if p.is_file())

drop_bytes = size(dest)
proto_bytes = size(src)
print(f"packed {dest}")
print(f"files: {sum(1 for _ in dest.rglob('*') if _.is_file())}")
print(f"share: {drop_bytes / 1_048_576:.1f} MB")
print(f"full Prototype: {proto_bytes / 1_048_576:.1f} MB")
print(f"trailers included: {len(ids)}")
PY
