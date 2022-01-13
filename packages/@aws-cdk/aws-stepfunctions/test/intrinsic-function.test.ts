import { IntrinsicFunction } from '../lib/intrinsic-function';

describe('States.Format()', () => {
  test('empty format string', () => {
    expect(IntrinsicFunction.StatesForamt('')).
      toEqual('States.Format(\'\')');
  }),
  test('format string with nuber, string', () => {
    expect(IntrinsicFunction.StatesForamt('1{}2{}3', 'str', 123)).
      toEqual('States.Format(\'1{}2{}3\', \'str\', 123)');
  });
  test('format string with nuber, string and JsonPath', () => {
    expect(IntrinsicFunction.StatesForamt('1{}2{}3{}4', 'str', 123, '$.path')).
      toEqual('States.Format(\'1{}2{}3{}4\', \'str\', 123, $.path)');
  });
});
