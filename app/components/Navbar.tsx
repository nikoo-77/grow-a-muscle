"use client";
import { useAuth, User } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { useState, useEffect } from 'react';
import BMICalculatorModal from './BMICalculatorModal';
import ProgramsModal from './ProgramsModal';
import { supabase } from '../../lib/supabaseClient';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import Image from "next/image";
import { UserProfile } from '../types/UserProfile';

type Notification = { id: string; type: string; message: string; read: boolean; created_at?: string };

export default function Navbar() {
  const { user, loading } = useAuth();
  const [bmiOpen, setBmiOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [invalidTime, setInvalidTime] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && typeof user === 'object' && 'id' in user) {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, gender, experience_level, workout_time, fitness_goal, created_at, last_login, height, weight, medical_info, emergency_contacts, profile_picture')
          .eq('id', (user as User).id)
          .single();
        if (!error) setUserProfile(data as UserProfile);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (user && typeof user === 'object' && 'id' in user) {
      setNotifLoading(true);
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', (user as User).id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setNotifications(data);
          }
          setNotifLoading(false);
        });
    } else {
      setNotifications([]);
    }
  }, [user, notifOpen]);

  useEffect(() => {
    if (user && window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [user]);

  // Listen for new notifications in real-time
  useEffect(() => {
    if (!user || typeof user !== 'object' || !('id' in user)) return;
    const notifSub = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${(user as User).id}` }, payload => {
        const notif = payload.new as Notification;
        setNotifications(prev => [notif, ...prev]);
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('New Notification', { body: notif.message });
        }
      })
      .subscribe();
    return () => { notifSub.unsubscribe(); };
  }, [user]);

  // Determine the correct workouts link for the user
  let workoutsLink = "/workouts";
  if (userProfile && typeof userProfile === 'object' && 'fitness_goal' in userProfile && userProfile.fitness_goal) {
    workoutsLink = `/workouts/${userProfile.fitness_goal}`;
  }

  // Mark all as read when opening notifications
  const handleOpenNotif = async () => {
    setNotifOpen(true);
    const unreadCount = notifications.filter((n) => !n.read).length;
    if (user && typeof user === 'object' && 'id' in user && unreadCount > 0) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', (user as User).id)
        .eq('read', false);
      // Refetch notifications to update read status and unread count
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', (user as User).id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setNotifications(data);
      }
    }
  };

  // Helper to format relative time
  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  // Helper to get icon for notification type
  function notifIcon(type: string) {
    if (type === 'like') return (
      <span className="text-pink-500 mr-2" title="Like">♥</span>
    );
    if (type === 'comment') return (
      <span className="text-blue-500 mr-2" title="Comment">💬</span>
    );
    if (type === 'reminder') return (
      <span className="text-green-500 mr-2" title="Reminder">⏰</span>
    );
    return null;
  }

  useEffect(() => {
    if (!user || typeof user !== 'object' || !('id' in user) || !userProfile?.workout_time) return;
    setInvalidTime(false);
    // Parse workout_time (e.g., '6:00 PM' or '18:00')
    const parseTime = (timeStr: string) => {
      const date = new Date();
      let h = 0, m = 0;
      let pm = false;
      timeStr = timeStr.trim();
      // 12-hour format
      const match12 = timeStr.match(/^(1[0-2]|0?[1-9]):([0-5][0-9])\s*(am|pm)$/i);
      // 24-hour format
      const match24 = timeStr.match(/^([01]?\d|2[0-3]):([0-5][0-9])$/);
      if (match12) {
        h = parseInt(match12[1], 10);
        m = parseInt(match12[2], 10);
        pm = match12[3].toLowerCase() === 'pm';
        if (pm && h < 12) h += 12;
        if (!pm && h === 12) h = 0;
      } else if (match24) {
        h = parseInt(match24[1], 10);
        m = parseInt(match24[2], 10);
      } else {
        setInvalidTime(true);
        console.warn('Invalid workout time format:', timeStr);
        return null;
      }
      date.setHours(h, m, 0, 0);
      return date;
    };
    const scheduleNextNotification = () => {
      const now = new Date();
      let workoutDate = parseTime(userProfile.workout_time!);
      if (!workoutDate || isNaN(workoutDate.getTime())) return;
      // If the time has already passed today, schedule for tomorrow
      if (now > workoutDate) {
        workoutDate.setDate(workoutDate.getDate() + 1);
      }
      const msUntil = workoutDate.getTime() - now.getTime();
      const timer = setTimeout(async () => {
        // Insert notification in DB
        await supabase.from('notifications').insert([
          {
            user_id: (user as User).id,
            type: 'reminder',
            message: `It's time for your workout! (${userProfile.workout_time})`,
          },
        ]);
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Workout Reminder', {
            body: `It's time for your workout! (${userProfile.workout_time})`
          });
        }
        // Schedule the next notification for the next day
        scheduleNextNotification();
      }, msUntil);
      return timer;
    };
    const timer = scheduleNextNotification();
    return () => timer && clearTimeout(timer);
  }, [user, userProfile?.workout_time]);

  // Delete a single notification
  const handleDeleteNotification = async (notifId: string) => {
    if (!user || typeof user !== 'object' || !('id' in user)) return;
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notifId)
      .eq('user_id', (user as User).id);
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // Delete all notifications
  const handleClearAllNotifications = async () => {
    if (!user || typeof user !== 'object' || !('id' in user)) return;
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', (user as User).id);
    setNotifications([]);
  };

  return (
    <nav
      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-white bg-[#60ab66] fixed w-full top-0 left-0 z-30 shadow-lg"
    >
      {/* Left: Logo + Text */}
      <div className="flex items-center space-x-3 mb-2 md:mb-0">
        <Image src="/logo1.png" alt="Logo" width={80} height={80} className="h-20 w-20" />
        <Link href="/" className="text-3xl font-bold" style={{ color: '#fdfcf7' }}>Grow A Muscle</Link>
      </div>

      {/* Right: Nav Links + Login */}
      <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
        <button
          className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}
          onClick={() => setProgramsOpen(true)}
          type="button"
        >
          Programs
        </button>
        <Link href={workoutsLink} className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}>Workouts</Link>
        <Link href="/progress" className="text-2xl hover:text-blue-400" style={{ color: '#fdfcf7' }}>Progress</Link>
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
        <a
          href="/about"
          className="text-2xl font-medium hover:text-blue-400"
          style={{ color: '#fdfcf7' }}
        >
          About Us
        </a>
        {/* Notification Bell */}
        {user && (
          <div className="relative">
            <button
              className="relative focus:outline-none"
              onClick={handleOpenNotif}
              aria-label="Notifications"
            >
              <BellIcon className="h-8 w-8 text-white" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-[#2e3d27] rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b font-bold text-lg flex justify-between items-center">
                  Notifications
                  <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
                </div>
                <div className="flex justify-end px-4 py-2 border-b">
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-sm text-red-600 hover:underline font-semibold"
                    disabled={notifications.length === 0}
                  >
                    Clear All
                  </button>
                </div>
                {notifLoading ? (
                  <div className="p-4">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4">No notifications.</div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={notif.id || idx} className={`flex items-start gap-2 p-4 border-b last:border-b-0 ${!notif.read ? 'bg-[#e6f4ea]' : ''}`}>
                      <div className="mt-1">{notifIcon(notif.type)}</div>
                      <div className="flex-1">
                        <div className="font-medium">{notif.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{notif.created_at ? timeAgo(notif.created_at) : ''}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="ml-2 text-gray-400 hover:text-red-600 text-lg"
                        title="Delete notification"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {loading ? (
          <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
        ) : user ? (
          <ProfileDropdown profilePicture={userProfile && typeof userProfile === 'object' && 'profile_picture' in userProfile ? userProfile.profile_picture : undefined} user={user} userProfile={userProfile} />
        ) : (
          <a
            href="/login"
            className="bg-[#97d39b] text-[#00000] px-6 py-3 text-2xl rounded hover:bg-[#60ab66] transition font-bold"
          >
            Login
          </a>
        )}
      </div>
      <BMICalculatorModal open={bmiOpen} onClose={() => setBmiOpen(false)} userProfile={userProfile ? { height: (userProfile as any).height ?? undefined, weight: (userProfile as any).weight ?? undefined } : undefined} />
      <ProgramsModal open={programsOpen} onClose={() => setProgramsOpen(false)} user={user} userProfile={userProfile as UserProfile} />
    </nav>
  );
}
