"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const mealPlans = [
  {
    title: "Strength Training",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Oatmeal with banana, nut butter, and black coffee</li>
        <li>Post-workout: Grilled chicken, brown rice, and broccoli</li>
        <li>Snacks: Greek yogurt, almonds, cottage cheese</li>
      </ul>
    )
  },
  {
    title: "Lose Weight",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Apple slices with peanut butter</li>
        <li>Post-workout: Baked salmon, quinoa, and spinach salad</li>
        <li>Snacks: Carrot sticks, hummus, boiled eggs</li>
      </ul>
    )
  },
  {
    title: "Muscle Building",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Whole grain toast, eggs, and fruit</li>
        <li>Post-workout: Beef stir-fry with veggies and rice</li>
        <li>Snacks: Protein shake, trail mix, cheese sticks</li>
      </ul>
    )
  },
  {
    title: "Active Lifestyle",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Fruit smoothie with spinach</li>
        <li>Post-workout: Turkey wrap with veggies</li>
        <li>Snacks: Mixed nuts, granola bars, fruit</li>
      </ul>
    )
  },
  {
    title: "Improve Endurance and Stamina",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Bagel with honey and peanut butter</li>
        <li>Post-workout: Grilled fish, sweet potato, and green beans</li>
        <li>Snacks: Energy bars, dried fruit, low-fat milk</li>
      </ul>
    )
  },
  {
    title: "Improve Flexibility",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Pre-workout: Berries and low-fat yogurt</li>
        <li>Post-workout: Tofu stir-fry with brown rice</li>
        <li>Snacks: Sliced cucumber, nuts, herbal tea</li>
      </ul>
    )
  },
];

const hydrationTips = (
  <div className="text-[#2e3d27]">
    <p className="mb-2">Aim for 8-10 cups of water daily. Drink more if you're active or sweating a lot!</p>
    <ul className="list-disc ml-6">
      <li>Start your day with a glass of water</li>
      <li>Carry a water bottle everywhere</li>
      <li>Set reminders to drink every hour</li>
    </ul>
  </div>
);

const mentalWellness = [
  {
    title: "Motivational Quote",
    content: <div className="italic text-[#2e3d27]">"The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will." – Vince Lombardi</div>
  },
  {
    title: "Journaling Prompt",
    content: <div className="text-[#2e3d27]">Why do you want to stay healthy? Write down your reasons and revisit them when you need motivation.</div>
  },
  {
    title: "Relaxing Music Playlist",
    content: <a href="https://open.spotify.com/playlist/51bgYVmCanTJVeRa6fsQ3P?si=c749b6865dbe4965" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Listen to Relaxing Music on Spotify</a>
  },
  {
    title: "Sleep & Recovery Tips",
    content: (
      <ul className="list-disc ml-6 text-[#2e3d27]">
        <li>Stick to a regular sleep schedule</li>
        <li>Avoid screens 1 hour before bed</li>
        <li>Practice deep breathing or meditation</li>
        <li>Keep your bedroom cool and dark</li>
      </ul>
    )
  }
];

const articles = [
  {
    title: "Why fiber matters",
    content: <div className="text-[#2e3d27]">Fiber helps regulate digestion, keeps you full, and supports heart health. Include whole grains, fruits, and vegetables in your meals.</div>
  },
  {
    title: "How to read nutrition labels",
    content: <div className="text-[#2e3d27]">Check serving size, calories, and nutrients. Watch for added sugars, sodium, and unhealthy fats. Compare products to make healthier choices.</div>
  },
  {
    title: "The truth about sugar and processed food",
    content: <div className="text-[#2e3d27]">Limit sugary drinks and snacks. Choose whole foods over processed ones to reduce your risk of chronic disease.</div>
  },
  {
    title: "Intermittent fasting pros and cons",
    content: <div className="text-[#2e3d27]">Fasting can help with weight management, but isn't for everyone. Consult a professional before making major dietary changes.</div>
  }
];

