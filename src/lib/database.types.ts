export interface Database {
  public: {
    Tables: {
      usuario: {
        Row: {
          id: number
          email: string
          senha: string | null
          nome: string | null
          telefone: string | null
          foto_perfil: string | null
          dt_criacao: string | null
          status: boolean | null
          cargo_id: number
        }
        Insert: {
          id?: number
          email: string
          senha?: string | null
          nome?: string | null
          telefone?: string | null
          foto_perfil?: string | null
          dt_criacao?: string | null
          status?: boolean | null
          cargo_id: number
        }
        Update: {
          id?: number
          email?: string
          senha?: string | null
          nome?: string | null
          telefone?: string | null
          foto_perfil?: string | null
          dt_criacao?: string | null
          status?: boolean | null
          cargo_id?: number
        }
      }
      cargo: {
        Row: {
          cargo_id: number
          cargo: string
        }
      }
    }
  }
}