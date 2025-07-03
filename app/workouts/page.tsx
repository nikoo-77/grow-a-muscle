import Navbar from "../components/Navbar";
import Image from "next/image";

const workouts = [
  {
    title: "Incline Dumbbell Press",
    subtitle: "Target: Upper Chest",
    img: "/images/dashboard-bg.jpg",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/healthyliving.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/trackprogress.jpg",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/visitcommunity.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/dashboard-bg.jpg",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/healthyliving.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/trackprogress.jpg",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Strength Training",
    subtitle: "Author",
    img: "/images/visitcommunity.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
];

export default function WorkoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-[var(--foreground)] flex flex-col items-center py-6 px-2 pt-32">
        <h1 className="text-3xl font-bold text-[#60ab66] mb-2 tracking-tight">WORKOUTS</h1>
        <section className="w-full max-w-4xl bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#60ab66] mb-1">Muscle Building</h2>
          <p className="text-base mb-4 text-[var(--foreground)]">
            Pack on lean, defined muscle with hypertrophy-focused routines and dialed-in nutrition.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {workouts.map((w, i) => (
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
                    <div className="font-semibold text-lg text-[var(--foreground)]">{w.title}</div>
                    <div className="text-sm text-gray-600">{w.subtitle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-[#e2c48e] hover:bg-[#d1b06a] text-[var(--foreground)] font-semibold py-3 px-8 rounded-xl text-lg transition">
              FINISH SESSION
            </button>
          </div>
        </section>
      </main>
    </>
  );
} 