import { OAuthError } from "./errors";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

function _base64urlencode(a) {
  let str = "";
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function _dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}

function _sha256(plain) {
  // returns promise ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

export const buildQueryString = (searchParams: IStringObject): string => {
  return Object.keys(searchParams)
    .filter((key: string) => !!searchParams[key])
    .map((key: string) => `${key}=${searchParams[key]}`)
    .join("&");
};

export function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, _dec2hex).join("");
}

export async function generateCodeChallengeFromVerifier(v) {
  const hashed = await _sha256(v);
  return _base64urlencode(hashed);
}

export function generateRandomString(size = 22) {
  const array = new Uint32Array(size / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, _dec2hex).join("");
}

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

const normalizeErrorFn =
  (fallbackMessage: string) =>
  (error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    // try to check errors of the following form: {error: string; error_description?: string}
    if (
      error !== null &&
      typeof error === "object" &&
      "error" in error &&
      typeof error.error === "string"
    ) {
      if (
        "error_description" in error &&
        typeof error.error_description === "string"
      ) {
        return new OAuthError(error.error, error.error_description);
      }
      return new OAuthError(error.error);
    }
    return new Error(fallbackMessage);
  };

export const loginError = normalizeErrorFn("Login failed");

export const tokenError = normalizeErrorFn("Get access token failed");
