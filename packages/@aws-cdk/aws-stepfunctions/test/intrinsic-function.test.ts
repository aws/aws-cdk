import { IntrinsicFunction } from '../lib/intrinsic-function';

describe('States.Format()', () => {
  test('empty format string', () => {
    expect(IntrinsicFunction.StatesForamt('')).
      toEqual('States.Format(\'\')');
  }),
  test('format string with nuber, string', () => {
    expect(IntrinsicFunction.StatesForamt('1{}2{}3', 'str', 123)).
      toEqual('States.Format(\'1{}2{}3\', \'str\', 123)');
  }),
  test('format string with nuber, string, null, path', () => {
    expect(IntrinsicFunction.StatesForamt('1{}2{}3{}4', 123, 'str', IntrinsicFunction.NULL, '$.path')).
      toEqual('States.Format(\'1{}2{}3{}4\', 123, \'str\', null, $.path)');
  });
});

describe('States.StringToJson()', () => {
  test('empty string', () => {
    expect(IntrinsicFunction.StatesStringToJson('')).
      toEqual('States.StringToJson(\'\')');
  }),
  test('string', () => {
    expect(IntrinsicFunction.StatesStringToJson('{"aaa":"bbb"}')).
      toEqual('States.StringToJson(\'{"aaa":"bbb"}\')');
  });
});

describe('States.JsonToString()', () => {
  test('path', () => {
    expect(IntrinsicFunction.StatesJsonToString('$.path')).
      toEqual('States.JsonToString($.path)');
  }),
  test('path (context object)', () => {
    expect(IntrinsicFunction.StatesJsonToString('$$.path')).
      toEqual('States.JsonToString($$.path)');
  });
  test('path (nested)', () => {
    expect(IntrinsicFunction.StatesJsonToString(IntrinsicFunction.StatesForamt('$.{}', 'xxx'))).
      toEqual('States.JsonToString(States.Format(\'$.{}\', \'xxx\'))');
  });
});

describe('States.Array()', () => {
  test('zero args', () => {
    expect(IntrinsicFunction.StatesArray()).
      toEqual('States.Array()');
  }),
  test('nuber, string, null, path', () => {
    expect(IntrinsicFunction.StatesArray(123, 'str', IntrinsicFunction.NULL, '$.path')).
      toEqual('States.Array(123, \'str\', null, $.path)');
  });
});
