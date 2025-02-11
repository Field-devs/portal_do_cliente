-- Drop existing foreign key constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'plano_outr_user_id_fkey'
  ) THEN
    ALTER TABLE plano_outr DROP CONSTRAINT plano_outr_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraint with correct column name
ALTER TABLE plano_outr
  ADD CONSTRAINT plano_outr_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES usuario(id)
  ON DELETE SET NULL;

-- Create index for foreign key if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_plano_outr_user_id ON plano_outr(user_id);

-- Update RLS policies to use correct column name
DROP POLICY IF EXISTS "Admins can manage plans" ON plano_outr;
CREATE POLICY "Admins can manage plans"
  ON plano_outr
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.id = auth.uid()::uuid
      AND u.cargo_id IN (1, 2)
    )
  );