"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, db } from "../../lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Initialize Firebase Auth
const auth = getAuth(app);

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Update last login timestamp in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await updateDoc(userDocRef, {
        lastLogin: new Date()
      });
      
      console.log("User signed in successfully:", userCredential.user);
      
      // Redirect to dashboard or home page
      router.push("/");
    } catch (error: any) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No account found with this email address");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later");
          break;
        default:
          setError("Failed to sign in. Please check your credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[white] flex items-center justify-center px-4 py-8">
      <div className="bg-[#505168] p-10 rounded-lg shadow-lg max-w-[500px] w-full">
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
          <h1 className="text-6xl font-bold text-white mb-4">💪 Welcome Back</h1>
          <p className="text-2xl text-gray-300">
            Sign in to continue your fitness journey
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-xl text-gray-300">
              <input
                type="checkbox"
                className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              Remember me
            </label>
            <a href="#" className="text-xl text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#27233A] px-10 py-6 rounded-lg hover:bg-gray-200 transition-colors text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-2xl text-gray-300">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign Up
            </a>
          </p>
        </div>

        <div className="mt-8 p-6 bg-[#27233A] rounded-lg">
          <h3 className="text-3xl font-bold text-white mb-4 text-center">🚀 Ready to Continue?</h3>
          <ul className="space-y-3 text-xl text-gray-300">
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              Access your personalized workout plans
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              Track your progress and achievements
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              Connect with the fitness community
            </li>
            <li className="flex items-center">
              <span className="mr-3">✅</span>
              Get expert tips and guidance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 