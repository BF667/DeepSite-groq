import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import classNames from "classnames";
import { editor } from "monaco-editor";
import {
  useMount,
  useUnmount,
  useEvent,
  useLocalStorage,
} from "react-use";
import { toast } from "react-toastify";

import Header from "./header/header";
import { defaultHTML } from "./../../utils/consts";
import Tabs from "./tabs/tabs";
import AskAI from "./ask-ai/ask-ai";
import Preview from "./preview/preview";
import FileManager from "./file-manager/file-manager";
import type { GeneratedFile } from "../types/models";

function App() {
  const [htmlStorage, , removeHtmlStorage] = useLocalStorage("html_content");

  const preview = useRef<HTMLDivElement>(null);
  const editorContainer = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [html, setHtml] = useState((htmlStorage as string) ?? defaultHTML);
  const [isAiWorking, setisAiWorking] = useState(false);
  const [currentView, setCurrentView] = useState<"editor" | "preview">("editor");
  
  // Fullstack mode state
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>("index.html");
  const [showFileManager, setShowFileManager] = useState(false);

  // Get current file content for editor
  const getCurrentFileContent = () => {
    if (files.length === 0) return html;
    const file = files.find(f => f.filename === activeFile);
    return file?.content || html;
  };

  // Get current file language for editor
  const getCurrentFileLanguage = () => {
    if (files.length === 0) return "html";
    const file = files.find(f => f.filename === activeFile);
    if (!file) return "html";
    
    switch (file.language) {
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'typescript':
      case 'ts':
        return 'typescript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'html';
    }
  };

  // Handle file selection
  const handleFileSelect = (filename: string) => {
    setActiveFile(filename);
    // If it's an HTML file, also update preview
    const file = files.find(f => f.filename === filename);
    if (file && filename.endsWith('.html')) {
      setHtml(file.content);
    }
  };

  // Handle editor content change
  const handleEditorChange = (value: string | undefined) => {
    const newValue = value ?? "";
    
    if (files.length > 0) {
      // Update the file in the files array
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.filename === activeFile 
            ? { ...f, content: newValue }
            : f
        )
      );
      
      // If it's an HTML file, also update preview
      if (activeFile.endsWith('.html')) {
        setHtml(newValue);
      }
    } else {
      setHtml(newValue);
    }
  };

  /**
   * Resets the layout based on screen size
   */
  const resetLayout = () => {
    if (!editorContainer.current || !preview.current) return;

    if (window.innerWidth >= 1024) {
      const resizerWidth = resizer.current?.offsetWidth ?? 8;
      const fileManagerWidth = showFileManager ? 200 : 0;
      const availableWidth = window.innerWidth - resizerWidth - fileManagerWidth;
      const initialEditorWidth = availableWidth / 3;
      const initialPreviewWidth = availableWidth - initialEditorWidth;
      editorContainer.current.style.width = `${initialEditorWidth}px`;
      preview.current.style.width = `${initialPreviewWidth}px`;
    } else {
      editorContainer.current.style.width = "";
      preview.current.style.width = "";
    }
  };

  /**
   * Handles resizing when the user drags the resizer
   */
  const handleResize = (e: MouseEvent) => {
    if (!editorContainer.current || !preview.current || !resizer.current) return;

    const resizerWidth = resizer.current.offsetWidth;
    const fileManagerWidth = showFileManager ? 200 : 0;
    const minWidth = 100;
    const maxWidth = window.innerWidth - resizerWidth - minWidth - fileManagerWidth;

    const editorWidth = e.clientX - fileManagerWidth;
    const clampedEditorWidth = Math.max(minWidth, Math.min(editorWidth, maxWidth));
    const calculatedPreviewWidth = window.innerWidth - clampedEditorWidth - resizerWidth - fileManagerWidth;

    editorContainer.current.style.width = `${clampedEditorWidth}px`;
    preview.current.style.width = `${calculatedPreviewWidth}px`;
  };

  const handleMouseDown = () => {
    setIsResizing(true);
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleDownloadHtml = () => {
    if (html === defaultHTML && files.length === 0) {
      toast.info("Nothing to download yet.");
      return;
    }

    try {
      // If we have multiple files, download all
      if (files.length > 0) {
        let combinedContent = "=== PROJECT FILES ===\n\n";
        for (const file of files) {
          combinedContent += `=== ${file.filename} ===\n`;
          combinedContent += file.content;
          combinedContent += "\n\n";
        }
        
        const blob = new Blob([combinedContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "project-files.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Project files download started.");
      } else {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "index.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("HTML file download started.");
      }
    } catch (error) {
      console.error("Error downloading:", error);
      toast.error("Failed to download files.");
    }
  };

  // Show file manager when files are generated
  const handleFilesChange = (newFiles: GeneratedFile[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setShowFileManager(true);
    }
  };

  // Prevent accidental navigation
  useEvent("beforeunload", (e) => {
    if (isAiWorking || html !== defaultHTML) {
      e.preventDefault();
      return "";
    }
  });

  // Initialize
  useMount(() => {
    if (htmlStorage) {
      removeHtmlStorage();
      toast.warn("Previous HTML content restored from local storage.");
    }
    resetLayout();
    if (!resizer.current) return;
    resizer.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", resetLayout);
  });

  // Cleanup
  useUnmount(() => {
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleMouseUp);
    if (resizer.current) {
      resizer.current.removeEventListener("mousedown", handleMouseDown);
    }
    window.removeEventListener("resize", resetLayout);
  });

  return (
    <div className="h-screen bg-gray-950 font-sans overflow-hidden">
      <Header
        onReset={() => {
          if (isAiWorking) {
            toast.warn("Please wait for the AI to finish working.");
            return;
          }
          if (window.confirm("You're about to reset the editor. Are you sure?")) {
            setHtml(defaultHTML);
            setFiles([]);
            setActiveFile("index.html");
            setShowFileManager(false);
            removeHtmlStorage();
            editorRef.current?.revealLine(
              editorRef.current?.getModel()?.getLineCount() ?? 0
            );
          }
        }}
        onDownload={handleDownloadHtml}
        filesCount={files.length}
        onToggleFileManager={() => setShowFileManager(!showFileManager)}
        showFileManager={showFileManager}
      />
      
      <main className="max-lg:flex-col flex w-full">
        {/* File Manager (for fullstack mode) */}
        {showFileManager && files.length > 0 && (
          <div className="w-[200px] max-lg:hidden">
            <FileManager
              files={files}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              onClose={() => setShowFileManager(false)}
            />
          </div>
        )}

        {/* Editor */}
        <div
          ref={editorContainer}
          className={classNames(
            "w-full h-[calc(100dvh-49px)] lg:h-[calc(100dvh-54px)] relative overflow-hidden max-lg:transition-all max-lg:duration-200 select-none",
            {
              "max-lg:h-0": currentView === "preview",
            }
          )}
        >
          <Tabs 
            activeFile={activeFile}
            files={files}
            onFileSelect={handleFileSelect}
          />
          <div
            onClick={(e) => {
              if (isAiWorking) {
                e.preventDefault();
                e.stopPropagation();
                toast.warn("Please wait for the AI to finish working.");
              }
            }}
          >
            <Editor
              language={getCurrentFileLanguage()}
              theme="vs-dark"
              className={classNames(
                "h-[calc(100dvh-90px)] lg:h-[calc(100dvh-96px)]",
                {
                  "pointer-events-none": isAiWorking,
                }
              )}
              value={getCurrentFileContent()}
              onValidate={(markers) => {
                if (markers?.length > 0) {
                  // Handle validation errors
                }
              }}
              onChange={handleEditorChange}
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <AskAI
            html={html}
            setHtml={setHtml}
            isAiWorking={isAiWorking}
            setisAiWorking={setisAiWorking}
            setView={setCurrentView}
            setFiles={handleFilesChange}
            onFileSelect={handleFileSelect}
            onScrollToBottom={() => {
              editorRef.current?.revealLine(
                editorRef.current?.getModel()?.getLineCount() ?? 0
              );
            }}
          />
        </div>

        {/* Resizer */}
        <div
          ref={resizer}
          className="bg-gray-700 hover:bg-blue-500 w-2 cursor-col-resize h-[calc(100dvh-53px)] max-lg:hidden"
        />

        {/* Preview */}
        <Preview
          html={html}
          isResizing={isResizing}
          isAiWorking={isAiWorking}
          ref={preview}
          setView={setCurrentView}
        />
      </main>
    </div>
  );
}

export default App;
