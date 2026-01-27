import { supabase } from "@/integrations/supabase/client";

interface GeminiResponse {
  result?: string;
  error?: string;
}

export async function callGemini(prompt: string, systemPrompt?: string, type: "generate" | "itinerary" | "translate" = "generate"): Promise<string> {
  const { data, error } = await supabase.functions.invoke<GeminiResponse>("gemini", {
    body: { prompt, systemPrompt, type },
  });

  if (error) {
    console.error("Gemini function error:", error);
    throw new Error(error.message || "Failed to call Gemini API");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.result) {
    throw new Error("No response from Gemini");
  }

  return data.result;
}

// Specialized function for itinerary generation
export async function generateItinerary(
  destination: string,
  duration: number,
  travelStyle: string,
  interests: string[],
  budget: string
): Promise<string> {
  const systemPrompt = `You are an expert India travel planner. Create detailed, practical, and culturally authentic itineraries. 
Include specific recommendations for:
- Day-by-day activities with timings
- Best local restaurants and street food spots
- Cultural experiences and hidden gems
- Transportation tips
- Safety considerations
- Budget estimates in INR

Format the response as a structured itinerary with clear sections for each day.`;

  const prompt = `Create a ${duration}-day travel itinerary for ${destination}, India.
Travel Style: ${travelStyle}
Interests: ${interests.join(", ")}
Budget: ${budget}

Please provide a comprehensive day-by-day itinerary.`;

  return callGemini(prompt, systemPrompt, "itinerary");
}

// Specialized function for translation
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const systemPrompt = `You are a professional translator specializing in Indian languages. 
Provide accurate translations that preserve meaning, tone, and cultural context.
Also include:
- Transliteration (if the target script is different)
- Brief pronunciation guide
- Any cultural notes if relevant`;

  const prompt = `Translate the following text to ${targetLanguage}:

"${text}"

Provide the translation, transliteration, and pronunciation guide.`;

  return callGemini(prompt, systemPrompt, "translate");
}
