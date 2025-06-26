import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState } from "react";

interface ProgressModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string | null;
}

export default function ProgressModal({ open, onClose, userId }: ProgressModalProps) {
  // Weight log state (start empty)
  const [weightLogs, setWeightLogs] = useState<number[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [adding, setAdding] = useState(false);

  // Calculate weight change
  const weightChange = weightLogs.length > 1
    ? (weightLogs[weightLogs.length - 1] - weightLogs[0]).toFixed(1)
    : "0";

  // Add new weight log
  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    setAdding(true);
    setWeightLogs([...weightLogs, parseFloat(newWeight)]);
    setNewWeight("");
    setAdding(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-6 text-[#2e3d27]">Your Progress</DialogTitle>

          {/* Workout Progress Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#2e3d27] mb-2">Workout Progress</h3>
            <div className="p-4 bg-[#f8fdf8] rounded-xl text-[#2e3d27] border border-[#60ab66]/30">
              Progress tracking for your selected workout will appear here. <span className="italic">(Feature coming soon!)</span>
            </div>
          </div>

          {/* Weight Logs Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#2e3d27] mb-2">Weight Logs</h3>
            <form onSubmit={handleAddWeight} className="flex gap-2 mb-4">
              <input
                type="number"
                step="any"
                min="0"
                className="flex-1 border rounded px-3 py-2 text-[#2e3d27] placeholder:text-gray-400"
                placeholder="Enter weight (kg)"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#60ab66] text-white px-4 py-2 rounded font-semibold hover:bg-[#4c8a53] transition"
                disabled={adding || !newWeight}
              >
                Add
              </button>
            </form>
            <div className="bg-[#e0e5dc] rounded-xl p-4">
              {weightLogs.length === 0 ? (
                <div className="text-[#2e3d27] text-center">No weights logged yet.</div>
              ) : (
                <ul className="space-y-1">
                  {weightLogs.map((weight, idx) => (
                    <li key={idx} className="flex justify-between text-[#2e3d27]">
                      <span>Entry {idx + 1}</span>
                      <span className="font-semibold">{weight} kg</span>
                    </li>
                  ))}
                </ul>
              )}
              {weightLogs.length > 1 && (
                <div className="mt-3 text-[#2e3d27] text-sm">
                  <span className="font-semibold">Change:</span> {weightChange} kg
                  <span className="ml-2">({weightLogs[0]} kg → {weightLogs[weightLogs.length - 1]} kg)</span>
                </div>
              )}
            </div>
          </div>

          <button
            className="mt-2 w-full py-2 rounded bg-gray-200 text-gray-700 font-semibold"
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