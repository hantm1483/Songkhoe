#!/bin/bash
# Cloudflare KV Setup Script
# Creates KV namespace and populates initial secrets

set -e

echo "=== Cloudflare KV Setup for Zero Trust Secrets Management ==="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Login to Cloudflare
echo "Logging in to Cloudflare..."
wrangler login

# Create KV namespace
echo "Creating KV namespace for secrets..."
KV_ID=$(wrangler kv:namespace create SECRETS_KV --env production | grep -oP 'id=\K[a-z0-9]+' || echo "")
if [ -z "$KV_ID" ]; then
    echo "Error: Could not create KV namespace"
    exit 1
fi

echo "KV Namespace ID: $KV_ID"

# Write initial secrets (prompt for values)
echo ""
echo "=== Configuring Secrets ==="

read -p "Enter ANTHROPIC_API_KEY (or press Enter to skip): " ANTHROPIC_KEY
if [ -n "$ANTHROPIC_KEY" ]; then
    wrangler kv:key put "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY" --namespace-id="$KV_ID" --env production
    echo "✓ ANTHROPIC_API_KEY set"
fi

read -p "Enter SUPABASE_JWT_SECRET (or press Enter to skip): " JWT_SECRET
if [ -n "$JWT_SECRET" ]; then
    wrangler kv:key put "SUPABASE_JWT_SECRET" "$JWT_SECRET" --namespace-id="$KV_ID" --env production
    echo "✓ SUPABASE_JWT_SECRET set"
fi

# Set secret metadata
echo ""
echo "=== Setting Secret Metadata ==="
wrangler kv:key put "SECRET_ROTATION_SCHEDULE" "90" --namespace-id="$KV_ID" --env production
wrangler kv:key put "LAST_ROTATION" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --namespace-id="$KV_ID" --env production

echo ""
echo "=== KV Setup Complete ==="
echo "KV Namespace ID: $KV_ID"
echo ""
echo "Next steps:"
echo "1. Add this to wrangler.toml:"
echo "   [[kv_namespaces]]"
echo "   binding = \"SECRETS_KV\""
echo "   id = \"$KV_ID\""
echo ""
echo "2. Update wrangler.toml with the KV ID"
echo "3. Run 'wrangler deploy' to deploy workers"