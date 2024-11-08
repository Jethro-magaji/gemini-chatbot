import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { messages, documentContext } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const geminiChat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    if (documentContext) {
      await geminiChat.sendMessage(
        `Here's the context from the uploaded documents: ${documentContext}\n\nPlease use this context to answer questions.`
      );
    }

    const lastMessage = messages[messages.length - 1].content;
    const result = await geminiChat.sendMessage(lastMessage);
    const response = await result.response;

    return NextResponse.json({ content: response.text() });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}