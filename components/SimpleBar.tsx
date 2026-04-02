"use client";

import React from "react";

export default function SimpleBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 14,
          color: "#334155",
          gap: 12,
        }}
      >
        <span>{label}</span>
        <span>{Math.round(value).toLocaleString()}</span>
      </div>
      <div
        style={{
          height: 12,
          background: "#e2e8f0",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#0f172a",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}
