import React from "react";
import { MdRefresh } from "react-icons/md";
import { FaDownload, FaFolderOpen, FaRocket } from "react-icons/fa6";
import { FiGithub, FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

interface HeaderProps {
  onReset: () => void;
  onDownload: () => void;
  children?: React.ReactNode;
  filesCount?: number;
  onToggleFileManager?: () => void;
  showFileManager?: boolean;
  onDeploy?: () => void;
  onPushToHF?: () => void;
}

function Header({
  onReset,
  onDownload,
  children,
  filesCount = 0,
  onToggleFileManager,
  showFileManager,
  onDeploy,
  onPushToHF,
}: HeaderProps) {
  const handleDeploy = () => {
    onDeploy?.();
    toast.info("🚀 Auto-deploy feature coming soon!");
  };

  const handlePushToHF = () => {
    onPushToHF?.();
    toast.info("📤 Push to Hugging Face feature coming soon!");
  };

  return (
    <header className="flex h-[50px] lg:h-[54px] items-center justify-between px-3 lg:px-4 border-b border-gray-800 select-none bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="relative">
          <img
            src="/logo.svg"
            alt="logo"
            className="size-6 lg:size-7 filter invert"
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-white font-bold text-sm lg:text-base bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DeepSite Pro
          </h1>
          <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg">
            V3.0 Enhanced
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 lg:gap-3">
        {children}

        {/* File Manager Toggle (only show when files exist) */}
        {filesCount > 0 && onToggleFileManager && (
          <button
            title={showFileManager ? "Hide File Manager" : "Show File Manager"}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 ${
              showFileManager
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm"
            }`}
            onClick={onToggleFileManager}
          >
            <FaFolderOpen className="text-sm" />
            <span className="text-xs font-medium hidden sm:inline">
              {filesCount} files
            </span>
          </button>
        )}

        {/* Push to Hugging Face Button */}
        <button
          title="Push to Hugging Face Spaces"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-orange-400 cursor-pointer transition-all duration-200 hover:bg-orange-400/10 rounded-lg p-1.5"
          onClick={handlePushToHF}
        >
          <FiUpload className="text-base lg:text-lg" />
        </button>

        {/* Auto Deploy Button */}
        <button
          title="Auto Deploy"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-green-400 cursor-pointer transition-all duration-200 hover:bg-green-400/10 rounded-lg p-1.5"
          onClick={handleDeploy}
        >
          <FaRocket className="text-base lg:text-lg" />
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/BF667/DeepSite-groq"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-all duration-200 hover:bg-gray-800/50 rounded-lg p-1.5"
        >
          <FiGithub className="text-base lg:text-lg" />
        </a>

        {/* Download Button */}
        <button
          title="Download Files"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-blue-400 cursor-pointer transition-all duration-200 hover:bg-blue-400/10 rounded-lg p-1.5"
          onClick={onDownload}
        >
          <FaDownload className="text-base lg:text-lg" />
        </button>

        {/* Reset Button */}
        <button
          title="Reset Editor"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-red-400 cursor-pointer transition-all duration-200 hover:bg-red-400/10 rounded-lg p-1.5"
          onClick={onReset}
        >
          <MdRefresh className="text-lg lg:text-xl" />
        </button>
      </div>
    </header>
  );
}

export default Header;