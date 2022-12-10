import { Token } from '@aws-cdk/core';

export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}

export function isPathString(s: string): boolean {
  return !Token.isUnresolved(s) && s.startsWith('$');
}
