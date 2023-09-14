import { coerceApiParameters, coerce } from '../lib/coerce-api-parameters';

const encode = (v: any) => new TextEncoder().encode(v);

describe('Uint8Array', () => {

  describe('should coerce', () => {
    test('a nested value', () => {
      // GIVEN
      const obj = { a: { b: { c: 'dummy-value' } } };

      // THEN
      coerce(obj, ['a', 'b', 'c'], 'Uint8Array');

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

      // THEN
      coerce(obj, ['a', 'b', '*', 'z'], 'Uint8Array');

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
      coerce(obj, ['a', 'b', '*'], 'Uint8Array');

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

    test('can convert string parameters to Uint8Array when needed', async () => {
      const params = await coerceApiParameters('KMS', 'encrypt', {
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

    test('can convert string parameters to Uint8Array in arrays', async () => {
      const params = await coerceApiParameters('Kinesis', 'putRecords', {
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

    test('can convert string parameters to Uint8Array in map & union', async () => {
      const params = await coerceApiParameters('dynamodb', 'putItem', {
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

    test('can convert string parameters to number when needed', async () => {
      const params = await coerceApiParameters('Amplify', 'listApps', {
        maxResults: '15',
      });

      expect(params).toMatchObject({
        maxResults: 15,
      });
    });

    test('can convert string parameters to number in arrays', async () => {
      const params = await coerceApiParameters('ECS', 'createService', {
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

    test('can convert string parameters to number in map & union', async () => {
      const params = await coerceApiParameters('ApiGateway', 'createApi', {
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

describe('circular coersions', () => {

  test('simple circular reference', async () => {
    const params = await coerceApiParameters('DynamoDB', 'getObject', {
      Key: {
        ColumnToSearch: {
          L: [
            { N: '1' },
            { N: '2' },
          ],
        },
      },
      TableName: 'abc',
    });

    expect(params).toMatchObject({
      Key: {
        ColumnToSearch: {
          L: [
            { N: 1 },
            { N: 2 },
          ],
        },
      },
      TableName: new Uint8Array([97, 98, 99]),
    });
  });

  test('complex circular reference', async () => {
    const params = await coerceApiParameters('DynamoDB', 'getObject', {
      Key: {
        ColumnToSearch: {
          L: [
            {
              L: [
                { N: '1' },
                { N: '2' },
              ],
            },
            {
              M: { Name: { S: 'abd' }, Age: { N: '35' } },
            },
          ],
        },
      },
      TableName: 'abc',
    });

    expect(params).toMatchObject({
      Key: {
        ColumnToSearch: {
          L: [
            {
              L: [
                { N: 1 },
                { N: 2 },
              ],
            },
            {
              M: { Name: { S: new Uint8Array([97, 98, 100]) }, Age: { N: 35 } },
            },
          ],
        },
      },
      TableName: new Uint8Array([97, 98, 99]),
    });
  });

});