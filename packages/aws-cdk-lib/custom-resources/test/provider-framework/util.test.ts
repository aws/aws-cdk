import { withRetries } from '../../lib/provider-framework/runtime/util';

test('withRetries() will invoke a throwing function multiple times', async () => {
  let invocations = 0;
  const retryOptions = {
    attempts: 3,
    sleep: 0,
  };

  await expect(() => withRetries(retryOptions, async () => {
    invocations += 1;
    throw new Error('Oh no');
  })()).rejects.toThrow(/Oh no/);

  expect(invocations).toBeGreaterThan(1);
});