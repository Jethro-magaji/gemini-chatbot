'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Upload } from 'lucide-react';
import type { Message } from '@/types/chat';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentContext, setDocumentContext] = useState<string>('');

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          documentContext: documentContext
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Chat Error:', error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    setIsLoading(true);
    try {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const uploadedFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));
      
      // Convert files to text content
      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/process-document', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to process document');
        
        const { text } = await response.json();
        
        setDocumentContext(prev => prev + '\n' + text);
        
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Document "${file.name}" has been uploaded and processed.`
        }]);
      }
      
      setDocuments(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      setError('Failed to process document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-72 bg-gray-900 text-white p-4 flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Gemini Chat</h1>
        </div>
        
        <button 
          onClick={() => {
            setMessages([]);
            setInput('');
            setError(null);
            inputRef.current?.focus();
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 text-sm flex items-center justify-center space-x-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b p-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <h2 className="text-lg font-medium">Chat with Gemini</h2>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
              <MessageCircle className="w-12 h-12" />
              <h3 className="text-xl font-medium">Welcome to Gemini Chat</h3>
              <p className="max-w-md">Start a conversation with Gemini AI and explore its capabilities.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-4 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg p-4 bg-white border shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-red-600 max-w-[85%]">
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                accept=".pdf,.doc,.docx"
                multiple
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 border rounded-lg"
                disabled={isLoading}
              >
                <Upload className="w-5 h-5" />
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-4 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}