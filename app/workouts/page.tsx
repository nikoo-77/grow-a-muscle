"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";

const fitnessGoals = [
  {
    key: "strength-training",
    title: "Strength Training",
    description: "Build strength and power with compound lifts and progressive overload.",
    img: "/images/dashboard-bg.jpg",
  },
  {
    key: "lose-weight",
    title: "Lose Weight",
    description: "Burn calories and shed fat with high-intensity and cardio-focused routines.",
    img: "/images/healthyliving.jpg",
  },
  {
    key: "muscle-building",
    title: "Muscle Building",
    description: "Pack on lean, defined muscle with hypertrophy-focused routines.",
    img: "/images/trackprogress.jpg",
  },
  {
    key: "active-lifestyle",
    title: "Active Lifestyle",
    description: "Stay active and healthy with balanced, everyday movement routines.",
    img: "/images/visitcommunity.jpg",
  },
  {
    key: "improve-endurance-stamina",
    title: "Improve Endurance & Stamina",
    description: "Boost your cardiovascular fitness and stamina with endurance training.",
    img: "/images/dashboard-bg.jpg",
  },
  {
    key: "improve-flexibility",
    title: "Improve Flexibility",
    description: "Enhance mobility and prevent injury with stretching and flexibility routines.",
    img: "/images/healthyliving.jpg",
  },
];

export default function WorkoutsLandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-8 tracking-tight">Explore Fitness Goals</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {fitnessGoals.map((goal) => (
            <div key={goal.key} className="bg-[#e0e5dc] rounded-xl shadow flex flex-col overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src={goal.img}
                  alt={goal.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xl mb-2 text-[var(--foreground)]">{goal.title}</div>
                  <div className="text-gray-700 mb-4">{goal.description}</div>
                </div>
                <Link href={`/workouts/${goal.key}`} legacyBehavior>
                  <a className="inline-block bg-[#60ab66] hover:bg-[#4c8a53] text-white font-semibold py-2 px-6 rounded-xl text-lg transition text-center w-full">View Workouts</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
} 