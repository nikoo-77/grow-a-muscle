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

const workoutsByDay: { [key: string]: Workout[] } = {
  Monday: [
    { title: "Squat", subtitle: "Target: Quads, Glutes, Core\n4 sets of 1-3 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[0], weight: 'heavy' },
    { title: "Bench Press", subtitle: "Target: Chest, Triceps, Shoulders\n3 sets of 1-3 reps", img: "/images/healthyliving.jpg", video: sampleVideos[1], weight: 'heavy' },
    { title: "Overhead Press", subtitle: "Target: Shoulders, Triceps\n3 sets of 10 reps", img: "/images/trackprogress.jpg", video: sampleVideos[2], weight: 'moderate' },
    { title: "Side Delt Raise", subtitle: "Target: Lateral Deltoids\n3 sets of 8 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[3], weight: 'light' },
    { title: "Weighted Roman Abs", subtitle: "Target: Abdominals\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[4], weight: 'light' },

  ],
  Tuesday: [
    { title: "Deadlift", subtitle: "Target: Hamstrings, Glutes, Lower Back\n4 sets of 1-3 reps", img: "/images/trackprogress.jpg", video: sampleVideos[0], weight: 'heavy' },
    { title: "Bench Larsen Press", subtitle: "Target: Chest, Triceps\n3 sets of 2-3 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[1], weight: 'moderate' },
    { title: "Bulgarian Split Squats", subtitle: "Target: Quads, Glutes\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[2], weight: 'moderate' },
    { title: "Leg Press", subtitle: "Target: Quads, Glutes\n3 sets of 8 reps", img: "/images/healthyliving.jpg", video: sampleVideos[3], weight: 'heavy' },
    { title: "Weighted Roman Abs", subtitle: "Target: Abdominals\n3 sets of 10 reps", img: "/images/trackprogress.jpg", video: sampleVideos[4], weight: 'light' },

  ],
  Wednesday: [],
  Thursday: [
    { title: "Squat", subtitle: "Target: Quads, Glutes, Core\n4 sets of 2-4 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[0], weight: 'heavy' },
    { title: "Bench Press", subtitle: "Target: Chest, Triceps, Shoulders\n4 sets of 2-5 reps", img: "/images/healthyliving.jpg", video: sampleVideos[1], weight: 'heavy' },
    { title: "Incline Dumbell Press", subtitle: "Target: Upper Chest, Shoulders\n3 sets of 10 reps", img: "/images/trackprogress.jpg", video: sampleVideos[2], weight: 'moderate' },
    { title: "Seated Cable Row", subtitle: "Target: Upper Back, Lats\n3 sets of 8 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[3], weight: 'light' },
    { title: "Lateral Raises", subtitle: "Target: Lateral Deltoids\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[4], weight: 'light' },

  ],
  Friday: [
    { title: "Sumo Deadlift", subtitle: "Target: Hamstrings, Glutes, Adductors\n4 sets of 1-3 reps", img: "/images/trackprogress.jpg", video: sampleVideos[0], weight: 'heavy' },
    { title: "Lat Pulldown", subtitle: "Target: Lats, Upper Back\n3 sets of 10 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[1], weight: 'moderate' },
    { title: "Bicep Curls" , subtitle: "Target: Biceps Brachii\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[2], weight: 'light' },
    { title: "Lat Pulldown", subtitle: "Target: Lats, Upper Back\n3 sets of 10 reps", img: "/images/healthyliving.jpg", video: sampleVideos[3], weight: 'light' },
    { title: "Hammer Curls", subtitle: "Target: Brachialis, Brachioradialis\n3 sets of 10 reps", img: "/images/trackprogress.jpg", video: sampleVideos[4], weight: 'light' },
    { title: "Seated Row", subtitle: "Target: Middle Back, Rhomboids\n3 sets of 10 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[5], weight: 'light' },

  ],
  Saturday: [
    { title: "Overhead Press", subtitle: "Target: Shoulders, Triceps\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[0], weight: 'heavy' },
    { title: "Shoulder Press", subtitle: "Target: Shoulders\n3 sets of 8 reps", img: "/images/healthyliving.jpg", video: sampleVideos[1], weight: 'moderate' },
    { title: "Lateral Raises", subtitle: "Target: Lateral Deltoids\n3 sets of 10 reps", img: "/images/trackprogress.jpg", video: sampleVideos[2], weight: 'light' },
    { title: "Face Pull", subtitle: "Target: Rear Deltoids, Upper Back\n3 sets of 10 reps", img: "/images/visitcommunity.jpg", video: sampleVideos[3], weight: 'light' },
    { title: "Tricep Rope Pushdown", subtitle: "Target: Triceps Brachii\n3 sets of 10 reps", img: "/images/dashboard-bg.jpg", video: sampleVideos[4], weight: 'light' },

  ],
  Sunday: [],
};

export default function StrengthTrainingPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const workouts = workoutsByDay[selectedDay];
  const isRestDay = workouts.length === 0;

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
                        className="mt-4 bg-[#60ab66] hover:bg-[#4c8a53] text-white font-semibold py-2 px-4 rounded-xl transition"
                        onClick={() => console.log(`Finished exercise: ${w.title} on ${selectedDay}`)}
                      >
                        Finish Exercise
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <button className="bg-[#60ab66] hover:bg-[#d1b06a] text-[var(--foreground)] font-semibold py-3 px-8 rounded-xl text-lg transition">
                  FINISH SESSION
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
} 