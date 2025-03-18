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
      className={`relative w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-300 ${
        selected ? "bg-brand/80" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${
          selected ? "bg-white translate-x-5" : "bg-white translate-x-0"
        }`}
      />
    </button>
  );
}


export default SwitchFrag;