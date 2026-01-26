-- Create site_settings table for managing site-wide settings like hero images
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for site settings (everyone can view settings)
CREATE POLICY "Site settings are publicly viewable"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can insert/update/delete site settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero image setting (using the existing public image as fallback)
INSERT INTO public.site_settings (key, value)
VALUES ('hero_background_image', '/luxury-beauty-background.jpg')
ON CONFLICT (key) DO NOTHING;
