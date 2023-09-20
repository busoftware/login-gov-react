/** Vendors */
import axios from "axios";
import { useEffect, useState } from "react";

/** Hooks */
import useStorage from "./useStorage";

/** Help */
import {
  buildQueryString,
  generateCodeVerifier,
  generateCodeChallengeFromVerifier,
  generateRandomString,
} from "../components/utils";

/** Enums */
import { AsyncStorageKey, AuthType } from "../types";

/** Types */
import type {
  IAuthorizationParams,
  IAuthState,
  IdToken,
  IGetTokenSilentlyVerboseResponse,
  IGovLoginContextInterface,
  IGovLoginProviderOptions,
  ILogoutOptions,
  IRedirectLoginOptions,
  IUser,
} from "../types";

const useLogin = function (
  opts: IGovLoginProviderOptions
): IGovLoginContextInterface {
  const [authState, setAuthState] = useState<IAuthState>({
    error: null,
    isAuthenticated: false,
    isLoading: true,
    user: {},
  });

  const [user, setUser] = useState<IUser>({});
  const storage = useStorage();

  const _buildAuthorizeUrl = async (
    opts: IGovLoginProviderOptions
  ): Promise<string> => {
    const {
      acr_values = "http://idmanagement.gov/ns/assurance/ial/1",
      auth_type = AuthType.PKCE,
      client_id,
      domain = "https://idp.int.identitysandbox.gov",
      locale = "en",
      prompt = "select_account",
      redirect_uri = window.location.href,
      response_type = "code",
      scope = "profile",
      verified_within = "14d",
    } = opts.authorizationParams;

    /** Step . Generate code_challenge and state to Use on Callback for PKCE verification */
    const code_verifier = await generateCodeVerifier();
    const code_challenge = await generateCodeChallengeFromVerifier(
      code_verifier
    );
    const code_challenge_method = "S256";
    const nonce = generateRandomString(22);
    const state = generateRandomString(22);

    await storage.mergeItem({
      key: AsyncStorageKey.Auth,
      value: { auth_type, code_challenge, code_verifier, nonce, state },
    });

    const extras =
      auth_type === AuthType.PKCE
        ? { code_challenge, code_challenge_method }
        : {};

    return `${domain}/openid_connect/authorize?${buildQueryString({
      acr_values,
      client_id,
      nonce,
      prompt,
      redirect_uri,
      response_type,
      scope,
      state,
      ...extras,
    })}`;
  };

  const _buildTokenUrl = async function (
    opts: IAuthorizationParams
  ): Promise<string> {
    const {
      client_assertion,
      client_assertion_type = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      code,
      code_verifier = "",
      domain = "https://idp.int.identitysandbox.gov",
      grant_type = "authorization_code",
    } = opts;

    const extras =
      auth_type === AuthType.PrivateJWT
        ? { client_assertion, client_assertion_type }
        : { code_verifier };

    return `${domain}/api/openid_connect/token?${buildQueryString({
      ...extras,
      code,
      grant_type,
    })}`;
  };

  const _buildUserInfoUrl = async (
    opts: IAuthorizationParams
  ): Promise<string> => {
    return `${opts.domain}/api/openid_connect/userinfo`;
  };

  const _buildLogoutUrl = async function (opts): Promise<string> {
    /** Step . Generate State to Use on Callback */
    const state = await generateRandomHash(22);
    await storage.mergeItem({ key: AsyncStorageKey.Auth, value: { state } });

    const { client_id, domain, post_logout_redirect_uri } = opts;

    window.location.href = `${domain}/openid_connect/logout?${buildQueryString({
      client_id,
      post_logout_redirect_uri,
      state,
    })}`;
  };

  const checkSession = async function (): Promise<void> {
    console.log("Checking session...");
    const response = await storage.getItem({ key: AsyncStorageKey.Auth });
    console.log(response);
    if (response) {
      return {
        id_token,
        access_token,
        ...(oauthTokenScope ? { scope: oauthTokenScope } : null),
        expires_in,
      };
    } else {
      await _buildAuthorizeUrl(opts).then(axios.get);
    }
  };

  const getIdTokenClaims = async function (): Promise<IdToken | undefined> {
    return "";
  };

  const getTokenSilently = async function (
    options: IGetTokenSilentlyOptions & { detailedResponse: true }
  ): Promise<IGetTokenSilentlyVerboseResponse | string> {
    return "";
  };

  const getUser = async function (): Promise<IUser> {
    return {} as IUser;
  };

  const handleRedirectCallback = async function <TAppState = any>(
    search = window.location.search
  ): Promise<RedirectLoginResult<TAppState>> {
    try {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      const state = params.get("state");
      return { appState };
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithRedirect = async function <TAppState>(
    options?: IRedirectLoginOptions<TAppState>
  ): Promise<void> {
    return "";
  };

  const logout = async function (options?: ILogoutOptions): Promise<void> {
    console.log("Im loging out...");
  };

  return {
    ...authState,
    checkSession,
    getIdTokenClaims,
    getTokenSilently,
    getUser,
    handleRedirectCallback,
    loginWithRedirect,
    logout,
    user,
  };
};

export default useLogin;
