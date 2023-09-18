/** Vendors */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

/** Hooks */
import useLogin from "../hooks/useLogin";

/** Components */
import GovLoginContext from "./LoginContext";

/** Help */
import { reducer } from "./reducer";
import { hasAuthParams, loginError, tokenError } from "./utils";

/** Types */
import type { IGovLoginProviderOptions, IUser } from "../types";

/**
 * @ignore
 */
const defaultOnRedirectCallback = (appState?: AppState): void => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

const initialAuthState: IAuthState = {
  isAuthenticated: false,
  isLoading: false,
};

/**
 * Provides the GovLoginContext to its child components.
 */
const GovLoginProvider = (opts: IGovLoginProviderOptions): JSX.Element => {
  const {
    /** IGovLoginProviderOptions */
    children,
    context = GovLoginContext,
    onRedirectCallback = defaultOnRedirectCallback,
    skipRedirectCallback,
    /** IAuthorizationParams */
    ...clientOpts
  } = opts;

  /** Local State Manager */
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const didInitialise = useRef(false);

  /** Gov Login Client Hook */
  const client = useLogin(clientOpts);

  useEffect(() => {
    if (didInitialise.current) {
      return;
    }
    didInitialise.current = true;
    (async (): Promise<void> => {
      try {
        console.log("here 1");
        let user: IUser | undefined;
        if (hasAuthParams() && !skipRedirectCallback) {
          console.log("here 2");
          const { appState } = await client.handleRedirectCallback();
          user = await client.getUser();
          onRedirectCallback(appState, user);
        } else {
          await client.checkSession();
          user = await client.getUser();
        }
        dispatch({ type: "INITIALISED", user });
      } catch (error) {
        dispatch({ type: "ERROR", error: loginError(error) });
      }
    })();
  }, [client, onRedirectCallback, skipRedirectCallback]);

  const loginWithRedirect = useCallback(
    (opts?: IRedirectLoginOptions): Promise<void> => {
      deprecateRedirectUri(opts);

      return client.loginWithRedirect(opts);
    },
    [client]
  );

  const logout = useCallback(
    async (opts: ILogoutOptions = {}): Promise<void> => {
      await client.logout(opts);
      if (opts.openUrl || opts.openUrl === false) {
        dispatch({ type: "LOGOUT" });
      }
    },
    [client]
  );

  const getAccessTokenSilently = useCallback(
    async (opts?: GetTokenSilentlyOptions): Promise<any> => {
      let token;
      try {
        token = await client.getTokenSilently(opts);
      } catch (error) {
        throw tokenError(error);
      } finally {
        dispatch({
          type: "GET_ACCESS_TOKEN_COMPLETE",
          user: await client.getUser(),
        });
      }
      return token;
    },
    [client]
  );

  const getIdTokenClaims = useCallback(
    () => client.getIdTokenClaims(),
    [client]
  );

  const handleRedirectCallback = useCallback(
    async (url?: string): Promise<IRedirectLoginResult> => {
      try {
        return await client.handleRedirectCallback(url);
      } catch (error) {
        throw tokenError(error);
      } finally {
        dispatch({
          type: "HANDLE_REDIRECT_COMPLETE",
          user: await client.getUser(),
        });
      }
    },
    [client]
  );

  const contextValue = useMemo<ILoginContextInterface<IUser>>(() => {
    return {
      ...state,
      getAccessTokenSilently,
      getIdTokenClaims,
      loginWithRedirect,
      logout,
      handleRedirectCallback,
    };
  }, [
    state,
    getAccessTokenSilently,
    getIdTokenClaims,
    loginWithRedirect,
    logout,
    handleRedirectCallback,
  ]);

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export default GovLoginProvider;
