import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Category mapping based on product keywords
const CATEGORY_KEYWORDS = {
  "Skin Care": [
    "cream",
    "lotion",
    "serum",
    "moisturizer",
    "cleanser",
    "toner",
    "mask",
    "scrub",
    "sunscreen",
    "spf",
    "anti-aging",
    "wrinkle",
    "acne",
    "facial",
    "face",
    "skin",
    "كريم",
    "مرطب",
    "واقي",
    "بشرة",
    "وجه",
  ],
  "Hair Care": [
    "shampoo",
    "conditioner",
    "hair",
    "oil",
    "treatment",
    "mask",
    "spray",
    "شعر",
    "شامبو",
    "بلسم",
    "زيت",
  ],
  "Body Care": [
    "body lotion",
    "body wash",
    "soap",
    "hand cream",
    "foot",
    "deodorant",
    "جسم",
    "صابون",
    "يد",
  ],
  "Make Up": [
    "mascara",
    "lipstick",
    "foundation",
    "blush",
    "eyeshadow",
    "liner",
    "makeup",
    "nail",
    "polish",
    "cosmetic",
    "مكياج",
    "أحمر",
    "ماسكارا",
  ],
  "Fragrances": [
    "perfume",
    "cologne",
    "fragrance",
    "eau de",
    "spray",
    "scent",
    "عطر",
    "كولونيا",
  ],
  "Health & Supplements": [
    "vitamin",
    "supplement",
    "capsule",
    "tablet",
    "mineral",
    "omega",
    "probiotic",
    "فيتامين",
    "كبسولة",
    "مكمل",
  ],
  "Medical Supplies": [
    "cannula",
    "syringe",
    "glove",
    "bandage",
    "gauze",
    "medical",
    "surgical",
    "oximeter",
    "crutch",
    "طبي",
    "عكاز",
  ],
  "Personal Care": [
    "toothbrush",
    "toothpaste",
    "brush",
    "comb",
    "razor",
    "cotton",
    "فرشاة",
    "مشط",
  ],
};

// Categorize product based on name
function categorizeProduct(productName: string): string {
  const nameLower = productName.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return "Uncategorized";
}

// Extract brand from product name
function extractBrand(productName: string): string {
  const knownBrands = [
    "Palmer's",
    "Palmers",
    "Eucerin",
    "Vichy",
    "Bioderma",
    "Cetaphil",
    "Jergens",
    "Old Spice",
    "Speed Stick",
    "Sundown",
    "Jamieson",
    "Arm & Hammer",
    "Secret",
    "Teen Spirit",
    "SVR",
    "Bourjois",
    "Mavala",
    "Isadora",
    "Essence",
    "Bioten",
    "Olaplex",
  ];

  const nameLower = productName.toLowerCase();

  for (const brand of knownBrands) {
    if (nameLower.includes(brand.toLowerCase())) {
      return brand.replace("'s", "'s").replace("Palmers", "Palmer's");
    }
  }

  // Try to extract first word as potential brand
  const firstWord = productName.split(/[\s-]/)[0];
  if (firstWord.length > 2 && /^[A-Z]/.test(firstWord)) {
    return firstWord;
  }

  return "Generic";
}

// Generate image prompt based on product name and category
function generateImagePrompt(productName: string, category: string): string {
  const basePrompt =
    `Ultra high resolution product photography of ${productName}. `;

  const categoryStyles: Record<string, string> = {
    "Skin Care":
      "Elegant skincare product bottle/jar on minimalist marble surface with soft natural lighting, premium cosmetic packaging, clean white background with subtle shadows. Professional beauty product photography.",
    "Hair Care":
      "Professional hair care product bottle on sleek surface with subtle reflections, premium salon-quality packaging, clean studio lighting. Beauty product commercial photography.",
    "Body Care":
      "Luxurious body care product with elegant packaging, soft natural elements like cotton or leaves, warm ambient lighting. Premium personal care product photography.",
    "Make Up":
      "Glamorous makeup product with sophisticated packaging, dramatic lighting with rich colors, professional cosmetic photography style. Luxury beauty brand aesthetic.",
    "Fragrances":
      "Elegant perfume bottle with artistic lighting, glass reflections, sophisticated luxury fragrance photography. High-end perfumery aesthetic.",
    "Health & Supplements":
      "Clean vitamin/supplement bottle with professional pharmaceutical styling, white background, crisp clinical photography. Health product commercial style.",
    "Medical Supplies":
      "Clean medical product on white background, professional healthcare product photography, clinical and sterile appearance.",
    "Personal Care":
      "Fresh personal care product with clean styling, bright natural lighting, everyday hygiene product photography.",
  };

  return basePrompt +
    (categoryStyles[category] || categoryStyles["Personal Care"]);
}

