// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
import { md5hash } from '../../../lib/assertions/private/hash';

describe('md5hash', () => {
  test('default', () => {
    const hash = md5hash({ key: 'value' });
    expect(hash).toEqual('a7353f7cddce808de0032747a0b7be50');
  });

  test('fails if falsy', () => {
    expect(() => md5hash(null)).toThrow(/falsy/);
    expect(() => md5hash(undefined)).toThrow(/falsy/);
    expect(() => md5hash({})).toThrow(/falsy/);
    expect(() => md5hash('')).toThrow(/falsy/);
    expect(() => md5hash([])).toThrow(/falsy/);
  });
});
