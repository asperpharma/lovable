# Asper Beauty Shop - Technology Stack

## Programming Languages
- **TypeScript 5.8.3**: Primary language for type-safe development
- **JavaScript (ES Modules)**: Runtime execution
- **SQL**: Database migrations and queries
- **CSS**: Styling with Tailwind utilities

## Core Framework
- **React 18.3.1**: UI library with concurrent features
- **React DOM 18.3.1**: DOM rendering
- **Vite 5.4.19**: Build tool and dev server
- **@vitejs/plugin-react-swc 3.11.0**: Fast refresh with SWC compiler

## Build System

### Development Commands
```bash
npm run dev              # Start dev server on port 8080
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run import:products  # Import products from CSV/Excel
npm run import:shopify   # Bulk import to Shopify
```

### Build Configuration
- **Vite Config**: Custom server on port 8080, path aliases (@/), SWC compilation
- **TypeScript Config**: Relaxed strictness (noImplicitAny: false, strictNullChecks: false)
- **Path Alias**: `@/*` maps to `./src/*`
- **Component Tagger**: Lovable development tool for component tracking

## UI Framework & Styling

### Component Library
- **shadcn/ui**: Radix UI primitives with Tailwind styling
  - 25+ Radix UI components (Dialog, Dropdown, Select, Toast, etc.)
  - **class-variance-authority 0.7.1**: Component variant management
  - **cmdk 1.1.1**: Command palette component

### Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **tailwindcss-animate 1.0.7**: Animation utilities
- **@tailwindcss/typography 0.5.16**: Prose styling
- **PostCSS 8.5.6**: CSS processing
- **Autoprefixer 10.4.21**: Vendor prefix automation
- **tailwind-merge 2.6.0**: Class name merging utility (cn function)

### Design Tokens
```css
--maroon: #800020        /* Primary brand color */
--soft-ivory: #F8F8FF    /* Background */
--shiny-gold: #C5A028    /* Accent */
--dark-charcoal: #333333 /* Text */
```

### Typography
- **Playfair Display**: Headings and display text
- **Montserrat**: Body text
- **Tajawal**: Arabic text (RTL support)

## State Management

### Global State
- **Zustand 5.0.9**: Lightweight state management for cart and wishlist
- **TanStack Query 5.83.0**: Server state caching and synchronization

### Form Management
- **React Hook Form 7.61.1**: Form state and validation
- **@hookform/resolvers 3.10.0**: Validation schema integration
- **Zod 3.25.76**: TypeScript-first schema validation

## Routing & Navigation
- **React Router DOM 6.30.1**: Client-side routing with nested routes
- **Scroll Restoration**: Automatic scroll-to-top on navigation

## Backend & Database

### Supabase Stack
- **@supabase/supabase-js 2.90.0**: Supabase client library
- **PostgreSQL**: Database (via Supabase)
- **Supabase Auth**: User authentication
- **Supabase Storage**: File storage
- **Supabase Edge Functions**: Serverless functions (Deno runtime)

### E-commerce Integration
- **Shopify Storefront API**: Product catalog and checkout (GraphQL)

## Data Processing

### File Handling
- **ExcelJS 4.4.0**: Excel file parsing and generation
- **CSV Parsing**: Product import from CSV files

### Web Scraping
- **Cheerio 1.1.2**: HTML parsing for product scraping
- **Axios 1.13.2**: HTTP client for API requests

## UI Enhancements

### Carousels & Media
- **embla-carousel-react 8.6.0**: Touch-friendly carousels
- **Lazy Loading**: Image optimization with LazyImage component

### Interactions
- **Vaul 0.9.9**: Drawer component
- **Sonner 1.7.4**: Toast notifications
- **react-resizable-panels 2.1.9**: Resizable layout panels
- **Recharts 2.15.4**: Data visualization charts

### Date & Time
- **date-fns 3.6.0**: Date manipulation and formatting
- **react-day-picker 8.10.1**: Date picker component

## Security & Validation

### Authentication
- **Supabase Auth**: Email/password authentication with JWT
- **Row Level Security**: Database-level access control

### CAPTCHA
- **@hcaptcha/react-hcaptcha 2.0.1**: Bot protection

### Input Validation
- **input-otp 1.4.2**: OTP input component
- **Zod Schemas**: Runtime type validation

## Development Tools

### Linting & Formatting
- **ESLint 9.32.0**: Code linting
- **@eslint/js 9.32.0**: ESLint JavaScript config
- **eslint-plugin-react-hooks 5.2.0**: React hooks linting
- **eslint-plugin-react-refresh 0.4.20**: Fast refresh linting
- **typescript-eslint 8.38.0**: TypeScript ESLint integration

### Type Definitions
- **@types/node 22.19.7**: Node.js types
- **@types/react 18.3.23**: React types
- **@types/react-dom 18.3.7**: React DOM types

### Build Tools
- **tsx 4.21.0**: TypeScript execution for scripts
- **dotenv 17.2.3**: Environment variable management
- **lovable-tagger 1.1.11**: Component tagging for Lovable platform

## Icons & Assets
- **lucide-react 0.462.0**: Icon library (500+ icons)

## Theme Management
- **next-themes 0.3.0**: Dark/light mode support

## Package Manager
- **npm**: Primary package manager
- **Bun**: Alternative runtime (bun.lockb present)

## Environment Configuration
- **Development**: Port 8080, hot module replacement
- **Production**: Optimized build with code splitting
- **Environment Variables**: .env file for API keys and secrets

## Browser Support
- Modern browsers with ES2020+ support
- Mobile-first responsive design
- RTL layout support for Arabic

## Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading and responsive images
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization
- **Caching**: TanStack Query for API response caching
