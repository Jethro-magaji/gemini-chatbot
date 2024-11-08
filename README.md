# 🤖 Gemini AI Chatbot with Next.js

A modern, intelligent chatbot built with Next.js 13+, Google's Gemini AI, and TypeScript. Features document processing capabilities and a sleek, responsive interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

- 🎯 Real-time chat interface with Gemini AI
- 📄 Document processing (PDF, DOC, DOCX)
- 🎨 Modern, responsive UI with Tailwind CSS
- 💪 Built with TypeScript for type safety
- 🚀 Next.js 13+ App Router
- 🔒 Environment variable protection
- ⚡ Server-side API routes
- 🔄 Efficient error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 16.8 or later
- Google API key for Gemini AI
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/jethro-magaji/gemini-chatbot.git
cd gemini-chatbot
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your Gemini API key to `.env.local`:
```plaintext
GOOGLE_API_KEY=your_gemini_api_key_here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your app in action! 🎉

## 🏗️ Project Structure

```plaintext
gemini-chatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   └── process-document/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── types/
│       └── chat.ts
├── public/
├── .env.local
└── ...
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Model**: [Google Gemini AI](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Document Processing**: LangChain
- **API Handling**: Next.js API Routes

## 📚 Key Features Explained

### Chat Interface
The chat interface provides real-time communication with Gemini AI:

```typescript
export async function POST(req: NextRequest) {
  const { messages, documentContext } = await req.json();
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const geminiChat = model.startChat({
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
  
  // Process messages and return response
}
```

### Document Processing
Support for multiple document types:
- PDF files
- Word documents (DOC, DOCX)
- Text extraction and context processing

### Type Safety
Strong typing throughout the application:
```typescript
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
```

## 🔧 Configuration

### Environment Variables

Required variables in `.env.local`:
```plaintext
GOOGLE_API_KEY=your_gemini_api_key_here
```

### API Rate Limiting
Default configuration:
```typescript
export const config = {
  runtime: 'edge',
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
```

## 📝 Usage

### Starting a Chat

1. Open the application in your browser
2. Type your message in the input field
3. Press Enter or click Send
4. Receive AI responses in real-time

### Document Processing

1. Click the upload button
2. Select supported documents
3. Wait for processing
4. Chat with context from your documents

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Google Gemini AI team
- Next.js community
- All contributors and supporters

## 📫 Contact

Your Name - [@Real_Drjet](https://twitter.com/@Real_Drjet)

Project Link: [https://github.com/jethro-magaji/gemini-chatbot](https://github.com/jethro-magaji/gemini-chatbot)

---

⭐️ Star this repo if you find it helpful!

## 🔍 Troubleshooting

### Common Issues

1. **API Key Issues**
```bash
Error: GOOGLE_API_KEY is not set in environment variables
```
Solution: Ensure your `.env.local` file contains the correct API key.

2. **Document Processing Errors**
```bash
Error: Unsupported file type
```
Solution: Check if your document format is supported (PDF, DOC, DOCX).

For more issues, please check our [Issues](https://github.com/jethro-magaji/gemini-chatbot/issues) page.

## 🚀 Deployment

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jethro-magaji/gemini-chatbot)

Remember to set your environment variables in your Vercel project settings!

---

Made with ❤️ by [Jethro Magaji](https://github.com/jethro-magaji)
