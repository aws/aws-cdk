/* eslint-disable jest/no-commented-out-tests */
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
    expect(matcher.test('foo')).toEqual([]);
    expect(matcher.test('bar')).toEqual([{ path: [], message: 'Expected foo but received bar' }]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected type string but received number' }]);

    matcher = new ExactMatch(3);
    expect(matcher.test(3)).toEqual([]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected 3 but received 5' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type number but received string' }]);

    matcher = new ExactMatch(true);
    expect(matcher.test(true)).toEqual([]);
    expect(matcher.test(false)).toEqual([{ path: [], message: 'Expected true but received false' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type boolean but received string' }]);
  });

  test('arrays', () => {
    matcher = new ExactMatch([4]);
    expect(matcher.test([4])).toEqual([]);
    expect(matcher.test([4, 5])).toEqual([{ path: [], message: 'Expected array of length 1 but received 2' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type array but received string' }]);

    matcher = new ExactMatch(['foo', 3]);
    expect(matcher.test(['foo', 3])).toEqual([]);
    expect(matcher.test(['bar', 3])).toEqual([{ path: ['[0]'], message: 'Expected foo but received bar' }]);
    expect(matcher.test(['foo', 5])).toEqual([{ path: ['[1]'], message: 'Expected 3 but received 5' }]);

    matcher = new ExactMatch([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }])).toEqual([]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }])).toEqual([{ path: [], message: 'Expected array of length 2 but received 1' }]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }])).toEqual([
      { path: ['[1]', '/waldo'], message: 'Expected fred but received flob' },
      { path: ['[1]', '/wobble'], message: 'Expected flob but received fred' },
    ]);
    expect(matcher.test([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }])).toEqual([
      { path: ['[1]'], message: "Missing key 'wobble'" },
    ]);
  });

  test('objects', () => {
    matcher = new ExactMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar' })).toEqual([]);
    expect(matcher.test(5)).toEqual([{ path: [], message: 'Expected type object but received number' }]);
    expect(matcher.test(['3', 5])).toEqual([{ path: [], message: 'Expected type object but received array' }]);
    expect(matcher.test({ baz: 'qux' })).toEqual([
      { path: [], message: "Unexpected key 'baz'" },
      { path: [], message: "Missing key 'foo'" },
    ]);

    matcher = new ExactMatch({ foo: 'bar', baz: 5 });
    expect(matcher.test({ foo: 'bar', baz: '5' })).toEqual([{ path: ['/baz'], message: 'Expected type number but received string' }]);
    expect(matcher.test({ foo: 'bar', baz: 5, qux: 7 })).toEqual([{ path: [], message: "Unexpected key 'qux'" }]);

    matcher = new ExactMatch({ foo: [2, 3], bar: 'baz' });
    expect(matcher.test({ foo: [2, 3], bar: 'baz' })).toEqual([]);
    expect(matcher.test({})).toEqual([
      { path: [], message: "Missing key 'foo'" },
      { path: [], message: "Missing key 'bar'" },
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

  test('nesting', () => {
    expect(() => new ExactMatch(new ArrayWithMatch(['foo']))).toThrow(/cannot be nested/);
  });
});

describe('ArrayWithMatch', () => {
  let matcher: ArrayWithMatch;

  test('subset match', () => {
    matcher = new ArrayWithMatch([]);
    expect(matcher.test([])).toEqual([]);
    expect(matcher.test([3])).toEqual([]);

    matcher = new ArrayWithMatch([3]);
    expect(matcher.test([3])).toEqual([]);
    expect(matcher.test([3, 5])).toEqual([]);
    expect(matcher.test([1, 3, 5])).toEqual([]);
    expect(matcher.test([5])).toEqual([{ path: [], message: 'Missing element [3] at pattern index 0' }]);

    matcher = new ArrayWithMatch([5, false]);
    expect(matcher.test([5, false, 'foo'])).toEqual([]);
    expect(matcher.test([5, 'foo', false])).toEqual([]);
    expect(matcher.test([5, 'foo'])).toEqual([{ path: [], message: 'Missing element [false] at pattern index 1' }]);

    matcher = new ArrayWithMatch([{ foo: 'bar' }]);
    expect(matcher.test([{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }])).toEqual([]);
    expect(matcher.test([{ foo: 'bar' }])).toEqual([]);
    expect(matcher.test([{ foo: 'baz' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
    expect(matcher.test([{ baz: 'qux' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
  });

  test('exact match', () => {
    matcher = new ArrayWithMatch([5, false], { exact: true });
    expect(matcher.test([5, false])).toEqual([]);
    expect(matcher.test([5, 'foo', false])).toEqual([{ path: [], message: 'Expected array of length 2 but received 3' }]);
    expect(matcher.test([5, 'foo'])).toEqual([{ path: ['[1]'], message: 'Expected type boolean but received string' }]);
  });

  test('not array', () => {
    matcher = new ArrayWithMatch([3]);
    expect(matcher.test(3)).toEqual([{ path: [], message: 'Expected type array but received number' }]);
    expect(matcher.test({ val: 3 })).toEqual([{ path: [], message: 'Expected type array but received object' }]);
  });

  test('out of order', () => {
    matcher = new ArrayWithMatch([3, 5]);
    expect(matcher.test([5, 3])).toEqual([{ path: [], message: 'Missing element [5] at pattern index 1' }]);
  });

  test('nested with ObjectLike', () => {
    matcher = new ArrayWithMatch([new ObjectLikeMatch({ foo: 'bar' })]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar' }])).toEqual([]);
    expect(matcher.test([{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }])).toEqual([]);
    expect(matcher.test([{ foo: 'baz', fred: 'waldo' }])).toEqual([{ path: [], message: 'Missing element at pattern index 0' }]);
  });
});

describe('ObjectLikeMatch', () => {
  let matcher: ObjectLikeMatch;

  test('basic', () => {
    matcher = new ObjectLikeMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar' })).toEqual([]);
    expect(matcher.test({ foo: 'baz' })).toEqual([{ path: ['/foo'], message: 'Expected bar but received baz' }]);
    expect(matcher.test({ foo: ['bar'] })).toEqual([{ path: ['/foo'], message: 'Expected type string but received array' }]);
    expect(matcher.test({ bar: 'foo' })).toEqual([{ path: [], message: "Missing key 'foo'" }]);

    matcher = new ObjectLikeMatch({ foo: 'bar' });
    expect(matcher.test({ foo: 'bar', baz: 'qux' })).toEqual([]);
  });

  test('exact match', () => {
    matcher = new ObjectLikeMatch({ foo: 'bar' }, { exact: true });
    expect(matcher.test({ foo: 'bar', baz: 'qux' })).toEqual([{ path: [], message: "Unexpected key 'baz'" }]);
  });

  test('not an object', () => {
    matcher = new ObjectLikeMatch({ foo: 'bar' });
    expect(matcher.test(['foo', 'bar'])).toEqual([{ path: [], message: 'Expected type object but received array' }]);
    expect(matcher.test('foo')).toEqual([{ path: [], message: 'Expected type object but received string' }]);

    matcher = new ObjectLikeMatch({ foo: new ObjectLikeMatch({ baz: 'qux' }) });
    expect(matcher.test({ foo: 'baz' })).toEqual([{ path: ['/foo'], message: 'Expected type object but received string' }]);
  });

  test('nested with ArrayLike', () => {
    matcher = new ObjectLikeMatch({
      foo: new ArrayWithMatch(['bar']),
    });
    expect(matcher.test({ foo: ['bar', 'baz'], fred: 'waldo' })).toEqual([]);
    expect(matcher.test({ foo: ['baz'], fred: 'waldo' })).toEqual([{ path: ['/foo'], message: 'Missing element [bar] at pattern index 0' }]);
  });
});