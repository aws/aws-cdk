import { EnvironmentUtils } from '../lib';

test('format', () => {
  expect(EnvironmentUtils.format('my-account', 'my-region')).toBe('aws://my-account/my-region');
});

test('parse', () => {
  expect(EnvironmentUtils.parse('aws://123456789/us-east-1')).toStrictEqual({
    name: 'aws://123456789/us-east-1',
    account: '123456789',
    region: 'us-east-1',
  });

  // parser is not super strict to allow users to do some magical things if they want
  expect(EnvironmentUtils.parse('aws://boom@voom.com/ok-x-x-123')).toStrictEqual({
    name: 'aws://boom@voom.com/ok-x-x-123',
    account: 'boom@voom.com',
    region: 'ok-x-x-123',
  });
});

test('parse failures', () => {
  expect(() => EnvironmentUtils.parse('boom')).toThrow('Unable to parse environment specification');
  expect(() => EnvironmentUtils.parse('boom://boom/boom')).toThrow('Unable to parse environment specification');
  expect(() => EnvironmentUtils.parse('boom://xx//xz/x/boom')).toThrow('Unable to parse environment specification');
  expect(() => EnvironmentUtils.parse('aws:://998988383/fu-x-x')).toThrow('Unable to parse environment specification');
});
