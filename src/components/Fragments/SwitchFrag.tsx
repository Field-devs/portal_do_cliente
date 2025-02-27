import React, { useState } from 'react';
import '../../Styles/custom.css';

interface SwitchProps {
  checked: boolean;
  name: string;
  onChange: (checked: boolean) => void;
}

const SwitchFrag: React.FC<SwitchProps> = ({ name, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);
  const id = `switch-${name}`;
  const handleChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
    console.log("marcado", isChecked);
  }
  
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="sr-only"
        aria-label={`switch for ${name}`}
        checked={isChecked}
        onChange={() => handleChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 peer-checked:bg-brand-600 dark:peer-checked:bg-brand-400 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
    </label>
  );
};

export default SwitchFrag;