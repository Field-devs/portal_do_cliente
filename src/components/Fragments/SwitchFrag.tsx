import React, { useState } from 'react';
import '../../Styles/custom.css';

interface SwitchProps {
  checked: boolean;
  onClick: (checked: boolean) => void;
}

const SwitchFrag: React.FC<SwitchProps> = ({ checked, onClick }) => {
  const [selected, setSelected] = useState(checked);

  const toggleChecked = () => {
    setSelected(!selected);
    if (onClick) {
      onClick(!selected);
    }
  };

  return (
    <button
      onClick={toggleChecked}
      className={`relative w-12 h-6 flex items-center bg-gray-700 rounded-full p-1 transition-all duration-300 ${selected ? "bg-green-400" : "bg-gray-700"}`}
    >
      <div
        className="w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
        style={{ transform: selected ? "translateX(24px)" : "translateX(0)" }}
      />
    </button>
  );
}


export default SwitchFrag;