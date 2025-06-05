"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsModalProps {
  onClose: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
}

const SettingsModal = ({
  onClose,
  duration,
  onDurationChange,
}: SettingsModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-[#2a2a4e] to-[#1e1e3b] p-6 rounded-lg shadow-2xl w-full max-w-xs border border-white/10"
        onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-white/80 mb-1">
              Pomodoro (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
              className="w-full bg-white/10 border-none text-white p-2 rounded-md focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
