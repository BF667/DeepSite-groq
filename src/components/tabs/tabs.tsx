import { FiCode, FiFileText, FiPackage, FiFile, FiZap } from "react-icons/fi";
import type { GeneratedFile } from "../../types/models";

interface TabsProps {
  activeFile?: string;
  files?: GeneratedFile[];
  onFileSelect?: (filename: string) => void;
  children?: React.ReactNode;
}

const getFileIcon = (filename: string, language: string) => {
  if (filename === 'package.json') return <FiPackage className="text-green-400" />;
  
  switch (language) {
    case 'html':
      return <FiCode className="text-orange-400" />;
    case 'css':
      return <FiFileText className="text-blue-400" />;
    case 'javascript':
    case 'js':
      return <FiCode className="text-yellow-400" />;
    case 'typescript':
    case 'ts':
      return <FiCode className="text-blue-500" />;
    case 'json':
      return <FiPackage className="text-yellow-500" />;
    default:
      return <FiFile className="text-gray-400" />;
  }
};

function Tabs({ activeFile = "index.html", files = [], onFileSelect, children }: TabsProps) {
  return (
    <div className="border-b border-gray-800 pl-4 lg:pl-5 pr-3 flex items-center justify-between h-[42px]">
      {/* File Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {files.length === 0 ? (
          // Default tab when no files
          <div className="flex items-center gap-2 px-2 py-1.5 relative">
            <FiCode className="text-orange-400 text-sm" />
            <span className="text-sm text-white font-medium">index.html</span>
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-pink-500" />
          </div>
        ) : (
          // Multiple file tabs
          files.map((file) => (
            <button
              key={file.filename}
              onClick={() => onFileSelect?.(file.filename)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-t transition-colors whitespace-nowrap relative ${
                activeFile === file.filename
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {getFileIcon(file.filename, file.language)}
              <span className="text-sm font-medium">{file.filename}</span>
              {activeFile === file.filename && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-pink-500" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Powered By */}
      <div className="flex items-center justify-end gap-3 flex-shrink-0">
        <a
          href="https://groq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1.5 font-code transition-colors"
        >
          Powered by <FiZap className="text-orange-400" /> <span className="text-orange-400 font-semibold">Groq</span>
        </a>
        {children}
      </div>
    </div>
  );
}

export default Tabs;
