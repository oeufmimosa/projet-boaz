#!/usr/bin/env bash
# scripts/generate-poster.sh
#
# Génère le poster JPG du hero vidéo = **dernière frame** de la vidéo MP4.
# Pour une transition vidéo → poster invisible une fois la lecture terminée
# (et pour les utilisateurs qui ne voient jamais la vidéo : reduced-motion,
# saveData, déjà jouée dans la session).
#
# Usage : bash scripts/generate-poster.sh
# Pré-requis : ffmpeg installé sur le PATH.

set -euo pipefail

SRC="public/placeholders/hero-background.mp4"
OUT="public/placeholders/hero-background-poster.jpg"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg non trouvé sur le PATH. Installe-le et relance." >&2
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Fichier vidéo introuvable : $SRC" >&2
  echo "Lance d'abord : bash scripts/optimize-hero-video.sh" >&2
  exit 1
fi

# -sseof -0.04 → se positionne 0.04s avant la fin (suffisant pour récupérer
# la toute dernière frame). -frames:v 1 → une seule image. -q:v 2 → qualité
# JPEG élevée (échelle 2-31, 2 = meilleure qualité).
ffmpeg -y -sseof -0.04 -i "$SRC" -frames:v 1 -q:v 2 "$OUT"

echo "✓ Poster généré : $OUT"
ls -lh "$OUT"
