import React from "react";

export const SearchForm = ({ targetClass, setTargetClass, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={targetClass}
        onChange={(e) => setTargetClass(e.target.value)}
        placeholder="e.g., person, car"
        className="input-text"
      />
      <button type="submit" className="submit-button">
        Search
      </button>
    </form>
  );
};
