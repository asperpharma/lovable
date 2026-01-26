import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Image as ImageIcon, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setIsLoading(false);
    }

    if (!authLoading) {
      checkAdmin();
    }
  }, [user, authLoading]);

  // Fetch current hero image
  useEffect(() => {
    if (!isAdmin) return;

    const fetchHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hero_background_image")
          .maybeSingle();

        if (error) {
          console.error("Error fetching hero image:", error);
        } else {
          setCurrentImageUrl(data?.value || "/luxury-beauty-background.jpg");
        }
      } catch (err) {
        console.error("Error fetching hero image:", err);
      }
    };

    fetchHeroImage();
  }, [isAdmin]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `hero-background-${Date.now()}.${fileExt}`;
      const filePath = `hero-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      // Update site settings
      const { error: updateError } = await supabase
        .from("site_settings")
        .upsert({
          key: "hero_background_image",
          value: publicUrl,
        }, {
          onConflict: "key",
        });

      if (updateError) throw updateError;

      setCurrentImageUrl(publicUrl);
      toast.success("Hero image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image: " + (error.message || "Unknown error"));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleResetToDefault = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          key: "hero_background_image",
          value: "/luxury-beauty-background.jpg",
        }, {
          onConflict: "key",
        });

      if (error) throw error;

      setCurrentImageUrl("/luxury-beauty-background.jpg");
      toast.success("Reset to default image");
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error("Failed to reset image");
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to access this page.
              </p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                You do not have permission to access this page.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h1 className="text-3xl font-bold">Admin Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage site-wide settings and configurations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hero Background Image</CardTitle>
            <CardDescription>
              Upload a new background image for the homepage hero section. Recommended size: 1920x1080px or larger.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Image Preview */}
            {currentImageUrl && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                  <img
                    src={currentImageUrl}
                    alt="Hero background preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="hero-image-upload">Upload New Image</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  id="hero-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </>
                  )}
                </Button>
                {currentImageUrl && currentImageUrl !== "/luxury-beauty-background.jpg" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetToDefault}
                    disabled={uploadingImage}
                  >
                    Reset to Default
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB. Supported formats: JPG, PNG, WebP
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
