import {
  IdToken,
  IGetTokenSilentlyOptions,
  IGetTokenSilentlyVerboseResponse,
  ILogoutOptions,
  IRedirectLoginOptions,
  IRedirectLoginResult,
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
 * Auth0 SDK for Single Page Applications using [Authorization Code Grant Flow with PKCE](https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce).
 */
export declare class IGovLoginContextInterface<
  TUser extends IUser = IUser
> extends IAuthState<TUser> {
  private readonly transactionManager;
  private readonly domainUrl;
  private readonly tokenIssuer;
  private readonly scope;
  private readonly sessionCheckExpiryDays;
  private readonly options;
  private readonly userCache;
  private worker?;
  private readonly defaultOptions;
  constructor(options: IGovLoginContextInterfaceOptions);
  private _url;
  private _authorizeUrl;
  private _verifyIdToken;
  private _processOrgHint;
  private _prepareAuthorizeUrl;

  /**
   * ```js
   * const user = await auth0.getUser();
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
   * const claims = await auth0.getIdTokenClaims();
   * ```
   *
   * Returns all claims from the id_token if available.
   */
  getIdTokenClaims(): Promise<IdToken | undefined>;
  /**
   * ```js
   * await auth0.loginWithRedirect(options);
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
   * responses from Auth0. If the response is successful, results
   * will be valid according to their expiration times.
   */
  handleRedirectCallback<TAppState = any>(
    url?: string
  ): Promise<RedirectLoginResult<TAppState>>;
  /**
   * ```js
   * await auth0.checkSession();
   * ```
   *
   * Check if the user is logged in using `getTokenSilently`. The difference
   * with `getTokenSilently` is that this doesn't return a token, but it will
   * pre-fill the token cache.
   *
   * This method also heeds the `auth0.{clientId}.is.authenticated` cookie, as an optimization
   *  to prevent calling Auth0 unnecessarily. If the cookie is not present because
   * there was no previous login (or it has expired) then tokens will not be refreshed.
   *
   * It should be used for silently logging in the user when you instantiate the
   * `Auth0Client` constructor. You should not need this if you are using the
   * `createAuth0Client` factory.
   *
   * **Note:** the cookie **may not** be present if running an app using a private tab, as some
   * browsers clear JS cookie data and local storage when the tab or page is closed, or on page reload. This effectively
   * means that `checkSession` could silently return without authenticating the user on page refresh when
   * using a private tab, despite having previously logged in. As a workaround, use `getTokenSilently` instead
   * and handle the possible `login_required` error [as shown in the readme](https://github.com/auth0/auth0-spa-js#creating-the-client).
   *
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
  private _getTokenSilently;
  /**
   * ```js
   * const isAuthenticated = await auth0.isAuthenticated();
   * ```
   *
   * Returns `true` if there's valid information stored,
   * otherwise returns `false`.
   *
   */
  isAuthenticated(): Promise<boolean>;
  /**
   * ```js
   * await auth0.buildLogoutUrl(options);
   * ```
   *
   * Builds a URL to the logout endpoint using the parameters provided as arguments.
   * @param options
   */
  private _buildLogoutUrl;
  /**
   * ```js
   * await auth0.logout(options);
   * ```
   *
   * Clears the application session and performs a redirect to `/v2/logout`, using
   * the parameters provided as arguments, to clear the Auth0 session.
   *
   * If the `federated` option is specified it also clears the Identity Provider session.
   * [Read more about how Logout works at Auth0](https://auth0.com/docs/logout).
   *
   * @param options
   */
  logout(options?: LogoutOptions): Promise<void>;
  private _getTokenFromIFrame;
  private _getTokenUsingRefreshToken;
  private _saveEntryInCache;
  private _getIdTokenFromCache;
  private _getEntryFromCache;
  /**
   * Releases any lock acquired by the current page that's not released yet
   *
   * Get's called on the `pagehide` event.
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
   */
  private _releaseLockOnPageHide;
  private _requestToken;
}
