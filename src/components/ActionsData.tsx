import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CrudButtonsProps {
  onCreate: () => void;
  onRead: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const ActionsButtons: React.FC<CrudButtonsProps> = ({ onCreate, onRead, onUpdate, onDelete, onLocker }) => {
  return (

    <div className="flex space-x-2">

      {/* Botao de Criação  */}
      {
        onCreate && (
          <button
            onClick={onCreate}
            className="text-white"
          >
            <Plus className="mr-2" />
          </button>
        )
      }

      {/* Botao de Edição */}
      {
        onRead && (
          <button
            onClick={onRead}
            className="text-yellow-500 relative group"
          >
            <Edit className="mr-2" />
            <span className="absolute hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              Editar proposta
            </span>
          </button>
        )
      }

      {/* Botao de Atualização */}
      {/* {
        onUpdate && (
          <button
            onClick={onUpdate}
            className="text-blue-500"
          >
            <Edit className="mr-2" />
          </button>
        )
      } */}

      {/* Botao de Exclusão */}

      {
        onUpdate && (
          <button
            onClick={onDelete}
            className="text-red-500"
          >
            <Trash2 className="mr-2" />
          </button>
        )
      }

      {
        onLocker && (
          <button
            onClick={onLocker}
            className="text-black-500"
          >
            <Trash2 className="mr-2" />
          </button>
        )
      }
      
      {/* 
      lock
      lock-open 
      */}


    </div >

  );
};

export default ActionsButtons;