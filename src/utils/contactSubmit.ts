/**
 * Sends a contact to Supabase game_contacts table.
 *
 * Uses the anon key — RLS allows INSERT for anon, SELECT is blocked.
 * No contact data touches localStorage.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { sanitizeContact } from "./sanitize";

export type SubmitResult = "ok" | "empty" | "error";
export type ContactSource = "gate" | "final";

export async function submitContact(raw: string, source: ContactSource): Promise<SubmitResult> {
  const value = sanitizeContact(raw);
  if (!value) return "empty";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/game_contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ value, source }),
    });

    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
