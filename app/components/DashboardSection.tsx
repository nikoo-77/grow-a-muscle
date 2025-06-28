"use client";

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
  gradientColor: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  buttonText,
  backgroundImage,
  gradientColor,
  onClick
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${gradientColor}ee 0%, ${gradientColor}dd 50%, ${gradientColor}cc 100%)`
        }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />

      <div className="relative z-10 p-8 h-[500px] flex flex-col justify-between">
        <div className="flex-grow flex flex-col justify-center text-center">
          <h3 className="text-4xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
            {title}
          </h3>
          <p className="text-xl text-[#2e3d27] leading-relaxed">
            {description}
          </p>
        </div>
        
        <button 
          onClick={onClick}
          className="w-full bg-[#60ab66]/80 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#6ed076]/90 hover:border-white/50 transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const DashboardSection: React.FC = () => {
  const { user } = useAuth();

  const features: FeatureCardProps[] = [
    {
      title: "Personalized Workout Plans",
      description: "Track workouts, body stats, and achievements with easy-to-use dashboards and progress visuals to stay motivated.",
      buttonText: "View Workout Plans",
      backgroundImage: "/images/dashboard-bg.jpg",
      gradientColor: "#60ab66"
    },
    {
      title: "Community Support",
      description: "Connect with like-minded fitness enthusiasts and get the motivation you need to reach your goals.",
      buttonText: "Visit Community",
      backgroundImage: "/images/visitcommunity.jpg",
      gradientColor: "#97d39b"
    },
    {
      title: "Progress Tracking Tools",
      description: "Stay motivated with visual progress charts, stat logs, and workout history to see how far you've come.",
      buttonText: "Track Progress",
      backgroundImage: "/images/trackprogress.jpg",
      gradientColor: "#6ed076"
    },
    {
      title: "Expert Tips & Video Guides",
      description: "Learn from certified trainers and nutritionists through easy-to-follow videos and tips tailored to your goals.",
      buttonText: "Explore Resources",
      backgroundImage: "/images/healthyliving.jpg",
      gradientColor: "#60ab66"
    }
  ];

  const handleSignUp = (): void => {
    window.location.href = '/signup';
  };

  return (
    <section className="w-full p-0 m-0">
      {/* Full-screen Hero Section */}
      <div
        className="relative w-full h-screen flex items-end lg:items-end justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/fullwidthbg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#60ab66]/60" />
        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col lg:flex-row items-center lg:items-end justify-center h-full pb-12 lg:pb-20">
          {/* Decorative vertical bar */}
          <div className="hidden lg:block w-2 h-80 bg-[#60ab66] rounded-full mr-10 mb-8 shadow-lg" />
          {/* Text Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 lg:p-14 flex flex-col gap-6 max-w-2xl w-full lg:ml-0 ml-auto text-left items-start lg:items-start lg:text-left text-center">
            <span className="uppercase tracking-widest text-[#60ab66] font-bold text-sm lg:text-base">Unleash Your Potential</span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-[#2e3d27] leading-tight mb-2">
              GROW A MUSCLE
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#2e3d27] mb-2">
              Transform Your Body. Transform Your Life.
            </h2>
            <p className="text-lg lg:text-xl text-[#2e3d27] mb-2">
              Start your journey with personalized plans, expert tips, and a community that lifts you higher. Whether you're a beginner or a pro, we're here to help you build strength, confidence, and lasting results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleSignUp}
                className="bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Start Your Journey
              </button>
              <a href="#features" className="bg-white border-2 border-[#60ab66] text-[#60ab66] px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#e0e5dc] transition-all duration-300 shadow-md hover:shadow-xl text-center">
                See Features
              </a>
            </div>
            <span className="text-[#60ab66] font-medium text-base mt-4">No pressure — just progress, at your own pace.</span>
          </div>
        </div>
        {/* Tagline at the bottom */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-[#2e3d27]/80 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg tracking-wide">Stronger Every Day</span>
        </div>
      </div>
      {/* Why Choose Section */}
      <div className="bg-white w-full py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="uppercase tracking-widest text-[#60ab66] font-bold text-base mb-2 block">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2e3d27] mb-6 leading-tight">Why Grow A Muscle?</h2>
            <p className="italic text-lg text-[#60ab66] mb-6">“Empowering you to build strength, confidence, and a healthier lifestyle—one workout at a time.”</p>
            <p className="text-[#2e3d27] text-lg mb-4">Grow A Muscle is your all-in-one fitness companion, designed to help you achieve your goals with personalized workout plans, expert guidance, and a supportive community. Whether you're just starting out or looking to break through plateaus, our platform adapts to your needs and keeps you motivated.</p>
            <p className="text-[#2e3d27] text-lg mb-4">Our certified trainers and nutritionists provide science-backed advice, while our progress tracking tools ensure you see real results. Join thousands of users who have transformed their lives and discovered the power of consistency.</p>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#60ab66] mr-2">10,000+</span>
                <span className="text-[#2e3d27] text-base">workouts completed</span>
              </div>
              <a href="#" className="ml-8 bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl">Learn More About Us</a>
            </div>
          </div>
          {/* Right: Image with accent */}
          <div className="relative flex justify-center items-center">
            <div className="absolute -left-8 top-8 w-40 h-40 bg-[#60ab66]/30 rounded-2xl z-0 hidden md:block" />
            <img src="/images/healthyliving.jpg" alt="Why Grow A Muscle" className="relative z-10 rounded-2xl shadow-2xl w-full max-w-md object-cover" />
          </div>
        </div>
      </div>
      {/* Main content container with white background */}
      <div className="bg-white w-full min-h-[60vh] pt-16 pb-16" id="features">
        <div className="max-w-7xl mx-auto">
          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                buttonText={feature.buttonText}
                backgroundImage={feature.backgroundImage}
                gradientColor={feature.gradientColor}
                onClick={feature.onClick}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="bg-white w-full py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#2e3d27] mb-10 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">“Grow A Muscle helped me stay consistent and motivated. The community and plans are amazing!”</p>
              <span className="font-bold text-[#60ab66]">James P.</span>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">“I love the personalized workouts and the easy progress tracking. I feel stronger every week!”</p>
              <span className="font-bold text-[#60ab66]">Maria S.</span>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User 3" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">“The expert tips and support from the community keep me going. Best fitness app I've tried!”</p>
              <span className="font-bold text-[#60ab66]">Alex R.</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default DashboardSection;
