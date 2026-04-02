"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import MetricCard from "../components/MetricCard";
import ActionButton from "../components/ActionButton";
import ComparisonTable from "../components/ComparisonTable";
import SimpleBar from "../components/SimpleBar";
import MixShiftCard from "../components/MixShiftCard";
import {
  BenchmarkMode,
  benchmarkDescriptions,
  benchmarkLabels,
  calculateScenario,
} from "../lib/calculations";
import { formatMoney, formatROAS, formatRatio } from "../lib/format";

export default function Page() {
  const [clientName, setClientName] = useState("Acme Agency");
  const [accountName, setAccountName] = useState("Portfolio A");

  const [spend, setSpend] = useState(300000);
  const [conversions, setConversions] = useState(2400);
  const [priorSpend, setPriorSpend] = useState(250000);
  const [priorConversions, setPriorConversions] = useState(2300);
  const [revPerConv, setRevPerConv] = useState(800);
  const [ltv, setLtv] = useState(4800);

  const [shiftA, setShiftA] = useState(12);
  const [shiftB, setShiftB] = useState(18);
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>("independentA");

  const [captureMix, setCaptureMix] = useState(82);
  const [discoveryMix, setDiscoveryMix] = useState(18);

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedClient, setCopiedClient] = useState(false);

  const A = useMemo(
    () =>
      calculateScenario({
        spend,
        conversions,
        priorSpend,
        priorConversions,
        revenuePerConversion: revPerConv,
        ltv,
        shift: shiftA,
        benchmarkMode,
        currentCaptureMix: captureMix,
        currentDiscoveryMix: discoveryMix,
      }),
    [
      spend,
      conversions,
      priorSpend,
      priorConversions,
      revPerConv,
      ltv,
      shiftA,
      benchmarkMode,
      captureMix,
      discoveryMix,
    ]
  );

  const B = useMemo(
    () =>
      calculateScenario({
        spend,
        conversions,
        priorSpend,
        priorConversions,
        revenuePerConversion: revPerConv,
        ltv,
        shift: shiftB,
        benchmarkMode,
        currentCaptureMix: captureMix,
        currentDiscoveryMix: discoveryMix,
      }),
    [
      spend,
      conversions,
      priorSpend,
      priorConversions,
      revPerConv,
      ltv,
      shiftB,
      benchmarkMode,
      captureMix,
      discoveryMix,
    ]
  );

  const repSummary = `Client: ${clientName}. Account: ${accountName}. Benchmark: ${
    benchmarkLabels[benchmarkMode]
  }. Current mix is ${captureMix}% capture / ${discoveryMix}% discovery. CAC has moved from ${formatMoney(
    A.priorCAC
  )} to ${formatMoney(
    A.currentCAC
  )}. A controlled ${shiftA}-${shiftB}% reallocation could generate ${formatMoney(
    A.lift
  )}–${formatMoney(B.lift)} in modeled revenue lift while improving blended efficiency. Primary scenario lands at ${formatMoney(
    A.newCAC
  )} CAC, ${formatROAS(A.roas)} ROAS, and ${formatRatio(A.ltvToCac)} LTV:CAC.`;

  const clientExport = `Portfolio Efficiency Brief

Client
- ${clientName}

Account / Portfolio
- ${accountName}

Benchmark mode
- ${benchmarkLabels[benchmarkMode]}

Current mix
- Capture: ${captureMix}%
- Discovery: ${discoveryMix}%

Current state
- CAC: ${formatMoney(A.priorCAC)} → ${formatMoney(A.currentCAC)}

Primary scenario (${shiftA}% shift)
- Capture: ${A.modeledCaptureMix}%
- Discovery: ${A.modeledDiscoveryMix}%
- CAC: ${formatMoney(A.newCAC)}
- ROAS: ${formatROAS(A.roas)}
- LTV:CAC: ${formatRatio(A.ltvToCac)}
- Modeled revenue lift: ${formatMoney(A.lift)}

Alternative scenario (${shiftB}% shift)
- Capture: ${B.modeledCaptureMix}%
- Discovery: ${B.modeledDiscoveryMix}%
- CAC: ${formatMoney(B.newCAC)}
- ROAS: ${formatROAS(B.roas)}
- LTV:CAC: ${formatRatio(B.ltvToCac)}
- Modeled revenue lift: ${formatMoney(B.lift)}

Recommended next step
Run a controlled ${shiftA}% to ${shiftB}% reallocation test, hold spend flat, and inspect CAC, mix efficiency, and modeled revenue lift before scaling.`;

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
            CAC Creep Calculator (V6)
          </h1>

          <Card>
            <h3 style={{ marginTop: 0 }}>Inputs</h3>

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
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Acme Agency"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Account / Portfolio Name</label>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Portfolio A"
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Benchmark Mode</label>
              <select
                value={benchmarkMode}
                onChange={(e) => setBenchmarkMode(e.target.value as BenchmarkMode)}
              >
                {Object.entries(benchmarkLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 8, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                {benchmarkDescriptions[benchmarkMode]}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input value={spend} onChange={(e) => setSpend(Number(e.target.value))} />
              <input value={conversions} onChange={(e) => setConversions(Number(e.target.value))} />

              <input value={priorSpend} onChange={(e) => setPriorSpend(Number(e.target.value))} />
              <input value={priorConversions} onChange={(e) => setPriorConversions(Number(e.target.value))} />

              <input value={revPerConv} onChange={(e) => setRevPerConv(Number(e.target.value))} />
              <input value={ltv} onChange={(e) => setLtv(Number(e.target.value))} />
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
                <label style={{ display: "block", marginBottom: 6 }}>Current Capture Mix (%)</label>
                <input
                  type="number"
                  value={captureMix}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setCaptureMix(next);
                    setDiscoveryMix(Math.max(100 - next, 0));
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Current Discovery Mix (%)</label>
                <input
                  type="number"
                  value={discoveryMix}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setDiscoveryMix(next);
                    setCaptureMix(Math.max(100 - next, 0));
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Primary Shift (%)</label>
                <input
                  type="number"
                  value={shiftA}
                  onChange={(e) => setShiftA(Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>Alternative Shift (%)</label>
                <input
                  type="number"
                  value={shiftB}
                  onChange={(e) => setShiftB(Number(e.target.value))}
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
              value={`${captureMix}/${discoveryMix}`}
              subtext="Capture / Discovery"
            />
            <MetricCard
              label="Primary ROAS"
              value={formatROAS(A.roas)}
              subtext={`${shiftA}% shift scenario`}
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

            <p style={{ marginTop: 14 }}>
              Client: <strong>{clientName}</strong> | Account: <strong>{accountName}</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              CAC: {formatMoney(A.priorCAC)} → {formatMoney(A.currentCAC)}
            </p>
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
                capture={captureMix}
                discovery={discoveryMix}
              />
              <MixShiftCard
                title={`Primary Scenario (${shiftA}%)`}
                capture={A.modeledCaptureMix}
                discovery={A.modeledDiscoveryMix}
              />
              <MixShiftCard
                title={`Alternative Scenario (${shiftB}%)`}
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
            <Card>
              <h3 style={{ marginTop: 0 }}>Primary Scenario ({shiftA}%)</h3>
              <p>CAC: {formatMoney(A.newCAC)}</p>
              <p>ROAS: {formatROAS(A.roas)}</p>
              <p>LTV:CAC: {formatRatio(A.ltvToCac)}</p>
              <p>Modeled lift: {formatMoney(A.lift)}</p>
            </Card>

            <Card>
              <h3 style={{ marginTop: 0 }}>Alternative Scenario ({shiftB}%)</h3>
              <p>CAC: {formatMoney(B.newCAC)}</p>
              <p>ROAS: {formatROAS(B.roas)}</p>
              <p>LTV:CAC: {formatRatio(B.ltvToCac)}</p>
              <p>Modeled lift: {formatMoney(B.lift)}</p>
            </Card>
          </div>

          <Card style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Scenario Comparison</h3>
            <ComparisonTable
              primary={{
                shift: shiftA,
                cac: formatMoney(A.newCAC),
                roas: formatROAS(A.roas),
                ltvToCac: formatRatio(A.ltvToCac),
                lift: formatMoney(A.lift),
              }}
              alternative={{
                shift: shiftB,
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
              <SimpleBar label={`Primary (${shiftA}%)`} value={A.lift} max={maxLift} />
              <SimpleBar label={`Alternative (${shiftB}%)`} value={B.lift} max={maxLift} />
            </Card>

            <Card>
              <h3 style={{ marginTop: 0 }}>Modeled ROAS</h3>
              <SimpleBar label={`Primary (${shiftA}%)`} value={A.roas} max={maxRoas} />
              <SimpleBar label={`Alternative (${shiftB}%)`} value={B.roas} max={maxRoas} />
            </Card>
          </div>

          <Card style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Decision View</h3>
            <p>
              {shiftA}% shift → {formatMoney(A.lift)} | {shiftB}% shift →{" "}
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
                {clientName} • {accountName}
              </div>
              <div style={{ marginTop: 4, color: "#64748b" }}>
                {benchmarkLabels[benchmarkMode]}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 14,
                minWidth: 220,
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>
                Current Mix
              </div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>
                {captureMix}% / {discoveryMix}%
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#475569" }}>
                Capture / Discovery
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
              subtext={`${shiftA}% shift`}
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
              capture={captureMix}
              discovery={discoveryMix}
            />
            <MixShiftCard
              title={`Primary Scenario (${shiftA}%)`}
              capture={A.modeledCaptureMix}
              discovery={A.modeledDiscoveryMix}
            />
            <MixShiftCard
              title={`Alternative Scenario (${shiftB}%)`}
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
              <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#334155" }}>
                Run a controlled {shiftA}% to {shiftB}% reallocation from capture into discovery,
                hold spend flat, and inspect CAC, blended efficiency, and modeled revenue lift
                before scaling.
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
              <h3 style={{ marginTop: 0 }}>Rep Summary</h3>
              <p style={{ marginBottom: 0, lineHeight: 1.7, color: "#334155" }}>
                {repSummary}
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
          <h3 style={{ marginTop: 0 }}>Portfolio Efficiency Brief</h3>
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
