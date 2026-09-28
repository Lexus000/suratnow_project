import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  isButton?: boolean;
  buttonLink?: string;
  buttonText?: string;
}

function renderSafeMessage(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function getSafeLink(link?: string) {
  if (!link) return null;

  try {
    const url = new URL(link, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function FloatingAiChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Halo! Saya Asisten AI Kecamatan Suruh. Ada yang bisa saya bantu terkait kendala teknis atau pengajuan surat hari ini?",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  const quickReplies = [
    { text: '🔑 Lupa Password Admin', action: () => handleSend('🔑 Lupa Password Admin') },
    { text: '📄 Syarat Pengajuan SKM', action: () => handleSend('📄 Syarat Pengajuan SKM') },
    { text: '⏱️ Apa itu Batas Waktu SLA?', action: () => handleSend('⏱️ Apa itu Batas Waktu SLA?') },
    { text: '💬 Hubungi Petugas Manusia (WA)', action: () => handleSend('💬 Hubungi Petugas Manusia (WA)') }
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = { id: Date.now(), text, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Small artificial delay for typing effect
      await new Promise(resolve => setTimeout(resolve, 600));

      const history = messages.slice(-12).map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text.slice(0, 1000)
      }));

      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const currentUserRole = pathSegments.length > 1 && ['user', 'admin', 'superadmin'].includes(pathSegments[1]) 
        ? pathSegments[1] 
        : 'warga';

      const response = await api.post('/ai/chat', { 
        message: text,
        history: history,
        role: currentUserRole,
        current_path: currentPath
      });
      const data = response.data;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.reply || data.text || 'Maaf, terjadi kesalahan tak terduga.',
        sender: 'ai',
        isButton: data.isButton,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink
      }]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.reply || 'Terjadi kendala koneksi ke server AI. Silakan hubungi Tim IT via WhatsApp (+62 856-3532-414).';
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: errorMessage,
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (!isOpen) {
    return (
      <button 
        data-testid="ai-open"
        aria-label="Buka asisten AI"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <MessageSquare size={24} />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 w-[85vw] md:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[9999] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">🤖 Asisten AI SuruhNow</h3>
            <p className="text-[10px] text-blue-100 flex items-center gap-1">
              Online • Groq Llama 3.3
            </p>
          </div>
        </div>
        <button data-testid="ai-close" aria-label="Tutup asisten AI" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 p-1 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
            }`}>
              <div className="whitespace-pre-line">
                {renderSafeMessage(msg.text)}
              </div>
              {msg.isButton && getSafeLink(msg.buttonLink) && (
                <a 
                  href={getSafeLink(msg.buttonLink) ?? undefined} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl text-center transition-colors shadow-sm text-xs"
                >
                  {msg.buttonText || "Buka Link"}
                </a>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 bg-slate-50 border-t border-slate-100 [&::-webkit-scrollbar]:hidden">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={reply.action}
            className="inline-block px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            {reply.text}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            data-testid="ai-input"
            aria-label="Pesan untuk asisten AI"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
          />
          <button 
            data-testid="ai-send"
            aria-label="Kirim pesan ke asisten AI"
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
