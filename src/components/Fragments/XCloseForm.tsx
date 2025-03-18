import React from "react";
import { X } from "lucide-react";

interface XCloseFormProps {
  onClose: () => void; // Function to handle the close action
}

const XCloseForm: React.FC<XCloseFormProps> = ({ onClose }) => {
  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black hover:bg-gray-500 transition-colors focus:outline-none"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

export default XCloseForm;