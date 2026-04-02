"use client";

import React, { useMemo, useState } from "react";

function formatMoney(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 20,
        border: "1px solid #e2e8f0",
        ...style,
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
    const currentCAC = spend / Math.max(conversions, 1);
    const priorCAC = priorSpend / Math.max(priorConversions, 1);

    const improvement = 1 - (shift / 100) * 0.8;
    const newCAC = currentCAC * improvement;

    const newConversions = spend / Math.max(newCAC, 1);
    const lift = (newConversions - conversions) * revPerConv;

    const roas = (newConversions * revPerConv) / Math.max(spend, 1);
    const ltvToCac = ltv / Math.max(newCAC, 1);

    return {
      currentCAC,
      priorCAC,
      newCAC,
      lift,
      roas,
      ltvToCac,
    };
  };

  const A = useMemo(
    () => calc(shiftA),
    [shiftA, spend, conversions, priorSpend, priorConversions, revPerConv, ltv]
  );
  const B = useMemo(
    () => calc(shiftB),
    [shiftB, spend, conversions, priorSpend, priorConversions, revPerConv, ltv]
  );

  return (
    <div style={{ padding: 30, maxWidth: 1100, margin: "0 auto", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>CAC Creep Calculator</h1>

      <Card>
        <h3 style={{ marginTop: 0 }}>Inputs</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input
            type="number"
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            placeholder="Spend"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />
          <input
            type="number"
            value={conversions}
            onChange={(e) => setConversions(Number(e.target.value))}
            placeholder="Conversions"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />

          <input
            type="number"
            value={priorSpend}
            onChange={(e) => setPriorSpend(Number(e.target.value))}
            placeholder="Prior Spend"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />
          <input
            type="number"
            value={priorConversions}
            onChange={(e) => setPriorConversions(Number(e.target.value))}
            placeholder="Prior Conversions"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />

          <input
            type="number"
            value={revPerConv}
            onChange={(e) => setRevPerConv(Number(e.target.value))}
            placeholder="Revenue per conversion"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />
          <input
            type="number"
            value={ltv}
            onChange={(e) => setLtv(Number(e.target.value))}
            placeholder="LTV"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Primary Shift (%)</label>
            <input
              type="number"
              value={shiftA}
              onChange={(e) => setShiftA(Number(e.target.value))}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Alternative Shift (%)</label>
            <input
              type="number"
              value={shiftB}
              onChange={(e) => setShiftB(Number(e.target.value))}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1" }}
            />
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Current State</h3>
        <p style={{ marginBottom: 0 }}>
          CAC: {formatMoney(A.currentCAC)} (from {formatMoney(A.priorCAC)})
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
          <p>ROAS: {A.roas.toFixed(2)}x</p>
          <p>LTV:CAC: {A.ltvToCac.toFixed(1)}:1</p>
          <p style={{ marginBottom: 0 }}>Modeled revenue lift: {formatMoney(A.lift)}</p>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>Alternative Scenario ({shiftB}%)</h3>
          <p>CAC: {formatMoney(B.newCAC)}</p>
          <p>ROAS: {B.roas.toFixed(2)}x</p>
          <p>LTV:CAC: {B.ltvToCac.toFixed(1)}:1</p>
          <p style={{ marginBottom: 0 }}>Modeled revenue lift: {formatMoney(B.lift)}</p>
        </Card>
      </div>

      <Card style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Scenario Comparison</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <h4 style={{ marginTop: 0 }}>Primary</h4>
            <p>Shift: {shiftA}%</p>
            <p>CAC: {formatMoney(A.newCAC)}</p>
            <p>ROAS: {A.roas.toFixed(2)}x</p>
            <p>LTV:CAC: {A.ltvToCac.toFixed(1)}:1</p>
            <p style={{ marginBottom: 0 }}>Lift: {formatMoney(A.lift)}</p>
          </div>

          <div>
            <h4 style={{ marginTop: 0 }}>Alternative</h4>
            <p>Shift: {shiftB}%</p>
            <p>CAC: {formatMoney(B.newCAC)}</p>
            <p>ROAS: {B.roas.toFixed(2)}x</p>
            <p>LTV:CAC: {B.ltvToCac.toFixed(1)}:1</p>
            <p style={{ marginBottom: 0 }}>Lift: {formatMoney(B.lift)}</p>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Rep Talk Track</h3>
        <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
          Your CAC has moved from {formatMoney(A.priorCAC)} to {formatMoney(A.currentCAC)}.
          If we reallocate {shiftA}% to {shiftB}% of spend, we model a potential revenue lift of{" "}
          {formatMoney(A.lift)} to {formatMoney(B.lift)} while improving blended efficiency and
          strengthening LTV:CAC.
        </p>
      </Card>
    </div>
  );
}
