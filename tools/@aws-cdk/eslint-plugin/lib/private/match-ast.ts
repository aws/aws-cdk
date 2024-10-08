/**
 * Matching the AST is a perennial problem. Here are some helpers.
 *
 * (NOTE: variable binding here does not support backtracking yet.
 * That requires either explicitly keeping a stack somewhere, or using
 * continuation-passing style everywhere so that we can use JS for
 * backtracking. We don't need it yet and it's a bit of work, so it's not in
 * here.)
 */
export interface Match { }

export type Pattern = (x: unknown, state: Match) => Match | undefined;

export function match(value: unknown, pattern: Pattern): Match | undefined {
  return pattern(value, {});
}

/**
 * Match any value
 */
export function matchAny(): Pattern {
  return function matchAny(_, state) { return state; };
}

/**
 * Make a Pattern that matches a literal value.
 */
export function matchLiteral(x: any): Pattern {
  return function matchLiteral(value, state) {
    return value === x ? state : undefined;
  };
}

/**
 * Match an object's fields
 */
export function matchObject(fields: Record<string, unknown>): Pattern {
  const patFields = Object.fromEntries(Object.entries(fields).map(([key, pat]) => [key, makePattern(pat)]));

  return function matchObject(value, state) {
    if (!value || typeof value !== 'object') {
      return undefined;
    }
    for (const [field, pattern] of Object.entries(patFields)) {
      state = pattern((value as any)[field], state);
      if (!state) {
        break;
      }
    }
    return state;
  };
}

/**
 * Turn any value into a Pattern
 *
 * If it is already a Pattern (function0, return. Otherwise,
 * make a Pattern that matches a literal value.
 */
export function makePattern(x: unknown) {
  return typeof x === 'function' ? x : matchLiteral(x);
}

/**
 * Create a capturable variable in the matching
 *
 * The variable can have an `inner` pattern, which it will only match if the inner
 * matcher succeeds.
 *
 * It optionally can also have a type tester, to validate that `variable.get()` will
 * not lie about the type it has captured later on.
 */
export function variable<T>(inner?: Pattern, tester?: (x: any) => x is T): Variable<T> {
  if (!inner) {
    inner = matchAny;
  }

  const sym = Symbol();
  const ret = function variable(x: unknown, state: Match) {
    const newState = inner(x, state);
    if (!newState) {
      return undefined;
    }
    if (tester && !tester(x)) {
      throw new Error(`${JSON.stringify(x)} should be of type ${tester.name}, but doesn't`);
    }
    Object.defineProperty(newState, sym, {
      value: x,
    });

    return newState;
  };
  ret.get = (m: Match) => {
    return (m as any)[sym];
  };
  return ret;
}

export interface Variable<T> extends Pattern {
  get(m: Match): T;
}
