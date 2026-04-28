import { Box } from '../lib/helpers-internal';

describe('Boxes', () => {
  describe('State (Boxes.fromValue)', () => {
    test('get() returns the initial value', () => {
      const box = Box.fromValue(42);
      expect(box.get()).toBe(42);
    });

    test('set() updates the value', () => {
      const box = Box.fromValue(1);
      box.set(2);
      expect(box.get()).toBe(2);
    });

    test('works with different types', () => {
      const strBox = Box.fromValue('hello');
      expect(strBox.get()).toBe('hello');

      const objBox = Box.fromValue({ a: 1, b: 'two' });
      expect(objBox.get()).toEqual({ a: 1, b: 'two' });
    });

    test('resolve() returns the current value', () => {
      const box = Box.fromValue(10);
      expect(box.resolve({} as any)).toBe(10);
      box.set(20);
      expect(box.resolve({} as any)).toBe(20);
    });

    test('getStackTraces() returns empty array when debug mode is off', () => {
      const box = Box.fromValue(1);
      expect(box.getStackTraces()).toEqual([]);
    });

    test('set() does not update when value is equal by default (===)', () => {
      const previousDebugMode = process.env.CDK_DEBUG;
      try {
        process.env.CDK_DEBUG = '1';
        const box = Box.fromValue(1);
        const tracesAfterInit = box.getStackTraces();
        box.set(1);
        expect(box.getStackTraces()).toEqual(tracesAfterInit);
        box.set(2);
        expect(box.getStackTraces()).not.toEqual(tracesAfterInit);
      } finally {
        process.env.CDK_DEBUG = previousDebugMode;
      }
    });

    test('set() uses custom equality function', () => {
      const previousDebugMode = process.env.CDK_DEBUG;
      try {
        process.env.CDK_DEBUG = '1';
        const box = Box.fromValue({ id: 1, name: 'a' }, {
          equals: (a, b) => a.id === b.id,
        });
        const tracesAfterInit = box.getStackTraces();

        // Same id, different name — should be considered equal
        box.set({ id: 1, name: 'b' });
        expect(box.get()).toEqual({ id: 1, name: 'a' });
        expect(box.getStackTraces()).toEqual(tracesAfterInit);

        // Different id — should update
        box.set({ id: 2, name: 'c' });
        expect(box.get()).toEqual({ id: 2, name: 'c' });
        expect(box.getStackTraces()).not.toEqual(tracesAfterInit);
      } finally {
        process.env.CDK_DEBUG = previousDebugMode;
      }
    });
  });

  describe('Combined (Boxes.combine)', () => {
    test('get() applies the function to unwrapped box values', () => {
      const a = Box.fromValue(3);
      const b = Box.fromValue('hi');
      const result = Box.combine({ a, b }, (x) => x.a + x.b.length);
      expect(result.get()).toBe(5);
    });

    test('reflects updates to source boxes', () => {
      const a = Box.fromValue(1);
      const b = Box.fromValue(10);
      const result = Box.combine({ a, b }, (x) => x.a * x.b);

      expect(result.get()).toBe(10);
      a.set(5);
      expect(result.get()).toBe(50);
    });

    test('set() throws', () => {
      const a = Box.fromValue(1);
      const result = Box.combine({ a }, (x) => x.a);
      // result is ReadableBox — no set() method at the type level
      expect('set' in result).toBe(false);
    });

    test('getStackTraces() collects traces from all source boxes', () => {
      const a = Box.fromValue(1);
      const b = Box.fromValue(2);
      const c = Box.fromValue(3);
      const result = Box.combine({ a, b, c }, (x) => x.a + x.b + x.c);
      expect(result.getStackTraces()).toEqual([
        ...a.getStackTraces(),
        ...b.getStackTraces(),
        ...c.getStackTraces(),
      ]);
    });

    test('works with a single box', () => {
      const a = Box.fromValue(7);
      const result = Box.combine({ a }, (x) => x.a * 2);
      expect(result.get()).toBe(14);
    });

    test('resolve() returns the computed value', () => {
      const a = Box.fromValue(2);
      const b = Box.fromValue(3);
      const result = Box.combine({ a, b }, (x) => x.a + x.b);
      expect(result.resolve({} as any)).toBe(5);
    });

    test('order is preserved', () => {
      const previousDebugMode = process.env.CDK_DEBUG;
      try {
        process.env.CDK_DEBUG = '1';
        const odds = Box.fromArray([1]);
        const evens = Box.fromArray([2]);
        // Due to the function we used, the numbers are not in order here
        const naturals = Box.combine({ o: odds, e: evens }, ({ o, e }) => o.concat(e));
        odds.push(3);
        evens.push(4);
        odds.push(5);

        // But we still want the stack traces to be
        expect(naturals.getStackTraces()).toEqual([
          odds.getStackTraces()[0],
          evens.getStackTraces()[0],
          odds.getStackTraces()[1],
          evens.getStackTraces()[1],
          odds.getStackTraces()[2],
        ]);
      } finally {
        process.env.CDK_DEBUG = previousDebugMode;
      }
    });

    describe('Computed (Box.derive)', () => {
      test('get() applies the transformation', () => {
        const box = Box.fromValue(5);
        const derived = box.derive((x) => x * 2);
        expect(derived.get()).toBe(10);
      });

      test('reflects updates to the source box', () => {
        const box = Box.fromValue(1);
        const derived = box.derive((x) => x + 100);

        expect(derived.get()).toBe(101);
        box.set(5);
        expect(derived.get()).toBe(105);
      });

      test('can be chained', () => {
        const box = Box.fromValue(2);
        const derived = box.derive((x) => x * 3).derive((x) => x + 1);
        expect(derived.get()).toBe(7);
      });

      test('set() is not available on derived boxes', () => {
        const box = Box.fromValue(1);
        const derived = box.derive((x) => x);
        // derived is ReadableBox — no set() method at the type level
        expect('set' in derived).toBe(false);
      });

      test('getStackTraces() delegates to the source box', () => {
        const box = Box.fromValue(1);
        const derived = box.derive((x) => x);
        expect(derived.getStackTraces()).toEqual(box.getStackTraces());
      });

      test('resolve() returns the derived value', () => {
        const box = Box.fromValue(3);
        const derived = box.derive((x) => x * x);
        expect(derived.resolve({} as any)).toBe(9);
      });
    });

    describe('ArrayBox (Boxes.fromArray)', () => {
      test('get() returns the array', () => {
        const box = Box.fromArray([1, 2, 3]);
        expect(box.get()).toEqual([1, 2, 3]);
      });

      test('push() appends to the array', () => {
        const box = Box.fromArray([1]);
        box.push(2);
        box.push(3);
        expect(box.get()).toEqual([1, 2, 3]);
      });

      test('set() followed by push() resets the array', () => {
        const box = Box.fromArray([1, 2, 3]);
        box.set([42]);
        box.push(43);
        expect(box.get()).toEqual([42, 43]);
      });

      test('push() accepts multiple arguments', () => {
        const box = Box.fromArray([1]);
        box.push(2, 3, 4);
        expect(box.get()).toEqual([1, 2, 3, 4]);
      });

      test('push() accepts spread operator', () => {
        const box = Box.fromArray([1]);
        const other = [2, 3, 4];
        box.push(...other);
        expect(box.get()).toEqual([1, 2, 3, 4]);
      });

      test('set() replaces the array', () => {
        const box = Box.fromArray([1, 2]);
        box.set([10, 20, 30]);
        expect(box.get()).toEqual([10, 20, 30]);
      });

      test('resolve() returns the array', () => {
        const box = Box.fromArray(['a', 'b']);
        expect(box.resolve({} as any)).toEqual(['a', 'b']);
      });

      test('map() transforms each element', () => {
        const box = Box.fromArray([1, 2, 3]);
        const doubled = box.map(x => x * 2);
        expect(doubled.get()).toEqual([2, 4, 6]);
      });

      test('map() reflects subsequent pushes', () => {
        const box = Box.fromArray([1]);
        const doubled = box.map(x => x * 2);
        box.push(2);
        box.push(3);
        expect(doubled.get()).toEqual([2, 4, 6]);
      });

      test('map() reflects set()', () => {
        const box = Box.fromArray([1, 2]);
        const doubled = box.map(x => x * 2);
        box.set([10, 20, 30]);
        expect(doubled.get()).toEqual([20, 40, 60]);
      });

      test('map() can change element type', () => {
        const box = Box.fromArray([1, 2, 3]);
        const strings = box.map(x => `item-${x}`);
        expect(strings.get()).toEqual(['item-1', 'item-2', 'item-3']);
      });

      test('map() returns a read-only box', () => {
        const box = Box.fromArray([1]);
        const mapped = box.map(x => x);
        expect('set' in mapped).toBe(false);
        expect('push' in mapped).toBe(false);
      });

      test('map() result resolves correctly', () => {
        const box = Box.fromArray([1, 2]);
        const doubled = box.map(x => x * 2);
        expect(doubled.resolve({} as any)).toEqual([2, 4]);
      });

      test('map() preserves stack traces from source', () => {
        const previousDebugMode = process.env.CDK_DEBUG;
        try {
          process.env.CDK_DEBUG = '1';
          const box = Box.fromArray([1]);
          box.push(2);
          const mapped = box.map(x => x * 2);
          expect(mapped.getStackTraces()).toEqual(box.getStackTraces());
        } finally {
          process.env.CDK_DEBUG = previousDebugMode;
        }
      });

      test('map() on empty array returns empty array', () => {
        const box = Box.fromArray<number>([]);
        const doubled = box.map(x => x * 2);
        expect(doubled.get()).toEqual([]);
      });
    });

    describe('Boxes.isBox', () => {
      test('returns true for state boxes', () => {
        expect(Box.isBox(Box.fromValue(1))).toBe(true);
      });

      test('returns true for zipped boxes', () => {
        const a = Box.fromValue(1);
        expect(Box.isBox(Box.combine({ a }, (x) => x.a))).toBe(true);
      });

      test('returns true for derived boxes', () => {
        expect(Box.isBox(Box.fromValue(1).derive((x) => x))).toBe(true);
      });

      test('returns true for array boxes', () => {
        expect(Box.isBox(Box.fromArray([]))).toBe(true);
      });

      test('returns false for plain objects', () => {
        expect(Box.isBox({})).toBe(false);
      });

      test('returns false for primitives', () => {
        expect(Box.isBox(42)).toBe(false);
        expect(Box.isBox('hello')).toBe(false);
        expect(Box.isBox(null)).toBeFalsy();
        expect(Box.isBox(undefined)).toBeFalsy();
      });
    });

    describe('composition', () => {
      test('derive on combine', () => {
        const a = Box.fromValue(10);
        const b = Box.fromValue(20);
        const result = Box.combine({ a, b }, (x) => x.a + x.b).derive((x) => x * 2);
        expect(result.get()).toBe(60);
      });

      test('combine of derived boxes', () => {
        const a = Box.fromValue(3).derive((x) => x * 2);
        const b = Box.fromValue(4).derive((x) => x * 2);
        const result = Box.combine({ a, b }, (x) => x.a + x.b);
        expect(result.get()).toBe(14);
      });
    });
  });
});
