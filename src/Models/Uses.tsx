interface User {
  user_id?: string;
  aud?: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  is_anonymous?: boolean;

  // Tabela Users - Public
  id: string;
  nome: string;
  empresa: string;
  cnpj: string;
  perfil_id: number;
  perfil_nome: string;
  perfil_cod: string;
  fone?: string;
  active: boolean;
  f_status: string;
  dt_add: string;
  foto?: string | null;
}

export type { User };

