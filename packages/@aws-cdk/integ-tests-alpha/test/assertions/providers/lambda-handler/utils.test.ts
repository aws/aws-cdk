import { decodeParameters } from '../../../../lib/assertions/providers/lambda-handler/utils';

describe('utils', () => {
  test('decode parameters', () => {
    const result = decodeParameters({
      foo: 'normal string',
      bar: { $type: 'ArrayBufferView', string: 'abc' },
      zee: '{"hello": "world"}',
    });

    expect(result).toEqual({
      foo: 'normal string',
      bar: Uint8Array.from([97, 98, 99]),
      zee: { hello: 'world' },
    });
  });
});