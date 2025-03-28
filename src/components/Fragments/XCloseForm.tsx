import React from "react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface XCloseFormProps {
  onClose: () => void; // Function to handle the close action
}

const XCloseForm: React.FC<XCloseFormProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`absolute top-2 right-2 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export default XCloseForm;