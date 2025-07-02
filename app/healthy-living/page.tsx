"use client";
import { useState } from "react";

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

function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-[#2e3d27] bg-[#e0e5dc] hover:bg-[#d2e3d2] transition flex justify-between items-center shadow-sm`}
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            type="button"
          >
            {item.title}
            <span>{openIdx === idx ? "-" : "+"}</span>
          </button>
          {openIdx === idx && (
            <div className="px-6 py-3 bg-white border border-[#60ab66]/30 rounded-b-xl text-sm shadow-inner">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HealthyLivingPage() {
  const [hydrationOpen, setHydrationOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f8fdf8] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-lg text-[#2e3d27] hover:text-[#60ab66] transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Homepage
          </a>
        </div>
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-[#2e3d27] mb-4">Healthy Living Hub</h1>
          <p className="text-xl text-[#60ab66] font-medium">Your educational and motivational hub for overall wellness</p>
        </div>

        {/* Nutrition Tips & Meal Plans */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Nutrition Tips & Meal Plans</h2>
            <Accordion items={mealPlans} />
            <div className="mt-4">
              <button
                className="w-full text-left px-4 py-3 rounded-xl font-semibold text-[#2e3d27] bg-[#e0e5dc] hover:bg-[#d2e3d2] transition flex justify-between items-center shadow-sm"
                onClick={() => setHydrationOpen(!hydrationOpen)}
                type="button"
              >
                Hydration Tips & Water Tracker
                <span>{hydrationOpen ? "-" : "+"}</span>
              </button>
              {hydrationOpen && (
                <div className="px-6 py-3 bg-white border border-[#60ab66]/30 rounded-b-xl text-sm shadow-inner">{hydrationTips}</div>
              )}
            </div>
          </div>
        </section>

        {/* Mental Wellness & Motivation */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Mental Wellness & Motivation</h2>
            <Accordion items={mentalWellness} />
          </div>
        </section>

        {/* Educational Articles */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#60ab66] via-[#97d39b] to-[#6ed076] rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Educational Articles</h2>
            <Accordion items={articles} />
          </div>
        </section>
      </div>
    </div>
  );
} 