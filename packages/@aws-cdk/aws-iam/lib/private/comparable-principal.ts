import { IPrincipal, IComparablePrincipal } from '../principals';

export function isComparablePrincipal(x: IPrincipal): x is IComparablePrincipal {
  return 'dedupeString' in x;
}


export function dedupeStringFor(x: IPrincipal): string | undefined {
  return isComparablePrincipal(x) ? x.dedupeString() : undefined;
}

export function partitionPrincipals(xs: IPrincipal[]): PartitionResult {
  const nonComparable: IPrincipal[] = [];
  const comparable: Record<string, IPrincipal> = {};

  for (const x of xs) {
    const dedupe = dedupeStringFor(x);
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