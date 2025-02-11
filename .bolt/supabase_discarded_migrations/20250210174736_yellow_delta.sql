-- Check if user_user_id column exists and rename it
DO $$ 
BEGIN
  -- Check if user_user_id column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cliente_afiliado'
    AND column_name = 'user_user_id'
  ) THEN
    -- Rename user_user_id to user_id
    ALTER TABLE cliente_afiliado 
    RENAME COLUMN user_user_id TO user_id;
  END IF;
END $$;

-- Create or replace index
DROP INDEX IF EXISTS idx_cliente_afiliado_user_user_id;
DROP INDEX IF EXISTS idx_cliente_afiliado_user_id;
CREATE INDEX IF NOT EXISTS idx_cliente_afiliado_user_id ON cliente_afiliado(user_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON cliente_afiliado;
CREATE POLICY "Users can view their own affiliate data"
  ON cliente_afiliado
  FOR SELECT
  TO authenticated
  USING (user_id = auth_uid_to_bigint());

DROP POLICY IF EXISTS "Admins can manage all affiliates" ON cliente_afiliado;
CREATE POLICY "Admins can manage all affiliates"
  ON cliente_afiliado
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id = auth_uid_to_bigint()
      AND u.cargo_id IN (1, 2)
    )
  );