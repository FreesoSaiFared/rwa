
import { GoogleGenAI } from "@google/genai";
import { Bus } from '../core/bus';
import { EngineCommandType, EngineEventType } from '../core/types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class AIService {
  static async setup() {
    Bus.subscribe(EngineCommandType.EXPLAIN_PHYSICS, async (data: { mass: number, radius: number, result: any }) => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Explain the Schwarzschild L-factor for a body with mass ${data.mass} kg and a measuring radius of ${data.radius} meters. 
          The calculated Schwarzschild radius is ${data.result.schwarzschildRadius} and the L-factor is ${data.result.lFactor}. 
          Keep it concise and scientific.`,
          config: {
            systemInstruction: "You are a world-class theoretical physicist specializing in General Relativity."
          }
        });

        Bus.publish(EngineEventType.AI_EXPLANATION_READY, response.text);
      } catch (error) {
        console.error("AI Service Error:", error);
        Bus.publish(EngineEventType.LOG_MESSAGE, "AI consultant failed to connect.");
      }
    });
  }
}
