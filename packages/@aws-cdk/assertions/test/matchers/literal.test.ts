import { LiteralMatch } from '../../lib/matchers';

describe('LiteralMatcher', () => {
  let matcher: LiteralMatch;

  test('simple literals', () => {
    matcher = new LiteralMatch('foo');
    expect(matcher.test('foo')).toEqual(true);
    expect(matcher.test('bar')).toEqual(false);
    expect(matcher.test(5)).toEqual(false);

    matcher = new LiteralMatch(3);
    expect(matcher.test(3)).toEqual(true);
    expect(matcher.test(5)).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);

    matcher = new LiteralMatch(true);
    expect(matcher.test(true)).toEqual(true);
    expect(matcher.test(false)).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);
  });

  test('arrays', () => {
    matcher = new LiteralMatch([]);
    expect(matcher.test([])).toEqual(true);
    expect(matcher.test([3])).toEqual(false);
    expect(matcher.test(['foo'])).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);

    matcher = new LiteralMatch(['foo', 3]);
    expect(matcher.test(['foo', 3])).toEqual(true);
    expect(matcher.test([3, 'foo'])).toEqual(false);
    expect(matcher.test(['foo'])).toEqual(false);
    expect(matcher.test(['foo', 3, 5])).toEqual(false);

    matcher = new LiteralMatch([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }])).toEqual(true);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }])).toEqual(false);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }])).toEqual(false);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }])).toEqual(false);
    expect(matcher.test([])).toEqual(false);
  });

  test('objects', () => {
    matcher = new LiteralMatch({});
    expect(matcher.test({})).toEqual(true);
    expect(matcher.test({ foo: 'bar' })).toEqual(false);
    expect(matcher.test(5)).toEqual(false);

    matcher = new LiteralMatch({ foo: 'bar', baz: 5 });
    expect(matcher.test({ foo: 'bar', baz: 5 })).toEqual(true);
    expect(matcher.test({ foo: 'bar' })).toEqual(false);
    expect(matcher.test({ foo: 'bar', baz: '5' })).toEqual(false);
    expect(matcher.test({ foo: 'bar', qux: 5 })).toEqual(false);
    expect(matcher.test({ foo: 'bar', baz: 5, qux: 7 })).toEqual(false);
    expect(matcher.test(['3', 5])).toEqual(false);

    matcher = new LiteralMatch({ foo: [2, 3], bar: 'baz' });
    expect(matcher.test({ foo: [2, 3], bar: 'baz' })).toEqual(true);
    expect(matcher.test({})).toEqual(false);
    expect(matcher.test({ bar: [2, 3], foo: 'baz' })).toEqual(false);
    expect(matcher.test({ foo: [3, 5], bar: 'baz' })).toEqual(false);
  });
});