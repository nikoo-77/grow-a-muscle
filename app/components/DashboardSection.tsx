"use client";

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProgramsModal from './ProgramsModal';
import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";

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
    <motion.div
      className="group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl"
      whileHover={{ scale: 1.07, boxShadow: '0 35px 60px -12px rgba(96,171,102,0.25)' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
    >
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
          <motion.h3
            className="text-4xl font-bold mb-6 text-white leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-xl text-[#2e3d27] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {description}
          </motion.p>
        </div>
        <motion.button
          onClick={onClick}
          className="w-full bg-[#60ab66]/80 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#6ed076]/90 hover:border-white/50 transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
};

const AnimatedCounter = ({ target, duration = 2, className = '' }: { target: number, duration?: number, className?: string }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    let incrementTime = Math.abs(Math.floor((duration * 1000) / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span className={className}>{count.toLocaleString()}</span>;
};

const DashboardSection: React.FC = () => {
  const { user } = useAuth();
  const [programsOpen, setProgramsOpen] = useState(false);

  const handleProgramsOpen = () => setProgramsOpen(true);
  const handleCommunity = () => { window.location.href = '/community'; };
  const handleProgress = () => { window.location.href = '/progress'; };
  const handleWorkouts = () => { window.location.href = '/workouts'; };

  const features: FeatureCardProps[] = [
    {
      title: "Personalized Workout Plans",
      description: "Track workouts, body stats, and achievements with easy-to-use dashboards and progress visuals to stay motivated.",
      buttonText: "View Workout Plans",
      backgroundImage: "/images/dashboard-bg.jpg",
      gradientColor: "#60ab66",
      onClick: handleProgramsOpen
    },
    {
      title: "Community Support",
      description: "Connect with like-minded fitness enthusiasts and get the motivation you need to reach your goals.",
      buttonText: "Visit Community",
      backgroundImage: "/images/visitcommunity.jpg",
      gradientColor: "#97d39b",
      onClick: handleCommunity
    },
    {
      title: "Progress Tracking Tools",
      description: "Stay motivated with visual progress charts, stat logs, and workout history to see how far you've come.",
      buttonText: "Track Progress",
      backgroundImage: "/images/trackprogress.jpg",
      gradientColor: "#6ed076",
      onClick: handleProgress
    },
    {
      title: "Expert Tips & Video Guides",
      description: "Learn from certified trainers and nutritionists through easy-to-follow videos and tips tailored to your goals.",
      buttonText: "Explore Resources",
      backgroundImage: "/images/healthyliving.jpg",
      gradientColor: "#60ab66",
      onClick: handleWorkouts
    }
  ];

  const handleSignUp = (): void => {
    window.location.href = '/signup';
  };

  return (
    <section className="w-full p-0 m-0">
      {/* Full-screen Hero Section */}
      <motion.div
        className="relative w-full min-h-[calc(100vh-6rem)] flex items-end lg:items-end justify-center overflow-hidden pt-28"
        style={{
          backgroundImage: "url('/images/fullwidthbg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[#60ab66]/60" />
        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col lg:flex-row items-center lg:items-end justify-center h-full pb-12 lg:pb-20">
          {/* Decorative vertical bar */}
          <motion.div
            className="hidden lg:block w-2 h-80 bg-[#60ab66] rounded-full mr-10 mb-8 shadow-lg"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ transformOrigin: 'bottom' }}
          />
          {/* Text Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 lg:p-14 flex flex-col gap-6 max-w-2xl w-full lg:ml-0 ml-auto text-left items-start lg:items-start lg:text-left text-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              className="uppercase tracking-widest text-[#60ab66] font-bold text-sm lg:text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >Unleash Your Potential</motion.span>
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold text-[#2e3d27] leading-tight mb-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >GROW A MUSCLE</motion.h1>
            <motion.h2
              className="text-2xl lg:text-3xl font-semibold text-[#2e3d27] mb-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >Transform Your Body. Transform Your Life.</motion.h2>
            <motion.p
              className="text-lg lg:text-xl text-[#2e3d27] mb-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >Start your journey with personalized plans, expert tips, and a community that lifts you higher. Whether you&apos;re a beginner or a pro, we&apos;re here to help you build strength, confidence, and lasting results.</motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {!user && (
                <button
                  onClick={handleSignUp}
                  className="bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Start Your Journey
                </button>
              )}
              <a href="#features" className="bg-white border-2 border-[#60ab66] text-[#60ab66] px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#e0e5dc] transition-all duration-300 shadow-md hover:shadow-xl text-center">
                See Features
              </a>
            </motion.div>
            <motion.span
              className="text-[#60ab66] font-medium text-base mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >No pressure — just progress, at your own pace.</motion.span>
          </motion.div>
        </div>
        {/* Tagline at the bottom */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          <span className="bg-[#2e3d27]/80 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg tracking-wide">Stronger Every Day</span>
        </motion.div>
      </motion.div>
      {/* Why Choose Section */}
      <div className="bg-white w-full py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="uppercase tracking-widest text-[#60ab66] font-bold text-base mb-2 block">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2e3d27] mb-6 leading-tight">Why Grow A Muscle?</h2>
            <p className="italic text-lg text-[#60ab66] mb-6">"Empowering you to build strength, confidence, and a healthier lifestyle—one workout at a time."</p>
            <p className="text-[#2e3d27] text-lg mb-4">Grow A Muscle is your all-in-one fitness companion, designed to help you achieve your goals with personalized workout plans, expert guidance, and a supportive community. Whether you're just starting out or looking to break through plateaus, our platform adapts to your needs and keeps you motivated.</p>
            <p className="text-[#2e3d27] text-lg mb-4">Our certified trainers and nutritionists provide science-backed advice, while our progress tracking tools ensure you see real results. Join thousands of users who have transformed their lives and discovered the power of consistency.</p>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#60ab66] mr-2">
                  <AnimatedCounter target={10000} duration={2} />+
                </span>
                <span className="text-[#2e3d27] text-base">workouts completed</span>
              </div>
              <Link href="/about" className="ml-8 bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl">Learn More About Us</Link>
            </div>
          </motion.div>
          {/* Right: Image with accent */}
          <motion.div
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute -left-8 top-8 w-40 h-40 bg-[#60ab66]/30 rounded-2xl z-0 hidden md:block" />
            <Image src="/images/healthyliving.jpg" alt="Why Grow A Muscle" width={400} height={400} className="relative z-10 rounded-2xl shadow-2xl w-full max-w-md object-cover" />
          </motion.div>
        </div>
      </div>
      {/* Main content container with white background */}
      <div className="bg-white w-full min-h-[60vh] pt-16 pb-16" id="features">
        <div className="max-w-7xl mx-auto">
          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
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
          </motion.div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="bg-white w-full py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#2e3d27] mb-10 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(96,171,102,0.15)' }}
            >
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">"Grow A Muscle helped me stay consistent and motivated. The community and plans are amazing!"</p>
              <span className="font-bold text-[#60ab66]">James P.</span>
            </motion.div>
            {/* Testimonial 2 */}
            <motion.div
              className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(96,171,102,0.15)' }}
            >
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">"I love the personalized workouts and the easy progress tracking. I feel stronger every week!"</p>
              <span className="font-bold text-[#60ab66]">Maria S.</span>
            </motion.div>
            {/* Testimonial 3 */}
            <motion.div
              className="bg-[#f6f9f6] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(96,171,102,0.15)' }}
            >
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User 3" className="w-20 h-20 rounded-full mb-4 border-4 border-[#60ab66] object-cover" />
              <p className="text-lg text-[#2e3d27] mb-4">"The expert tips and support from the community keep me going. Best fitness app I&apos;ve tried!"</p>
              <span className="font-bold text-[#60ab66]">Alex R.</span>
            </motion.div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
      <ProgramsModal open={programsOpen} onClose={() => setProgramsOpen(false)} user={user} />
    </section>
  );
};

export default DashboardSection;
