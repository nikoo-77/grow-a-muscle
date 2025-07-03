"use client";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState } from "react";
import { supabase } from '../../lib/supabaseClient';

interface ProgramsModalProps {
  open: boolean;
  onClose: () => void;
  user?: any;
  userProfile?: { fitness_goal?: string } | null;
}

const programs = [
  {
    value: "strength-training",
    name: "Strength Training",
    description: "Build strength with progressive resistance workouts.",
    difficulty: "All Levels",
    duration: "Flexible"
  },
  {
    value: "lose-weight",
    name: "Lose Weight",
    description: "Burn calories and shed fat with targeted routines.",
    difficulty: "All Levels",
    duration: "Flexible"
  },
  {
    value: "muscle-building",
    name: "Muscle Building",
    description: "Increase muscle mass with hypertrophy-focused plans.",
    difficulty: "All Levels",
    duration: "Flexible"
  },
  {
    value: "active-lifestyle",
    name: "Active Lifestyle",
    description: "Stay active and healthy with daily movement routines.",
    difficulty: "Beginner",
    duration: "Flexible"
  },
  {
    value: "improve-endurance-and-stamina",
    name: "Improve Endurance and Stamina",
    description: "Boost your cardiovascular fitness and stamina.",
    difficulty: "All Levels",
    duration: "Flexible"
  },
  {
    value: "improve-flexibility",
    name: "Improve Flexibility",
    description: "Enhance flexibility and mobility with stretching routines.",
    difficulty: "All Levels",
    duration: "Flexible"
  }
];

export default function ProgramsModal({ open, onClose, user, userProfile }: ProgramsModalProps) {
  const [selected, setSelected] = useState(userProfile?.fitness_goal || "");
  const [saving, setSaving] = useState(false);

  const handleSelect = async (value: string) => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ fitness_goal: value })
        .eq('id', user.id);
      if (!error) setSelected(value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-6 text-[#2e3d27]">Workout Programs</DialogTitle>
          <div className="space-y-6">
            {programs.map((program, idx) => {
              const isSelected = selected === program.value;
              return (
                <div key={idx} className={`p-5 rounded-xl border ${isSelected ? 'border-[#60ab66] bg-[#e0f7ea]' : 'border-[#60ab66] bg-[#f8fdf8]'} shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#2e3d27]">{program.name}</h3>
                      {isSelected && <span className="text-xs px-2 py-1 rounded-full bg-[#60ab66] text-white font-semibold">Recommended</span>}
                    </div>
                    <p className="text-[#2e3d27] mb-2">{program.description}</p>
                    <div className="text-sm text-gray-500">Duration: {program.duration} | Difficulty: {program.difficulty}</div>
                  </div>
                  <button
                    className={`px-6 py-2 rounded font-semibold transition ${isSelected ? 'bg-[#60ab66] text-white cursor-default' : 'bg-gray-200 text-[#2e3d27] hover:bg-[#60ab66]/20'}`}
                    onClick={() => !isSelected && handleSelect(program.value)}
                    disabled={isSelected || saving}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            className="mt-8 w-full py-2 rounded bg-gray-200 text-gray-700 font-semibold"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
} 