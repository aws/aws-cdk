import { decodeParameters, deepParseJson } from '../../../../lib/assertions/providers/lambda-handler/utils';

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

  describe('coerceResponse', () => {

    test('no ops on simple response', async () => {

      const response = {
        simple: 'value1',
        map: {
          prop: 'value2',
        },
        array: ['value3'],
      };

      await deepParseJson(response);

      expect(response).toEqual({
        simple: 'value1',
        map: {
          prop: 'value2',
        },
        array: ['value3'],
      });

    });

    test('json parses strings', async () => {

      const response = {
        simple: '{ "foo1": "bar1" }',
        map: {
          prop: '{ "foo2": "bar2" }',
        },
        array: ['{ "foo3": "bar3" }'],
      };

      await deepParseJson(response);

      expect(response).toEqual({
        simple: { foo1: 'bar1' },
        map: {
          prop: { foo2: 'bar2' },
        },
        array: [{ foo3: 'bar3' }],
      });

    });

    test('detects and json parses transformToString', async () => {

      const response = {
        Data: {
          transformToString: () => 'non-json',
        },
        Payload: {
          transformToString: () => '{ "foo": "bar" }',
        },
      };

      await deepParseJson(response);

      expect(response).toEqual({
        Data: 'non-json',
        Payload: {
          foo: 'bar',
        },
      });

    });

  });
});