# Asper Beauty Shop – Apply domain setup (Lovable + Supabase)
# Run from project root. Requires: Supabase CLI, npm/pnpm.
# Usage: .\scripts\apply-domain-setup.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ProjectRef = "unjgpqdcdcatbrinitfu"
$DefaultSiteUrl = "https://asperbeautyshop.lovable.app"

Set-Location $ProjectRoot

Write-Host "`n=== Asper Beauty Shop – Domain setup ===" -ForegroundColor Cyan
Write-Host "Supabase project: $ProjectRef" -ForegroundColor Gray
Write-Host ""

# Check Supabase CLI
$supabase = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabase) {
  Write-Host "Supabase CLI not found. Install: npm install -g supabase" -ForegroundColor Red
  exit 1
}

# Link project
Write-Host "Linking Supabase project..." -ForegroundColor Yellow
supabase link --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# LOVABLE_API_KEY
Write-Host ""
$key = Read-Host "Enter LOVABLE_API_KEY (from Lovable project Settings → API)"
if ([string]::IsNullOrWhiteSpace($key)) {
  Write-Host "LOVABLE_API_KEY not provided. Skip secrets." -ForegroundColor Yellow
  exit 0
}

Write-Host "Setting Supabase secrets..." -ForegroundColor Yellow
supabase secrets set "LOVABLE_API_KEY=$key"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# SITE_URL
$site = Read-Host "Enter SITE_URL (press Enter for $DefaultSiteUrl)"
if ([string]::IsNullOrWhiteSpace($site)) { $site = $DefaultSiteUrl }
supabase secrets set "SITE_URL=$site"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. LOVABLE_API_KEY and SITE_URL are set in Supabase." -ForegroundColor Green
Write-Host "Verify: Supabase Dashboard → Project Settings → Edge Functions → Secrets" -ForegroundColor Gray
