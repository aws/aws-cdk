import { Coercer, coerceApiParameters } from '../lib/coerce-api-parameters';
import { TypeCoercionStateMachine } from '../lib/parameter-types';

const encode = (v: any) => new TextEncoder().encode(v);

describe('Uint8Array', () => {

  describe('should coerce', () => {
    test('a nested value', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // WHEN
      new Coercer([
        { a: 1 },
        { b: 2 },
        { c: 'b' },
      ]).testCoerce(obj);

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: encode('dummy-value') } } });
    });

    test('values nested in an array', () => {
      // GIVEN
      const obj = {
        a: {
          b: [
            { z: '1' },
            { z: '2' },
            { z: '3' },
          ],
        },
      };

      // WHEN
      new Coercer([
        { a: 1 },
        { b: 2 },
        { '*': 3 },
        { z: 'b' },
      ]).testCoerce(obj);

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            { z: encode('1') },
            { z: encode('2') },
            { z: encode('3') },
          ],
        },
      });
    });

    test('array elements', () => {
      // GIVEN
      const obj = {
        a: {
          b: ['1', '2', '3'],
        },
      };

      // THEN
      new Coercer([
        { a: 1 },
        { b: 2 },
        { '*': 'b' },
      ]).testCoerce(obj);

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            encode('1'),
            encode('2'),
            encode('3'),
          ],
        },
      });
    });

    test('values nested in multiple arrays', () => {
      // GIVEN
      const obj = {
        a: {
          b: [
            {
              z: [
                { y: '1' },
                { y: '2' },
              ],
            },
            {
              z: [
                { y: 'A' },
                { y: 'B' },
              ],
            },
          ],
        },
      };

      // THEN
      coerce(obj, ['a', 'b', '*', 'z', '*', 'y'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            { z: [{ y: encode('1') }, { y: encode('2') }] },
            { z: [{ y: encode('A') }, { y: encode('B') }] },
          ],
        },
      });
    });

    test('empty string', () => {
      // GIVEN
      const obj = { a: { b: { c: '' } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: encode('') } } });
    });

    test('a number', () => {
      // GIVEN
      const obj = { a: { b: { c: 0 } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: encode('0') } } });
    });

  });

  describe('should NOT coerce', () => {
    test('undefined', () => {
      // GIVEN
      const obj = { a: { b: { c: undefined } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: undefined } } });
    });

    test('null', () => {
      // GIVEN
      const obj = { a: { b: { c: null } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: null } } });
    });

    test('an path that does not exist in input', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // THEN
      coerce(obj, ['a', 'b', 'foobar'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
    });

    test('a path that is not a leaf', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // THEN
      coerce(obj, ['a', 'b'], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
    });

    test('do not change anything for empty path', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // THEN
      coerce(obj, [], 'Uint8Array');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
    });
  });

  describe('given an api call description', () => {

    test('can convert string parameters to Uint8Array when needed', () => {
      const params = coerceApiParameters('KMS', 'encrypt', {
        KeyId: 'key-id',
        Plaintext: 'dummy-data',
      });

      expect(params).toMatchObject({
        KeyId: 'key-id',
        Plaintext: new Uint8Array([
          100, 117, 109, 109,
          121, 45, 100, 97,
          116, 97,
        ]),
      });
    });

    test('can convert string parameters to Uint8Array in arrays', () => {
      const params = coerceApiParameters('Kinesis', 'putRecords', {
        Records: [
          {
            Data: 'aaa',
            PartitionKey: 'key',
          },
          {
            Data: 'bbb',
            PartitionKey: 'key',
          },
        ],
      });

      expect(params).toMatchObject({
        Records: [
          {
            Data: new Uint8Array([97, 97, 97]),
            PartitionKey: 'key',
          },
          {
            Data: new Uint8Array([98, 98, 98]),
            PartitionKey: 'key',
          },
        ],
      });
    });

    test('can convert string parameters to Uint8Array in map & union', () => {
      const params = coerceApiParameters('dynamodb', 'putItem', {
        Item: {
          Binary: {
            B: 'abc',
          },
        },
      });

      expect(params).toMatchObject({
        Item: {
          Binary: {
            B: new Uint8Array([97, 98, 99]),
          },
        },
      });
    });

    test('can coerce parameters in recursive types', () => {
      const params = coerceApiParameters('connect', 'CreateEvaluationForm', {
        Items: [
          {
            Section: {
              Items: [ // <-- same type as 'Items' above
                {
                  Question: {
                    Weight: '9000',
                  },
                },
              ],
            },
          },
        ],
      });

      expect(params).toMatchObject({
        Items: [
          {
            Section: {
              Items: [
                {
                  Question: {
                    Weight: 9000, // <-- converted
                  },
                },
              ],
            },
          },
        ],
      });
    });
  });

});

