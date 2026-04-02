"use client";

import React, { useMemo, useState } from "react";

function formatMoney(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 20,
        border: "1px solid #e2e8f0",
      }}
    >
      {children}
    </div>
  );
}

export default function Page() {
  const [spend, setSpend] = useState(300000);
  const [conversions, setConversions] = useState(2400);
  const [priorSpend, setPriorSpend] = useState(250000);
  const [priorConversions, setPriorConversions] = useState(2300);
  const [revPerConv, setRevPerConv] = useState(800);
  const [ltv, setLtv] = useState(4800);

  const [shiftA, setShiftA] = useState(12);
  const [shiftB, setShiftB] = useState(18);

  const calc = (shift: number) => {
    const currentCAC = spend / conversions;
    const priorCAC = priorSpend / priorConversions;

    const improvement = 1 - shift / 100 * 0.8;
    const newCAC = currentCAC * improvement;

    const newConversions = spend / newCAC;
    const lift = (newConversions - conversions) * revPerConv;

    const roas = (newConversions * revPerConv) / spend;
    const ltvToCac = ltv / newCAC;

    return {
      currentCAC,
      priorCAC,
      newCAC,
      lift,
      roas,
      ltvToCac,
    };
  };

  const A = useMemo(() => calc(shiftA), [shiftA, spend, conversions]);
  const B = useMemo(() => calc(shiftB), [shiftB, spend, conversions]);

  return (
    <div style={{ padding: 30, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        CAC Creep Calculator
      </h1>

      {/* INPUTS */}
      <Card>
        <h3>Inputs</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input value={spend} onChange={(e) => setSpend(Number(e.target.value))} placeholder="Spend" />
          <input value={conversions} onChange={(e) => setConversions(Number(e.target.value))} placeholder="Conversions" />

          <input value={priorSpend} onChange={(e) => setPriorSpend(Number(e.target.value))} placeholder="Prior Spend" />
          <input value={priorConversions} onChange={(e) => setPriorConversions(Number(e.target.value))} placeholder="Prior Conversions" />

          <input value={revPerConv} onChange={(e) => setRevPerConv(Number(e.target.value))} placeholder="Revenue per conversion" />
          <input value={ltv} onChange={(e) => setLtv(Number(e.target.value))} placeholder="LTV" />
        </div>

        <div style={{ marginTop: 16 }}>
          <label>Primary Shift (%)</label>
          <input type="number" value={shiftA} onChange={(e) => setShiftA(Number(e.target.value))} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Alternative Shift (%)</label>
          <input type="number" value={shiftB} onChange={(e) => setShiftB(Number(e.target.value))} />
        </div>
      </Card>

      {/* CURRENT STATE */}
      <Card style={{ marginTop: 20 }}>
        <h3>Current State</h3>
        <p>CAC: {formatMoney(A.currentCAC)} (from {formatMoney(A.priorCAC)})</p>
      </Card>

      {/* SCENARIOS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <Card>
          <h3>Primary Scenario ({shiftA}%)</h3>
          <p>CAC: {formatMoney(A.newCAC)}</p>
          <p>ROAS: {A.roas.toFixed(2)}x</p>
          <p>LTV:CAC: {A.ltvToCac.toFixed(1)}:1</p>
          <p>Revenue Lift: {formatMoney(A.lift)}</p>
        </Card>

        <Card>
          <h3>Alternative Scenario ({shiftB}%)</h3>
          <p>CAC: {formatMoney(B.newCAC)}</p>
          <p>ROAS: {B.roas.toFixed(2)}x</p>
          <p>LTV:CAC: {B.ltvToCac.toFixed(1)}:1</p>
          <p>Revenue Lift: {formatMoney(B.lift)}</p>
        </Card>
      </div>

      {/* TALK TRACK */}
      <Card style={{ marginTop: 20 }}>
        <h3>Rep Talk Track</h3>
        <p>
          Your CAC has moved from {formatMoney(A.priorCAC)} to {formatMoney(A.currentCAC)}.
          If we reallocate {shiftA}–{shiftB}% of spend, we model a potential lift of{" "}
          {formatMoney(A.lift)} to {formatMoney(B.lift)} while improving blended efficiency.
        </p>
      </Card>
    </div>
  );
}
