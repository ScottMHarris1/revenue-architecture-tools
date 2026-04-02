"use client";

import React from "react";

export default function MixShiftCard({
  title,
  capture,
  discovery,
}: {
  title: string;
  capture: number;
  discovery: number;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          height: 18,
          width: "100%",
          borderRadius: 999,
          overflow: "hidden",
          display: "flex",
          background: "#e2e8f0",
        }}
      >
        <div style={{ width: `${capture}%`, background: "#0f172a" }} />
        <div style={{ width: `${discovery}%`, background: "#94a3b8" }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 10,
          fontSize: 13,
          color: "#334155",
        }}
      >
        <div>Capture: {capture}%</div>
        <div>Discovery: {discovery}%</div>
      </div>
    </div>
  );
}
