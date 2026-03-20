import crypto from "crypto";
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET, SESSION_COOKIE } from "./auth-config";
export { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET, SESSION_COOKIE };
export const SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
};

const toBase64Url = (value: Buffer) =>
  value.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (value: string) =>
  Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");

export function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = toBase64Url(Buffer.from(JSON.stringify(payload)));
  const signature = toBase64Url(crypto.createHmac("sha256", AUTH_SECRET).update(body).digest());
  return `${body}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = toBase64Url(crypto.createHmac("sha256", AUTH_SECRET).update(body).digest());
  const expectedBuf = fromBase64Url(expected);
  const actualBuf = fromBase64Url(signature);
  if (expectedBuf.length !== actualBuf.length) return null;
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64").toString("utf-8")) as SessionPayload;
  if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
