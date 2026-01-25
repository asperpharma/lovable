import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Critical pages - load immediately
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

// Secondary pages - lazy load for better performance
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Brands = lazy(() => import("./pages/Brands"));
const BrandVichy = lazy(() => import("./pages/BrandVichy"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const Offers = lazy(() => import("./pages/Offers"));
const Contact = lazy(() => import("./pages/Contact"));
const SkinConcerns = lazy(() => import("./pages/SkinConcerns"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const Philosophy = lazy(() => import("./pages/Philosophy"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));

// Admin pages - lazy load (rarely accessed by most users)
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const ManageProducts = lazy(() => import("./pages/ManageProducts"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const AdminAuditLogs = lazy(() => import("./pages/AdminAuditLogs"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-gold animate-spin" />
  </div>
);

const queryClient = new QueryClient();

// Cart sync wrapper component
function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartSyncProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/collections" element={<Collections />} />
                <Route
                  path="/collections/:slug"
                  element={<CollectionDetail />}
                />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/vichy" element={<BrandVichy />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/skin-concerns" element={<SkinConcerns />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/admin/bulk-upload" element={<BulkUpload />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartSyncProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
