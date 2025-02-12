interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  is_anonymous: boolean;
  // Tabela Pessoa
  pessoas_id: number;
  nome: string;
  cargo_id: number;
  telefone?: string;
  foto_perfil?: string | null;
}

export { User };

