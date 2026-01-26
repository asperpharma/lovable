#!/usr/bin/env bash
# Asper Beauty Shop – Apply domain setup (Lovable + Supabase)
# Run from project root. Requires: Supabase CLI.
# Usage: ./scripts/apply-domain-setup.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_REF="unjgpqdcdcatbrinitfu"
DEFAULT_SITE_URL="https://asperbeautyshop.lovable.app"

cd "$PROJECT_ROOT"

echo ""
echo "=== Asper Beauty Shop – Domain setup ==="
echo "Supabase project: $PROJECT_REF"
echo ""

if ! command -v supabase &>/dev/null; then
  echo "Supabase CLI not found. Install: npm install -g supabase"
  exit 1
fi

echo "Linking Supabase project..."
supabase link --project-ref "$PROJECT_REF"

echo ""
read -r -p "Enter LOVABLE_API_KEY (from Lovable project Settings → API): " KEY
if [[ -z "$KEY" ]]; then
  echo "LOVABLE_API_KEY not provided. Skipping secrets."
  exit 0
fi

echo "Setting Supabase secrets..."
supabase secrets set "LOVABLE_API_KEY=$KEY"

read -r -p "Enter SITE_URL (press Enter for $DEFAULT_SITE_URL): " SITE
SITE="${SITE:-$DEFAULT_SITE_URL}"
supabase secrets set "SITE_URL=$SITE"

echo ""
echo "Done. LOVABLE_API_KEY and SITE_URL are set in Supabase."
echo "Verify: Supabase Dashboard → Project Settings → Edge Functions → Secrets"
