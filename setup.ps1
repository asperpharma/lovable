# Asper Beauty Shop - Complete Setup Script (Windows PowerShell)
# This script sets up the development environment

Write-Host "🚀 Asper Beauty Shop - Complete Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Info { Write-Host $args -ForegroundColor Blue }

# Step 1: Check Node.js
Write-Info "📋 Step 1: Checking Node.js installation..."

# Try to find Node.js in common locations
$nodePath = $null
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodePath = "node"
} elseif (Test-Path "C:\Program Files\nodejs\node.exe") {
    $nodePath = "C:\Program Files\nodejs\node.exe"
    $env:PATH = "C:\Program Files\nodejs;$env:PATH"
} elseif (Test-Path "$env:LOCALAPPDATA\Programs\nodejs\node.exe") {
    $nodePath = "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    $env:PATH = "$env:LOCALAPPDATA\Programs\nodejs;$env:PATH"
}

if ($nodePath) {
    try {
        $nodeVersion = & $nodePath --version
        Write-Success "✅ Node.js is installed: $nodeVersion"
    } catch {
        Write-Error "❌ Node.js found but cannot execute"
        exit 1
    }
} else {
    Write-Error "❌ Node.js is not installed or not in PATH"
    Write-Warning "Please install Node.js from https://nodejs.org/"
    Write-Warning "Or install Bun from https://bun.sh/"
    exit 1
}

# Step 2: Check npm
Write-Info "📋 Step 2: Checking npm installation..."
try {
    $npmVersion = npm --version
    Write-Success "✅ npm is installed: $npmVersion"
} catch {
    Write-Error "❌ npm is not installed"
    exit 1
}

# Step 3: Check .env file
Write-Info "📋 Step 3: Checking environment configuration..."
if (Test-Path ".env") {
    Write-Success "✅ .env file exists"
    
    # Check required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=") {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Warning "⚠️  Missing environment variables: $($missingVars -join ', ')"
        Write-Warning "Please update .env file with required values"
    } else {
        Write-Success "✅ Required environment variables are set"
    }
} else {
    Write-Warning "⚠️  .env file not found"
    if (Test-Path ".env.template") {
        Write-Info "Creating .env from .env.template..."
        Copy-Item ".env.template" ".env"
        Write-Warning "⚠️  Please edit .env file and fill in your actual values"
    } else {
        Write-Error "❌ .env.template not found"
        exit 1
    }
}

# Step 4: Install dependencies
Write-Info "📋 Step 4: Installing dependencies..."
if (Test-Path "node_modules") {
    Write-Success "✅ Dependencies already installed"
    Write-Info "Running npm install to update dependencies..."
    npm install
} else {
    Write-Info "Installing dependencies (this may take a few minutes)..."
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Dependencies installed successfully"
    } else {
        Write-Error "❌ Failed to install dependencies"
        exit 1
    }
}

# Step 5: Verify critical packages
Write-Info "📋 Step 5: Verifying critical packages..."
$criticalPackages = @(
    "@supabase/supabase-js",
    "react",
    "react-dom",
    "vite"
)

foreach ($package in $criticalPackages) {
    $packagePath = "node_modules/$package"
    if (Test-Path $packagePath) {
        Write-Success "✅ $package is installed"
    } else {
        Write-Warning "⚠️  $package is missing"
    }
}

# Step 6: Check TypeScript
Write-Info "📋 Step 6: Checking TypeScript configuration..."
if (Test-Path "tsconfig.json") {
    Write-Success "✅ TypeScript configuration exists"
} else {
    Write-Warning "⚠️  tsconfig.json not found"
}

# Step 7: Check Supabase configuration
Write-Info "📋 Step 7: Checking Supabase configuration..."
if (Test-Path "supabase/config.toml") {
    Write-Success "✅ Supabase configuration exists"
} else {
    Write-Warning "⚠️  Supabase configuration not found"
}

# Step 8: Check edge functions
Write-Info "📋 Step 8: Checking Supabase Edge Functions..."
$functions = @(
    "bulk-product-upload",
    "generate-product-images",
    "remove-background",
    "create-cod-order",
    "get-order-status",
    "beauty-assistant",
    "enrich-products",
    "delete-account",
    "verify-captcha",
    "scrape-product"
)

$missingFunctions = @()
foreach ($func in $functions) {
    $funcPath = "supabase/functions/$func/index.ts"
    if (Test-Path $funcPath) {
        Write-Success "✅ Function $func exists"
    } else {
        Write-Warning "⚠️  Function $func is missing"
        $missingFunctions += $func
    }
}

# Step 9: Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 Setup Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Success "✅ Setup completed successfully!"
Write-Host ""
Write-Info "📝 Next steps:"
Write-Host "  1. Verify .env file has all required values"
Write-Host "  2. Configure Supabase Edge Function secrets in Supabase Dashboard"
Write-Host "  3. Run 'npm run dev' to start development server"
Write-Host "  4. Run 'npm run build' to build for production"
Write-Host ""
Write-Info "📚 Documentation:"
Write-Host "  - QUICK_START.md - Quick deployment guide"
Write-Host "  - DEPLOYMENT_GUIDE.md - Detailed deployment steps"
Write-Host "  - PRODUCTION_CHECKLIST.md - Production verification"
Write-Host ""

if ($missingFunctions.Count -gt 0) {
    Write-Warning "⚠️  Some edge functions are missing: $($missingFunctions -join ', ')"
}

Write-Success "🎉 Setup complete! You're ready to develop."
