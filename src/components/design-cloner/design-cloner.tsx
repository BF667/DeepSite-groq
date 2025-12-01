import { useState } from "react";
import { FiLink, FiX, FiExternalLink, FiCheck, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

interface DesignClonerProps {
  isOpen: boolean;
  onClose: () => void;
  onClone: (url: string) => void;
  isLoading: boolean;
}

const exampleSites = [
  { name: "Stripe", url: "https://stripe.com" },
  { name: "Linear", url: "https://linear.app" },
  { name: "Vercel", url: "https://vercel.com" },
  { name: "Notion", url: "https://notion.so" },
  { name: "Figma", url: "https://figma.com" },
];

function DesignCloner({ isOpen, onClose, onClone, isLoading }: DesignClonerProps) {
  const [url, setUrl] = useState("");
  const [validating, setValidating] = useState(false);

  if (!isOpen) return null;

  const validateUrl = (inputUrl: string): boolean => {
    try {
      const parsed = new URL(inputUrl);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    // Add https:// if missing
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    if (!validateUrl(finalUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setValidating(true);
    
    try {
      // Validate the URL is accessible
      const response = await fetch("/api/fetch-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl })
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.message || "Failed to access website");
      }

      onClone(finalUrl);
    } catch (error: any) {
      toast.error(error.message || "Could not access the website. Please check the URL.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <FiCopy className="text-pink-500" />
            <h3 className="font-medium text-white">Clone Website Design</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading || validating}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-400">
            Enter a website URL to clone its design. The AI will analyze the layout, 
            colors, and styling to recreate a similar design.
          </p>

          {/* URL Input */}
          <div className="relative">
            <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading || validating}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 disabled:opacity-50"
            />
          </div>

          {/* Example Sites */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Popular examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleSites.map((site) => (
                <button
                  key={site.url}
                  onClick={() => setUrl(site.url)}
                  disabled={isLoading || validating}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-300 transition-colors disabled:opacity-50"
                >
                  {site.name}
                  <FiExternalLink size={10} />
                </button>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-200/80">
              Note: This tool creates an inspired recreation, not an exact copy. 
              Complex sites with dynamic content may require additional adjustments.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-800 bg-gray-800/50">
          <button
            onClick={onClose}
            disabled={isLoading || validating}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || validating || !url.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {validating || isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                {validating ? "Checking..." : "Cloning..."}
              </>
            ) : (
              <>
                <FiCheck />
                Clone Design
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesignCloner;

// FiCopy icon for import
function FiCopy(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="1em" 
      height="1em" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}
