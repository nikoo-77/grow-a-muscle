'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Andre Emmanuel Delica',
    role: 'Founder & Full Stack Developer',
    image: '/images/andre.jpg',
    quote: 'Will debug for protein shakes.',
    socials: {
      facebook: 'https://www.facebook.com/dredels',
      instagram: 'https://www.instagram.com/dreeey.14/',
      github: 'https://github.com/andredels',
    },
  },
  {
    name: 'Janssen Rae Elegino',
    role: 'UI/UX Designer & Frontend Developer',
    image: '/images/janssen.jpg',
    quote: 'Squats by day, semicolons by night.',
    socials: {
      facebook: 'https://www.pornhub.com/',
      instagram: 'https://jav.guru/',
      github: 'https://beeg.com/',
    },
  },
  {
    name: 'Gelo Nikolai Lajera',
    role: 'Backend Developer & Database Architect',
    image: '/images/gelo.jpg',
    quote: 'Push code, pull weights.',
    socials: {
      facebook: 'https://www.facebook.com/andrea.fin.2024',
      instagram: 'https://www.instagram.com/dreandreandrea/',
      github: 'https://github.com/jdesolate',
    },
  },
];

const iconStyle = 'w-7 h-7 text-[#60ab66] hover:text-[#2e3d27] hover:scale-110 transition-transform duration-200';