// Simple icon SVGs for demonstration
const icons = {
  meal: (
    <svg className="inline-block w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  ),
  mental: (
    <svg className="inline-block w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /></svg>
  ),
  article: (
    <svg className="inline-block w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
  ),
  drop: (
    <svg className="inline-block w-5 h-5 mr-2 text-[#60ab66]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v12m0 0c-3.866 0-7 2.239-7 5h14c0-2.761-3.134-5-7-5z" /></svg>
  )
};

// Fade-in on scroll hook
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        node.classList.add("fade-in-visible");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return ref;
}

// Animated Accordion
function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-[#2e3d27] bg-[#e0e5dc] hover:bg-[#d2e3d2] transition flex justify-between items-center shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#60ab66]`}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            type="button"
            aria-expanded={openIdx === idx}
          >
            <span className="flex items-center">
              <svg className={`w-5 h-5 mr-2 transition-transform duration-300 ${openIdx === idx ? 'rotate-90 text-[#60ab66]' : 'text-[#2e3d27]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              {item.title}
            </span>
            <span className="text-xl font-bold text-[#60ab66]">{openIdx === idx ? "–" : "+"}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${openIdx === idx ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}
            style={{}}
          >
            <div className="px-6 bg-white border border-[#60ab66]/30 rounded-b-xl text-sm shadow-inner">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HealthyLivingPage() {
  const [hydrationOpen, setHydrationOpen] = useState(false);
  const nutritionRef = useFadeInOnScroll();
  const mentalRef = useFadeInOnScroll();
  const articleRef = useFadeInOnScroll();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8fdf8] px-4 py-10 relative overflow-x-hidden pt-32">
        {/* Decorative SVG background */}
        <svg className="absolute top-0 left-0 w-full h-64 opacity-10 pointer-events-none" viewBox="0 0 1440 320"><path fill="#60ab66" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-[#2e3d27] mb-4 drop-shadow-lg">Healthy Living Hub</h1>
            <p className="text-xl text-[#60ab66] font-medium">Your educational and motivational hub for overall wellness</p>
          </div>

          {/* Nutrition Tips & Meal Plans */}
          <section className="mb-12 fade-in-section" ref={nutritionRef}>
            <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-2xl shadow-2xl p-8 mb-6 backdrop-blur-md border border-[#60ab66]/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">{icons.meal}Nutrition Tips & Meal Plans</h2>
              <Accordion items={mealPlans} />
              <div className="mt-4">
                <button
                  className="w-full text-left px-4 py-3 rounded-xl font-semibold text-[#2e3d27] bg-[#e0e5dc] hover:bg-[#d2e3d2] transition flex justify-between items-center shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                  onClick={() => setHydrationOpen(!hydrationOpen)}
                  type="button"
                  aria-expanded={hydrationOpen}
                >
                  <span className="flex items-center">{icons.drop}Hydration Tips & Water Tracker</span>
                  <span className="text-xl font-bold text-[#60ab66]">{hydrationOpen ? "–" : "+"}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${hydrationOpen ? 'max-h-40 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}
                >
                  <div className="px-6 bg-white border border-[#60ab66]/30 rounded-b-xl text-sm shadow-inner">{hydrationTips}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Mental Wellness & Motivation */}
          <section className="mb-12 fade-in-section" ref={mentalRef}>
            <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-2xl shadow-2xl p-8 mb-6 backdrop-blur-md border border-[#60ab66]/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">{icons.mental}Mental Wellness & Motivation</h2>
              <Accordion items={mentalWellness} />
            </div>
          </section>

          {/* Educational Articles */}
          <section className="mb-8 fade-in-section" ref={articleRef}>
            <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-[#60ab66]/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">{icons.article}Educational Articles</h2>
              <Accordion items={articles} />
            </div>
          </section>
        </div>
        {/* Fade-in animation styles */}
        <style jsx global>{`
          .fade-in-section {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1);
          }
          .fade-in-visible {
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </div>
    </>
  );
} 