import React from "react";

const Button = ({ children, onClick, type = "button", className = "", disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-2xl font-medium transition 
        ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"} 
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
