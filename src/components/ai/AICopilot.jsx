import React from 'react';
import ChatPanel from './ChatPanel';

export default function AICopilot({ session, onTriggerLogin }) {
  if (!session) {
    return (
      <div className="glass-panel animate-fade-in text-center p-8 max-w-lg mx-auto my-8" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🤖</div>
        <h2 className="text-2xl text-gradient mb-3" style={{ fontWeight: 700 }}>AI Financial Assistant</h2>
        <p className="text-muted mb-6 leading-relaxed">
          Log in to unlock your personal AI Business Assistant. Get real-time profit analytics, fuel cost optimization tips, and earnings forecasting based on your Supabase data.
        </p>
        <button 
          onClick={onTriggerLogin} 
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
        >
          Sign In to Access AI Copilot
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        background: 'var(--card-bg)',
        borderRadius: '1rem',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <ChatPanel session={session} />
      </div>
    </div>
  );
}

