import type { CfnResource } from '../../lib';
import { Lazy } from '../../lib';
import { PropertyReflection } from '../../lib/helpers-internal/property-reflection';

/** Cast a plain object to CfnResource for testing PropertyReflection */
const r = (obj: any) => obj as CfnResource;

describe('PropertyReflection.of().get()', () => {
  test('returns value at simple path', () => {
    expect(PropertyReflection.of(r({ a: { b: 'hello' } }), 'a.b').get('fallback')).toBe('hello');
  });

  test('returns value at numeric index path', () => {
    expect(PropertyReflection.of(r({ items: ['zero', 'one', 'two'] }), 'items.1').get('fallback')).toBe('one');
  });

  test('returns deeply nested value', () => {
    expect(PropertyReflection.of(r({ a: { b: [{ c: 42 }] } }), 'a.b.0.c').get(-1)).toBe(42);
  });

  test('returns undefined for missing intermediate segment', () => {
    expect(PropertyReflection.of(r({ a: {} }), 'a.b.c').get('fallback')).toBeUndefined();
  });

  test('returns undefined for null intermediate segment', () => {
    expect(PropertyReflection.of(r({ a: { b: null } }), 'a.b.c').get('fallback')).toBeUndefined();
  });

  test('returns undefined for missing root property', () => {
    expect(PropertyReflection.of(r({}), 'missing.deep').get('fallback')).toBeUndefined();
  });

  test('returns fallback when root is a resolvable', () => {
    const token = Lazy.any({ produce: () => ({ nested: 'value' }) });
    expect(PropertyReflection.of(r(token), 'nested').get('fallback')).toBe('fallback');
  });

  test('returns fallback when intermediate value is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: Lazy.any({ produce: () => ({ b: 'value' }) }) }), 'a.b').get('fallback')).toBe('fallback');
  });

  test('returns fallback when leaf value is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: { b: Lazy.any({ produce: () => 'value' }) } }), 'a.b').get('fallback')).toBe('fallback');
  });

  test('returns false for boolean fallback on resolvable', () => {
    expect(PropertyReflection.of(r({ config: Lazy.any({ produce: () => ({ enabled: true }) }) }), 'config.enabled').get(false)).toBe(false);
  });

  test('returns actual boolean value when not a resolvable', () => {
    expect(PropertyReflection.of(r({ config: { enabled: true } }), 'config.enabled').get(false)).toBe(true);
  });

  test('returns undefined fallback on resolvable', () => {
    expect(PropertyReflection.of(r({ config: Lazy.any({ produce: () => 'kms' }) }), 'config').get(undefined)).toBeUndefined();
  });

  test('returns undefined by default when no fallback given', () => {
    expect(PropertyReflection.of(r({ a: { b: 'hello' } }), 'a.b').get()).toBe('hello');
    expect(PropertyReflection.of(r({ a: {} }), 'a.b').get()).toBeUndefined();
    expect(PropertyReflection.of(undefined, 'a').get()).toBeUndefined();
  });
});

describe('PropertyReflection.of().exists()', () => {
  test('returns true when property exists', () => {
    expect(PropertyReflection.of(r({ a: { b: 'hello' } }), 'a.b').exists()).toBe(true);
  });

  test('returns true when property is falsy but defined', () => {
    expect(PropertyReflection.of(r({ a: { b: false } }), 'a.b').exists()).toBe(true);
    expect(PropertyReflection.of(r({ a: { b: 0 } }), 'a.b').exists()).toBe(true);
    expect(PropertyReflection.of(r({ a: { b: '' } }), 'a.b').exists()).toBe(true);
  });

  test('returns false when property is undefined', () => {
    expect(PropertyReflection.of(r({ a: {} }), 'a.b').exists()).toBe(false);
  });

  test('returns false when intermediate is null', () => {
    expect(PropertyReflection.of(r({ a: { b: null } }), 'a.b.c').exists()).toBe(false);
  });

  test('returns false when intermediate is missing', () => {
    expect(PropertyReflection.of(r({}), 'a.b').exists()).toBe(false);
  });

  test('returns false when obj is undefined', () => {
    expect(PropertyReflection.of(undefined, 'a').exists()).toBe(false);
  });

  test('returns undefined when intermediate is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: Lazy.any({ produce: () => ({ b: 'value' }) }) }), 'a.b').exists()).toBeUndefined();
  });

  test('returns undefined when leaf is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: { b: Lazy.any({ produce: () => 'value' }) } }), 'a.b').exists()).toBeUndefined();
  });

  test('returns true for nested array index', () => {
    expect(PropertyReflection.of(r({ items: ['zero', 'one'] }), 'items.0').exists()).toBe(true);
  });

  test('returns false for out-of-bounds array index', () => {
    expect(PropertyReflection.of(r({ items: ['zero'] }), 'items.5').exists()).toBe(false);
  });
});

describe('PropertyReflection.of().equals()', () => {
  test('returns true when value matches expected', () => {
    expect(PropertyReflection.of(r({ a: { b: true } }), 'a.b').equals(true)).toBe(true);
  });

  test('returns false when value differs from expected', () => {
    expect(PropertyReflection.of(r({ a: { b: false } }), 'a.b').equals(true)).toBe(false);
  });

  test('returns false when property is not configured', () => {
    expect(PropertyReflection.of(r({ a: {} }), 'a.b').equals(true)).toBe(false);
  });

  test('returns false when intermediate is null', () => {
    expect(PropertyReflection.of(r({ a: null }), 'a.b').equals(true)).toBe(false);
  });

  test('returns false when obj is undefined', () => {
    expect(PropertyReflection.of(undefined, 'a').equals(true)).toBe(false);
  });

  test('returns undefined when intermediate is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: Lazy.any({ produce: () => ({ b: true }) }) }), 'a.b').equals(true)).toBeUndefined();
  });

  test('returns undefined when leaf is a resolvable', () => {
    expect(PropertyReflection.of(r({ a: { b: Lazy.any({ produce: () => true }) } }), 'a.b').equals(true)).toBeUndefined();
  });

  test('uses strict equality', () => {
    expect(PropertyReflection.of(r({ a: 1 }), 'a').equals('1')).toBe(false);
    expect(PropertyReflection.of(r({ a: 1 }), 'a').equals(1)).toBe(true);
  });
});
