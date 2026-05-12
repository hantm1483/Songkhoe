/**
 * Data service for fetching data from internal API routes
 * These in turn query Supabase
 */

import type { GlucoseLog } from "./supabase/database.types";

export interface GlucoseLogResponse {
  logs: GlucoseLog[];
  count: number;
}

export async function fetchGlucoseLogs(limit = 50, offset = 0): Promise<GlucoseLog[]> {
  const res = await fetch(`/api/glucose?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch glucose logs");
  const data = await res.json();
  return data.data?.logs || [];
}

export async function createGlucoseLog(log: {
  value: number;
  timing?: string;
  notes?: string;
  measuredAt?: string;
}): Promise<GlucoseLog> {
  const res = await fetch("/api/glucose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error("Failed to create glucose log");
  const data = await res.json();
  return data.data;
}

export async function deleteGlucoseLog(id: string): Promise<void> {
  const res = await fetch(`/api/glucose/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete glucose log");
}