describe('number', () => {

  describe('should coerce', () => {
    test('a nested value', () => {
      // GIVEN
      const obj = { a: { b: { c: '-123.45' } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: -123.45 } } });
    });

    test('values nested in an array', () => {
      // GIVEN
      const obj = {
        a: {
          b: [
            { z: '1' },
            { z: '2' },
            { z: '3' },
          ],
        },
      };

      // THEN
      coerce(obj, ['a', 'b', '*', 'z'], 'number');

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            { z: 1 },
            { z: 2 },
            { z: 3 },
          ],
        },
      });
    });

    test('array elements', () => {
      // GIVEN
      const obj = {
        a: {
          b: ['1', '2', '3'],
        },
      };

      // THEN
      coerce(obj, ['a', 'b', '*'], 'number');

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            1,
            2,
            3,
          ],
        },
      });
    });

    test('values nested in multiple arrays', () => {
      // GIVEN
      const obj = {
        a: {
          b: [
            {
              z: [
                { y: '1' },
                { y: '2' },
              ],
            },
            {
              z: [
                { y: '3' },
                { y: '4' },
              ],
            },
          ],
        },
      };

      // THEN
      coerce(obj, ['a', 'b', '*', 'z', '*', 'y'], 'number');

      // EXPECT
      expect(obj).toMatchObject({
        a: {
          b: [
            { z: [{ y: 1 }, { y: 2 }] },
            { z: [{ y: 3 }, { y: 4 }] },
          ],
        },
      });
    });
  });

  describe('should NOT coerce', () => {
    test('empty string', () => {
      // GIVEN
      const obj = { a: { b: { c: '' } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: encode('') } } });
    });

    test('a number', () => {
      // GIVEN
      const obj = { a: { b: { c: 0 } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: 0 } } });
    });

    test('undefined', () => {
      // GIVEN
      const obj = { a: { b: { c: undefined } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: undefined } } });
    });

    test('null', () => {
      // GIVEN
      const obj = { a: { b: { c: null } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: null } } });
    });

    test('an path that does not exist in input', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // THEN
      coerce(obj, ['a', 'b', 'foobar'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
    });

    test('a path that is not a leaf', () => {
      // GIVEN
      const obj = { a: { b: { c: '123' } } };

      // THEN
      coerce(obj, ['a', 'b'], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: '123' } } });
    });

    test('do not change anything for empty path', () => {
      // GIVEN
      const obj = { a: { b: { c: '123' } } };

      // THEN
      coerce(obj, [], 'number');

      // EXPECT
      expect(obj).toMatchObject({ a: { b: { c: '123' } } });
    });
  });

  describe('given an api call description', () => {

    test('can convert string parameters to number when needed', () => {
      const params = coerceApiParameters('Amplify', 'listApps', {
        maxResults: '15',
      });

      expect(params).toMatchObject({
        maxResults: 15,
      });
    });

    test('can convert string parameters to number in arrays', () => {
      const params = coerceApiParameters('ECS', 'createService', {
        loadBalancers: [{
          containerPort: '8080',
        }, {
          containerPort: '9000',
        }],
      });

      expect(params).toMatchObject({
        loadBalancers: [{
          containerPort: 8080,
        }, {
          containerPort: 9000,
        }],
      });
    });

    test('can convert string parameters to number in map & union', () => {
      const params = coerceApiParameters('apigatewayv2', 'createApi', {
        CorsConfiguration: {
          MaxAge: '300',
        },
      });

      expect(params).toMatchObject({
        CorsConfiguration: {
          MaxAge: 300,
        },
      });
    });
  });
});

/**
 * A function to convert code testing the old API into code testing the new API
 *
 * Having this function saves manually updating 25 call sites.
 */
function coerce(value: unknown, path: string[], type: 'Uint8Array' | 'number') {
  const sm: TypeCoercionStateMachine = [{}];
  let current = sm[0];
  for (const p of path.slice(0, -1)) {
    current[p] = sm.length;
    sm.push({});
    current = sm[sm.length - 1];
  }
  current[path[path.length - 1]] = type === 'Uint8Array' ? 'b' : 'n';
  return new Coercer(sm).testCoerce(value);
}