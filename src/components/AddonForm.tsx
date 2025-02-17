import React, { useState } from 'react';
import  { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { AlertCircle, Loader2, Save } from 'lucide-react';

interface AddonFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    addon_id: string;
    nome: string;
    descricao?: string;
    valor: number;
  };
}

export default function AddonForm({ onSuccess, onCancel, initialData }: AddonFormProps) {
  // ... rest of the imports and state management code remains the same ...

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Nome do Add-on */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome do Add-on2
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Valor
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Valor por unidade</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm flex items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Atualizar Add-on' : 'Criar Add-on'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}