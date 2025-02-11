-- Insert cargo if not exists
INSERT INTO public.cargo (cargo_id, cargo)
VALUES (1, 'super_admin')
ON CONFLICT (cargo_id) DO NOTHING;

-- Insert super admin user
INSERT INTO public.usuario (
  email,
  senha,
  nome,
  cargo_id,
  status,
  dt_criacao
)
VALUES (
  'gabriel.mauro@fieldcorp.com.br',
  crypt('741129Dmv!', gen_salt('bf')),
  'Gabriel Mauro',
  1, -- super_admin cargo_id
  true,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) 
DO UPDATE SET
  cargo_id = 1,
  status = true;