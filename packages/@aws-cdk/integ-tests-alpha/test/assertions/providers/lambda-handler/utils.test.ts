import { decodeParameters } from '../../../../lib/assertions/providers/lambda-handler/utils';

describe('utils', () => {
  test('decode parameters', () => {
    const result = decodeParameters({
      foo: 'normal string',
      bar: 'abc',
      zee: '{"hello": "world"}',
    }, {
      bar: 'ArrayBufferView',
    });

    expect(result).toEqual({
      foo: 'normal string',
      bar: Uint8Array.from([97, 98, 99]),
      zee: { hello: 'world' },
    });
  });
});