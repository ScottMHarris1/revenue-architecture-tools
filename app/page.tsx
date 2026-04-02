"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import MetricCard from "../components/MetricCard";
import ActionButton from "../components/ActionButton";
import ComparisonTable from "../components/ComparisonTable";
import SimpleBar from "../components/SimpleBar";
import MixShiftCard from "../components/MixShiftCard";
import WorkflowHeader from "../components/WorkflowHeader";
import {
  BenchmarkMode,
  benchmarkDescriptions,
  benchmarkLabels,
  calculateScenario,
} from "../lib/calculations";
import { formatMoney, formatROAS, formatRatio } from "../lib/format";

type FormState = {
  clientName: string;
  accountName: string;
  spend: number;
  conversions: number;
  priorSpend: number;
  priorConversions: number;
  revPerConv: number;
  ltv: number;
  shiftA: number;
  shiftB: number;
  benchmarkMode: BenchmarkMode;
  captureMix: number;
  discoveryMix: number;
};

const demoState: FormState = {
  clientName: "Acme Agency",
  accountName: "Q2 Growth Portfolio",
  spend: 300000,
  conversions: 2400,
  priorSpend: 250000,
  priorConversions: 2300,
  revPerConv: 800,
  ltv: 4800,
  shiftA: 12,
  shiftB: 18,
  benchmarkMode: "independentA",
  captureMix: 82,
  discoveryMix: 18,
};

const liveState: FormState = {
  clientName: "",
  accountName: "",
  spend: 150000,
  conversions: 1000,
  priorSpend: 140000,
  priorConversions: 980,
  revPerConv: 500,
  ltv: 3000,
  shiftA: 10,
  shiftB: 15,
  benchmarkMode: "independentA",
  captureMix: 75,
  discoveryMix: 25,
};

type Mode = "demo" | "live";

function RecommendationBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#dcfce7",
        color: "#166534",
        fontSize: 12,
        fontWeight: 700,
        border: "1px solid #bbf7d0",
      }}
    >
      {label}
    </span>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("demo");
  const [form, setForm] = useState<FormState>(demoState);

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function loadDemoData() {
    setMode("demo");
    setForm(demoState);
  }

  function loadLiveData() {
    setMode("live");
    setForm(liveState);
  }

  function resetCurrentMode() {
    setForm(mode === "demo" ? demoState : liveState);
  }

  const A = useMemo(
    () =>
      calculateScenario({
        spend: form.spend,
        conversions: form.conversions,
        priorSpend: form.priorSpend,
        priorConversions: form.priorConversions,
        revenuePerConversion: form.revPerConv,
        ltv: form.ltv,
        shift: form.shiftA,
        benchmarkMode: form.benchmarkMode,
        currentCaptureMix: form.captureMix,
        currentDiscoveryMix: form.discoveryMix,
      }),
    [form]
  );

  const B = useMemo(
    () =>
      calculateScenario({
        spend: form.spend,
        conversions: form.conversions,
        priorSpend: form.priorSpend,
        priorConversions: form.priorConversions,
        revenuePerConversion: form.revPerConv,
        ltv: form.ltv,
        shift: form.shiftB,
        benchmarkMode: form.benchmarkMode,
        currentCaptureMix: form.captureMix,
        currentDiscoveryMix: form.discoveryMix,
      }),
    [form]
  );

  const safeClientName = form.clientName || "Unnamed Client";
  const safeAccountName = form.accountName || "Unnamed Account";

  const recommendedScenario =
    A.lift > B.lift
      ? "primary"
      : B.lift > A.lift
        ? "alternative"
        : A.newCAC <= B.newCAC
          ? "primary"
          : "alternative";

  const recommendedLabel =
    recommendedScenario === "primary"
      ? `Recommended: ${form.shiftA}% shift`
      : `Recommended: ${form.shiftB}% shift`;

  const recommendedReason =
    recommendedScenario === "primary"
      ? `Recommended because it shows ${formatMoney(A.lift)} in modeled revenue lift, ${formatMoney(
          A.newCAC
        )} modeled CAC, and ${formatRatio(A.ltvToCac)} modeled LTV:CAC.`
      : `Recommended because it shows ${formatMoney(B.lift)} in modeled revenue lift, ${formatMoney(
          B.newCAC
        )} modeled CAC, and ${formatRatio(B.ltvToCac)} modeled LTV:CAC.`;

  const recommendedShift = recommendedScenario === "primary" ? form.shiftA : form.shiftB;

  const opener = `Based on what you're seeing, how has blended CAC moved as spend has scaled, especially with the portfolio currently weighted ${form.captureMix}% toward capture?`;

  const reframe = `The issue may not be whether individual lower-funnel channels are still working. It may be that the portfolio is over-indexed on capture, which can keep last-click metrics looking healthy while blended CAC becomes less efficient.`;

  const nextStep = `A practical next step would be a controlled ${recommendedShift}% reallocation from capture into discovery, holding spend flat and measuring CAC, blended efficiency, and modeled revenue lift before deciding whether to scale.`;

  const repSummary = `Client: ${safeClientName}. Account: ${safeAccountName}. Benchmark: ${
    benchmarkLabels[form.benchmarkMode]
  }. Current mix is ${form.captureMix}% capture / ${form.discoveryMix}% discovery. CAC has moved from ${formatMoney(
    A.priorCAC
  )} to ${formatMoney(
    A.currentCAC
  )}. A controlled ${form.shiftA}-${form.shiftB}% reallocation could generate ${formatMoney(
    A.lift
  )}–${formatMoney(B.lift)} in modeled revenue lift while improving blended efficiency. ${
    recommendedScenario === "primary" ? "Primary" : "Alternative"
  } scenario currently looks stronger. ${recommendedReason}`;

  const clientExport = `Portfolio Efficiency Brief

Client
- ${safeClientName}

Account / Portfolio
- ${safeAccountName}

Benchmark mode
- ${benchmarkLabels[form.benchmarkMode]}

Current mix
- Capture: ${form.captureMix}%
- Discovery: ${form.discoveryMix}%

Current state
- CAC: ${formatMoney(A.priorCAC)} → ${formatMoney(A.currentCAC)}

Primary scenario (${form.shiftA}% shift)
- Capture: ${A.modeledCaptureMix}%
- Discovery: ${A.modeledDiscoveryMix}%
- CAC: ${formatMoney(A.newCAC)}
- ROAS: ${formatROAS(A.roas)}
- LTV:CAC: ${formatRatio(A.ltvToCac)}
- Modeled revenue lift: ${formatMoney(A.lift)}

Alternative scenario (${form.shiftB}% shift)
- Capture: ${B.modeledCaptureMix}%
- Discovery: ${B.modeledDiscoveryMix}%
- CAC: ${formatMoney(B.newCAC)}
- ROAS: ${formatROAS(B.roas)}
- LTV:CAC: ${formatRatio(B.ltvToCac)}
- Modeled revenue lift: ${formatMoney(B.lift)}

Recommended scenario
- ${recommendedScenario === "primary" ? `Primary (${form.shiftA}% shift)` : `Alternative (${form.shiftB}% shift)`}

Why this is recommended
- ${recommendedReason}

Recommended next step
- ${nextStep}`;

  async function handleCopySummary() {
    await navigator.clipboard.writeText(repSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
  }

  async function handleCopyClientExport() {
    await navigator.clipboard.writeText(clientExport);
    setCopiedClient(true);
    setTimeout(() => setCopiedClient(false), 1500);
  }

  function handlePrintBrief() {
    window.print();
  }

  const maxLift = Math.max(A.lift, B.lift, 1);
  const maxRoas = Math.max(A.roas, B.roas, 1);

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 1100,
        margin: "0 auto",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-only-brief {
            display: block !important;
          }

          .print-page {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }

        .print-only-brief {
          display: none;
        }

        input, select {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: white;
          box-sizing: border-box;
        }
      `}</style>

      <div className="print-page">
        <div className="no-print">
          <h1 style={{ fontSize: 32, marginBottom: 20 }}>
            CAC Creep Calculator (V11)
          </h1>

          <WorkflowHeader />

          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Inputs</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ActionButton
                  label={mode === "demo" ? "Demo Mode Active" : "Load Demo Data"}
                  onClick={loadDemoData}
                />
                <ActionButton
                  label={mode === "live" ? "Live Mode Active" : "Load Live Mode"}
                  onClick={loadLiveData}
                />
                <ActionButton
                  label="Reset Current Mode"
                  onClick={resetCurrentMode}
                />
              </div>
            </div>

            <div
              style={{
                marginBottom: 14,
                fontSize: 13,
                color: "#475569",
                lineHeight: 1.5,
              }}
            >
              Current mode: <strong>{mode === "demo" ? "Demo" : "Live"}</strong>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Client Name</label>
                <input
                  value={form.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  placeholder="Acme Agency"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Account / Portfolio Name
                </label>
                <input
                  value={form.accountName}
                  onChange={(e) => updateField("accountName", e.target.value)}
                  placeholder="Portfolio A"
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Benchmark Mode</label>
              <select
                value={form.benchmarkMode}
                onChange={(e) =>
                  updateField("benchmarkMode", e.target.value as BenchmarkMode)
                }
              >
                {Object.entries(benchmarkLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 8, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                {benchmarkDescriptions[form.benchmarkMode]}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input
                value={form.spend}
                onChange={(e) => updateField("spend", Number(e.target.value))}
              />
              <input
                value={form.conversions}
                onChange={(e) => updateField("conversions", Number(e.target.value))}
              />

              <input
                value={form.priorSpend}
                onChange={(e) => updateField("priorSpend", Number(e.target.value))}
              />
              <input
                value={form.priorConversions}
                onChange={(e) => updateField("priorConversions", Number(e.target.value))}
              />

              <input
                value={form.revPerConv}
                onChange={(e) => updateField("revPerConv", Number(e.target.value))}
              />
              <input
                value={form.ltv}
                onChange={(e) => updateField("ltv", Number(e.target.value))}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Current Capture Mix (%)
                </label>
                <input
                  type="number"
                  value={form.captureMix}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    updateField("captureMix", next);
                    updateField("discoveryMix", Math.max(100 - next, 0));
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Current Discovery Mix (%)
                </label>
                <input
                  type="number"
                  value={form.discoveryMix}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    updateField("discoveryMix", next);
                    updateField("captureMix", Math.max(100 - next, 0));
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Primary Shift (%)</label>
                <input
                  type="number"
                  value={form.shiftA}
                  onChange={(e) => updateField("shiftA", Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Alternative Shift (%)</label>
                <input
                  type="number"
                  value={form.shiftB}
                  onChange={(e) => updateField("shiftB", Number(e.target.value))}
                />
              </div>
            </div>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginTop: 20,
            }}
          >
            <MetricCard
              label="Current CAC"
              value={formatMoney(A.currentCAC)}
              subtext={`from ${formatMoney(A.priorCAC)}`}
            />
            <MetricCard
              label="Current Mix"
              value={`${form.captureMix}/${form.discoveryMix}`}
              subtext="Capture / Discovery"
            />
            <MetricCard
              label="Primary ROAS"
              value={formatROAS(A.roas)}
              subtext={`${form.shiftA}% shift scenario`}
            />
            <MetricCard
              label="Modeled Revenue Lift"
              value={formatMoney(A.lift)}
              subtext="Primary scenario"
            />
          </div>

          <Card style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>Current System</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ActionButton
                  label={copiedSummary ? "Summary Copied" : "Copy Summary"}
                  onClick={handleCopySummary}
                />
                <ActionButton
                  label={copiedClient ? "Client Export Copied" : "Copy Client Export"}
                  onClick={handleCopyClientExport}
                />
                <ActionButton
                  label="Print Brief"
                  onClick={handlePrintBrief}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <p style={{ margin: 0 }}>
                Client: <strong>{safeClientName}</strong> | Account:{" "}
                <strong>{safeAccountName}</strong>
              </p>
              <RecommendationBadge label={recommendedLabel} />
            </div>

            <p style={{ marginTop: 8 }}>
              CAC: {formatMoney(A.priorCAC)} → {formatMoney(A.currentCAC)}
            </p>
            <p style={{ marginTop: 8, color: "#475569" }}>{recommendedReason}</p>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Conversation Prompts</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#64748b",
                    marginBottom: 6,
                  }}
                >
                  Opener
                </div>
                <div style={{ color: "#334155", lineHeight: 1.7 }}>{opener}</div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#64748b",
                    marginBottom: 6,
                  }}
                >
                  Reframe
                </div>
                <div style={{ color: "#334155", lineHeight: 1.7 }}>{reframe}</div>
              </div>

              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "#64748b",
                    marginBottom: 6,
                  }}
                >
                  Next Step
                </div>
                <div style={{ color: "#334155", lineHeight: 1.7 }}>{nextStep}</div>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Mix Shift Visual</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <MixShiftCard
                title="Current Mix"
                capture={form.captureMix}
                discovery={form.discoveryMix}
              />
              <MixShiftCard
                title={`Primary Scenario (${form.shiftA}%)`}
                capture={A.modeledCaptureMix}
                discovery={A.modeledDiscoveryMix}
              />
              <MixShiftCard
                title={`Alternative Scenario (${form.shiftB}%)`}
                capture={B.modeledCaptureMix}
                discovery={B.modeledDiscoveryMix}
              />
            </div>
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 20,
            }}
          >
            <Card
              style={{
                border:
                  recommendedScenario === "primary"
                    ? "2px solid #22c55e"
                    : "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                  Primary Scenario ({form.shiftA}%)
                </h3>
                {recommendedScenario === "primary" ? (
                  <RecommendationBadge label="Recommended" />
                ) : null}
              </div>
              <p>CAC: {formatMoney(A.newCAC)}</p>
              <p>ROAS: {formatROAS(A.roas)}</p>
              <p>LTV:CAC: {formatRatio(A.ltvToCac)}</p>
              <p>Modeled lift: {formatMoney(A.lift)}</p>
            </Card>

            <Card
              style={{
                border:
                  recommendedScenario === "alternative"
                    ? "2px solid #22c55e"
                    : "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                  Alternative Scenario ({form.shiftB}%)
                </h3>
                {recommendedScenario === "alternative" ? (
                  <RecommendationBadge label="Recommended" />
                ) : null}
              </div>
              <p>CAC: {formatMoney(B.newCAC)}</p>
              <p>ROAS: {formatROAS(B.roas)}</p>
              <p>LTV:CAC: {formatRatio(B.ltvToCac)}</p>
              <p>Modeled lift: {formatMoney(B.lift)}</p>
            </Card>
          </div>

          <Card style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 0 }}>Scenario Comparison</h3>
              <RecommendationBadge label={recommendedLabel} />
            </div>
            <div style={{ marginTop: 8, marginBottom: 12, color: "#475569" }}>
              {recommendedReason}
            </div>
            <ComparisonTable
              primary={{
                shift: form.shiftA,
                cac: formatMoney(A.newCAC),
                roas: formatROAS(A.roas),
                ltvToCac: formatRatio(A.ltvToCac),
                lift: formatMoney(A.lift),
              }}
              alternative={{
                shift: form.shiftB,
                cac: formatMoney(B.newCAC),
                roas: formatROAS(B.roas),
                ltvToCac: formatRatio(B.ltvToCac),
                lift: formatMoney(B.lift),
              }}
            />
          </Card>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 20,
            }}
          >
            <Card>
              <h3 style={{ marginTop: 0 }}>Modeled Revenue Lift</h3>
              <SimpleBar label={`Primary (${form.shiftA}%)`} value={A.lift} max={maxLift} />
              <SimpleBar
                label={`Alternative (${form.shiftB}%)`}
                value={B.lift}
                max={maxLift}
              />
            </Card>

            <Card>
              <h3 style={{ marginTop: 0 }}>Modeled ROAS</h3>
              <SimpleBar label={`Primary (${form.shiftA}%)`} value={A.roas} max={maxRoas} />
              <SimpleBar
                label={`Alternative (${form.shiftB}%)`}
                value={B.roas}
                max={maxRoas}
              />
            </Card>
          </div>

          <Card style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 0 }}>Decision View</h3>
              <RecommendationBadge label={recommendedLabel} />
            </div>
            <p style={{ marginTop: 8, color: "#475569" }}>{recommendedReason}</p>
            <p>
              {form.shiftA}% shift → {formatMoney(A.lift)} | {form.shiftB}% shift →{" "}
              {formatMoney(B.lift)}
            </p>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Rep Talk Track</h3>
            <p>{repSummary}</p>
          </Card>
        </div>

        <Card className="print-card print-only-brief" style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "#64748b",
                }}
              >
                Portfolio Efficiency Brief
              </div>
              <h2 style={{ margin: "6px 0 0 0", fontSize: 30, color: "#0f172a" }}>
                CAC Creep Diagnostic
              </h2>
              <div style={{ marginTop: 8, color: "#475569" }}>
                {safeClientName} • {safeAccountName}
              </div>
              <div style={{ marginTop: 4, color: "#64748b" }}>
                {benchmarkLabels[form.benchmarkMode]}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 14,
                minWidth: 260,
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>
                Recommended Scenario
              </div>
              <div style={{ marginTop: 8 }}>
                <RecommendationBadge label={recommendedLabel} />
              </div>
              <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#475569" }}>
                {recommendedReason}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <MetricCard
              label="Current CAC"
              value={formatMoney(A.currentCAC)}
              subtext={`from ${formatMoney(A.priorCAC)}`}
            />
            <MetricCard
              label="Primary CAC"
              value={formatMoney(A.newCAC)}
              subtext={`${form.shiftA}% shift`}
            />
            <MetricCard
              label="Primary ROAS"
              value={formatROAS(A.roas)}
              subtext="Modeled"
            />
            <MetricCard
              label="Modeled Revenue Lift"
              value={formatMoney(A.lift)}
              subtext="Primary scenario"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <MixShiftCard
              title="Current Mix"
              capture={form.captureMix}
              discovery={form.discoveryMix}
            />
            <MixShiftCard
              title={`Primary Scenario (${form.shiftA}%)`}
              capture={A.modeledCaptureMix}
              discovery={A.modeledDiscoveryMix}
            />
            <MixShiftCard
              title={`Alternative Scenario (${form.shiftB}%)`}
              capture={B.modeledCaptureMix}
              discovery={B.modeledDiscoveryMix}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 16,
                background: "#f8fafc",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Recommendation</h3>
              <p style={{ marginBottom: 10, lineHeight: 1.7, color: "#334155" }}>
                Run a controlled{" "}
                {recommendedScenario === "primary" ? form.shiftA : form.shiftB}% reallocation from
                capture into discovery, hold spend flat, and inspect CAC, blended efficiency, and
                modeled revenue lift before scaling.
              </p>
              <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#475569" }}>
                {recommendedReason}
              </p>
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 16,
                background: "#f8fafc",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Conversation Prompts</h3>
              <p style={{ marginBottom: 10, lineHeight: 1.7, color: "#334155" }}>
                <strong>Opener:</strong> {opener}
              </p>
              <p style={{ marginBottom: 10, lineHeight: 1.7, color: "#334155" }}>
                <strong>Reframe:</strong> {reframe}
              </p>
              <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#334155" }}>
                <strong>Next step:</strong> {nextStep}
              </p>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 16,
              background: "#f8fafc",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Client Export</h3>
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                color: "#334155",
              }}
            >
              {clientExport}
            </div>
          </div>
        </Card>

        <Card className="no-print" style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Portfolio Efficiency Brief</h3>
            <RecommendationBadge label={recommendedLabel} />
          </div>
          <div style={{ marginTop: 8, marginBottom: 12, color: "#475569" }}>
            {recommendedReason}
          </div>
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: "#334155",
            }}
          >
            {clientExport}
          </div>
        </Card>
      </div>
    </div>
  );
}
