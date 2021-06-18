import { ArrayWithMatch, LiteralMatch } from '../../lib/matchers';

describe('ArrayWithMatcher', () => {
  let matcher: ArrayWithMatch;

  test('basic', () => {
    matcher = new ArrayWithMatch([]);
    expect(matcher.test([])).toEqual(true);
    expect(matcher.test([3])).toEqual(true);

    matcher = new ArrayWithMatch([3]);
    expect(matcher.test([3])).toEqual(true);
    expect(matcher.test([3, 5])).toEqual(true);
    expect(matcher.test([1, 3, 5])).toEqual(true);
    expect(matcher.test([5])).toEqual(false);
    expect(matcher.test([])).toEqual(false);

    matcher = new ArrayWithMatch([5, false]);
    expect(matcher.test([5, false, 'foo'])).toEqual(true);

    matcher = new ArrayWithMatch([{ foo: 'bar' }]);
    expect(matcher.test([{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }])).toEqual(true);
    expect(matcher.test([{ foo: 'bar' }])).toEqual(true);
    expect(matcher.test([{ foo: 'baz' }])).toEqual(false);
    expect(matcher.test([{ baz: 'qux' }])).toEqual(false);
  });

  test('out of order', () => {
    matcher = new ArrayWithMatch([3, 5]);
    expect(matcher.test([5, 3])).toEqual(false);
  });

  test('mix with LiteralMatcher', () => {
    matcher = new ArrayWithMatch([new LiteralMatch({ foo: 'bar' })]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }, { fred: 'waldo' }])).toEqual(true);

    matcher = new ArrayWithMatch([{ foo: new LiteralMatch('bar') }]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }, { fred: 'waldo' }])).toEqual(true);
  });
});