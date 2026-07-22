import React from 'react';

export default function SuggestedQuestions({ questions, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="btn btn-outline"
          style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '100px' }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
