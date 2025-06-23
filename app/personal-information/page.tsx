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
    if (user) fetchUserProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#f6f9f6] flex items-center justify-center">
        <div className="text-4xl text-[#2e3d27]">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f6f9f6] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-lg text-[#2e3d27] hover:text-[#60ab66] transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>

        {/* Header */}
        <div className="bg-[#60ab66] p-8 rounded-2xl shadow-lg mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Personal Information</h1>
          <p className="text-xl">View and manage your personal profile</p>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Basic Info</h2>
            <div className="space-y-4">
              <InfoCard label="First Name" value={userProfile?.firstName} />
              <InfoCard label="Last Name" value={userProfile?.lastName} />
              <InfoCard label="Email" value={userProfile?.email || user.email} />
              <ActionButton label="Edit Basic Information" />
            </div>
          </div>

          {/* Fitness Info */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Fitness Profile</h2>
            <div className="space-y-4">
              <InfoCard label="Fitness Goal" value={userProfile?.fitnessGoal?.replace("-", " ") || "Not set"} />
              <InfoCard label="Experience Level" value="Beginner" />
              <InfoCard label="Workout Time" value="Not set" />
              <ActionButton label="Update Fitness Profile" />
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Account Stats</h2>
            <div className="space-y-4">
              <InfoCard label="Member Since" value={userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : "N/A"} />
              <InfoCard label="Last Login" value={userProfile?.lastLogin ? new Date(userProfile.lastLogin.toDate()).toLocaleDateString() : "N/A"} />
              <InfoCard label="Total Workouts" value="0" />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Additional Info</h2>
            <div className="space-y-4">
              <ActionButton label="Add Profile Picture" />
              <ActionButton label="Set Height & Weight" />
              <ActionButton label="Add Medical Info" />
              <ActionButton label="Emergency Contacts" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="p-4 border border-[#60ab66] rounded-xl">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value || "Not set"}</p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="w-full bg-[#60ab66] hover:bg-[#4c8a53] text-white py-3 px-4 rounded-xl text-lg font-semibold transition">
      {label}
    </button>
  );
}
