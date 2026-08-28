#!/usr/bin/env bash
# Runs the Supabase integration probe in both modes:
#   1. unconfigured  — no env vars, the site must serve bundled data
#   2. unreachable   — env vars point at a bogus project, error paths must degrade
set -uo pipefail
cd "$(dirname "$0")/../.."

status=0

echo "=============================================="
echo " 1/2  unconfigured (no VITE_SUPABASE_* env)"
echo "=============================================="
env -u VITE_SUPABASE_URL -u VITE_SUPABASE_ANON_KEY \
  npx vite build --config scripts/verify/vite.config.mjs --logLevel error || exit 1
PROBE_MODE=unconfigured node scripts/verify/run.mjs scripts/verify/.dist/probe.js || status=1

echo
echo "=============================================="
echo " 2/2  unreachable backend (bogus project ref)"
echo "=============================================="
VITE_SUPABASE_URL="https://aurelia-nonexistent-project-ref.supabase.co" \
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.bogus-signature-for-testing" \
  npx vite build --config scripts/verify/vite.config.mjs --outDir scripts/verify/.dist-offline --logLevel error || exit 1
PROBE_MODE=unreachable node scripts/verify/run.mjs scripts/verify/.dist-offline/probe.js || status=1

echo
if [ "$status" -eq 0 ]; then echo "ALL SUPABASE PROBE CHECKS PASSED"; else echo "SOME CHECKS FAILED"; fi
exit "$status"
