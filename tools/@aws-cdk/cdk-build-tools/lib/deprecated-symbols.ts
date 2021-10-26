/* eslint-disable jest/no-export */
export function testDeprecated(name: string, fn: () => any, timeout?: number) {
  test(name, () => {
    const deprecated = process.env.JSII_DEPRECATED;

    process.env.JSII_DEPRECATED = 'quiet';
    fn();

    if (deprecated === undefined) {
      delete process.env.JSII_DEPRECATED;
    } else {
      process.env.JSII_DEPRECATED = deprecated;
    }
  }, timeout);
}
