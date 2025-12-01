import { useState } from "react";
import { FaRocket, FaGithub, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  files: any[];
  projectName?: string;
}

function DeploymentModal({
  isOpen,
  onClose,
  html,
  files,
  projectName = "DeepSite Project"
}: DeploymentModalProps) {
  const [deploymentMethod, setDeploymentMethod] = useState<"hf" | "vercel" | "netlify">("hf");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>("");

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus("Preparing deployment...");

    try {
      if (deploymentMethod === "hf") {
        const response = await fetch("/api/push-to-hf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html,
            files,
            projectName,
            description: `DeepSite V3.0 project - ${projectName}`
          }),
        });

        const result = await response.json();
        
        if (result.ok) {
          setDeploymentStatus("Deployment prepared successfully!");
          toast.success("🚀 Project ready for Hugging Face Spaces!");
          
          // Show instructions for manual deployment
          setTimeout(() => {
            alert(`Your project is ready! Please:

1. Go to https://huggingface.co/spaces
2. Create a new Space with Docker SDK
3. Copy your project files to the space
4. Add your API keys as secrets
5. The space will automatically build and deploy!`);
          }, 1000);
        } else {
          throw new Error(result.message);
        }
      } else {
        // For Vercel/Netlify, show placeholder
        toast.info(`🚀 ${deploymentMethod} deployment coming in V3.1!`);
        setDeploymentStatus(`${deploymentMethod} deployment feature coming soon!`);
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Deployment failed. Please try again.");
      setDeploymentStatus("Deployment failed");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleAutoDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus("Auto-deploying...");

    try {
      const response = await fetch("/api/auto-deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          files,
          projectName
        }),
      });

      const result = await response.json();
      
      if (result.ok) {
        setDeploymentStatus("Auto-deployed successfully!");
        toast.success("🚀 Project auto-deployed successfully!");
        
        setTimeout(() => {
          alert(`🎉 Auto-deployment complete!

Your project has been saved and is ready for hosting.
Deployment ID: ${result.saveId}
Status: ${result.status}`);

          onClose();
        }, 1500);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Auto-deploy error:", error);
      toast.error("Auto-deployment failed. Please try again.");
      setDeploymentStatus("Auto-deployment failed");
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaRocket className="text-pink-500" />
              Deploy Project
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isDeploying}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={() => {}}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="My Awesome Project"
                disabled={isDeploying}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deployment Method
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setDeploymentMethod("hf")}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    deploymentMethod === "hf"
                      ? "border-pink-500 bg-pink-500/10 text-pink-400"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  disabled={isDeploying}
                >
                  <FaGithub className="text-lg" />
                  <div className="text-left">
                    <div className="font-medium">Hugging Face Spaces</div>
                    <div className="text-xs opacity-75">Free hosting with Docker</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setDeploymentMethod("vercel")}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    deploymentMethod === "vercel"
                      ? "border-pink-500 bg-pink-500/10 text-pink-400"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  disabled={isDeploying}
                >
                  <FaRocket className="text-lg" />
                  <div className="text-left">
                    <div className="font-medium">Vercel</div>
                    <div className="text-xs opacity-75">One-click deployment</div>
                  </div>
                  <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Soon
                  </span>
                </button>
                
                <button
                  onClick={() => setDeploymentMethod("netlify")}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    deploymentMethod === "netlify"
                      ? "border-pink-500 bg-pink-500/10 text-pink-400"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  disabled={isDeploying}
                >
                  <FaRocket className="text-lg" />
                  <div className="text-left">
                    <div className="font-medium">Netlify</div>
                    <div className="text-xs opacity-75">Static site hosting</div>
                  </div>
                  <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Soon
                  </span>
                </button>
              </div>
            </div>

            {deploymentStatus && (
              <div className="flex items-center gap-2 text-sm">
                {isDeploying ? (
                  <FaSpinner className="animate-spin text-pink-500" />
                ) : (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                <span className="text-gray-300">{deploymentStatus}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAutoDeploy}
                disabled={isDeploying}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? "Deploying..." : "Auto Deploy"}
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? "Preparing..." : "Deploy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeploymentModal;