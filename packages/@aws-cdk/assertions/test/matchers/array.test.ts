import { ArrayWithMatch, LiteralMatch } from '../../lib/matchers';

describe('ArrayWithMatcher', () => {
  let matcher: ArrayWithMatch;

  test('basic', () => {
    matcher = new ArrayWithMatch([]);
    expect(matcher.match([])).toEqual(true);
    expect(matcher.match([3])).toEqual(true);

    matcher = new ArrayWithMatch([3]);
    expect(matcher.match([3])).toEqual(true);
    expect(matcher.match([3, 5])).toEqual(true);
    expect(matcher.match([1, 3, 5])).toEqual(true);
    expect(matcher.match([5])).toEqual(false);
    expect(matcher.match([])).toEqual(false);

    matcher = new ArrayWithMatch([5, false]);
    expect(matcher.match([5, false, 'foo'])).toEqual(true);

    matcher = new ArrayWithMatch([{ foo: 'bar' }]);
    expect(matcher.match([{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }])).toEqual(true);
    expect(matcher.match([{ foo: 'bar' }])).toEqual(true);
    expect(matcher.match([{ foo: 'baz' }])).toEqual(false);
    expect(matcher.match([{ baz: 'qux' }])).toEqual(false);
  });

  test('out of order', () => {
    matcher = new ArrayWithMatch([3, 5]);
    expect(matcher.match([5, 3])).toEqual(false);
  });

  test('mix with LiteralMatcher', () => {
    matcher = new ArrayWithMatch([new LiteralMatch({ foo: 'bar' })]);
    expect(matcher.match([{ baz: 'qux' }, { foo: 'bar' }, { fred: 'waldo' }])).toEqual(true);

    matcher = new ArrayWithMatch([{ foo: new LiteralMatch('bar') }]);
    expect(matcher.match([{ baz: 'qux' }, { foo: 'bar' }, { fred: 'waldo' }])).toEqual(true);
  });
});