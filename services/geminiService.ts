import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from '../types';

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Fallback logic for when API key is missing or errors occur
const mockBreakdown = (task: string): string[] => {
  return [
    `Paso 1: Abrir documento para "${task}"`,
    `Paso 2: Escribir primera frase de "${task}"`,
    `Paso 3: Revisar borrador rápido`,
    `Paso 4: Finalizar detalles`
  ];
};

const mockChatResponse = (input: string): string => {
  return "Entiendo que esto sea difícil. Respira profundo. Vamos a intentar hacer solo una cosa pequeña durante 5 minutos. ¿Te parece bien?";
};

export const breakDownTaskWithGemini = async (taskContent: string): Promise<string[]> => {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn("No API Key found. Using mock response.");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network
    return mockBreakdown(taskContent);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the task "${taskContent}" into 3 to 5 very small, incredibly actionable micro-steps for someone with ADHD. Return ONLY a JSON array of strings. Example: ["Step 1", "Step 2"]. Keep it brief.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return mockBreakdown(taskContent);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockBreakdown(taskContent);
  }
};

export const sendChatMessageToGemini = async (history: ChatMessage[], newUserMessage: string): Promise<string> => {
  const ai = getAIClient();

  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockChatResponse(newUserMessage);
  }

  try {
    // Construct history for context
    // We only take the last 10 messages to save context window and keep it relevant
    const recentHistory = history.slice(-10);
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a compassionate, practical, and non-judgmental ADHD Coach. 
        Your goal is to validate the user's feelings (overwhelm, paralysis, distraction) in one short sentence, 
        and then propose ONE single, tiny, immediate micro-action. 
        Keep responses under 50 words. Be encouraging but firm on taking small steps.`,
      },
      history: recentHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newUserMessage });
    return result.text || mockChatResponse(newUserMessage);

  } catch (error) {
    console.error("Chat Error:", error);
    return mockChatResponse(newUserMessage);
  }
};