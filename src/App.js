import React, { useState } from "react";
import axios from "axios";

function App() {
  const [video, setVideo] = useState(null);
  const [targetClass, setTargetClass] = useState("person");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return;

    const formData = new FormData();
    formData.append("video", video);
    formData.append("target_class", targetClass);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/search",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data.message);
    } catch (err) {
      setResult("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Video Object Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />
        <input
          type="text"
          value={targetClass}
          onChange={(e) => setTargetClass(e.target.value)}
          placeholder="Search object"
        />
        <button type="submit">Search</button>
      </form>
      <p>{result}</p>
    </div>
  );
}

export default App;
