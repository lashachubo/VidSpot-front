import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { SearchForm } from "./components/SearchForm";
import { ResultMessage } from "./components/ResultMessage";
import { fetchSearchResult } from "./services/searchService";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import "./styles.css";

function App() {
  const [video, setVideo] = useState(null);
  const [targetClass, setTargetClass] = useState("person");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return;
    try {
      const response = await fetchSearchResult(video, targetClass);
      setResult(response.message);
    } catch (err) {
      setResult("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Upload a video and search for objects
          </h2>

          <FileUpload setVideo={setVideo} />
          <SearchForm
            targetClass={targetClass}
            setTargetClass={setTargetClass}
            handleSubmit={handleSubmit}
          />
          <ResultMessage result={result} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
