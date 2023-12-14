import { realHandler } from '../lib/commands/doctor';

// eslint-disable-next-line no-console
console.log = jest.fn();

describe('`cdk doctor`', () => {
  test('exits with 0 when everything is OK', async () => {
    const argv: any = {};
    const result = await realHandler({ args: argv } as any);
    expect(result).toBe(0);
  });
});
