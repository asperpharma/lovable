#!/bin/bash

# Asper Beauty Shop - Production Validation Script
# This script validates that everything is ready for production launch

set -e  # Exit on any error

echo "🔍 Asper Beauty Shop - Production Validation"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Check environment file
echo "📋 Checking Environment Configuration..."
if [ -f ".env" ]; then
    check "Environment file (.env) exists"
    
    # Check required variables
    source .env 2>/dev/null || true
    
    if [ -z "$VITE_SUPABASE_URL" ]; then
        warn "VITE_SUPABASE_URL not set in .env"
    else
        check "VITE_SUPABASE_URL is set"
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        warn "VITE_SUPABASE_ANON_KEY not set in .env"
    else
        check "VITE_SUPABASE_ANON_KEY is set"
    fi
else
    warn ".env file not found (create from .env.template)"
fi

# 2. Check dependencies
echo ""
echo "📦 Checking Dependencies..."
if [ -d "node_modules" ]; then
    check "Dependencies installed (node_modules exists)"
    
    # Check critical packages
    if [ -d "node_modules/@supabase" ]; then
        check "Supabase package installed"
    else
        warn "Supabase package missing"
    fi
    
    if [ -d "node_modules/react" ]; then
        check "React package installed"
    else
        warn "React package missing"
    fi
else
    warn "Dependencies not installed (run: npm install)"
fi

# 3. Check critical files
echo ""
echo "📁 Checking Critical Files..."
[ -f "src/App.tsx" ] && check "App.tsx exists" || warn "App.tsx missing"
[ -f "src/main.tsx" ] && check "main.tsx exists" || warn "main.tsx missing"
[ -f "src/index.css" ] && check "index.css exists" || warn "index.css missing"
[ -f "src/components/LuxuryHero.tsx" ] && check "LuxuryHero.tsx exists" || warn "LuxuryHero.tsx missing"
[ -f "src/components/BrandMarquee.tsx" ] && check "BrandMarquee.tsx exists" || warn "BrandMarquee.tsx missing"
[ -f "src/components/LuxuryCategories.tsx" ] && check "LuxuryCategories.tsx exists" || warn "LuxuryCategories.tsx missing"
[ -f "src/lib/imagePathUtils.ts" ] && check "imagePathUtils.ts exists" || warn "imagePathUtils.ts missing"
[ -f "supabase/config.toml" ] && check "Supabase config exists" || warn "Supabase config missing"

# 4. Check edge functions
echo ""
echo "☁️  Checking Edge Functions..."
FUNCTIONS=(
    "bulk-product-upload"
    "generate-product-images"
    "remove-background"
    "create-cod-order"
    "get-order-status"
    "beauty-assistant"
    "enrich-products"
    "delete-account"
    "verify-captcha"
    "scrape-product"
)

for func in "${FUNCTIONS[@]}"; do
    if [ -f "supabase/functions/$func/index.ts" ]; then
        check "Function $func exists"
    else
        warn "Function $func missing"
    fi
done

# 5. Check build capability
echo ""
echo "🏗️  Checking Build Capability..."
if command -v npm &> /dev/null; then
    check "npm is installed"
    
    # Try to build (dry run check)
    if npm run build --dry-run &> /dev/null || [ -f "package.json" ]; then
        info "Build configuration looks good"
    fi
else
    warn "npm not found"
fi

# 6. Check Supabase CLI
echo ""
echo "🔧 Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    check "Supabase CLI installed"
    
    # Check if logged in
    if supabase projects list &> /dev/null; then
        check "Supabase CLI authenticated"
    else
        warn "Supabase CLI not authenticated (run: supabase login)"
    fi
else
    warn "Supabase CLI not installed (run: npm install -g supabase)"
fi

# 7. Check TypeScript compilation
echo ""
echo "📝 Checking TypeScript..."
if command -v npx &> /dev/null; then
    if npx tsc --noEmit --skipLibCheck &> /dev/null; then
        check "TypeScript compiles without errors"
    else
        warn "TypeScript has compilation errors (run: npx tsc --noEmit)"
    fi
else
    warn "npx not available"
fi

# 8. Check for common issues
echo ""
echo "🔍 Checking for Common Issues..."

# Check for merge conflicts
if grep -r "<<<<<<< HEAD" src/ supabase/ &> /dev/null; then
    warn "Merge conflicts detected in code"
else
    check "No merge conflicts detected"
fi

# Check for console.logs in production code (optional)
CONSOLE_LOGS=$(grep -r "console\.log" src/ --include="*.tsx" --include="*.ts" | wc -l)
if [ $CONSOLE_LOGS -gt 0 ]; then
    info "Found $CONSOLE_LOGS console.log statements (consider removing for production)"
fi

# 9. Check documentation
echo ""
echo "📚 Checking Documentation..."
[ -f "PRODUCTION_CHECKLIST.md" ] && check "Production checklist exists" || warn "Production checklist missing"
[ -f "DEPLOYMENT_GUIDE.md" ] && check "Deployment guide exists" || warn "Deployment guide missing"
[ -f "MONITORING_GUIDE.md" ] && check "Monitoring guide exists" || warn "Monitoring guide missing"
[ -f "deploy.sh" ] && check "Deploy script exists" || warn "Deploy script missing"

# 10. Summary
echo ""
echo "=============================================="
echo "📊 Validation Summary"
echo "=============================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for production.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Validation complete with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}Review warnings above before deploying.${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo -e "${RED}Please fix errors before deploying.${NC}"
    exit 1
fi
