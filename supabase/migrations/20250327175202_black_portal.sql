/*
  # Create Financial Contract View

  1. Purpose
    - Creates a view to provide detailed financial information for contracts
    - Aggregates plan details, add-ons, and total calculations
    - Used by the client financial dashboard

  2. View Details
    - Name: v_contrato_financeiro
    - Includes:
      - Base plan information
      - Add-ons with quantities and costs
      - Total calculations
      - Payment due dates

  3. Fields
    - user_id: Contract owner's ID
    - plano_nome: Base plan name
    - plano_valor: Base plan cost
    - addons: JSON array of active add-ons
    - total_addons: Total cost of all add-ons
    - total_geral: Total cost (plan + add-ons)
    - vencimento: Payment due date
*/

DROP VIEW IF EXISTS v_contrato_financeiro;

CREATE VIEW v_contrato_financeiro AS
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
LEFT JOIN addon a ON a.id = ca.addon_id AND a.active = true
WHERE c.active = true
GROUP BY c.user_id, c.id, p.nome, p.valor, c.vencimento;