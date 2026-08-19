import React from 'react';
import { Bot, TrendingUp, TrendingDown, Fuel } from 'lucide-react';
import ChatPanel from './ChatPanel';

export default function AICopilot({ session, onTriggerLogin }) {
  if (!session) {
    return (
      <div className="glass-panel animate-fade-in max-w-4xl mx-auto my-8 p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-1 text-center md:text-left">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl inline-flex mb-6 shadow-lg border border-white border-opacity-10" style={{ background: 'var(--gradient-primary)' }}>
              <Bot size={48} className="text-white" />
            </div>
            <h2 className="text-3xl text-gradient mb-4" style={{ fontWeight: 700 }}>AI Financial Assistant</h2>
            <p className="text-muted mb-8 leading-relaxed text-lg">
              Log in to unlock your personal AI Business Assistant. Get real-time profit analytics, fuel cost optimization tips, and earnings forecasting based on your data.
            </p>
            <button 
              onClick={onTriggerLogin} 
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
            >
              Sign In to Access AI Copilot
            </button>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="glass-panel opacity-80 pointer-events-none relative overflow-hidden" style={{ padding: '1.25rem' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={64} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-success bg-opacity-20 text-success">
                  <TrendingUp size={20} />
                </div>
                <h4 className="font-semibold text-white">Earnings Potential</h4>
              </div>
              <p className="text-sm text-muted">"Based on your recent activity, driving between 5 PM and 8 PM on Fridays yields 32% more income."</p>
            </div>
            
            <div className="glass-panel opacity-80 pointer-events-none relative overflow-hidden" style={{ padding: '1.25rem' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Fuel size={64} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-danger bg-opacity-20 text-danger">
                  <TrendingDown size={20} />
                </div>
                <h4 className="font-semibold text-white">Fuel Efficiency Alert</h4>
              </div>
              <p className="text-sm text-muted">"Your fuel expenses have increased by 15% this month compared to the last. Consider updating your vehicle's fuel average."</p>
            </div>
          </div>
        </div>
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

