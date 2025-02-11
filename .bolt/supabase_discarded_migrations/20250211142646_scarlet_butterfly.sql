-- Insert admin user
INSERT INTO usuario (
  email,
  senha,
  nome,
  cargo_id,
  status
) VALUES (
  'admin@example.com',
  crypt('741129Dmv!', gen_salt('bf')),
  'Admin User',
  1, -- Super Admin
  true
)
ON CONFLICT (email) 
DO UPDATE SET
  senha = crypt('741129Dmv!', gen_salt('bf')),
  cargo_id = 1,
  status = true;