# Asper Beauty Shop - Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Relaxed Type Checking**: Project uses `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`
- **Flexibility Over Strictness**: Allows implicit any types and unused parameters for rapid development
- **Skip Library Checks**: `skipLibCheck: true` for faster compilation
- **Allow JavaScript**: `allowJs: true` for mixed JS/TS codebase

### Import Conventions
- **Path Aliases**: Use `@/` prefix for all src imports (e.g., `@/components/Header`, `@/hooks/useAuth`)
- **Absolute Imports**: Never use relative imports like `../../components`
- **Named Imports**: Prefer named imports over default imports for utilities
- **Component Imports**: Default exports for page and component files

### File Naming
- **Components**: PascalCase (e.g., `ProductCard.tsx`, `CartDrawer.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useRateLimiter.ts`)
- **Utilities**: camelCase (e.g., `productUtils.ts`, `validationSchemas.ts`)
- **Pages**: PascalCase (e.g., `BulkUpload.tsx`, `Auth.tsx`)
- **Types**: PascalCase for interfaces (e.g., `ProcessedProduct`, `RateLimitState`)

### Code Formatting
- **Indentation**: 2 spaces (not tabs)
- **Line Endings**: CRLF (Windows style `\r\n`)
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings, double quotes in JSX
- **Trailing Commas**: Used in multi-line objects and arrays
- **Max Line Length**: No strict limit, but keep readable (typically under 120 chars)

## React Patterns

### Component Structure
```typescript
// 1. Imports (external, then internal)
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// 2. Type definitions
interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component definition with default export
export default function ComponentName({ title, onSubmit }: ComponentProps) {
  // 4. State declarations
  const [isLoading, setIsLoading] = useState(false);
  
  // 5. Custom hooks
  const { user } = useAuth();
  
  // 6. Event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, []);
  
  // 7. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### State Management
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Zustand stores for cart and wishlist
- **Server State**: Use TanStack Query for API data caching
- **Form State**: Use React Hook Form with Zod validation

### Hooks Usage
- **Custom Hooks**: Extract reusable logic into custom hooks with `use` prefix
- **useCallback**: Wrap event handlers to prevent unnecessary re-renders
- **useEffect**: Use for side effects, always specify dependencies
- **useMemo**: Rarely used, only for expensive computations
- **useRef**: For DOM references and mutable values that don't trigger re-renders

### Event Handlers
- **Naming**: Prefix with `handle` (e.g., `handleSubmit`, `handleFileUpload`)
- **Async Handlers**: Mark as `async` and handle errors with try-catch
- **Form Handlers**: Always call `e.preventDefault()` first
- **Loading States**: Set loading state before async operations

## API Integration Patterns

### Supabase Client Usage
```typescript
// Always get fresh session for authenticated requests
const { data: { session } } = await supabase.auth.getSession();

if (!session?.access_token) {
  toast.error('Please log in');
  return;
}

// Call edge function with auth header
const { data, error } = await supabase.functions.invoke('function-name', {
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
  body: { action: 'action-name', payload: data },
});

if (error) throw error;
if (data?.error) throw new Error(data.error);
```

### Error Handling
- **Check Multiple Error Sources**: Check both `error` and `data?.error`
- **Auth Errors**: Detect 401/403 and show appropriate messages
- **User Feedback**: Always use `toast` for success/error messages
- **Console Logging**: Log errors to console for debugging
- **Graceful Degradation**: Continue execution when possible, don't crash

### Rate Limiting
- **Custom Hook**: Use `useRateLimiter` for brute force protection
- **Pre-configured Limiters**: `useLoginRateLimiter`, `useSignupRateLimiter`, etc.
- **Check Before Action**: Always check `canAttempt` before proceeding
- **Record Attempts**: Call `recordAttempt()` on failure, `recordSuccess()` on success
- **User Feedback**: Show remaining attempts and lockout time

## Data Processing Patterns

### Excel/CSV Parsing
```typescript
// Use ExcelJS for Excel files
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(arrayBuffer);
const worksheet = workbook.worksheets[0];

// Get headers from first row
const headerRow = worksheet.getRow(1);
const headers: string[] = [];
headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
  headers[colNumber - 1] = String(cell.value || '').trim();
});

// Process data rows
worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
  if (rowNumber === 1) return; // Skip header
  // Process row
});
```

### Column Mapping
- **Flexible Matching**: Support multiple column name variations (English and Arabic)
- **Case Insensitive**: Use `toLowerCase()` for matching
- **Fuzzy Matching**: Use `includes()` for partial matches
- **Fallback Values**: Provide defaults when columns are missing

### Batch Processing
- **Batch Size**: Process 5-50 items at a time depending on API limits
- **Progress Tracking**: Update progress state after each batch
- **Delay Between Batches**: Add 300-500ms delay to avoid rate limits
- **Error Accumulation**: Collect errors, don't stop on first failure

## UI/UX Patterns

### Loading States
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // async operation
  } finally {
    setIsSubmitting(false);
  }
};

// In JSX
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Processing...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Toast Notifications
- **Success**: `toast.success('Operation completed')`
- **Error**: `toast.error('Operation failed')`
- **Info**: `toast.info('Processing...')`
- **Timing**: Show immediately on action completion
- **Messages**: Clear, concise, actionable

### Form Validation
```typescript
// Define Zod schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Too short'),
});

