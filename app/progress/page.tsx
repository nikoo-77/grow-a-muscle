"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

export default function ProgressPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [weightData, setWeightData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available fitness goals for the user
  useEffect(() => {
    if (!user) return;
    const fetchGoals = async () => {
      const { data: workouts } = await supabase
        .from("user_workouts")
        .select("fitness_goal")
        .eq("user_id", user.id || user.uid);
      const { data: logs } = await supabase
        .from("exercise_log")
        .select("fitness_goal")
        .eq("user_id", user.id || user.uid);
      const allGoals = [
        ...(workouts?.map(w => w.fitness_goal) || []),
        ...(logs?.map(l => l.fitness_goal) || [])
      ].filter(Boolean);
      // Add fallback static list if no goals found
      const staticGoals = [
        "strength-training",
        "muscle-building",
        "lose-weight",
        "improve-endurance-and-stamina",
        "improve-flexibility",
        "active-lifestyle"
      ];
      const uniqueGoals = Array.from(new Set([...allGoals, ...staticGoals]));
      setGoals(uniqueGoals);
      if (uniqueGoals.length > 0 && !selectedGoal) setSelectedGoal(uniqueGoals[0]);
    };
    fetchGoals();
    // eslint-disable-next-line
  }, [user]);

  // Fetch analytics for selected goal
  useEffect(() => {
    if (!user || !selectedGoal) return;
    setLoading(true);
    const fetchData = async () => {
      // 1. Weight Progress & Completed Workouts
      const { data: workouts } = await supabase
        .from("user_workouts")
        .select("date, weight, completed_exercise, fitness_goal")
        .eq("user_id", user.id || user.uid)
        .eq("fitness_goal", selectedGoal)
        .order("date", { ascending: true });
      // 2. Volume Lifted
      const { data: logs } = await supabase
        .from("exercise_log")
        .select("date, sets, reps_duration, weight_lifted, fitness_goal")
        .eq("user_id", user.id || user.uid)
        .eq("fitness_goal", selectedGoal);
      // Weight Progress
      setWeightData(
        (workouts || []).filter(w => w.weight !== null).map(w => ({
          date: w.date.slice(0, 10),
          weight: w.weight
        }))
      );
      // Completed Workouts
      setWorkoutData(
        (workouts || []).filter(w => w.completed_exercise !== null).map(w => ({
          date: w.date.slice(0, 10),
          completed: w.completed_exercise
        }))
      );
      // Volume Lifted
      const volumeByDate: { [date: string]: number } = {};
      (logs || []).forEach(l => {
        if (l.sets && l.reps_duration && l.weight_lifted) {
          const d = l.date.slice(0, 10);
          const vol = l.sets * l.reps_duration * l.weight_lifted;
          volumeByDate[d] = (volumeByDate[d] || 0) + vol;
        }
      });
      setVolumeData(
        Object.entries(volumeByDate).map(([date, volume]) => ({ date, volume }))
      );
      setLoading(false);
    };
    fetchData();
  }, [user, selectedGoal]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col items-center py-6 px-2 pt-32">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold mb-6 text-[#2e3d27]">Your Progress Analytics</h1>
          {goals.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2 text-[#2e3d27]">Filter by Fitness Goal:</label>
              <select
                className="border rounded px-3 py-2 text-[#2e3d27]"
                value={selectedGoal}
                onChange={e => setSelectedGoal(e.target.value)}
              >
                {goals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          )}
          {loading ? (
            <div className="text-center text-lg">Loading analytics...</div>
          ) : (
            <>
              {/* Weight Progress Over Time */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-[#2e3d27] mb-2">Weight Progress Over Time</h3>
                {weightData.length === 0 ? (
                  <div className="text-center text-gray-500">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#60ab66" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Completed Workouts Per Session */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-[#2e3d27] mb-2">Completed Workouts Per Session</h3>
                {workoutData.length === 0 ? (
                  <div className="text-center text-gray-500">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={workoutData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#60ab66" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Total Volume Lifted Over Time */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-[#2e3d27] mb-2">Total Volume Lifted Over Time</h3>
                {volumeData.length === 0 ? (
                  <div className="text-center text-gray-500">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="volume" stroke="#4c8a53" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
} 