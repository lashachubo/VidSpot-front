import React, { useState } from "react";
// Assuming lucide-react is available in the environment
import {
  Upload,
  Search,
  CheckCircle,
  XCircle,
  Video,
  TrendingUp,
} from "lucide-react";

// Component 1: Header
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-2xl py-6 px-6 border-b border-purple-500/50">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Video className="text-white" size={32} />
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-wide">
          VidSpot AI
        </h1>
        <div className="hidden sm:block ml-auto text-sm text-purple-200 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-700 font-medium">
          YOLOv8 Detection
        </div>
      </div>
    </header>
  );
};

// Component 2: FileUpload
const FileUpload = ({ video, setVideo }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-500 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300 p-4 shadow-inner shadow-gray-900">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="text-indigo-400 mb-3" size={48} />
          <p className="mb-2 text-base text-white font-semibold">
            {video ? video.name : "Click to upload video"}
          </p>
          <p className="text-sm text-gray-400">
            {video
              ? "File ready. Click again to change."
              : "MP4, AVI, MOV (Max file size for demo environments may vary)"}
          </p>
        </div>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

// Component 3: SearchForm
const SearchForm = ({
  targetClass,
  setTargetClass,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            placeholder="Enter object to search (e.g., person, car, dog)"
            className="w-full px-5 py-3 border-2 border-purple-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors shadow-lg text-white bg-gray-700 placeholder-gray-400"
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !targetClass.trim()}
          // Enhanced button style with gradient and dynamic hover effect
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-purple-900/50 hover:shadow-purple-700/70 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Search size={20} />
          )}
          {isLoading ? "Searching..." : "Search Video"}
        </button>
      </div>
    </form>
  );
};

// Component 4: ResultMessage
const ResultMessage = ({ result }) => {
  if (!result) return null;

  // Determine if it's an error/not found case
  const isError =
    result.first_frame === -1 ||
    result.message?.includes("Error") ||
    result.message?.includes("could not connect") ||
    result.message?.includes("FATAL");

  // Helper function to calculate time in seconds
  const calculateSeconds = (frame, fps) => {
    if (fps > 0) {
      return (frame / fps).toFixed(2); // Keep two decimal places for seconds
    }
    return "N/A";
  };

  const firstDetectionSecond = calculateSeconds(result.first_frame, result.fps);
  const lastDetectionSecond = calculateSeconds(result.last_frame, result.fps);

  return (
    <div
      className={`w-full p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 shadow-inner ${
        isError
          ? "bg-red-900/50 border-2 border-red-500"
          : "bg-green-900/50 border-2 border-green-500"
      }`}
    >
      {isError ? (
        <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
      ) : (
        <CheckCircle
          className="text-green-400 flex-shrink-0 mt-0.5"
          size={24}
        />
      )}
      <div>
        <p
          className={`text-xl font-extrabold ${
            isError ? "text-red-200" : "text-green-200"
          }`}
        >
          {isError
            ? "Search Failed or Object Not Found"
            : "Object Detected Successfully!"}
        </p>
        <p
          className={`text-sm mt-1 ${
            isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {result.message || "Operation completed."}
        </p>

        {/* Updated Detection Details Block */}
        {result.first_frame !== undefined && result.first_frame !== -1 && (
          <div className="mt-4 text-sm text-gray-300 bg-gray-700/70 p-4 rounded-xl border border-gray-600 inline-block">
            <p className="font-bold text-white mb-2 flex items-center gap-1">
              <TrendingUp size={16} className="text-purple-400" />
              Detection Details
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-medium">First detection: </span>
                <span className="text-purple-400 font-bold">
                  {firstDetectionSecond} sec
                </span>
                <span className="text-gray-400">
                  {" "}
                  ({result.first_frame} frame)
                </span>
              </p>
              <p>
                <span className="font-medium">Last detection: </span>
                <span className="text-purple-400 font-bold">
                  {lastDetectionSecond} sec
                </span>
                <span className="text-gray-400">
                  {" "}
                  ({result.last_frame} frame)
                </span>
              </p>
              <p className="pt-2 border-t border-gray-600 mt-2">
                <span className="font-medium">Video FPS: </span>
                <span className="text-gray-300 font-semibold">
                  {result.fps.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component 5: Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-gray-400 text-sm mt-auto shadow-inner shadow-black/50">
      <div className="max-w-4xl mx-auto">
        &copy; {new Date().getFullYear()} VidSpot AI | Powered by FastAPI &
        YOLOv8
      </div>
    </footer>
  );
};

// Main Component
export default function App() {
  const [video, setVideo] = useState(null);
  const [targetClass, setTargetClass] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showCustomMessage = (message, type = "error") => {
    setResult({
      message,
      first_frame: type === "error" ? -1 : undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      showCustomMessage("Please upload a video file first.", "error");
      return;
    }

    // Trim the target class
    const trimmedTargetClass = targetClass.trim();

    if (!trimmedTargetClass) {
      showCustomMessage("Please enter an object to search for.", "error");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("target_class", trimmedTargetClass);

      const apiUrl = "http://127.0.0.1:8000/search";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          message:
            data.detail ||
            data.message ||
            `Server returned an error (Status ${response.status}).`,
          first_frame: -1,
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showCustomMessage(
        "Could not connect to the backend server. Please ensure the backend is running at http://127.0.0.1:8000.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-3xl shadow-2xl shadow-purple-900/50 p-6 sm:p-10 space-y-10 border border-gray-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload size={24} className="text-indigo-400" />
                Upload Video Source
              </h2>
              <FileUpload video={video} setVideo={setVideo} />
            </div>

            <div className="border-t border-gray-700 pt-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Search size={24} className="text-purple-400" />
                Search for Specific Objects
              </h2>
              <SearchForm
                targetClass={targetClass}
                setTargetClass={setTargetClass}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {result && (
              <div className="border-t border-gray-700 pt-10">
                <ResultMessage result={result} />
              </div>
            )}

            <div className="bg-indigo-900/30 border border-indigo-600 rounded-xl p-5 mt-6 shadow-lg">
              <h3 className="font-extrabold text-indigo-200 mb-3 text-lg">
                How VidSpot Works:
              </h3>
              <ul className="text-sm text-indigo-400 space-y-2 list-none p-0">
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-indigo-400"
                  />
                  <span>Upload your video file (MP4, MOV, etc.).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-indigo-400"
                  />
                  <span>
                    Specify the **COCO object name** (e.g., 'dog', 'chair').
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-indigo-400"
                  />
                  <span>
                    The FastAPI backend uses **YOLOv8** to rapidly scan the
                    video frame-by-frame.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-indigo-400"
                  />
                  <span>
                    The system provides precise **start/end times (seconds)** of
                    the object's presence.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
