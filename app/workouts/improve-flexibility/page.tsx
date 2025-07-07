"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { checkWeeklyWorkoutCompletion, markWeeklyWorkoutCompleted, getWeeklyWorkoutStatus, getWeekStart, getWeekEnd } from '../../../lib/supabaseWorkouts';
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
  "/images/Grow a Muscle/Improve Flexibility/toetouch.mp4", //0 Standing Toe Touch
  "/images/Grow a Muscle/Improve Flexibility/catcow.mp4", //1 Cat-Cow Stretch
  "/images/Grow a Muscle/Improve Flexibility/childpose.mp4", //2 Child's Pose
  "/images/Grow a Muscle/Improve Flexibility/butterfly.mp4", //3 Butterfly Stretch
  "/images/Grow a Muscle/Improve Flexibility/neckstretch.mp4", //4 Neck Stretch
  "/images/Grow a Muscle/Improve Flexibility/shoulderstretch.mp4", //5 Shoulder Stretch
  "/images/Grow a Muscle/Improve Flexibility/tricepstretch.mp4", //6 Triceps Stretch
  "/images/Grow a Muscle/Improve Flexibility/sidebend.mp4", //7 Side Bend
];

const workoutPool: Workout[] = [
  { title: "Standing Toe Touch", subtitle: "Target: Hamstrings, Lower Back\n3 sets of 30 sec hold", video: sampleVideos[0], weight: 'light' },
  { title: "Cat-Cow Stretch", subtitle: "Target: Spine, Back\n3 sets of 30 sec hold", video: sampleVideos[1], weight: 'light' },
  { title: "Child's Pose", subtitle: "Target: Back, Hips\n3 sets of 30 sec hold", video: sampleVideos[2], weight: 'light' },
  { title: "Butterfly Stretch", subtitle: "Target: Groin, Hips\n3 sets of 30 sec hold", video: sampleVideos[3], weight: 'light' },
  { title: "Neck Stretch", subtitle: "Target: Neck\n3 sets of 30 sec hold", video: sampleVideos[4], weight: 'light' },
  { title: "Shoulder Stretch", subtitle: "Target: Shoulders\n3 sets of 30 sec hold", video: sampleVideos[5], weight: 'light' },
  { title: "Triceps Stretch", subtitle: "Target: Triceps, Shoulders\n3 sets of 30 sec hold", video: sampleVideos[6], weight: 'light' },
  { title: "Side Bend", subtitle: "Target: Obliques\n3 sets of 30 sec hold", video: sampleVideos[7], weight: 'light' },
];

export default function ImproveFlexibilityPage() {
  const { user } = useAuth();

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
  const [workoutsByDay, setWorkoutsByDay] = useState<{ [key: string]: Workout[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [sessionLocked, setSessionLocked] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [savingSession, setSavingSession] = useState(false);

  useEffect(() => {
    function getRandomWorkouts(): Workout[] {
      const count = Math.floor(Math.random() * 3) + 5; // 5-7
      const shuffled = [...workoutPool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    setWorkoutsByDay({
      Monday: getRandomWorkouts(),
      Tuesday: getRandomWorkouts(),
      Wednesday: [],
      Thursday: getRandomWorkouts(),
      Friday: getRandomWorkouts(),
      Saturday: getRandomWorkouts(),
      Sunday: [],
    });
  }, []);

  useEffect(() => {
    const checkSessionLock = async () => {
      if (user) {
        const completed = await checkWeeklyWorkoutCompletion(user.id || user.uid, 'improve-flexibility', selectedDay);
        setSessionLocked(!!completed);
      } else {
        setSessionLocked(false);
      }
    };
    checkSessionLock();
  }, [user, selectedDay]);

  const workouts = workoutsByDay[selectedDay];
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

  const confirmFinishExercise = () => {
    if (currentExercise) {
      const completedExercise: CompletedExercise = {
        exerciseTitle: currentExercise.title,
        sets: sets,
        weight: weight,
        completedAt: new Date().toISOString()
      };
      
      setCompletedExercises(prev => [...prev, completedExercise]);
      setShowFinishModal(false);
      setCurrentExercise(null);
    }
  };

  const isExerciseCompleted = (exerciseTitle: string) => {
    return completedExercises.some(ex => ex.exerciseTitle === exerciseTitle);
  };

  const handleFinishSession = () => {
    setShowFinishSessionModal(true);
  };

  const confirmFinishSession = async () => {
    if (!user) return;
    setSavingSession(true);
    try {
      await markWeeklyWorkoutCompleted(user.id || user.uid, 'improve-flexibility', selectedDay, completedExercises);
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
            message: `Congrats! You completed your ${selectedDay} flexibility session.`,
          },
        ]);
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Workout Complete!', {
            body: `Congrats! You completed your ${selectedDay} flexibility session.`
          });
        }
      }
      const newStatus = await getWeeklyWorkoutStatus(user.id || user.uid, 'improve-flexibility');
      setShowFinishSessionModal(false);
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
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">Improve Flexibility Workouts</h1>
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
                        <div className="text-sm text-gray-600" style={{ whiteSpace: "pre-line" }}>{w.subtitle}</div>
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Finish Exercise</h3>
            <p className="text-gray-600 mb-4">
              Complete: <span className="font-semibold">{currentExercise.title}</span>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Sets
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Used (lbs)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinishExercise}
                className="flex-1 py-2 px-4 bg-[#60ab66] text-white rounded-lg hover:bg-[#4c8a53] transition"
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Finish Session</h3>
            <p className="text-gray-600 mb-4">
              Complete: {selectedDay}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Exercises
                </label>
                <input
                  type="text"
                  value={completedCount.toString()}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Exercises
                </label>
                <input
                  type="text"
                  value={totalExercises.toString()}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFinishSessionModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinishSession}
                className="flex-1 py-2 px-4 bg-[#60ab66] text-white rounded-lg hover:bg-[#4c8a53] transition"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 