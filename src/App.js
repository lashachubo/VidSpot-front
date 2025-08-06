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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "24px",
            color: "#333",
          }}
        >
          Video Object Search
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
          <input
            type="text"
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            placeholder="Enter object to search (e.g., car, person)"
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            Search
          </button>
        </form>
        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              backgroundColor: "#e6f4ea",
              border: "1px solid #b7dfc4",
              borderRadius: "8px",
              color: "#245c36",
              fontSize: "14px",
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
