import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface CrudButtonsProps {
  onCreate: () => void;
  onRead: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const ActionsButtons: React.FC<CrudButtonsProps> = ({ onCreate, onRead, onUpdate, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onCreate}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 flex items-center"
      >
        <Plus className="mr-2" /> Create
      </button>
      <button
        onClick={onRead}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 flex items-center"
      >
        <Eye className="mr-2" /> Read
      </button>
      <button
        onClick={onUpdate}
        className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 flex items-center"
      >
        <Edit className="mr-2" /> Update
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 flex items-center"
      >
        <Trash2 className="mr-2" /> Delete
      </button>
    </div>
  );
};

export default ActionsButtons;