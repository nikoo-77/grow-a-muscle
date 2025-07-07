import React from 'react';
import Link from "next/link";

interface SignInPromptModalProps {
  open: boolean;
  onClose: () => void;
  action: string;
}

export default function SignInPromptModal({ open, onClose, action }: SignInPromptModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-[#60ab66]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#60ab66]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-[#2e3d27] mb-2">
            Sign In Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            You need to sign in to {action}. Join our community to share your progress, like posts, and connect with others!
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-[#60ab66] border border-[#60ab66] rounded-xl font-semibold hover:bg-[#60ab66]/10 transition-colors"
            >
              Maybe Later
            </button>
            <a
              href="/signup"
              className="flex-1 px-4 py-2 bg-[#60ab66] text-white rounded-xl font-semibold hover:bg-[#6ed076] transition-colors text-center"
            >
              Sign Up
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#60ab66] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 