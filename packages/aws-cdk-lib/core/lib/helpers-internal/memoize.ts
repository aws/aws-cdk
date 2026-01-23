/**
 * Memoize a getter
 *
 * The getter will only be evaluated once; subsequent calls will return the previously
 * produced result without recalculation.
 */
export function memoizedGetter<This extends object, Return>(
  target: (this: This) => Return,
  context: ClassGetterDecoratorContext<This, Return>,
): (this: This) => Return;
export function memoizedGetter<This extends object, Return>(
  memoizeNullish?: boolean,
): (target: (this: This) => Return, context: ClassGetterDecoratorContext<This, Return>) => (this: This) => Return;
export function memoizedGetter<This extends object, Return>(
  targetOrMemoizeNullish?: ((this: This) => Return) | boolean,
  _context?: ClassGetterDecoratorContext<This, Return>,
) {
  const makeReplacer = (target: (this: This) => Return, memoizeNullish: boolean) => {
    let m: WeakMap<This, Return> | undefined;
    return function (this: This): Return {
      if (!m) {
        m = new WeakMap<This, Return>();
      }
      if (m.has(this)) {
        return m.get(this)!;
      }
      const ret = target.call(this);
      if (memoizeNullish || ret != null) {
        m.set(this, ret);
      }
      return ret;
    };
  };

  if (typeof targetOrMemoizeNullish === 'function') {
    return makeReplacer(targetOrMemoizeNullish, true);
  }
  return (target: (this: This) => Return) => makeReplacer(target, targetOrMemoizeNullish ?? true);
}

