import React, { useState, useEffect } from "react";
import { FiChevronDown, FiCheck, FiZap, FiCpu, FiCloud } from "react-icons/fi";
import type { AIModel } from "../../types/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelKey: string) => void;
  disabled?: boolean;
}

const providerIcons: Record<string, React.ReactNode> = {
  groq: <FiZap className="text-orange-400" />,
  openai: <FiCpu className="text-green-400" />,
  deepseek: <FiCloud className="text-blue-400" />,
  kimi: <FiCloud className="text-purple-400" />
};

const providerColors: Record<string, string> = {
  groq: "text-orange-400",
  openai: "text-green-400",
  deepseek: "text-blue-400",
  kimi: "text-purple-400"
};

function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models");
      const data = await response.json();
      if (data.ok) {
        setModels(data.models);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedModelInfo = models.find(m => m.key === selectedModel);
  
  // Group models by provider
  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          <>
            {selectedModelInfo && providerIcons[selectedModelInfo.provider]}
            <span className="max-w-[120px] truncate">
              {selectedModelInfo?.name || "Select Model"}
            </span>
            <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && !loading && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-72 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <div key={provider}>
                <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${providerColors[provider]} bg-gray-800/50 sticky top-0`}>
                  <div className="flex items-center gap-2">
                    {providerIcons[provider]}
                    {providerModels[0]?.providerName}
                  </div>
                </div>
                {providerModels.map((model) => (
                  <button
                    key={model.key}
                    disabled={!model.available}
                    onClick={() => {
                      if (model.available) {
                        onModelChange(model.key);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-800 transition-colors ${
                      !model.available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    } ${selectedModel === model.key ? 'bg-gray-800' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white truncate">{model.name}</span>
                        {model.category && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                            {model.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {model.description}
                      </p>
                    </div>
                    {selectedModel === model.key && (
                      <FiCheck className="text-green-400 flex-shrink-0 ml-2" />
                    )}
                    {!model.available && (
                      <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                        No API Key
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ModelSelector;
