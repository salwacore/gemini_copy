
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function runChat(prompt) {
  if (!ai) {
    console.error('Missing VITE_GEMINI_API_KEY in your .env file');
    return '';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response?.text || '';
    console.log('Gemini Response:\n', text);
    return text;
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);

    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      return 'The Gemini API quota has been reached for this project. Please try again later or update your billing/quota settings.';
    }

    return 'The Gemini API is temporarily unavailable. Please try again in a moment.';
  }
}

export default runChat;
