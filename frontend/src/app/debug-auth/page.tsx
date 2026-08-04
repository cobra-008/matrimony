"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugAuthPage() {
  const [mobile, setMobile] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const runDiagnostic = async () => {
    setLog([]);
    setRunning(true);
    addLog(`Starting diagnosis for mobile: ${mobile}`);

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, name, mobile, auth_email")
      .eq("mobile", mobile)
      .single();

    if (profileErr || !profile) {
      addLog(`NO PROFILE found in database for mobile ${mobile}`);
      addLog(`Error: ${profileErr?.message || "No data"}`);
      setRunning(false);
      return;
    }

    addLog(`PROFILE FOUND: ${profile.name} (ID: ${profile.id.slice(0, 8)}...)`);
    addLog(`auth_email field: ${profile.auth_email || "(empty)"}`);

    const emails = [
      `${mobile}@etm.app`,
      ...Array.from({ length: 19 }, (_, i) => `${mobile}_${i + 2}@etm.app`),
    ];

    addLog(`Probing Supabase auth credentials...`);
    let found = false;

    for (const email of emails) {
      const suffix = email.match(/_([0-9]+)@/)?.[1];
      const password = suffix ? `ETM_${mobile}_${suffix}_2024` : `ETM_${mobile}_2024`;
      addLog(`Trying: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.user) {
        if (data.user.id === profile.id) {
          addLog(`SUCCESS! Working email: ${email}`);
          found = true;
          await supabase.auth.signOut();
          break;
        } else {
          addLog(`ID MISMATCH! Auth: ${data.user.id.slice(0,8)} vs Profile: ${profile.id.slice(0,8)}`);
          await supabase.auth.signOut();
        }
      } else {
        addLog(`Failed: ${error?.message || "unknown"}`);
      }
    }

    if (!found) {
      addLog(`RESULT: No auth credentials found - account needs re-registration`);
    } else {
      addLog(`RESULT: Account auth works correctly`);
    }

    setRunning(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Auth Diagnostic Tool</h1>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input type="tel" placeholder="10-digit mobile" value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} maxLength={10}
          style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", fontFamily: "monospace" }} />
        <button onClick={runDiagnostic} disabled={running || mobile.length !== 10}
          style={{ padding: "0.5rem 1rem", background: "#6B1A2A", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {running ? "Running..." : "Diagnose"}
        </button>
      </div>
      <div style={{ background: "#1a1a1a", color: "#ccc", padding: "1rem", borderRadius: "6px", fontSize: "0.8rem", whiteSpace: "pre-wrap", minHeight: "100px" }}>
        {log.join("\n") || "Enter mobile number and click Diagnose"}
        {running && "\n... running ..."}
      </div>
    </div>
  );
}
