import { supabase } from "./supabase";

const CODE_TTL_MINUTES = Number(process.env.LOGIN_CODE_TTL ?? 10);

interface VerificationRecord {
  email: string;
  code: string;
  expires_at: string | null;
}

export async function saveVerificationCode(email: string, code: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("auth_verifications")
    .upsert({ email, code, expires_at: expiresAt }, { onConflict: "email" });

  if (error) {
    console.error("[Auth] Failed to persist verification code to Supabase", error);
    return false;
  }

  return true;
}

export async function fetchVerificationCode(email: string): Promise<VerificationRecord | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("auth_verifications")
    .select("email, code, expires_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("[Auth] Failed to fetch verification code from Supabase", error);
    return null;
  }

  return data ?? null;
}

export async function deleteVerificationCode(email: string): Promise<void> {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("auth_verifications")
    .delete()
    .eq("email", email);

  if (error) {
    console.error("[Auth] Failed to delete verification code from Supabase", error);
  }
}

export function isCodeExpired(record: VerificationRecord | null): boolean {
  if (!record?.expires_at) {
    return true;
  }

  const expiresAt = new Date(record.expires_at).getTime();
  return Date.now() > expiresAt;
}