// Validate before submission
const validateForm = () => {
  try {
    schema.parse({ email, password });
    setErrors({});
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.errors.forEach((error) => {
        fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
    }
    return false;
  }
};
```

### Conditional Rendering
- **Early Returns**: Return loading/error states early
- **Ternary Operators**: Use for simple conditions
- **Logical AND**: Use `&&` for conditional rendering
- **Optional Chaining**: Use `?.` for nested properties

## Security Patterns

### Authentication
- **Session Checks**: Always verify session before authenticated operations
- **Token Passing**: Pass `access_token` in Authorization header
- **Role Checks**: Verify user role for admin operations
- **Logout Handling**: Clear local state on logout

### Input Validation
- **Client-Side**: Validate with Zod schemas before submission
- **Server-Side**: Backend validates again (defense in depth)
- **Sanitization**: Trim strings, parse numbers, escape special characters
- **Max Lengths**: Enforce maximum lengths on all text inputs

### CAPTCHA Integration
```typescript
// hCaptcha setup
const captchaRef = useRef<HCaptcha>(null);
const [captchaVerified, setCaptchaVerified] = useState(false);

const handleCaptchaVerify = async (token: string) => {
  const { data } = await supabase.functions.invoke('verify-captcha', {
    body: { token }
  });
  setCaptchaVerified(data?.success === true);
};

// In JSX
<HCaptcha
  sitekey={HCAPTCHA_SITE_KEY}
  onVerify={handleCaptchaVerify}
  onExpire={() => setCaptchaVerified(false)}
  ref={captchaRef}
/>
```

## Performance Patterns

### Image Optimization
- **Lazy Loading**: Use `LazyImage` component for images
- **Responsive Images**: Provide multiple sizes for different viewports
- **Placeholder Images**: Show placeholder while loading
- **Error Handling**: Fallback to placeholder on load error

### Code Splitting
- **Route-Based**: Each page is a separate chunk
- **Component Lazy Loading**: Use `React.lazy()` for large components
- **Dynamic Imports**: Import heavy libraries only when needed

### Memoization
- **useCallback**: Memoize event handlers passed to child components
- **useMemo**: Memoize expensive calculations (rarely needed)
- **React.memo**: Wrap components that receive same props frequently

## Testing Patterns

### Manual Testing
- **Browser DevTools**: Use console for debugging
- **Network Tab**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props
- **Error Boundaries**: Catch and display errors gracefully

### Error Logging
```typescript
try {
  // operation
} catch (error: any) {
  console.error('Operation failed:', error);
  toast.error(error.message || 'Unknown error');
}
```

## Documentation Standards

### Code Comments
- **Minimal Comments**: Code should be self-documenting
- **Complex Logic**: Comment non-obvious algorithms
- **TODOs**: Mark incomplete features with `// TODO:`
- **File Headers**: Add description for utility files and scripts

### JSDoc Comments
```typescript
/**
 * Categorize product based on name and description
 * @param name - Product name
 * @param description - Product description (optional)
 * @returns Category name
 */
function categorizeProduct(name: string, description?: string): string {
  // implementation
}
```

### Type Definitions
- **Interfaces**: Use for object shapes
- **Type Aliases**: Use for unions and complex types
- **Generics**: Use sparingly, only when truly needed
- **Export Types**: Export types used across files

## Common Idioms

### Null Coalescing
```typescript
const value = raw.field || raw.alternative || defaultValue;
```

### Array Operations
```typescript
// Filter and map
const completed = products.filter(p => p.status === 'completed');
const names = products.map(p => p.name);

// Reduce for aggregation
const total = products.reduce((sum, p) => sum + p.price, 0);
```

### Object Destructuring
```typescript
const { data, error } = await supabase.from('table').select();
const { user, loading } = useAuth();
```

### Spread Operators
```typescript
// Update state immutably
setProducts(prev => prev.map(p => 
  p.id === id ? { ...p, status: 'completed' } : p
));
```

### Optional Chaining
```typescript
const email = user?.email || 'guest@example.com';
const firstItem = items?.[0]?.name;
```

## Environment Configuration

### Environment Variables
- **Prefix**: All client-side vars start with `VITE_`
- **Supabase**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **CAPTCHA**: `VITE_HCAPTCHA_SITE_KEY`
- **Loading**: Use `import.meta.env.VITE_VAR_NAME`

### Configuration Files
- **vite.config.ts**: Build configuration, path aliases, plugins
- **tailwind.config.ts**: Design tokens, custom colors, fonts
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Scripts, dependencies, project metadata

## Deployment Patterns

### Build Process
```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Pre-deployment Checks
- Test all critical user flows
- Verify environment variables are set
- Check console for errors
- Test on multiple browsers
- Verify mobile responsiveness

## Anti-Patterns to Avoid

### Don't Do This
- ❌ Relative imports: `import { Button } from '../../components/ui/button'`
- ❌ Inline styles: `<div style={{ color: 'red' }}>`
- ❌ Direct DOM manipulation: `document.getElementById('id')`
- ❌ Mutating state directly: `state.value = newValue`
- ❌ Missing error handling: `await api.call()` without try-catch
- ❌ Hardcoded values: `if (user.id === '123')`
- ❌ Unused imports: Keep imports clean
- ❌ Console.log in production: Remove debug logs

### Do This Instead
- ✅ Path aliases: `import { Button } from '@/components/ui/button'`
- ✅ Tailwind classes: `<div className="text-red-500">`
- ✅ React refs: `const ref = useRef<HTMLDivElement>(null)`
- ✅ Immutable updates: `setState(prev => ({ ...prev, value: newValue }))`
- ✅ Try-catch blocks: `try { await api.call() } catch (e) { handleError(e) }`
- ✅ Environment variables: `import.meta.env.VITE_API_KEY`
- ✅ Clean imports: Remove unused imports
- ✅ Conditional logging: `if (import.meta.env.DEV) console.log(...)`
