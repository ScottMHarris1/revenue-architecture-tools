"use client";

import React from "react";

type InspectionItem = {
  title: string;
  question: string;
  goodLooksLike: string;
};

export default function ManagerInspectionPanel({
  items,
}: {
  items: InspectionItem[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
      }}
    >
      {items.map((item, idx) => (
        <div
          key={`${item.title}-${idx}`}
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
            {item.title}
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            Manager question
          </div>
          <div style={{ color: "#334155", lineHeight: 1.7, marginBottom: 12 }}>
            {item.question}
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            What good looks like
          </div>
          <div style={{ color: "#334155", lineHeight: 1.7 }}>
            {item.goodLooksLike}
          </div>
        </div>
      ))}
    </div>
  );
}
