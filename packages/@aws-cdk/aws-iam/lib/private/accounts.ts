import { Token } from '@aws-cdk/core';

/**
 * Return whether the given accounts are definitely different.
 *
 * If one or both of them are agnostic, return false (we don't know).
 */
export function accountsAreDefinitelyDifferent(account1: string | undefined,
                                               account2: string | undefined): boolean {
  return !Token.isUnresolved(account1) && !Token.isUnresolved(account2) && account1 !== account2;
}

/**
 * Return whether two accounts are the same account
 *
 * Returns undefined if one is agnostic and the other one isn't.
 */
export function sameAccount(account1: string | undefined, account2: string | undefined): boolean | undefined {
  // Both agnostic in 99% of cases means they will be deployed to the same environment,
  // so treat as the same.
  if (Token.isUnresolved(account1) && Token.isUnresolved(account2)) { return true; }

  // One agnostic and the other one not means "shug".
  if (Token.isUnresolved(account1) || Token.isUnresolved(account2)) { return undefined; }
  return account1 === account2;
}
