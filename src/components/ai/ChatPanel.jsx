import React, { useState, useRef, useEffect } from 'react';
import { aiClient } from '../../utils/aiClient';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';

const SUGGESTIONS = [
  "How much did I earn this month?",
  "Forecast my earnings for next 30 days",
  "How can I reduce my fuel costs?",
];

export default function ChatPanel({ session }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg = { role: 'user', content: text, id: crypto.randomUUID() };
    const assistantId = crypto.randomUUID();
    
    setMessages(prev => [...prev, userMsg, {
      role: 'assistant', content: '', id: assistantId
    }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await aiClient.chat(text, sessionId, session?.access_token);
      setMessages(prev => prev.map(m => 
        m.id === assistantId ? { 
          ...m, 
          content: result.response, 
          charts: result.charts, 
          tables: result.tables 
        } : m
      ));
    } catch (error) {
      setMessages(prev => prev.map(m => 
        m.id === assistantId ? { ...m, content: `⚠️ Error: ${error.message}` } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
              RideMint AI Copilot
            </h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
              Ask me anything about your business data.
            </p>
            <SuggestedQuestions questions={SUGGESTIONS} onSelect={sendMessage} />
          </div>
        )}
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        <div ref={bottomRef} />
      </div>
      
      <div style={{ padding: '1rem', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about your earnings, expenses..."
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? '⏳' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
