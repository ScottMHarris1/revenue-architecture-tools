"use client";

import React from "react";

export default function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: "#64748b",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 30,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      {subtext ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.5,
          }}
        >
          {subtext}
        </div>
      ) : null}
    </div>
  );
}
