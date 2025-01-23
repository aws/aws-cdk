/**
 * Return a mocked instance of a class, given its constructor
 *
 * I don't understand why jest doesn't provide this by default,
 * but there you go.
 *
 * FIXME: Currently very limited. Doesn't support inheritance, getters or
 * automatic detection of properties (as those exist on instances, not
 * classes).
 */
export function instanceMockFrom<A>(ctr: new (...args: any[]) => A): jest.Mocked<A> {
  const ret: any = {};
  for (const methodName of Object.getOwnPropertyNames(ctr.prototype)) {
    ret[methodName] = jest.fn();
  }
  return ret;
}

export function withMocked<A extends object, K extends keyof A, B>(
  obj: A,
  key: K,
  block: (fn: jest.Mocked<A>[K]) => B,
): B {
  const original = obj[key];
  const mockFn = jest.fn();
  (obj as any)[key] = mockFn;

  let asyncFinally: boolean = false;
  try {
    const ret = block(mockFn as any);
    if (!isPromise(ret)) {
      return ret;
    }

    asyncFinally = true;
    return ret.finally(() => {
      obj[key] = original;
    }) as any;
  } finally {
    if (!asyncFinally) {
      obj[key] = original;
    }
  }
}

function isPromise<A>(object: any): object is Promise<A> {
  return Promise.resolve(object) === object;
}

export async function sleep(ms: number) {
  return new Promise((ok) => setTimeout(ok, ms));
}
