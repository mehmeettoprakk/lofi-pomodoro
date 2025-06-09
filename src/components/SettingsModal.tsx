"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsModalProps {
  onClose: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
}

// Zaman seçenekleri (dakika)
const timeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45];

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
        className="bg-gradient-to-br from-[#2a2a4e] to-[#1e1e3b] p-6 rounded-lg shadow-2xl w-full max-w-sm border border-white/10"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Ayarlar</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Pomodoro Süresi
            </label>

            {/* Zaman seçenekleri grid */}
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => onDurationChange(time)}
                  className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    duration === time
                      ? "bg-white text-gray-900 shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}>
                  {time} dk
                </button>
              ))}
            </div>

            {/* Seçili süre göstergesi */}
            <div className="mt-3 text-center text-white/70 text-sm">
              Seçili süre:{" "}
              <span className="font-bold text-white">{duration} dakika</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            Tamam
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
