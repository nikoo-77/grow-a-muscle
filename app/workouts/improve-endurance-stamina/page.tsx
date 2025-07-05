"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState } from "react";

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
  img: string;
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
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
  "https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4",
  "https://filesamples.com/samples/video/mp4/sample_1280x720_surfing_with_audio.mp4",
  "https://filesamples.com/samples/video/mp4/sample_1920x1080.mp4",
  "https://filesamples.com/samples/video/mp4/sample_960x540.mp4",
  "https://filesamples.com/samples/video/mp4/sample_640x360.mp4"
];

const workoutPool: Workout[] = [
  { title: "Interval Running", subtitle: "Target: Cardio\n3 sets of 60 seconds", img: "/images/dashboard-bg.jpg", video: sampleVideos[0], weight: 'moderate' },
  { title: "Jump Rope", subtitle: "Target: Cardio\n3 sets of 30 seconds", img: "/images/healthyliving.jpg", video: sampleVideos[1], weight: 'light' },
  { title: "Rowing", subtitle: "Target: Cardio, Full Body\n3 sets of 60 seconds", img: "/images/visitcommunity.jpg", video: sampleVideos[3], weight: 'moderate' },
  { title: "Burpees", subtitle: "Target: Full Body\n3 sets of 30 seconds", img: "/images/dashboard-bg.jpg", video: sampleVideos[4], weight: 'moderate' },
  { title: "Long Distance Running", subtitle: "Target: Cardio\n3 sets of 120 seconds", img: "/images/trackprogress.jpg", video: sampleVideos[0], weight: 'moderate' },
  { title: "Stair Climbing", subtitle: "Target: Cardio, Legs\n3 sets of 60 seconds", img: "/images/visitcommunity.jpg", video: sampleVideos[1], weight: 'light' },
  { title: "Mountain Climbers", subtitle: "Target: Cardio, Core\n3 sets of 30 seconds", img: "/images/healthyliving.jpg", video: sampleVideos[4], weight: 'moderate' },
  { title: "Box Jumps", subtitle: "Target: Legs, Cardio\n3 sets of 30 seconds", img: "/images/trackprogress.jpg", video: sampleVideos[6], weight: 'moderate' },
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

  const confirmFinishSession = () => {
    // Here you could save the session data to a database or localStorage
    console.log('Session completed:', {
      day: selectedDay,
      completedExercises,
      completedAt: new Date().toISOString()
    });
    setShowFinishSessionModal(false);
    // Optionally reset completed exercises for the next session
    setCompletedExercises([]);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">Improve Endurance and Stamina Workouts</h1>
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
                        controls
                        width="100%"
                        height="100%"
                        poster={w.img}
                        className="object-cover w-full h-48 rounded-t-xl"
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
                          isCurrentDay
                            ? isExerciseCompleted(w.title)
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-[#60ab66] hover:bg-[#4c8a53] text-white"
                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={() => isCurrentDay && !isExerciseCompleted(w.title) && handleFinishExercise(w)}
                        disabled={!isCurrentDay || isExerciseCompleted(w.title)}
                      >
                        {isExerciseCompleted(w.title) 
                          ? "✓ Completed" 
                          : "Finish Exercise"
                        }
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
              You have completed {completedCount} out of {totalExercises} exercises.
            </p>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFinishSessionModal(false)}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmFinishSession}
                className="flex-1 py-2 px-4 bg-[#60ab66] text-white rounded-lg font-semibold hover:bg-[#4c8a53] transition"
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