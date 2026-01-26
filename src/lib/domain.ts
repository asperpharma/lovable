/**
 * Asper Beauty Shop – domain & config
 * Single source of truth for our domain, URLs, and brand.
 */

export const DOMAIN = {
  /** Primary site URL (Lovable live / app) */
  SITE_URL: "https://asperbeautyshop.lovable.app",
  /** Canonical / OG domain (www) */
  CANONICAL_URL: "https://www.asperbeautyshop.com",
  /** Contact email */
  CONTACT_EMAIL: "concierge@asperbeautyshop.com",
  /** Lovable project */
  LOVABLE_PROJECT_URL:
    "https://lovable.dev/projects/77495a61-2517-4bbc-b7c9-0c86fefea9be",
  /** Supabase project ref */
  SUPABASE_PROJECT_REF: "unjgpqdcdcatbrinitfu",
  /** Supabase project URL */
  SUPABASE_URL: "https://unjgpqdcdcatbrinitfu.supabase.co",
} as const;

export default DOMAIN;
