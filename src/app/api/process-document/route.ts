import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';

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

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
} 