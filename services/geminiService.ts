import { GoogleGenAI, Type } from "@google/genai";
import { TicketTopic } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get enum keys as strings for the prompt
const topicsList = Object.values(TicketTopic).join(', ');

export const categorizeTicket = async (description: string): Promise<TicketTopic> => {
  if (!apiKey) return TicketTopic.OTRO;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following ticket description and categorize it into exactly one of these categories: [${topicsList}]. 
      Description: "${description}".
      Return ONLY the category name as a plain string. If unsure, return "Otro".`,
    });

    const text = response.text?.trim();
    
    // Validate if the response matches one of our topics
    const matchedTopic = Object.values(TicketTopic).find(
      (t) => t.toLowerCase() === text?.toLowerCase()
    );

    return matchedTopic || TicketTopic.OTRO;
  } catch (error) {
    console.error("Error categorizing ticket:", error);
    return TicketTopic.OTRO;
  }
};

export const getSolutionInsight = async (ticketTitle: string, ticketDescription: string): Promise<string> => {
  if (!apiKey) return "API Key no configurada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Actúa como un ingeniero de soporte técnico experto. Proporciona una lista breve y concisa con viñetas de 3 posibles soluciones o pasos de diagnóstico para el siguiente problema.
      IMPORTANTE: Responde siempre en Español.
      
      Título: ${ticketTitle}
      Descripción: ${ticketDescription}`,
    });

    return response.text || "No hay sugerencias disponibles.";
  } catch (error) {
    console.error("Error getting insights:", error);
    return "No se pudieron obtener sugerencias de IA en este momento.";
  }
};