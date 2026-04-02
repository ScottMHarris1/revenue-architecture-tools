"use client";

import React from "react";

type Scenario = {
  shift: number;
  cac: string;
  roas: string;
  ltvToCac: string;
  lift: string;
};

export default function ComparisonTable({
  primary,
  alternative,
}: {
  primary: Scenario;
  alternative: Scenario;
}) {
  const thStyle: React.CSSProperties = {
    textAlign: "left",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748b",
    padding: "12px 14px",
    borderBottom: "1px solid #e2e8f0",
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px",
    borderBottom: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: 14,
    verticalAlign: "top",
  };

  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        background: "#ffffff",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>Primary</th>
            <th style={thStyle}>Alternative</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Shift</td>
            <td style={tdStyle}>{primary.shift}%</td>
            <td style={tdStyle}>{alternative.shift}%</td>
          </tr>
          <tr>
            <td style={tdStyle}>Modeled CAC</td>
            <td style={tdStyle}>{primary.cac}</td>
            <td style={tdStyle}>{alternative.cac}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Modeled ROAS</td>
            <td style={tdStyle}>{primary.roas}</td>
            <td style={tdStyle}>{alternative.roas}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Modeled LTV:CAC</td>
            <td style={tdStyle}>{primary.ltvToCac}</td>
            <td style={tdStyle}>{alternative.ltvToCac}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Modeled Revenue Lift</td>
            <td style={tdStyle}>{primary.lift}</td>
            <td style={tdStyle}>{alternative.lift}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
