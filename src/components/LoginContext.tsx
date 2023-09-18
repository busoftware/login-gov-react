import React, { createContext } from "react";

/** Types */
import type { AuthState } from "../types";

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};

/**
 * @ignore
 */
const stub = (): never => {
  throw new Error("You forgot to wrap your component in <GovLoginProvider>.");
};

/**
 * @ignore
 */
export const initialContext = {
  ...initialAuthState,
  buildAuthorizeUrl: stub,
  buildLogoutUrl: stub,
  getAccessTokenSilently: stub,
  getIdTokenClaims: stub,
  loginWithRedirect: stub,
  logout: stub,
  handleRedirectCallback: stub,
};

/**
 * The Auth0 Context
 */
const Auth0Context =
  createContext<IGovLoginContextInterface<TUser>>(initialContext);

export default Auth0Context;
