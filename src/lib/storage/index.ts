export { createStorageAdapter } from "./adapter";
export type { StorageAdapter } from "./adapter";
import { createSupabaseAdapter } from "./supabase-adapter";

export { createSupabaseAdapter };
export const storage = createSupabaseAdapter();