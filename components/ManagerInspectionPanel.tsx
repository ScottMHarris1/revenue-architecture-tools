"use client";

import React from "react";

type InspectionItem = {
  title: string;
  listenFor: string;
  goodLooksLike: string;
  coachingQuestion: string;
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
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 10,
            }}
          >
            {item.title}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 12,
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                Listen for
              </div>
              <div style={{ color: "#334155", lineHeight: 1.7 }}>{item.listenFor}</div>
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 12,
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                What good looks like
              </div>
              <div style={{ color: "#334155", lineHeight: 1.7 }}>{item.goodLooksLike}</div>
            </div>

            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 12,
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                Coaching question
              </div>
              <div style={{ color: "#334155", lineHeight: 1.7 }}>
                {item.coachingQuestion}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
