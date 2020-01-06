export function dropUndefined<T extends object>(x: T): T {
  if (x === null) { return x; }
  const ret: any = {};
  for (const [key, value] of Object.entries(x)) {
    if (value !== undefined) {
      ret[key] = value;
    }
  }
  return ret;
}
