import { Box } from '../../lib/helpers-internal/box';
import { ArrayMergeStrategy, PropertyMergeStrategy } from '../../lib/mixins/property-merge-strategy';

describe('PropertyMergeStrategy - Box safety', () => {
  describe('combine with Box-backed target values', () => {
    test('replaces a Box-backed array with source array (default replace strategy)', () => {
      const box = Box.fromArray([1, 2, 3]);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { items: [4, 5] }, ['items']);

      // Result should be a Box (deferred), resolve it
      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([4, 5]);
    });

    test('appends to a Box-backed array', () => {
      const box = Box.fromArray(['a', 'b']);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: ['c', 'd'] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual(['a', 'b', 'c', 'd']);
    });

    test('prepends to a Box-backed array', () => {
      const box = Box.fromArray(['a', 'b']);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.prepend() });

      strategy.apply(target, { items: ['x', 'y'] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual(['x', 'y', 'a', 'b']);
    });

    test('replaceByIndex on a Box-backed array', () => {
      const box = Box.fromArray(['a', 'b', 'c', 'd']);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByIndex() });

      strategy.apply(target, { items: ['x', 'y'] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual(['x', 'y', 'c', 'd']);
    });

    test('replaceByKey on a Box-backed array of objects', () => {
      const box = Box.fromArray([{ id: 1, v: 'old' }, { id: 2, v: 'keep' }]);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: [{ id: 1, v: 'new' }, { id: 3, v: 'added' }] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([
        { id: 1, v: 'new' },
        { id: 2, v: 'keep' },
        { id: 3, v: 'added' },
      ]);
    });

    test('deep merges a Box-backed object with source object', () => {
      const box = Box.fromValue({ x: 1, y: 2 });
      const target: any = { config: box };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { config: { y: 3, z: 4 } }, ['config']);

      expect(Box.isBox(target.config)).toBe(true);
      expect(target.config.get()).toEqual({ x: 1, y: 3, z: 4 });
    });

    test('overwrites a Box-backed value with a primitive source', () => {
      const box = Box.fromValue('old');
      const target: any = { name: box };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { name: 'new' }, ['name']);

      expect(Box.isBox(target.name)).toBe(true);
      expect(target.name.get()).toEqual('new');
    });

    test('deferred merge reflects mutations to the Box made after apply', () => {
      const box = Box.fromArray([1, 2]);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: [99] }, ['items']);

      // Mutate the original box after apply
      box.push(3);

      // The combined box should reflect the mutation
      expect(target.items.get()).toEqual([1, 2, 3, 99]);
    });

    test('works with derived boxes', () => {
      const box = Box.fromArray([1, 2, 3]);
      const derived = box.derive(arr => arr.filter(x => x > 1));
      const target: any = { items: derived };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: [10] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([2, 3, 10]);
    });
  });

  describe('override with Box-backed target values', () => {
    test('override replaces Box with source value directly', () => {
      const box = Box.fromArray([1, 2, 3]);
      const target: any = { items: box };
      const strategy = PropertyMergeStrategy.override();

      strategy.apply(target, { items: [4, 5] }, ['items']);

      // Override does not care about boxes, just replaces
      expect(Box.isBox(target.items)).toBe(false);
      expect(target.items).toEqual([4, 5]);
    });
  });

  describe('combine with Box-backed source values', () => {
    test('appends a Box source to a plain target array', () => {
      const sourceBox = Box.fromArray([3, 4]);
      const target: any = { items: [1, 2] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([1, 2, 3, 4]);
    });

    test('replaces plain target array with Box source (default replace)', () => {
      const sourceBox = Box.fromArray([4, 5]);
      const target: any = { items: [1, 2, 3] };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([4, 5]);
    });

    test('prepends Box source before plain target array', () => {
      const sourceBox = Box.fromArray(['x', 'y']);
      const target: any = { items: ['a', 'b'] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.prepend() });

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual(['x', 'y', 'a', 'b']);
    });

    test('replaceByKey with Box source on plain target', () => {
      const sourceBox = Box.fromArray([{ id: 1, v: 'new' }]);
      const target: any = { items: [{ id: 1, v: 'old' }, { id: 2, v: 'keep' }] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([{ id: 1, v: 'new' }, { id: 2, v: 'keep' }]);
    });

    test('deep merges Box source object into plain target object', () => {
      const sourceBox = Box.fromValue({ y: 3, z: 4 });
      const target: any = { config: { x: 1, y: 2 } };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { config: sourceBox }, ['config']);

      expect(Box.isBox(target.config)).toBe(true);
      expect(target.config.get()).toEqual({ x: 1, y: 3, z: 4 });
    });

    test('deferred source Box reflects mutations after apply', () => {
      const sourceBox = Box.fromArray([10]);
      const target: any = { items: [1, 2] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: sourceBox }, ['items']);

      sourceBox.push(20);

      expect(target.items.get()).toEqual([1, 2, 10, 20]);
    });
  });

  describe('combine with both target and source as Boxes', () => {
    test('appends Box source to Box target', () => {
      const targetBox = Box.fromArray([1, 2]);
      const sourceBox = Box.fromArray([3, 4]);
      const target: any = { items: targetBox };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([1, 2, 3, 4]);
    });

    test('replaceByKey with both Boxes', () => {
      const targetBox = Box.fromArray([{ id: 1, v: 'old' }, { id: 2, v: 'keep' }]);
      const sourceBox = Box.fromArray([{ id: 1, v: 'new' }, { id: 3, v: 'added' }]);
      const target: any = { items: targetBox };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: sourceBox }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([
        { id: 1, v: 'new' },
        { id: 2, v: 'keep' },
        { id: 3, v: 'added' },
      ]);
    });

    test('deep merges two Box objects', () => {
      const targetBox = Box.fromValue({ x: 1, y: 2 });
      const sourceBox = Box.fromValue({ y: 3, z: 4 });
      const target: any = { config: targetBox };
      const strategy = PropertyMergeStrategy.combine();

      strategy.apply(target, { config: sourceBox }, ['config']);

      expect(Box.isBox(target.config)).toBe(true);
      expect(target.config.get()).toEqual({ x: 1, y: 3, z: 4 });
    });

    test('mutations to either Box are reflected in the combined result', () => {
      const targetBox = Box.fromArray(['a']);
      const sourceBox = Box.fromArray(['b']);
      const target: any = { items: targetBox };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: sourceBox }, ['items']);

      targetBox.push('c');
      sourceBox.push('d');

      expect(target.items.get()).toEqual(['a', 'c', 'b', 'd']);
    });
  });

  describe('array elements that are Boxes', () => {
    test('ArrayMergeStrategy.replace passes Box elements through as-is', () => {
      const elem = Box.fromValue('a');
      const strategy = ArrayMergeStrategy.replace();
      const result = strategy.merge([elem], ['b']);

      expect(Box.isBox(result)).toBe(false);
      expect(result).toEqual(['b']);
    });

    test('ArrayMergeStrategy.append passes Box elements through as-is', () => {
      const elem = Box.fromValue('a');
      const strategy = ArrayMergeStrategy.append();
      const result = strategy.merge([elem], ['b']);

      expect(Box.isBox(result)).toBe(false);
      expect(result[0]).toBe(elem);
      expect(result[1]).toBe('b');
    });

    test('ArrayMergeStrategy.prepend passes Box elements through as-is', () => {
      const elem = Box.fromValue('a');
      const strategy = ArrayMergeStrategy.prepend();
      const result = strategy.merge([elem], ['x']);

      expect(Box.isBox(result)).toBe(false);
      expect(result[0]).toBe('x');
      expect(result[1]).toBe(elem);
    });

    test('ArrayMergeStrategy.replaceByIndex passes Box elements through as-is', () => {
      const elem = Box.fromValue('a');
      const strategy = ArrayMergeStrategy.replaceByIndex();
      const result = strategy.merge([elem, 'b', 'c'], ['x']);

      expect(Box.isBox(result)).toBe(false);
      expect(result).toEqual(['x', 'b', 'c']);
    });

    test('ArrayMergeStrategy.replaceByKey directly resolves Box elements in target', () => {
      const elem = Box.fromValue({ id: 1, v: 'old' });
      const strategy = ArrayMergeStrategy.replaceByKey('id');
      const result = strategy.merge([elem], [{ id: 1, v: 'new' }]);

      expect(Box.isBox(result)).toBe(true);
      expect((result as any).get()).toEqual([{ id: 1, v: 'new' }]);
    });

    test('ArrayMergeStrategy.replaceByKey directly resolves Box elements in source', () => {
      const elem = Box.fromValue({ id: 1, v: 'new' });
      const strategy = ArrayMergeStrategy.replaceByKey('id');
      const result = strategy.merge([{ id: 1, v: 'old' }], [elem]);

      expect(Box.isBox(result)).toBe(true);
      expect((result as any).get()).toEqual([{ id: 1, v: 'new' }]);
    });

    test('ArrayMergeStrategy.replaceByKey passes through without deferring when no Boxes', () => {
      const strategy = ArrayMergeStrategy.replaceByKey('id');
      const result = strategy.merge([{ id: 1, v: 'a' }], [{ id: 1, v: 'b' }]);

      expect(Box.isBox(result)).toBe(false);
      expect(result).toEqual([{ id: 1, v: 'b' }]);
    });

    test('replaceByKey matches against Box elements by deferring comparison', () => {
      const elem1 = Box.fromValue({ id: 1, v: 'old' });
      const elem2 = Box.fromValue({ id: 2, v: 'keep' });
      const target: any = { items: [elem1, elem2] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: [{ id: 1, v: 'new' }] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([
        { id: 1, v: 'new' },
        { id: 2, v: 'keep' },
      ]);
    });

    test('replaceByKey appends unmatched source when target elements are Boxes', () => {
      const elem1 = Box.fromValue({ id: 1, v: 'a' });
      const target: any = { items: [elem1] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: [{ id: 2, v: 'b' }] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([
        { id: 1, v: 'a' },
        { id: 2, v: 'b' },
      ]);
    });

    test('replaceByKey with source elements as Boxes', () => {
      const sourceElem = Box.fromValue({ id: 1, v: 'new' });
      const target: any = { items: [{ id: 1, v: 'old' }, { id: 2, v: 'keep' }] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: [sourceElem] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([
        { id: 1, v: 'new' },
        { id: 2, v: 'keep' },
      ]);
    });

    test('replaceByKey with both target and source elements as Boxes', () => {
      const targetElem = Box.fromValue({ id: 1, v: 'old' });
      const sourceElem = Box.fromValue({ id: 1, v: 'new' });
      const target: any = { items: [targetElem] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByKey('id') });

      strategy.apply(target, { items: [sourceElem] }, ['items']);

      expect(Box.isBox(target.items)).toBe(true);
      expect(target.items.get()).toEqual([{ id: 1, v: 'new' }]);
    });

    test('replaceByIndex with Box elements in target passes them through', () => {
      const elem1 = Box.fromValue('a');
      const elem2 = Box.fromValue('b');
      const elem3 = Box.fromValue('c');
      const target: any = { items: [elem1, elem2, elem3] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.replaceByIndex() });

      strategy.apply(target, { items: ['x'] }, ['items']);

      // Box elements pass through; token resolution handles them later
      expect(Array.isArray(target.items)).toBe(true);
      expect(target.items[0]).toBe('x');
      expect(Box.isBox(target.items[1])).toBe(true);
      expect(Box.isBox(target.items[2])).toBe(true);
    });

    test('append with Box elements in target passes them through', () => {
      const elem1 = Box.fromValue('a');
      const target: any = { items: [elem1] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.append() });

      strategy.apply(target, { items: ['b'] }, ['items']);

      expect(Array.isArray(target.items)).toBe(true);
      expect(Box.isBox(target.items[0])).toBe(true);
      expect(target.items[1]).toBe('b');
    });

    test('prepend with Box elements in target passes them through', () => {
      const elem1 = Box.fromValue('a');
      const target: any = { items: [elem1] };
      const strategy = PropertyMergeStrategy.combine({ arrays: ArrayMergeStrategy.prepend() });

      strategy.apply(target, { items: ['x'] }, ['items']);

      expect(Array.isArray(target.items)).toBe(true);
      expect(target.items[0]).toBe('x');
      expect(Box.isBox(target.items[1])).toBe(true);
    });
  });
});
