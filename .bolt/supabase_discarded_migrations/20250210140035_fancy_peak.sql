-- Add column names in Portuguese
ALTER TABLE cliente_afiliado 
RENAME COLUMN discount_percentage TO desconto;

ALTER TABLE cliente_afiliado 
RENAME COLUMN commission_rate TO comissao;

ALTER TABLE cliente_afiliado 
RENAME COLUMN coupon_code TO codigo_cupom;

ALTER TABLE cliente_afiliado 
RENAME COLUMN expiration_date TO vencimento;

ALTER TABLE cliente_afiliado 
RENAME COLUMN user_id TO user_user_id;

-- Update policies to use new column names
DROP POLICY IF EXISTS "Users can view their own affiliate data" ON cliente_afiliado;
DROP POLICY IF EXISTS "Admins can manage all affiliates" ON cliente_afiliado;

CREATE POLICY "Users can view their own affiliate data"
  ON cliente_afiliado
  FOR SELECT
  USING (user_user_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all affiliates"
  ON cliente_afiliado
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.user_id::text = auth.uid()::text
      AND u.cargo_id IN (1, 2)
    )
  );