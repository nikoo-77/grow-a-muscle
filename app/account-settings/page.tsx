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
      <div className="min-h-screen bg-[white] flex items-center justify-center">
        <div className="text-4xl text-[#27233A]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[white] px-8 py-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Back to Homepage Button */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-xl text-[#27233A] hover:text-[#505168] transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Homepage
          </a>
        </div>

        {/* Header */}
        <div className="bg-[#505168] p-10 rounded-lg shadow-lg mb-8">
          <h1 className="text-6xl font-bold text-white mb-4"> Account Settings</h1>
          <p className="text-2xl text-gray-300">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Security Settings */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6"> Security</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Change Password
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Login History
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6"> Notifications</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Email Notifications
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Workout Reminders
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Progress Updates
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6"> Privacy</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Profile Visibility
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Data Export
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Delete Account
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6"> Account Info</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Email</p>
                <p className="text-xl font-semibold">{user.email}</p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Member Since</p>
                <p className="text-xl font-semibold">
                  {user.metadata.creationTime ? 
                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Last Sign In</p>
                <p className="text-xl font-semibold">
                  {user.metadata.lastSignInTime ? 
                    new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 