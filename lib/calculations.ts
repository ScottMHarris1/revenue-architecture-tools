export function calculateScenario({
  spend,
  conversions,
  priorSpend,
  priorConversions,
  revenuePerConversion,
  ltv,
  shift,
}: {
  spend: number;
  conversions: number;
  priorSpend: number;
  priorConversions: number;
  revenuePerConversion: number;
  ltv: number;
  shift: number;
}) {
  const currentCAC = spend / Math.max(conversions, 1);
  const priorCAC = priorSpend / Math.max(priorConversions, 1);

  const improvementFactor = 1 - (shift / 100) * 0.8;
  const newCAC = currentCAC * improvementFactor;

  const newConversions = spend / Math.max(newCAC, 1);
  const lift = (newConversions - conversions) * revenuePerConversion;

  const revenue = newConversions * revenuePerConversion;
  const roas = revenue / Math.max(spend, 1);

  const ltvToCac = ltv / Math.max(newCAC, 1);

  return {
    currentCAC,
    priorCAC,
    newCAC,
    lift,
    roas,
    ltvToCac,
  };
}
