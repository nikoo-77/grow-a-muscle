"use client";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState, useEffect } from "react";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string>("");

  // Update selected state when userProfile changes
  useEffect(() => {
    if (userProfile?.fitness_goal) {
      setSelected(userProfile.fitness_goal);
    }
  }, [userProfile?.fitness_goal]);

  const handleSelect = (value: string) => {
    if (!user) return;
    
    // If user already has this goal selected, no need for confirmation
    if (selected === value) return;
    
    // Show confirmation dialog
    setPendingSelection(value);
    setShowConfirmation(true);
  };

  const confirmSelection = async () => {
    if (!user || !pendingSelection) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ fitness_goal: pendingSelection })
        .eq('id', user.id);
      
      if (!error) {
        setSelected(pendingSelection);
        setShowConfirmation(false);
        setPendingSelection("");
      } else {
        alert('Failed to update fitness goal: ' + error.message);
      }
    } catch (error) {
      alert('An error occurred while updating your fitness goal.');
    } finally {
      setSaving(false);
    }
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setPendingSelection("");
  };

  const getSelectedProgram = () => {
    return programs.find(program => program.value === pendingSelection);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto z-10">
          {!showConfirmation ? (
            <>
              <DialogTitle className="text-2xl font-bold mb-6 text-[#2e3d27]">Workout Programs</DialogTitle>
              {selected && (
                <div className="mb-4 p-3 bg-[#e0f7ea] border border-[#60ab66] rounded-lg">
                  <p className="text-sm text-[#2e3d27]">
                    <strong>Current Selection:</strong> {programs.find(p => p.value === selected)?.name}
                  </p>
                </div>
              )}
              <div className="space-y-6">
                {programs.map((program, idx) => {
                  const isSelected = selected === program.value;
                  return (
                    <div key={idx} className={`p-5 rounded-xl border ${isSelected ? 'border-[#60ab66] bg-[#e0f7ea]' : 'border-[#60ab66] bg-[#f8fdf8]'} shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-[#2e3d27]">{program.name}</h3>
                          {isSelected && <span className="text-xs px-2 py-1 rounded-full bg-[#60ab66] text-white font-semibold">Selected</span>}
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
            </>
          ) : (
            <>
              <DialogTitle className="text-2xl font-bold mb-6 text-[#2e3d27]">Confirm Fitness Goal</DialogTitle>
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#2e3d27] mb-2">
                    {selected ? 'Change Fitness Goal?' : 'Select Fitness Goal?'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selected 
                      ? `This will change your fitness goal from "${programs.find(p => p.value === selected)?.name}" to "${getSelectedProgram()?.name}".`
                      : `This will set "${getSelectedProgram()?.name}" as your fitness goal and personalize your workout recommendations.`
                    }
                  </p>
                  <div className="bg-[#f8fdf8] p-4 rounded-lg border border-[#60ab66]">
                    <p className="text-sm text-[#2e3d27]">
                      <strong>Program:</strong> {getSelectedProgram()?.name}
                    </p>
                    <p className="text-sm text-[#2e3d27] mt-1">
                      <strong>Description:</strong> {getSelectedProgram()?.description}
                    </p>
                    <p className="text-sm text-[#2e3d27] mt-1">
                      <strong>Difficulty:</strong> {getSelectedProgram()?.difficulty} | <strong>Duration:</strong> {getSelectedProgram()?.duration}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-6 py-2 rounded font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    onClick={cancelSelection}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 rounded font-semibold bg-[#60ab66] text-white hover:bg-[#4c8a53] transition"
                    onClick={confirmSelection}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Confirm Selection'}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
} 