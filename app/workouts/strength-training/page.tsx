"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

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
  "/images/Grow a Muscle/Strength Training/squat.mp4", //0 Squat
  "/images/Grow a Muscle/Strength Training/bench.mp4", //1 Bench Press
  "/images/Grow a Muscle/Strength Training/overhead.mp4", //2 Overhead Press
  "/images/Grow a Muscle/Strength Training/lat.mp4", //3 Lateral Raises
  "/images/Grow a Muscle/Strength Training/abs.mp4", //4 Romanian Abs
  "/images/Grow a Muscle/Strength Training/bulgarian.mp4", //5 Bulgarian Split Squats
  "/images/Grow a Muscle/Strength Training/bicep.mp4", //6 Bicep Curls
  "/images/Grow a Muscle/Strength Training/hammer.mp4", //7 Hammer Curls
  "/images/Grow a Muscle/Strength Training/facepull.mp4", //8 Face Pull
  "/images/Grow a Muscle/Strength Training/triceppushdown.mp4", //9 Tricep Rope Pushdown
  "/images/Grow a Muscle/Strength Training/deadlift.mp4", //10 Deadlift
  "/images/Grow a Muscle/Strength Training/larsen.mp4", //11 Bench Larsen Press
  "/images/Grow a Muscle/Strength Training/legpress.mp4", //12 Leg press  
  "/images/Grow a Muscle/Strength Training/sumo.mp4", //13 Sumo Deadlift
  "/images/Grow a Muscle/Strength Training/inclinedb.mp4", //14 Incline Dumbbell Press
  "/images/Grow a Muscle/Strength Training/cablerow.mp4", //15 Seated Cable Row
  "/images/Grow a Muscle/Strength Training/latpulldown.mp4", //16 Lat Pulldown'
  "/images/Grow a Muscle/Strength Training/shoulderpress.mp4", //17 Shoulder Press
];

const workoutsByDay: { [key: string]: Workout[] } = {
  Monday: [
    { title: "Squat", subtitle: "Target: Quads, Glutes, Core\n4 sets of 1-3 reps", img: "", video: sampleVideos[0], weight: 'heavy' },
    { title: "Bench Press", subtitle: "Target: Chest, Triceps, Shoulders\n3 sets of 1-3 reps", img: "", video: sampleVideos[1], weight: 'heavy' },
    { title: "Overhead Press", subtitle: "Target: Shoulders, Triceps\n3 sets of 10 reps", img: "", video: sampleVideos[2], weight: 'moderate' },
    { title: "Side Delt Raise", subtitle: "Target: Lateral Deltoids\n3 sets of 8 reps", img: "", video: sampleVideos[3], weight: 'light' },
    { title: "Weighted Roman Abs", subtitle: "Target: Abdominals\n3 sets of 10 reps", img: "", video: sampleVideos[4], weight: 'light' },

  ],
      Tuesday: [
      { title: "Deadlift", subtitle: "Target: Hamstrings, Glutes, Lower Back\n4 sets of 1-3 reps", video: sampleVideos[10], weight: 'heavy' },
      { title: "Bench Larsen Press", subtitle: "Target: Chest, Triceps\n3 sets of 2-3 reps", video: sampleVideos[11], weight: 'moderate' },
      { title: "Bulgarian Split Squats", subtitle: "Target: Quads, Glutes\n3 sets of 10 reps", video: sampleVideos[5], weight: 'moderate' },
      { title: "Leg Press", subtitle: "Target: Quads, Glutes\n3 sets of 8 reps", video: sampleVideos[12], weight: 'heavy' },
      { title: "Weighted Roman Abs", subtitle: "Target: Abdominals\n3 sets of 10 reps", video: sampleVideos[4], weight: 'light' },

    ],
  Wednesday: [],
      Thursday: [
      { title: "Squat", subtitle: "Target: Quads, Glutes, Core\n4 sets of 2-4 reps", video: sampleVideos[0], weight: 'heavy' },
      { title: "Bench Press", subtitle: "Target: Chest, Triceps, Shoulders\n4 sets of 2-5 reps", video: sampleVideos[1], weight: 'heavy' },
      { title: "Incline Dumbell Press", subtitle: "Target: Upper Chest, Shoulders\n3 sets of 10 reps", video: sampleVideos[14], weight: 'moderate' },
      { title: "Seated Cable Row", subtitle: "Target: Upper Back, Lats\n3 sets of 8 reps", video: sampleVideos[15], weight: 'light' },
      { title: "Lateral Raises", subtitle: "Target: Lateral Deltoids\n3 sets of 10 reps", video: sampleVideos[3], weight: 'light' },

    ],
      Friday: [
      { title: "Sumo Deadlift", subtitle: "Target: Hamstrings, Glutes, Adductors\n4 sets of 1-3 reps", video: sampleVideos[13], weight: 'heavy' },
      { title: "Lat Pulldown", subtitle: "Target: Lats, Upper Back\n3 sets of 10 reps", video: sampleVideos[16], weight: 'moderate' },
      { title: "Bicep Curls" , subtitle: "Target: Biceps Brachii\n3 sets of 10 reps", video: sampleVideos[6], weight: 'light' },
      { title: "Hammer Curls", subtitle: "Target: Brachialis, Brachioradialis\n3 sets of 10 reps", video: sampleVideos[7], weight: 'light' },
      { title: "Seated Cable Row", subtitle: "Target: Upper Back\n3 sets of 10 reps", video: sampleVideos[15], weight: 'light' },

    ],
      Saturday: [
      { title: "Overhead Press", subtitle: "Target: Shoulders, Triceps\n3 sets of 10 reps", video: sampleVideos[2], weight: 'heavy' },
      { title: "Shoulder Press", subtitle: "Target: Shoulders\n3 sets of 8 reps", video: sampleVideos[17], weight: 'moderate' },
      { title: "Lateral Raises", subtitle: "Target: Lateral Deltoids\n3 sets of 10 reps", video: sampleVideos[3], weight: 'light' },
      { title: "Face Pull", subtitle: "Target: Rear Deltoids, Upper Back\n3 sets of 10 reps", video: sampleVideos[8], weight: 'light' },
      { title: "Tricep Rope Pushdown", subtitle: "Target: Triceps Brachii\n3 sets of 10 reps", video: sampleVideos[9], weight: 'light' },

    ],
  Sunday: [],
};

