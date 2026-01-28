import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting protection
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 4500; // 4.5 seconds between requests

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limit protection: waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const { prompt, systemPrompt, messages, mode = "single" } = await req.json();

    // Apply rate limiting
    await waitForRateLimit();

    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    let contents;
    
    if (mode === "chat" && messages) {
      // Multi-turn conversation format
      contents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
    } else {
      // Single-turn format
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      contents = [{
        parts: [{ text: fullPrompt }]
      }];
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error Response:", errorData);

      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: "API_NOT_FOUND", message: "API endpoint not found. Please check configuration." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "RATE_LIMIT", message: "Too many requests. Please wait 30 seconds and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: "INVALID_REQUEST", message: "Invalid request. Please try different inputs." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "AUTH_ERROR", message: "API key authentication failed." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: "API_ERROR", message: `HTTP ${response.status} - ${response.statusText}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const data = await response.json();

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Unexpected API response structure:", data);
      return new Response(
        JSON.stringify({ error: "INVALID_RESPONSE", message: "Unexpected response format from API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if content was blocked by safety filters
    if (data.candidates[0].finishReason === "SAFETY") {
      return new Response(
        JSON.stringify({ error: "SAFETY_BLOCK", message: "Response was blocked by safety filters. Please rephrase your request." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const responseText = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ text: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Gemini function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "UNKNOWN_ERROR", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
