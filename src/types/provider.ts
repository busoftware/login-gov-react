/** Types */
import type { IAppState, IUser } from ".";

interface IAuthorizationParams {
  authorizationParams: {
    /**
     * Option 1. DOU weakest and the default for IAL1
     * Option 2. LOA1 & LOA3 Deprecated
     * Option 3. IAL1 Two Factor Auth Verified. Checked every 30 days
     * Option 4. IAL2 & Strict & Phishing. Two Factor Auth Verified Every Time. CAC/PIV in addition possibly.
     * Option 5. IAL2 & HSPD12. CAC/PIV Required.
     * Option 5. IAL3 & HSPD12. CAC/PIV Required.
     * */
    acr_values:
      | "urn:gov:gsa:ac:classes:sp:PasswordProtectedTransport:duo"
      | "http://idmanagement.gov/ns/assurance/loa/1"
      | "http://idmanagement.gov/ns/assurance/loa/3"
      | "http://idmanagement.gov/ns/assurance/ial/1"
      | "http://idmanagement.gov/ns/assurance/ial/2"
      | "http://idmanagement.gov/ns/assurance/ial/0"
      | "http://idmanagement.gov/ns/assurance/ial/2?strict=true"
      | "http://idmanagement.gov/ns/assurance/aal/2"
      | "http://idmanagement.gov/ns/assurance/aal/3"
      | "http://idmanagement.gov/ns/assurance/aal/3?hspd12=true"
      | "http://idmanagement.gov/ns/assurance/aal/2?phishing_resistant=true"
      | "http://idmanagement.gov/ns/assurance/aal/2?hspd12=true"
      | string;
    /**
     * Auth Type: Either PKCE or Private Signed Key. Defaults to PKCE.
     */
    auth_type?: AuthType;
    /**
     * The Client ID found on your Application settings page
     */
    client_id: string;
    /**
     * The Login.gov Auth Endpoint. Defaults to Development Environment
     */
    domain: "https://idp.int.identitysandbox.gov" | string;
    /**
     * Language Supported. English, Spanish, French
     */
    locale?: "en" | "es" | "fr" | string;
    /**
     * 'select_account'. Defaults to 'select_account'
     */
    prompt?: "select_account" | string;
    /**
     * Application Redirect URI. Defaults to Current Window Location
     */
    redirect_uri?: string;
    /**
     * Currently 'code' is the only option
     */
    response_type?: "code" | string;
    /**
     * Space seperated string of the following:
     * Default - none
     * OIDC Endpoint - "email" | "all_emails" | "openid" | "profile:verified_at" | "x509" | "x509:subject" | "x509:issuer" | "x509:presented" | "address" | "phone" | "profile" | "profile:name" | "profile:birthdate" | "social_security_number"
     */
    scopes?: string;
    /**
     * Determines the /authorization endpoint to reach out to
     */
    stage: "development" | "staging" | "production" | string;
    /**
     * Verify id_token with X days, X weeks, X Months
     */
    verified_within?: string;
  };
}

export interface IGovLoginProviderOptions extends IAuthorizationParams {
  /**
   * The child nodes your Provider has wrapped
   */
  children?: React.ReactNode;
  /**
   * By default this removes the code and state parameters from the url when you are redirected from the authorize page.
   * It uses `window.history` but you might want to overwrite this if you are using a custom router, like `react-router-dom`
   * See the EXAMPLES.md for more info.
   */
  onRedirectCallback?: (appState?: IAppState, user?: IUser) => void;
  /**
   * By default, if the page url has code/state params, the SDK will treat them as Login.gov and attempt to exchange the
   * code for a token. In some cases the code might be for something else (another OAuth SDK perhaps). In these
   * instances you can instruct the client to ignore them eg
   *
   * ```jsx
   * <LoginProvider
   *   clientId={clientId}
   *   domain={domain}
   *   skipRedirectCallback={window.location.pathname === '/stripe-oauth-callback'}
   * >
   * ```
   */
  skipRedirectCallback?: boolean;
  context?: React.Context<LoginContextInterface>;
}
