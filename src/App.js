import React, { useState, useRef } from "react";
import {
  Upload,
  Search,
  Clock,
  FileVideo,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function VidSpotApp() {
  const [videoFile, setVideoFile] = useState(null);
  const [targetClass, setTargetClass] = useState("person");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setResult(null);
      setError(null);
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
    }
  };

  const handleSearch = async () => {
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("target_class", targetClass);

    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.error ||
            errorData.detail ||
            "Failed to process video"
        );
      }

      const data = await response.json();
      setResult(data);

      if (data.video_url) {
        setVideoUrl(`http://localhost:8000${data.video_url}`);
      }

      if (data.first_frame >= 0 && videoRef.current) {
        videoRef.current.currentTime = data.first_timestamp;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seekToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <FileVideo className="w-12 h-12" />
            VidSpot
          </h1>
          <p className="text-purple-200 text-lg">
            AI-Powered Object Detection in Videos
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-purple-200 font-medium mb-3">
                Upload Video
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all"
                >
                  <Upload className="w-6 h-6 text-purple-300" />
                  <span className="text-white">
                    {videoFile ? videoFile.name : "Click to select video"}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-3">
                Object to Detect
              </label>
              <input
                type="text"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                placeholder="e.g., person, car, dog, cat"
                className="w-full px-4 py-3 bg-white/10 border border-purple-300 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-purple-200 text-sm mt-2">
                Try: person, car, dog, cat, bottle, chair, phone, laptop, etc.
              </p>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !videoFile}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Video
                </>
              )}
            </button>
          </div>
        </div>

        {videoUrl && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Video Player</h2>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-xl"
              style={{ maxHeight: "500px" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              {result.first_frame >= 0 ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              )}
              <h2 className="text-2xl font-bold text-white">
                Detection Results
              </h2>
            </div>

            <p className="text-purple-200 mb-6">{result.message}</p>

            {result.first_frame >= 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-5">
                  <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    First Detection
                  </h3>
                  <p className="text-white text-2xl font-bold mb-2">
                    {formatTime(result.first_timestamp)}
                  </p>
                  <p className="text-purple-200 text-sm mb-3">
                    Frame {result.first_frame}
                  </p>
                  <button
                    onClick={() => seekToTimestamp(result.first_timestamp)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    Jump to Start
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Last Detection
                  </h3>
                  <p className="text-white text-2xl font-bold mb-2">
                    {formatTime(result.last_timestamp)}
                  </p>
                  <p className="text-purple-200 text-sm mb-3">
                    Frame {result.last_frame}
                  </p>
                  <button
                    onClick={() => seekToTimestamp(result.last_timestamp)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    Jump to End
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h3 className="text-purple-300 font-semibold mb-3">
                    Duration
                  </h3>
                  <p className="text-white text-2xl font-bold">
                    {formatTime(result.duration)}
                  </p>
                  <p className="text-purple-200 text-sm">
                    {result.last_frame - result.first_frame} frames
                  </p>
                </div>

                {result.confidence && (
                  <div className="bg-white/5 rounded-xl p-5">
                    <h3 className="text-purple-300 font-semibold mb-3">
                      Confidence
                    </h3>
                    <p className="text-white text-2xl font-bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-purple-200 text-sm">
                      Average detection score
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-purple-200 text-sm">
                Video FPS: {result.fps.toFixed(2)} • Total Frames:{" "}
                {result.total_frames}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
