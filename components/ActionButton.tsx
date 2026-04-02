"use client";

import React from "react";

export default function ActionButton({
  label,
  onClick,
  kind = "default",
}: {
  label: string;
  onClick: () => void;
  kind?: "default" | "primary";
}) {
  const isPrimary = kind === "primary";

  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 12,
        padding: "10px 14px",
        border: isPrimary ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: isPrimary ? "#0f172a" : "#ffffff",
        color: isPrimary ? "#ffffff" : "#0f172a",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {label}
    </button>
  );
}
