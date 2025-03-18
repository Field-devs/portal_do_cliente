import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SwitchFrag from './Fragments/SwitchFrag';

interface CrudButtonsProps {
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLocker: () => Promise<boolean>;
  active: boolean;
}

const ActionsButtons: React.FC<CrudButtonsProps> = ({ onCreate, onEdit, onDelete, onLocker, active }) => {
  console.log(onEdit);

  const [activeActual, setActiveActual] = React.useState(active);
  const handleOnLock = async () => {
    const resultChecked = await onLocker();
    setActiveActual(resultChecked);
  }

  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = () => {
    onDelete();
  };

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


      {/* Botao de Atualização */}
      {
        onEdit && (
          <button
            onClick={handleEdit}
            className="text-blue-500"
          >
            <Edit className="mr-2" />
          </button>
        )
      }

      {/* Botao de Exclusão */}

      {
        onDelete && (
          <button
            onClick={handleDelete}
            className="text-red-500"
          >
            <Trash2 className="mr-2" />
          </button>
        )
      }

      {
        onLocker && (
          <SwitchFrag
            onClick={handleOnLock}
            checked={activeActual}
          />
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