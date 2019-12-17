export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}