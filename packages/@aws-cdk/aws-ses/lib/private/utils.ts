export function undefinedIfNoKeys<A extends { [key: string]: unknown }>(obj: A): A | undefined {
  const allUndefined = Object.values(obj).every(val => val === undefined);
  return allUndefined ? undefined : obj;
}
