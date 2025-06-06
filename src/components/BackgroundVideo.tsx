import { useEffect, useRef } from "react";
import { Video, VideoOff } from "lucide-react";

type VideoMode = "rain" | "waves" | "fireplace";

interface BackgroundVideoProps {
  mode: VideoMode;
  isEnabled: boolean;
  onToggle: () => void;
}

const videoUrls = {
  rain: "/videos/rain.mp4",
  waves: "/videos/waves.mp4",
  fireplace: "/videos/fireplace.mp4",
};

export default function BackgroundVideo({
  mode,
  isEnabled,
  onToggle,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && isEnabled) {
      videoRef.current.play().catch((error) => {
        console.error("Video oynatma hatası:", error);
      });
    }
  }, [mode, isEnabled]);

  return (
    <>
      {isEnabled && (
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <video
            ref={videoRef}
            src={videoUrls[mode]}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white border border-white/20 shadow-lg hover:scale-110 group"
        title={
          isEnabled ? "Arka plan videosunu kapat" : "Arka plan videosunu aç"
        }>
        {isEnabled ? (
          <VideoOff className="w-6 h-6 group-hover:text-red-400 transition-colors" />
        ) : (
          <Video className="w-6 h-6 group-hover:text-green-400 transition-colors" />
        )}
      </button>
    </>
  );
}
