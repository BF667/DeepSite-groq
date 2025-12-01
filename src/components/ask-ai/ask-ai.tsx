/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { RiSparkling2Fill } from "react-icons/ri";
import { GrSend } from "react-icons/gr";
import { toast } from "react-toastify";
import { MdPreview } from "react-icons/md";
import { FiCopy, FiSettings } from "react-icons/fi";

import { defaultHTML } from "./../../../utils/consts";
import SuccessSound from "./../../assets/success.mp3";
import ModelSelector from "../model-selector/model-selector";
import ModeSelector from "../mode-selector/mode-selector";
import DesignCloner from "../design-cloner/design-cloner";
import type { GenerationMode, GeneratedFile, StreamChunk } from "../../types/models";

interface AskAIProps {
  html: string;
  setHtml: (html: string) => void;
  onScrollToBottom: () => void;
  isAiWorking: boolean;
  setView: React.Dispatch<React.SetStateAction<"editor" | "preview">>;
  setisAiWorking: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: (files: GeneratedFile[]) => void;
  onFileSelect: (filename: string) => void;
}

function AskAI({
  html,
  setHtml,
  onScrollToBottom,
  isAiWorking,
  setisAiWorking,
  setView,
  setFiles,
  onFileSelect,
}: AskAIProps) {
  const [prompt, setPrompt] = useState("");
  const [hasAsked, setHasAsked] = useState(false);
  const [previousPrompt, setPreviousPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showCloner, setShowCloner] = useState(false);
  
  // Settings
  const [selectedModel, setSelectedModel] = useState("groq/gpt-oss-120b");
  const [mode, setMode] = useState<GenerationMode>("frontend");
  const [isEnhanceMode, setIsEnhanceMode] = useState(false);

  const audio = new Audio(SuccessSound);
  audio.volume = 0.5;

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    if (newMode === 'designClone') {
      setShowCloner(true);
    }
  };

  const processStreamResponse = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder("utf-8");
    let contentResponse = "";
    let lastRenderTime = 0;

    const read = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) return;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line.slice(6));
          
          if (data.error) {
            throw new Error(data.error);
          }

          if (data.done) {
            // Handle completion
            toast.success("AI responded successfully");
            setPrompt("");
            setPreviousPrompt(prompt);
            setisAiWorking(false);
            setHasAsked(true);
            audio.play();
            setView("preview");

            // Parse files for fullstack mode
            if (data.mode === 'fullstack' && data.fullContent) {
              const parsedFiles = parseMultiFileContent(data.fullContent);
              if (parsedFiles.length > 0) {
                setFiles(parsedFiles);
                // Set the first HTML file as the preview
                const htmlFile = parsedFiles.find(f => f.filename.endsWith('.html'));
                if (htmlFile) {
                  setHtml(htmlFile.content);
                  onFileSelect(htmlFile.filename);
                }
              }
            } else if (data.fullContent) {
              // Extract HTML for frontend/designClone modes
              const finalDoc = data.fullContent.match(/<!DOCTYPE html>[\s\S]*<\/html>/i)?.[0];
              if (finalDoc) {
                setHtml(finalDoc);
              }
            }
            return;
          }

          if (data.content) {
            contentResponse += data.content;
            
            // For frontend mode, show live preview
            if (mode === 'frontend' || mode === 'designClone') {
              const newHtml = contentResponse.match(/<!DOCTYPE html>[\s\S]*/i)?.[0];
              if (newHtml) {
                let partialDoc = newHtml;
                if (!partialDoc.includes("</html>")) {
                  partialDoc += "\n</html>";
                }

                const now = Date.now();
                if (now - lastRenderTime > 300) {
                  setHtml(partialDoc);
                  lastRenderTime = now;
                }

                if (partialDoc.length > 200) {
                  onScrollToBottom();
                }
              }
            }
          }
        } catch (e) {
          // Skip invalid JSON chunks
        }
      }

      return read();
    };

    await read();
  };

  const parseMultiFileContent = (content: string): GeneratedFile[] => {
    const files: GeneratedFile[] = [];
    const codeBlockRegex = /```(\w+):([^\n]+)\n([\s\S]*?)```/g;
    
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      files.push({
        language: match[1],
        filename: match[2].trim(),
        content: match[3].trim()
      });
    }
    
    // If no multi-file format, extract single HTML
    if (files.length === 0) {
      const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
      if (htmlMatch) {
        files.push({
          language: 'html',
          filename: 'index.html',
          content: htmlMatch[0]
        });
      }
    }
    
    return files;
  };

  const callAi = async (designUrl?: string) => {
    if (isAiWorking || (!prompt.trim() && !designUrl)) return;
    setisAiWorking(true);
    setShowCloner(false);

    try {
      const request = await fetch("/api/ask-ai", {
        method: "POST",
        body: JSON.stringify({
          prompt: designUrl ? `Clone this website design: ${designUrl}. ${prompt}`.trim() : prompt,
          ...(html === defaultHTML ? {} : { html }),
          ...(previousPrompt ? { previousPrompt } : {}),
          mode: designUrl ? 'designClone' : mode,
          modelKey: selectedModel,
          designUrl
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!request.ok) {
        const res = await request.json();
        toast.error(res.message || "Request failed");
        setisAiWorking(false);
        return;
      }

      if (request.body) {
        const reader = request.body.getReader();
        await processStreamResponse(reader);
      }
    } catch (error: any) {
      setisAiWorking(false);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDesignClone = (url: string) => {
    callAi(url);
  };

  return (
    <>
      <div
        className={`bg-gradient-to-r from-gray-950 via-gray-900/95 to-gray-950 rounded-xl py-2 lg:py-2.5 pl-3.5 lg:pl-4 pr-2 lg:pr-2.5 absolute lg:sticky bottom-3 left-3 lg:bottom-4 lg:left-4 w-[calc(100%-1.5rem)] lg:w-[calc(100%-2rem)] z-10 group border border-gray-800/50 backdrop-blur-xl shadow-2xl ${
          isAiWorking ? "animate-pulse" : ""
        }`}
      >
        {/* Mobile Preview Button */}
        {defaultHTML !== html && (
          <button
            className="bg-white lg:hidden -translate-y-[calc(100%+8px)] absolute left-0 top-0 shadow-md text-gray-950 text-xs font-medium py-2 px-3 lg:px-4 rounded-lg flex items-center gap-2 border border-gray-100 hover:brightness-150 transition-all duration-100 cursor-pointer"
            onClick={() => setView("preview")}
          >
            <MdPreview className="text-sm" />
            View Preview
          </button>
        )}

        {/* Settings Panel (collapsed by default) */}
        {showSettings && (
          <div className="mb-3 p-3 bg-gray-900/80 rounded-lg border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">AI Settings</span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-white text-xs"
              >
                Hide
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Model</label>
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isAiWorking}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Mode</label>
                <ModeSelector
                  mode={mode}
                  onModeChange={handleModeChange}
                  disabled={isAiWorking}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Enhance</label>
                <button
                  disabled={isAiWorking}
                  onClick={() => setIsEnhanceMode(!isEnhanceMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isEnhanceMode
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {isEnhanceMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            {mode === 'fullstack' && (
              <p className="text-xs text-blue-400/80">
                Fullstack mode generates backend + frontend files. View them in the file manager.
              </p>
            )}
          </div>
        )}

        {/* Main Input Area */}
        <div className="w-full relative flex items-center justify-between gap-2">
          <div className="relative flex-shrink-0">
            <RiSparkling2Fill className="text-lg lg:text-xl text-gray-500 group-focus-within:text-pink-500 flex-shrink-0" />
            {isEnhanceMode && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <input
            type="text"
            disabled={isAiWorking}
            className="w-full bg-transparent max-lg:text-sm outline-none px-2 text-white placeholder:text-gray-500 font-code"
            placeholder={
              hasAsked 
                ? isEnhanceMode 
                  ? "What do you want to enhance?"
                  : "What do you want to ask AI next?" 
                : mode === 'fullstack' 
                  ? "Describe your fullstack app..." 
                  : isEnhanceMode
                    ? "Describe what to enhance..."
                    : "Ask AI anything..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                callAi();
              }
            }}
          />

          <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
            {/* Clone Design Button */}
            <button
              disabled={isAiWorking}
              onClick={() => setShowCloner(true)}
              title="Clone a website design"
              className="p-2 text-gray-400 hover:text-pink-400 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCopy size={16} />
            </button>

            {/* Settings Toggle */}
            <button
              disabled={isAiWorking}
              onClick={() => setShowSettings(!showSettings)}
              title="AI Settings"
              className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                showSettings 
                  ? 'text-pink-400 bg-gray-800' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FiSettings size={16} />
            </button>

            {/* Send Button */}
            <button
              disabled={isAiWorking || !prompt.trim()}
              className="relative overflow-hidden cursor-pointer flex-none flex items-center justify-center rounded-full text-sm font-semibold size-8 text-center bg-pink-500 hover:bg-pink-400 text-white shadow-sm dark:shadow-highlight/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              onClick={() => callAi()}
            >
              <GrSend className="-translate-x-[1px]" />
            </button>
          </div>
        </div>

        {/* Quick Mode Indicator */}
        {!showSettings && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>Mode: {mode}</span>
            {isEnhanceMode && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                  Enhance
                </span>
              </>
            )}
            <span>•</span>
            <span className="truncate max-w-[150px]">
              Model: {selectedModel.split('/')[1]}
            </span>
          </div>
        )}
      </div>

      {/* Design Cloner Modal */}
      <DesignCloner
        isOpen={showCloner}
        onClose={() => setShowCloner(false)}
        onClone={handleDesignClone}
        isLoading={isAiWorking}
      />
    </>
  );
}

export default AskAI;