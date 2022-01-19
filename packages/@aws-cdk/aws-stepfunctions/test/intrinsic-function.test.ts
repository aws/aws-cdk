import { IntrinsicFunction } from '../lib/intrinsic-function';

describe('States.Format()', () => {
  test('empty format string', () => {
    expect(IntrinsicFunction.statesForamt('')).
      toEqual('States.Format(\'\')');
  }),
  test('format string with nuber, string', () => {
    expect(IntrinsicFunction.statesForamt('1{}2{}3', 'str', 123)).
      toEqual('States.Format(\'1{}2{}3\', \'str\', 123)');
  }),
  test('format string with nuber, string, null, path', () => {
    expect(IntrinsicFunction.statesForamt('1{}2{}3{}4', 123, 'str', IntrinsicFunction.NULL, '$.path')).
      toEqual('States.Format(\'1{}2{}3{}4\', 123, \'str\', null, $.path)');
  });
});

describe('States.StringToJson()', () => {
  test('empty string', () => {
    expect(IntrinsicFunction.statesStringToJson('')).
      toEqual('States.StringToJson(\'\')');
  }),
  test('string', () => {
    expect(IntrinsicFunction.statesStringToJson('{"aaa":"bbb"}')).
      toEqual('States.StringToJson(\'{"aaa":"bbb"}\')');
  });
});

describe('States.JsonToString()', () => {
  test('path', () => {
    expect(IntrinsicFunction.statesJsonToString('$.path')).
      toEqual('States.JsonToString($.path)');
  }),
  test('path (context object)', () => {
    expect(IntrinsicFunction.statesJsonToString('$$.path')).
      toEqual('States.JsonToString($$.path)');
  });
  test('path (nested)', () => {
    expect(IntrinsicFunction.statesJsonToString(IntrinsicFunction.statesForamt('$.{}', 'xxx'))).
      toEqual('States.JsonToString(States.Format(\'$.{}\', \'xxx\'))');
  });
});

describe('States.Array()', () => {
  test('zero args', () => {
    expect(IntrinsicFunction.statesArray()).
      toEqual('States.Array()');
  }),
  test('nuber, string, null, path', () => {
    expect(IntrinsicFunction.statesArray(123, 'str', IntrinsicFunction.NULL, '$.path')).
      toEqual('States.Array(123, \'str\', null, $.path)');
  });
});
