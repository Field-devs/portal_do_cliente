-- Rename usuario_id column to id in all relevant tables
DO $$ 
BEGIN
  -- Check if the column exists before trying to rename
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'plano_outr'
    AND column_name = 'usuario_id'
  ) THEN
    -- Rename the column
    ALTER TABLE plano_outr RENAME COLUMN usuario_id TO id;
    
    -- Update indexes
    DROP INDEX IF EXISTS idx_plano_outr_usuario_id;
    CREATE INDEX IF NOT EXISTS idx_plano_outr_id ON plano_outr(id);
  END IF;

  -- Check and rename in addon table
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'addon'
    AND column_name = 'usuario_id'
  ) THEN
    ALTER TABLE addon RENAME COLUMN usuario_id TO id;
    
    DROP INDEX IF EXISTS idx_addon_usuario_id;
    CREATE INDEX IF NOT EXISTS idx_addon_id ON addon(id);
  END IF;

  -- Update any foreign key constraints to use new column name
  ALTER TABLE IF EXISTS plano_outr 
    DROP CONSTRAINT IF EXISTS plano_outr_usuario_id_fkey,
    ADD CONSTRAINT plano_outr_id_fkey 
    FOREIGN KEY (id) REFERENCES usuario(user_id);

  ALTER TABLE IF EXISTS addon 
    DROP CONSTRAINT IF EXISTS addon_usuario_id_fkey,
    ADD CONSTRAINT addon_id_fkey 
    FOREIGN KEY (id) REFERENCES usuario(user_id);
END $$;