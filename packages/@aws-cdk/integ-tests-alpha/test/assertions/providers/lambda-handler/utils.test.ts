import { decodeParameters } from '../../../../lib/assertions/providers/lambda-handler/utils';

describe('utils', () => {
  test('decode parameters', () => {
    const result = decodeParameters({
      foo: 'normal string',
      bar: '{"0":97,"1":98,"2":99}',
      zee: '{"hello": "world"}',
    });

    expect(result).toEqual({
      foo: 'normal string',
      bar: Uint8Array.from([97, 98, 99]),
      zee: { hello: 'world' },
    });
  });
});