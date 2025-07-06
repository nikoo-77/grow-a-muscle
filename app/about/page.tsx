import React from 'react';
import Navbar from '../components/Navbar';

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

const iconStyle = 'w-6 h-6 text-[#60ab66] hover:text-[#2e3d27] transition-colors duration-200';

const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen bg-white pt-32 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-8">
          <h1 className="text-5xl font-extrabold text-[#2e3d27] text-center mb-4">About Grow A Muscle</h1>
          <p className="text-xl text-[#60ab66] italic text-center mb-6">Empowering you to build strength, confidence, and a healthier lifestyle—one workout at a time.</p>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">Our Mission</h2>
            <p className="text-lg text-[#2e3d27]">At Grow A Muscle, our mission is to inspire and empower individuals of all fitness levels to achieve their health and wellness goals. We believe in the power of community, expert guidance, and personalized plans to help you transform your body and your life.</p>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">Our Vision</h2>
            <p className="text-lg text-[#2e3d27]">We envision a world where everyone has access to the tools, knowledge, and support they need to live a healthy, active lifestyle. Our platform is designed to break down barriers and make fitness accessible, enjoyable, and sustainable for all.</p>
          </div>
          <div className="flex flex-col gap-6 mt-10">
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2 text-center">Meet Our Team</h2>
            <p className="text-lg text-[#2e3d27] text-center mb-8">Our philosophy is simple: build with passion, support each other, and deliver the best experience for our users.</p>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-[#f6f9f6] rounded-2xl shadow-lg p-6 flex flex-col items-center w-full md:w-72">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#60ab66] shadow-md"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#2e3d27] mb-1">{member.name}</h3>
                    <p className="text-[#60ab66] text-base font-medium mb-2">{member.role}</p>
                    <p className="italic text-[#2e3d27] text-sm mb-3">"{member.quote}"</p>
                    <div className="flex justify-center gap-4 mt-2">
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
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-10">
            <h2 className="text-3xl font-bold text-[#2e3d27] mb-2">Join Our Community</h2>
            <p className="text-lg text-[#2e3d27]">Whether you're just starting out or looking to break through plateaus, Grow A Muscle is here for you. Join thousands of users who have transformed their lives and discovered the power of consistency, support, and expert guidance.</p>
          </div>
          <div className="flex justify-center mt-8">
            <a href="/signup" className="bg-[#60ab66] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#6ed076] transition-all duration-300 shadow-md hover:shadow-xl">Start Your Journey</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 