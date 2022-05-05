export type TypeChecker<A> = (x: any) => x is A;

/**
 * Brand a class with a symbol indicating its type, and return a function that checks for that brand
 *
 * We need to do this instead of using `instanceof` because as soon as there are multiple copies
 * of a library in memory (for example when users are using `npm link` to link local copies of libraries
 * together) then `instanceof` stops working.
 */
export function makeTypeChecker<A>(cls: new (...args: any[]) => A, sym: symbol, symbolValue?: string): TypeChecker<A> {
  const value = symbolValue ?? cls.name;

  if (cls.prototype[sym]) {
    throw new Error(`Duplicate class stamp on ${cls}`);
  }

  Object.defineProperty(cls.prototype, sym, {
    value,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  return (x: any): x is A => typeof x === 'object' && x != null && x[sym] === value;
}