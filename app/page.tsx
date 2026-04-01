"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const benchmarkPresets: Record<BenchMode, { captureCeiling: number; winRateLow: number; winRateHigh: number; cycleLow: number; cycleHigh: number; stageAgingCeiling: number; }> = {
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
    const spendChange = ((state.monthlySpend - state.priorMonthlySpend) / Math.max(state.priorMonthlySpend, 1)) * 100;
    const winRateChange = state.winRate - state.priorWinRate;
    const cycleChange = ((state.avgSalesCycleDays - state.priorSalesCycleDays) / Math.max(state.priorSalesCycleDays, 1)) * 100;

    const preset = benchmarkPresets[state.benchmarkMode as BenchMode];

    const saturationRisk = clamp(
      (state.captureMix - preset.captureCeiling) * 1.4 +
        Math.max(cacChange, 0) * 1.2 +
        Math.max(spendChange, 0) * 0.35,
      0,
      100,
    );

    const pipelineRisk = clamp(
      Math.max(-winRateChange, 0) * 4 +
        Math.max(cycleChange, 0) * 0.8 +
        Math.max(state.stageAgingOverThreshold - preset.stageAgingCeiling, 0) * 2.3,
      0,
      100,
    );

    const systemRisk = clamp(saturationRisk * 0.55 + pipelineRisk * 0.45, 0, 100);

    let diagnosis = "Balanced Watch";
    if (saturationRisk >= 60 && pipelineRisk >= 60) diagnosis = "System Imbalance";
    else if (saturationRisk >= 60) diagnosis = "Allocation-Led CAC Creep";
    else if (pipelineRisk >= 60) diagnosis = "Pipeline-Led CAC Creep";

    const suggestedShift = clamp(state.testReallocation, 5, 20);
    const modeledCACImprovementPct = clamp((saturationRisk / 100) * 12 + (pipelineRisk > 55 ? 1 : 0), 2, 14);
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

    const priorRevenue = state.priorMonthlyConversions;
    const currentRevenue = state.monthlyConversions;

    const trendData = [
      { period: "Prior", cac: Math.round(priorCAC), conversions: state.priorMonthlyConversions, spend: state.priorMonthlySpend },
      { period: "Current", cac: Math.round(currentCAC), conversions: state.monthlyConversions, spend: state.monthlySpend },
      { period: "Modeled", cac: Math.round(modeledNewCAC), conversions: Math.round(modeledConversions), spend: state.monthlySpend },
    ];

    const mixData = [
      { name: "Current", capture: state.captureMix, discovery: state.discoveryMix },
      { name: "Test Mix", capture: clamp(state.captureMix - suggestedShift, 0, 100), discovery: clamp(state.discoveryMix + suggestedShift, 0, 100) },
    ];

    const resilienceScore = inverseScore(100 - state.top3RevenueConcentration, 35, 70);
    const dependencyScore = inverseScore(100 - state.founderDependentDeals, 35, 75);
    const forecastScore = inverseScore(state.forecastAccuracy, 55, 90);
    const scalabilityScore = clamp(
      inverseScore(state.grossMargin, 28, 55) * 0.6 + inverseScore(state.managerInspectionRate, 35, 85) * 0.4,
      0,
      100,
    );
    const governanceScore = clamp(
      inverseScore(state.revenueGovernanceScore, 40, 90) * 0.55 + inverseScore(state.managerInspectionRate, 35, 85) * 0.45,
      0,
      100,
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
      cacChange,
      saturationRisk,
      pipelineRisk,
      systemRisk,
      diagnosis,
      suggestedShift,
      modeledCACImprovementPct,
      modeledConversions,
      incrementalConversions,
      narrative,
      cards,
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

  const HomeScreen = () => (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Badge className="rounded-full px-3 py-1 text-xs">Agency Revenue System Tools</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Rep workflow</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Open the conversation. Expand the diagnosis.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Use the CAC Creep Calculator to open a sharper portfolio conversation with agencies. Once the team has traction, use the Revenue Fragility Diagnostic to deepen the relationship and surface broader structural opportunities.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
                          <div className="rounded-2xl bg-slate-100 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">CAC movement</div><div className="mt-2 text-xl font-semibold">{formatMoney(analysis.currentCAC)} from {formatMoney(analysis.currentCAC / (1 + (analysis.cacChange / 100)))}</div><div className="mt-1 text-sm text-slate-600">Current CAC vs prior period CAC</div></div>
                          <div className="rounded-2xl bg-slate-100 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recommended shift</div><div className="mt-2 text-xl font-semibold">{analysis.suggestedShift}%</div><div className="mt-1 text-sm text-slate-600">From saturated capture into discovery</div></div>
                          <div className="rounded-2xl bg-slate-100 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Modeled revenue impact</div><div className="mt-2 text-xl font-semibold">+{Math.round(analysis.incrementalConversions)} conversions</div><div className="mt-1 text-sm text-slate-600">Use revenue per conversion to turn this into projected revenue</div></div>
                          <div className="rounded-2xl bg-slate-100 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Blended ROAS signal</div><div className="mt-2 text-xl font-semibold">Inspect with total revenue ÷ total spend</div><div className="mt-1 text-sm text-slate-600">Use blended ROAS as a portfolio readout, not channel proof</div></div>
                        </div>
                        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 text-sm font-medium">Talk track</div>
                          <p className="text-sm leading-6 text-slate-700">Right now, the issue looks less like pure channel performance and more like a portfolio-efficiency problem. We would run a controlled {analysis.suggestedShift}% reallocation from capture into discovery over {state.targetReadoutWeeks} weeks, hold spend flat, and inspect blended CAC, total output, and incremental lift before scaling.</p>
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-100 p-5">
                        <div className="mb-4 text-sm font-medium">Suggested next step</div>
                        <div className="space-y-4 text-sm text-slate-700">
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Choose one account or cohort where CAC is drifting.</span></div>
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Run a controlled reallocation with spend held flat.</span></div>
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Measure blended CAC, total output, and incremental lift.</span></div>
                        </div>
                        <div className="mt-6 rounded-2xl bg-white p-4">
                          <div className="text-xs uppercase tracking-wide text-slate-500">When to use the second tool</div>
                          <div className="mt-3 text-sm leading-6 text-slate-700">Once the client engages on the test or shows deeper interest, move to the Revenue Fragility Diagnostic to expand the relationship beyond channel mix.</div>
                          <Button className="mt-4 w-full rounded-2xl" onClick={() => setScreen("fragility")}>Continue to structural diagnosis</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader><CardTitle>CAC trend and modeled readout</CardTitle><CardDescription>Prior vs current vs test scenario</CardDescription></CardHeader>
                    <CardContent className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={analysis.trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" /><YAxis /><Tooltip /><Area type="monotone" dataKey="cac" fillOpacity={0.15} /></AreaChart></ResponsiveContainer></CardContent>
                  </Card>
                  <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader><CardTitle>Mix shift view</CardTitle><CardDescription>Current portfolio mix vs modeled test mix</CardDescription></CardHeader>
                    <CardContent className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={analysis.mixData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="capture" stackId="a" /><Bar dataKey="discovery" stackId="a" /></BarChart></ResponsiveContainer></CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <TopBar title="Revenue Fragility Diagnostic" subtitle="Expand diagnosis" />
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Diagnostic inputs</CardTitle>
                  <CardDescription>Use after the initial opportunity is established to deepen the relationship.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2"><Label>Top 3 revenue concentration (%)</Label><Input type="number" value={state.top3RevenueConcentration} onChange={(e) => update("top3RevenueConcentration", Number(e.target.value))} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Founder-dependent late-stage deals (%)</Label><Input type="number" value={state.founderDependentDeals} onChange={(e) => update("founderDependentDeals", Number(e.target.value))} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Forecast accuracy (%)</Label><Input type="number" value={state.forecastAccuracy} onChange={(e) => update("forecastAccuracy", Number(e.target.value))} className="rounded-2xl" /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Current gross margin (%)</Label><Input type="number" value={state.grossMargin} onChange={(e) => update("grossMargin", Number(e.target.value))} className="rounded-2xl" /></div>
                    <div className="space-y-2"><Label>Prior gross margin (%)</Label><Input type="number" value={state.priorGrossMargin} onChange={(e) => update("priorGrossMargin", Number(e.target.value))} className="rounded-2xl" /></div>
                  </div>
                  <div className="space-y-2"><Label>Manager inspection rate (%)</Label><Input type="number" value={state.managerInspectionRate} onChange={(e) => update("managerInspectionRate", Number(e.target.value))} className="rounded-2xl" /></div>
                  <div className="space-y-2"><Label>Revenue governance score (%)</Label><Input type="number" value={state.revenueGovernanceScore} onChange={(e) => update("revenueGovernanceScore", Number(e.target.value))} className="rounded-2xl" /></div>
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">Use this after the initial CAC conversation has created traction. This is the expansion motion, not the opener.</div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { title: "Fragility Score", value: `${analysis.fragilityScore}/100`, sub: analysis.fragilityBand, icon: ShieldAlert },
                    { title: "Forecast Reliability", value: `${state.forecastAccuracy}%`, sub: scoreLabel(analysis.forecastScore), icon: BarChart3 },
                    { title: "Founder Dependency", value: `${state.founderDependentDeals}%`, sub: "Late-stage deals", icon: Users },
                    { title: "Scalability", value: `${analysis.fragilityPillars[3].score}/100`, sub: scoreLabel(analysis.fragilityPillars[3].score), icon: Layers3 },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                        <Card className="rounded-3xl border-0 shadow-sm"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><div className="rounded-2xl bg-slate-100 p-2"><Icon className="h-4 w-4" /></div><Badge variant="outline" className="rounded-full">Post-test</Badge></div><div className="text-sm text-slate-500">{card.title}</div><div className="mt-2 text-2xl font-semibold leading-tight">{card.value}</div><div className="mt-2 text-sm text-slate-600">{card.sub}</div></CardContent></Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div><CardTitle>Strategic interpretation</CardTitle><CardDescription>Use this to broaden the conversation beyond media mix into revenue durability.</CardDescription></div>
                      <Badge className="rounded-full px-4 py-1 text-sm">{analysis.fragilityBand}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                      <div>
                        <p className="text-base leading-7 text-slate-700">{analysis.fragilityNarrative}</p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          {analysis.fragilityPillars.map((pillar) => (
                            <div key={pillar.name} className="rounded-2xl bg-slate-100 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">{pillar.name}</div><div className="mt-2 text-xl font-semibold">{pillar.score}/100</div><div className="mt-1 text-sm text-slate-600">{scoreLabel(pillar.score)}</div></div>
                          ))}
                        </div>
                        <div className="mt-6 rounded-2xl border border-slate-200 p-4"><div className="mb-2 text-sm font-medium">Conversation bridge</div><p className="text-sm leading-6 text-slate-700">Now that we’ve identified a portfolio efficiency opportunity, this diagnostic helps us assess whether there are broader structural issues—forecast reliability, concentration risk, dependency, and margin durability—that may limit growth as the business scales.</p></div>
                      </div>
                      <div className="rounded-3xl bg-slate-100 p-5">
                        <div className="mb-4 text-sm font-medium">Suggested escalation path</div>
                        <div className="space-y-4 text-sm text-slate-700">
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Share the fragility score and four-pillar view with the client.</span></div>
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Identify whether they want a deeper strategic review.</span></div>
                          <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 flex-none" /><span>Escalate internally for advanced diagnostic support.</span></div>
                        </div>
                        <div className="mt-6 rounded-2xl bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recommended use case</div><div className="mt-3 text-sm leading-6 text-slate-700">Use with agencies that have already engaged on testing, shown strategic curiosity, or surfaced growth pain beyond media allocation.</div></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader><CardTitle>Four-pillar view</CardTitle><CardDescription>Benchmark resilience, governance, founder independence, and scalability.</CardDescription></CardHeader>
                  <CardContent className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={analysis.fragilityPillars}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="score" /></BarChart></ResponsiveContainer></CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
