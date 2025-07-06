"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (signUpError || !data.user) {
        throw signUpError || new Error("Signup failed");
      }
      
      // Insert user profile into users table
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        height: null,
        weight: null,
        medical_info: null,
        profile_picture: null
      });
      if (insertError) {
        setError('Failed to save user profile: ' + insertError.message);
        setLoading(false);
        return;
      }
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-[#97d39b] p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Back Button */}
        <div className="mb-5">
          <a
            href="/"
            className="text-base text-[#2e3d27] hover:text-[#60ab66] transition-colors"
          >
            ← Back to Homepage
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2e3d27] mb-2">
            Join Grow A Muscle
          </h1>
          <p className="text-sm text-[#2e3d27]/80">
            Start your fitness journey today and build the body you've always
            wanted.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[#2e3d27] mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[#2e3d27] mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
              />
            </div>
          </div>

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
              className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-[#2e3d27] mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
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
              className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#2e3d27] mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 text-sm text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-[#60ab66] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#60ab66] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#6ed076] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Already have account */}
        <div className="text-center text-sm text-[#2e3d27] mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#60ab66] font-medium hover:underline"
          >
            Sign In
          </a>
        </div>

        {/* Benefits */}
        <div className="mt-6 p-4 bg-[#97d39b]/20 rounded-md text-sm text-[#2e3d27]">
          <h3 className="font-semibold mb-2 text-center">What You'll Get:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Personalized workout plans tailored to your goals</li>
            <li>Progress tracking and analytics</li>
            <li>Expert video guides and tips</li>
            <li>Supportive community of fitness enthusiasts</li>
            <li>Nutrition guidance and meal planning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
