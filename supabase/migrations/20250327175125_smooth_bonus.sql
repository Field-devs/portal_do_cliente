/*
  # Create view for financial contract details

  1. New Views
    - `v_contrato_financeiro`: View for detailed financial information
      - Base plan details
      - Active add-ons
      - Total calculations
      - Payment information

  2. Fields
    - user_id (uuid)
    - plano_nome (text)
    - plano_valor (decimal)
    - addons (json array)
    - total_addons (decimal)
    - total_geral (decimal)
    - vencimento (date)
*/

CREATE OR REPLACE VIEW v_contrato_financeiro AS
SELECT 
  c.user_id,
  p.nome as plano_nome,
  p.valor as plano_valor,
  COALESCE(
    json_agg(
      json_build_object(
        'id', a.id,
        'nome', a.nome,
        'valor', a.valor,
        'quantidade', ca.quantidade
      )
    ) FILTER (WHERE a.id IS NOT NULL),
    '[]'::json
  ) as addons,
  COALESCE(SUM(a.valor * ca.quantidade), 0) as total_addons,
  p.valor + COALESCE(SUM(a.valor * ca.quantidade), 0) as total_geral,
  c.vencimento
FROM contrato c
JOIN plano p ON p.id = c.plano_id
LEFT JOIN contrato_addons ca ON ca.contrato_id = c.id
LEFT JOIN addon a ON a.id = ca.addon_id
WHERE c.active = true
GROUP BY c.user_id, c.id, p.nome, p.valor;