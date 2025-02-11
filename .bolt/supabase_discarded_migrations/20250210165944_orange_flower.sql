-- Check if user_id column exists before trying to rename
DO $$ 
BEGIN
  -- Check if user_id column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'plano_outr'
    AND column_name = 'user_id'
  ) THEN
    -- Rename user_id to id
    ALTER TABLE plano_outr RENAME COLUMN user_id TO id;
    
    -- Update indexes
    DROP INDEX IF EXISTS idx_plano_outr_user_id;
    CREATE INDEX IF NOT EXISTS idx_plano_outr_id ON plano_outr(id);

    -- Update RLS policies
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
  END IF;
END $$;