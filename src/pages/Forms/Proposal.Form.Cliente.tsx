import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import { AskDialog } from "../../components/Dialogs/SweetAlert";
import FormProps from "../../Models/FormProps";

interface ProposalForm3Props {
  id: string;
}

export default function ProposalFormCliente({onSuccess, onCancel, id}): FormProps {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const handleCancel = async () => {
    await AskDialog("Você tem certeza que deseja cancelar a edição da proposta atual ?").then((result) => {
      if (result.isConfirmed) {
        console.log("Confirmed");
        return true;
      } else {
        console.log("Cancelled");
        return false;
      }
    });
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log("Form submitted with data:", { name, address, birthDay });
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Confirmar Dados</h1>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleCancel}>Cancelar</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleSubmit}>Confirmar</button>
      </div>
    </div>
  );
}
