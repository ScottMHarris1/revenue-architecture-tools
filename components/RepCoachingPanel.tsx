"use client";

import React from "react";

type Objection = {
  objection: string;
  response: string;
};

export default function RepCoachingPanel({
  strongAnswer,
  objections,
}: {
  strongAnswer: string;
  objections: Objection[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#64748b",
            marginBottom: 8,
          }}
        >
          What a strong answer sounds like
        </div>
        <div style={{ color: "#334155", lineHeight: 1.7 }}>{strongAnswer}</div>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#64748b",
            marginBottom: 10,
          }}
        >
          Objection handling
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {objections.map((item, idx) => (
            <div
              key={`${item.objection}-${idx}`}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 14,
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                Objection: {item.objection}
              </div>
              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
                <strong>Response:</strong> {item.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
