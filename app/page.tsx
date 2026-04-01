"use client";

import { useState } from "react";

export default function Home() {
  const [view, setView] = useState("cac");

  return (
    <div style={{ padding: 40 }}>
      <h1>Revenue Architecture Tools</h1>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setView("cac")}>
          CAC Creep Diagnostic
        </button>

        <button onClick={() => setView("fragility")} style={{ marginLeft: 10 }}>
          Revenue Fragility Lite
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        {view === "cac" ? (
          <div>
            <h2>CAC Creep Diagnostic</h2>
            <p>
              Diagnose whether CAC is rising due to portfolio saturation or pipeline inefficiency.
            </p>
          </div>
        ) : (
          <div>
            <h2>Revenue Fragility Lite</h2>
            <p>
              Score structural revenue risk and identify fragility across your system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
