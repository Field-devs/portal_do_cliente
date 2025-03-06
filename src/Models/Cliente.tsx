
interface Cliente {
  id?: string;
  tipo: string | 'CF' | 'AVA' | 'AF';
  user_id: string;
  nome: string;
  fone: string;
  email: string;
  endereco?: string; // Opcional
  cnpj?: string; // Opcional
wallet_id?: string; // Opcional
  cupom?: string; // Opcional
  desconto: number;
  comissao: number;
  vencimento?: string; // Usar string para representar a data e hora
  active: boolean;
}

export default Cliente;