#!/usr/bin/env bash
# Builds web-optimized copies of the client's photos/videos into public/media/
# (gitignored). Then run `npm run media:upload` to push them to Vercel Blob.
# Usage: scripts/prepare-media.sh "/path/to/take a pic photos"   (needs ffmpeg)
set -euo pipefail
SRC="${1:?usage: prepare-media.sh <client media folder>}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
rm -rf "$OUT" && mkdir -p "$OUT"/{hero,robot,vogue,booths,gallery}

img() { # src dest [max]
  ffmpeg -v error -y -i "$1" -vf "scale='min(${3:-1600},iw)':'min(${3:-1600},ih)':force_original_aspect_ratio=decrease" -q:v 3 "$OUT/$2"
}
vid() { # src dest-without-ext [audio|-] [poster-second]
  local audio=(-an); [ "${3:-}" = audio ] && audio=(-c:a aac -b:a 96k)
  ffmpeg -v error -y -i "$1" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -vf "scale='min(720,iw)':-2" "${audio[@]}" -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -v error -y -ss "${4:-2}" -i "$1" -frames:v 1 -vf "scale='min(720,iw)':-2" -q:v 4 "$OUT/$2.jpg"
}

ffmpeg -v error -y -i "$SRC/logo-transparent.png" -vf scale=320:-1 "$OUT/logo.png"

vid "$SRC/Robot-feature.mp4" hero/robot-feature audio

R="$SRC/robot intro"
vid "$R/Robot Feature-2.mp4" robot/comes-to-you
vid "$R/Robot intro 01.mp4" robot/guests
vid "$R/WhatsApp Video 2026-10-26 at 4.20.53 PM.mp4" robot/crowd
vid "$R/robot intro 2.mp4" robot/branded
img "$R/Robot intro.jpeg" robot/studio.jpg
img "$R/WhatsApp Image 2026-10-26 at 4.20.47 PM.jpeg" robot/standing.jpg

# Vogue-feature-2.mp4 is skipped: it carries another vendor's watermark.
# Tiny (<250px) images and the phone screenshot are skipped too.
V="$SRC/Vogue Gallery"
vid "$V/Vogue-Demo.mp4" vogue/demo - 9
vid "$V/Vogue-frame.mp4" vogue/frame
i=0
for f in "6.14.42 PM" "6.35.29 PM" "9.03.34 PM (1)" "9.03.34 PM (2)" "9.03.34 PM" \
         "9.03.35 PM (1)" "9.03.35 PM" "9.03.36 PM (1)" "9.03.36 PM (2)" "9.03.36 PM"; do
  i=$((i+1)); img "$V/WhatsApp Image 2026-10-26 at $f.jpeg" "vogue/cover-$(printf %02d $i).jpg"
done

vid "$SRC/mirror.mp4" booths/mirror

# Event gallery: both folders, exact duplicates removed.
i=0; seen=" "
while IFS= read -r -d '' f; do
  h=$(md5 -q "$f" 2>/dev/null || md5sum "$f" | cut -d' ' -f1)
  [[ "$seen" == *" $h "* ]] && continue; seen+="$h "
  i=$((i+1)); img "$f" "gallery/event-$(printf %02d $i).jpg"
done < <(find "$SRC/Gallery1" "$SRC/gallery 2" -maxdepth 1 -name '*.jp*g' -print0 | sort -z)

du -sh "$OUT"
