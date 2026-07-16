import React, { useState, useEffect } from 'react';
import { User, Car, Save, AlertCircle, CheckCircle, Gauge, Fuel, Lock, Eye, EyeOff } from 'lucide-react';
import { updateUserProfile, saveUserVehicle, supabase } from '../utils/supabaseClient';

export default function ProfilePage({ 
  session, 
  profileData, 
  vehicleData, 
  profileLoaded, 
  onSaveSuccess, 
  onTriggerLogin, 
  onLoadProfile 
}) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [avgConsumption, setAvgConsumption] = useState('');
  const [totalKm, setTotalKm] = useState('');

  // Password reset/update states
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sync form states from cached parent props when loaded
  useEffect(() => {
    if (profileLoaded && profileData) {
      setFullName(profileData.full_name || '');
      setVehicleName(vehicleData?.name || '');
      setAvgConsumption(vehicleData?.avg_consumption || '');
      setTotalKm(vehicleData?.total_km || '');
    }
  }, [profileData, vehicleData, profileLoaded]);

  // Load profile and vehicle once on mount or when session changes (if not loaded already)
  useEffect(() => {
    if (session && !profileLoaded) {
      fetchData();
    }
  }, [session, profileLoaded]);

  const fetchData = async () => {
    setFetching(true);
    setError(null);
    try {
      await onLoadProfile();
    } catch (err) {
      console.error(err);
      setError("Failed to load profile details.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = session.user.id;

      // 1. Update Profile (Name)
      const updatedProfile = await updateUserProfile(userId, fullName);

      // 2. Save Vehicle Info
      const vehiclePayload = {
        name: vehicleName,
        avg_consumption: avgConsumption ? Number(avgConsumption) : null,
        total_km: totalKm ? parseInt(totalKm, 10) : null
      };
      const updatedVehicle = await saveUserVehicle(userId, vehiclePayload);

      // Update parent cache
      onSaveSuccess(updatedProfile, updatedVehicle);

      setSuccess("Profile and vehicle information saved successfully!");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    setUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setPasswordSuccess("Password updated successfully!");
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSendResetEmail = async () => {
    setUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(session.user.email, {
        redirectTo: window.location.origin
      });
      if (resetError) throw resetError;
      setPasswordSuccess(`Password reset email sent to ${session.user.email}! Please check your inbox.`);
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || "Failed to send password reset email.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!session) {
    return (
      <div className="glass-panel text-center py-12 px-6 max-w-xl mx-auto my-8 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg border border-white border-opacity-10" style={{ background: 'var(--gradient-primary)' }}>
          <User size={32} className="text-white" />
        </div>
        <h2 className="text-2xl text-gradient mb-3" style={{ fontWeight: 700 }}>Personal Profile</h2>
        <p className="text-muted mb-6 leading-relaxed">
          Create a free account or log in to manage your profile and vehicle details. 
          Storing your vehicle's fuel average and mileage allows RideMint to calculate exact margins and suggest optimal shifts.
        </p>
        <button 
          onClick={onTriggerLogin} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', margin: '0 auto', padding: '0.75rem 2rem' }}
        >
          Log In / Create Account
        </button>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="text-center py-16 text-muted animate-fade-in">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
        <p>Loading your profile and vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg border border-white border-opacity-20" style={{ background: 'var(--gradient-primary)' }}>
          <User size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl text-gradient">Profile Management</h2>
          <p className="text-muted text-sm">Configure your personal and vehicle credentials</p>
        </div>
      </div>

      {error && (
        <div className="login-alert login-alert-danger mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-danger flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="login-alert login-alert-success mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-success flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Personal Details Panel */}
        <div className="glass-panel">
          <div className="flex items-center gap-2 mb-4 border-b border-white border-opacity-10 pb-3">
            <User size={18} className="text-accent-primary" />
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          </div>
          
          <div className="form-group mb-0">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hamas Naveed"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-muted text-xs mt-1">This name will be displayed in your workspace and logs.</p>
          </div>
        </div>

        {/* Vehicle Details Panel */}
        <div className="glass-panel">
          <div className="flex justify-between items-center mb-4 border-b border-white border-opacity-10 pb-3">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-accent-primary" />
              <h3 className="text-lg font-semibold text-white">Vehicle Information</h3>
            </div>
            <span className="badge text-xs font-semibold px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
              Optional but Recommended
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-1.5">
                Vehicle Name / Model
                <span className="text-muted text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Toyota Corolla, Suzuki Alto"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-1.5">
                  <Fuel size={14} className="text-muted" />
                  Fuel Average (AVG)
                  <span className="text-muted text-xs font-normal">(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="form-input"
                    style={{ paddingRight: '4rem' }}
                    placeholder="e.g. 14.5"
                    value={avgConsumption}
                    onChange={(e) => setAvgConsumption(e.target.value)}
                    disabled={loading}
                  />
                  <span className="text-muted text-xs font-medium" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    km / Liter
                  </span>
                </div>
                <p className="text-muted text-xs mt-1">Average kilometers your vehicle runs on 1 Liter of fuel.</p>
              </div>

              <div className="form-group mb-0">
                <label className="form-label flex items-center gap-1.5">
                  <Gauge size={14} className="text-muted" />
                  Total KM Driven
                  <span className="text-muted text-xs font-normal">(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ paddingRight: '3rem' }}
                    placeholder="e.g. 85000"
                    value={totalKm}
                    onChange={(e) => setTotalKm(e.target.value)}
                    disabled={loading}
                  />
                  <span className="text-muted text-xs font-medium" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    km
                  </span>
                </div>
                <p className="text-muted text-xs mt-1">Total current mileage reading on your odometer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button for Profile & Vehicle */}
        <button type="submit" className="btn btn-primary h-[50px] flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Profile & Vehicle Info</span>
            </>
          )}
        </button>
      </form>

      {/* Account Security / Reset Password Section */}
      <div className="glass-panel mt-6">
        <div className="flex items-center gap-2 mb-4 border-b border-white border-opacity-10 pb-3">
          <Lock size={18} className="text-accent-primary" />
          <h3 className="text-lg font-semibold text-white">Account Security</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="form-group mb-0">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input w-full"
                style={{ paddingRight: '2.5rem' }}
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={updatingPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={handleUpdatePassword}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              disabled={updatingPassword || !newPassword}
            >
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>

            <button 
              type="button"
              onClick={handleSendResetEmail}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
              disabled={updatingPassword}
            >
              Send Password Reset Email
            </button>
          </div>
          
          {passwordError && (
            <div className="text-danger text-sm mt-1">⚠️ {passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="text-success text-sm mt-1">✓ {passwordSuccess}</div>
          )}
        </div>
      </div>
    </div>
  );
}
