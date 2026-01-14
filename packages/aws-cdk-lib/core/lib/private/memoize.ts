/**
 * Memoize a getter
 *
 * The getter will only be evaluated once; subsequent calls will return the previously
 * produced result without recalculation.
 */
export function memoizedGetter<This extends object, Return>(
  target: (this: This) => Return,
  _context: ClassGetterDecoratorContext<This, Return>,
) {
  const m = new WeakMap<This, Return>();

  function replacementMethod(this: This): Return {
    if (m.has(this)) {
      return m.get(this)!;
    }
    const ret = target.call(this);
    m.set(this, ret);
    return ret;
  }

  return replacementMethod;
}
