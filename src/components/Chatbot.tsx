import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minus } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! I'm your AI Heart Health Assistant. How can I help you today?", 
      sender: 'bot', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated Bot Response
    setTimeout(() => {
      const botMsg: Message = {
        text: generateResponse(input),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const low = query.toLowerCase();
    if (low.includes('cholesterol')) return "To lower cholesterol, focus on fiber-rich oats, healthy fats like salmon, and avoid trans fats.";
    if (low.includes('exercise')) return "Adults should aim for 150 minutes of moderate activity per week, such as brisk walking or swimming.";
    if (low.includes('diet') || low.includes('eat')) return "The Mediterranean diet is gold-standard for heart health: lots of olive oil, nuts, veggies, and fish.";
    return "That's a great question. While I'm an AI, you should always verify medical concerns with a doctor. Is there anything else about heart health I can help with?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-80' : 'h-[500px] w-96'}`}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div>
                  <h3 className="font-bold text-sm">Heart Health AI</h3>
                  <div className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded"><Minus size={18} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded"><X size={18} /></button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                        {msg.text}
                        <div className={`text-[10px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                    />
                    <button onClick={handleSend} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center transition-transform active:scale-90">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default Chatbot;
