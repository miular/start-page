import { randomUUID } from "node:crypto";
import { ALLOWED_ORIGINS } from "./config.mjs";

export function generateToken() {
  return randomUUID();
}

export function validateOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((re) => re.test(origin));
}

export function validateToken(supplied, stored) {
  if (!supplied || !stored) return false;
  if (supplied.length !== stored.length) return false;
  let mismatch = 0;
  for (let i = 0; i < supplied.length; i++) {
    mismatch |= supplied.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return mismatch === 0;
}