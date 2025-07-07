"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { checkWeeklyWorkoutCompletion, markWeeklyWorkoutCompleted, getWeeklyWorkoutStatus, getWeekStart, getWeekEnd } from '../../../lib/supabaseWorkouts';

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Workout = {
  title: string;
  subtitle: string;
  img?: string;
  video: string;
  weight: 'light' | 'moderate' | 'heavy';
};

// Track completed exercises
type CompletedExercise = {
  exerciseTitle: string;
  sets: number;
  weight: number;
  completedAt: string;
};

const sampleVideos = [
  "/images/Grow a Muscle/Improve Endurance and Stamina/interval.mp4", //0 Interval Running
  "/images/Grow a Muscle/Weight Loss/jumprope.mp4", //1 Jump Rope
  "/images/Grow a Muscle/Improve Endurance and Stamina/rowing.mp4", //2 Rowing
  "/images/Grow a Muscle/Weight Loss/burpees.mp4", //3 Burpees
  "/images/Grow a Muscle/Active Lifestyle/jog.mp4", //4 Long Distance Running
  "/images/Grow a Muscle/Improve Endurance and Stamina/stairclimb.mp4", //5 Stair Climbing
  "/images/Grow a Muscle/Weight Loss/mountain.mp4", //6 Mountain Climbers
  "/images/Grow a Muscle/Weight Loss/boxjump.mp4", //7 Box Jumps
];

const workoutPool: Workout[] = [
  { title: "Interval Running", subtitle: "Target: Cardio\n1 set of 30 minute", video: sampleVideos[0], weight: 'moderate' },
  { title: "Jump Rope", subtitle: "Target: Cardio\n3 sets of 60 seconds", video: sampleVideos[1], weight: 'light' },
  { title: "Rowing", subtitle: "Target: Cardio, Full Body\n3 sets of 60 seconds", video: sampleVideos[2], weight: 'moderate' },
  { title: "Burpees", subtitle: "Target: Full Body\n3 sets of 45 seconds", video: sampleVideos[3], weight: 'moderate' },
  { title: "Long Distance Running", subtitle: "Target: Cardio\n1 set of 30-60 minutes", video: sampleVideos[4], weight: 'moderate' },
  { title: "Stair Climbing", subtitle: "Target: Cardio, Legs\n1 sets of 30-60 minutes", video: sampleVideos[5], weight: 'light' },
  { title: "Mountain Climbers", subtitle: "Target: Cardio, Core\n3 sets of 45 seconds", video: sampleVideos[6], weight: 'moderate' },
  { title: "Box Jumps", subtitle: "Target: Legs, Cardio\n3 sets of 30 seconds", video: sampleVideos[7], weight: 'moderate' },
];

