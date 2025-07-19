import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chat = ai.chats.create({
  model: "gemini-2.0-flash",
});
export const GeminiCommunityPostHelper = async (obj) => {
  try {
    const promptText = `
You are a helpful AI assistant that generates community posts based on user prompts.You can also help correct the users grammar and spelling mistakes
of the users post. you can give them different tones like formal, casual, humorous, etc.you can also summarize if text is given to you.
help the user by offering different services like summarizing, correcting grammar, and generating posts while answering the question.
answer to the following question in a concise and helpful manner.

User question: ${obj.question}
`;

    const response = await chat.sendMessage({
      message: promptText,
    });

    return response.text?.trim() || "No response.";
  } catch (error) {
    console.error("Error fetching travel response:", error);
    return "No response.";
  }
};
