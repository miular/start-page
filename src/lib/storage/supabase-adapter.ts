import { supabase } from "../supabase/client";
import { createStorageAdapter, type StorageAdapter } from "./adapter";

export function createSupabaseAdapter(): StorageAdapter {
  const local = createStorageAdapter();
  let userId: string | null = null;
  let ready = false;
  let initPromise: Promise<void> | null = null;

  async function ensureSession() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        userId = sessionData.session.user.id;
        ready = true;
        return;
      }
      const { data: anonData } = await supabase.auth.signInAnonymously();
      if (anonData.session) {
        userId = anonData.session.user.id;
        ready = true;
      }
    })();
    return initPromise;
  }

  async function pullFromRemote() {
    await ensureSession();
    if (!ready || !userId) return;
    const { data } = await supabase
      .from("user_data")
      .select("key, value")
      .eq("user_id", userId);
    if (data) {
      for (const row of data) {
        local.set(row.key as string, row.value);
      }
    }
  }

  ensureSession().then(() => pullFromRemote());

  return {
    get<T>(key: string): T | null {
      return local.get<T>(key);
    },
    set<T>(key: string, value: T): void {
      local.set(key, value);
      ensureSession().then(() => {
        if (!ready || !userId) return;
        supabase.from("user_data").upsert(
          { user_id: userId, key, value },
          { onConflict: "user_id, key" },
        );
      });
    },
    remove(key: string): void {
      local.remove(key);
      ensureSession().then(() => {
        if (!ready || !userId) return;
        supabase.from("user_data").delete().eq("user_id", userId).eq("key", key);
      });
    },
  };
}