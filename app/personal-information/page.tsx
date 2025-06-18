"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  fitnessGoal: string;
  createdAt: any;
  lastLogin: any;
}

export default function PersonalInformationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  if (loading || profileLoading) {
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
          <h1 className="text-6xl font-bold text-white mb-4">👤 Personal Information</h1>
          <p className="text-2xl text-gray-300">
            View and manage your personal profile information
          </p>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6">📝 Basic Information</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">First Name</p>
                <p className="text-xl font-semibold">{userProfile?.firstName || 'Not set'}</p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Last Name</p>
                <p className="text-xl font-semibold">{userProfile?.lastName || 'Not set'}</p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Email Address</p>
                <p className="text-xl font-semibold">{userProfile?.email || user.email}</p>
              </div>
              <button className="w-full p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Edit Basic Information
              </button>
            </div>
          </div>

          {/* Fitness Information */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6">💪 Fitness Profile</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Primary Fitness Goal</p>
                <p className="text-xl font-semibold capitalize">
                  {userProfile?.fitnessGoal?.replace('-', ' ') || 'Not set'}
                </p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Experience Level</p>
                <p className="text-xl font-semibold">Beginner</p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Preferred Workout Time</p>
                <p className="text-xl font-semibold">Not set</p>
              </div>
              <button className="w-full p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Update Fitness Profile
              </button>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6">📊 Account Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Member Since</p>
                <p className="text-xl font-semibold">
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Last Login</p>
                <p className="text-xl font-semibold">
                  {userProfile?.lastLogin ? 
                    new Date(userProfile.lastLogin.toDate()).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="p-4 bg-[#505168] rounded-lg">
                <p className="text-sm text-gray-300">Total Workouts</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-[#27233A] text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-6">➕ Additional Info</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Add Profile Picture
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Set Height & Weight
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Add Medical Information
              </button>
              <button className="w-full text-left p-4 bg-[#505168] rounded-lg hover:bg-[#3a3555] transition-colors text-xl">
                Emergency Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 