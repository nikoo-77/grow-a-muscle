import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-white"
      style={{ backgroundColor: "#27233A" }}
    >
      {/* Left: Logo + Text */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <img src="/logo.png" alt="Logo" className="h-20 w-20" />
        <span className="text-3xl font-bold" style={{ color: '#DCC48E' }}>growamuscle.com</span>
      </div>

      {/* Right: Nav Links + Login */}
      <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#DCC48E' }}>Workouts</a>
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#DCC48E' }}>Programs</a>
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#DCC48E' }}>Progress</a>
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#DCC48E' }}>BMI Calculator</a>
        <a href="#" className="text-2xl hover:text-blue-400" style={{ color: '#DCC48E' }}>Healthy Living</a>
        {loading ? (
          <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
        ) : user ? (
          // Show profile dropdown when logged in
          <ProfileDropdown />
        ) : (
          // Show only login button when not logged in
          <a
            href="/login"
            className="bg-[#B3C0A4] text-[#00000] px-6 py-3 text-2xl rounded hover:bg-[#A0AD8C] transition font-bold"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
