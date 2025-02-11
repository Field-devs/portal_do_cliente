-- Create new user in auth.users and users table
DO $$
DECLARE
  new_user_id uuid;
  existing_user_id uuid;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'gabriel.mauro@fieldcorp.com.br';

  IF existing_user_id IS NULL THEN
    new_user_id := gen_random_uuid();
    
    -- Insert into auth.users with proper password hash
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'gabriel.mauro@fieldcorp.com.br',
      crypt('741129Dmv!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Gabriel Mauro"}',
      true,
      'authenticated'
    );

    -- Insert into users table
    INSERT INTO users (
      id,
      email,
      nome,
      cargo_id,
      status
    ) VALUES (
      new_user_id,
      'gabriel.mauro@fieldcorp.com.br',
      'Gabriel Mauro',
      1, -- Super Admin
      true
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

-- Ensure email/password authentication is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'auth' 
    AND tablename = 'users' 
    AND policyname = 'Enable email/password auth'
  ) THEN
    CREATE POLICY "Enable email/password auth"
      ON auth.users
      FOR SELECT
      USING (true);
  END IF;
END $$;