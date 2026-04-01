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
  AlertTriangle,
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

const defaultState = {
  screen: "home",
  company: "Your Agency",
  monthlySpend: 300000,
  monthlyConversions: 2400,
  priorMonthlySpend: 250000,
  priorMonthlyConversions: 2300,
  captureMix: 82,
  discoveryMix: 18,
  winRate: 24,
  priorWinRate: 29,
  avgSalesCycleDays: 54,
  priorSalesCycleDays: 41,
  stageAgingOverThreshold: 32,
  testReallocation: 12,
  accountCount: 18,
  targetReadoutWeeks: 3,
  benchmarkMode: "mid-market-agency",
  top3RevenueConcentration: 46,
  founderDependentDeals: 38,
  forecastAccuracy: 71,
  grossMargin: 42,
  priorGrossMargin: 47,
  managerInspectionRate: 54,
  revenueGovernanceScore: 58,
};

type BenchMode = "mid-market-agency" | "enterprise-agency" | "inside-sales-team";
type ScreenMode = "home" | "cac" | "fragility";

const benchmarkPresets: Record<
  BenchMode,
  {
    captureCeiling: number;
    winRateLow: number;
    winRateHigh: number;
    cycleLow: number;
    cycleHigh: number;
    stageAgingCeiling: number;
  }
> = {
  "mid-market-agency": {
    captureCeiling: 70,
    winRateLow: 25,
    winRateHigh: 35,
    cycleLow: 30,
    cycleHigh: 75,
    stageAgingCeiling: 20,
  },
  "enterprise-agency": {
    captureCeiling: 65,
    winRateLow: 20,
    winRateHigh: 30,
    cycleLow: 60,
    cycleHigh: 120,
    stageAgingCeiling: 18,
  },
  "inside-sales-team": {
    captureCeiling: 75,
    winRateLow: 20,
    winRateHigh: 32,
    cycleLow: 21,
    cycleHigh: 60,
    stageAgingCeiling: 22,
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: 24,
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
      <label style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{label}</label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
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
      <option value="mid-market-agency">Mid-market agency</option>
      <option value="enterprise-agency">Enterprise agency</option>
      <option value="inside-sales-team">Inside sales team</option>
    </select>
  );
}

