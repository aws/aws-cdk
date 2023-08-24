import { flatten } from '../../../lib/aws-custom-resource/runtime/shared';

test('flatten correctly flattens a nested object', () => {
  expect(flatten({
    a: { b: 'c' },
    d: [
      { e: 'f' },
      { g: 'h', i: 1, j: null, k: { l: false } },
    ],
  })).toEqual({
    'a.b': 'c',
    'd.0.e': 'f',
    'd.1.g': 'h',
    'd.1.i': 1,
    'd.1.j': null,
    'd.1.k.l': false,
  });
});

test('flatten correctly flattens an object with buffers', () => {
  expect(flatten({
    body: Buffer.from('body'),
    nested: {
      buffer: Buffer.from('buffer'),
      array: [
        Buffer.from('array.0'),
        Buffer.from('array.1'),
      ],
    },
  })).toEqual({
    'body': 'body',
    'nested.buffer': 'buffer',
    'nested.array.0': 'array.0',
    'nested.array.1': 'array.1',
  });
});

test('flatten correctly flattens an object with Uint8Array', () => {
  const encoder = new TextEncoder();
  expect(flatten({
    body: encoder.encode('body'),
    nested: {
      buffer: encoder.encode('buffer'),
      array: [
        encoder.encode('array.0'),
        encoder.encode('array.1'),
      ],
    },
  })).toEqual({
    'body': 'body',
    'nested.buffer': 'buffer',
    'nested.array.0': 'array.0',
    'nested.array.1': 'array.1',
  });
});
