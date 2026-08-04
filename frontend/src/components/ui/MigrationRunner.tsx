// src/components/ui/MigrationRunner.tsx
// Client component that triggers the one-time localStorage→Supabase migration
"use client";
import { useEffect } from "react";
import { runMigrationIfNeeded } from "@/lib/migration";
import { supabase } from "@/lib/supabase";

/**
 * Ensures the `auth_email` column exists on the profiles table.
 * Tries calling an RPC (add_auth_email_column) that can be created via SQL Editor.
 * Falls back to a clear console instruction if the RPC doesn't exist yet.
 */
async function ensureAuthEmailColumn() {
  if (typeof window === 'undefined') return;
  const FLAG = 'etm_auth_email_col_checked';
  if (localStorage.getItem(FLAG) === 'ok') return;

  try {
    // Test if auth_email column exists
    const { error } = await supabase.from('profiles').select('auth_email').limit(1);
    if (!error) {
      localStorage.setItem(FLAG, 'ok');
      return;
    }

    // Column missing — try RPC
    if (error.message.toLowerCase().includes('auth_email')) {
      const { error: rpcError } = await supabase.rpc('add_auth_email_column');
      if (!rpcError) {
        console.info('[Schema] auth_email column added via RPC.');
        localStorage.setItem(FLAG, 'ok');
      } else {
        // RPC doesn't exist yet — show clear instruction
        console.warn(
          '%c[ETM Schema Fix Required]%c\n' +
          'Run this SQL in your Supabase SQL Editor to fix login for all accounts:\n\n' +
          'ALTER TABLE public.profiles\n' +
          '  ADD COLUMN IF NOT EXISTS auth_email text;\n\n' +
          'CREATE OR REPLACE FUNCTION public.add_auth_email_column()\n' +
          'RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$\n' +
          'BEGIN\n' +
          '  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_email text;\n' +
          'END;\n' +
          '$$;\n\n' +
          'GRANT EXECUTE ON FUNCTION public.add_auth_email_column() TO anon, authenticated;',
          'color: red; font-weight: bold;', 'color: inherit;'
        );
      }
    }
  } catch {
    // Ignore
  }
}

export default function MigrationRunner() {
  useEffect(() => {
    runMigrationIfNeeded().catch(console.warn);
    ensureAuthEmailColumn().catch(console.warn);
  }, []);
  return null;
}
