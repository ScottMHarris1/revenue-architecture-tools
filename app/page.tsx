"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { calculateScenario } from "@/lib/calculations";
import { formatMoney, formatROAS, formatRatio } from "@/lib/format";

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
    <div style={{ padding: 30, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>CAC Creep Calculator (V2)</h1>

      {/* INPUTS */}
      <Card>
        <h3>Inputs</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input value={spend} onChange={(e) => setSpend(Number(e.target.value))} />
          <input value={conversions} onChange={(e) => setConversions(Number(e.target.value))} />

          <input value={priorSpend} onChange={(e) => setPriorSpend(Number(e.target.value))} />
          <input value={priorConversions} onChange={(e) => setPriorConversions(Number(e.target.value))} />

          <input value={revPerConv} onChange={(e) => setRevPerConv(Number(e.target.value))} />
          <input value={ltv} onChange={(e) => setLtv(Number(e.target.value))} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Primary Shift (%)</label>
          <input type="number" value={shiftA} onChange={(e) => setShiftA(Number(e.target.value))} />
        </div>

        <div>
          <label>Alternative Shift (%)</label>
          <input type="number" value={shiftB} onChange={(e) => setShiftB(Number(e.target.value))} />
        </div>
      </Card>

      {/* CURRENT */}
      <Card style={{ marginTop: 20 }}>
        <h3>Current System</h3>
        <p>CAC: {formatMoney(A.currentCAC)} → {formatMoney(A.newCAC)}</p>
      </Card>

      {/* SCENARIOS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <Card>
          <h3>Primary ({shiftA}%)</h3>
          <p>CAC: {formatMoney(A.newCAC)}</p>
          <p>ROAS: {formatROAS(A.roas)}</p>
          <p>LTV:CAC: {formatRatio(A.ltvToCac)}</p>
          <p>Lift: {formatMoney(A.lift)}</p>
        </Card>

        <Card>
          <h3>Alternative ({shiftB}%)</h3>
          <p>CAC: {formatMoney(B.newCAC)}</p>
          <p>ROAS: {formatROAS(B.roas)}</p>
          <p>LTV:CAC: {formatRatio(B.ltvToCac)}</p>
          <p>Lift: {formatMoney(B.lift)}</p>
        </Card>
      </div>

      {/* COMPARISON */}
      <Card style={{ marginTop: 20 }}>
        <h3>Decision View</h3>
        <p>
          {shiftA}% shift → {formatMoney(A.lift)} lift | {shiftB}% shift →{" "}
          {formatMoney(B.lift)} lift
        </p>
      </Card>

      {/* TALK TRACK */}
      <Card style={{ marginTop: 20 }}>
        <h3>Rep Talk Track</h3>
        <p>
          CAC moved from {formatMoney(A.priorCAC)} to {formatMoney(A.currentCAC)}.
          A {shiftA}-{shiftB}% reallocation could generate {formatMoney(A.lift)}–
          {formatMoney(B.lift)} in incremental revenue while improving efficiency.
        </p>
      </Card>
    </div>
  );
}
