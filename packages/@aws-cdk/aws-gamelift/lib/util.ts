function undefinedIfNoKeys<A>(struct: A): A | undefined {
  const allUndefined = Object.values(struct).every(val => val === undefined);
  return allUndefined ? undefined : struct;
}