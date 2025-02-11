-- First, clean up any existing test users to avoid conflicts
DELETE FROM "USER" WHERE email = 'gabriel.mauro@fieldcorp.com.br';
DELETE FROM auth.users WHERE email = 'gabriel.mauro@fieldcorp.com.br';

-- Create new user in auth.users and USER table
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
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
    role,
    aud,
    confirmation_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'gabriel.mauro@fieldcorp.com.br',
    crypt('741129Dmv!', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'full_name', 'Gabriel Mauro'
    ),
    true,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Insert into USER table
  INSERT INTO "USER" (
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
  );

  -- Update confirmation fields without touching generated columns
  UPDATE auth.users
  SET email_confirmed_at = now(),
      confirmation_sent_at = now(),
      is_sso_user = false
  WHERE id = new_user_id;
END $$;

-- Ensure RLS policies are in place
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own data" ON "USER";
  DROP POLICY IF EXISTS "Users can update their own data" ON "USER";
  DROP POLICY IF EXISTS "Admins can manage all users" ON "USER";

  -- Recreate policies
  CREATE POLICY "Users can view their own data"
    ON "USER"
    FOR SELECT
    USING (auth.uid()::text = id::text);

  CREATE POLICY "Users can update their own data"
    ON "USER"
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

  CREATE POLICY "Admins can manage all users"
    ON "USER"
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM "USER" u
        WHERE u.id::text = auth.uid()::text
        AND u.cargo_id IN (1, 2)
      )
    );
END $$;