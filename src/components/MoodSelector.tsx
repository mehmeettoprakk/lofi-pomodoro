"use client";

interface Mood {
  name: string;
  url: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  onMoodChange: (url: string) => void;
  activeUrl: string;
  isVideoEnabled: boolean;
  onVideoToggle: () => void;
}

const MoodSelector = ({
  moods,
  onMoodChange,
  activeUrl,
  isVideoEnabled,
  onVideoToggle,
}: MoodSelectorProps) => {
  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <h2 className="text-lg font-semibold mb-4 text-white/80">
        Choose your mood
      </h2>
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => {
              onMoodChange(mood.url);
              if (!isVideoEnabled) {
                onVideoToggle();
              }
            }}
            className={`px-4 py-2 sm:px-5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md ${
              activeUrl === mood.url
                ? "bg-white text-gray-900 scale-105"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            {mood.name}
          </button>
        ))}
      </div>
      {/* <p className="text-xs text-gray-500 mt-4 text-center">
        Note: Some sounds are placeholders.
      </p> */}
    </div>
  );
};

export default MoodSelector;
