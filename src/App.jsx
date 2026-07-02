import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import { fetchTransactionsFromSupabase, addTransactionToSupabase, supabase } from './utils/supabaseClient';
import LoginModal from './components/LoginModal';

function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactionsFromSupabase();
      setTransactions(data);
    } catch (err) {
      setError(err.message || "Failed to fetch data from Supabase.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    } else {
      setTransactions([]);
    }
  }, [session]);

  const handleAddTransaction = async (newTx) => {
    setLoading(true);
    setError(null);
    try {
      await addTransactionToSupabase(newTx);
      // Refresh transactions after adding
      await loadData();
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

  if (!session) {
    return <LoginModal onLoginSuccess={(sess) => setSession(sess)} />;
  }

  return (
    <>
      <header className="flex justify-between items-center mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg border border-white border-opacity-20" style={{ background: 'var(--gradient-primary)' }}>
            <Car size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-gradient">Indrive Tracker</h1>
            <p className="text-muted text-sm tracking-wide uppercase">
              Income & Expenses (User: {session?.user?.user_metadata?.full_name || session?.user?.email || 'Hamas'})
            </p>
          </div>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="btn btn-outline"
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Sign Out
        </button>
      </header>

      {error && (
        <div className="glass-panel mb-6 animate-fade-in text-center p-8 border-danger" style={{ borderColor: 'var(--danger)' }}>
          <div className="text-danger text-lg font-semibold mb-2">⚠️ Database Connection Error</div>
          <p className="text-muted mb-4">{error}</p>
          <button onClick={loadData} className="btn btn-outline" style={{ display: 'inline-flex', margin: '0 auto' }}>Retry Connection</button>
        </div>
      )}

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
  );
}

export default App;
