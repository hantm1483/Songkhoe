#!/bin/bash
# Secret Rotation Script
# Rotates secrets in Cloudflare KV

set -e

echo "=== Secret Rotation Script ==="

# Check for required environment variables
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set"
    exit 1
fi

SECRET_NAME=$1
NEW_VALUE=$2

if [ -z "$SECRET_NAME" ] || [ -z "$NEW_VALUE" ]; then
    echo "Usage: ./rotate-secrets.sh <SECRET_NAME> <NEW_VALUE>"
    echo "Example: ./rotate-secrets.sh ANTHROPIC_API_KEY sk-xxx..."
    exit 1
fi

echo "Rotating $SECRET_NAME..."

curl -X PATCH "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/secrets-manager/production/secrets" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$SECRET_NAME\", \"text\": \"$NEW_VALUE\"}"

echo ""
echo "✓ Secret rotated successfully"
echo "Last rotation: $(date -u +%Y-%m-%dT%H:%M:%SZ)"