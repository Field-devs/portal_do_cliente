/**
 * Calcula o valor percentual de um valor base.
 * @param {number} baseValue - O valor base sobre o qual o percentual será calculado.
 * @param {number} percentage - O percentual a ser calculado.
 * @returns {number} - O valor resultante do cálculo percentual.
 */
 function CalcPercent(baseValue: number, percentage: number): number {
  return (baseValue * percentage) / 100;
}

export { CalcPercent };