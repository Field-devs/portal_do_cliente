-- Add dt_criacao column to cliente_afiliado table if it doesn't exist
ALTER TABLE cliente_afiliado 
ADD COLUMN IF NOT EXISTS dt_criacao timestamptz DEFAULT now();

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_cliente_afiliado_dt_criacao 
ON cliente_afiliado(dt_criacao);

-- Update existing records to have dt_criacao if they don't already
UPDATE cliente_afiliado 
SET dt_criacao = now() 
WHERE dt_criacao IS NULL;

-- Ensure all required columns have values
ALTER TABLE cliente_afiliado
ALTER COLUMN desconto SET NOT NULL,
ALTER COLUMN comissao SET NOT NULL,
ALTER COLUMN codigo_cupom SET NOT NULL,
ALTER COLUMN vencimento SET NOT NULL;