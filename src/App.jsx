import React, { useState, useEffect } from 'react';
import { Car, X, AlertCircle, CheckCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import { fetchTransactionsFromSupabase, addTransactionToSupabase, supabase, fetchUserProfile, fetchUserVehicle } from './utils/supabaseClient';
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
  const [profileData, setProfileData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', or 'error'
  const [verificationMessage, setVerificationMessage] = useState('');

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

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Parse query parameters from hash
      const params = new URLSearchParams(hash.substring(1));
      
      if (params.has('error') || params.has('error_description')) {
        const errorCode = params.get('error_code');
        const errorDesc = params.get('error_description') || 'Verification failed';
        setVerificationStatus('error');
        if (errorCode === 'otp_expired') {
          setVerificationMessage('Your email verification link has expired or has already been used. Please log in or request a new link.');
        } else {
          setVerificationMessage(errorDesc.replace(/\+/g, ' '));
        }
        // Clean the hash parameters from the browser address bar
        window.history.replaceState(null, null, window.location.pathname);
      } else if (params.has('access_token')) {
        const type = params.get('type');
        if (type === 'signup' || type === 'recovery') {
          setVerificationStatus('success');
          setVerificationMessage(type === 'signup' 
            ? 'Your email has been verified successfully! You are now logged in.' 
            : 'Reset password link verified! You can now update your password in the Profile tab.'
          );
          if (type === 'recovery') {
            setCurrentPage('profile');
          }
          // Clean the hash parameters from the browser address bar
          window.history.replaceState(null, null, window.location.pathname);
        }
      }
    }
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
    if (!session) {
      setProfileData(null);
      setVehicleData(null);
      setProfileLoaded(false);
    }
  }, [session]);

  const handleLoadProfile = async () => {
    if (!session) return;
    try {
      const userId = session.user.id;
      const [profile, vehicle] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserVehicle(userId)
      ]);
      setProfileData(profile || {});
      setVehicleData(vehicle || {});
      setProfileLoaded(true);
    } catch (err) {
      console.error("Error loading profile in parent:", err);
      throw err;
    }
  };

  const handleSaveProfileSuccess = (newProfile, newVehicle) => {
    setProfileData(newProfile);
    setVehicleData(newVehicle);
    setProfileLoaded(true);
  };

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
        <ProfilePage 
          session={session} 
          profileData={profileData}
          vehicleData={vehicleData}
          profileLoaded={profileLoaded}
          onSaveSuccess={handleSaveProfileSuccess}
          onTriggerLogin={() => setShowLoginModal(true)} 
          onLoadProfile={handleLoadProfile}
        />
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

      {verificationStatus && (
        <div 
          className="login-overlay"
          onClick={() => setVerificationStatus(null)}
        >
          <div className="login-card text-center" style={{ position: 'relative', maxWidth: '480px' }}>
            <button 
              type="button" 
              onClick={() => setVerificationStatus(null)}
              className="login-close-btn"
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div 
                className="login-logo mx-auto" 
                style={{ 
                  background: verificationStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: verificationStatus === 'success' ? 'var(--success)' : 'var(--danger)',
                  borderWidth: '1px',
                  boxShadow: 'none',
                  display: 'inline-flex',
                  padding: '1rem',
                  borderRadius: '50%',
                  marginBottom: '1.5rem'
                }}
              >
                {verificationStatus === 'success' ? (
                  <CheckCircle size={36} className="text-success" />
                ) : (
                  <AlertCircle size={36} className="text-danger" />
                )}
              </div>
              
              <h2 className="text-2xl text-gradient mb-3" style={{ fontWeight: 700 }}>
                {verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
              </h2>
              
              <p className="text-muted mb-6 leading-relaxed">
                {verificationMessage}
              </p>
              
              <button 
                type="button"
                onClick={() => {
                  setVerificationStatus(null);
                  if (verificationStatus === 'error') {
                    setShowLoginModal(true);
                  }
                }}
                className="btn btn-primary w-full"
              >
                {verificationStatus === 'success' ? 'Go to Dashboard' : 'Back to Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
