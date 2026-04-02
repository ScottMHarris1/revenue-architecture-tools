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
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: "#64748b",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
      {subtext ? (
        <div
          style={{
            marginTop: 6,
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
