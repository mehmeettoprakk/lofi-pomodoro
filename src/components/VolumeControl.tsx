"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobil kontrol
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(
          window.innerWidth <= 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            )
        );
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Volume icon'a tıklamayla ses kapatma/açma
  const handleIconClick = () => {
    if (volume === 0) {
      onVolumeChange(0.5); // Ses kapalıysa yarıya açık
    } else {
      onVolumeChange(0); // Ses açıksa kapat
    }
  };

  // Slider değişiklikleri
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  // Touch events
  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto mt-4">
      {/* Volume icon - tıklanabilir */}
      <button
        onClick={handleIconClick}
        className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label={volume === 0 ? "Sesi aç" : "Sesi kapat"}>
        <VolumeIcon className="w-5 h-5" />
      </button>

      {/* Volume slider */}
      <div className="relative flex-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleSliderChange}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          className={`volume-slider w-full appearance-none cursor-pointer rounded-lg bg-white/20 outline-none transition-all ${
            isMobile ? "h-3" : "h-2"
          } ${isDragging ? "bg-white/30" : ""}`}
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${
              volume * 100
            }%, rgba(255,255,255,0.2) ${
              volume * 100
            }%, rgba(255,255,255,0.2) 100%)`,
          }}
        />

        {/* Volume yüzdesi göstergesi */}
        <div className="text-xs text-white/60 text-center mt-1">
          {Math.round(volume * 100)}%
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: ${isMobile ? "20px" : "16px"};
          height: ${isMobile ? "20px" : "16px"};
          background-color: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }

        .volume-slider::-moz-range-thumb {
          width: ${isMobile ? "20px" : "16px"};
          height: ${isMobile ? "20px" : "16px"};
          background-color: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .volume-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
        }

        .volume-slider::-webkit-slider-track {
          background: transparent;
          border: none;
        }

        .volume-slider::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VolumeControl;
