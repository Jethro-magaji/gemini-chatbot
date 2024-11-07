import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format the conversation history for Gemini
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: history,
    });

    // Send the last message
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage([{ text: lastMessage }]);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return new Response(
      JSON.stringify({ content: text }), 
      { headers: { 'Content-Type': 'application/json' }}
    );

  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}