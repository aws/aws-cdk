import { doctor } from '../lib/commands/doctor';

// eslint-disable-next-line no-console
console.log = jest.fn();

describe('`cdk doctor`', () => {
  test('exits with 0 when everything is OK', async () => {
    const result = await doctor();
    expect(result).toBe(0);
  });
});
