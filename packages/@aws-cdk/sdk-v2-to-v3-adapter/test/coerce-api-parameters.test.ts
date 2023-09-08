import { coerceApiParametersToUint8Array, coerceToUint8Array } from '../lib/coerce-api-parameters';

const encode = (v: any) => new TextEncoder().encode(v);

describe('should coerce', () => {
  test('a nested value', () => {
    // GIVEN
    const obj = { a: { b: { c: 'dummy-value' } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b', 'c']);

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
    coerceToUint8Array(obj, ['a', 'b', '*', 'z']);

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
    coerceToUint8Array(obj, ['a', 'b', '*']);

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
    coerceToUint8Array(obj, ['a', 'b', '*', 'z', '*', 'y']);

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
    coerceToUint8Array(obj, ['a', 'b', 'c']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: encode('') } } });
  });

  test('a number', () => {
    // GIVEN
    const obj = { a: { b: { c: 0 } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b', 'c']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: encode('0') } } });
  });

});

describe('should NOT coerce', () => {
  test('undefined', () => {
    // GIVEN
    const obj = { a: { b: { c: undefined } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b', 'c']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: undefined } } });
  });

  test('null', () => {
  // GIVEN
    const obj = { a: { b: { c: null } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b', 'c']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: null } } });
  });

  test('an path that does not exist in input', () => {
    // GIVEN
    const obj = { a: { b: { c: 'dummy-value' } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b', 'foobar']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
  });

  test('a path that is not a leaf', () => {
    // GIVEN
    const obj = { a: { b: { c: 'dummy-value' } } };

    // THEN
    coerceToUint8Array(obj, ['a', 'b']);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
  });

  test('do not change anything for empty path', () => {
    // GIVEN
    const obj = { a: { b: { c: 'dummy-value' } } };

    // THEN
    coerceToUint8Array(obj, []);

    // EXPECT
    expect(obj).toMatchObject({ a: { b: { c: 'dummy-value' } } });
  });
});

describe('given an api call description', () => {

  test('can convert string parameters to Uint8Array when needed', async () => {
    const params = coerceApiParametersToUint8Array('KMS', 'encrypt', {
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
    const params = coerceApiParametersToUint8Array('Kinesis', 'putRecords', {
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
});