import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState, useEffect } from "react";

interface BMICalculatorModalProps {
  open: boolean;
  onClose: () => void;
  userProfile?: {
    height?: number | null;
    weight?: number | null;
  } | null;
}

function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export default function BMICalculatorModal({ open, onClose, userProfile }: BMICalculatorModalProps) {
  // User's profile values
  const [profileBMI, setProfileBMI] = useState<number | null>(null);

  // Custom input
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [customBMI, setCustomBMI] = useState<number | null>(null);

  useEffect(() => {
    if (userProfile?.height && userProfile?.weight) {
      setProfileBMI(calculateBMI(userProfile.height, userProfile.weight));
    } else {
      setProfileBMI(null);
    }
  }, [userProfile]);

  const handleCustomCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setCustomBMI(calculateBMI(h, w));
    } else {
      setCustomBMI(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <DialogPanel className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-auto z-10">
          <DialogTitle className="text-2xl font-bold mb-4 text-[#2e3d27]">BMI Calculator</DialogTitle>

          {/* User's BMI */}
          {profileBMI !== null ? (
            <div className="mb-6 p-4 bg-[#e0e5dc] rounded-xl text-center">
              <div className="text-lg font-semibold mb-1 text-[#2e3d27]">Your Profile BMI</div>
              <div className="text-3xl font-bold text-[#60ab66]">{profileBMI.toFixed(2)}</div>
              <div className="text-sm text-gray-600 mt-1 text-[#2e3d27]">
                Height: {userProfile?.height} cm &nbsp;|&nbsp; Weight: {userProfile?.weight} kg
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-[#fff7f7] rounded-xl text-center text-[#b94a48]">
              <div className="font-semibold">Add your height and weight in your profile to see your BMI here.</div>
            </div>
          )}

          {/* Custom BMI Calculator */}
          <form onSubmit={handleCustomCalculate} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-[#2e3d27]">Height (cm)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="w-full border rounded px-3 py-2 text-[#2e3d27] placeholder:text-gray-400"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="e.g. 170"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-[#2e3d27]">Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="w-full border rounded px-3 py-2 text-[#2e3d27] placeholder:text-gray-400"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 65"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#60ab66] hover:bg-[#4c8a53] text-white py-2 rounded-xl text-lg font-semibold transition"
            >
              Calculate BMI
            </button>
          </form>

          {customBMI !== null && (
            <div className="mt-6 p-4 bg-[#e0e5dc] rounded-xl text-center">
              <div className="text-lg font-semibold mb-1 text-[#2e3d27]">Calculated BMI</div>
              <div className="text-3xl font-bold text-[#60ab66]">{customBMI.toFixed(2)}</div>
            </div>
          )}

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