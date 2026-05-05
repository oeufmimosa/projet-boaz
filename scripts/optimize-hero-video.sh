#!/usr/bin/env bash
# scripts/optimize-hero-video.sh
#
# Ré-encode la vidéo source `video/video accueil.mp4` (ou tout MP4 source
# que tu lui passes en argument) en versions web-optimisées :
#   - public/placeholders/hero-background.mp4   (H.264, faststart)
#   - public/placeholders/hero-background.webm  (VP9, meilleure compression)
#
# Cible poids : ≤ 3 Mo MP4, ≤ 2 Mo WebM. Si la source dépasse, monter le
# CRF (28-32 au lieu de 26).
#
# Usage : bash scripts/optimize-hero-video.sh [chemin/vers/source.mp4]
# Pré-requis : ffmpeg installé sur le PATH.

set -euo pipefail

SRC="${1:-video/video accueil.mp4}"
OUT_DIR="public/placeholders"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg non trouvé sur le PATH. Installe-le et relance." >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Fichier source introuvable : $SRC" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "→ Encodage MP4 H.264 (CRF 26, faststart, 1920×auto, sans audio)..."
ffmpeg -y -i "$SRC" \
  -vcodec libx264 -profile:v main -preset slow -crf 26 \
  -movflags +faststart \
  -an \
  -vf "scale=1920:-2" \
  "$OUT_DIR/hero-background.mp4"

echo "→ Encodage WebM VP9 (CRF 32, sans audio)..."
ffmpeg -y -i "$SRC" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -an \
  -vf "scale=1920:-2" \
  "$OUT_DIR/hero-background.webm"

echo "✓ Vidéos générées dans $OUT_DIR :"
ls -lh "$OUT_DIR"/hero-background.mp4 "$OUT_DIR"/hero-background.webm

echo ""
echo "Pense à relancer scripts/generate-poster.sh pour le poster (= dernière frame)."
