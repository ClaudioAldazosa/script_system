'use client';

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { fetchMockData } from "@/lib/mock-data";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function EditorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I can help you edit your scripts. Paste your script here or tell me what you need.' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Simulate n8n webhook call
      return fetchMockData({
        response: `Here is a revised version based on "${prompt}"`,
        script: `[HOOK]
Do you struggle with low ROAS?

[PROBLEM]
Most dropshippers fail because their creative is boring.

[SOLUTION]
Introducing the Script AI Editor. It writes high-converting scripts in seconds.

[CTA]
Try it now and double your conversions.`
      }, 1500);
    },
    onSuccess: (data) => {
      // Format the message to include the script clearly
      const content = `${data.response}\n\n---\n\n${data.script}`;
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    mutation.mutate(input);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-white/10">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
        <h2 className="font-bold text-white flex items-center tracking-wide">
          <Bot className="w-5 h-5 mr-2 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            AI Script Assistant
          </span>
        </h2>
        <span className="text-xs text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.1)]">
          Gemini 1.5 Pro
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-6 py-4 text-sm shadow-lg whitespace-pre-wrap leading-relaxed backdrop-blur-sm transition-all duration-300 hover:shadow-cyan-500/10",
                msg.role === 'user'
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-none border border-white/10 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "bg-gray-900/60 text-gray-100 rounded-bl-none border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-900/60 rounded-2xl rounded-bl-none px-6 py-4 text-sm text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <span className="animate-pulse flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI is generating script...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your script idea..."
            className="flex-1 rounded-xl bg-gray-900/50 border border-white/10 px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-inner"
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-white shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
