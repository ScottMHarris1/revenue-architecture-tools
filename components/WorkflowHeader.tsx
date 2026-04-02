"use client";

import React from "react";

type Step = {
  number: string;
  title: string;
  description: string;
};

export default function WorkflowHeader() {
  const steps: Step[] = [
    {
      number: "1",
      title: "Diagnose",
      description: "Capture CAC movement, current mix, and benchmark context.",
    },
    {
      number: "2",
      title: "Model",
      description: "Compare primary and alternative reallocation scenarios.",
    },
    {
      number: "3",
      title: "Recommend",
      description: "Identify the stronger scenario and explain why it wins.",
    },
    {
      number: "4",
      title: "Export",
      description: "Copy the summary, generate the brief, or print the output.",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 14,
        marginBottom: 20,
      }}
    >
      {steps.map((step) => (
        <div
          key={step.number}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {step.number}
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {step.title}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#475569",
            }}
          >
            {step.description}
          </div>
        </div>
      ))}
    </div>
  );
}
