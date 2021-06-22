import { ArrayMatch, LiteralMatch, Match, ObjectMatch } from '../lib';

describe('LiteralMatch', () => {
  let matcher: LiteralMatch;

  test('simple literals', () => {
    matcher = new LiteralMatch('foo');
    expect(matcher.test('foo')).toEqual([]);
    expect(matcher.test('bar')).toEqual([{ path: [], message: 'Expected foo but received bar' }]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected type string but received number' }]);

    matcher = new LiteralMatch(3);
    expect(matcher.test(3)).toEqual([]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected 3 but received 5' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type number but received string' }]);

    matcher = new LiteralMatch(true);
    expect(matcher.test(true)).toEqual([]);
    expect(matcher.test(false)).toEqual([{ path: [], message: 'Expected true but received false' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type boolean but received string' }]);
  });

  test('arrays', () => {
    matcher = new LiteralMatch([4]);
    expect(matcher.test([4])).toEqual([]);
    expect(matcher.test([4, 5])).toEqual([{ path: [], message: 'Expected array of length 1 but received 2' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type array but received string' }]);

    matcher = new LiteralMatch(['foo', 3]);
    expect(matcher.test(['foo', 3])).toEqual([]);
    expect(matcher.test(['bar', 3])).toEqual([{ path: ['[0]'], message: 'Expected foo but received bar' }]);
    expect(matcher.test(['foo', 5])).toEqual([{ path: ['[1]'], message: 'Expected 3 but received 5' }]);

    matcher = new LiteralMatch([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }])).toEqual([]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }])).toEqual([{ path: [], message: 'Expected array of length 2 but received 1' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }])).toEqual([
      { path: ['[1]', '/waldo'], message: 'Expected fred but received flob' },
      { path: ['[1]', '/wobble'], message: 'Expected flob but received fred' },
    ]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }])).toEqual([
      { path: ['[1]', '/wobble'], message: 'Missing key' },
    ]);
  });

  test('objects', () => {
    matcher = new LiteralMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar' })).toEqual([]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected type object but received number' }]);
    expect(matcher.test(['3', 5])).toEqual([{ path: [], message: 'Expected type object but received array' }]);
    expect(matcher.test({ baz: 'qux' })).toEqual([
      { path: ['/baz'], message: 'Unexpected key' },
      { path: ['/foo'], message: 'Missing key' },
    ]);

    matcher = new LiteralMatch({ foo: 'bar', baz: 5 });
    expect(matcher.test({ foo: 'bar', baz: '5' })).toEqual([{ path: ['/baz'], message: 'Expected type number but received string' }]);
    expect(matcher.test({ foo: 'bar', baz: 5, qux: 7 })).toEqual([{ path: ['/qux'], message: 'Unexpected key' }]);

    matcher = new LiteralMatch({ foo: [2, 3], bar: 'baz' });
    expect(matcher.test({ foo: [2, 3], bar: 'baz' })).toEqual([]);
    expect(matcher.test({})).toEqual([
      { path: ['/foo'], message: 'Missing key' },
      { path: ['/bar'], message: 'Missing key' },
    ]);
    expect(matcher.test({ bar: [2, 3], foo: 'baz' })).toEqual([
      { path: ['/foo'], message: 'Expected type array but received string' },
      { path: ['/bar'], message: 'Expected type string but received array' },
    ]);
    expect(matcher.test({ foo: [3, 5], bar: 'baz' })).toEqual([
      { path: ['/foo', '[0]'], message: 'Expected 2 but received 3' },
      { path: ['/foo', '[1]'], message: 'Expected 3 but received 5' },
    ]);
  });

  test('partial objects', () => {
    matcher = new LiteralMatch({ foo: 'bar' }, { partialObjects: true });
    expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo' } })).toEqual([]);

    matcher = new LiteralMatch({ baz: { fred: 'waldo' } }, { partialObjects: true });
    expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } })).toEqual([]);
  });

  test('nesting', () => {
    expect(() => new LiteralMatch(new ArrayMatch(['foo']))).toThrow(/cannot be nested/);
  });

  test('absent', () => {
    expect(() => new LiteralMatch(Match.absentProperty()).test('foo')).toThrow(/ABSENT/);
  });
});

