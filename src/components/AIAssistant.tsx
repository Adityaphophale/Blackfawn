import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ShoppingBag, Mic, MicOff, Volume2, VolumeX, Star } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (productId: string) => void;
}

export default function AIAssistant({
  isOpen,
  onClose,
  products,
  onProductClick,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Welcome to BLACKFAWN Metropolis. I am FAWN-AI, your personal elite streetwear stylist and design consultant. Tell me about your height, weight, desired vibe, or event, and I will craft the ultimate heavy-drop silhouette for you.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const presetPrompts = [
    "Suggest a complete oversized street outfit",
    "What size for 5'10\" and 75kg?",
    "Explain the Acid wash texture",
    "Show water-resistant cargos",
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: messages,
        }),
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || "Apologies. I experienced a connection disruption in our fabric mainframe.",
        createdAt: new Date().toISOString(),
        suggestedProducts: data.suggestedProducts || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Simulate TTS if active
      if (ttsActive && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.rate = 1.05;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "My apologies. Our styling database appears offline. Explore our full catalog using the filters!",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API for voice search/input
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please open in a new tab.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    rec.onresult = (e: any) => {
      const resultText = e.results[0][0].transcript;
      setInputText(resultText);
      handleSendMessage(resultText);
    };

    rec.start();
  };

  if (!isOpen) return null;

  return (
    <div id="ai-stylist-drawer" className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-black/10 rounded-md overflow-hidden shadow-2xl flex flex-col h-[550px] animate-slide-up text-black">
      {/* Header Stylist */}
      <div className="p-4 bg-neutral-50 border-b border-black/10 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-neutral-100 rounded-full text-black">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold tracking-widest text-black uppercase">FAWN-AI PERSONAL STYLIST</h3>
            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">● Stylist Consultant Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* TTS Toggle */}
          <button
            onClick={() => {
              const active = !ttsActive;
              setTtsActive(active);
              if (!active && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-2 rounded-md transition-colors ${ttsActive ? 'text-black font-bold' : 'text-neutral-400 hover:text-black'}`}
            title="Toggle Voice Synthesizer"
          >
            {ttsActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages scrolling container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-md p-3 text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-black text-white font-medium font-mono'
                : 'bg-neutral-50 border border-black/10 text-neutral-800 font-serif'
            }`}>
              {m.text}

              {/* Renders dynamic products matching the AI recommendations */}
              {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-black/10 space-y-2">
                  <p className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">Aesthetic Matches Found:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {m.suggestedProducts.map((pId) => {
                      const prod = products.find((p) => p.id === pId);
                      if (!prod) return null;
                      return (
                        <div
                          key={pId}
                          onClick={() => onProductClick(pId)}
                          className="flex items-center gap-2 p-1.5 bg-white border border-black/10 rounded-md hover:border-black/30 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <img src={prod.images[0]} alt="" className="w-8 aspect-[3/4] object-cover rounded-md" referrerPolicy="no-referrer" />
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-[9px] font-serif text-black uppercase tracking-wider line-clamp-1">{prod.name}</h4>
                            <p className="text-[9px] font-mono text-neutral-600">₹{prod.discountPrice || prod.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-50 border border-black/10 rounded-md p-3 text-xs flex items-center gap-1.5 text-neutral-500">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></span>
              <span className="font-mono text-[9px] tracking-widest uppercase ml-1">Analyzing silhouette fits</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips */}
      {messages.length === 1 && !loading && (
        <div className="p-3 bg-neutral-50 border-t border-black/10 flex flex-wrap gap-1.5">
          {presetPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSendMessage(p)}
              className="text-[9px] font-mono border border-black/10 bg-white text-neutral-600 hover:text-black hover:border-black/30 px-2 py-1 rounded-md uppercase tracking-wider transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input panel footer */}
      <div className="p-4 border-t border-black/10 bg-neutral-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Mic Trigger */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-md border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-white border-black/15 text-neutral-500 hover:text-black hover:border-black/30'
            }`}
            title="Voice Consult"
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          <input
            type="text"
            placeholder="Describe your desired style drop..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white border border-black/15 text-black px-3 py-2 text-xs font-mono focus:border-black/30 outline-none rounded-md"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 transition-all rounded-md cursor-pointer shrink-0"
          >
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
