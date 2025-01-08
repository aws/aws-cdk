import { parseJsonPayload, withRetries } from '../../lib/provider-framework/runtime/util';

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

test.each([
  '',
  null,
  undefined,
  new Uint8Array([]),
  Buffer.alloc(0),
])('parseJsonPayload returns empty object for nullish input: %p', (input) => {
  expect(parseJsonPayload(input)).toEqual({});
});
