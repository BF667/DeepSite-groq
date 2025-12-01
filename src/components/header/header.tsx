import React from "react";
import { MdRefresh } from "react-icons/md";
import { FaDownload, FaFolderOpen } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";

interface HeaderProps {
  onReset: () => void;
  onDownload: () => void;
  children?: React.ReactNode;
  filesCount?: number;
  onToggleFileManager?: () => void;
  showFileManager?: boolean;
}

function Header({
  onReset,
  onDownload,
  children,
  filesCount = 0,
  onToggleFileManager,
  showFileManager,
}: HeaderProps) {
  return (
    <header className="flex h-[50px] lg:h-[54px] items-center justify-between px-3 lg:px-4 border-b border-gray-800 select-none">
      <div className="flex items-center gap-2 lg:gap-3">
        <img
          src="/logo.svg"
          alt="logo"
          className="size-6 lg:size-7 filter invert"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-white font-medium text-sm lg:text-base">
            DeepSite Pro
          </h1>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded font-medium">
            Fullstack
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 lg:gap-3">
        {children}

        {/* File Manager Toggle (only show when files exist) */}
        {filesCount > 0 && onToggleFileManager && (
          <button
            title={showFileManager ? "Hide File Manager" : "Show File Manager"}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              showFileManager
                ? "bg-gray-800 text-pink-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            onClick={onToggleFileManager}
          >
            <FaFolderOpen className="text-sm" />
            <span className="text-xs font-medium hidden sm:inline">
              {filesCount} files
            </span>
          </button>
        )}

        {/* GitHub Link */}
        <a
          href="https://github.com/BF667/DeepSite-groq"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors duration-100"
        >
          <FiGithub className="text-base lg:text-lg" />
        </a>

        {/* Download Button */}
        <button
          title="Download Files"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors duration-100"
          onClick={onDownload}
        >
          <FaDownload className="text-base lg:text-lg" />
        </button>

        {/* Reset Button */}
        <button
          title="Reset Editor"
          className="flex-none flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-100"
          onClick={onReset}
        >
          <MdRefresh className="text-lg lg:text-xl" />
        </button>
      </div>
    </header>
  );
}

export default Header;
