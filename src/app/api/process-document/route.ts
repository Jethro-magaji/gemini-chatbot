import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process based on file type
    let text = '';
    if (file.type === 'application/pdf') {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const loader = new PDFLoader(blob);
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n');
    } else if (file.type.includes('word')) {
      const blob = new Blob([buffer], { type: file.type });
      const loader = new DocxLoader(blob);
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n');
    }

    // Add document summarization
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    
    const genAI = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      apiKey: process.env.GOOGLE_API_KEY
    });

    // Ensure we have text content to summarize
    if (chunks.length === 0) {
      return NextResponse.json({ 
        error: 'No content to summarize' 
      }, { status: 400 });
    }

    const response = await genAI.invoke(`
      Please provide a concise summary of the following text in bullet points:
      "${chunks[0].pageContent}"
    `);

    // Extract the summary text from the response
    const summaryText = response.content.toString();

    console.log('Chunks:', chunks.length);
    console.log('First chunk:', chunks[0]?.pageContent);
    console.log('Raw response:', response);
    console.log('Summary:', summaryText);

    return NextResponse.json({ 
      text,
      summary: summaryText,
      chunks: chunks.length 
    });
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
} 