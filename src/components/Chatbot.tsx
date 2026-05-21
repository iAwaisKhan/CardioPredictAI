import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { PredictionResult, PatientData } from '../types';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatbotProps {
  prediction?: PredictionResult | null;
  patientData?: PatientData | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ prediction, patientData }) => {
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
    
    // Context-Aware Responses
    if (low.includes('cholesterol') || low.includes('my chol')) {
      if (patientData && patientData.chol > 200) {
        return `I noticed your cholesterol is ${patientData.chol} mg/dl, which is elevated. Consider fiber-rich oats and healthy fats to help lower it.`;
      }
      return "To maintain healthy cholesterol, focus on fiber-rich oats, healthy fats like salmon, and avoid trans fats.";
    }
    
    if (low.includes('blood pressure') || low.includes('bp')) {
      if (patientData && patientData.trestbps > 130) {
        return `Your resting blood pressure is ${patientData.trestbps} mmHg. This is somewhat high. Reducing sodium and managing stress can help.`;
      }
      return "A healthy resting blood pressure is typically under 120/80. Exercise and a low-sodium diet are key.";
    }

    if (low.includes('my risk') || low.includes('results')) {
      if (prediction) {
        return `Your current risk probability is ${prediction.diseaseProb}%. ${prediction.hasDisease ? 'This indicates a high risk. Please consult a doctor.' : 'This is a low risk result.'}`;
      }
      return "Please complete the prediction form first so I can analyze your specific risk level.";
    }

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
            className={`bg-surface rounded-sm shadow-2xl border border-divider overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-80' : 'h-[500px] w-96'}`}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black/20 rounded-sm flex items-center justify-center text-xl">🤖</div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest">Health AI</h3>
                  <div className="text-[10px] opacity-80 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> CONTEXT AWARE
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-black/20 rounded-sm"><Minus size={18} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/20 rounded-sm"><X size={18} /></button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background font-mono">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-primary text-white rounded-sm rounded-tr-none' : 'bg-card border border-divider text-text rounded-sm rounded-tl-none'}`}>
                        {msg.text}
                        <div className={`text-[9px] mt-2 opacity-40 uppercase tracking-widest ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-divider bg-card">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about your results..."
                      className="flex-1 bg-background border border-divider rounded-sm px-4 py-2 text-xs font-mono text-text focus:outline-none focus:border-primary transition-colors"
                    />
                    <button onClick={handleSend} className="w-10 h-10 bg-primary text-white rounded-sm flex items-center justify-center transition-transform active:scale-95">
                      <Send size={16} />
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
        className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(230,50,50,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all mt-4 ml-auto"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default Chatbot;
