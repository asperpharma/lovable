import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/components/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="flex min-h-[60vh] items-center justify-center pt-32 pb-16">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-serif text-charcoal">404</h1>
          <p className="mb-4 text-xl text-taupe">{t.pageNotFound}</p>
          <p className="mb-8 text-muted-foreground">{t.pageNotFoundDescription}</p>
          <Link to="/">
            <Button>{t.goHome}</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
