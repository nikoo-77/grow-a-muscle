"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { checkWeeklyWorkoutCompletion, markWeeklyWorkoutCompleted, getWeeklyWorkoutStatus, getWeekStart, getWeekEnd } from '../../../lib/supabaseWorkouts';
import SignInPromptModal from '../../components/SignInPromptModal';

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
  "/images/Grow a Muscle/Strength Training/inclinedb.mp4", //0 Incline Dumbbell Press
  "/images/Grow a Muscle/Muscle Building/flatdb.mp4", //1 Flat Dumbbell Press
  "/images/Grow a Muscle/Muscle Building/cableflys.mp4", //2 Cable Flys
  "/images/Grow a Muscle/Muscle Building/pecdeck.mp4", //3 Pec Deck Fly
  "/images/Grow a Muscle/Strength Training/shoulderpress.mp4", //4 Dumbbell Shoulder Press
  "/images/Grow a Muscle/Strength Training/lat.mp4", //5 Lateral Raises
  "/images/Grow a Muscle/Strength Training/triceppushdown.mp4", //6 Rope Pushdowns
  "/images/Grow a Muscle/Muscle Building/tricepdips.mp4", //7 Triceps Dips
  "/images/Grow a Muscle/Muscle Building/pullup.mp4", //8 Pull Ups
  "/images/Grow a Muscle/Strength Training/latpulldown.mp4", //9 Lat Pulldowns
  "/images/Grow a Muscle/Muscle Building/barbellrow.mp4", //10 Barbell Rows
  "/images/Grow a Muscle/Strength Training/facepull.mp4", //11 Face Pull
  "/images/Grow a Muscle/Strength Training/bicep.mp4", //12 Bicep Curls
  "/images/Grow a Muscle/Strength Training/hammer.mp4", //13 Hammer Curls
  "/images/Grow a Muscle/Strength Training/squat.mp4", //14 Barbell Squats
  "/images/Grow a Muscle/Strength Training/bulgarian.mp4", //15 Bulgarian Split Squats
  "/images/Grow a Muscle/Muscle Building/rdl.mp4", //16 Romanian Deadlift
  "/images/Grow a Muscle/Muscle Building/hamstringcurl.mp4", //17 Hamstring Curls
  "/images/Grow a Muscle/Muscle Building/legextension.mp4", //18 Leg Extension
  "/images/Grow a Muscle/Muscle Building/cablecrunch.mp4", //19 Cable Crunches
  "/images/Grow a Muscle/Muscle Building/russiantwist.mp4", //20 Russian Twist
  "/images/Grow a Muscle/Muscle Building/latpullover.mp4", //21 Lat Pullovers
  "/images/Grow a Muscle/Strength Training/cablerow.mp4", //22 Seated Cable Rows
];