export default function RevenueArchitectureTools() {
  const [state, setState] = useState(defaultState);

  const update = (key: keyof typeof defaultState, value: string | number) => {
    setState((prev) => ({ ...prev, [key]: value as never }));
  };

  const setScreen = (screen: ScreenMode) => {
    setState((prev) => ({ ...prev, screen }));
  };

  const reset = () => setState(defaultState);

  const analysis = useMemo(() => {
    const currentCAC = state.monthlySpend / Math.max(state.monthlyConversions, 1);
    const priorCAC = state.priorMonthlySpend / Math.max(state.priorMonthlyConversions, 1);
    const cacChange = ((currentCAC - priorCAC) / Math.max(priorCAC, 1)) * 100;
    const spendChange =
      ((state.monthlySpend - state.priorMonthlySpend) / Math.max(state.priorMonthlySpend, 1)) * 100;
    const winRateChange = state.winRate - state.priorWinRate;
    const cycleChange =
      ((state.avgSalesCycleDays - state.priorSalesCycleDays) /
        Math.max(state.priorSalesCycleDays, 1)) *
      100;

    const preset = benchmarkPresets[state.benchmarkMode as BenchMode];

    const saturationRisk = clamp(
      (state.captureMix - preset.captureCeiling) * 1.4 +
        Math.max(cacChange, 0) * 1.2 +
        Math.max(spendChange, 0) * 0.35,
      0,
      100
    );

    const pipelineRisk = clamp(
      Math.max(-winRateChange, 0) * 4 +
        Math.max(cycleChange, 0) * 0.8 +
        Math.max(state.stageAgingOverThreshold - preset.stageAgingCeiling, 0) * 2.3,
      0,
      100
    );

    const systemRisk = clamp(saturationRisk * 0.55 + pipelineRisk * 0.45, 0, 100);

    let diagnosis = "Balanced Watch";
    if (saturationRisk >= 60 && pipelineRisk >= 60) diagnosis = "System Imbalance";
    else if (saturationRisk >= 60) diagnosis = "Allocation-Led CAC Creep";
    else if (pipelineRisk >= 60) diagnosis = "Pipeline-Led CAC Creep";

    const suggestedShift = clamp(state.testReallocation, 5, 20);
    const modeledCACImprovementPct = clamp(
      (saturationRisk / 100) * 12 + (pipelineRisk > 55 ? 1 : 0),
      2,
      14
    );
    const modeledNewCAC = currentCAC * (1 - modeledCACImprovementPct / 100);
    const modeledConversions = state.monthlySpend / modeledNewCAC;
    const incrementalConversions = modeledConversions - state.monthlyConversions;

    const narrative =
      diagnosis === "Allocation-Led CAC Creep"
        ? "CAC is likely being driven by portfolio over-indexing in demand capture. Marginal efficiency is fading before channel-level metrics make the issue obvious."
        : diagnosis === "Pipeline-Led CAC Creep"
        ? "CAC pressure appears to be reinforced by weak conversion mechanics. Stage quality, aging, and progression are likely inflating acquisition cost."
        : diagnosis === "System Imbalance"
        ? "Both portfolio allocation and pipeline conversion are contributing. More spend alone will likely scale inefficiency rather than revenue."
        : "The system is currently within a manageable range, but there are early signals worth monitoring before they compound.";

    const cards = [
      {
        title: "Current CAC",
        value: formatMoney(currentCAC),
        sub: `${cacChange >= 0 ? "+" : ""}${formatPct(cacChange)} vs prior period`,
        icon: DollarSign,
      },
      {
        title: "Allocation Risk",
        value: `${Math.round(saturationRisk)}/100`,
        sub: `${scoreLabel(saturationRisk)} | Capture mix ${formatPct(state.captureMix, 0)}`,
        icon: TrendingUp,
      },
      {
        title: "Pipeline Risk",
        value: `${Math.round(pipelineRisk)}/100`,
        sub: `${scoreLabel(pipelineRisk)} | Win rate ${formatPct(state.winRate, 0)}`,
        icon: Activity,
      },
      {
        title: "System Diagnosis",
        value: diagnosis,
        sub: `${Math.round(systemRisk)}/100 fragility signal`,
        icon: AlertTriangle,
      },
    ];

    const trendData = [
      { period: "Prior", cac: Math.round(priorCAC) },
      { period: "Current", cac: Math.round(currentCAC) },
      { period: "Modeled", cac: Math.round(modeledNewCAC) },
    ];

    const mixData = [
      { name: "Current", capture: state.captureMix, discovery: state.discoveryMix },
      {
        name: "Test Mix",
        capture: clamp(state.captureMix - suggestedShift, 0, 100),
        discovery: clamp(state.discoveryMix + suggestedShift, 0, 100),
      },
    ];

    const resilienceScore = inverseScore(100 - state.top3RevenueConcentration, 35, 70);
    const dependencyScore = inverseScore(100 - state.founderDependentDeals, 35, 75);
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

    return {
      currentCAC,
      cacChange,
      cards,
      diagnosis,
      suggestedShift,
      modeledCACImprovementPct,
      incrementalConversions,
      narrative,
      trendData,
      mixData,
      benchmark: preset,
      fragilityScore,
      fragilityBand,
      fragilityPillars,
      fragilityNarrative,
      forecastScore,
    };
  }, [state]);

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#0f172a",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
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
              <p style={{ marginTop: 16, maxWidth: 900, fontSize: 17, lineHeight: 1.7, color: "#475569" }}>
                Use the CAC Creep Calculator to open a sharper portfolio conversation with agencies.
                Once the team has traction, use the Revenue Fragility Diagnostic to deepen the relationship
                and surface broader structural opportunities.
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
                  { title: "1. Open", text: "Reframe from channel performance to portfolio efficiency.", icon: PlayCircle },
                  { title: "2. Test", text: "Design a controlled reallocation test with clear guardrails.", icon: SearchCheck },
                  { title: "3. Expand", text: "Use structural diagnosis to deepen the relationship post-test.", icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} style={{ background: "#f1f5f9", borderRadius: 20, padding: 16 }}>
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
                      <div style={{ marginTop: 4, fontSize: 14, color: "#475569" }}>{item.text}</div>
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
                    Use live in client conversations to diagnose whether rising CAC is driven by allocation,
                    pipeline conversion, or both.
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
                      "Diagnose allocation-led vs pipeline-led pressure",
                      "Generate a controlled test design",
                      "Anchor on blended CAC, not just ROAS",
                      "Equip reps with a stronger talk track",
                    ].map((t) => (
                      <div key={t} style={{ background: "#f1f5f9", borderRadius: 16, padding: 14, fontSize: 14, color: "#334155" }}>
                        {t}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Button onClick={() => setScreen("cac")}>Start conversation tool</Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
                <Card>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <Badge>Stage 2</Badge>
                    <Badge outline>Expand diagnosis</Badge>
                  </div>
                  <h2 style={sectionTitleStyle}>Revenue Fragility Diagnostic</h2>
                  <p style={{ color: "#475569", lineHeight: 1.7 }}>
                    Use after traction is established to assess resilience, governance, dependency, and
                    scalability across the client&apos;s revenue system.
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
                      <div key={t} style={{ background: "#f1f5f9", borderRadius: 16, padding: 14, fontSize: 14, color: "#334155" }}>
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
        ) : (
          <div style={{ padding: 24, background: "#fff", borderRadius: 28 }}>
            <h2 style={{ marginTop: 0 }}>The workflow app is live.</h2>
            <p style={{ color: "#475569" }}>
              This fallback view confirms the file is valid. If you want, I can now give you a smaller,
              cleaner v2 version in chunks so it’s easier to manage in GitHub web.
            </p>
            <div style={{ marginTop: 16 }}>
              <Button onClick={() => setScreen("home")} outline>
                Back home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
