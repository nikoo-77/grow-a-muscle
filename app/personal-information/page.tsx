"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { supabase } from '../../lib/supabaseClient';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  fitness_goal: string;
  created_at: string;
  last_login: string;
  height?: number | null;
  weight?: number | null;
  medical_info?: string;
  emergency_contacts?: any;
  profile_picture?: string;
}

// Fitness goal options (same as signup)
const FITNESS_GOAL_OPTIONS = [
  { value: "strength-training", label: "Strength Training" },
  { value: "lose-weight", label: "Lose Weight" },
  { value: "muscle-building", label: "Muscle Building" },
  { value: "active-lifestyle", label: "Active Lifestyle" },
  { value: "improve-endurance-and-stamina", label: "Improve Endurance & Stamina" },
  { value: "improve-flexibility", label: "Improve Flexibility" },
];

export default function PersonalInformationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [openModal, setOpenModal] = useState<null | "basic" | "fitness" | "picture" | "heightWeight" | "medical" | "emergency">(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log('User object:', user);
        console.log('User ID:', user.id);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        console.log('Query result:', { data, error });
        
        if (error) {
          console.error("Error fetching user profile:", error);
          
          // If the user profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            console.log('Creating user profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                first_name: '',
                last_name: '',
                email: user.email,
                fitness_goal: 'muscle-building',
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                height: null,
                weight: null,
                medical_info: undefined,
                profile_picture: undefined,
                emergency_contacts: undefined
              })
              .select()
              .single();
            
            if (createError) {
              console.error("Error creating user profile:", createError);
              if (createError.code === '42501') {
                console.warn("RLS policy violation. Please configure RLS policies in Supabase dashboard.");
                // Set a default profile for now
                setUserProfile({
                  id: user.id,
                  first_name: '',
                  last_name: '',
                  email: user.email,
                  fitness_goal: 'muscle-building',
                  created_at: new Date().toISOString(),
                  last_login: new Date().toISOString(),
                  height: null,
                  weight: null,
                  medical_info: undefined,
                  profile_picture: undefined,
                  emergency_contacts: undefined
                } as UserProfile);
              }
            } else {
              console.log('User profile created:', newProfile);
              setUserProfile(newProfile as UserProfile);
            }
          }
        } else {
          setUserProfile(data as UserProfile);
        }
        setProfileLoading(false);
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
      {/* Modals */}
      <EditBasicInfoModal
        open={openModal === "basic"}
        onClose={() => setOpenModal(null)}
        userProfile={userProfile}
        user={user}
        onSave={updated => setUserProfile(updated)}
      />
      <EditFitnessProfileModal
        open={openModal === "fitness"}
        onClose={() => setOpenModal(null)}
        userProfile={userProfile}
        user={user}
        onSave={updated => setUserProfile(updated)}
      />
      <AddProfilePictureModal
        open={openModal === "picture"}
        onClose={() => setOpenModal(null)}
        user={user}
        onSave={url => setUserProfile(prev => prev ? { ...prev, profile_picture: url } : null)}
      />
      <SetHeightWeightModal
        open={openModal === "heightWeight"}
        onClose={() => setOpenModal(null)}
        user={user}
        userProfile={userProfile}
        onSave={data => setUserProfile(prev => prev ? { ...prev, height: data.height, weight: data.weight } : null)}
      />
      <AddMedicalInfoModal
        open={openModal === "medical"}
        onClose={() => setOpenModal(null)}
        user={user}
        userProfile={userProfile}
        onSave={data => setUserProfile(prev => prev ? { ...prev, medical_info: data.medical_info } : null)}
      />
      <AddEmergencyContactsModal
        open={openModal === "emergency"}
        onClose={() => setOpenModal(null)}
        user={user}
        userProfile={userProfile}
        onSave={data => setUserProfile(prev => prev ? { ...prev, emergency_contacts: data.emergency_contacts, first_name: prev.first_name, last_name: prev.last_name, email: prev.email, fitness_goal: prev.fitness_goal, created_at: prev.created_at, last_login: prev.last_login, height: prev.height, weight: prev.weight, medical_info: prev.medical_info } : null)}
      />
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
              <InfoCard label="First Name" value={userProfile?.first_name ?? undefined} />
              <InfoCard label="Last Name" value={userProfile?.last_name ?? undefined} />
              <InfoCard label="Email" value={userProfile?.email ?? undefined} />
              <ActionButton label="Edit Basic Information" onClick={() => setOpenModal("basic")}/>
            </div>
          </div>

          {/* Fitness Info */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Fitness Profile</h2>
            <div className="space-y-4">
              <InfoCard label="Fitness Goal" value={userProfile?.fitness_goal?.replace("-", " ") || "Not set"} />
              <InfoCard label="Experience Level" value="Beginner" />
              <InfoCard label="Workout Time" value="Not set" />
              <ActionButton label="Update Fitness Profile" onClick={() => setOpenModal("fitness")}/>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Account Stats</h2>
            <div className="space-y-4">
              <InfoCard label="Member Since" value={userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "N/A"} />
              <InfoCard label="Last Login" value={userProfile?.last_login ? new Date(userProfile.last_login).toLocaleDateString() : "N/A"} />
              <InfoCard label="Total Workouts" value="0" />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white text-[#2e3d27] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Additional Info</h2>
            <div className="space-y-4">
              {userProfile?.profile_picture && (
                <div className="flex justify-center mb-4">
                  <img
                    src={userProfile.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#60ab66]"
                  />
                </div>
              )}
              <ActionButton label="Add Profile Picture" onClick={() => setOpenModal("picture")}/>
              <ActionButton label="Set Height & Weight" onClick={() => setOpenModal("heightWeight")}/>
              <ActionButton label="Add Medical Info" onClick={() => setOpenModal("medical")}/>
              <ActionButton label="Emergency Contacts" onClick={() => setOpenModal("emergency")}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="p-4 border border-[#60ab66] rounded-xl">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value ?? "Not set"}</p>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      className="w-full bg-[#60ab66] hover:bg-[#4c8a53] text-white py-3 px-4 rounded-xl text-lg font-semibold transition"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

// Modal for editing basic info
function EditBasicInfoModal({ open, onClose, userProfile, user, onSave }: { open: boolean; onClose: () => void; userProfile: UserProfile | null; user: any; onSave: (updated: UserProfile) => void }) {
  const [first_name, setFirstName] = useState(userProfile?.first_name || "");
  const [last_name, setLastName] = useState(userProfile?.last_name || "");
  const [email, setEmail] = useState(userProfile?.email || user?.email || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setFirstName(userProfile?.first_name || "");
    setLastName(userProfile?.last_name || "");
    setEmail(userProfile?.email || user?.email || "");
  }, [userProfile, user]);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({ first_name, last_name, email })
        .eq('id', user.id);
      if (error) throw error;
      onSave({ ...(userProfile || {}), first_name, last_name, email } as UserProfile);
      onClose();
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Edit Basic Information</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input className="w-full border rounded px-3 py-2" value={first_name} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input className="w-full border rounded px-3 py-2" value={last_name} onChange={e => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Modal for editing fitness profile
function EditFitnessProfileModal({ open, onClose, userProfile, user, onSave }: { open: boolean; onClose: () => void; userProfile: UserProfile | null; user: any; onSave: (updated: UserProfile) => void }) {
  const [fitness_goal, setFitnessGoal] = useState(userProfile?.fitness_goal || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setFitnessGoal(userProfile?.fitness_goal || ""); }, [userProfile]);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({ fitness_goal })
        .eq('id', user.id);
      if (error) throw error;
      onSave({ ...(userProfile || {}), fitness_goal } as UserProfile);
      onClose();
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Update Fitness Profile</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium">Fitness Goal</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={fitness_goal}
                onChange={e => setFitnessGoal(e.target.value)}
              >
                <option value="">Select a goal</option>
                {FITNESS_GOAL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Modal for adding profile picture
function AddProfilePictureModal({ open, onClose, user, onSave }: { open: boolean; onClose: () => void; user: any; onSave: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!user || !file) return;
    setSaving(true);
    setError(null);
    setProgress(0);
    try {
      // 1. Upload to Supabase Storage in a folder named after the user's id
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/profile.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      // 2. Get public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      // 3. Update user profile with the public URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;
      onSave(publicUrl);
      onClose();
    } catch (e: any) {
      setError("Failed to upload. Please try again.");
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Add Profile Picture</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleUpload(); }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {progress > 0 && progress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#60ab66] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving || !file}>{saving ? (progress < 100 ? `Uploading... ${Math.round(progress)}%` : "Finishing...") : "Upload"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Modal for setting height and weight
function SetHeightWeightModal({ open, onClose, user, userProfile, onSave }: { open: boolean; onClose: () => void; user: any; userProfile: UserProfile | null; onSave: (data: { height: number | null; weight: number | null }) => void }) {
  const [height, setHeight] = useState(userProfile?.height || null);
  const [weight, setWeight] = useState(userProfile?.weight || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({ height, weight })
        .eq('id', user.id);
      if (error) throw error;
      onSave({ height, weight });
      onClose();
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Set Height & Weight</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input className="w-full border rounded px-3 py-2" value={height || ""} onChange={e => setHeight(e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input className="w-full border rounded px-3 py-2" value={weight || ""} onChange={e => setWeight(e.target.value ? Number(e.target.value) : null)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Modal for adding medical info
function AddMedicalInfoModal({ open, onClose, user, userProfile, onSave }: { open: boolean; onClose: () => void; user: any; userProfile: UserProfile | null; onSave: (data: { medical_info: string }) => void }) {
  const [medical_info, setMedicalInfo] = useState(userProfile?.medical_info || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({ medical_info })
        .eq('id', user.id);
      if (error) throw error;
      onSave({ medical_info });
      onClose();
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Add Medical Info</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium">Medical Info</label>
              <textarea className="w-full border rounded px-3 py-2" value={medical_info} onChange={e => setMedicalInfo(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Modal for adding emergency contacts
function AddEmergencyContactsModal({ open, onClose, user, userProfile, onSave }: { open: boolean; onClose: () => void; user: any; userProfile: UserProfile | null; onSave: (data: { emergency_contacts: any }) => void }) {
  const [emergency_contacts, setEmergencyContacts] = useState(userProfile?.emergency_contacts || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({ emergency_contacts })
        .eq('id', user.id);
      if (error) throw error;
      onSave({ emergency_contacts });
      onClose();
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white text-black rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4">Emergency Contacts</DialogTitle>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium">Emergency Contacts</label>
              <textarea className="w-full border rounded px-3 py-2" value={emergency_contacts} onChange={e => setEmergencyContacts(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="button" className="flex-1 py-2 rounded bg-gray-200" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded bg-[#60ab66] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
