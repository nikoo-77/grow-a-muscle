"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Change Password
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Login History
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

          {/* Privacy */}
          <div className="bg-white border border-[#60ab66] p-8 rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-[#2e3d27]">Privacy</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Profile Visibility
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Data Export
              </button>
              <button className="w-full text-left p-4 bg-[#60ab66] hover:bg-[#6ed076] text-white rounded-lg text-lg transition">
                Delete Account
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
                  {user.metadata && user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className="p-4 border border-[#e6f4ea] bg-[#f8fdf8] rounded-lg">
                <p className="text-sm text-[#60ab66]">Last Sign In</p>
                <p className="text-lg font-semibold">
                  {user.metadata && user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
