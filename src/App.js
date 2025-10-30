import React, { useState } from "react";
// Assuming lucide-react is available in the environment
import { Upload, Search, CheckCircle, XCircle, Video } from "lucide-react";

// Component 1: Header
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Video className="text-white" size={32} />
        <h1 className="text-3xl font-extrabold text-white font-sans">
          VidSpot
        </h1>
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
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-400 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 p-4">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="text-indigo-600 mb-3" size={48} />
          <p className="mb-2 text-base text-gray-800 font-semibold">
            {video ? video.name : "Click to upload video"}
          </p>
          <p className="text-sm text-gray-500">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            placeholder="Enter object to search (e.g., person, car, dog)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors shadow-sm text-gray-800 bg-white"
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !targetClass.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
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
          {isLoading ? "Searching..." : "Search"}
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
    result.message?.includes("could not connect");

  return (
    <div
      className={`w-full p-5 rounded-xl flex items-start gap-4 transition-all duration-300 ${
        isError
          ? "bg-red-50 border-2 border-red-300"
          : "bg-green-50 border-2 border-green-300"
      }`}
    >
      {isError ? (
        <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
      ) : (
        <CheckCircle
          className="text-green-600 flex-shrink-0 mt-0.5"
          size={24}
        />
      )}
      <div>
        <p
          className={`text-lg font-bold ${
            isError ? "text-red-800" : "text-green-800"
          }`}
        >
          {isError
            ? "Search Failed or Object Not Found"
            : "Object Detected Successfully!"}
        </p>
        <p
          className={`text-sm mt-1 ${
            isError ? "text-red-700" : "text-green-700"
          }`}
        >
          {result.message || "Operation completed."}
        </p>
        {result.first_frame !== undefined && result.first_frame !== -1 && (
          <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 inline-block">
            <p className="font-semibold text-gray-800">Detection Frames:</p>
            <div className="flex gap-4 mt-1">
              <span className="font-medium">First frame: </span>
              <span className="text-indigo-600 font-bold">
                {result.first_frame}
              </span>
            </div>
            <div className="flex gap-4 mt-1">
              <span className="font-medium">Last frame: </span>
              <span className="text-indigo-600 font-bold">
                {result.last_frame}
              </span>
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
    <footer className="bg-gray-200 border-t border-gray-300 py-4 text-center text-gray-600 text-sm mt-auto shadow-inner">
      <div className="max-w-4xl mx-auto">
        &copy; {new Date().getFullYear()} VidSpot | Powered by FastAPI & YOLOv8
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

  // Custom function to handle displaying non-detection or network error messages
  const showCustomMessage = (message, type = "error") => {
    setResult({
      message,
      // Use -1 for error/not found cases to trigger the 'isError' state in ResultMessage
      first_frame: type === "error" ? -1 : undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      showCustomMessage("Please upload a video file first.", "error");
      return;
    }

    if (!targetClass.trim()) {
      showCustomMessage("Please enter an object to search for.", "error");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("target_class", targetClass);

      // The API URL matching the backend running on port 8000
      const apiUrl = "http://127.0.0.1:8000/search";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        setResult({
          message:
            data.detail ||
            data.message ||
            `Server returned an error (Status ${response.status}).`,
          first_frame: -1,
        });
      } else {
        // Handle successful response (200 OK)
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
    // Added font-sans to the main div
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-8">
            {/* Upload Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Upload size={24} className="text-indigo-600" />
                Upload Video
              </h2>
              <FileUpload video={video} setVideo={setVideo} />
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={24} className="text-purple-600" />
                Search for Objects
              </h2>
              <SearchForm
                targetClass={targetClass}
                setTargetClass={setTargetClass}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {result && (
              <div className="border-t border-gray-200 pt-8">
                <ResultMessage result={result} />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
              <h3 className="font-bold text-blue-900 mb-3 text-lg">
                How VidSpot Works:
              </h3>
              <ul className="text-sm text-blue-800 space-y-2 list-none p-0">
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-blue-500"
                  />
                  <span>Upload your video file (MP4, MOV, etc.).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-blue-500"
                  />
                  <span>Specify the object name (e.g., 'dog', 'chair').</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-blue-500"
                  />
                  <span>
                    The FastAPI backend, using YOLOv8, scans the video
                    frame-by-frame.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-blue-500"
                  />
                  <span>
                    The React frontend displays the first and last frame numbers
                    where the object was detected.
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
