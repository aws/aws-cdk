/**
 * Jest/Nodeunit compatibility shim
 *
 * Use this to mass-convert Nodeunit tests to Jest tests.
 */

/**
 * Compatibility shim test
 */
export class Test {
  constructor(private readonly cb: () => void) {
  }

  public equal(a: any, b: any, _message?: string) {
    expect(a).toEqual(b);
  }

  public notEqual(a: any, b: any, _message?: string) {
    expect(a).not.toEqual(b);
  }

  public equals(a: any, b: any, _message?: string) {
    expect(a).toEqual(b);
  }

  public strictEqual(a: any, b: any, _message?: string) {
    expect(a).toEqual(b);
  }

  public deepEqual(a: any, b: any, _message?: string) {
    expect(a).toEqual(b);
  }

  public notDeepEqual(a: any, b: any, _message?: string) {
    expect(a).not.toEqual(b);
  }

  public ok(a: any, _message?: string) {
    expect(a).toBeTruthy();
  }

  public same(a: any, b: any) {
    expect(a).toBe(b);
  }

  public throws(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string) {
    expect(block).toThrow(error);
  }

  public doesNotThrow(block: () => any, error?: string | RegExp | ErrorConstructor, _message?: string) {
    expect(block).not.toThrow(error);
  }

  public done() {
    this.cb();
  }
}

export function nodeunitShim(exports: Record<string, any>) {
  if (exports.setUp) {
    beforeEach(() => {
      return new Promise(ok => {
        exports.setUp(ok);
      });
    });
  }
  if (exports.tearDown) {
    afterEach(() => {
      return new Promise(ok => {
        exports.tearDown(ok);
      });
    });
  }
  for (const [testName, testObj] of Object.entries(exports)) {
    if (testName === 'setUp' || testName === 'tearDown') { continue; }

    if (typeof testObj === 'object') {
      // It's a suite
      describe(testName, () => {
        nodeunitShim(testObj);
      });
    } else {
      // It's a test
      test(testName, () => new Promise(ok => {
        testObj(new Test(ok));
      }));
    }
  }
}

type ErrorConstructor = new (...args: any[]) => Error;
