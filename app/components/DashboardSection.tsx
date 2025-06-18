"use client";

export default function DashboardSection() {
  return (
    <section className="bg-[white] text-white px-8 py-10">

       <div className="bg-[#505168] p-10 rounded-lg shadow-lg max-w-[1700px] mx-auto">
        <h2 className="text-7xl font-bold mb-6">GROW A MUSCLE</h2>

        <p className="mb-6 text-gray-300 text-2xl">
          Ready to take control of your fitness journey?
        </p>
        <p className="mb-2 text-gray-300 text-2xl">
          Whether you're just starting out or leveling up, our personalized workout plans and expert resources are built just for you.
        </p>
        <p className="mb-2 text-gray-300 text-2xl">
          Join a supportive community that keeps you motivated, inspired, and on track.
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6">
          <p className="text-gray-300 mb-2 md:mb-0 text-2xl">
            No pressure — just progress, at your own pace.
          </p>
          <button className="mt-2 md:mt-0 bg-white text-[#27233A] px-10 py-6 rounded hover:bg-gray-200">
            Sign Up
          </button>
        </div>
      </div>
      {/*first box sugod*/}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div className="relative bg-[#27233A] text-white p-6 rounded-lg shadow-lg h-[600px] flex flex-col justify-between overflow-hidden">
    
    <div className="absolute inset-0 bg-[url('/images/dashboard-bg.jpg')] bg-cover bg-center opacity-10"></div>

  
    <div className="relative z-10">
      <h3 className="text-5xl font-bold mb-10 text-center">💪 Personalized Workout Plans</h3>
      <p className="text-3xl mb-4 text-center">
        Track workouts, body stats, and achievements with easy-to-use dashboards and progress visuals to stay motivated.
      </p>
    </div>

    <button className="relative z-10 text-3xl bg-white text-[#27233A] px-16 py-8 rounded hover:bg-[#3a3555] mx-auto">
      View Workout Plans
    </button>
  </div>
    {/*first box mana*/}

    {/*2nd box*/}
        <div className="relative bg-[#27233A] text-white p-6 rounded-lg shadow-lg h-[600px] flex flex-col justify-between overflow-hidden">
  <div>

    <div className="absolute inset-0 bg-[url('/images/visitcommunity.jpg')] bg-cover bg-center opacity-10"></div>
    <h3 className="text-5xl font-bold mb-10 text-center">📈 Progress</h3>
    <p className="text-3xl mb-4 text-center">
      Track workouts, body stats, and achievements with easy-to-use dashboards and progress visuals to stay motivated.
    </p>
  </div>
  
  <button className="relative z-10 text-3xl bg-white text-[#27233A] px-16 py-8 rounded hover:bg-[#3a3555] mx-auto">
    Visit Community
  </button>
</div>
    {/*2nd box mana*/}
    {/*3rd box*/}
        <div className="relative bg-[#27233A] text-white p-6 rounded-lg shadow-lg h-[600px] flex flex-col justify-between overflow-hidden">
  <div>
    <div className="absolute inset-0 bg-[url('/images/trackprogress.jpg')] bg-cover bg-center opacity-10"></div>
    <h3 className="text-5xl font-bold mb-10 text-center">📅 Progress Tracking tool</h3>
    <p className="text-3xl mb-4 text-center">
      Stay motivated with visual progress charts, stat logs, and workout history to see how far you've come.
    </p>
  </div>
  <button className="relative z-10 text-3xl bg-white text-[#27233A] px-16 py-8 rounded hover:bg-[#3a3555] mx-auto">
    Track Progress
  </button>
</div>
    {/*3rd box mana*/}
        {/* 4th box */}
<div className="relative bg-[#27233A] text-white p-6 rounded-lg shadow-lg h-[600px] flex flex-col justify-between overflow-hidden">
  <div>
    <div className="absolute inset-0 bg-[url('/images/healthyliving.jpg')] bg-cover bg-center opacity-10"></div>
    <h3 className="text-5xl font-bold mb-10 text-center">💡 Expert Tips and Video Guides</h3>
    <p className="text-3xl mb-4 text-center">
      Learn from certified trainers and nutritionists through easy-to-follow videos and tips tailored to your goals.
    </p>
  </div>
  <button className="relative z-10 text-3xl bg-white text-[#27233A] px-16 py-8 rounded hover:bg-[#3a3555] mx-auto">
    Explore Resources
  </button>
</div>
{/* 4th box mana */}
      </div>
    </section>
  );
}