function getRandomWorkouts(): Workout[] {
  const count = Math.floor(Math.random() * 3) + 5; // 5-7
  const shuffled = [...workoutPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const workoutsByDay: { [key: string]: Workout[] } = {
  Monday: getRandomWorkouts(),
  Tuesday: getRandomWorkouts(),
  Wednesday: [],
  Thursday: getRandomWorkouts(),
  Friday: getRandomWorkouts(),
  Saturday: getRandomWorkouts(),
  Sunday: [],
};

export default function ImproveEnduranceStaminaPage() {
  // Get current day of the week
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Workout | null>(null);
  const [sets, setSets] = useState(3);
  const [weight, setWeight] = useState(0);
  const [showFinishSessionModal, setShowFinishSessionModal] = useState(false);
  const { user } = useAuth();
  const [sessionWeight, setSessionWeight] = useState('');
  const [savingSession, setSavingSession] = useState(false);
  const [personalizedWorkouts, setPersonalizedWorkouts] = useState<{ [key: string]: Workout[] } | null>(null);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [repsDuration, setRepsDuration] = useState(0);
  const [sessionLocked, setSessionLocked] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState<any>({});
  
  useEffect(() => {
    const fetchOrCreateWorkouts = async () => {
      if (!user) {
        setPersonalizedWorkouts(null);
        setLoadingWorkouts(false);
        return;
      }
      setLoadingWorkouts(true);
      const goalKey = "improve-endurance-and-stamina";
      // Fetch all days for this user and goal
      const { data, error } = await supabase
        .from('user_program_workouts')
        .select('day, workouts')
        .eq('user_id', user.id ?? user.uid)
        .eq('goal_key', goalKey);
      if (!error && data && data.length === 7) {
        // Build workoutsByDay from DB
        const byDay: { [key: string]: Workout[] } = {};
        data.forEach(row => {
          byDay[row.day] = row.workouts;
        });
        setPersonalizedWorkouts(byDay);
        setLoadingWorkouts(false);
      } else {
        // Generate, save, and use
        const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const generated: { [key: string]: Workout[] } = {};
        const inserts = days.map(day => {
          const w = day === "Wednesday" || day === "Sunday" ? [] : getRandomWorkouts();
          generated[day] = w;
          return {
            user_id: user.id ?? user.uid,
            goal_key: goalKey,
            day,
            workouts: w,
          };
        });
        await supabase.from('user_program_workouts').insert(inserts);
        setPersonalizedWorkouts(generated);
        setLoadingWorkouts(false);
      }
    };
    fetchOrCreateWorkouts();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, fitness_goal')
          .eq('id', user.id ?? user.uid)
          .single();
        if (!error) setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const checkSessionLock = async () => {
      if (user) {
        const completed = await checkWeeklyWorkoutCompletion(user.id || user.uid, 'improve-endurance-and-stamina', selectedDay);
        setSessionLocked(!!completed);
      } else {
        setSessionLocked(false);
      }
    };
    checkSessionLock();
  }, [user, selectedDay]);

  // Fetch completed exercises for the selected day
  useEffect(() => {
    async function fetchCompletedExercises() {
      if (!user) {
        setCompletedExercises([]);
        return;
      }
      const { data, error } = await supabase
        .from('weekly_workout_sessions')
        .select('exercises')
        .eq('user_id', user.id)
        .eq('workout_type', 'improve-endurance-and-stamina')
        .eq('day_of_week', selectedDay)
        .single();
      if (!error && data && data.exercises) {
        setCompletedExercises(data.exercises);
      } else {
        setCompletedExercises([]);
      }
    }
    fetchCompletedExercises();
  }, [user, selectedDay]);

  // Fetch weekly workout status for all days
  useEffect(() => {
    async function fetchWeeklyStatus() {
      if (!user) {
        setWeeklyStatus({});
        return;
      }
      const status = await getWeeklyWorkoutStatus(user.id, 'improve-endurance-and-stamina');
      setWeeklyStatus(status || {});
    }
    fetchWeeklyStatus();
  }, [user]);

  const workouts = personalizedWorkouts ? personalizedWorkouts[selectedDay] : workoutsByDay[selectedDay];
  const isRestDay = workouts.length === 0;
  const isCurrentDay = selectedDay === getCurrentDay();
  const completedCount = completedExercises.length;
  const totalExercises = workouts.length;

  const handleFinishExercise = (exercise: Workout) => {
    setCurrentExercise(exercise);
    setSets(3); // Default to 3 sets
    setWeight(0); // Default to 0 weight
    setShowFinishModal(true);
  };

  const confirmFinishExercise = async () => {
    if (currentExercise) {
      const completedExercise: CompletedExercise = {
        exerciseTitle: currentExercise.title,
        sets: sets,
        weight: weight,
        completedAt: new Date().toISOString()
      };
      // Save to exercise_log table
      if (user) {
        const { error } = await supabase.from('exercise_log').insert([
          {
            user_id: user.id || user.uid,
            first_name: userProfile?.first_name || null,
            last_name: userProfile?.last_name || null,
            fitness_goal: userProfile?.fitness_goal || null,
            exercise_name: currentExercise.title,
            sets: sets,
            reps_duration: repsDuration,
            weight_lifted: weight,
            date: new Date().toISOString(),
          },
        ]);
        if (error) {
          alert('Error saving exercise log: ' + error.message);
        }
      }
      setCompletedExercises(prev => [...prev, completedExercise]);
      setShowFinishModal(false);
      setCurrentExercise(null);
      setRepsDuration(0);
    }
  };

  const isExerciseCompleted = (exerciseTitle: string) => {
    return completedExercises.some(ex => ex.exerciseTitle === exerciseTitle);
  };

  const handleFinishSession = () => {
    setShowFinishSessionModal(true);
  };

  const confirmFinishSession = async () => {
    if (!sessionWeight || !user) return;
    setSavingSession(true);
    try {
      await markWeeklyWorkoutCompleted(user.id || user.uid, 'improve-endurance-and-stamina', selectedDay, completedExercises);
      // Insert progress notification if enabled
      const { data: userPrefs } = await supabase
        .from('users')
        .select('progress_updates')
        .eq('id', user.id)
        .single();
      if (userPrefs && userPrefs.progress_updates) {
        await supabase.from('notifications').insert([
          {
            user_id: user.id,
            type: 'progress',
            message: `Congrats! You completed your ${selectedDay} endurance & stamina session.`,
          },
        ]);
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Workout Complete!', {
            body: `Congrats! You completed your ${selectedDay} endurance & stamina session.`
          });
        }
      }
      const newStatus = await getWeeklyWorkoutStatus(user.id || user.uid, 'improve-endurance-and-stamina');
      setShowFinishSessionModal(false);
      setSessionWeight('');
      setSessionCompleted(true);
      setSessionLocked(true);
      setTimeout(() => {
        setSessionCompleted(false);
      }, 3000);
    } catch (error: any) {
      if (error?.message && error.message.includes('already been completed this week')) {
        setSessionLocked(true);
        setShowFinishSessionModal(false);
        setSessionCompleted(true);
        setTimeout(() => {
          setSessionCompleted(false);
        }, 3000);
      } else {
        alert('Error completing session: ' + (error?.message || error));
      }
    } finally {
      setSavingSession(false);
    }
  };

  if (loadingWorkouts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#60ab66] font-bold">Loading your workouts...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">Improve Endurance and Stamina Workouts</h1>
        {/* Day Selector */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {weekDays.map((day) => {
            const dayCompletedExercises = weeklyStatus[day]?.exercises || [];
            const hasCompletedExercises = dayCompletedExercises.length > 0;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-semibold transition border-2 relative ${
                  selectedDay === day
                    ? "bg-[#60ab66] text-white border-[#60ab66]"
                    : hasCompletedExercises
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-white text-[var(--foreground)] border-[#e0e5dc] hover:bg-[#e0e5dc]"
                }`}
              >
                {day}
                {hasCompletedExercises && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dayCompletedExercises.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <section className="w-full max-w-4xl bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#60ab66] mb-1">{selectedDay}</h2>
          {isRestDay ? (
            <div className="text-center py-16 text-xl font-semibold text-[#60ab66]">
              Rest Day! Take time to recover and come back stronger.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {workouts.map((w: Workout, i: number) => (
                  <div key={i} className="bg-[#e0e5dc] rounded-xl overflow-hidden shadow flex flex-col">
                    <div className="relative w-full h-48 flex items-center justify-center bg-black">
                      <video
                        key={`${selectedDay}-${w.title}`}
                        controls
                        width="100%"
                        height="100%"
                        className="w-full h-full rounded-t-xl"
                        style={{ objectFit: 'contain' }}
                      >
                        <source src={w.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-semibold text-lg" style={{ color: 'black' }}>{w.title}</div>
                        <div className="text-sm text-gray-600" style={{ whiteSpace: "pre-line" }}>
                          {w.subtitle}
                          {"\n"}
                          <span style={{ color: w.weight === 'light' ? '#22c55e' : w.weight === 'moderate' ? '#f59e42' : '#ef4444', fontWeight: 600 }}>
                            Recommended: {w.weight === 'light' ? 'Light Weight' : w.weight === 'moderate' ? 'Moderate Weight' : 'Heavy Weight'}
                          </span>
                        </div>
                      </div>
                      <button
                        className={`mt-4 font-semibold py-2 px-4 rounded-xl transition ${
                          !isCurrentDay || sessionLocked || isExerciseCompleted(w.title)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#60ab66] hover:bg-[#4c8a53] text-white"
                        }`}
                        onClick={() => isCurrentDay && !sessionLocked && !isExerciseCompleted(w.title) && handleFinishExercise(w)}
                        disabled={!isCurrentDay || sessionLocked || isExerciseCompleted(w.title)}
                      >
                        {isExerciseCompleted(w.title) ? "✓ Completed" : "Finish Exercise"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center mt-8">
                <button 
                  className={`font-semibold py-3 px-8 rounded-xl text-lg transition w-full max-w-md mb-2 ${
                    sessionLocked || completedCount === 0 
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                      : completedCount > 0 
                        ? "bg-green-600 text-white cursor-pointer hover:bg-green-700" 
                        : "bg-[#60ab66] hover:bg-[#4c8a53] text-white"
                  }`}
                  onClick={!sessionLocked && completedCount > 0 ? handleFinishSession : undefined}
                  disabled={sessionLocked || completedCount === 0}
                >
                  {sessionLocked 
                    ? "SESSION LOCKED UNTIL NEXT WEEK" 
                    : completedCount > 0 
                      ? `FINISH SESSION (${completedCount}/${totalExercises})` 
                      : "COMPLETE EXERCISES TO FINISH SESSION"
                  }
                </button>
                {sessionLocked && (
                  <div className="text-center mt-2 text-sm text-red-600 font-semibold w-full max-w-md">
                    This session is locked until next week. You have already finished this session.
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Finish Exercise Modal */}
      {showFinishModal && currentExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-[#2e3d27]">Complete Exercise</h3>
            <p className="text-lg mb-6 text-[#2e3d27]">{currentExercise.title}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2e3d27]">Number of Sets</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#2e3d27]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2e3d27]">Number of Reps/Duration</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={repsDuration}
                  onChange={(e) => setRepsDuration(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#2e3d27]"
                  placeholder="Enter reps or duration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2e3d27]">Weight Used (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#2e3d27]"
                  placeholder="0 for bodyweight exercises"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinishExercise}
                className="flex-1 py-2 px-4 bg-[#60ab66] text-white rounded-lg font-semibold hover:bg-[#4c8a53] transition"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Session Modal */}
      {showFinishSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-[#2e3d27]">Complete Session</h3>
            <p className="text-lg mb-6 text-[#2e3d27]">
              You have completed <span className="font-bold">{completedCount}</span> workouts.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#2e3d27]">Current Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={sessionWeight}
                onChange={e => setSessionWeight(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#2e3d27]"
                placeholder="Enter your current weight"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFinishSessionModal(false)}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                disabled={savingSession}
              >
                Cancel
              </button>
              <button
                onClick={confirmFinishSession}
                className="flex-1 py-2 px-4 bg-[#60ab66] text-white rounded-lg font-semibold hover:bg-[#4c8a53] transition"
                disabled={!sessionWeight || savingSession}
              >
                {savingSession ? 'Saving...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 