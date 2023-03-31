import { IPrincipal, ComparablePrincipal } from '../principals';

export function partitionPrincipals(xs: IPrincipal[]): PartitionResult {
  const nonComparable: IPrincipal[] = [];
  const comparable: Record<string, IPrincipal> = {};

  for (const x of xs) {
    const dedupe = ComparablePrincipal.dedupeStringFor(x);
    if (dedupe) {
      comparable[dedupe] = x;
    } else {
      nonComparable.push(x);
    }
  }

  return { comparable, nonComparable };
}

export interface PartitionResult {
  readonly nonComparable: IPrincipal[];
  readonly comparable: Record<string, IPrincipal>;
}
