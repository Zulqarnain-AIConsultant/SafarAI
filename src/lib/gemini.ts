import { supabase } from "@/integrations/supabase/client";

interface GeminiResponse {
  result?: string;
  error?: string;
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  cost: string;
  safetyTip: string;
  culturalNote: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface GeneratedItinerary {
  days: ItineraryDay[];
  totalEstimatedCost: string;
  generalTips: string[];
}

export async function callGemini(
  prompt: string, 
  systemPrompt?: string, 
  type: "generate" | "itinerary" | "translate" = "generate"
): Promise<string> {
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
  days: number,
  startingCity: string,
  interests: string[],
  budgetLevel: string,
  travelStyle: string
): Promise<GeneratedItinerary> {
  const systemPrompt = `You are an expert travel planner specializing in India tourism for foreign visitors. Generate detailed, personalized itineraries that are practical, safe, and culturally enriching.

IMPORTANT: Respond ONLY with valid JSON, no markdown formatting, no code blocks, no additional text.

Generate a JSON response with this exact structure:

{
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "Morning (9:00 AM - 12:00 PM)",
          "activity": "Activity name",
          "description": "Detailed description with specific locations and what to expect",
          "cost": "₹500-800 ($6-10)",
          "safetyTip": "Practical safety advice for this activity",
          "culturalNote": "Cultural etiquette and customs to be aware of"
        },
        {
          "time": "Afternoon (1:00 PM - 5:00 PM)",
          "activity": "Activity name",
          "description": "Detailed description",
          "cost": "₹300-500 ($4-6)",
          "safetyTip": "Safety advice",
          "culturalNote": "Cultural note"
        },
        {
          "time": "Evening (6:00 PM - 9:00 PM)",
          "activity": "Activity name",
          "description": "Detailed description",
          "cost": "₹400-700 ($5-9)",
          "safetyTip": "Safety advice",
          "culturalNote": "Cultural note"
        }
      ]
    }
  ],
  "totalEstimatedCost": "₹15,000-25,000 ($180-300) for entire trip",
  "generalTips": [
    "Important tip 1",
    "Important tip 2",
    "Important tip 3",
    "Important tip 4"
  ]
}

Include morning, afternoon, and evening activities for each day with accurate costs, practical safety tips, and cultural insights.`;

  const userPrompt = `Create a ${days}-day itinerary for India starting from ${startingCity}.

Travel preferences:
- Interests: ${interests.join(', ')}
- Budget level: ${budgetLevel}
- Travel style: ${travelStyle}

Generate a comprehensive, realistic itinerary with:
- Specific activities and attractions for each time of day
- Accurate cost estimates in both INR and USD
- Practical safety tips for each activity
- Cultural etiquette and customs to be aware of
- Restaurant and food recommendations
- Transportation suggestions between locations

Return ONLY valid JSON with no markdown formatting, no code blocks, just the pure JSON object.`;

  const rawResponse = await callGemini(userPrompt, systemPrompt, "itinerary");
  
  // Clean the response - remove markdown code blocks if present
  const cleanedResponse = rawResponse
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    const itinerary = JSON.parse(cleanedResponse) as GeneratedItinerary;
    return itinerary;
  } catch (parseError) {
    console.error("Failed to parse itinerary JSON:", cleanedResponse);
    throw new Error("Error processing response. Please try again.");
  }
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