interface ProductData {
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
}

interface ProcessedProduct {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  costPrice: number;
  imagePrompt: string;
  imageUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ==================== AUTHENTICATION ====================
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client for auth verification (uses user's token)
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user's token
    const { data: { user }, error: userError } = await supabaseAuth.auth
      .getUser();

    if (userError || !user) {
      console.error("Token verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    // ==================== AUTHORIZATION (Admin Check) ====================
    // Use service role client to check user roles (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleError && roleError.code !== "PGRST116") {
      // PGRST116 means no rows found - that's expected for non-admin users
      console.error("Role check error:", roleError);
    }

    const isAdmin = roleData?.role === "admin";
    if (!isAdmin) {
      console.error("User is not an admin:", userId);
      return new Response(
        JSON.stringify({
          error: "Forbidden: Admin access required for bulk operations",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Admin access verified for user:", userId);

    // ==================== PROCESS REQUEST ====================
    const requestData = await req.json();
    const { action } = requestData;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Service role client for storage and other operations
    const supabase = supabaseAdmin;

    // Shopify Admin API configuration
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const SHOPIFY_STORE_DOMAIN = "lovable-project-milns.myshopify.com";
    const SHOPIFY_API_VERSION = "2025-01";

    if (action === "categorize") {
      // Categorize and prepare products from Excel data
      const { products } = requestData;
      const processedProducts: ProcessedProduct[] = products.map(
        (product: ProductData) => {
          const category = categorizeProduct(product.name);
          const brand = extractBrand(product.name);
          const imagePrompt = generateImagePrompt(product.name, category);

          return {
            sku: product.sku,
            name: product.name,
            category,
            brand,
            price: product.sellingPrice,
            costPrice: product.costPrice,
            imagePrompt,
            status: "pending" as const,
          };
        },
      );

      // Get category distribution for summary
      const categoryCount: Record<string, number> = {};
      const brandCount: Record<string, number> = {};

      processedProducts.forEach((p) => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        brandCount[p.brand] = (brandCount[p.brand] || 0) + 1;
      });

      return new Response(
        JSON.stringify({
          success: true,
          products: processedProducts,
          summary: {
            total: processedProducts.length,
            categories: categoryCount,
            brands: brandCount,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "generate-image") {
      // Generate image for a single product using Lovable AI
      const { productName, category, imagePrompt } = requestData;

      console.log(`Generating image for: ${productName}`);

      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: imagePrompt,
              },
            ],
            modalities: ["image", "text"],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image generation failed:", response.status, errorText);

        if (response.status === 429) {
          return new Response(
            JSON.stringify({
              error: "Rate limited. Please wait before generating more images.",
              retryAfter: 60,
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        throw new Error(`Image generation failed: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error("No image returned from AI");
      }

      // Upload to Supabase Storage
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Uint8Array.from(
        atob(base64Data),
        (c) => c.charCodeAt(0),
      );
      const fileName = `products/${Date.now()}-${
        productName.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 50)
      }.png`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        // Return base64 as fallback
        return new Response(
          JSON.stringify({ success: true, imageUrl, isBase64: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return new Response(
        JSON.stringify({ success: true, imageUrl: publicUrl.publicUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "create-shopify-product") {
      // Create a product in Shopify using Admin GraphQL API
      const { product } = requestData;

      if (!SHOPIFY_ACCESS_TOKEN) {
        throw new Error("SHOPIFY_ACCESS_TOKEN is not configured.");
      }

      console.log(`Creating Shopify product: ${product.title}`);

      // Generate SEO-friendly handle from title
      const generateHandle = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 255);
      };

      // Generate meta description if not provided
      const metaDescription = product.meta_description ||
        (product.description
          ? product.description.replace(/<[^>]*>/g, "").slice(0, 160)
          : `Shop ${product.title}${
            product.brand ? ` by ${product.brand}` : ""
          } - ${product.category || "Premium Quality"}`);

      // Generate meta title if not provided
      const metaTitle = product.meta_title ||
        `${product.title}${product.brand ? ` by ${product.brand}` : ""} | ${
          product.category || "Shop"
        }`;

      // Build description HTML with all product details
      let descriptionHtml = "";
      if (product.description) {
        descriptionHtml = `<p>${product.description}</p>`;
      } else {
        descriptionHtml = `<p><strong>${product.title}</strong></p>`;
        if (product.brand) {
          descriptionHtml += `<p><strong>Brand:</strong> ${product.brand}</p>`;
        }
        if (product.category) {
          descriptionHtml +=
            `<p><strong>Category:</strong> ${product.category}</p>`;
        }
        if (product.volume_ml) {
          descriptionHtml +=
            `<p><strong>Size:</strong> ${product.volume_ml}</p>`;
        }
      }

      // Build tags array
      const tags: string[] = [];
      if (product.category) tags.push(product.category);
      if (product.brand) tags.push(product.brand);
      if (product.subcategory) tags.push(product.subcategory);
      if (product.tags && Array.isArray(product.tags)) {
        tags.push(...product.tags);
      } else if (product.tags && typeof product.tags === "string") {
        tags.push(...product.tags.split(",").map((t) => t.trim()));
      }
      tags.push("bulk-upload");

      // Prepare variant price and compare_at_price
      const price = parseFloat(product.price) || 0;
      const compareAtPrice = product.original_price && product.is_on_sale
        ? parseFloat(product.original_price.toString())
        : null;

      w; // GraphQL mutation for creating product (new product model - no variants field)
      const mutation = `
        mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
          productCreate(product: $product, media: $media) {
            product {
              id
              title
              handle
              status
              descriptionHtml
              vendor
              productType
              tags
              seo {
                title
                description
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Prepare media input if image exists
      const mediaInput = product.imageUrl
        ? [{
          originalSource: product.imageUrl,
          alt: product.title || product.imageUrl,
        }]
        : [];

      const variables = {
        product: {
          title: product.title,
          descriptionHtml: descriptionHtml,
          vendor: product.brand || "Asper",
          productType: product.category || "General",
          tags: tags,
          status: "ACTIVE",
          seo: {
            title: metaTitle,
            description: metaDescription,
          },
          // Add handle if provided, otherwise let Shopify generate
          handle: product.handle || generateHandle(product.title),
        },
        media: mediaInput,
      };

      const shopifyResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: mutation,
            variables: variables,
          }),
        },
      );

      if (!shopifyResponse.ok) {
        const errorData = await shopifyResponse.text();
        console.error("Shopify API error:", shopifyResponse.status, errorData);

        if (shopifyResponse.status === 429) {
          return new Response(
            JSON.stringify({
              error: "Rate limited by Shopify. Please wait.",
              retryAfter: 60,
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        throw new Error(
          `Shopify API error: ${shopifyResponse.status} - ${errorData}`,
        );
      }

      const shopifyData = await shopifyResponse.json();

      if (shopifyData.errors) {
        console.error("GraphQL errors:", shopifyData.errors);
        throw new Error(
          `GraphQL errors: ${
            shopifyData.errors.map((e: { message: string }) => e.message).join(
              ", ",
            )
          }`,
        );
      }

      const productCreate = shopifyData.data?.productCreate;

      if (productCreate?.userErrors && productCreate.userErrors.length > 0) {
        const errors = productCreate.userErrors.map((e: { message: string }) =>
          e.message
        ).join(", ");
        console.error("User errors:", productCreate.userErrors);
        throw new Error(`Shopify user errors: ${errors}`);
      }

      if (!productCreate?.product) {
        throw new Error("No product returned from Shopify");
      }

      const createdProduct = productCreate.product;

      if (!createdProduct) {
        throw new Error("Product creation failed - no product returned");
      }

      console.log(`Successfully created product: ${createdProduct.id}`);

      // Now create the variant with proper SKU, price, and inventory
      const variantMutation = `
        mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkCreate(productId: $productId, variants: $variants) {
            productVariants {
              id
              sku
              price
              compareAtPrice
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variantInput = {
        price: price.toString(),
        compareAtPrice: compareAtPrice ? compareAtPrice.toString() : null,
        sku: product.sku || undefined,
        inventoryPolicy: "CONTINUE",
        inventoryQuantities: product.inventory_quantity
          ? [
            {
              availableQuantity: product.inventory_quantity,
              locationId: product.location_id || null,
            },
          ]
          : [],
      };

      try {
        const variantResponse = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: variantMutation,
              variables: {
                productId: createdProduct.id,
                variants: [variantInput],
              },
            }),
          },
        );

        const variantData = await variantResponse.json();

        if (
          variantData.errors ||
          variantData.data?.productVariantsBulkCreate?.userErrors?.length > 0
        ) {
          console.warn(
            "Product created but variant creation had issues:",
            variantData.errors ||
              variantData.data?.productVariantsBulkCreate?.userErrors,
          );
        } else {
          console.log("Variant created successfully");
        }
      } catch (variantError) {
        console.warn(
          "Variant creation failed (product still created):",
          variantError,
        );
      }

      // Publish the product to online store (products are created unpublished by default)
      const productGid = createdProduct.id;

      // First, get the online store publication ID
      const getPublicationsQuery = `
        query {
          publications(first: 10) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `;

      try {
        const publicationsResponse = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: getPublicationsQuery }),
          },
        );

        const publicationsData = await publicationsResponse.json();
        const onlineStorePublication = publicationsData.data?.publications
          ?.edges?.find(
            (edge: { node: { name: string } }) =>
              edge.node.name === "Online Store",
          );

        if (onlineStorePublication) {
          const publishMutation = `
            mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
              publishablePublish(id: $id, input: $input) {
                publishable {
                  ... on Product {
                    id
                    title
                    status
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

          const publishResponse = await fetch(
            `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
            {
              method: "POST",
              headers: {
                "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: publishMutation,
                variables: {
                  id: productGid,
                  input: [{
                    publicationId: onlineStorePublication.node.id,
                  }],
                },
              }),
            },
          );

          const publishData = await publishResponse.json();

          if (
            publishData.errors ||
            publishData.data?.publishablePublish?.userErrors?.length > 0
          ) {
            console.warn(
              "Product created but publishing failed:",
              publishData.errors ||
                publishData.data?.publishablePublish?.userErrors,
            );
          } else {
            console.log(`Product published successfully: ${productGid}`);
          }
        } else {
          console.warn(
            "Online Store publication not found - product created but not published",
          );
        }
      } catch (publishError) {
        // Log but don't fail - product is still created
        console.warn(
          "Publishing failed (product still created):",
          publishError,
        );
      }

      // Create metafields if provided
      if (
        product.volume_ml || product.scent || product.texture ||
        product.skin_concerns
      ) {
        const metafieldsMutation = `
          mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                id
                key
                value
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const metafieldsInput: Array<{
          ownerId: string;
          namespace: string;
          key: string;
          value: string;
          type: string;
        }> = [];
        if (product.volume_ml) {
          metafieldsInput.push({
            ownerId: productGid,
            namespace: "custom",
            key: "volume_ml",
            value: product.volume_ml.toString(),
            type: "single_line_text_field",
          });
        }
        if (product.scent) {
          metafieldsInput.push({
            ownerId: productGid,
            namespace: "custom",
            key: "scent",
            value: product.scent,
            type: "single_line_text_field",
          });
        }
        if (product.texture) {
          metafieldsInput.push({
            ownerId: productGid,
            namespace: "custom",
            key: "texture",
            value: product.texture,
            type: "single_line_text_field",
          });
        }
        if (product.skin_concerns && Array.isArray(product.skin_concerns)) {
          metafieldsInput.push({
            ownerId: productGid,
            namespace: "custom",
            key: "skin_concerns",
            value: JSON.stringify(product.skin_concerns),
            type: "list.single_line_text_field",
          });
        }

        if (metafieldsInput.length > 0) {
          try {
            await fetch(
              `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
              {
                method: "POST",
                headers: {
                  "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: metafieldsMutation,
                  variables: { metafields: metafieldsInput },
                }),
              },
            );
            console.log("Metafields created successfully");
          } catch (metafieldError) {
            console.warn("Metafields creation failed:", metafieldError);
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          productId: createdProduct.id,
          handle: createdProduct.handle,
          title: createdProduct.title,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "ai-categorize") {
      // Use AI for smarter categorization
      const { productNames } = requestData;

      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  `You are a product categorization expert for a beauty and pharmacy store. 
                Categories: Skin Care, Hair Care, Body Care, Make Up, Fragrances, Health & Supplements, Medical Supplies, Personal Care.
                Return a JSON array with {name, category, brand} for each product.`,
              },
              {
                role: "user",
                content: `Categorize these products:\n${
                  productNames.join("\n")
                }`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "categorize_products",
                  description:
                    "Categorize products into appropriate categories",
                  parameters: {
                    type: "object",
                    properties: {
                      products: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            category: {
                              type: "string",
                              enum: [
                                "Skin Care",
                                "Hair Care",
                                "Body Care",
                                "Make Up",
                                "Fragrances",
                                "Health & Supplements",
                                "Medical Supplies",
                                "Personal Care",
                                "Uncategorized",
                              ],
                            },
                            brand: { type: "string" },
                          },
                          required: ["name", "category", "brand"],
                        },
                      },
                    },
                    required: ["products"],
                  },
                },
              },
            ],
            tool_choice: {
              type: "function",
              function: { name: "categorize_products" },
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`AI categorization failed: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

      if (toolCall) {
        const result = JSON.parse(toolCall.function.arguments);
        return new Response(
          JSON.stringify({ success: true, products: result.products }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
