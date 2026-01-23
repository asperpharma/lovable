# Asper Beauty Shop - Project Structure

## Directory Organization

```
lovable/
├── src/                      # Application source code
│   ├── assets/              # Static images and media
│   │   ├── brands/          # Brand logos (Vichy, etc.)
│   │   ├── categories/      # Category images
│   │   ├── concerns/        # Skin concern icons
│   │   ├── hero/            # Hero section images
│   │   ├── products/        # Product images
│   │   └── spotlights/      # Featured content images
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui primitives (Button, Dialog, etc.)
│   │   └── contexts/        # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   ├── lib/                 # Utility functions and helpers
│   ├── pages/               # Route page components
│   ├── stores/              # Zustand state management
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── supabase/                # Backend infrastructure
│   ├── functions/           # Edge functions (serverless)
│   │   ├── beauty-assistant/        # AI product recommendations
│   │   ├── bulk-product-upload/     # Batch product import
│   │   ├── create-cod-order/        # COD order creation
│   │   ├── delete-account/          # User account deletion
│   │   ├── enrich-products/         # Product data enhancement
│   │   ├── generate-product-images/ # AI image generation
│   │   ├── get-order-status/        # Order tracking
│   │   ├── remove-background/       # Image processing
│   │   ├── scrape-product/          # Web scraping
│   │   └── verify-captcha/          # CAPTCHA validation
│   └── migrations/          # Database schema migrations
├── scripts/                 # Build and utility scripts
│   ├── product-importer.ts  # Product import from CSV/Excel
│   └── shopify-bulk-import.ts # Shopify bulk operations
├── public/                  # Static assets served directly
│   └── data/                # Product data files (CSV, JSON, Excel)
└── .amazonq/                # Amazon Q configuration
    └── rules/               # Project rules and memory bank
```

## Core Components

### Page Components (src/pages/)
- **Index.tsx**: Home page with hero, featured products, categories
- **BulkUpload.tsx**: Admin interface for bulk product import
- **ProductDetail.tsx**: Individual product page with full details
- **Auth.tsx**: Authentication (login/signup) with Supabase
- **Account.tsx**: User profile and order history
- **AdminOrders.tsx**: Order management dashboard
- **DriverDashboard.tsx**: Delivery driver interface
- **ManageProducts.tsx**: Product CRUD operations
- **Collections.tsx / CollectionDetail.tsx**: Product collections
- **Brands.tsx / BrandVichy.tsx**: Brand showcase pages
- **Shop.tsx**: Main product catalog with filters
- **Wishlist.tsx**: Saved products
- **TrackOrder.tsx**: Order status tracking

### UI Components (src/components/)
- **Header.tsx / GlobalHeader.tsx**: Navigation and branding
- **CartDrawer.tsx / WishlistDrawer.tsx**: Slide-out panels
- **ProductCard.tsx / LuxuryProductCard.tsx**: Product display cards
- **ProductQuickView.tsx**: Modal product preview
- **ProductFilters.tsx**: Category/brand/price filtering
- **LuxurySearch.tsx / SearchDropdown.tsx**: Product search
- **BeautyAssistant.tsx**: AI chatbot interface
- **CODCheckoutForm.tsx**: Cash on delivery checkout
- **DriverAssignment.tsx**: Order-to-driver assignment
- **LazyImage.tsx / OptimizedImage.tsx**: Performance-optimized images

### State Management (src/stores/)
- **cartStore.ts**: Shopping cart state with Zustand
- **wishlistStore.ts**: Wishlist state with Zustand

### Custom Hooks (src/hooks/)
- **useAuth.ts**: Authentication state and operations
- **useCartSync.ts**: Cart synchronization with backend
- **useRateLimiter.ts**: API rate limiting logic
- **useDriverAuditLog.ts**: Driver activity logging
- **useScrollAnimation.ts**: Scroll-triggered animations
- **use-toast.ts**: Toast notification system
- **use-mobile.tsx**: Responsive breakpoint detection

### Utilities (src/lib/)
- **shopify.ts**: Shopify Storefront API client
- **productUtils.ts**: Product data transformation
- **productImageUtils.ts**: Image URL generation
- **categoryMapping.ts**: Category taxonomy
- **categoryHierarchy.ts**: Hierarchical category structure
- **validationSchemas.ts**: Zod validation schemas
- **imageGenerationQueue.ts**: Image processing queue
- **utils.ts**: General utility functions (cn, etc.)

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: React functional components with hooks
- **State Management**: Zustand for global state (cart, wishlist)
- **Data Fetching**: TanStack Query for server state caching
- **Routing**: React Router v6 with nested routes
- **Styling**: Tailwind CSS with custom design tokens
- **Type Safety**: TypeScript with strict mode disabled for flexibility

### Backend Architecture
- **Serverless Functions**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage for product images
- **API Integration**: Shopify Storefront API for e-commerce

### Design Patterns
- **Compound Components**: UI components with sub-components (Radix UI)
- **Custom Hooks**: Reusable logic extraction
- **Context Providers**: Theme, language, auth state
- **Lazy Loading**: Code splitting and image lazy loading
- **Error Boundaries**: Graceful error handling
- **Optimistic Updates**: Immediate UI feedback before server confirmation

### Data Flow
1. **User Action** → Component event handler
2. **State Update** → Zustand store or React Query mutation
3. **API Call** → Supabase function or Shopify API
4. **Response** → Update cache and UI
5. **Persistence** → Database or localStorage

## Integration Points

### External Services
- **Shopify**: Product catalog, checkout, order management
- **Supabase**: Auth, database, storage, serverless functions
- **hCaptcha**: Bot protection for forms
- **AI Services**: Product enrichment and image generation (via Supabase functions)

### Internal APIs
- **Supabase Functions**: RESTful endpoints for business logic
- **Shopify Storefront API**: GraphQL for product queries
- **Local Storage**: Cart and wishlist persistence
