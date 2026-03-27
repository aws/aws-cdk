import { Lazy } from '../../lib';
import { resolvedEquals, resolvedExists, resolvedGet } from '../../lib/helpers-internal/reflections';

describe('resolvedGet', () => {
  test('returns value at simple path', () => {
    expect(resolvedGet({ a: { b: 'hello' } }, 'a.b', 'fallback')).toBe('hello');
  });

  test('returns value at numeric index path', () => {
    expect(resolvedGet({ items: ['zero', 'one', 'two'] }, 'items.1', 'fallback')).toBe('one');
  });

  test('returns deeply nested value', () => {
    const obj = { a: { b: [{ c: 42 }] } };
    expect(resolvedGet(obj, 'a.b.0.c', -1)).toBe(42);
  });

  test('returns undefined for missing intermediate segment', () => {
    expect(resolvedGet({ a: {} }, 'a.b.c', 'fallback')).toBeUndefined();
  });

  test('returns undefined for null intermediate segment', () => {
    expect(resolvedGet({ a: { b: null } }, 'a.b.c', 'fallback')).toBeUndefined();
  });

  test('returns undefined for missing root property', () => {
    expect(resolvedGet({}, 'missing.deep', 'fallback')).toBeUndefined();
  });

  test('returns fallback when root is a resolvable', () => {
    const token = Lazy.any({ produce: () => ({ nested: 'value' }) });
    expect(resolvedGet(token, 'nested', 'fallback')).toBe('fallback');
  });

  test('returns fallback when intermediate value is a resolvable', () => {
    const obj = { a: Lazy.any({ produce: () => ({ b: 'value' }) }) };
    expect(resolvedGet(obj, 'a.b', 'fallback')).toBe('fallback');
  });

  test('returns fallback when leaf value is a resolvable', () => {
    const obj = { a: { b: Lazy.any({ produce: () => 'value' }) } };
    expect(resolvedGet(obj, 'a.b', 'fallback')).toBe('fallback');
  });

  test('returns false for boolean fallback on resolvable', () => {
    const obj = { config: Lazy.any({ produce: () => ({ enabled: true }) }) };
    expect(resolvedGet(obj, 'config.enabled', false)).toBe(false);
  });

  test('returns actual boolean value when not a resolvable', () => {
    expect(resolvedGet({ config: { enabled: true } }, 'config.enabled', false)).toBe(true);
  });

  test('returns undefined fallback on resolvable', () => {
    const obj = { config: Lazy.any({ produce: () => 'kms' }) };
    expect(resolvedGet(obj, 'config', undefined)).toBeUndefined();
  });
});

describe('resolvedExists', () => {
  test('returns true when property exists', () => {
    expect(resolvedExists({ a: { b: 'hello' } }, 'a.b')).toBe(true);
  });

  test('returns true when property is falsy but defined', () => {
    expect(resolvedExists({ a: { b: false } }, 'a.b')).toBe(true);
    expect(resolvedExists({ a: { b: 0 } }, 'a.b')).toBe(true);
    expect(resolvedExists({ a: { b: '' } }, 'a.b')).toBe(true);
    expect(resolvedExists({ a: { b: null } }, 'a.b')).toBe(true);
  });

  test('returns false when property is undefined', () => {
    expect(resolvedExists({ a: {} }, 'a.b')).toBe(false);
  });

  test('returns false when intermediate is null', () => {
    expect(resolvedExists({ a: { b: null } }, 'a.b.c')).toBe(false);
  });

  test('returns false when intermediate is missing', () => {
    expect(resolvedExists({}, 'a.b')).toBe(false);
  });

  test('returns undefined when obj is undefined', () => {
    expect(resolvedExists(undefined, 'a')).toBeUndefined();
  });

  test('returns undefined when obj is null', () => {
    expect(resolvedExists(null, 'a')).toBeUndefined();
  });

  test('returns undefined when intermediate is a resolvable', () => {
    const obj = { a: Lazy.any({ produce: () => ({ b: 'value' }) }) };
    expect(resolvedExists(obj, 'a.b')).toBeUndefined();
  });

  test('returns undefined when leaf is a resolvable', () => {
    const obj = { a: { b: Lazy.any({ produce: () => 'value' }) } };
    expect(resolvedExists(obj, 'a.b')).toBeUndefined();
  });

  test('returns true for nested array index', () => {
    expect(resolvedExists({ items: ['zero', 'one'] }, 'items.0')).toBe(true);
  });

  test('returns false for out-of-bounds array index', () => {
    expect(resolvedExists({ items: ['zero'] }, 'items.5')).toBe(false);
  });
});

describe('resolvedEquals', () => {
  test('returns true when value matches expected', () => {
    expect(resolvedEquals({ a: { b: true } }, 'a.b', true)).toBe(true);
  });

  test('returns false when value differs from expected', () => {
    expect(resolvedEquals({ a: { b: false } }, 'a.b', true)).toBe(false);
  });

  test('returns false when property is not configured', () => {
    expect(resolvedEquals({ a: {} }, 'a.b', true)).toBe(false);
  });

  test('returns false when intermediate is null', () => {
    expect(resolvedEquals({ a: null }, 'a.b', true)).toBe(false);
  });

  test('returns undefined when obj is undefined', () => {
    expect(resolvedEquals(undefined, 'a', true)).toBeUndefined();
  });

  test('returns undefined when obj is null', () => {
    expect(resolvedEquals(null, 'a', true)).toBeUndefined();
  });

  test('returns undefined when intermediate is a resolvable', () => {
    const obj = { a: Lazy.any({ produce: () => ({ b: true }) }) };
    expect(resolvedEquals(obj, 'a.b', true)).toBeUndefined();
  });

  test('returns undefined when leaf is a resolvable', () => {
    const obj = { a: { b: Lazy.any({ produce: () => true }) } };
    expect(resolvedEquals(obj, 'a.b', true)).toBeUndefined();
  });

  test('uses strict equality', () => {
    expect(resolvedEquals({ a: 1 }, 'a', '1')).toBe(false);
    expect(resolvedEquals({ a: 1 }, 'a', 1)).toBe(true);
  });
});
