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
      className={`relative w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-200 focus:outline-none ${selected ? "bg-blue-500" : "bg-gray-300"}`}
      aria-checked={selected}
      role="switch"
    >
      <span
        className={`absolute w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${selected ? "translate-x-5" : "translate-x-0"}`}
        aria-hidden="true"
      ></span>
    </button>
  );
}

export default SwitchFrag;