const workoutsByDay: { [key: string]: Workout[] } = {
  Monday: [
    { title: "Incline Dumbbell Press", subtitle: "Target: Upper Chest, Anterior Deltoids\n3 sets of 10 reps", video: sampleVideos[0], weight: 'moderate' },
    { title: "Flat Dumbell Press", subtitle: "Target: Middle Chest, Triceps\n3 sets of 10 reps", video: sampleVideos[1], weight: 'moderate' },
    { title: "Cable Flys High to Low", subtitle: "Target: Lower Chest, Pectoralis Major\n3 sets of 10 reps", video: sampleVideos[2], weight: 'light' },
    { title: "Pec Deck Fly", subtitle: "Target: Middle Chest, Pectoralis Major\n3 sets of 10 reps", video: sampleVideos[3], weight: 'light' },
    { title: "Dumbell Shoulder Press", subtitle: "Target: Anterior Deltoids, Triceps\n3 sets of 8 reps", video: sampleVideos[4], weight: 'moderate' },
    { title: "Lateral Raises", subtitle: "Target: Lateral Deltoids\n3 sets of 10 reps", video: sampleVideos[5], weight: 'light' },
    { title: "Rope pushdowns", subtitle: "Target: Triceps Brachii\n3 sets of 10 reps", video: sampleVideos[6], weight: 'light' },
    { title: "Triceps Dips", subtitle: "Target: Triceps (Long Head)\n3 sets of 10 reps", video: sampleVideos[7], weight: 'moderate' },
  ],
      Tuesday: [
      { title: "Pull ups", subtitle: "Target: Lats, Biceps, Forearms\n3 sets of 10 reps", video: sampleVideos[8], weight: 'light' },
      { title: "Lat Pulldowns", subtitle: "Target: Lats, Teres Major\n3 sets of 12 reps", video: sampleVideos[9], weight: 'light' },
      { title: "Cable Lat Pullovers", subtitle: "Target: Lats, Serratus Anterior\n3 sets of 10 reps", video: sampleVideos[21], weight: 'moderate' },
      { title: "Seated Cable Rows", subtitle: "Target: Upper Back, Rhomboids\n3 sets of 10 reps", video: sampleVideos[22], weight: 'moderate' },
      { title: "Barbell Rows", subtitle: "Target: Lats, Middle Back\n3 sets of 10 reps", video: sampleVideos[10], weight: 'light' },
      { title: "Face Pull", subtitle: "Target: Rear Deltoids, Traps\n3 sets of 12 reps", video: sampleVideos[11], weight: 'moderate' },
      { title: "Bicep Curls", subtitle: "Target: Biceps Brachii\n3 sets of 12 reps", video: sampleVideos[12], weight: 'light' },
      { title: "Hammer Curls", subtitle: "Target: Brachialis, Brachioradialis\n3 sets of 12 reps", video: sampleVideos[13], weight: 'moderate' },
    ],
  Wednesday: [],
      Thursday: [
      { title: "Barbell Squats", subtitle: "Target: Quads, Glutes, Lower Back\n3 sets of 8 reps", video: sampleVideos[14], weight: 'light' },
      { title: "Bulgarian Split Squats", subtitle: "Target: Quads, Glutes\n3 sets of 10 reps", video: sampleVideos[15], weight: 'light' },
      { title: "Romanian Deadlift", subtitle: "Target: Hamstrings, Glutes\n3 sets of 10 reps", video: sampleVideos[16], weight: 'moderate' },
      { title: "Hamstring Curls ", subtitle: "Target: Hamstrings\n3 sets of 10 reps", video: sampleVideos[17], weight: 'light' },
      { title: "Leg Extension", subtitle: "Target: Quadriceps\n3 sets of 10 reps", video: sampleVideos[18], weight: 'moderate' },
      { title: "Cable Crunches", subtitle: "Target: Abdominals\n3 sets of 15 reps", video: sampleVideos[19], weight: 'light' },
      { title: "Russian Twist", subtitle: "Target: Obliques, Abdominals\n3 sets of 30 seconds", video: sampleVideos[20], weight: 'moderate' },
    ],
      Friday: [
      { title: "Dumbell Shoulder Press", subtitle: "Target: Anterior Deltoids, Triceps\n3 sets of 12 reps", video: sampleVideos[4], weight: 'moderate' },
      { title: "Lateral Raise", subtitle: "Target: Lateral Deltoids\n3 sets of 15 reps", video: sampleVideos[5], weight: 'light' },
      { title: "Reverse Peck Deck Fly", subtitle: "Target: Rear Deltoids, Rhomboids\n3 sets of 12 reps", video: sampleVideos[3], weight: 'moderate' },
      { title: "Rope pushdowns", subtitle: "Target: Triceps Brachii\n3 sets of 12 reps", video: sampleVideos[6], weight: 'light' },
      { title: "Triceps Dips", subtitle: "Target: Triceps (Long Head)\n3 sets of 10 reps", video: sampleVideos[7], weight: 'moderate' },
      { title: "Bicep Curls", subtitle: "Target: Biceps Brachii\n3 sets of 12 reps", video: sampleVideos[12], weight: 'light' },
      { title: "Hammer Curls", subtitle: "Target: Brachialis, Brachioradialis\n3 sets of 12 reps", video: sampleVideos[13], weight: 'moderate' },
    ],
      Saturday: [
      { title: "Flat Dumbell Press", subtitle: "Target: Chest, Triceps\n3 sets of 12 reps", video: sampleVideos[1], weight: 'light' },
      { title: "Incline Dumbell Press", subtitle: "Target: Upper Chest, Shoulders\n3 sets of 12 reps", video: sampleVideos[0], weight: 'moderate' },
      { title: "Peck Deck", subtitle: "Target: Chest, Shoulders\n3 sets of 10 reps", video: sampleVideos[3], weight: 'light' },
      { title: "Barbell Rows", subtitle: "Target: Lats, Middle Back\n3 sets of 12 reps", video: sampleVideos[10], weight: 'moderate' },
      { title: "Lat Pulldowns", subtitle: "Target: Lats, Teres Major\n3 sets of 12 reps", video: sampleVideos[9], weight: 'light' },
      { title: "Pull ups", subtitle: "Target: Lats, Biceps\n3 sets of 8 reps", video: sampleVideos[8], weight: 'moderate' },
    ],
  Sunday: [],
};

