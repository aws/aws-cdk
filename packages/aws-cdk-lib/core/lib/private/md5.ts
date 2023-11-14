/**
 * md5 hashing
 *
 * Uses the built-in 'crypto' library by default for a C implementation
 * of md5, but in case the crypto library has been compiled to disable
 * FIPS-noncompliant hash suites, fall back to a pure JS implementation of
 * md5.
 */
import * as crypto from 'crypto';

let _impl: undefined | ((x: string) => string);

/* eslint-disable no-restricted-syntax */

/**
 * Return a hash of the given input string, in hex format
 */
export function md5hash(x: string) {
  if (!_impl) {
    try {
      crypto.createHash('md5');
      _impl = cryptoMd5;
    } catch {
      _impl = jsMd5;
    }
  }
  return _impl(x);
}

/* eslint-disable no-bitwise */

export function cryptoMd5(x: string) {
  const hash = crypto.createHash('md5');
  hash.update(x);
  return hash.digest('hex');
}

export function jsMd5(s: string) {
  return hex(md5Buffer(Buffer.from(s, 'utf-8')));
}

function md5Round(x: number[], k: ReadonlyArray<number>) {
  let a = x[0], b = x[1], c = x[2], d = x[3];

  a = F(a, b, c, d, k[0], 7, -680876936);
  d = F(d, a, b, c, k[1], 12, -389564586);
  c = F(c, d, a, b, k[2], 17, 606105819);
  b = F(b, c, d, a, k[3], 22, -1044525330);
  a = F(a, b, c, d, k[4], 7, -176418897);
  d = F(d, a, b, c, k[5], 12, 1200080426);
  c = F(c, d, a, b, k[6], 17, -1473231341);
  b = F(b, c, d, a, k[7], 22, -45705983);
  a = F(a, b, c, d, k[8], 7, 1770035416);
  d = F(d, a, b, c, k[9], 12, -1958414417);
  c = F(c, d, a, b, k[10], 17, -42063);
  b = F(b, c, d, a, k[11], 22, -1990404162);
  a = F(a, b, c, d, k[12], 7, 1804603682);
  d = F(d, a, b, c, k[13], 12, -40341101);
  c = F(c, d, a, b, k[14], 17, -1502002290);
  b = F(b, c, d, a, k[15], 22, 1236535329);

  a = G(a, b, c, d, k[1], 5, -165796510);
  d = G(d, a, b, c, k[6], 9, -1069501632);
  c = G(c, d, a, b, k[11], 14, 643717713);
  b = G(b, c, d, a, k[0], 20, -373897302);
  a = G(a, b, c, d, k[5], 5, -701558691);
  d = G(d, a, b, c, k[10], 9, 38016083);
  c = G(c, d, a, b, k[15], 14, -660478335);
  b = G(b, c, d, a, k[4], 20, -405537848);
  a = G(a, b, c, d, k[9], 5, 568446438);
  d = G(d, a, b, c, k[14], 9, -1019803690);
  c = G(c, d, a, b, k[3], 14, -187363961);
  b = G(b, c, d, a, k[8], 20, 1163531501);
  a = G(a, b, c, d, k[13], 5, -1444681467);
  d = G(d, a, b, c, k[2], 9, -51403784);
  c = G(c, d, a, b, k[7], 14, 1735328473);
  b = G(b, c, d, a, k[12], 20, -1926607734);

  a = H(a, b, c, d, k[5], 4, -378558);
  d = H(d, a, b, c, k[8], 11, -2022574463);
  c = H(c, d, a, b, k[11], 16, 1839030562);
  b = H(b, c, d, a, k[14], 23, -35309556);
  a = H(a, b, c, d, k[1], 4, -1530992060);
  d = H(d, a, b, c, k[4], 11, 1272893353);
  c = H(c, d, a, b, k[7], 16, -155497632);
  b = H(b, c, d, a, k[10], 23, -1094730640);
  a = H(a, b, c, d, k[13], 4, 681279174);
  d = H(d, a, b, c, k[0], 11, -358537222);
  c = H(c, d, a, b, k[3], 16, -722521979);
  b = H(b, c, d, a, k[6], 23, 76029189);
  a = H(a, b, c, d, k[9], 4, -640364487);
  d = H(d, a, b, c, k[12], 11, -421815835);
  c = H(c, d, a, b, k[15], 16, 530742520);
  b = H(b, c, d, a, k[2], 23, -995338651);

  a = I(a, b, c, d, k[0], 6, -198630844);
  d = I(d, a, b, c, k[7], 10, 1126891415);
  c = I(c, d, a, b, k[14], 15, -1416354905);
  b = I(b, c, d, a, k[5], 21, -57434055);
  a = I(a, b, c, d, k[12], 6, 1700485571);
  d = I(d, a, b, c, k[3], 10, -1894986606);
  c = I(c, d, a, b, k[10], 15, -1051523);
  b = I(b, c, d, a, k[1], 21, -2054922799);
  a = I(a, b, c, d, k[8], 6, 1873313359);
  d = I(d, a, b, c, k[15], 10, -30611744);
  c = I(c, d, a, b, k[6], 15, -1560198380);
  b = I(b, c, d, a, k[13], 21, 1309151649);
  a = I(a, b, c, d, k[4], 6, -145523070);
  d = I(d, a, b, c, k[11], 10, -1120210379);
  c = I(c, d, a, b, k[2], 15, 718787259);
  b = I(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function F(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function G(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function H(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function I(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md5Buffer(buf: Buffer) {
  let n = buf.length,
    state = [1732584193, -271733879, -1732584194, 271733878],
    i = 0;

  for (; i + 64 <= n; i += 64) {
    md5Round(state, bytesToWordsBuf(buf, i));
  }

  // Padding - a single high 1 byte, and the length of the original message at the end
  // Need to add 2 tails if the message is less than 9 bytes shorter than a multiple of 64
  // (Otherwise not enough room for high bit and the 64 bit size)
  const remainingBytes = n - i;
  const padding = Buffer.alloc(64 - remainingBytes < 9 ? 128 : 64);

  buf.copy(padding, 0, i);
  padding.writeUint8(0x80, remainingBytes); // High bit

  const bitLength = n * 8;
  padding.writeUint32LE(n << 3, padding.length - 8);
  if (bitLength >= 0xFFFFFFFF) {
    padding.writeUint32LE(Math.floor(bitLength / 0xFFFFFFFF), padding.length - 4);
  }

  md5Round(state, bytesToWordsBuf(padding, 0));
  if (padding.length > 64) {
    md5Round(state, bytesToWordsBuf(padding, 64));
  }

  return state;
}

function bytesToWordsBuf(buf: Buffer, byteOffset: number) {
  const ret = new Array<number>(16);
  let i = 0, j = byteOffset;

  for (; i < 16; i++, j += 4) {
    ret[i] = buf.readUint32LE(j);
  }
  return ret;
}

let hex_chr = '0123456789abcdef'.split('');

function hexify(n: number) {
  const s = new Array<string>();
  for (let j = 0; j < 4; j++) {
    s.push(hex_chr[(n >>> (j * 8 + 4)) & 0x0f] + hex_chr[(n >>> (j * 8)) & 0x0f]);
  }
  return s.join('');
}

function hex(x: number[]) {
  const ret = new Array<string>(x.length);
  for (let i = 0; i < x.length; i++) ret[i] = hexify(x[i]);
  return ret.join('');
}

function add32(a: number, b: number) {
  return (a + b) & 0xffffffff;
}
