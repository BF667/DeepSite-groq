import React from "react";
import { FiCode, FiLayers, FiCopy } from "react-icons/fi";
import type { GenerationMode } from "../../types/models";

interface ModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  disabled?: boolean;
}

const modes: { id: GenerationMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: <FiCode />,
    description: "Single HTML file with CSS & JS"
  },
  {
    id: "fullstack",
    label: "Fullstack",
    icon: <FiLayers />,
    description: "Complete app with backend"
  },
  {
    id: "designClone",
    label: "Clone Design",
    icon: <FiCopy />,
    description: "Copy a website's design"
  }
];

function ModeSelector({ mode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-lg">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          disabled={disabled}
          onClick={() => onModeChange(m.id)}
          title={m.description}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === m.id
              ? "bg-pink-500 text-white shadow-sm"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;