// Define interfaces for user profile and weekly status
interface UserProfile {
  first_name: string;
  last_name: string;
  fitness_goal: string;
}

interface WeeklyStatusDay {
  exercises: CompletedExercise[];
}

interface WeeklyStatus {
  [day: string]: WeeklyStatusDay;
}

export default function MuscleBuildingPage() {
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
  const [repsDuration, setRepsDuration] = useState(0);
  const [sessionWeight, setSessionWeight] = useState('');
  const [savingSession, setSavingSession] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const [sessionLocked, setSessionLocked] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus>({});
  
  const workouts = workoutsByDay[selectedDay];
  const isRestDay = workouts.length === 0;
  const isCurrentDay = selectedDay === getCurrentDay();
  const completedCount = completedExercises.length;
  const totalExercises = workouts.length;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, fitness_goal')
          .eq('id', user.id)
          .single();
        if (!error) setUserProfile(data as UserProfile);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const checkSessionLock = async () => {
      if (user) {
        const completed = await checkWeeklyWorkoutCompletion(user.id, 'muscle-building', selectedDay);
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
        .eq('workout_type', 'muscle-building')
        .eq('day_of_week', selectedDay)
        .single();
      if (!error && data && data.exercises) {
        setCompletedExercises(data.exercises as CompletedExercise[]);
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
        setWeeklyStatus(() => ({} as WeeklyStatus));
        return;
      }
      const status = await getWeeklyWorkoutStatus(user.id, 'muscle-building');
      setWeeklyStatus((status || {}) as WeeklyStatus);
    }
    fetchWeeklyStatus();
  }, [user]);

  const handleFinishExercise = (exercise: Workout) => {
    if (!user) {
      setShowSignInPrompt(true);
      return;
    }
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
      if (user) {
        const { error } = await supabase.from('exercise_log').insert([
          {
            user_id: user.id,
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
    if (!user) {
      setShowSignInPrompt(true);
      return;
    }
    setShowFinishSessionModal(true);
  };

  const confirmFinishSession = async () => {
    if (!sessionWeight || !user) return;
    setSavingSession(true);
    try {
      await markWeeklyWorkoutCompleted(user.id, 'muscle-building', selectedDay, completedExercises);
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
            message: `Congrats! You completed your ${selectedDay} muscle building session.`,
          },
        ]);
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Workout Complete!', {
            body: `Congrats! You completed your ${selectedDay} muscle building session.`
          });
        }
      }
      const newStatus = await getWeeklyWorkoutStatus(user.id, 'muscle-building');
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">Muscle Building Workouts</h1>
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
                        {isExerciseCompleted(w.title) ? "\u2713 Completed" : "Finish Exercise"}
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
              You have completed <span className="font-bold">{completedExercises.length}</span> workouts.
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

      {/* Sign In Prompt Modal */}
      <SignInPromptModal
        open={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        action="finish a workout exercise or session"
      />
    </>
  );
}