export default function StrengthTrainingPage() {
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
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();
  
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
          .eq('id', user.id ?? user.uid)
          .single();
        if (!error) setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  const handleFinishExercise = (exercise: Workout) => {
    setCurrentExercise(exercise);
    setSets(3); // Default to 3 sets
    setWeight(0); // Default to 0 weight
    setShowFinishModal(true);
  };

  const confirmFinishExercise = async () => {
    if (currentExercise) {
      const completedExercise = {
        exerciseTitle: currentExercise.title,
        sets: sets,
        weight: weight,
        completedAt: new Date().toISOString()
      };
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
    const { error } = await supabase.from('user_workouts').insert([
      {
        user_id: user.id || user.uid,
        date: new Date().toISOString(),
        weight: parseFloat(sessionWeight),
        first_name: userProfile?.first_name || null,
        last_name: userProfile?.last_name || null,
        fitness_goal: userProfile?.fitness_goal || null,
        completed_exercise: completedExercises.length,
        exercise_day: selectedDay,
      },
    ]);
    if (error) {
      alert('Error saving session: ' + error.message);
    }
    setShowFinishSessionModal(false);
    setCompletedExercises([]);
    setSessionWeight('');
    setSavingSession(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">Strength Training Workouts</h1>
        {/* Day Selector */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-semibold transition border-2 ${selectedDay === day ? "bg-[#60ab66] text-white border-[#60ab66]" : "bg-white text-[var(--foreground)] border-[#e0e5dc] hover:bg-[#e0e5dc]"}`}
            >
              {day}
            </button>
          ))}
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
                          isExerciseCompleted(w.title)
                            ? "bg-green-600 text-white cursor-default"
                            : "bg-[#60ab66] hover:bg-[#4c8a53] text-white"
                        }`}
                        onClick={() => !isExerciseCompleted(w.title) && handleFinishExercise(w)}
                        disabled={isExerciseCompleted(w.title)}
                      >
                        {isExerciseCompleted(w.title) ? "✓ Completed" : "Finish Exercise"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <button 
                  className={`font-semibold py-3 px-8 rounded-xl text-lg transition ${
                    isCurrentDay 
                      ? completedCount > 0 
                        ? "bg-green-600 text-white cursor-pointer hover:bg-green-700" 
                        : "bg-[#60ab66] hover:bg-[#4c8a53] text-white"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={isCurrentDay ? handleFinishSession : undefined}
                  disabled={!isCurrentDay}
                >
                  {isCurrentDay 
                    ? completedCount > 0 
                      ? `FINISH SESSION (${completedCount}/${totalExercises})` 
                      : "FINISH SESSION"
                    : "FINISH SESSION (Today Only)"
                  }
                </button>
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
    </>
  );
} 