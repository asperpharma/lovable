import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  // Navigation
  home: string;
  collections: string;
  shopByCategory: string;
  brands: string;
  bestSellers: string;
  offers: string;
  contactUs: string;
  search: string;
  cart: string;
  shop: string;
  wishlist: string;
  account: string;
  login: string;
  logout: string;
  signUp: string;
  philosophy: string;
  skinConcerns: string;
  
  // Collections
  hairCare: string;
  bodyCare: string;
  makeUp: string;
  skincare: string;
  fragrances: string;
  toolsDevices: string;
  
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  discoverCollections: string;
  scroll: string;
  
  // Products
  addToBag: string;
  addToCart: string;
  addedToBag: string;
  premiumProduct: string;
  noImage: string;
  quantity: string;
  selectSize: string;
  selectColor: string;
  inStock: string;
  outOfStock: string;
  viewDetails: string;
  quickView: string;
  addToWishlist: string;
  removeFromWishlist: string;
  price: string;
  compareAtPrice: string;
  save: string;
  description: string;
  specifications: string;
  reviews: string;
  relatedProducts: string;
  youMayAlsoLike: string;
  
  // Cart
  shoppingCart: string;
  cartEmpty: string;
  itemsInCart: string;
  total: string;
  checkout: string;
  checkoutWithShopify: string;
  creatingCheckout: string;
  remove: string;
  continueShopping: string;
  subtotal: string;
  shipping: string;
  taxes: string;
  estimatedTotal: string;
  
  // Footer
  navigation: string;
  customerCare: string;
  legal: string;
  stayConnected: string;
  subscribeText: string;
  yourEmail: string;
  subscribe: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;
  accessibility: string;
  shippingInfo: string;
  returnsExchanges: string;
  orderTracking: string;
  faq: string;
  newArrivals: string;
  giftSets: string;
  allRightsReserved: string;
  beautyShop: string;
  
  // Pages
  exploreCollections: string;
  discoverBrands: string;
  topSellers: string;
  specialOffers: string;
  getInTouch: string;
  loadingProducts: string;
  noProductsFound: string;
  backToHome: string;
  productNotFound: string;
  
  // Auth
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  resetPassword: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  createAccount: string;
  signIn: string;
  signInWithEmail: string;
  passwordResetSent: string;
  checkYourEmail: string;
  passwordResetInstructions: string;
  backToSignIn: string;
  newPassword: string;
  confirmNewPassword: string;
  updatePassword: string;
  passwordUpdated: string;
  twoFactorAuth: string;
  enterCode: string;
  verify: string;
  resendCode: string;
  codeSent: string;
  invalidCredentials: string;
  accountCreated: string;
  passwordTooWeak: string;
  passwordsDontMatch: string;
  emailRequired: string;
  passwordRequired: string;
  invalidEmail: string;
  
  // Account
  myAccount: string;
  profile: string;
  orders: string;
  addresses: string;
  paymentMethods: string;
  preferences: string;
  security: string;
  twoFactorEnabled: string;
  twoFactorDisabled: string;
  enableTwoFactor: string;
  disableTwoFactor: string;
  changePassword: string;
  deleteAccount: string;
  editProfile: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  saveChanges: string;
  cancel: string;
  profileUpdated: string;
  
  // Contact
  contactForm: string;
  name: string;
  subject: string;
  message: string;
  sendMessage: string;
  messageSent: string;
  thankYouMessage: string;
  weWillRespond: string;
  address: string;
  phone: string;
  emailUs: string;
  followUs: string;
  businessHours: string;
  
  // Track Order
  trackOrder: string;
  orderNumber: string;
  enterOrderNumber: string;
  orderToken: string;
  enterOrderToken: string;
  track: string;
  orderStatus: string;
  orderDate: string;
  orderTotal: string;
  shippingAddress: string;
  orderItems: string;
  orderNotFound: string;
  invalidOrderNumber: string;
  
  // Wishlist
  myWishlist: string;
  wishlistEmpty: string;
  addItemsToWishlist: string;
  clearWishlist: string;
  moveToCart: string;
  
  // Admin - Bulk Upload
  bulkProductUpload: string;
  uploadProductData: string;
  autoCategorizeProducts: string;
  generateProductImages: string;
  reviewProducts: string;
  uploadToShopify: string;
  upload: string;
  categorize: string;
  generateImages: string;
  review: string;
  shopifyUpload: string;
  dropFileHere: string;
  chooseFile: string;
  processing: string;
  productsLoaded: string;
  from: string;
  rows: string;
  autoCategorize: string;
  products: string;
  startGeneratingImages: string;
  queueStatus: string;
  paused: string;
  completed: string;
  failed: string;
  queued: string;
  resume: string;
  pause: string;
  stop: string;
  retryFailed: string;
  continueToReview: string;
  regenerateFailedImages: string;
  continueToShopifyUpload: string;
  readyToUpload: string;
  productsWillBeCreated: string;
  uploadingToShopify: string;
  uploadAllProducts: string;
  retryUpload: string;
  uploadComplete: string;
  productsCreatedSuccessfully: string;
  productsFailed: string;
  failedProducts: string;
  run: string;
  uploadSingle: string;
  generatingImage: string;
  creatingProduct: string;
  of: string;
  showing: string;
  all: string;
  ready: string;
  
  // Admin - Orders
  adminOrders: string;
  orders: string;
  orderManagement: string;
  filterOrders: string;
  searchOrders: string;
  orderNumberCol: string;
  customer: string;
  date: string;
  status: string;
  totalCol: string;
  actions: string;
  viewDetails: string;
  assignDriver: string;
  exportOrders: string;
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  orderDetails: string;
  customerInfo: string;
  shippingInfo: string;
  paymentInfo: string;
  items: string;
  item: string;
  unitPrice: string;
  assignedDriver: string;
  assign: string;
  noDriverAssigned: string;
  assignedOn: string;
  orderPlacedOn: string;
  close: string;
  
  // Admin - Products
  manageProducts: string;
  productManagement: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  productName: string;
  category: string;
  brand: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  image: string;
  uploadImage: string;
  saveProduct: string;
  productSaved: string;
  productDeleted: string;
  areYouSure: string;
  deleteConfirm: string;
  
  // Admin - Audit Logs
  auditLogs: string;
  activityLog: string;
  filterLogs: string;
  searchLogs: string;
  dateRange: string;
  fromDate: string;
  toDate: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  driver: string;
  order: string;
  
  // Driver Dashboard
  driverDashboard: string;
  myDeliveries: string;
  assignedOrders: string;
  completedDeliveries: string;
  todaysDeliveries: string;
  markAsDelivered: string;
  markAsPickedUp: string;
  getDirections: string;
  callCustomer: string;
  whatsappCustomer: string;
  orderInTransit: string;
  orderDelivered: string;
  deliveryAddress: string;
  customerPhone: string;
  deliveryNotes: string;
  noOrdersAssigned: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  close: string;
  confirm: string;
  yes: string;
  no: string;
  ok: string;
  apply: string;
  reset: string;
  filter: string;
  sort: string;
  search: string;
  clear: string;
  select: string;
  all: string;
  none: string;
  next: string;
  previous: string;
  page: string;
  of: string;
  showing: string;
  results: string;
  noResults: string;
  tryAgain: string;
  refresh: string;
  download: string;
  upload: string;
  export: string;
  import: string;
  
  // Not Found
  pageNotFound: string;
  pageNotFoundDescription: string;
  goHome: string;
  
  // Philosophy
  ourPhilosophy: string;
  philosophyDescription: string;
  
  // Skin Concerns
  shopBySkinConcern: string;
  selectYourConcern: string;
  acne: string;
  aging: string;
  dryness: string;
  oiliness: string;
  sensitivity: string;
  darkSpots: string;
  wrinkles: string;
  dullness: string;
  
  // Brands
  allBrands: string;
  featuredBrands: string;
  viewBrand: string;
  exploreBrand: string;
  
  // Collections
  allCollections: string;
  viewCollection: string;
  collectionProducts: string;
  
  // Offers
  specialOffersTitle: string;
  limitedTimeOffer: string;
  shopNow: string;
  validUntil: string;
  
  // Best Sellers
  bestSellersTitle: string;
  topRated: string;
  mostPopular: string;
  
  // Shop
  shopAll: string;
  filters: string;
  sortBy: string;
  priceLowToHigh: string;
  priceHighToLow: string;
  newest: string;
  oldest: string;
  nameAZ: string;
  nameZA: string;
  clearFilters: string;
    noProductsMatch: string;
    adjustFilters: string;
    supportsArabicColumns: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: 'Home',
    collections: 'Collections',
    shopByCategory: 'Shop By Category',
    brands: 'Brands',
    bestSellers: 'Best Sellers',
    offers: 'Offers',
    contactUs: 'Contact Us',
    search: 'Search',
    cart: 'Cart',
    shop: 'Shop',
    wishlist: 'Wishlist',
    account: 'Account',
    login: 'Login',
    logout: 'Logout',
    signUp: 'Sign Up',
    philosophy: 'Philosophy',
    skinConcerns: 'Skin Concerns',
    
    // Collections
    hairCare: 'Hair Care',
    bodyCare: 'Body Care',
    makeUp: 'Make Up',
    skincare: 'Skincare',
    fragrances: 'Fragrances',
    toolsDevices: 'Tools & Devices',
    
    // Hero
    heroTitle: 'Unbox Pure Indulgence',
    heroSubtitle: 'Discover our curated collection of premium beauty boxes, crafted with the finest ingredients for discerning individuals.',
    discoverCollections: 'Discover Collections',
    scroll: 'Scroll',
    
    // Products
    addToBag: 'Add to Bag',
    addToCart: 'Add to Cart',
    addedToBag: 'Added to bag',
    premiumProduct: 'Premium beauty product',
    noImage: 'No image',
    quantity: 'Quantity',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    viewDetails: 'View Details',
    quickView: 'Quick View',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    price: 'Price',
    compareAtPrice: 'Compare at Price',
    save: 'Save',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    relatedProducts: 'Related Products',
    youMayAlsoLike: 'You May Also Like',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    itemsInCart: 'items in your cart',
    total: 'Total',
    checkout: 'Checkout',
    checkoutWithShopify: 'Checkout with Shopify',
    creatingCheckout: 'Creating Checkout...',
    remove: 'Remove',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    taxes: 'Taxes',
    estimatedTotal: 'Estimated Total',
    
    // Footer
    navigation: 'Navigation',
    customerCare: 'Customer Care',
    legal: 'Legal',
    stayConnected: 'Stay Connected',
    subscribeText: 'Subscribe to receive exclusive offers and updates.',
    yourEmail: 'Your email',
    subscribe: 'Subscribe',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    accessibility: 'Accessibility',
    shippingInfo: 'Shipping Info',
    returnsExchanges: 'Returns & Exchanges',
    orderTracking: 'Order Tracking',
    faq: 'FAQ',
    newArrivals: 'New Arrivals',
    giftSets: 'Gift Sets',
    allRightsReserved: 'All rights reserved.',
    beautyShop: 'Beauty Shop',
    
    // Pages
    exploreCollections: 'Explore Collections',
    discoverBrands: 'Discover Brands',
    topSellers: 'Top Sellers',
    specialOffers: 'Special Offers',
    getInTouch: 'Get In Touch',
    loadingProducts: 'Loading products...',
    noProductsFound: 'No products found',
    backToHome: 'Back to Home',
    productNotFound: 'Product not found',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    rememberMe: 'Remember me',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    signInWithEmail: 'Sign in with Email',
    passwordResetSent: 'Password reset email sent',
    checkYourEmail: 'Check your email for reset instructions',
    passwordResetInstructions: 'Enter your email and we'll send you instructions to reset your password',
    backToSignIn: 'Back to Sign In',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    passwordUpdated: 'Password updated successfully',
    twoFactorAuth: 'Two-Factor Authentication',
    enterCode: 'Enter verification code',
    verify: 'Verify',
    resendCode: 'Resend Code',
    codeSent: 'Verification code sent',
    invalidCredentials: 'Invalid email or password',
    accountCreated: 'Account created successfully',
    passwordTooWeak: 'Password is too weak',
    passwordsDontMatch: 'Passwords do not match',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    invalidEmail: 'Invalid email address',
    
    // Account
    myAccount: 'My Account',
    profile: 'Profile',
    orders: 'Orders',
    addresses: 'Addresses',
    paymentMethods: 'Payment Methods',
    preferences: 'Preferences',
    security: 'Security',
    twoFactorEnabled: 'Two-Factor Authentication Enabled',
    twoFactorDisabled: 'Two-Factor Authentication Disabled',
    enableTwoFactor: 'Enable Two-Factor Authentication',
    disableTwoFactor: 'Disable Two-Factor Authentication',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    editProfile: 'Edit Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    profileUpdated: 'Profile updated successfully',
    
    // Contact
    contactForm: 'Contact Form',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',
    sendMessage: 'Send Message',
    messageSent: 'Message sent successfully',
    thankYouMessage: 'Thank you for contacting us!',
    weWillRespond: 'We will respond to your message as soon as possible.',
    address: 'Address',
    phone: 'Phone',
    emailUs: 'Email Us',
    followUs: 'Follow Us',
    businessHours: 'Business Hours',
    
    // Track Order
    trackOrder: 'Track Order',
    orderNumber: 'Order Number',
    enterOrderNumber: 'Enter Order Number',
    orderToken: 'Order Token',
    enterOrderToken: 'Enter Order Token',
    track: 'Track',
    orderStatus: 'Order Status',
    orderDate: 'Order Date',
    orderTotal: 'Order Total',
    shippingAddress: 'Shipping Address',
    orderItems: 'Order Items',
    orderNotFound: 'Order not found',
    invalidOrderNumber: 'Invalid order number or token',
    
    // Wishlist
    myWishlist: 'My Wishlist',
    wishlistEmpty: 'Your wishlist is empty',
    addItemsToWishlist: 'Add items to your wishlist',
    clearWishlist: 'Clear Wishlist',
    moveToCart: 'Move to Cart',
    
    // Admin - Bulk Upload
    bulkProductUpload: 'Bulk Product Upload',
    uploadProductData: 'Upload Product Data',
    autoCategorizeProducts: 'Auto-Categorize Products',
    generateProductImages: 'Generate Product Images',
    reviewProducts: 'Review Products',
    uploadToShopify: 'Upload to Shopify',
    upload: 'Upload',
    categorize: 'Categorize',
    generateImages: 'Generate Images',
    review: 'Review',
    shopifyUpload: 'Shopify Upload',
    dropFileHere: 'Drop your Excel or CSV file here',
    chooseFile: 'Choose File',
    processing: 'Processing...',
    productsLoaded: 'Products Loaded',
    from: 'From',
    rows: 'rows',
    autoCategorize: 'Auto-Categorize',
    products: 'Products',
    startGeneratingImages: 'Start Generating Images',
    queueStatus: 'Queue Status',
    paused: 'Paused',
    completed: 'Completed',
    failed: 'Failed',
    queued: 'Queued',
    resume: 'Resume',
    pause: 'Pause',
    stop: 'Stop',
    retryFailed: 'Retry Failed',
    continueToReview: 'Continue to Review',
    regenerateFailedImages: 'Regenerate Failed Images',
    continueToShopifyUpload: 'Continue to Shopify Upload',
    readyToUpload: 'Ready to upload',
    productsWillBeCreated: 'Products will be created in your Shopify store',
    uploadingToShopify: 'Uploading to Shopify...',
    uploadAllProducts: 'Upload All Products to Shopify',
    retryUpload: 'Retry Upload',
    uploadComplete: 'Upload Complete!',
    productsCreatedSuccessfully: 'products created successfully',
    productsFailed: 'products failed to upload',
    failedProducts: 'Failed Products',
    run: 'Run',
    uploadSingle: 'Upload',
    generatingImage: 'Generating image for',
    creatingProduct: 'Creating product',
    of: 'of',
    showing: 'Showing',
    all: 'All',
    ready: 'Ready',
    
    // Admin - Orders
    adminOrders: 'Admin Orders',
    orders: 'Orders',
    orderManagement: 'Order Management',
    filterOrders: 'Filter Orders',
    searchOrders: 'Search Orders',
    orderNumberCol: 'Order Number',
    customer: 'Customer',
    date: 'Date',
    status: 'Status',
    totalCol: 'Total',
    actions: 'Actions',
    viewDetails: 'View Details',
    assignDriver: 'Assign Driver',
    exportOrders: 'Export Orders',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    orderDetails: 'Order Details',
    customerInfo: 'Customer Information',
    shippingInfo: 'Shipping Information',
    paymentInfo: 'Payment Information',
    items: 'Items',
    item: 'Item',
    unitPrice: 'Unit Price',
    assignedDriver: 'Assigned Driver',
    assign: 'Assign',
    noDriverAssigned: 'No driver assigned',
    assignedOn: 'Assigned on',
    orderPlacedOn: 'Order placed on',
    close: 'Close',
    
    // Admin - Products
    manageProducts: 'Manage Products',
    productManagement: 'Product Management',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productName: 'Product Name',
    category: 'Category',
    brand: 'Brand',
    costPrice: 'Cost Price',
    sellingPrice: 'Selling Price',
    stock: 'Stock',
    image: 'Image',
    uploadImage: 'Upload Image',
    saveProduct: 'Save Product',
    productSaved: 'Product saved successfully',
    productDeleted: 'Product deleted successfully',
    areYouSure: 'Are you sure?',
    deleteConfirm: 'This action cannot be undone',
    
    // Admin - Audit Logs
    auditLogs: 'Audit Logs',
    activityLog: 'Activity Log',
    filterLogs: 'Filter Logs',
    searchLogs: 'Search Logs',
    dateRange: 'Date Range',
    fromDate: 'From Date',
    toDate: 'To Date',
    action: 'Action',
    user: 'User',
    timestamp: 'Timestamp',
    details: 'Details',
    driver: 'Driver',
    order: 'Order',
    
    // Driver Dashboard
    driverDashboard: 'Driver Dashboard',
    myDeliveries: 'My Deliveries',
    assignedOrders: 'Assigned Orders',
    completedDeliveries: 'Completed Deliveries',
    todaysDeliveries: "Today's Deliveries",
    markAsDelivered: 'Mark as Delivered',
    markAsPickedUp: 'Mark as Picked Up',
    getDirections: 'Get Directions',
    callCustomer: 'Call Customer',
    whatsappCustomer: 'WhatsApp Customer',
    orderInTransit: 'Order in Transit',
    orderDelivered: 'Order Delivered',
    deliveryAddress: 'Delivery Address',
    customerPhone: 'Customer Phone',
    deliveryNotes: 'Delivery Notes',
    noOrdersAssigned: 'No orders assigned',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    apply: 'Apply',
    reset: 'Reset',
    filter: 'Filter',
    sort: 'Sort',
    search: 'Search',
    clear: 'Clear',
    select: 'Select',
    all: 'All',
    none: 'None',
    next: 'Next',
    previous: 'Previous',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    results: 'results',
    noResults: 'No results found',
    tryAgain: 'Try Again',
    refresh: 'Refresh',
    download: 'Download',
    upload: 'Upload',
    export: 'Export',
    import: 'Import',
    
    // Not Found
    pageNotFound: 'Page Not Found',
    pageNotFoundDescription: 'The page you are looking for does not exist.',
    goHome: 'Go Home',
    
    // Philosophy
    ourPhilosophy: 'Our Philosophy',
    philosophyDescription: 'Discover our commitment to beauty and wellness',
    
    // Skin Concerns
    shopBySkinConcern: 'Shop By Skin Concern',
    selectYourConcern: 'Select Your Concern',
    acne: 'Acne',
    aging: 'Aging',
    dryness: 'Dryness',
    oiliness: 'Oiliness',
    sensitivity: 'Sensitivity',
    darkSpots: 'Dark Spots',
    wrinkles: 'Wrinkles',
    dullness: 'Dullness',
    
    // Brands
    allBrands: 'All Brands',
    featuredBrands: 'Featured Brands',
    viewBrand: 'View Brand',
    exploreBrand: 'Explore Brand',
    
    // Collections
    allCollections: 'All Collections',
    viewCollection: 'View Collection',
    collectionProducts: 'Collection Products',
    
    // Offers
    specialOffersTitle: 'Special Offers',
    limitedTimeOffer: 'Limited Time Offer',
    shopNow: 'Shop Now',
    validUntil: 'Valid Until',
    
    // Best Sellers
    bestSellersTitle: 'Best Sellers',
    topRated: 'Top Rated',
    mostPopular: 'Most Popular',
    
    // Shop
    shopAll: 'Shop All',
    filters: 'Filters',
    sortBy: 'Sort By',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    newest: 'Newest',
    oldest: 'Oldest',
    nameAZ: 'Name: A-Z',
    nameZA: 'Name: Z-A',
    clearFilters: 'Clear Filters',
    noProductsMatch: 'No products match your filters',
    adjustFilters: 'Try adjusting your filters',
    supportsArabicColumns: 'Supports Arabic columns: الرمز، اسم المادة، سعر البيع، الكلفة',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    collections: 'المجموعات',
    shopByCategory: 'تسوق حسب الفئة',
    brands: 'العلامات التجارية',
    bestSellers: 'الأكثر مبيعاً',
    offers: 'العروض',
    contactUs: 'اتصل بنا',
    search: 'بحث',
    cart: 'السلة',
    shop: 'المتجر',
    wishlist: 'قائمة الأمنيات',
    account: 'الحساب',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    signUp: 'إنشاء حساب',
    philosophy: 'فلسفتنا',
    skinConcerns: 'مشاكل البشرة',
    
    // Collections
    hairCare: 'العناية بالشعر',
    bodyCare: 'العناية بالجسم',
    makeUp: 'المكياج',
    skincare: 'العناية بالبشرة',
    fragrances: 'العطور',
    toolsDevices: 'الأدوات والأجهزة',
    
    // Hero
    heroTitle: 'افتح صندوق الفخامة',
    heroSubtitle: 'اكتشف مجموعتنا المختارة من صناديق التجميل الفاخرة، المصنوعة بأجود المكونات للأفراد المميزين.',
    discoverCollections: 'اكتشف المجموعات',
    scroll: 'مرر',
    
    // Products
    addToBag: 'أضف إلى الحقيبة',
    addToCart: 'أضف إلى السلة',
    addedToBag: 'تمت الإضافة',
    premiumProduct: 'منتج تجميل فاخر',
    noImage: 'لا توجد صورة',
    quantity: 'الكمية',
    selectSize: 'اختر الحجم',
    selectColor: 'اختر اللون',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    viewDetails: 'عرض التفاصيل',
    quickView: 'عرض سريع',
    addToWishlist: 'أضف إلى قائمة الأمنيات',
    removeFromWishlist: 'إزالة من قائمة الأمنيات',
    price: 'السعر',
    compareAtPrice: 'السعر المقارن',
    save: 'وفر',
    description: 'الوصف',
    specifications: 'المواصفات',
    reviews: 'التقييمات',
    relatedProducts: 'منتجات ذات صلة',
    youMayAlsoLike: 'قد يعجبك أيضاً',
    
    // Cart
    shoppingCart: 'سلة التسوق',
    cartEmpty: 'سلتك فارغة',
    itemsInCart: 'منتجات في سلتك',
    total: 'المجموع',
    checkout: 'الدفع',
    checkoutWithShopify: 'الدفع عبر شوبيفاي',
    creatingCheckout: 'جاري إنشاء الطلب...',
    remove: 'إزالة',
    continueShopping: 'متابعة التسوق',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    taxes: 'الضرائب',
    estimatedTotal: 'المجموع التقديري',
    
    // Footer
    navigation: 'التنقل',
    customerCare: 'خدمة العملاء',
    legal: 'قانوني',
    stayConnected: 'ابقَ على تواصل',
    subscribeText: 'اشترك لتلقي العروض الحصرية والتحديثات.',
    yourEmail: 'بريدك الإلكتروني',
    subscribe: 'اشترك',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    cookiePolicy: 'سياسة ملفات تعريف الارتباط',
    accessibility: 'إمكانية الوصول',
    shippingInfo: 'معلومات الشحن',
    returnsExchanges: 'الإرجاع والاستبدال',
    orderTracking: 'تتبع الطلب',
    faq: 'الأسئلة الشائعة',
    newArrivals: 'وصل حديثاً',
    giftSets: 'مجموعات الهدايا',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    beautyShop: 'متجر التجميل',
    
    // Pages
    exploreCollections: 'استكشف المجموعات',
    discoverBrands: 'اكتشف العلامات التجارية',
    topSellers: 'الأكثر مبيعاً',
    specialOffers: 'عروض خاصة',
    getInTouch: 'تواصل معنا',
    loadingProducts: 'جاري تحميل المنتجات...',
    noProductsFound: 'لم يتم العثور على منتجات',
    backToHome: 'العودة للرئيسية',
    productNotFound: 'المنتج غير موجود',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    rememberMe: 'تذكرني',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    createAccount: 'إنشاء حساب',
    signIn: 'تسجيل الدخول',
    signInWithEmail: 'تسجيل الدخول بالبريد الإلكتروني',
    passwordResetSent: 'تم إرسال بريد إعادة تعيين كلمة المرور',
    checkYourEmail: 'تحقق من بريدك الإلكتروني للحصول على تعليمات إعادة التعيين',
    passwordResetInstructions: 'أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة تعيين كلمة المرور',
    backToSignIn: 'العودة لتسجيل الدخول',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    passwordUpdated: 'تم تحديث كلمة المرور بنجاح',
    twoFactorAuth: 'المصادقة الثنائية',
    enterCode: 'أدخل رمز التحقق',
    verify: 'تحقق',
    resendCode: 'إعادة إرسال الرمز',
    codeSent: 'تم إرسال رمز التحقق',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    accountCreated: 'تم إنشاء الحساب بنجاح',
    passwordTooWeak: 'كلمة المرور ضعيفة جداً',
    passwordsDontMatch: 'كلمات المرور غير متطابقة',
    emailRequired: 'البريد الإلكتروني مطلوب',
    passwordRequired: 'كلمة المرور مطلوبة',
    invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
    
    // Account
    myAccount: 'حسابي',
    profile: 'الملف الشخصي',
    orders: 'الطلبات',
    addresses: 'العناوين',
    paymentMethods: 'طرق الدفع',
    preferences: 'التفضيلات',
    security: 'الأمان',
    twoFactorEnabled: 'تم تفعيل المصادقة الثنائية',
    twoFactorDisabled: 'تم تعطيل المصادقة الثنائية',
    enableTwoFactor: 'تفعيل المصادقة الثنائية',
    disableTwoFactor: 'تعطيل المصادقة الثنائية',
    changePassword: 'تغيير كلمة المرور',
    deleteAccount: 'حذف الحساب',
    editProfile: 'تعديل الملف الشخصي',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phoneNumber: 'رقم الهاتف',
    dateOfBirth: 'تاريخ الميلاد',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    
    // Contact
    contactForm: 'نموذج الاتصال',
    name: 'الاسم',
    subject: 'الموضوع',
    message: 'الرسالة',
    sendMessage: 'إرسال الرسالة',
    messageSent: 'تم إرسال الرسالة بنجاح',
    thankYouMessage: 'شكراً لتواصلك معنا!',
    weWillRespond: 'سنرد على رسالتك في أقرب وقت ممكن.',
    address: 'العنوان',
    phone: 'الهاتف',
    emailUs: 'راسلنا',
    followUs: 'تابعنا',
    businessHours: 'ساعات العمل',
    
    // Track Order
    trackOrder: 'تتبع الطلب',
    orderNumber: 'رقم الطلب',
    enterOrderNumber: 'أدخل رقم الطلب',
    orderToken: 'رمز الطلب',
    enterOrderToken: 'أدخل رمز الطلب',
    track: 'تتبع',
    orderStatus: 'حالة الطلب',
    orderDate: 'تاريخ الطلب',
    orderTotal: 'إجمالي الطلب',
    shippingAddress: 'عنوان الشحن',
    orderItems: 'عناصر الطلب',
    orderNotFound: 'الطلب غير موجود',
    invalidOrderNumber: 'رقم الطلب أو الرمز غير صحيح',
    
    // Wishlist
    myWishlist: 'قائمة أمنياتي',
    wishlistEmpty: 'قائمة أمنياتك فارغة',
    addItemsToWishlist: 'أضف عناصر إلى قائمة أمنياتك',
    clearWishlist: 'مسح قائمة الأمنيات',
    moveToCart: 'نقل إلى السلة',
    
    // Admin - Bulk Upload
    bulkProductUpload: 'رفع المنتجات بالجملة',
    uploadProductData: 'رفع بيانات المنتجات',
    autoCategorizeProducts: 'تصنيف المنتجات تلقائياً',
    generateProductImages: 'إنشاء صور المنتجات',
    reviewProducts: 'مراجعة المنتجات',
    uploadToShopify: 'رفع إلى شوبيفاي',
    upload: 'رفع',
    categorize: 'تصنيف',
    generateImages: 'إنشاء الصور',
    review: 'مراجعة',
    shopifyUpload: 'رفع شوبيفاي',
    dropFileHere: 'أسقط ملف Excel أو CSV هنا',
    chooseFile: 'اختر ملف',
    processing: 'جاري المعالجة...',
    productsLoaded: 'تم تحميل المنتجات',
    from: 'من',
    rows: 'صفوف',
    autoCategorize: 'تصنيف تلقائي',
    products: 'المنتجات',
    startGeneratingImages: 'بدء إنشاء الصور',
    queueStatus: 'حالة الطابور',
    paused: 'متوقف',
    completed: 'مكتمل',
    failed: 'فشل',
    queued: 'في الانتظار',
    resume: 'استئناف',
    pause: 'إيقاف',
    stop: 'إيقاف',
    retryFailed: 'إعادة المحاولة للفاشلة',
    continueToReview: 'المتابعة إلى المراجعة',
    regenerateFailedImages: 'إعادة إنشاء الصور الفاشلة',
    continueToShopifyUpload: 'المتابعة إلى رفع شوبيفاي',
    readyToUpload: 'جاهز للرفع',
    productsWillBeCreated: 'سيتم إنشاء المنتجات في متجر شوبيفاي الخاص بك',
    uploadingToShopify: 'جاري الرفع إلى شوبيفاي...',
    uploadAllProducts: 'رفع جميع المنتجات إلى شوبيفاي',
    retryUpload: 'إعادة المحاولة',
    uploadComplete: 'اكتمل الرفع!',
    productsCreatedSuccessfully: 'منتج تم إنشاؤه بنجاح',
    productsFailed: 'منتج فشل في الرفع',
    failedProducts: 'المنتجات الفاشلة',
    run: 'تشغيل',
    uploadSingle: 'رفع',
    generatingImage: 'جاري إنشاء الصورة لـ',
    creatingProduct: 'جاري إنشاء المنتج',
    of: 'من',
    showing: 'عرض',
    all: 'الكل',
    ready: 'جاهز',
    
    // Admin - Orders
    adminOrders: 'إدارة الطلبات',
    orders: 'الطلبات',
    orderManagement: 'إدارة الطلبات',
    filterOrders: 'تصفية الطلبات',
    searchOrders: 'بحث في الطلبات',
    orderNumberCol: 'رقم الطلب',
    customer: 'العميل',
    date: 'التاريخ',
    status: 'الحالة',
    totalCol: 'الإجمالي',
    actions: 'الإجراءات',
    viewDetails: 'عرض التفاصيل',
    assignDriver: 'تعيين سائق',
    exportOrders: 'تصدير الطلبات',
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغى',
    orderDetails: 'تفاصيل الطلب',
    customerInfo: 'معلومات العميل',
    shippingInfo: 'معلومات الشحن',
    paymentInfo: 'معلومات الدفع',
    items: 'العناصر',
    item: 'عنصر',
    unitPrice: 'سعر الوحدة',
    assignedDriver: 'السائق المعين',
    assign: 'تعيين',
    noDriverAssigned: 'لم يتم تعيين سائق',
    assignedOn: 'تم التعيين في',
    orderPlacedOn: 'تم تقديم الطلب في',
    close: 'إغلاق',
    
    // Admin - Products
    manageProducts: 'إدارة المنتجات',
    productManagement: 'إدارة المنتجات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل منتج',
    deleteProduct: 'حذف منتج',
    productName: 'اسم المنتج',
    category: 'الفئة',
    brand: 'العلامة التجارية',
    costPrice: 'سعر التكلفة',
    sellingPrice: 'سعر البيع',
    stock: 'المخزون',
    image: 'الصورة',
    uploadImage: 'رفع صورة',
    saveProduct: 'حفظ المنتج',
    productSaved: 'تم حفظ المنتج بنجاح',
    productDeleted: 'تم حذف المنتج بنجاح',
    areYouSure: 'هل أنت متأكد؟',
    deleteConfirm: 'لا يمكن التراجع عن هذا الإجراء',
    
    // Admin - Audit Logs
    auditLogs: 'سجلات التدقيق',
    activityLog: 'سجل النشاط',
    filterLogs: 'تصفية السجلات',
    searchLogs: 'بحث في السجلات',
    dateRange: 'نطاق التاريخ',
    fromDate: 'من تاريخ',
    toDate: 'إلى تاريخ',
    action: 'الإجراء',
    user: 'المستخدم',
    timestamp: 'الطابع الزمني',
    details: 'التفاصيل',
    driver: 'السائق',
    order: 'الطلب',
    
    // Driver Dashboard
    driverDashboard: 'لوحة تحكم السائق',
    myDeliveries: 'توصيلاتي',
    assignedOrders: 'الطلبات المعينة',
    completedDeliveries: 'التوصيلات المكتملة',
    todaysDeliveries: 'توصيلات اليوم',
    markAsDelivered: 'تحديد كمُسلم',
    markAsPickedUp: 'تحديد كمُستلم',
    getDirections: 'الحصول على الاتجاهات',
    callCustomer: 'اتصال بالعميل',
    whatsappCustomer: 'واتساب العميل',
    orderInTransit: 'الطلب قيد النقل',
    orderDelivered: 'تم تسليم الطلب',
    deliveryAddress: 'عنوان التسليم',
    customerPhone: 'هاتف العميل',
    deliveryNotes: 'ملاحظات التسليم',
    noOrdersAssigned: 'لا توجد طلبات معينة',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    close: 'إغلاق',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    apply: 'تطبيق',
    reset: 'إعادة تعيين',
    filter: 'تصفية',
    sort: 'ترتيب',
    search: 'بحث',
    clear: 'مسح',
    select: 'اختر',
    all: 'الكل',
    none: 'لا شيء',
    next: 'التالي',
    previous: 'السابق',
    page: 'الصفحة',
    of: 'من',
    showing: 'عرض',
    results: 'نتائج',
    noResults: 'لم يتم العثور على نتائج',
    tryAgain: 'حاول مرة أخرى',
    refresh: 'تحديث',
    download: 'تحميل',
    upload: 'رفع',
    export: 'تصدير',
    import: 'استيراد',
    
    // Not Found
    pageNotFound: 'الصفحة غير موجودة',
    pageNotFoundDescription: 'الصفحة التي تبحث عنها غير موجودة.',
    goHome: 'العودة للرئيسية',
    
    // Philosophy
    ourPhilosophy: 'فلسفتنا',
    philosophyDescription: 'اكتشف التزامنا بالجمال والعافية',
    
    // Skin Concerns
    shopBySkinConcern: 'تسوق حسب مشكلة البشرة',
    selectYourConcern: 'اختر مشكلتك',
    acne: 'حب الشباب',
    aging: 'الشيخوخة',
    dryness: 'الجفاف',
    oiliness: 'الدهنية',
    sensitivity: 'الحساسية',
    darkSpots: 'البقع الداكنة',
    wrinkles: 'التجاعيد',
    dullness: 'البشرة الباهتة',
    
    // Brands
    allBrands: 'جميع العلامات التجارية',
    featuredBrands: 'العلامات التجارية المميزة',
    viewBrand: 'عرض العلامة التجارية',
    exploreBrand: 'استكشف العلامة التجارية',
    
    // Collections
    allCollections: 'جميع المجموعات',
    viewCollection: 'عرض المجموعة',
    collectionProducts: 'منتجات المجموعة',
    
    // Offers
    specialOffersTitle: 'عروض خاصة',
    limitedTimeOffer: 'عرض لفترة محدودة',
    shopNow: 'تسوق الآن',
    validUntil: 'صالح حتى',
    
    // Best Sellers
    bestSellersTitle: 'الأكثر مبيعاً',
    topRated: 'الأعلى تقييماً',
    mostPopular: 'الأكثر شعبية',
    
    // Shop
    shopAll: 'تسوق الكل',
    filters: 'المرشحات',
    sortBy: 'ترتيب حسب',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    nameAZ: 'الاسم: أ-ي',
    nameZA: 'الاسم: ي-أ',
    clearFilters: 'مسح المرشحات',
    noProductsMatch: 'لا توجد منتجات تطابق مرشحاتك',
    adjustFilters: 'حاول تعديل مرشحاتك',
    supportsArabicColumns: 'يدعم الأعمدة العربية: الرمز، اسم المادة، سعر البيع، الكلفة',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('asper-language');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('asper-language', lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
