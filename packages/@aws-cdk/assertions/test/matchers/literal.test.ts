import { LiteralMatch } from '../../lib/matchers';

describe('LiteralMatcher', () => {
  let matcher: LiteralMatch;

  test('simple literals', () => {
    matcher = new LiteralMatch('foo');
    expect(matcher.match('foo')).toEqual(true);
    expect(matcher.match('bar')).toEqual(false);
    expect(matcher.match(5)).toEqual(false);

    matcher = new LiteralMatch(3);
    expect(matcher.match(3)).toEqual(true);
    expect(matcher.match(5)).toEqual(false);
    expect(matcher.match('foo')).toEqual(false);

    matcher = new LiteralMatch(true);
    expect(matcher.match(true)).toEqual(true);
    expect(matcher.match(false)).toEqual(false);
    expect(matcher.match('foo')).toEqual(false);
  });

  test('arrays', () => {
    matcher = new LiteralMatch([]);
    expect(matcher.match([])).toEqual(true);
    expect(matcher.match([3])).toEqual(false);
    expect(matcher.match(['foo'])).toEqual(false);
    expect(matcher.match('foo')).toEqual(false);

    matcher = new LiteralMatch(['foo', 3]);
    expect(matcher.match(['foo', 3])).toEqual(true);
    expect(matcher.match([3, 'foo'])).toEqual(false);
    expect(matcher.match(['foo'])).toEqual(false);
    expect(matcher.match(['foo', 3, 5])).toEqual(false);

    matcher = new LiteralMatch([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
    expect(matcher.match([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }])).toEqual(true);
    expect(matcher.match([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }])).toEqual(false);
    expect(matcher.match([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }])).toEqual(false);
    expect(matcher.match([{ foo: 'bar', baz: 'qux' }])).toEqual(false);
    expect(matcher.match([])).toEqual(false);
  });

  test('objects', () => {
    matcher = new LiteralMatch({});
    expect(matcher.match({})).toEqual(true);
    expect(matcher.match({ foo: 'bar' })).toEqual(false);
    expect(matcher.match(5)).toEqual(false);

    matcher = new LiteralMatch({ foo: 'bar', baz: 5 });
    expect(matcher.match({ foo: 'bar', baz: 5 })).toEqual(true);
    expect(matcher.match({ foo: 'bar' })).toEqual(false);
    expect(matcher.match({ foo: 'bar', baz: '5' })).toEqual(false);
    expect(matcher.match({ foo: 'bar', qux: 5 })).toEqual(false);
    expect(matcher.match({ foo: 'bar', baz: 5, qux: 7 })).toEqual(false);
    expect(matcher.match(['3', 5])).toEqual(false);

    matcher = new LiteralMatch({ foo: [2, 3], bar: 'baz' });
    expect(matcher.match({ foo: [2, 3], bar: 'baz' })).toEqual(true);
    expect(matcher.match({})).toEqual(false);
    expect(matcher.match({ bar: [2, 3], foo: 'baz' })).toEqual(false);
    expect(matcher.match({ foo: [3, 5], bar: 'baz' })).toEqual(false);
  });
});