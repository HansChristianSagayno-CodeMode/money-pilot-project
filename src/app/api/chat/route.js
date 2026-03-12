import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let conversation =
      "You are Money Pilot AI, a helpful financial assistant.\n\n";

    messages.slice(-10).forEach((msg) => {
      conversation += `${msg.role}: ${msg.content}\n`;
    });

    conversation += "assistant:";

    const result = await model.generateContent(conversation);
    const text = result.response.text();

    return Response.json({ message: text });

  } catch (error) {
    console.error(error);

    return Response.json({
      message: "Hi! I'm your Money Pilot AI. How can I help with your finances?"
    });
  }
}