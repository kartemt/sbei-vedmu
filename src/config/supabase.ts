/**
 * Supabase public config.
 *
 * The anon key is intentionally public — it is safe to expose in client code.
 * Row-Level Security on the `game_contacts` table allows anon to INSERT only.
 * SELECT is blocked for anon by RLS; only the service_role key (stored
 * server-side on Beget) can read data.
 */
export const SUPABASE_URL = "https://mjrutipusamijyxsgtyx.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcnV0aXB1c2FtaWp5eHNndHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTgxOTYsImV4cCI6MjA5MTU5NDE5Nn0.giTgGyapNn5vT3nEOLjcXHvqTWozYiH4wfUPOEbSFg4";
