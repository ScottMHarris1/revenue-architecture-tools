"use client";

import React from "react";

export default function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 12,
        padding: "10px 14px",
        border: "1px solid #cbd5e1",
        background: "#ffffff",
        color: "#0f172a",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
