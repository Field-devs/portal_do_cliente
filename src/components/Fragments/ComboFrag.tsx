import { useState } from "react";

export default function ComboFrag({ value = "", options = [], onChange }) {
  const [selected, setSelected] = useState(value);

  const handleChange = (event) => {
    setSelected(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="p-3 w-64 border-2 border-yellow-300 bg-gray-900 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer text-center"
      >
      <option value="" className="bg-gray-300 text-black">Escolha...</option>
      {options.map(({ key, label }) => (
        <option key={key} value={key} className="bg-gray-500 text-white">
          {label}
        </option>
      ))}
    </select>
  );
}
