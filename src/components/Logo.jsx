import React from 'react';

export default function Logo({ showWordmark = true, size = 28 }) {
  return (
    <div className="flex items-center gap-space-sm">
      <div
        className="rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 32 32" fill="none">
          <path d="M9 16L16 9L23 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 9V23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="23" r="2" fill="currentColor" />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Ledger</span>
      )}
    </div>
  );
}
