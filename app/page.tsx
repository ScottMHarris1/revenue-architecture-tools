"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Activity,
  DollarSign,
  ArrowRight,
  RefreshCcw,
  ShieldAlert,
  Users,
  BarChart3,
  Layers3,
  ChevronLeft,
  PlayCircle,
  SearchCheck,
  Sparkles,
  Copy,
  Check,
  FileText,
  Printer,
  Columns3,
  AlertTriangle,
} from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPct(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function scoreLabel(score: number) {
  if (score >= 75) return "Healthy";
  if (score >= 55) return "Watch";
  return "Fragile";
}

function inverseScore(value: number, lowBad: number, highGood: number) {
  if (value <= lowBad) return 20;
  if (value >= highGood) return 90;
  return clamp(20 + ((value - lowBad) / Math.max(highGood - lowBad, 1)) * 70, 20, 90);
}

type BenchMode =
  | "big-6-agency"
  | "independent-agency-a"
  | "independent-agency-b"
  | "inside-sales-team";

type ScreenMode = "home" | "cac" | "fragility";

type AppState = {
  screen: ScreenMode;
  company: string;
  monthlySpend: number;
  monthlyConversions: number;
  priorMonthlySpend: number;
  priorMonthlyConversions: number;
  captureMix: number;
  discoveryMix: number;
  testReallocation: number;
  comparisonShift: number;
  accountCount: number;
  targetReadoutWeeks: number;
  benchmarkMode: BenchMode;
  revenuePerConversion: number;
  ltv: number;
  currentBlendedROAS: number;
  priorBlendedROAS: number;
  top3RevenueConcentration: number;
  founderDependentDeals: number;
  forecastAccuracy: number;
  grossMargin: number;
  priorGrossMargin: number;
  managerInspectionRate: number;
  revenueGovernanceScore: number;
};

const defaultState: AppState = {
  screen: "home",
  company: "Your Agency",
  monthlySpend: 300000,
  monthlyConversions: 2400,
  priorMonthlySpend: 250000,
  priorMonthlyConversions: 2300,
  captureMix: 82,
  discoveryMix: 18,
  testReallocation: 12,
  comparisonShift: 18,
  accountCount: 18,
  targetReadoutWeeks: 3,
  benchmarkMode: "independent-agency-a",
  revenuePerConversion: 800,
  ltv: 4800,
  currentBlendedROAS: 5.1,
  priorBlendedROAS: 6.0,
  top3RevenueConcentration: 46,
  founderDependentDeals: 38,
  forecastAccuracy: 71,
  grossMargin: 42,
  priorGrossMargin: 47,
  managerInspectionRate: 54,
  revenueGovernanceScore: 58,
};

const benchmarkPresets: Record<
  BenchMode,
  {
    label: string;
    description: string;
    captureCeiling: number;
    roasLow: number;
    roasHigh: number;
  }
> = {
  "big-6-agency": {
    label: "Big 6 Agency",
    description:
      "Large holding-company agencies managing broad portfolios, layered teams, and more complex cross-account budget allocation decisions.",
    captureCeiling: 62,
    roasLow: 2.5,
    roasHigh: 5.0,
  },
  "independent-agency-a": {
    label: "Independent Agency A ($10M–$50M)",
    description:
      "Scaled independent agencies with growing portfolio complexity, emerging manager layers, and a real need for durable revenue systems.",
    captureCeiling: 70,
    roasLow: 3.0,
    roasHigh: 6.0,
  },
  "independent-agency-b": {
    label: "Independent Agency B (<$10M)",
    description:
      "Smaller independents where founder judgment still shapes many decisions and portfolio governance is usually less formalized.",
    captureCeiling: 75,
    roasLow: 3.2,
    roasHigh: 6.5,
  },
  "inside-sales-team": {
    label: "Inside Sales Team",
    description:
      "A platform or outsourced sales motion where the focus is not agency P&L itself, but how a sales team opens, diagnoses, and advances portfolio conversations with advertisers or agency partners.",
    captureCeiling: 75,
    roasLow: 2.8,
    roasHigh: 5.8,
  },
};

function Badge({
  children,
  outline = false,
}: {
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        border: outline ? "1px solid #cbd5e1" : "none",
        background: outline ? "#fff" : "#0f172a",
        color: outline ? "#334155" : "#fff",
      }}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  outline = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 16,
        padding: "10px 16px",
        border: outline ? "1px solid #cbd5e1" : "none",
        background: outline ? "#fff" : "#0f172a",
        color: outline ? "#0f172a" : "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 16,
        padding: "12px 14px",
        fontSize: 14,
      }}
    />
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 16,
        padding: "12px 14px",
        fontSize: 14,
      }}
    />
  );
}

function RangeInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  );
}

function SelectInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 16,
        padding: "12px 14px",
        fontSize: 14,
        background: "#fff",
      }}
    >
      <option value="big-6-agency">Big 6 Agency</option>
      <option value="independent-agency-a">
        Independent Agency A ($10M–$50M)
      </option>
      <option value="independent-agency-b">
        Independent Agency B (&lt;$10M)
      </option>
      <option value="inside-sales-team">Inside Sales Team</option>
    </select>
  );
}

function runScenario(state: AppState, shift: number) {
  const currentCAC = state.monthlySpend / Math.max(state.monthlyConversions, 1);
  const priorCAC =
    state.priorMonthlySpend / Math.max(state.priorMonthlyConversions, 1);
  const cacChange =
    ((currentCAC - priorCAC) / Math.max(priorCAC, 1)) * 100;
  const roasChange =
    ((state.currentBlendedROAS - state.priorBlendedROAS) /
      Math.max(state.priorBlendedROAS, 0.01)) *
    100;
  const currentLtvToCac = state.ltv / Math.max(currentCAC, 1);
  const priorLtvToCac = state.ltv / Math.max(priorCAC, 1);

  const preset = benchmarkPresets[state.benchmarkMode];
  const saturationRisk = clamp(
    (state.captureMix - preset.captureCeiling) * 1.6 +
      Math.max(cacChange, 0) * 1.2 +
      Math.max(-roasChange, 0) * 0.9,
    0,
    100
  );

  let diagnosis = "Balanced Watch";
  if (saturationRisk >= 65) diagnosis = "Allocation-Led CAC Creep";
  else if (saturationRisk >= 45) diagnosis = "Emerging Portfolio Pressure";

  const suggestedShift = clamp(shift, 5, 20);
  const modeledCACImprovementPct = clamp(
    (saturationRisk / 100) * 12 * (suggestedShift / 12),
    2,
    18
  );
  const modeledNewCAC = currentCAC * (1 - modeledCACImprovementPct / 100);
  const modeledConversions = state.monthlySpend / modeledNewCAC;
  const incrementalConversions = modeledConversions - state.monthlyConversions;
  const projectedRevenueLift =
    incrementalConversions * state.revenuePerConversion;
  const modeledRevenue = modeledConversions * state.revenuePerConversion;
  const modeledBlendedROAS = modeledRevenue / Math.max(state.monthlySpend, 1);
  const modeledLtv = state.ltv * (1 + (modeledCACImprovementPct / 100) * 0.35);
  const modeledLtvToCac = modeledLtv / Math.max(modeledNewCAC, 1);
  const testCaptureMix = clamp(state.captureMix - suggestedShift, 0, 100);
  const testDiscoveryMix = clamp(state.discoveryMix + suggestedShift, 0, 100);

  const narrative =
    diagnosis === "Allocation-Led CAC Creep"
      ? "CAC is likely being driven by portfolio over-indexing in demand capture. Marginal efficiency is fading before channel-level metrics make the issue obvious."
      : diagnosis === "Emerging Portfolio Pressure"
        ? "The portfolio is beginning to show early signs of saturation. CAC is rising and blended returns are softening even if channel metrics still look acceptable."
        : "The portfolio is currently within a manageable range, but there are early signals worth monitoring before they compound.";

  return {
    currentCAC,
    priorCAC,
    currentLtvToCac,
    priorLtvToCac,
    modeledLtv,
    modeledNewCAC,
    modeledLtvToCac,
    modeledBlendedROAS,
    projectedRevenueLift,
    suggestedShift,
    testCaptureMix,
    testDiscoveryMix,
    incrementalConversions,
    diagnosis,
    narrative,
    saturationRisk,
  };
}

