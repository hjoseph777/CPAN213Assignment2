#!/usr/bin/env bash
set -euo pipefail

if ! command -v render >/dev/null 2>&1; then
  echo "Error: Render CLI not found. Install it first: https://render.com/docs/cli" >&2
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 <service-name-or-id>" >&2
  exit 1
fi

SERVICE=$1

echo "Enter MONGODB_URI (input hidden):"
read -rs MONGO_URI
printf '\n'

echo "Enter SESSION_SECRET (input hidden):"
read -rs SESSION_SECRET
printf '\n'

render env:set "$SERVICE" MONGODB_URI "$MONGO_URI" --service-type web >/dev/null
render env:set "$SERVICE" SESSION_SECRET "$SESSION_SECRET" --service-type web >/dev/null
render env:set "$SERVICE" NODE_ENV production --service-type web >/dev/null

cat <<EOMSG
✅ Environment variables updated for service '$SERVICE'.
  - MONGODB_URI (hidden)
  - SESSION_SECRET (hidden)
  - NODE_ENV=production
If you also want to pin Node runtime, run:
  render env:set "$SERVICE" NODE_VERSION 18.18.2 --service-type web
EOMSG
