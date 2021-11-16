/* eslint-disable jest/no-export */

/**
 * A proxy over the jest 'describe()' block.
 * By default, unit tests in the CDK repo disallow the use of deprecated
 * symbols (classes, interfaces, properties, methods, etc.) in the unit tests
 * or within the "code under test".
 * Use this block to override when the test is verifying the behaviour of
 * deprecated APIs.
 */
export function describeDeprecated(name: string, fn: jest.EmptyFunction) {
  describe(name, () => {
    let deprecated: string | undefined;
    beforeEach(() => {
      deprecated = DeprecatedSymbols.quiet();
    });
    afterEach(() => {
      DeprecatedSymbols.reset(deprecated);
    });
    fn();
  });
}

/**
 * A proxy over the jest 'test()' block.
 * By default, unit tests in the CDK repo disallow the use of deprecated
 * symbols (classes, interfaces, properties, methods, etc.) in the unit tests
 * or within the "code under test".
 * Use this block to override when the test is verifying the behaviour of
 * deprecated APIs.
 */
export function testDeprecated(name: string, fn: () => any, timeout?: number) {
  test(name, () => {
    const deprecated = DeprecatedSymbols.quiet();
    fn();
    DeprecatedSymbols.reset(deprecated);
  }, timeout);
}

namespace DeprecatedSymbols {
  export function quiet(): string | undefined {
    const deprecated = process.env.JSII_DEPRECATED;
    process.env.JSII_DEPRECATED = 'quiet';
    return deprecated;
  }

  export function reset(deprecated: string | undefined) {
    if (deprecated === undefined) {
      delete process.env.JSII_DEPRECATED;
    } else {
      process.env.JSII_DEPRECATED = deprecated;
    }
  }
}