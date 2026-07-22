import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        borderBottomRightRadius: isUser ? '0.25rem' : '1rem',
        borderBottomLeftRadius: !isUser ? '0.25rem' : '1rem',
        background: isUser ? 'var(--primary)' : 'var(--card-bg)',
        color: isUser ? 'white' : 'var(--text)',
        boxShadow: 'var(--shadow-sm)',
        border: isUser ? 'none' : '1px solid var(--border)'
      }}>
        {message.content ? (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {message.content}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>Thinking...</div>
        )}
        
        {message.tables && message.tables.length > 0 && (
          <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <tbody>
                {message.tables.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: '0.5rem', border: '1px solid var(--border)' }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
