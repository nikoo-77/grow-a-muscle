"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, db } from "../../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Initialize Firebase Auth
const auth = getAuth(app);

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    fitnessGoal: "build-muscle"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Save additional user data to Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        fitnessGoal: formData.fitnessGoal,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      console.log("User created successfully:", userCredential.user);
      
      // Redirect to dashboard or home page
      router.push("/");
    } catch (error: any) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("An account with this email already exists");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters long");
          break;
        default:
          setError(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[white] flex items-center justify-center px-4 py-8">
      <div className="bg-[#505168] p-10 rounded-lg shadow-lg max-w-[600px] w-full">
        {/* Back to Homepage Button */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-xl text-gray-300 hover:text-white transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Homepage
          </a>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4"> Join Grow A Muscle</h1>
          <p className="text-2xl text-gray-300">
            Start your fitness journey today and build the body you've always wanted
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-2xl font-semibold text-white mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-2xl font-semibold text-white mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-2xl font-semibold text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="fitnessGoal" className="block text-2xl font-semibold text-white mb-2">
              Primary Fitness Goal
            </label>
            <select
              id="fitnessGoal"
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleInputChange}
              className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="strength-training">Strength Training</option>
              <option value="lose-weight">Lose Weight</option>
              <option value="muscle-building">Muscle Building</option>
              <option value="active-lifestyle">Active Lifestyle</option>
              <option value="improve-endurance-and-stamina">Improve Endurance and Stamina</option>
              <option value="improve-flexibility">Improve Flexibility</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-2xl font-semibold text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-2xl font-semibold text-white mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-6 py-4 text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#27233A] px-10 py-6 rounded-lg hover:bg-gray-200 transition-colors text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-2xl text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign In
            </a>
          </p>
        </div>

        <div className="mt-8 p-6 bg-[#27233A] rounded-lg">
          <h3 className="text-3xl font-bold text-white mb-4 text-center"> What You'll Get</h3>
          <ul className="space-y-3 text-xl text-gray-300">
            <li className="flex items-center">
              <span className="mr-3">-</span>
              Personalized workout plans tailored to your goals
            </li>
            <li className="flex items-center">
              <span className="mr-3">-</span>
              Progress tracking and analytics
            </li>
            <li className="flex items-center">
              <span className="mr-3">-</span>
              Expert video guides and tips
            </li>
            <li className="flex items-center">
              <span className="mr-3">-</span>
              Supportive community of fitness enthusiasts
            </li>
            <li className="flex items-center">
              <span className="mr-3">-</span>
              Nutrition guidance and meal planning
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 