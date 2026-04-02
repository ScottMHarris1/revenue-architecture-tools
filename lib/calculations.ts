export type BenchmarkMode =
  | "big6"
  | "independentA"
  | "independentB"
  | "insideSales";

export const benchmarkLabels: Record<BenchmarkMode, string> = {
  big6: "Big 6 Agency",
  independentA: "Independent Agency A ($10M–$50M)",
  independentB: "Independent Agency B (<$10M)",
  insideSales: "Inside Sales Team",
};

export const benchmarkDescriptions: Record<BenchmarkMode, string> = {
  big6:
    "Large holding-company agencies with broader portfolio complexity and more gradual efficiency change.",
  independentA:
    "Scaled independents with meaningful portfolio complexity and moderate responsiveness to reallocation.",
  independentB:
    "Smaller independents where mix changes may show up faster, but with more volatility.",
  insideSales:
    "Used when the tool is supporting a sales motion rather than directly modeling agency economics.",
};

function benchmarkImprovementFactor(mode: BenchmarkMode) {
  switch (mode) {
    case "big6":
      return 0.55;
    case "independentA":
      return 0.8;
    case "independentB":
      return 0.95;
    case "insideSales":
      return 0.7;
    default:
      return 0.8;
  }
}

export function calculateScenario({
  spend,
  conversions,
  priorSpend,
  priorConversions,
  revenuePerConversion,
  ltv,
  shift,
  benchmarkMode,
}: {
  spend: number;
  conversions: number;
  priorSpend: number;
  priorConversions: number;
  revenuePerConversion: number;
  ltv: number;
  shift: number;
  benchmarkMode: BenchmarkMode;
}) {
  const currentCAC = spend / Math.max(conversions, 1);
  const priorCAC = priorSpend / Math.max(priorConversions, 1);

  const improvementFactor =
    1 - (shift / 100) * benchmarkImprovementFactor(benchmarkMode);

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
