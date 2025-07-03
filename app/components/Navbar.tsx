import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { useState, useEffect } from 'react';
import BMICalculatorModal from './BMICalculatorModal';
import ProgramsModal from './ProgramsModal';
import ProgressModal from './ProgressModal';
import { supabase } from '../../lib/supabaseClient';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [bmiOpen, setBmiOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('height, weight, fitness_goal, profile_picture')
          .eq('id', user.id ?? user.uid)
          .single();
        if (!error) setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-white bg-[#60ab66] fixed w-full top-0 left-0 z-30 shadow-lg"
    >
      {/* Left: Logo + Text */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <img src="/logo1.png" alt="Logo" className="h-20 w-20" />
        <a href="/" className="text-3xl font-bold" style={{ color: '#fdfcf7' }}>Grow A Muscle</a>
      </div>

      {/* Right: Nav Links + Login */}
      <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}>Workouts</a>
        <button
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
          onClick={() => setProgramsOpen(true)}
          type="button"
        >
          Programs
        </button>
        <button
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
          onClick={() => setProgressOpen(true)}
          type="button"
        >
          Progress
        </button>
        <button
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
          onClick={() => setBmiOpen(true)}
          type="button"
        >
          BMI Calculator
        </button>
        <a
          href="/healthy-living"
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
        >
          Healthy Living
        </a>
        <a
          href="/community"
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
        >
          Community
        </a>
        {loading ? (
          <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
        ) : user ? (
          <ProfileDropdown profilePicture={userProfile?.profile_picture} user={user} />
        ) : (
          <a
            href="/login"
            className="bg-[#97d39b] text-[#00000] px-6 py-3 text-2xl rounded hover:bg-[#60ab66] transition font-bold"
          >
            Login
          </a>
        )}
      </div>
      <BMICalculatorModal open={bmiOpen} onClose={() => setBmiOpen(false)} userProfile={userProfile} />
      <ProgramsModal open={programsOpen} onClose={() => setProgramsOpen(false)} user={user} userProfile={userProfile} />
      <ProgressModal open={progressOpen} onClose={() => setProgressOpen(false)} userId={user?.id ?? user?.uid ?? null} />
    </nav>
  );
}
