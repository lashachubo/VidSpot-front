import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { SearchForm } from "./components/SearchForm";
import { ResultMessage } from "./components/ResultMessage";
import { fetchSearchResult } from "./services/searchService";

import "./styles.css"; // External styles for overall layout

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
    <div className="app-container">
      <div className="form-container">
        <h2 className="title">🎥 Object Finder</h2>
        <FileUpload setVideo={setVideo} />
        <SearchForm
          targetClass={targetClass}
          setTargetClass={setTargetClass}
          handleSubmit={handleSubmit}
        />
        <ResultMessage result={result} />
      </div>
    </div>
  );
}

export default App;
