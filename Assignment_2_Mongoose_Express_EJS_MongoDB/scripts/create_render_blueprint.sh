#!/usr/bin/env bash
set -euo pipefail

# Simple helper that generates a Render "render.yaml" blueprint for this project.
# Usage: ./scripts/create_render_blueprint.sh [service-name] [region]
# - service-name defaults to "cpan213-assignment2"
# - region defaults to "oregon"
#
# After running the script, deploy/update the service with:
#   render blueprint deploy --from-file render.yaml
# (Requires the Render CLI: https://render.com/docs/blueprint-spec)

SERVICE_NAME=${1:-"cpan213-assignment2"}
REGION=${2:-"oregon"}
BLUEPRINT_PATH="render.yaml"

cat >"${BLUEPRINT_PATH}" <<EOF
services:
  - type: web
    name: ${SERVICE_NAME}
    plan: free
    env: node
    region: ${REGION}
    rootDir: Assignment_2_Mongoose_Express_EJS_MongoDB
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false        # set in Render dashboard or via CLI secret
      - key: SESSION_SECRET
        sync: false        # set in Render dashboard or via CLI secret
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: 18.18.2
EOF

cat <<EONOTE
✅ render.yaml created/updated.
Next steps:
  1. Ensure the Render CLI is installed and authenticated.
  2. Create secrets in Render for MONGODB_URI and SESSION_SECRET if they do not exist yet.
  3. Deploy/update the service using:
       render blueprint deploy --from-file ${BLUEPRINT_PATH}
EONOTE
