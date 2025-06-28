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
        console.log('Navbar - User object:', user);
        console.log('Navbar - User ID:', user.id);
        const { data, error } = await supabase
          .from('users')
          .select('height, weight, fitness_goal')
          .eq('id', user.id)
          .single();
        console.log('Navbar - Query result:', { data, error });
        
        if (error) {
          console.error("Navbar - Error fetching user profile:", error);
          
          // If the user profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            console.log('Navbar - Creating user profile...');
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
                medical_info: null,
                profile_picture: null,
                emergency_contacts: null
              })
              .select('height, weight, fitness_goal')
              .single();
            
            if (createError) {
              console.error("Navbar - Error creating user profile:", createError);
              if (createError.code === '42501') {
                console.warn("Navbar - RLS policy violation. Please configure RLS policies in Supabase dashboard.");
                // Set a default profile for now
                setUserProfile({
                  height: null,
                  weight: null,
                  fitness_goal: 'muscle-building'
                });
              }
            } else {
              console.log('Navbar - User profile created:', newProfile);
              setUserProfile(newProfile);
            }
          }
        } else {
          setUserProfile(data);
        }
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-white"
      style={{ backgroundColor: "#60ab66" }}
    >
      {/* Left: Logo + Text */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <img src="/logo1.png" alt="Logo" className="h-20 w-20" />
        <span className="text-3xl font-bold" style={{ color: '#fdfcf7' }}>growamuscle.com</span>
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
        {loading ? (
          <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
        ) : user ? (
          // Show profile dropdown when logged in
          <ProfileDropdown />
        ) : (
          // Show only login button when not logged in
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
