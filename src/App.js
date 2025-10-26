import React, { useState } from "react";
import { Upload, Search, CheckCircle, XCircle, Video } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Video className="text-white" size={32} />
        <h1 className="text-3xl font-bold text-white">VidSpot</h1>
      </div>
    </header>
  );
};

const FileUpload = ({ video, setVideo }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="text-indigo-500 mb-3" size={48} />
          <p className="mb-2 text-sm text-gray-700 font-semibold">
            {video ? video.name : "Click to upload video"}
          </p>
          <p className="text-xs text-gray-500">
            {video
              ? "Click to change file"
              : "MP4, AVI, MOV, or any video format"}
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

const SearchForm = ({
  targetClass,
  setTargetClass,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            placeholder="Enter object to search (e.g., person, car, dog)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Search size={20} />
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
};

const ResultMessage = ({ result }) => {
  if (!result) return null;

  const isError =
    result.message?.includes("No") || result.startsWith?.("Error");

  return (
    <div
      className={`w-full p-4 rounded-lg flex items-start gap-3 ${
        isError
          ? "bg-red-50 border-2 border-red-200"
          : "bg-green-50 border-2 border-green-200"
      }`}
    >
      {isError ? (
        <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
      ) : (
        <CheckCircle
          className="text-green-500 flex-shrink-0 mt-0.5"
          size={24}
        />
      )}
      <div>
        <p
          className={`font-semibold ${
            isError ? "text-red-800" : "text-green-800"
          }`}
        >
          {isError ? "Not Found" : "Object Detected!"}
        </p>
        <p
          className={`text-sm mt-1 ${
            isError ? "text-red-700" : "text-green-700"
          }`}
        >
          {result.message || result}
        </p>
        {result.first_frame !== undefined && (
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-medium">First frame:</span>{" "}
            {result.first_frame} |
            <span className="font-medium ml-2">Last frame:</span>{" "}
            {result.last_frame}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 text-center text-gray-600 text-sm mt-auto">
      © {new Date().getFullYear()} VidSpot - Powered by YOLOv8
    </footer>
  );
};

export default function App() {
  const [video, setVideo] = useState(null);
  const [targetClass, setTargetClass] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setResult({ message: "Please upload a video file first." });
      return;
    }

    if (!targetClass.trim()) {
      setResult({ message: "Please enter an object to search for." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("target_class", targetClass);

      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Upload Your Video
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Upload a video file to search for specific objects using
                AI-powered detection.
              </p>
              <FileUpload video={video} setVideo={setVideo} />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Search for Objects
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Enter the object you want to find (e.g., person, car, dog, cat,
                bicycle).
              </p>
              <SearchForm
                targetClass={targetClass}
                setTargetClass={setTargetClass}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {result && (
              <div className="border-t border-gray-200 pt-6">
                <ResultMessage result={result} />
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload any video file from your device</li>
              <li>
                • Enter the object you want to find (YOLOv8 supports 80+ object
                classes)
              </li>
              <li>
                • Our AI will detect the first and last frame where the object
                appears
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
