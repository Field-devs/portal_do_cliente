/*
  # Fix Financial Dashboard Views

  1. New Views
    - `v_client_financeiro`: Client financial data view
    - `v_faturas`: Invoices view with payment history
    
  2. Changes
    - Drops and recreates views with proper structure
    - Adds payment tracking columns
    - Includes proper date handling
*/

-- Drop existing views if they exist
DROP VIEW IF EXISTS v_contrato_financeiro;
DROP VIEW IF EXISTS v_client_financeiro;
DROP VIEW IF EXISTS v_faturas;

-- Create client financial view
CREATE VIEW v_client_financeiro AS 
SELECT 
  c.user_id,
  c.id as contrato_id,
  p.nome as plano_nome,
  p.valor as plano_valor,
  c.dt_inicio,
  c.dt_fim,
  c.vencimento,
  c.status,
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
  p.valor + COALESCE(SUM(a.valor * ca.quantidade), 0) as total_geral
FROM contrato c
JOIN plano p ON p.id = c.plano_id
LEFT JOIN contrato_addons ca ON ca.contrato_id = c.id
LEFT JOIN addon a ON a.id = ca.addon_id AND a.active = true
WHERE c.active = true
GROUP BY c.user_id, c.id, p.nome, p.valor;

-- Create invoices view with payment history
CREATE VIEW v_faturas AS
SELECT
  f.id,
  f.contrato_id,
  f.valor,
  f.dt_vencimento as vencimento,
  f.dt_pagamento as data_pagamento,
  f.status,
  f.boleto_url,
  f.pay_url,
  c.user_id,
  date_trunc('month', f.dt_vencimento) as mes_referencia
FROM faturas f
JOIN contrato c ON c.id = f.contrato_id
WHERE c.active = true
ORDER BY f.dt_vencimento DESC;