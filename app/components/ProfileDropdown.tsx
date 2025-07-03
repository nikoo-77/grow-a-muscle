"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface ProfileDropdownProps {
  profilePicture?: string | null;
  user?: any;
}

export default function ProfileDropdown({ profilePicture, user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Picture Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-white text-[#27233A] rounded-full hover:bg-gray-200 transition-colors text-2xl font-bold"
      >
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(user?.email || 'U')
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-[#505168] text-white rounded-full text-xl font-bold mr-3">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.email || 'U')
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/account-settings');
              }}
              className="w-full px-4 py-3 text-left text-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <span className="mr-3">⚙️</span>
              Account Settings
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/personal-information');
              }}
              className="w-full px-4 py-3 text-left text-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <span className="mr-3">👤</span>
              Personal Information
            </button>
            
            <hr className="my-2 border-gray-200" />
            
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left text-lg text-red-600 hover:bg-red-50 transition-colors flex items-center"
            >
              <span className="mr-3"></span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 