"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [deletePw, setDeletePw] = useState('');
  const [loginHistory, setLoginHistory] = useState<{ login_at: string }[]>([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch login history when modal opens
  useEffect(() => {
    if (showLoginHistory && user) {
      setLoginHistoryLoading(true);
      supabase
        .from('login_history')
        .select('login_at')
        .eq('user_id', user.id)
        .order('login_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setLoginHistory(data);
          setLoginHistoryLoading(false);
        });
    }
  }, [showLoginHistory, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fdf8] flex items-center justify-center">
        <div className="text-4xl text-[#2e3d27]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Change Password Handler
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');
    setPwLoading(true);
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setChangePwError('New passwords do not match.');
      setPwLoading(false);
      return;
    }
    // Re-authenticate user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: pwForm.oldPassword,
    });
    if (signInError) {
      setChangePwError('Old password is incorrect.');
      setPwLoading(false);
      return;
    }
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: pwForm.newPassword });
    if (updateError) {
      setChangePwError(updateError.message);
    } else {
      setChangePwSuccess('Password changed successfully.');
      setShowChangePassword(false);
      setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    }
    setPwLoading(false);
  }

  // Delete Account Handler
  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteError('');
    setDeleteSuccess('');
    setDeleting(true);
    // Re-authenticate user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: deletePw,
    });
    if (signInError) {
      setDeleteError('Password is incorrect.');
      setDeleting(false);
      return;
    }
    // Delete user
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    setDeleting(false);
    if (error) {
      setDeleteError(error.message);
    } else {
      setDeleteSuccess('Account deleted successfully.');
      setShowDeleteAccount(false);
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fdf8] px-6 py-10 text-[#2e3d27]">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-xl hover:text-[#60ab66] transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Homepage
          </a>
        </div>

        {/* Header */}
        <div className="bg-[#60ab66] p-10 rounded-xl shadow-md mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-xl text-[#f1fdf6]">
            Manage your preferences and security settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security */}
          <div className="bg-white border border-[#60ab66] p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-[#2e3d27]">Security</h2>
            <div className="space-y-4">
              <button
                className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
              <button
                className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition"
                onClick={() => setShowLoginHistory(true)}
              >
                Login History
              </button>
              <button
                className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition"
                onClick={() => setShowDeleteAccount(true)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#60ab66] p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-[#2e3d27]">Notifications</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Email Notifications
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Workout Reminders
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Progress Updates
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white border border-[#60ab66] p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-[#2e3d27]">Account Info</h2>
            <div className="space-y-4">
              <div className="p-4 border border-[#e6f4ea] bg-[#f8fdf8] rounded-lg">
                <p className="text-sm text-[#60ab66]">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div className="p-4 border border-[#e6f4ea] bg-[#f8fdf8] rounded-lg">
                <p className="text-sm text-[#60ab66]">Member Since</p>
                <p className="text-lg font-semibold">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-4 border border-[#e6f4ea] bg-[#f8fdf8] rounded-lg">
                <p className="text-sm text-[#60ab66]">Workouts Done</p>
                <p className="text-lg font-semibold">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => { setShowChangePassword(false); setChangePwError(''); setChangePwSuccess(''); setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); }}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-[#2e3d27]">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Old Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" required value={pwForm.oldPassword} onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" required value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" className="w-full border rounded px-3 py-2" required value={pwForm.confirmNewPassword} onChange={e => setPwForm(f => ({ ...f, confirmNewPassword: e.target.value }))} />
              </div>
              {changePwError && <div className="text-red-600">{changePwError}</div>}
              {changePwSuccess && <div className="text-green-600">{changePwSuccess}</div>}
              <button type="submit" className="w-full bg-[#60ab66] text-white rounded-lg py-2 text-lg" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => { setShowDeleteAccount(false); setDeleteError(''); setDeletePw(''); }}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-[#2e3d27]">Delete Account</h3>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Enter your password to confirm</label>
                <input type="password" className="w-full border rounded px-3 py-2" required value={deletePw} onChange={e => setDeletePw(e.target.value)} />
              </div>
              {deleteError && <div className="text-red-600">{deleteError}</div>}
              <button type="submit" className="w-full bg-red-600 text-white rounded-lg py-2 text-lg" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Account'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Login History Modal */}
      {showLoginHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowLoginHistory(false)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-[#2e3d27]">Login History</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {loginHistoryLoading ? (
                <div>Loading...</div>
              ) : loginHistory.length === 0 ? (
                <div>No login history found.</div>
              ) : (
                loginHistory.map((entry, idx) => (
                  <div key={idx} className="border-b py-1 text-[#2e3d27] text-sm">
                    {new Date(entry.login_at).toLocaleString()}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* Delete Account Feedback */}
      {deleteError && !showDeleteAccount && (
        <div className="mt-4 text-red-600">{deleteError}</div>
      )}
      {deleteSuccess && (
        <div className="mt-4 text-green-600">{deleteSuccess}</div>
      )}
    </div>
  );
}
