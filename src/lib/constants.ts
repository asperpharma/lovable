// Production constants and configuration
export const APP_CONFIG = {
  // Site Information
  SITE_NAME: 'Asper Beauty',
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://asperbeautyshop.lovable.app',
  
  // Business Information
  BUSINESS: {
    NAME: 'Asper Beauty',
    EMAIL: 'asperpharma@gmail.com',
    PHONE: '+962 79 065 6666',
    ADDRESS: 'Jordan',
  },
  
  // Shipping Configuration
  SHIPPING: {
    FREE_THRESHOLD: 50, // JOD
    COST: 3, // JOD
    CURRENCY: 'JOD',
  },
  
  // Order Configuration
  ORDER: {
    PREFIX: 'ASP-',
    STATUSES: {
      PENDING: 'pending',
      PROCESSING: 'processing',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    },
  },
  
  // Rate Limiting
  RATE_LIMITS: {
    ORDERS_PER_WINDOW: 5,
    WINDOW_MINUTES: 15,
  },
  
  // Validation Rules
  VALIDATION: {
    PHONE_REGEX: /^07[789]\d{7}$/,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_ADDRESS_LENGTH: 10,
    MAX_ADDRESS_LENGTH: 500,
    MAX_NOTES_LENGTH: 500,
    MAX_CART_ITEMS: 50,
    MAX_QUANTITY_PER_ITEM: 99,
  },
  
  // Jordan Cities
  CITIES: [
    'Amman',
    'Zarqa', 
    'Irbid',
    'Aqaba',
    'Salt',
    'Mafraq',
    'Jerash',
    'Madaba',
    'Karak',
    'Ajloun',
    "Ma'an",
    'Tafilah',
  ],
  
  // API Endpoints
  API: {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    HCAPTCHA_SITE_KEY: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
  },
  
  // Feature Flags
  FEATURES: {
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ERROR_TRACKING: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
    PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  },
} as const;

// Validate required environment variables
export const validateEnvironment = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize environment validation
if (import.meta.env.PROD) {
  validateEnvironment();
}