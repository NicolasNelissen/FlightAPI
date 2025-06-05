/**
 * The validated user data attached to the request after successful JWT validation.
 */
export interface ValidatedJwtData {
  userId: string;
  username: string;
}
