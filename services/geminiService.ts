import { GoogleGenAI, Type } from "@google/genai";
import { TicketTopic, TicketPriority } from '../types';

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

export const analyzePriority = async (description: string): Promise<TicketPriority> => {
  if (!apiKey) return TicketPriority.NORMAL;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the sentiment and urgency of the following IT support ticket description. 
      Classify priority as: 'Baja', 'Normal', 'Alta', or 'Urgente'.
      
      Criteria:
      - Baja: Informational, cosmetic, no impact.
      - Normal: Standard request, single user affected, workaround available.
      - Alta: Prevents work, multiple users affected, significant feature broken.
      - Urgente: System down, security breach, data loss, financial impact.

      Description: "${description}"
      
      Return ONLY the priority string.`,
    });

    const text = response.text?.trim();
    const matchedPriority = Object.values(TicketPriority).find(p => p.toLowerCase() === text?.toLowerCase());
    return matchedPriority || TicketPriority.NORMAL;
  } catch (error) {
    return TicketPriority.NORMAL;
  }
};

export const improveDescription = async (text: string): Promise<string> => {
  if (!apiKey) return text;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following support ticket description to be more professional, clear, and concise, while retaining all technical details. Return only the rewritten text in Spanish.
      
      Original Text: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    return text;
  }
};

export const generateSmartReply = async (ticketTitle: string, ticketDesc: string, history: string): Promise<string> => {
  if (!apiKey) return "";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful IT support agent. Draft a short, professional, and empathetic reply to the user based on the ticket context and conversation history.
      Answer in Spanish. Use Markdown formatting if needed.
      
      Ticket: ${ticketTitle}
      Issue: ${ticketDesc}
      Previous Comments:
      ${history}
      
      Draft Reply:`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
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