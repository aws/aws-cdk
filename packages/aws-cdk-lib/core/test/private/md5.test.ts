import { jsMd5, cryptoMd5 } from '../../lib/private/md5';

test.each([
  '',
  'asdf',
  'hello',
  '🤠',
  'x'.repeat(54),
  'y'.repeat(63),
  'z'.repeat(64),
  'a'.repeat(64) + 'y',
  'b'.repeat(115),
  'c'.repeat(128),
])('test md5 equality for %p', s => {
  expect(jsMd5(s)).toEqual(cryptoMd5(s));
});

// eslint-disable-next-line jest/no-disabled-tests
test.skip('test md5 equality for a giant string (larger than 512MB)', () => {
  const s = 'x'.repeat(515_000_000);
  expect(jsMd5(s)).toEqual(cryptoMd5(s));
});

describe('timing', () => {
  const s = 'x'.repeat(352321);
  const N = 100;

  // On my machine:
  // - crypto: 73ms
  // - native: 1187ms

  test('crypto', () => {
    for (let i = 0; i < N; i++) {
      cryptoMd5(s);
    }
  });

  test('native', () => {
    for (let i = 0; i < N; i++) {
      jsMd5(s);
    }
  });
});
