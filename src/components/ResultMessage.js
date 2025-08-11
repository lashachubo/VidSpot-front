import React from "react";

export const ResultMessage = ({ result }) => {
  return (
    result && (
      <div
        className={`result-message ${
          result.startsWith("Error") ? "error" : "success"
        }`}
      >
        {result}
      </div>
    )
  );
};
