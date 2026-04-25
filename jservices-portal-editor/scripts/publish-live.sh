#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIVE_DIR="/var/www/html/portal-editor"

cd "$ROOT_DIR"
npm run build
node ./scripts/verify-payment-link-format.mjs
rsync -a --delete ./dist/ "$LIVE_DIR/"
echo "published: $LIVE_DIR"
