import { supabase } from "@/integrations/supabase/client";

interface GeminiResponse {
  text?: string;
  error?: string;
  message?: string;
}

/**
 * Call Gemini API for single-turn completion via edge function
 * @param prompt - User's prompt/question
 * @param systemPrompt - Optional system instructions
 * @returns AI generated text response
 */
export async function callGeminiAPI(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>('gemini', {
      body: { prompt, systemPrompt, mode: 'single' }
    });

    if (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`NETWORK_ERROR: ${error.message}`);
    }

    if (data?.error) {
      throw new Error(`${data.error}: ${data.message}`);
    }

    if (!data?.text) {
      throw new Error('INVALID_RESPONSE: No text in response');
    }

    return data.text;
  } catch (error: unknown) {
    // Re-throw known errors
    if (error instanceof Error && (
      error.message.startsWith('API_') || 
      error.message.startsWith('RATE_') || 
      error.message.startsWith('AUTH_') ||
      error.message.startsWith('SAFETY_') ||
      error.message.startsWith('INVALID_') ||
      error.message.startsWith('NETWORK_') ||
      error.message.startsWith('UNKNOWN_')
    )) {
      throw error;
    }

    // Handle network errors
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      throw new Error('NETWORK_ERROR: Unable to connect. Please check your internet connection.');
    }

    // Generic error
    console.error('Unexpected Gemini API Error:', error);
    throw new Error('UNKNOWN_ERROR: An unexpected error occurred. Please try again.');
  }
}

/**
 * Call Gemini API for multi-turn chat conversation via edge function
 * @param messages - Array of conversation messages with role and content
 * @returns AI generated response text
 */
export async function callGeminiChat(messages: Array<{role: string, content: string}>): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke<GeminiResponse>('gemini', {
      body: { messages, mode: 'chat' }
    });

    if (error) {
      console.error('Gemini Chat Error:', error);
      throw new Error(`NETWORK_ERROR: ${error.message}`);
    }

    if (data?.error) {
      throw new Error(`${data.error}: ${data.message}`);
    }

    if (!data?.text) {
      throw new Error('INVALID_RESPONSE: No text in response');
    }

    return data.text;
  } catch (error: unknown) {
    // Re-throw known errors
    if (error instanceof Error && (
      error.message.startsWith('RATE_') || 
      error.message.startsWith('API_') || 
      error.message.startsWith('INVALID_') ||
      error.message.startsWith('NETWORK_') ||
      error.message.startsWith('UNKNOWN_')
    )) {
      throw error;
    }

    // Handle network errors
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      throw new Error('NETWORK_ERROR: Connection failed. Please check your internet.');
    }

    console.error('Gemini Chat Error:', error);
    throw new Error('UNKNOWN_ERROR: Unable to send message. Please try again.');
  }
}

/**
 * Parse error message for user-friendly display
 */
export function parseGeminiError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const message = error.message;

  if (message.startsWith('RATE_LIMIT')) {
    return 'Too many requests. Please wait 30 seconds and try again.';
  }
  if (message.startsWith('AUTH_ERROR')) {
    return 'API authentication failed. Please contact support.';
  }
  if (message.startsWith('SAFETY_BLOCK')) {
    return 'Your request was blocked by safety filters. Please rephrase it.';
  }
  if (message.startsWith('NETWORK_ERROR')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (message.startsWith('INVALID_')) {
    return 'Invalid request. Please try different inputs.';
  }

  return 'An unexpected error occurred. Please try again.';
}
