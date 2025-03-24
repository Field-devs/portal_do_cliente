import { useCallback } from "react";

// Voce deve passar o Setter nao o Objeto
const useCustomSetter = (setter) => {
  return useCallback(
    (key, value) => {
      setter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setter]
  );
};

// Função para remover um nó de um objeto
const removeNode = (obj: Record<string, any>, keysToRemove: string[]) => {
  const rest = { ...obj };
  keysToRemove.forEach((key) => {
    delete rest[key];
  });
  return rest;
};

// Deixa somente numero, removendo qualquer mascara, considerando a fracao
const onlyNumber = (value: any) => {
  const strValue = String(value);
  const number = strValue.replace(/[^0-9]/g, "");
  return number;
};

export { useCustomSetter, removeNode, onlyNumber };
