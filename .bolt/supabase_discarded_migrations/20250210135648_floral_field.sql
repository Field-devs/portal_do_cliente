-- Create new migration to rename cliente_afiliado_id column
DO $$ 
BEGIN
  -- Check if the column exists before trying to rename
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cliente_afiliado'
    AND column_name = 'cliente_afiliado_id'
  ) THEN
    -- Rename the column
    ALTER TABLE cliente_afiliado RENAME COLUMN cliente_afiliado_id TO id;
    
    -- Update any existing foreign key constraints
    ALTER TABLE IF EXISTS cliente_afiliado_historico 
      DROP CONSTRAINT IF EXISTS cliente_afiliado_historico_cliente_afiliado_id_fkey,
      ADD CONSTRAINT cliente_afiliado_historico_cliente_afiliado_id_fkey 
      FOREIGN KEY (cliente_afiliado_id) REFERENCES cliente_afiliado(id);
      
    -- Update indexes
    DROP INDEX IF EXISTS idx_cliente_afiliado_id;
    CREATE INDEX IF NOT EXISTS idx_cliente_afiliado_id ON cliente_afiliado(id);
  END IF;
END $$;