import React from "react";

export const FileUpload = ({ setVideo }) => {
  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        className="file-input"
      />
    </div>
  );
};
