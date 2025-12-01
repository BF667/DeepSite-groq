import { useState } from "react";
import { 
  FiFile, 
  FiFolder, 
  FiDownload, 
  FiX,
  FiCode,
  FiFileText,
  FiPackage,
  FiChevronRight,
  FiChevronDown
} from "react-icons/fi";
import { toast } from "react-toastify";
import type { GeneratedFile } from "../../types/models";

interface FileManagerProps {
  files: GeneratedFile[];
  activeFile: string;
  onFileSelect: (filename: string) => void;
  onClose: () => void;
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

function FileManager({ files, activeFile, onFileSelect, onClose }: FileManagerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const downloadFile = (file: GeneratedFile) => {
    try {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${file.filename}`);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const downloadAllAsZip = async () => {
    try {
      // Create a simple text-based "package" since we can't use JSZip
      let combinedContent = "=== FULLSTACK PROJECT FILES ===\n\n";
      
      for (const file of files) {
        combinedContent += `=== ${file.filename} ===\n`;
        combinedContent += file.content;
        combinedContent += "\n\n";
      }

      const blob = new Blob([combinedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-files.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloaded all files");
    } catch (error) {
      toast.error("Failed to download files");
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900/50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
          <FiFolder className="text-blue-400" />
          <span>Project Files</span>
          <span className="text-xs text-gray-500 ml-1">({files.length})</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={downloadAllAsZip}
            title="Download all files"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <FiDownload size={14} />
          </button>
          <button
            onClick={onClose}
            title="Close file manager"
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* File List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-1">
          {files.map((file) => (
            <div
              key={file.filename}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                activeFile === file.filename
                  ? "bg-gray-800 border-l-2 border-pink-500"
                  : "hover:bg-gray-800/50 border-l-2 border-transparent"
              }`}
              onClick={() => onFileSelect(file.filename)}
            >
              <div className="flex items-center gap-2 min-w-0">
                {getFileIcon(file.filename, file.language)}
                <span className="text-sm text-gray-300 truncate">
                  {file.filename}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(file);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all"
                title={`Download ${file.filename}`}
              >
                <FiDownload size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {files.reduce((acc, f) => acc + f.content.length, 0).toLocaleString()} chars
            </span>
            <span>
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileManager;
