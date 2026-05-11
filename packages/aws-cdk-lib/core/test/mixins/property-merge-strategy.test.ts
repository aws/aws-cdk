import { PropertyMergeStrategy } from '../../lib/mixins/property-merge-strategy';

describe('PropertyMergeStrategy', () => {
  describe('combine', () => {
    const strategy = PropertyMergeStrategy.combine();

    test('merges simple properties', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      strategy.apply(target, source, ['b', 'c']);

      expect(target).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('merges nested objects', () => {
      const target = { config: { x: 1, y: 2 } };
      const source = { config: { y: 3, z: 4 } };

      strategy.apply(target, source, ['config']);

      expect(target).toEqual({ config: { x: 1, y: 3, z: 4 } });
    });

    test('only merges allowed keys', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 3 });
    });

    test('handles missing keys in target', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 2 });
    });

    test('handles missing keys in source', () => {
      const target = { a: 1, b: 2 };
      const source = { c: 3 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 2 });
    });

    test('overrides arrays', () => {
      const target = { items: [1, 2] };
      const source = { items: [3, 4] };

      strategy.apply(target, source, ['items']);

      expect(target).toEqual({ items: [3, 4] });
    });

    test('handles deeply nested objects', () => {
      const target = { a: { b: { c: 1, d: 2 } } };
      const source = { a: { b: { d: 3, e: 4 } } };

      strategy.apply(target, source, ['a']);

      expect(target).toEqual({ a: { b: { c: 1, d: 3, e: 4 } } });
    });

    test('handles undefined values', () => {
      const target: any = { a: 1, b: 2 };
      const source = { b: undefined };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: undefined });
    });

    test('does not remove unspecified keys', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source = { b: 20 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 20, c: 3 });
    });

    test('does not copy keys not in allowedKeys', () => {
      const target: any = { a: 1 };
      const source = { b: 2, c: 3 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 2 });
      expect('c' in target).toBe(false);
    });

    test('handles objects with circular references', () => {
      const target: any = { a: 1, node: {} };
      target.node.parent = target;
      const source = { b: 2 };

      expect(() => strategy.apply(target, source, ['b'])).not.toThrow();
      expect(target).toEqual({ a: 1, b: 2, node: { parent: target } });
    });

    test('does not traverse circular references in target', () => {
      const target: any = { prop1: 'value1', circular: {} };
      target.circular.ref = target;
      target.circular.deep = { ref: target };
      const source = { prop1: 'updated', prop2: 'new' };

      expect(() => strategy.apply(target, source, ['prop1', 'prop2'])).not.toThrow();
      expect(target.prop1).toBe('updated');
      expect(target.prop2).toBe('new');
      expect(target.circular.ref).toBe(target);
    });

    test('prevents prototype pollution', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      strategy.apply(target, source, ['__proto__', 'constructor', 'prototype', 'b']);

      expect(target).toEqual({ a: 1, b: 2 });
      expect(Object.prototype).not.toHaveProperty('polluted');
    });
  });

  describe('override', () => {
    const strategy = PropertyMergeStrategy.override();

    test('assigns simple properties', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      strategy.apply(target, source, ['b', 'c']);

      expect(target).toEqual({ a: 1, b: 3, c: 4 });
    });

    test('only assigns allowed keys', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 3 });
    });

    test('does not deep merge nested objects', () => {
      const target = { config: { x: 1, y: 2 } };
      const source = { config: { y: 3, z: 4 } };

      strategy.apply(target, source, ['config']);

      expect(target).toEqual({ config: { y: 3, z: 4 } });
    });

    test('handles missing keys in source', () => {
      const target = { a: 1, b: 2 };
      const source = { c: 3 };

      strategy.apply(target, source, ['b']);

      expect(target).toEqual({ a: 1, b: 2 });
    });

    test('assigns arrays by reference', () => {
      const target: any = { items: [1, 2] };
      const arr = [3, 4];
      const source = { items: arr };

      strategy.apply(target, source, ['items']);

      expect(target.items).toBe(arr);
    });

    test('prevents prototype pollution', () => {
      const target = { a: 1 };
      const source = { b: 2 };

      strategy.apply(target, source, ['__proto__', 'constructor', 'prototype', 'b']);

      expect(target).toEqual({ a: 1, b: 2 });
      expect(Object.prototype).not.toHaveProperty('polluted');
    });
  });
});
