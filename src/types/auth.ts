import {
  IdToken,
  IGetTokenSilentlyOptions,
  IRedirectLoginOptions,
  IUser,
} from ".";

export interface IAuthState<TUser> {
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: TUser;
}

export interface IGetTokenSilentlyVerboseResponse {
  access_token: string;
  id_token: string;
}

export interface IGovLoginContextInterfaceOptions {}

/**
 * Login.gov SDK for Single Page Applications using [Authorization Code Grant Flow with PKCE](https://developers.login.gov/oidc/#token).
 */
export declare class IGovLoginContextInterface<
  TUser extends IUser = IUser
> extends IAuthState<TUser> {
  private readonly scope;
  private readonly options;
  private readonly defaultOptions;
  constructor(options: IGovLoginContextInterfaceOptions);

  /**
   * ```js
   * const user = await client.getUser();
   * ```
   *
   * Returns the user information if available (decoded
   * from the `id_token`).
   *
   * @typeparam TUser The type to return, has to extend {@link IUser}.
   */
  getUser<TUser extends IUser>(): Promise<TUser | undefined>;
  /**
   * ```js
   * const claims = await client.getIdTokenClaims();
   * ```
   *
   * Returns all claims from the id_token if available.
   */
  getIdTokenClaims(): Promise<IdToken | undefined>;
  /**
   * ```js
   * await client.loginWithRedirect(options);
   * ```
   *
   * Performs a redirect to `/authorize` using the parameters
   * provided as arguments. Random and secure `state` and `nonce`
   * parameters will be auto-generated.
   *
   * @param options
   */
  loginWithRedirect<TAppState = any>(
    options?: IRedirectLoginOptions<TAppState>
  ): Promise<void>;
  /**
   * After the browser redirects back to the callback page,
   * call `handleRedirectCallback` to handle success and error
   * responses from Login.gov. If the response is successful, results
   * will be valid according to their expiration times.
   */
  handleRedirectCallback<TAppState = any>(
    url?: string
  ): Promise<RedirectLoginResult<TAppState>>;
  /**
   * ```js
   * await client.checkSession();
   * ```
   *
   * Check if the user is logged in using `getTokenSilently`. The difference
   * with `getTokenSilently` is that this doesn't return a token, but it will
   * pre-fill the token cache.
   * @param options
   */
  checkSession(options?: IGetTokenSilentlyOptions): Promise<void>;
  /**
   * Fetches a new access token and returns the response from the /oauth/token endpoint, omitting the refresh token.
   *
   * @param options
   */
  getTokenSilently(
    options: IGetTokenSilentlyOptions & {
      detailedResponse: true;
    }
  ): Promise<IGetTokenSilentlyVerboseResponse>;
  /**
   * Fetches a new access token and returns it.
   *
   * @param options
   */
  getTokenSilently(options?: IGetTokenSilentlyOptions): Promise<string>;
  /**
   * ```js
   * const isAuthenticated = await client.isAuthenticated();
   * ```
   *
   * Returns `true` if there's valid information stored,
   * otherwise returns `false`.
   *
   */
  isAuthenticated(): Promise<boolean>;
  /**
   * ```js
   * await client.logout(options);
   * ```
   *
   * @param options
   */
  logout(options?: ILogoutOptions): Promise<void>;
}

export interface ILogoutOptions {
  client_id: string;
  post_logout_redirect_uri?: string;
  state?: string;
}
