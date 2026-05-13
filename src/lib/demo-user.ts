/**
 * Demo Mode - Anonymous device-based user for testing phase
 * Auto-generates a persistent device ID stored in localStorage
 */

const DEMO_UID_KEY = "sk_demo_uid";
const DEMO_COOKIE = "sk_demo_uid";

export function getDemoUid(): string {
  if (typeof window === "undefined") return "";

  let uid = localStorage.getItem(DEMO_UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(DEMO_UID_KEY, uid);
  }
  return uid;
}

export function isDemoUser(userId: string | null | undefined): boolean {
  if (!userId) return true; // no auth = demo mode
  return userId.startsWith("demo-");
}

export function toDemoUserId(id?: string | null): string {
  return id || `demo-${getDemoUid()}`;
}

export function clearDemoUid(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_UID_KEY);
  }
}