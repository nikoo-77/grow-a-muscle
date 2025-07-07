"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (signInError || !data.user) {
        throw signInError || new Error("Login failed");
      }
      // Update lastLogin in users table
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);
      // Insert login event into login_history table using session user id
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;
      if (userId) {
        await supabase
          .from("login_history")
          .insert({ user_id: userId, login_at: new Date().toISOString() });
      }
      router.push("/");
    } catch (error: unknown) {
      let msg = "Failed to sign in. Please check your credentials";
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        if ((error as any).message.includes("Invalid login credentials")) {
          msg = "Incorrect email or password.";
        } else {
          msg = (error as any).message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-[#97d39b] p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* Back Link */}
        <div className="mb-5">
          <a
            href="/"
            className="text-base text-[#2e3d27] hover:text-[#60ab66] transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2e3d27] mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[#2e3d27]/80">
            Sign in to continue your fitness journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#2e3d27] mb-1"
            >
              Email
            </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-sm text-[#1a1a1a] placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
                placeholder="you@example.com"
                />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2e3d27] mb-1"
            >
              Password
            </label>
            <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 text-sm text-[#1a1a1a] placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60ab66]"
            placeholder="Enter your password"
          />
          </div>

          <div className="flex items-center justify-between text-sm text-[#2e3d27]">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-[#60ab66] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#60ab66] text-white py-2 rounded-md font-semibold text-sm hover:bg-[#6ed076] transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Prompt */}
        <div className="text-center text-sm text-[#2e3d27] mt-6">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-[#60ab66] font-medium hover:underline"
          >
            Sign up
          </a>
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-[#97d39b]/20 rounded-md text-sm text-[#2e3d27]">
          <h3 className="font-semibold mb-2 text-center">
            What you can do:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Access personalized workout plans</li>
            <li>Track your progress and achievements</li>
            <li>Connect with the community</li>
            <li>Get expert tips & guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
