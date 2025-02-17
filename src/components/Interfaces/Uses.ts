interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  is_anonymous: boolean;

  // Tabela Users - Public
  user_id: number;
  nome: string;
  empresa: string;
  cnpj: string;
  perfil_id: number;
  perfil_nome: string;
  fone?: string;
  status: boolean;
  foto?: string | null;
}

export { User };

