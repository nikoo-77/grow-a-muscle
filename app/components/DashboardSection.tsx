"use client";

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

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
    <section className="min-h-screen bg-[#e0e5dc] px-6 py-16"> {/* 🌿 Background */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#60ab66] via-[#97d39b] to-[#6ed076]" /> {/* 🌈 Updated hero bg */}

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#97d39b]/30 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6ed076]/20 rounded-full blur-2xl transform -translate-x-16 translate-y-16" />

          <div className="relative z-10 p-12 lg:p-16">
            <div className="max-w-4xl">
              <h1 className="text-6xl lg:text-8xl font-bold mb-8 text-[#2e3d27] leading-tight">
                GROW A MUSCLE
              </h1>

              <div className="space-y-6 text-[#2e3d27]">
                <p className="text-2xl lg:text-3xl font-medium">
                  Ready to take control of your fitness journey?
                </p>
                <p className="text-xl lg:text-2xl leading-relaxed">
                  Whether you're just starting out or leveling up, our personalized workout plans and expert resources are built just for you.
                </p>
                <p className="text-xl lg:text-2xl leading-relaxed">
                  Join a supportive community that keeps you motivated, inspired, and on track.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-12 gap-6">
                <p className="text-[#2e3d27] text-xl lg:text-2xl">
                  No pressure — just progress, at your own pace.
                </p>
                {!user && (
                  <button 
                    onClick={handleSignUp}
                    className="bg-[#60ab66] text-white px-12 py-4 rounded-2xl text-xl font-semibold hover:bg-[#6ed076] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Your Journey
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

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

      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default DashboardSection;
