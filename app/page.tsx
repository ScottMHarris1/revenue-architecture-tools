"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import MetricCard from "../components/MetricCard";
import { calculateScenario } from "../lib/calculations";
import { formatMoney, formatROAS, formatRatio } from "../lib/format";

export default function Page() {
  const [spend, setSpend] = useState(300000);
  const [conversions, setConversions] = useState(2400);
  const [priorSpend, setPriorSpend] = useState(250000);
  const [priorConversions, setPriorConversions] = useState(2300);
  const [revPerConv, setRevPerConv] = useState(800);
  const [ltv, setLtv] = useState(4800);

  const [shiftA, setShiftA] = useState(12);
  const [shiftB, setShiftB] = useState(18);

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
      }),
    [spend, conversions, priorSpend, priorConversions, revPerConv, ltv, shiftA]
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
      }),
    [spend, conversions, priorSpend, priorConversions, revPerConv, ltv, shiftB]
  );

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
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        CAC Creep Calculator (V2)
      </h1>

      <Card>
        <h3 style={{ marginTop: 0 }}>Inputs</h3>

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
          label="Primary ROAS"
          value={formatROAS(A.roas)}
          subtext={`${shiftA}% shift scenario`}
        />
        <MetricCard
          label="Primary LTV:CAC"
          value={formatRatio(A.ltvToCac)}
          subtext={`LTV ${formatMoney(ltv)}`}
        />
        <MetricCard
          label="Modeled Revenue Lift"
          value={formatMoney(A.lift)}
          subtext="Primary scenario"
        />
      </div>

      <Card style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Current System</h3>
        <p>
          CAC: {formatMoney(A.priorCAC)} → {formatMoney(A.currentCAC)}
        </p>
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
        <h3 style={{ marginTop: 0 }}>Decision View</h3>
        <p>
          {shiftA}% shift → {formatMoney(A.lift)} | {shiftB}% shift →{" "}
          {formatMoney(B.lift)}
        </p>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Rep Talk Track</h3>
        <p>
          CAC has moved from {formatMoney(A.priorCAC)} to {formatMoney(A.currentCAC)}.
          A controlled {shiftA}-{shiftB}% reallocation could generate {formatMoney(A.lift)}–
          {formatMoney(B.lift)} in incremental revenue while improving blended efficiency.
        </p>
      </Card>
    </div>
  );
}