describe('ArrayWithMatch', () => {
  let matcher: ArrayMatch;

  test('subset match', () => {
    matcher = new ArrayMatch([]);
    expect(matcher.test([])).toEqual([]);
    expect(matcher.test([3])).toEqual([]);

    matcher = new ArrayMatch([3]);
    expect(matcher.test([3])).toEqual([]);
    expect(matcher.test([3, 5])).toEqual([]);
    expect(matcher.test([1, 3, 5])).toEqual([]);
    expect(matcher.test([5])).toEqual([{ path: [], message: 'Missing element [3] at pattern index 0' }]);

    matcher = new ArrayMatch([5, false]);
    expect(matcher.test([5, false, 'foo'])).toEqual([]);
    expect(matcher.test([5, 'foo', false])).toEqual([]);
    expect(matcher.test([5, 'foo'])).toEqual([{ path: [], message: 'Missing element [false] at pattern index 1' }]);

    matcher = new ArrayMatch([{ foo: 'bar' }]);
    expect(matcher.test([{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }])).toEqual([]);
    expect(matcher.test([{ foo: 'bar' }])).toEqual([]);
    expect(matcher.test([{ foo: 'baz' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
    expect(matcher.test([{ baz: 'qux' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
  });

  test('exact match', () => {
    matcher = new ArrayMatch([5, false], { partial: false });
    expect(matcher.test([5, false])).toEqual([]);
    expect(matcher.test([5, 'foo', false])).toEqual([{ path: [], message: 'Expected array of length 2 but received 3' }]);
    expect(matcher.test([5, 'foo'])).toEqual([{ path: ['[1]'], message: 'Expected type boolean but received string' }]);
  });

  test('not array', () => {
    matcher = new ArrayMatch([3]);
    expect(matcher.test(3)).toEqual([{ path: [], message: 'Expected type array but received number' }]);
    expect(matcher.test({ val: 3 })).toEqual([{ path: [], message: 'Expected type array but received object' }]);
  });

  test('out of order', () => {
    matcher = new ArrayMatch([3, 5]);
    expect(matcher.test([5, 3])).toEqual([{ path: [], message: 'Missing element [5] at pattern index 1' }]);
  });

  test('nested with ObjectLike', () => {
    matcher = new ArrayMatch([new ObjectMatch({ foo: 'bar' })]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }])).toEqual([]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }])).toEqual([]);
    expect(matcher.test([{ foo: 'baz', fred: 'waldo' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
  });

  test('absent', () => {
    expect(() => new ArrayMatch([Match.absentProperty()]).test(['foo'])).toThrow(/ABSENT/);
  });
});

describe('ObjectLikeMatch', () => {
  let matcher: ObjectMatch;

  test('basic', () => {
    matcher = new ObjectMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar' })).toEqual([]);
    expect(matcher.test({ foo: 'baz' })).toEqual([{ path: ['/foo'], message: 'Expected bar but received baz' }]);
    expect(matcher.test({ foo: ['bar'] })).toEqual([{ path: ['/foo'], message: 'Expected type string but received array' }]);
    expect(matcher.test({ bar: 'foo' })).toEqual([{ path: ['/foo'], message: 'Missing key' }]);

    matcher = new ObjectMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar', baz: 'qux' })).toEqual([]);
  });

  test('exact match', () => {
    matcher = new ObjectMatch({ foo: 'bar' }, { partial: false });
    expect(matcher.test({ foo: 'bar', baz: 'qux' })).toEqual([{ path: ['/baz'], message: 'Unexpected key' }]);
  });

  test('not an object', () => {
    matcher = new ObjectMatch({ foo: 'bar' });
    expect(matcher.test(['foo', 'bar'])).toEqual([{ path: [], message: 'Expected type object but received array' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type object but received string' }]);

    matcher = new ObjectMatch({ foo: new ObjectMatch({ baz: 'qux' }) });
    expect(matcher.test({ foo: 'baz' })).toEqual([{ path: ['/foo'], message: 'Expected type object but received string' }]);
  });

  test('partial', () => {
    matcher = new ObjectMatch({ foo: 'bar' }, { partial: true });
    expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo' } })).toEqual([]);

    matcher = new ObjectMatch({ baz: { fred: 'waldo' } }, { partial: true });
    expect(matcher.test({ foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } })).toEqual([]);
  });

  test('nested with ArrayLike', () => {
    matcher = new ObjectMatch({
      foo: new ArrayMatch(['bar']),
    });
    expect(matcher.test({ foo: ['bar', 'baz'], fred: 'waldo' })).toEqual([]);
    expect(matcher.test({ foo: ['baz'], fred: 'waldo' })).toEqual([{ path: ['/foo'], message: 'Missing element [bar] at pattern index 0' }]);
  });

  test('absent', () => {
    matcher = new ObjectMatch({ foo: Match.absentProperty() });
    expect(matcher.test({ bar: 'baz' })).toEqual([]);
    expect(matcher.test({ foo: 'baz' })).toEqual([{ path: ['/foo'], message: 'Key should be absent' }]);
  });
});