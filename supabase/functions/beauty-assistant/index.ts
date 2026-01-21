import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to search products based on query
async function searchProducts(supabaseClient: any, query: string, limit = 5) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('id, title, price, description, brand, category, subcategory, skin_concerns, image_url')
    .or(`title.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(limit);
  
  if (error) {
    console.error('Product search error:', error);
    return [];
  }
  return data || [];
}

// Helper function to get products by skin concern
async function getProductsBySkinConcern(supabaseClient: any, concern: string, limit = 5) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('id, title, price, description, brand, category, subcategory, skin_concerns, image_url')
    .contains('skin_concerns', [concern])
    .limit(limit);
  
  if (error) {
    console.error('Skin concern search error:', error);
    return [];
  }
  return data || [];
}

// Helper function to get products by category
async function getProductsByCategory(supabaseClient: any, category: string, limit = 5) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('id, title, price, description, brand, category, subcategory, skin_concerns, image_url')
    .ilike('category', `%${category}%`)
    .limit(limit);
  
  if (error) {
    console.error('Category search error:', error);
    return [];
  }
  return data || [];
}

const systemPrompt = `You are an intelligent beauty consultant AI for Asper Beauty, a premium cosmetics and skincare store. You have access to our product catalog and can search and recommend specific products.

SMART CAPABILITIES:
- You can search our product inventory and recommend specific products
- You understand skin types: oily, dry, combination, sensitive, normal
- You recognize skin concerns: acne, aging, dark spots, dullness, dehydration, sensitivity, sun protection
- You provide personalized product recommendations with prices
- You give comprehensive skincare routine advice

PRODUCT CATEGORIES:
- Skin Care: cleansers, toners, serums, moisturizers, masks, eye care
- Body Care: lotions, creams, scrubs
- Hair Care: shampoos, conditioners, treatments, oils
- Make-up: foundations, lipsticks, mascaras, eyeshadows
- Fragrances: perfumes, body mists
- Tools & Devices: brushes, applicators, devices

BRANDS: Vichy, Eucerin, Cetaphil, SVR, Bourjois, IsaDora, Essence, Bioten, Mavala

RESPONSE STYLE:
- Be warm, professional, and encouraging
- Keep responses conversational but informative
- When recommending products, mention brand, name, and price
- Explain WHY a product is suitable for their needs
- Provide step-by-step routines when asked

Always prioritize customer needs and recommend products that truly match their skin type and concerns.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT validation failed:", claimsError?.message || "No claims");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user:", userId);

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the last user message to analyze for product recommendations
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    // Search for relevant products based on the user's query
    let productContext = '';
    const products: any[] = [];
    
    // Try to identify keywords for product search
    const lowerQuery = lastUserMessage.toLowerCase();
    
    // Search by skin concerns
    const skinConcerns = ['acne', 'aging', 'dark spots', 'dullness', 'dehydration', 'sensitivity', 'sun protection'];
    for (const concern of skinConcerns) {
      if (lowerQuery.includes(concern.toLowerCase())) {
        const concernProducts = await getProductsBySkinConcern(supabaseClient, concern, 3);
        products.push(...concernProducts);
      }
    }
    
    // Search by category keywords
    const categoryKeywords = [
      { keywords: ['cleanser', 'wash', 'cleansing'], category: 'cleanser' },
      { keywords: ['serum'], category: 'serum' },
      { keywords: ['moisturizer', 'cream', 'hydrat'], category: 'moisturizer' },
      { keywords: ['toner'], category: 'toner' },
      { keywords: ['mask'], category: 'mask' },
      { keywords: ['sunscreen', 'spf', 'sun protection'], category: 'sun care' },
    ];
    
    for (const { keywords, category } of categoryKeywords) {
      if (keywords.some(kw => lowerQuery.includes(kw))) {
        const categoryProducts = await getProductsByCategory(supabaseClient, category, 3);
        products.push(...categoryProducts);
      }
    }
    
    // General search if no specific matches
    if (products.length === 0 && lastUserMessage.length > 3) {
      const searchResults = await searchProducts(supabaseClient, lastUserMessage, 5);
      products.push(...searchResults);
    }
    
    // Remove duplicates and limit to 5 products
    const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values()).slice(0, 5);
    
    // Build product context for AI
    if (uniqueProducts.length > 0) {
      productContext = '\n\nAVAILABLE PRODUCTS TO RECOMMEND:\n';
      uniqueProducts.forEach(p => {
        productContext += `- ${p.brand || ''} ${p.title} (${p.price ? `$${p.price}` : 'Price available'})\n`;
        if (p.description) {
          productContext += `  Description: ${p.description.substring(0, 150)}...\n`;
        }
        if (p.skin_concerns && p.skin_concerns.length > 0) {
          productContext += `  Best for: ${p.skin_concerns.join(', ')}\n`;
        }
      });
      productContext += '\nYou can recommend these specific products in your response when relevant.\n';
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt + productContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Beauty assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
