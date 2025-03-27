/*
  # Create view for consumption tracking

  1. New Views
    - `v_consumo`: View for tracking resource consumption
      - Aggregates daily consumption data for:
        - Inboxes
        - Agents
        - Automations
        - Add-ons
      - Includes cost calculations
      - Tracks historical usage

  2. Fields
    - user_id (uuid)
    - dt (date)
    - caixas_entrada (int)
    - atendentes (int)
    - automacoes (int)
    - addons (int)
    - custo_total (decimal)
*/

CREATE OR REPLACE VIEW v_consumo AS
SELECT 
  c.user_id,
  c.dt,
  c.caixas_entrada,
  c.atendentes,
  c.automacoes,
  COALESCE(a.total_addons, 0) as addons,
  (
    (c.caixas_entrada * 50) + 
    (c.atendentes * 30) + 
    (c.automacoes * 20) + 
    COALESCE(a.total_addons * 40, 0)
  ) as custo_total
FROM contrato c
LEFT JOIN (
  SELECT 
    contrato_id,
    COUNT(*) as total_addons
  FROM contrato_addons
  GROUP BY contrato_id
) a ON a.contrato_id = c.id
WHERE c.active = true;