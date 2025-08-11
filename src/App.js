return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "550px",
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "28px",
          color: "#222",
        }}
      >
        🎥 Smart Video Object Finder
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <label style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
          Upload Video:
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "14px",
            backgroundColor: "#fafafa",
          }}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
          Object to Find:
        </label>
        <input
          type="text"
          value={targetClass}
          onChange={(e) => setTargetClass(e.target.value)}
          placeholder="e.g., person, car, dog"
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "14px",
            backgroundColor: "#fafafa",
          }}
        />

        <button
          type="submit"
          style={{
            background: "linear-gradient(to right, #4facfe, #00f2fe)",
            color: "#fff",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          🔍 Search Object
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "18px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "500",
            color: result.startsWith("Error") ? "#b00020" : "#1b5e20",
            backgroundColor: result.startsWith("Error") ? "#fdecea" : "#e8f5e9",
            border: `1px solid ${
              result.startsWith("Error") ? "#f5c6cb" : "#c8e6c9"
            }`,
          }}
        >
          {result}
        </div>
      )}
    </div>
  </div>
);
