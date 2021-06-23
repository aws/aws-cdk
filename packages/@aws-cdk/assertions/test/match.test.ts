import { IMatcher, Match } from '../lib';

describe('Matchers', () => {
  describe('exactly()', () => {
    let matcher: IMatcher;

    test('simple literals', () => {
      matcher = Match.exactly('foo');
      expect(matcher.test('foo').hasFailed()).toEqual(false);
      expect(matcher.test('bar').toHumanStrings()).toEqual(['Expected foo but received bar']);
      expect(matcher.test(5).toHumanStrings()).toEqual(['Expected type string but received number']);

      matcher = Match.exactly(3);
      expect(matcher.test(3).hasFailed()).toEqual(false);
      expect(matcher.test(5).toHumanStrings()).toEqual(['Expected 3 but received 5']);
      expect(matcher.test('foo').toHumanStrings()).toEqual(['Expected type number but received string']);

      matcher = Match.exactly(true);
      expect(matcher.test(true).hasFailed()).toEqual(false);
      expect(matcher.test(false).toHumanStrings()).toEqual(['Expected true but received false']);
      expect(matcher.test('foo').toHumanStrings()).toEqual(['Expected type boolean but received string']);
    });

    test('arrays', () => {
      matcher = Match.exactly([4]);
      expect(matcher.test([4]).hasFailed()).toEqual(false);
      expect(matcher.test([4, 5]).toHumanStrings()).toEqual(['Expected array of length 1 but received 2']);
      expect(matcher.test('foo').toHumanStrings()).toEqual(['Expected type array but received string']);

      matcher = Match.exactly(['foo', 3]);
      expect(matcher.test(['foo', 3]).hasFailed()).toEqual(false);
      expect(matcher.test(['bar', 3]).toHumanStrings()).toEqual(['Expected foo but received bar at [0]']);
      expect(matcher.test(['foo', 5]).toHumanStrings()).toEqual(['Expected 3 but received 5 at [1]']);

      matcher = Match.exactly([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
      expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]).hasFailed()).toEqual(false);
      expect(matcher.test([{ foo: 'bar', baz: 'qux' }]).toHumanStrings()).toEqual(['Expected array of length 2 but received 1']);
      expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }]).toHumanStrings()).toEqual([
        'Expected fred but received flob at [1]/waldo',
        'Expected flob but received fred at [1]/wobble',
      ]);
      expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }]).toHumanStrings()).toEqual(['Missing key at [1]/wobble']);
    });

    test('objects', () => {
      matcher = Match.exactly({ foo: 'bar' });
      expect(matcher.test({ foo: 'bar' }).hasFailed()).toEqual(false);
      expect(matcher.test(5).toHumanStrings()).toEqual(['Expected type object but received number']);
      expect(matcher.test(['3', 5]).toHumanStrings()).toEqual(['Expected type object but received array']);
      expect(matcher.test({ baz: 'qux' }).toHumanStrings()).toEqual([
        'Unexpected key at /baz',
        'Missing key at /foo',
      ]);

      matcher = Match.exactly({ foo: 'bar', baz: 5 });
      expect(matcher.test({ foo: 'bar', baz: '5' }).toHumanStrings()).toEqual(['Expected type number but received string at /baz']);
      expect(matcher.test({ foo: 'bar', baz: 5, qux: 7 }).toHumanStrings()).toEqual(['Unexpected key at /qux']);

      matcher = Match.exactly({ foo: [2, 3], bar: 'baz' });
      expect(matcher.test({ foo: [2, 3], bar: 'baz' }).hasFailed()).toEqual(false);
      expect(matcher.test({}).toHumanStrings()).toEqual([
        'Missing key at /foo',
        'Missing key at /bar',
      ]);
      expect(matcher.test({ bar: [2, 3], foo: 'baz' }).toHumanStrings()).toEqual([
        'Expected type array but received string at /foo',
        'Expected type string but received array at /bar',
      ]);
      expect(matcher.test({ foo: [3, 5], bar: 'baz' }).toHumanStrings()).toEqual([
        'Expected 2 but received 3 at /foo[0]',
        'Expected 3 but received 5 at /foo[1]',
      ]);
    });

    test('nesting', () => {
      expect(() => Match.exactly(Match.arrayWith(['foo']))).toThrow(/cannot directly contain another matcher/);
    });

    test('absent', () => {
      expect(() => Match.exactly(Match.absentProperty()).test('foo')).toThrow(/absentProperty/);
    });
  });

  describe('arrayWith()', () => {
    let matcher: IMatcher;

    test('subset match', () => {
      matcher = Match.arrayWith([]);
      expect(matcher.test([]).hasFailed()).toEqual(false);
      expect(matcher.test([3]).hasFailed()).toEqual(false);

      matcher = Match.arrayWith([3]);
      expect(matcher.test([3]).hasFailed()).toEqual(false);
      expect(matcher.test([3, 5]).hasFailed()).toEqual(false);
      expect(matcher.test([1, 3, 5]).hasFailed()).toEqual(false);
      expect(matcher.test([5]).toHumanStrings()).toEqual(['Missing element [3] at pattern index 0']);

      matcher = Match.arrayWith([5, false]);
      expect(matcher.test([5, false, 'foo']).hasFailed()).toEqual(false);
      expect(matcher.test([5, 'foo', false]).hasFailed()).toEqual(false);
      expect(matcher.test([5, 'foo']).toHumanStrings()).toEqual(['Missing element [false] at pattern index 1']);

      matcher = Match.arrayWith([{ foo: 'bar' }]);
      expect(matcher.test([{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }]).hasFailed()).toEqual(false);
      expect(matcher.test([{ foo: 'bar' }]).hasFailed()).toEqual(false);
      expect(matcher.test([{ foo: 'baz' }]).toHumanStrings()).toEqual(['Missing element at pattern index 0']);
      expect(matcher.test([{ baz: 'qux' }]).toHumanStrings()).toEqual(['Missing element at pattern index 0']);
    });

    test('not array', () => {
      matcher = Match.arrayWith([3]);
      expect(matcher.test(3).toHumanStrings()).toEqual(['Expected type array but received number']);
      expect(matcher.test({ val: 3 }).toHumanStrings()).toEqual(['Expected type array but received object']);
    });

    test('out of order', () => {
      matcher = Match.arrayWith([3, 5]);
      expect(matcher.test([5, 3]).toHumanStrings()).toEqual(['Missing element [5] at pattern index 1']);
    });

    test('nested with ObjectLike', () => {
      matcher = Match.arrayWith([Match.objectLike({ foo: 'bar' })]);
      expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }]).hasFailed()).toEqual(false);
      expect(matcher.test([{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }]).hasFailed()).toEqual(false);
      expect(matcher.test([{ foo: 'baz', fred: 'waldo' }]).toHumanStrings()).toEqual(['Missing element at pattern index 0']);
    });

    test('absent', () => {
      expect(() => Match.arrayWith([Match.absentProperty()]).test(['foo'])).toThrow(/absentProperty/);
    });
  });

  describe('arrayEquals', () => {
    let matcher: IMatcher;

    test('exact match', () => {
      matcher = Match.arrayEquals([5, false]);
      expect(matcher.test([5, false]).hasFailed()).toEqual(false);
      expect(matcher.test([5, 'foo', false]).toHumanStrings()).toEqual(['Expected array of length 2 but received 3']);
      expect(matcher.test([5, 'foo']).toHumanStrings()).toEqual(['Expected type boolean but received string at [1]']);
    });
  });

  describe('objectLike()', () => {
    let matcher: IMatcher;

    test('basic', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expect(matcher.test({ foo: 'bar' }).hasFailed()).toEqual(false);
      expect(matcher.test({ foo: 'baz' }).toHumanStrings()).toEqual(['Expected bar but received baz at /foo']);
      expect(matcher.test({ foo: ['bar'] }).toHumanStrings()).toEqual(['Expected type string but received array at /foo']);
      expect(matcher.test({ bar: 'foo' }).toHumanStrings()).toEqual(['Missing key at /foo']);
      expect(matcher.test({ foo: 'bar', baz: 'qux' }).hasFailed()).toEqual(false);
    });

    test('not an object', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expect(matcher.test(['foo', 'bar']).toHumanStrings()).toEqual(['Expected type object but received array']);
      expect(matcher.test('foo').toHumanStrings()).toEqual(['Expected type object but received string']);

      matcher = Match.objectLike({ foo: Match.objectLike({ baz: 'qux' }) });
      expect(matcher.test({ foo: 'baz' }).toHumanStrings()).toEqual(['Expected type object but received string at /foo']);
    });

    test('partial', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo' } }).hasFailed()).toEqual(false);

      matcher = Match.objectLike({ baz: { fred: 'waldo' } });
      expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } }).hasFailed()).toEqual(false);
    });

    test('nested with ArrayMatch', () => {
      matcher = Match.objectLike({
        foo: Match.arrayWith(['bar']),
      });
      expect(matcher.test({ foo: ['bar', 'baz'], fred: 'waldo' }).hasFailed()).toEqual(false);
      expect(matcher.test({ foo: ['baz'], fred: 'waldo' }).toHumanStrings()).toEqual(['Missing element [bar] at pattern index 0 at /foo']);
    });

    test('absent', () => {
      matcher = Match.objectLike({ foo: Match.absentProperty() });
      expect(matcher.test({ bar: 'baz' }).hasFailed()).toEqual(false);
      expect(matcher.test({ foo: 'baz' }).toHumanStrings()).toEqual(['Key should be absent at /foo']);
    });
  });

  describe('objectEquals()', () => {
    let matcher: IMatcher;

    test('exact match', () => {
      matcher = Match.objectEquals({ foo: 'bar' });
      expect(matcher.test({ foo: 'bar' }).hasFailed()).toEqual(false);
      expect(matcher.test({ foo: 'bar', baz: 'qux' }).toHumanStrings()).toEqual(['Unexpected key at /baz']);
    });
  });
});