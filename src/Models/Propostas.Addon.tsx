interface PropostaAddon {
  proposta_id: string; // UUID, referência para a tabela 'proposta'
  addon_id: string; // UUID, referência para a tabela 'plano_addon'
  qtde: number; // Quantidade, valor padrão 0
  unit: number; // Valor unitário, decimal com precisão 18,2, valor padrão 0
}

export default PropostaAddon;