import { Boxes } from '../lib';

describe('Boxes', () => {
  describe('State (Boxes.state)', () => {
    test('get() returns the initial value', () => {
      const box = Boxes.state(42);
      expect(box.get()).toBe(42);
    });

    test('set() updates the value', () => {
      const box = Boxes.state(1);
      box.set(2);
      expect(box.get()).toBe(2);
    });

    test('works with different types', () => {
      const strBox = Boxes.state('hello');
      expect(strBox.get()).toBe('hello');

      const objBox = Boxes.state({ a: 1, b: 'two' });
      expect(objBox.get()).toEqual({ a: 1, b: 'two' });
    });

    test('resolve() returns the current value', () => {
      const box = Boxes.state(10);
      expect(box.resolve({} as any)).toBe(10);
      box.set(20);
      expect(box.resolve({} as any)).toBe(20);
    });

    test('getStackTraces() returns empty array when debug mode is off', () => {
      const box = Boxes.state(1);
      expect(box.getStackTraces()).toEqual([]);
    });
  });

  describe('Zipped (Boxes.zipWith)', () => {
    test('get() applies the function to unwrapped box values', () => {
      const a = Boxes.state(3);
      const b = Boxes.state('hi');
      const result = Boxes.zipWith({ a, b }, (x) => x.a + x.b.length);
      expect(result.get()).toBe(5);
    });

    test('reflects updates to source boxes', () => {
      const a = Boxes.state(1);
      const b = Boxes.state(10);
      const result = Boxes.zipWith({ a, b }, (x) => x.a * x.b);

      expect(result.get()).toBe(10);
      a.set(5);
      expect(result.get()).toBe(50);
    });

    test('set() throws', () => {
      const a = Boxes.state(1);
      const result = Boxes.zipWith({ a }, (x) => x.a);
      // result is ReadableBox — no set() method at the type level
      expect('set' in result).toBe(false);
    });

    test('getStackTraces() collects traces from all source boxes', () => {
      const a = Boxes.state(1);
      const b = Boxes.state(2);
      const c = Boxes.state(3);
      const result = Boxes.zipWith({ a, b, c }, (x) => x.a + x.b + x.c);
      expect(result.getStackTraces()).toEqual([
        ...a.getStackTraces(),
        ...b.getStackTraces(),
        ...c.getStackTraces(),
      ]);
    });

    test('works with a single box', () => {
      const a = Boxes.state(7);
      const result = Boxes.zipWith({ a }, (x) => x.a * 2);
      expect(result.get()).toBe(14);
    });

    test('resolve() returns the computed value', () => {
      const a = Boxes.state(2);
      const b = Boxes.state(3);
      const result = Boxes.zipWith({ a, b }, (x) => x.a + x.b);
      expect(result.resolve({} as any)).toBe(5);
    });
  });

  describe('Computed (Box.derive)', () => {
    test('get() applies the transformation', () => {
      const box = Boxes.state(5);
      const derived = box.derive((x) => x * 2);
      expect(derived.get()).toBe(10);
    });

    test('reflects updates to the source box', () => {
      const box = Boxes.state(1);
      const derived = box.derive((x) => x + 100);

      expect(derived.get()).toBe(101);
      box.set(5);
      expect(derived.get()).toBe(105);
    });

    test('can be chained', () => {
      const box = Boxes.state(2);
      const derived = box.derive((x) => x * 3).derive((x) => x + 1);
      expect(derived.get()).toBe(7);
    });

    test('set() is not available on derived boxes', () => {
      const box = Boxes.state(1);
      const derived = box.derive((x) => x);
      // derived is ReadableBox — no set() method at the type level
      expect('set' in derived).toBe(false);
    });

    test('getStackTraces() delegates to the source box', () => {
      const box = Boxes.state(1);
      const derived = box.derive((x) => x);
      expect(derived.getStackTraces()).toEqual(box.getStackTraces());
    });

    test('resolve() returns the derived value', () => {
      const box = Boxes.state(3);
      const derived = box.derive((x) => x * x);
      expect(derived.resolve({} as any)).toBe(9);
    });
  });

  describe('ArrayBox (Boxes.array)', () => {
    test('get() returns the array', () => {
      const box = Boxes.array([1, 2, 3]);
      expect(box.get()).toEqual([1, 2, 3]);
    });

    test('push() appends to the array', () => {
      const box = Boxes.array([1]);
      box.push(2);
      box.push(3);
      expect(box.get()).toEqual([1, 2, 3]);
    });

    test('set() replaces the array', () => {
      const box = Boxes.array([1, 2]);
      box.set([10, 20, 30]);
      expect(box.get()).toEqual([10, 20, 30]);
    });

    test('resolve() returns the array', () => {
      const box = Boxes.array(['a', 'b']);
      expect(box.resolve({} as any)).toEqual(['a', 'b']);
    });
  });

  describe('Boxes.isBox', () => {
    test('returns true for state boxes', () => {
      expect(Boxes.isBox(Boxes.state(1))).toBe(true);
    });

    test('returns true for zipped boxes', () => {
      const a = Boxes.state(1);
      expect(Boxes.isBox(Boxes.zipWith({ a }, (x) => x.a))).toBe(true);
    });

    test('returns true for derived boxes', () => {
      expect(Boxes.isBox(Boxes.state(1).derive((x) => x))).toBe(true);
    });

    test('returns true for array boxes', () => {
      expect(Boxes.isBox(Boxes.array([]))).toBe(true);
    });

    test('returns false for plain objects', () => {
      expect(Boxes.isBox({})).toBe(false);
    });

    test('returns false for primitives', () => {
      expect(Boxes.isBox(42)).toBe(false);
      expect(Boxes.isBox('hello')).toBe(false);
      expect(Boxes.isBox(null)).toBeFalsy();
      expect(Boxes.isBox(undefined)).toBeFalsy();
    });
  });

  describe('composition', () => {
    test('derive on zipWith', () => {
      const a = Boxes.state(10);
      const b = Boxes.state(20);
      const result = Boxes.zipWith({ a, b }, (x) => x.a + x.b).derive((x) => x * 2);
      expect(result.get()).toBe(60);
    });

    test('zipWith of derived boxes', () => {
      const a = Boxes.state(3).derive((x) => x * 2);
      const b = Boxes.state(4).derive((x) => x * 2);
      const result = Boxes.zipWith({ a, b }, (x) => x.a + x.b);
      expect(result.get()).toBe(14);
    });
  });
});
