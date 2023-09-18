export interface IUserBasics {
  /**
   * @description Could be any one of the following values:
   * 1. urn:gov:gsa:ac:classes:sp:PasswordProtectedTransport:duo (Two Factor Verified, 30 Day Verification)
   * 2. http://idmanagement.gov/ns/assurance/aal/2 () (Two Factor Required)
   * 3. http://idmanagement.gov/ns/assurance/aal/2?phishing_resistant=true (Cyrptographic Login or CAC/PIV)
   * 4. http://idmanagement.gov/ns/assurance/aal/2?hspd12=true (CAC/PIV)
   */
  aal: string;
  /**
   * @description Array of emails associated to user
   */
  all_emails: string[];
  /**
   * @description Default email for this user
   */
  email: string;
  /**
   * @description Identity Assuarance Level (IAL)
   */
  ial:
    | "http://idmanagement.gov/ns/assurance/ial/1"
    | "http://idmanagement.gov/ns/assurance/ial/2"
    | string;
  phone: string;
  x509_issuer: string;
  x509_presented: string;
  x509_subject: string;
}

/** @TODO Correct for SAML Authentication */
// export interface ISAML extends IUserBasics {
//   address1: string;
//   address2: string;
//   city: string;
//   dob: string;
//   ial:
//     | "http://idmanagement.gov/ns/assurance/ial/1"
//     | "http://idmanagement.gov/ns/assurance/ial/2"
//     | string;
//   first_name: string;
//   last_name: string;
//   ssn: string;
//   state: string;
//   uuid: string;
//   verified_at: string;
//   zipcode: string;
// }

export interface IUser extends IUserBasics {
  address: string;
  birthdate: string;
  family_name: string;
  given_name: string;
  /**
   * @description Returns Identity Verification Level
   */
  ial:
    | "http://idmanagement.gov/ns/assurance/ial/1"
    | "http://idmanagement.gov/ns/assurance/ial/2"
    | string;
  locality: string;
  postal_code: string;
  region: string;
  social_security_number: string;
  street_address: string;
  sub: string;
  verified_at: number;
}
