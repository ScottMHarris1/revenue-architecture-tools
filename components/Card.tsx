"use client";

import React from "react";

export default function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #e2e8f0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
