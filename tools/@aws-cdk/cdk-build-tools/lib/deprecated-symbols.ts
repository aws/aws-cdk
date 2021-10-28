/* eslint-disable jest/no-export */

export function describeDeprecated(name: string, fn: jest.EmptyFunction) {
  describe(name, () => {
    let deprecated: string | undefined;
    beforeEach(() => {
      deprecated = quiet();
    });
    afterEach(() => {
      reset(deprecated);
    });
    fn();
  });
}

export function testDeprecated(name: string, fn: () => any, timeout?: number) {
  test(name, () => {
    const deprecated = quiet();
    fn();
    reset(deprecated);
  }, timeout);
}

function quiet(): string | undefined {
  const deprecated = process.env.JSII_DEPRECATED;
  process.env.JSII_DEPRECATED = 'quiet';
  return deprecated;
}

function reset(deprecated: string | undefined) {
  if (deprecated === undefined) {
    delete process.env.JSII_DEPRECATED;
  } else {
    process.env.JSII_DEPRECATED = deprecated;
  }
}