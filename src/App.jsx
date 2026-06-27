import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import { fetchTransactionsFromSupabase, addTransactionToSupabase, HAMAS_USER_ID } from './utils/supabaseClient';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = HAMAS_USER_ID; // Hamas

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactionsFromSupabase();
      setTransactions(data);
    } catch (err) {
      setError("Failed to fetch data from Supabase.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (newTx) => {
    setLoading(true);
    setError(null);
    try {
      await addTransactionToSupabase(newTx);
      // Refresh transactions after adding
      await loadData();
    } catch (err) {
      setError("Failed to save transaction.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg border border-white border-opacity-20" style={{ background: 'var(--gradient-primary)' }}>
            <Car size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-gradient">Indrive Tracker</h1>
            <p className="text-muted text-sm tracking-wide uppercase">Income & Expenses (User: Hamas)</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="glass-panel text-danger mb-4 border-danger animate-fade-in" style={{ borderColor: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div className="text-center py-12 text-muted animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        <>
          <Dashboard transactions={transactions} />
          <TransactionForm onAdd={handleAddTransaction} loading={loading} />
          <TransactionHistory transactions={transactions} />
        </>
      )}
    </>
  );
}

export default App;