const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section with full-width background image */}
      <motion.div
        className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden"
        style={{zIndex:1}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/images/fitness-girl-with-dumbbells-dark-background-isolated_2221-2258.avif"
          alt="Fitness Girl with Dumbbells"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{zIndex:1}}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute inset-0 bg-[#222]/70" style={{zIndex:2}} />
        <motion.div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="uppercase tracking-widest text-[#60ab66] font-bold text-base md:text-lg mb-2">About Us</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-xl">Grow A Muscle</h1>
          <p className="text-xl md:text-2xl text-[#e0e5dc] font-medium max-w-2xl mx-auto drop-shadow-lg">Empowering you to build strength, confidence, and a healthier lifestyle—one workout at a time.</p>
        </motion.div>
      </motion.div>
      {/* Main Content Section */}
      <section className="w-full min-h-screen pt-10 pb-20 px-4 flex flex-col items-center bg-gradient-to-br from-[#e8f5e9] via-[#f6fff8] to-[#e0f7fa]">
        <motion.div
          className="max-w-5xl w-full mx-auto bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-12 border border-[#e0e5dc] mt-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              className="flex flex-col gap-4 bg-[#f6f9f6] rounded-2xl p-6 shadow-md border border-[#e0e5dc]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#60ab66] mb-1 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#60ab66] rounded-full"></span>Our Mission
              </h2>
              <p className="text-lg text-[#2e3d27]">At Grow A Muscle, our mission is to inspire and empower individuals of all fitness levels to achieve their health and wellness goals. We believe in the power of community, expert guidance, and personalized plans to help you transform your body and your life.</p>
            </motion.div>
            <motion.div
              className="flex flex-col gap-4 bg-[#f6f9f6] rounded-2xl p-6 shadow-md border border-[#e0e5dc]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-[#60ab66] mb-1 flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#60ab66] rounded-full"></span>Our Vision
              </h2>
              <p className="text-lg text-[#2e3d27]">We envision a world where everyone has access to the tools, knowledge, and support they need to live a healthy, active lifestyle. Our platform is designed to break down barriers and make fitness accessible, enjoyable, and sustainable for all.</p>
            </motion.div>
          </div>
          {/* How It Works Section */}
          <div className="flex flex-col gap-6 mt-10">
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">How It Works</h2>
            <ol className="list-decimal list-inside text-lg text-[#2e3d27] space-y-2 pl-4">
              <li><span className="font-semibold text-[#60ab66]">Sign Up:</span> Create your free account and set your fitness goals.</li>
              <li><span className="font-semibold text-[#60ab66]">Personalize:</span> Choose from a variety of programs tailored to your needs—muscle building, weight loss, flexibility, and more.</li>
              <li><span className="font-semibold text-[#60ab66]">Track Progress:</span> Log your workouts, monitor your progress, and celebrate your achievements with our easy-to-use dashboard.</li>
              <li><span className="font-semibold text-[#60ab66]">Get Support:</span> Join our community, ask questions, and get advice from experts and fellow members.</li>
              <li><span className="font-semibold text-[#60ab66]">Stay Motivated:</span> Access tips, articles, and challenges to keep you inspired on your journey.</li>
            </ol>
          </div>
          {/* Meet the Team Section - Redesigned */}
          <div className="flex flex-col gap-8 mt-6">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-4xl font-extrabold text-[#2e3d27] text-center mb-1 tracking-tight">Meet Our Team</h2>
              <span className="text-[#60ab66] text-lg font-medium text-center">Our philosophy: build with passion, support each other, and deliver the best experience for our users.</span>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-4">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  className="relative bg-white rounded-3xl shadow-xl border border-[#e0e5dc] p-7 flex flex-col items-center w-full md:w-80 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(96,171,102,0.15)' }}
                >
                  {/* Accent Bar */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#60ab66] via-[#6ed076] to-[#97d39b] rounded-t-3xl" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#60ab66] shadow-md mt-4"
                  />
                  <div className="text-center flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-[#2e3d27] mb-1 mt-2 group-hover:text-[#60ab66] transition-colors duration-200">{member.name}</h3>
                    <p className="text-[#60ab66] text-base font-semibold mb-2">{member.role}</p>
                    <div className="bg-[#f6f9f6] border border-[#e0e5dc] rounded-xl px-4 py-2 mb-3 mt-1 shadow-sm max-w-xs">
                      <span className="italic text-[#2e3d27] text-sm">"{member.quote}"</span>
                    </div>
                    <div className="flex justify-center gap-5 mt-2">
                      <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <svg className={iconStyle} fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                      </a>
                      <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg className={iconStyle} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.334 3.678 1.315c-.98.98-1.187 2.092-1.245 3.373C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.612.058 1.281.265 2.393 1.245 3.373.98.98 2.092 1.187 3.373 1.245C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.393-.265 3.373-1.245.98-.98 1.187-2.092 1.245-3.373.058-1.28.07-1.689.07-7.612 0-5.923-.012-6.332-.07-7.612-.058-1.281-.265-2.393-1.245-3.373-.98-.98-2.092-1.187-3.373-1.245C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                      </a>
                      <a href={member.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg className={iconStyle} fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* End Meet the Team Section */}
          {/* FAQ Section */}
          <motion.div
            className="flex flex-col gap-6 mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <motion.div className="bg-[#f6f9f6] border border-[#e0e5dc] rounded-xl p-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-semibold text-[#60ab66] text-lg mb-1">Is Grow A Muscle free to use?</h3>
                <p className="text-[#2e3d27]">Yes! Our core features are free for everyone. We believe in making fitness accessible to all.</p>
              </motion.div>
              <motion.div className="bg-[#f6f9f6] border border-[#e0e5dc] rounded-xl p-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="font-semibold text-[#60ab66] text-lg mb-1">Do I need any equipment to get started?</h3>
                <p className="text-[#2e3d27]">No equipment is required for most beginner programs. As you progress, you can incorporate equipment for advanced workouts.</p>
              </motion.div>
              <motion.div className="bg-[#f6f9f6] border border-[#e0e5dc] rounded-xl p-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="font-semibold text-[#60ab66] text-lg mb-1">Can I track my progress?</h3>
                <p className="text-[#2e3d27]">Absolutely! Our dashboard lets you log workouts, monitor your achievements, and visualize your progress over time.</p>
              </motion.div>
              <motion.div className="bg-[#f6f9f6] border border-[#e0e5dc] rounded-xl p-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="font-semibold text-[#60ab66] text-lg mb-1">Is there a community I can join?</h3>
                <p className="text-[#2e3d27]">Yes, we have a vibrant community where you can connect, share tips, and get support from other members and experts.</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col gap-6 mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">Join Our Community</h2>
            <p className="text-lg text-[#2e3d27]">Whether you're just starting out or looking to break through plateaus, Grow A Muscle is here for you. Join thousands of users who have transformed their lives and discovered the power of consistency, support, and expert guidance.</p>
          </motion.div>
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="/" className="bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl">Start Your Journey</a>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default AboutPage; 