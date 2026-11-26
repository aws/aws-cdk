/**
 * Redshift folds only ASCII letters in identifiers to lower case, and `public` is a pseudo-role rather than a user.
 *
 * @see https://docs.aws.amazon.com/redshift/latest/dg/r_names.html
 */
export function isPublicGrantee(username: string): boolean {
  return username.replace(/[A-Z]/g, letter => letter.toLowerCase()) === 'public';
}

export function validateUsername(username: string): void {
  if (isPublicGrantee(username)) {
    throw new Error(`user name ${JSON.stringify(username)} is not allowed: PUBLIC names a pseudo-role rather than a user; name an individual user instead`);
  }
}
