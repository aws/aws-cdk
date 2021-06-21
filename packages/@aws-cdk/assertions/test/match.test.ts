import { CfnResource, Stack } from '@aws-cdk/core';
import { ArrayWithMatch, ExactMatch, Match, ObjectLikeMatch, TemplateAssertions } from '../lib';

describe('Match', () => {
  test('absent', () => {
    const stack = new Stack();
    new CfnResource(stack, 'Resource', {
      type: 'Foo::Bar',
      properties: {
        baz: 'qux',
      },
    });

    const inspect = TemplateAssertions.fromStack(stack);
    inspect.hasResourceProperties('Foo::Bar', {
      fred: Match.absentProperty(),
    });

    expect(() => inspect.hasResourceProperties('Foo::Bar', {
      baz: Match.absentProperty(),
    })).toThrow(/None .* matches resource 'Foo::Bar'/);
  });
});

describe('ExactMatch', () => {
  let matcher: ExactMatch;

  test('simple literals', () => {
    matcher = new ExactMatch('foo');
    expect(matcher.test('foo')).toEqual(true);
    expect(matcher.test('bar')).toEqual(false);
    expect(matcher.test(5)).toEqual(false);

    matcher = new ExactMatch(3);
    expect(matcher.test(3)).toEqual(true);
    expect(matcher.test(5)).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);

    matcher = new ExactMatch(true);
    expect(matcher.test(true)).toEqual(true);
    expect(matcher.test(false)).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);
  });

  test('arrays', () => {
    matcher = new ExactMatch([]);
    expect(matcher.test([])).toEqual(true);
    expect(matcher.test([3])).toEqual(false);
    expect(matcher.test(['foo'])).toEqual(false);
    expect(matcher.test('foo')).toEqual(false);

    matcher = new ExactMatch(['foo', 3]);
    expect(matcher.test(['foo', 3])).toEqual(true);
    expect(matcher.test([3, 'foo'])).toEqual(false);
    expect(matcher.test(['foo'])).toEqual(false);
    expect(matcher.test(['foo', 3, 5])).toEqual(false);

    matcher = new ExactMatch([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }])).toEqual(true);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }])).toEqual(false);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }])).toEqual(false);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }])).toEqual(false);
    expect(matcher.test([])).toEqual(false);
  });

  test('objects', () => {
    matcher = new ExactMatch({});
    expect(matcher.test({})).toEqual(true);
    expect(matcher.test({ foo: 'bar' })).toEqual(false);
    expect(matcher.test(5)).toEqual(false);

    matcher = new ExactMatch({ foo: 'bar', baz: 5 });
    expect(matcher.test({ foo: 'bar', baz: 5 })).toEqual(true);
    expect(matcher.test({ foo: 'bar' })).toEqual(false);
    expect(matcher.test({ foo: 'bar', baz: '5' })).toEqual(false);
    expect(matcher.test({ foo: 'bar', qux: 5 })).toEqual(false);
    expect(matcher.test({ foo: 'bar', baz: 5, qux: 7 })).toEqual(false);
    expect(matcher.test(['3', 5])).toEqual(false);

    matcher = new ExactMatch({ foo: [2, 3], bar: 'baz' });
    expect(matcher.test({ foo: [2, 3], bar: 'baz' })).toEqual(true);
    expect(matcher.test({})).toEqual(false);
    expect(matcher.test({ bar: [2, 3], foo: 'baz' })).toEqual(false);
    expect(matcher.test({ foo: [3, 5], bar: 'baz' })).toEqual(false);
  });

  test('nesting', () => {
    expect(() => new ExactMatch(new ArrayWithMatch(['foo']))).toThrow(/cannot be nested/);
  });
});

describe('ArrayWithMatch', () => {
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

  test('not array', () => {
    matcher = new ArrayWithMatch([3]);
    expect(matcher.test(3)).toEqual(false);
    expect(matcher.test('3')).toEqual(false);
    expect(matcher.test({ val: 3 })).toEqual(false);
  });

  test('out of order', () => {
    matcher = new ArrayWithMatch([3, 5]);
    expect(matcher.test([5, 3])).toEqual(false);
  });

  test('nested with ObjectLike', () => {
    matcher = new ArrayWithMatch([new ObjectLikeMatch({ foo: 'bar' })]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }])).toEqual(true);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }])).toEqual(true);
  });
});

describe('ObjectLikeMatch', () => {
  let matcher: ObjectLikeMatch;

  test('basic', () => {
    matcher = new ObjectLikeMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar' })).toEqual(true);
    expect(matcher.test({ foo: 'baz' })).toEqual(false);
    expect(matcher.test({ foo: ['bar'] })).toEqual(false);
    expect(matcher.test({ bar: 'foo' })).toEqual(false);

    matcher = new ObjectLikeMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar', baz: 'qux' })).toEqual(true);
  });

  test('not an object', () => {
    matcher = new ObjectLikeMatch({ foo: new ObjectLikeMatch({ baz: 'qux' }) });
    expect(matcher.test({ foo: 'baz' })).toEqual(false);
  });

  test('nested with ArrayLike', () => {
    matcher = new ObjectLikeMatch({
      foo: new ArrayWithMatch(['bar']),
    });
    expect(matcher.test({ foo: ['bar', 'baz'], fred: 'waldo' })).toEqual(true);
  });
});