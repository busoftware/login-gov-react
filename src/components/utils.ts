import { OAuthError } from "./errors";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

function _dec2hex(dec) {
  return dec.toString(16).padStart(2, "0");
}

export const buildQueryString = (searchParams: IStringObject): string => {
  return Object.keys(searchParams)
    .filter((key: string) => !!searchParams[key])
    .map((key: string) => `${key}=${searchParams[key]}`)
    .join("&");
};

export const generateRandomHash = async (size?: number): Promise<string> => {
  const encoder = new TextEncoder();
  const arr = new Uint8Array((size || 40) / 2);
  crypto.getRandomValues(arr);
  const data = encoder.encode(Array.from(arr, _dec2hex).join(""));
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64Digest = btoa(digest);
  // you can extract this replacing code to a function
  return base64Digest.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

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