export default function RevenueArchitectureTools() {
  const [state, setState] = useState<AppState>(defaultState);
  const [copied, setCopied] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);

  const update = (key: keyof AppState, value: string | number) => {
    setState((prev) => ({ ...prev, [key]: value as never }));
  };

  const setScreen = (screen: ScreenMode) => {
    setState((prev) => ({ ...prev, screen }));
    setCopied(false);
    setCopiedClient(false);
  };

  const reset = () => {
    setState(defaultState);
    setCopied(false);
    setCopiedClient(false);
  };

  const analysis = useMemo(
    () => runScenario(state, state.testReallocation),
    [state]
  );
  const comparison = useMemo(
    () => runScenario(state, state.comparisonShift),
    [state]
  );

  const cards = [
    {
      title: "Current CAC",
      value: formatMoney(analysis.currentCAC),
      sub: `${analysis.currentCAC >= analysis.priorCAC ? "+" : ""}${formatPct(
        ((analysis.currentCAC - analysis.priorCAC) /
          Math.max(analysis.priorCAC, 1)) *
          100
      )} vs prior period`,
      icon: DollarSign,
    },
    {
      title: "Current blended ROAS",
      value: `${state.currentBlendedROAS.toFixed(2)}x`,
      sub: `${
        ((state.currentBlendedROAS - state.priorBlendedROAS) /
          Math.max(state.priorBlendedROAS, 0.01)) *
          100 >=
        0
          ? "+"
          : ""
      }${formatPct(
        ((state.currentBlendedROAS - state.priorBlendedROAS) /
          Math.max(state.priorBlendedROAS, 0.01)) *
          100
      )} vs prior period`,
      icon: TrendingUp,
    },
    {
      title: "LTV:CAC",
      value: `${analysis.currentLtvToCac.toFixed(1)}:1`,
      sub: `LTV ${formatMoney(state.ltv)} | prior ${analysis.priorLtvToCac.toFixed(
        1
      )}:1`,
      icon: Layers3,
    },
    {
      title: "Projected revenue lift",
      value: formatMoney(analysis.projectedRevenueLift),
      sub: `${Math.round(
        analysis.incrementalConversions
      )} incremental conversions modeled`,
      icon: Activity,
    },
  ];

  const trendData = [
    { period: "Prior", cac: Math.round(analysis.priorCAC) },
    { period: "Current", cac: Math.round(analysis.currentCAC) },
    { period: "Primary", cac: Math.round(analysis.modeledNewCAC) },
    { period: "Compare", cac: Math.round(comparison.modeledNewCAC) },
  ];

  const mixData = [
    {
      name: "Current",
      capture: state.captureMix,
      discovery: state.discoveryMix,
    },
    {
      name: `Primary ${analysis.suggestedShift}%`,
      capture: analysis.testCaptureMix,
      discovery: analysis.testDiscoveryMix,
    },
    {
      name: `Compare ${comparison.suggestedShift}%`,
      capture: comparison.testCaptureMix,
      discovery: comparison.testDiscoveryMix,
    },
  ];

  const resilienceScore = inverseScore(
    100 - state.top3RevenueConcentration,
    35,
    70
  );
  const dependencyScore = inverseScore(
    100 - state.founderDependentDeals,
    35,
    75
  );
  const forecastScore = inverseScore(state.forecastAccuracy, 55, 90);
  const scalabilityScore = clamp(
    inverseScore(state.grossMargin, 28, 55) * 0.6 +
      inverseScore(state.managerInspectionRate, 35, 85) * 0.4,
    0,
    100
  );
  const governanceScore = clamp(
    inverseScore(state.revenueGovernanceScore, 40, 90) * 0.55 +
      inverseScore(state.managerInspectionRate, 35, 85) * 0.45,
    0,
    100
  );

  const fragilityScore = Math.round(
    resilienceScore * 0.25 +
      forecastScore * 0.25 +
      dependencyScore * 0.2 +
      inverseScore(state.grossMargin, 28, 55) * 0.15 +
      inverseScore(state.managerInspectionRate, 35, 85) * 0.15
  );

  let fragilityBand = "Healthy";
  if (fragilityScore < 55) fragilityBand = "Fragile";
  else if (fragilityScore < 75) fragilityBand = "Watch";

  const fragilityPillars = [
    { name: "Resilience", score: Math.round(resilienceScore) },
    { name: "Governance", score: Math.round(governanceScore) },
    { name: "Founder Independence", score: Math.round(dependencyScore) },
    { name: "Scalability", score: Math.round(scalabilityScore) },
  ];

  const fragilityNarrative =
    fragilityBand === "Fragile"
      ? "Growth is likely masking structural risk. Revenue concentration, founder dependency, or weak governance are limiting transferability and predictability."
      : fragilityBand === "Watch"
        ? "The system is growing, but durability is not fully proven. This is a strong post-test expansion zone: enough traction to care, enough fragility to act."
        : "The revenue system appears comparatively durable. The strongest next move here is benchmarked insight and scenario planning rather than urgent remediation.";

  const clientExport = `${state.company}

Portfolio Snapshot
- Benchmark mode: ${benchmarkPresets[state.benchmarkMode].label}
- CAC: ${formatMoney(analysis.currentCAC)} (from ${formatMoney(
    analysis.priorCAC
  )})
- Blended ROAS: ${state.currentBlendedROAS.toFixed(2)}x (from ${state.priorBlendedROAS.toFixed(
    2
  )}x)
- LTV:CAC: ${analysis.currentLtvToCac.toFixed(1)}:1 (from ${analysis.priorLtvToCac.toFixed(
    1
  )}:1)

Modeled Test Outcome
- Recommended shift: ${analysis.suggestedShift}% from capture into discovery
- Modeled CAC: ${formatMoney(analysis.modeledNewCAC)}
- Modeled blended ROAS: ${analysis.modeledBlendedROAS.toFixed(2)}x
- Modeled LTV:CAC: ${analysis.modeledLtvToCac.toFixed(1)}:1
- Projected revenue lift: ${formatMoney(analysis.projectedRevenueLift)}

Recommended Next Step
Run a controlled ${analysis.suggestedShift}% reallocation over ${
    state.targetReadoutWeeks
  } weeks, hold spend flat, and inspect blended CAC, blended ROAS, projected revenue lift, and LTV:CAC before scaling.`;

  const copySummary = async () => {
    const summary = `Portfolio summary for ${
      state.company
    }: CAC moved from ${formatMoney(analysis.priorCAC)} to ${formatMoney(
      analysis.currentCAC
    )}. Current blended ROAS is ${state.currentBlendedROAS.toFixed(
      2
    )}x versus prior ${state.priorBlendedROAS.toFixed(
      2
    )}x. Current LTV:CAC is ${analysis.currentLtvToCac.toFixed(
      1
    )}:1. A controlled ${
      analysis.suggestedShift
    }% reallocation from capture into discovery could model approximately ${formatMoney(
      analysis.projectedRevenueLift
    )} in revenue lift, with blended ROAS moving to ${analysis.modeledBlendedROAS.toFixed(
      2
    )}x, CAC moving to ${formatMoney(
      analysis.modeledNewCAC
    )}, and LTV:CAC moving to ${analysis.modeledLtvToCac.toFixed(1)}:1.`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const copyClientExport = async () => {
    try {
      await navigator.clipboard.writeText(clientExport);
      setCopiedClient(true);
      window.setTimeout(() => setCopiedClient(false), 1800);
    } catch {
      setCopiedClient(false);
    }
  };

  const printOnePager = () => {
    window.print();
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#0f172a",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            break-inside: avoid;
          }
          .print-page {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="print-page" style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
        {state.screen === "home" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge>Agency Revenue System Tools</Badge>
                <Badge outline>Rep workflow</Badge>
              </div>
              <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
                Open the conversation. Expand the diagnosis.
              </h1>
              <p
                style={{
                  marginTop: 16,
                  maxWidth: 900,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#475569",
                }}
              >
                Use the CAC Creep Calculator to open a sharper portfolio conversation with agencies.
                Once the team has traction, use the Revenue Fragility Diagnostic to deepen the
                relationship and surface broader structural opportunities.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginTop: 24,
                }}
              >
                {[
                  {
                    title: "1. Open",
                    text: "Reframe from channel performance to portfolio efficiency.",
                    icon: PlayCircle,
                  },
                  {
                    title: "2. Test",
                    text: "Design a controlled reallocation test with clear guardrails.",
                    icon: SearchCheck,
                  },
                  {
                    title: "3. Expand",
                    text: "Use structural diagnosis to deepen the relationship post-test.",
                    icon: Sparkles,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      style={{ background: "#f1f5f9", borderRadius: 20, padding: 16 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fff",
                          borderRadius: 16,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                          marginBottom: 12,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ marginTop: 4, fontSize: 14, color: "#475569" }}>
                        {item.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
              }}
            >
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <Badge>Stage 1</Badge>
                    <Badge outline>Open conversation</Badge>
                  </div>
                  <h2 style={sectionTitleStyle}>CAC Creep Calculator</h2>
                  <p style={{ color: "#475569", lineHeight: 1.7 }}>
                    Use live in client conversations to diagnose whether rising CAC is driven by
                    allocation or broader portfolio pressure.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    {[
                      "Diagnose portfolio pressure quickly",
                      "Generate a controlled test design",
                      "Anchor on blended CAC and blended ROAS",
                      "Show revenue lift, not just efficiency",
                    ].map((t) => (
                      <div
                        key={t}
                        style={{
                          background: "#f1f5f9",
                          borderRadius: 16,
                          padding: 14,
                          fontSize: 14,
                          color: "#334155",
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Button onClick={() => setScreen("cac")}>Start conversation tool</Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
              >
                <Card>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <Badge>Stage 2</Badge>
                    <Badge outline>Expand diagnosis</Badge>
                  </div>
                  <h2 style={sectionTitleStyle}>Revenue Fragility Diagnostic</h2>
                  <p style={{ color: "#475569", lineHeight: 1.7 }}>
                    Use after traction is established to assess resilience, governance, dependency,
                    and scalability across the client's revenue system.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                      marginTop: 16,
                    }}
                  >
                    {[
                      "Surface structural growth risk",
                      "Create a strategic escalation path",
                      "Benchmark durability, not just growth",
                      "Support deeper advisory follow-up",
                    ].map((t) => (
                      <div
                        key={t}
                        style={{
                          background: "#f1f5f9",
                          borderRadius: 16,
                          padding: 14,
                          fontSize: 14,
                          color: "#334155",
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Button onClick={() => setScreen("fragility")} outline>
                      Run diagnostic
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        ) : state.screen === "cac" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              className="no-print"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <Badge>Agency Revenue System Tools</Badge>
                  <Badge outline>Open conversation</Badge>
                </div>
                <h1 style={{ fontSize: 40, margin: 0, fontWeight: 700 }}>
                  CAC Creep Calculator
                </h1>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button onClick={() => setScreen("home")} outline>
                  <ChevronLeft size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Back to workflow
                </Button>
                <Button onClick={reset} outline>
                  <RefreshCcw size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Reset
                </Button>
                <Button onClick={printOnePager} outline>
                  <Printer size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Print one-pager
                </Button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 1.35fr)",
                gap: 24,
              }}
            >
              <Card>
                <h3 style={{ marginTop: 0 }}>Conversation inputs</h3>
                <p style={{ color: "#64748b", marginTop: 4 }}>
                  Keep this simple in live conversations: spend, conversions, mix, and portfolio
                  value inputs.
                </p>

                <div style={{ display: "grid", gap: 18 }}>
                  <Field label="Company">
                    <TextInput value={state.company} onChange={(v) => update("company", v)} />
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Benchmark mode">
                      <SelectInput
                        value={state.benchmarkMode}
                        onChange={(v) => update("benchmarkMode", v)}
                      />
                    </Field>
                    <Field label="Accounts in portfolio">
                      <NumberInput
                        value={state.accountCount}
                        onChange={(v) => update("accountCount", v)}
                      />
                    </Field>
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#475569",
                      background: "#f8fafc",
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <strong>{benchmarkPresets[state.benchmarkMode].label}:</strong>{" "}
                    {benchmarkPresets[state.benchmarkMode].description}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Current monthly spend">
                      <NumberInput
                        value={state.monthlySpend}
                        onChange={(v) => update("monthlySpend", v)}
                      />
                    </Field>
                    <Field label="Current monthly conversions">
                      <NumberInput
                        value={state.monthlyConversions}
                        onChange={(v) => update("monthlyConversions", v)}
                      />
                    </Field>
                    <Field label="Prior monthly spend">
                      <NumberInput
                        value={state.priorMonthlySpend}
                        onChange={(v) => update("priorMonthlySpend", v)}
                      />
                    </Field>
                    <Field label="Prior monthly conversions">
                      <NumberInput
                        value={state.priorMonthlyConversions}
                        onChange={(v) => update("priorMonthlyConversions", v)}
                      />
                    </Field>
                  </div>

                  <Field label={`Demand capture mix (${state.captureMix}%)`}>
                    <RangeInput
                      value={state.captureMix}
                      onChange={(v) => {
                        update("captureMix", v);
                        update("discoveryMix", 100 - v);
                      }}
                    />
                  </Field>

                  <Field label={`Demand discovery mix (${state.discoveryMix}%)`}>
                    <RangeInput
                      value={state.discoveryMix}
                      onChange={(v) => {
                        update("discoveryMix", v);
                        update("captureMix", 100 - v);
                      }}
                    />
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Primary shift (%)">
                      <NumberInput
                        value={state.testReallocation}
                        onChange={(v) => update("testReallocation", v)}
                      />
                    </Field>
                    <Field label="Compare shift (%)">
                      <NumberInput
                        value={state.comparisonShift}
                        onChange={(v) => update("comparisonShift", v)}
                      />
                    </Field>
                  </div>

                  <Field label="Readout window (weeks)">
                    <NumberInput
                      value={state.targetReadoutWeeks}
                      onChange={(v) => update("targetReadoutWeeks", v)}
                    />
                  </Field>

                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: 18,
                      display: "grid",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Portfolio value inputs
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Field label="Revenue per conversion ($)">
                        <NumberInput
                          value={state.revenuePerConversion}
                          onChange={(v) => update("revenuePerConversion", v)}
                        />
                      </Field>
                      <Field label="LTV ($)">
                        <NumberInput value={state.ltv} onChange={(v) => update("ltv", v)} />
                      </Field>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Field label="Current blended ROAS">
                        <NumberInput
                          value={state.currentBlendedROAS}
                          onChange={(v) => update("currentBlendedROAS", v)}
                          step={0.1}
                        />
                      </Field>
                      <Field label="Prior blended ROAS">
                        <NumberInput
                          value={state.priorBlendedROAS}
                          onChange={(v) => update("priorBlendedROAS", v)}
                          step={0.1}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 16,
                  }}
                >
                  {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                background: "#f1f5f9",
                                borderRadius: 14,
                                padding: 8,
                              }}
                            >
                              <Icon size={16} />
                            </div>
                            <Badge outline>{state.company}</Badge>
                          </div>
                          <div style={{ fontSize: 14, color: "#64748b" }}>{card.title}</div>
                          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>
                            {card.value}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
                            {card.sub}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Card className="print-card">
                  <div
                    className="no-print"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>Rep summary</h3>
                      <p style={{ marginTop: 6, color: "#64748b" }}>
                        Use this live to reframe the conversation and propose a next step.
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
                    >
                      <Badge>{analysis.diagnosis}</Badge>
                      <Button onClick={copySummary} outline>
                        {copied ? (
                          <>
                            <Check
                              size={16}
                              style={{ marginRight: 6, verticalAlign: "middle" }}
                            />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy
                              size={16}
                              style={{ marginRight: 6, verticalAlign: "middle" }}
                            />
                            Copy summary
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                          letterSpacing: 0.8,
                        }}
                      >
                        Client one-pager
                      </div>
                      <h2 style={{ margin: "6px 0 0 0", fontSize: 30 }}>
                        Portfolio Efficiency Snapshot
                      </h2>
                      <div style={{ marginTop: 6, color: "#475569" }}>
                        {state.company} • {benchmarkPresets[state.benchmarkMode].label}
                      </div>
                    </div>
                    <Badge>{analysis.diagnosis}</Badge>
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div style={{ background: "#f8fafc", borderRadius: 18, padding: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        CAC
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {formatMoney(analysis.currentCAC)}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
                        from {formatMoney(analysis.priorCAC)}
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 18, padding: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        Blended ROAS
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {analysis.modeledBlendedROAS.toFixed(2)}x
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
                        from {state.currentBlendedROAS.toFixed(2)}x
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 18, padding: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        LTV:CAC
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {analysis.modeledLtvToCac.toFixed(1)}:1
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
                        from {analysis.currentLtvToCac.toFixed(1)}:1
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 18, padding: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        Revenue lift
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {formatMoney(analysis.projectedRevenueLift)}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
                        modeled outcome
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 22,
                      display: "grid",
                      gridTemplateColumns: "1.05fr 0.95fr",
                      gap: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                          marginBottom: 8,
                        }}
                      >
                        Interpretation
                      </div>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
                        {analysis.narrative}
                      </p>
                      <div
                        style={{
                          marginTop: 18,
                          border: "1px solid #e2e8f0",
                          borderRadius: 18,
                          padding: 16,
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>
                          Recommended next step
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            lineHeight: 1.8,
                            color: "#334155",
                          }}
                        >
                          Run a controlled {analysis.suggestedShift}% reallocation from capture
                          into discovery over {state.targetReadoutWeeks} weeks, hold spend flat,
                          and measure blended CAC, blended ROAS, projected revenue lift, and
                          LTV:CAC before scaling.
                        </p>
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 18, padding: 16 }}>
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                          marginBottom: 10,
                        }}
                      >
                        Modeled outcomes
                      </div>
                      <div style={{ display: "grid", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span>Modeled CAC</span>
                          <strong>{formatMoney(analysis.modeledNewCAC)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span>Modeled LTV</span>
                          <strong>{formatMoney(analysis.modeledLtv)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span>Modeled blended ROAS</span>
                          <strong>{analysis.modeledBlendedROAS.toFixed(2)}x</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span>Modeled LTV:CAC</span>
                          <strong>{analysis.modeledLtvToCac.toFixed(1)}:1</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span>Recommended shift</span>
                          <strong>{analysis.suggestedShift}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div
                  className="no-print"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: 24,
                  }}
                >
                  <Card>
                    <h3 style={{ marginTop: 0 }}>CAC trend and modeled readout</h3>
                    <p style={{ color: "#64748b" }}>Prior vs current vs test scenario</p>
                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="cac" fillOpacity={0.15} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card>
                    <h3 style={{ marginTop: 0 }}>Mix shift view</h3>
                    <p style={{ color: "#64748b" }}>
                      Current portfolio mix vs modeled scenarios
                    </p>
                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mixData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="capture" stackId="a" fill="#0f172a" />
                          <Bar dataKey="discovery" stackId="a" fill="#94a3b8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                <Card className="no-print">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>Scenario comparison</h3>
                      <p style={{ marginTop: 6, color: "#64748b" }}>
                        Show two allocation tests side-by-side and compare the likely portfolio
                        outcome.
                      </p>
                    </div>
                    <Badge outline>
                      <Columns3 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                      Primary vs Compare
                    </Badge>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                        background: "#f8fafc",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        Primary scenario
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {analysis.suggestedShift}% shift
                      </div>
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled CAC</span>
                          <strong>{formatMoney(analysis.modeledNewCAC)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled blended ROAS</span>
                          <strong>{analysis.modeledBlendedROAS.toFixed(2)}x</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled LTV:CAC</span>
                          <strong>{analysis.modeledLtvToCac.toFixed(1)}:1</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Projected revenue lift</span>
                          <strong>{formatMoney(analysis.projectedRevenueLift)}</strong>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                        background: "#f8fafc",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        Comparison scenario
                      </div>
                      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                        {comparison.suggestedShift}% shift
                      </div>
                      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled CAC</span>
                          <strong>{formatMoney(comparison.modeledNewCAC)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled blended ROAS</span>
                          <strong>{comparison.modeledBlendedROAS.toFixed(2)}x</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Modeled LTV:CAC</span>
                          <strong>{comparison.modeledLtvToCac.toFixed(1)}:1</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Projected revenue lift</span>
                          <strong>{formatMoney(comparison.projectedRevenueLift)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="no-print">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>Client-facing export</h3>
                      <p style={{ marginTop: 6, color: "#64748b" }}>
                        Use this for a clean follow-up email or recap note after the conversation.
                      </p>
                    </div>
                    <Button onClick={copyClientExport} outline>
                      {copiedClient ? (
                        <>
                          <Check
                            size={16}
                            style={{ marginRight: 6, verticalAlign: "middle" }}
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <FileText
                            size={16}
                            style={{ marginRight: 6, verticalAlign: "middle" }}
                          />
                          Copy client export
                        </>
                      )}
                    </Button>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 16,
                      background: "#f8fafc",
                      whiteSpace: "pre-wrap",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#334155",
                    }}
                  >
                    {clientExport}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <Badge>Agency Revenue System Tools</Badge>
                  <Badge outline>Expand diagnosis</Badge>
                </div>
                <h1 style={{ fontSize: 40, margin: 0, fontWeight: 700 }}>
                  Revenue Fragility Diagnostic
                </h1>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button onClick={() => setScreen("home")} outline>
                  <ChevronLeft size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Back to workflow
                </Button>
                <Button onClick={reset} outline>
                  <RefreshCcw size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  Reset
                </Button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(320px, 0.95fr) minmax(320px, 1.45fr)",
                gap: 24,
              }}
            >
              <Card>
                <h3 style={{ marginTop: 0 }}>Diagnostic inputs</h3>
                <p style={{ color: "#64748b" }}>
                  Use after the initial opportunity is established to deepen the relationship.
                </p>

                <div style={{ display: "grid", gap: 18 }}>
                  <Field label="Top 3 revenue concentration (%)">
                    <NumberInput
                      value={state.top3RevenueConcentration}
                      onChange={(v) => update("top3RevenueConcentration", v)}
                    />
                  </Field>
                  <Field label="Founder-dependent late-stage deals (%)">
                    <NumberInput
                      value={state.founderDependentDeals}
                      onChange={(v) => update("founderDependentDeals", v)}
                    />
                  </Field>
                  <Field label="Forecast accuracy (%)">
                    <NumberInput
                      value={state.forecastAccuracy}
                      onChange={(v) => update("forecastAccuracy", v)}
                    />
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Current gross margin (%)">
                      <NumberInput
                        value={state.grossMargin}
                        onChange={(v) => update("grossMargin", v)}
                      />
                    </Field>
                    <Field label="Prior gross margin (%)">
                      <NumberInput
                        value={state.priorGrossMargin}
                        onChange={(v) => update("priorGrossMargin", v)}
                      />
                    </Field>
                  </div>
                  <Field label="Manager inspection rate (%)">
                    <NumberInput
                      value={state.managerInspectionRate}
                      onChange={(v) => update("managerInspectionRate", v)}
                    />
                  </Field>
                  <Field label="Revenue governance score (%)">
                    <NumberInput
                      value={state.revenueGovernanceScore}
                      onChange={(v) => update("revenueGovernanceScore", v)}
                    />
                  </Field>
                </div>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      title: "Fragility Score",
                      value: `${fragilityScore}/100`,
                      sub: fragilityBand,
                      icon: ShieldAlert,
                    },
                    {
                      title: "Forecast Reliability",
                      value: `${state.forecastAccuracy}%`,
                      sub: scoreLabel(forecastScore),
                      icon: BarChart3,
                    },
                    {
                      title: "Founder Dependency",
                      value: `${state.founderDependentDeals}%`,
                      sub: "Late-stage deals",
                      icon: Users,
                    },
                    {
                      title: "Scalability",
                      value: `${fragilityPillars[3].score}/100`,
                      sub: scoreLabel(fragilityPillars[3].score),
                      icon: Layers3,
                    },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                background: "#f1f5f9",
                                borderRadius: 14,
                                padding: 8,
                              }}
                            >
                              <Icon size={16} />
                            </div>
                            <Badge outline>Post-test</Badge>
                          </div>
                          <div style={{ fontSize: 14, color: "#64748b" }}>{card.title}</div>
                          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>
                            {card.value}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
                            {card.sub}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Card>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0 }}>Strategic interpretation</h3>
                      <p style={{ marginTop: 6, color: "#64748b" }}>
                        Use this to broaden the conversation beyond media mix into revenue durability.
                      </p>
                    </div>
                    <Badge>{fragilityBand}</Badge>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(280px, 1.1fr) minmax(260px, 0.9fr)",
                      gap: 24,
                      marginTop: 20,
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155" }}>
                        {fragilityNarrative}
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 12,
                          marginTop: 20,
                        }}
                      >
                        {fragilityPillars.map((pillar) => (
                          <div
                            key={pillar.name}
                            style={{
                              background: "#f1f5f9",
                              borderRadius: 18,
                              padding: 16,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                textTransform: "uppercase",
                                color: "#64748b",
                              }}
                            >
                              {pillar.name}
                            </div>
                            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>
                              {pillar.score}/100
                            </div>
                            <div style={{ marginTop: 4, fontSize: 14, color: "#475569" }}>
                              {scoreLabel(pillar.score)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: 20,
                          border: "1px solid #e2e8f0",
                          borderRadius: 18,
                          padding: 16,
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>
                          Conversation bridge
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            lineHeight: 1.8,
                            color: "#334155",
                          }}
                        >
                          Now that we’ve identified a portfolio efficiency opportunity, this
                          diagnostic helps us assess whether there are broader structural issues—
                          forecast reliability, concentration risk, dependency, and margin
                          durability—that may limit growth as the business scales.
                        </p>
                      </div>
                    </div>

                    <div style={{ background: "#f1f5f9", borderRadius: 24, padding: 20 }}>
                      <div style={{ fontWeight: 600, marginBottom: 14 }}>
                        Suggested escalation path
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                          fontSize: 14,
                          color: "#334155",
                        }}
                      >
                        {[
                          "Share the fragility score and four-pillar view with the client.",
                          "Identify whether they want a deeper strategic review.",
                          "Escalate internally for advanced diagnostic support.",
                        ].map((t) => (
                          <div key={t} style={{ display: "flex", gap: 10 }}>
                            <ArrowRight size={16} style={{ marginTop: 2, flex: "0 0 auto" }} />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: 20,
                          background: "#fff",
                          borderRadius: 18,
                          padding: 16,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            textTransform: "uppercase",
                            color: "#64748b",
                          }}
                        >
                          Recommended use case
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 14,
                            lineHeight: 1.7,
                            color: "#334155",
                          }}
                        >
                          Use with agencies that have already engaged on testing, shown strategic
                          curiosity, or surfaced growth pain beyond media allocation.
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 style={{ marginTop: 0 }}>Four-pillar view</h3>
                  <p style={{ color: "#64748b" }}>
                    Benchmark resilience, governance, founder independence, and scalability.
                  </p>
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fragilityPillars}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
