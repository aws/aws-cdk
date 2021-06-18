import { CfnResource, Stack } from '@aws-cdk/core';
import { LiteralMatch, Match, TemplateAssertions } from '../lib';

describe('Matchers', () => {
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

  describe('LiteralMatcher', () => {
    let matcher: LiteralMatch;

    test('simple literals', () => {
      matcher = new LiteralMatch('x');
      expect(matcher.match('x')).toEqual(true);
      expect(matcher.match('y')).toEqual(false);
      expect(matcher.match(5)).toEqual(false);

      matcher = new LiteralMatch(3);
      expect(matcher.match(3)).toEqual(true);
      expect(matcher.match(5)).toEqual(false);
      expect(matcher.match('x')).toEqual(false);

      matcher = new LiteralMatch(true);
      expect(matcher.match(true)).toEqual(true);
      expect(matcher.match(false)).toEqual(false);
      expect(matcher.match('x')).toEqual(false);
    });

    test('arrays', () => {
      matcher = new LiteralMatch([]);
      expect(matcher.match([])).toEqual(true);
      expect(matcher.match([3])).toEqual(false);
      expect(matcher.match(['x'])).toEqual(false);
      expect(matcher.match('x')).toEqual(false);

      matcher = new LiteralMatch(['a', 3]);
      expect(matcher.match(['a', 3])).toEqual(true);
      expect(matcher.match([3, 'a'])).toEqual(false);
      expect(matcher.match(['a'])).toEqual(false);
      expect(matcher.match(['a', 3, 5])).toEqual(false);

      matcher = new LiteralMatch([{ a: 'x', b: 'y' }, { p: 'u', q: 'v' }]);
      expect(matcher.match([{ a: 'x', b: 'y' }, { p: 'u', q: 'v' }])).toEqual(true);
      expect(matcher.match([{ a: 'x', b: 'y' }, { p: 'v', q: 'u' }])).toEqual(false);
      expect(matcher.match([{ a: 'x', b: 'y' }, { p: 'u' }])).toEqual(false);
      expect(matcher.match([{ a: 'x', b: 'y' }])).toEqual(false);
      expect(matcher.match([])).toEqual(false);
    });

    test('objects', () => {
      matcher = new LiteralMatch({});
      expect(matcher.match({})).toEqual(true);
      expect(matcher.match({ a: '3' })).toEqual(false);
      expect(matcher.match(5)).toEqual(false);

      matcher = new LiteralMatch({ a: '3', b: 5 });
      expect(matcher.match({ a: '3', b: 5 })).toEqual(true);
      expect(matcher.match({ a: '3' })).toEqual(false);
      expect(matcher.match({ a: '3', b: '5' })).toEqual(false);
      expect(matcher.match({ a: '3', c: 5 })).toEqual(false);
      expect(matcher.match({ a: '3', b: 5, c: 7 })).toEqual(false);
      expect(matcher.match(['3', 5])).toEqual(false);

      matcher = new LiteralMatch({ a: [2, 3], b: 'x' });
      expect(matcher.match({ a: [2, 3], b: 'x' })).toEqual(true);
      expect(matcher.match({})).toEqual(false);
      expect(matcher.match({ b: [2, 3], a: 'x' })).toEqual(false);
      expect(matcher.match({ a: [3, 5], b: 'x' })).toEqual(false);
    });
  });
});