import React from 'react';
import Logo from '../Logo';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Overview' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'logEntry', label: 'Log Entry' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'copilot', label: 'AI Copilot' },
  { key: 'profile', label: 'Profile' },
];

export default function Header({ currentPage, onNavigate, session, onSignOut, onTriggerLogin }) {
  const displayName = session ? (session.user.user_metadata?.full_name || session.user.email) : 'Guest';

  return (
    <header className="sticky top-0 z-40 -mx-4 md:-mx-8 mb-space-lg bg-canvas/90 backdrop-blur-xl border-b border-hairline animate-fade-in">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-gutter">
        <div className="flex items-center gap-space-lg min-w-0">
          <Logo />
          <nav className="hidden lg:flex items-center gap-space-xs p-space-xs rounded-xl bg-surface-container-low">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`px-space-md py-1.5 rounded-lg font-headline-sm text-headline-sm transition-colors whitespace-nowrap ${
                  currentPage === item.key
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden sm:flex flex-col items-end pl-space-xs">
            <span className="font-body-sm text-body-sm text-on-surface leading-none">{displayName}</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant tracking-tight mt-0.5">
              {session ? 'Signed in' : 'Guest Sandbox'}
            </span>
          </div>
          {session ? (
            <button type="button" onClick={onSignOut} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Sign Out
            </button>
          ) : (
            <button type="button" onClick={onTriggerLogin} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav — visible below lg breakpoint */}
      <nav className="flex lg:hidden items-center gap-1 overflow-x-auto px-4 pb-2 -mt-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`px-3 py-1.5 rounded-lg font-label-sans text-label-sans whitespace-nowrap transition-colors ${
              currentPage === item.key
                ? 'bg-surface-container-high text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
