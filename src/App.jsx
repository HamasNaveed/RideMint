import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import { fetchTransactionsFromSupabase, addTransactionToSupabase, supabase } from './utils/supabaseClient';
import LoginModal from './components/LoginModal';
import ProfilePage from './components/ProfilePage';

const MOCK_INITIAL_TRANSACTIONS = [
  {
    id: 'mock-1',
    Date: '01-Jul',
    Type: 'Earning',
    Description: 'Ride Income',
    'Amount (PKR)': 3500,
    rawDate: '2026-07-01'
  },
  {
    id: 'mock-2',
    Date: '01-Jul',
    Type: 'Expense',
    Description: 'Fuel',
    'Amount (PKR)': 1200,
    rawDate: '2026-07-01'
  },
  {
    id: 'mock-3',
    Date: '02-Jul',
    Type: 'Earning',
    Description: 'Ride Income',
    'Amount (PKR)': 4200,
    rawDate: '2026-07-02'
  },
  {
    id: 'mock-4',
    Date: '02-Jul',
    Type: 'Expense',
    Description: 'InDrive Cost',
    'Amount (PKR)': 500,
    rawDate: '2026-07-02'
  }
];

function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'profile'
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async (currentSession) => {
    setLoading(true);
    setError(null);
    try {
      if (currentSession) {
        const data = await fetchTransactionsFromSupabase();
        setTransactions(data);
      } else {
        const localData = localStorage.getItem('ridemint_guest_transactions');
        if (localData) {
          setTransactions(JSON.parse(localData));
        } else {
          localStorage.setItem('ridemint_guest_transactions', JSON.stringify(MOCK_INITIAL_TRANSACTIONS));
          setTransactions(MOCK_INITIAL_TRANSACTIONS);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(session);
  }, [session]);

  const handleAddTransaction = async (newTx) => {
    setLoading(true);
    setError(null);
    try {
      if (session) {
        await addTransactionToSupabase(newTx);
        await loadData(session);
      } else {
        const updated = [...transactions, {
          ...newTx,
          id: `guest-${Date.now()}`
        }];
        localStorage.setItem('ridemint_guest_transactions', JSON.stringify(updated));
        setTransactions(updated);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "Failed to save transaction.");
      console.error(err);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center text-muted">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg border border-white border-opacity-20" style={{ background: 'var(--gradient-primary)' }}>
            <Car size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-gradient">Indrive Tracker</h1>
            <p className="text-muted text-sm tracking-wide uppercase">
              {session ? `Logged in as: ${session.user.user_metadata?.full_name || session.user.email}` : 'Guest Sandbox Mode'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`btn ${currentPage === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('profile')}
              className={`btn ${currentPage === 'profile' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Profile
            </button>
          </div>

          <div>
            {session ? (
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {!session && (
        <div className="glass-panel mb-6 animate-fade-in flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', padding: '1rem 1.5rem' }}>
          <div>
            <div className="text-accent-primary font-semibold flex items-center gap-2">
              <span>💡 Guest Mode Sandbox</span>
            </div>
            <p className="text-muted text-sm mt-0.5">Your entries are stored locally. Sign in to save your logs and configure vehicle settings in Supabase.</p>
          </div>
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
          >
            Connect Database
          </button>
        </div>
      )}

      {error && (
        <div className="glass-panel mb-6 animate-fade-in text-center p-8 border-danger" style={{ borderColor: 'var(--danger)' }}>
          <div className="text-danger text-lg font-semibold mb-2">⚠️ Database Connection Error</div>
          <p className="text-muted mb-4">{error}</p>
          <button onClick={() => loadData(session)} className="btn btn-outline" style={{ display: 'inline-flex', margin: '0 auto' }}>Retry Connection</button>
        </div>
      )}

      {currentPage === 'dashboard' ? (
        <>
          {loading && transactions.length === 0 ? (
            <div className="text-center py-12 text-muted animate-fade-in">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
              <p>Loading your data...</p>
            </div>
          ) : !error ? (
            <>
              <Dashboard transactions={transactions} />
              <TransactionForm onAdd={handleAddTransaction} loading={loading} />
              <TransactionHistory transactions={transactions} />
            </>
          ) : null}
        </>
      ) : (
        <ProfilePage session={session} onTriggerLogin={() => setShowLoginModal(true)} />
      )}

      {showLoginModal && (
        <LoginModal 
          onLoginSuccess={(sess) => {
            setSession(sess);
            setShowLoginModal(false);
          }} 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}

export default App;
