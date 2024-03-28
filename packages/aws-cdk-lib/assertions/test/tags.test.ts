import { App, Stack } from '../../core';
import { Match, Tags } from '../lib';

describe('Tags', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  describe('hasValues', () => {
    test('simple match', () => {
      const stack = new Stack(app, 'stack', {
        tags: { 'tag-one': 'tag-one-value' },
      });
      const tags = Tags.fromStack(stack);
      tags.hasValues({
        'tag-one': 'tag-one-value',
      });
    });

    test('with matchers', () => {
      const stack = new Stack(app, 'stack', {
        tags: { 'tag-one': 'tag-one-value' },
      });
      const tags = Tags.fromStack(stack);
      tags.hasValues({
        'tag-one': Match.anyValue(),
      });
    });

    describe('given multiple tags', () => {
      const stack = new Stack(app, 'stack', {
        tags: {
          'tag-one': 'tag-one-value',
          'tag-two': 'tag-2-value',
          'tag-three': 'tag-3-value',
          'tag-four': 'tag-4-value',
        },
      });
      const tags = Tags.fromStack(stack);

      test('partial match succeeds', ()=>{
        tags.hasValues({
          'tag-one': Match.anyValue(),
        });
      });

      test('complex match succeeds', ()=>{
        tags.hasValues(Match.objectEquals({
          'tag-one': Match.anyValue(),
          'non-existent': Match.absent(),
          'tag-three': Match.stringLikeRegexp('-3-'),
          'tag-two': 'tag-2-value',
          'tag-four': Match.anyValue(),
        }));
      });
    });

    test('no tags with absent matcher will fail', () => {
      const stack = new Stack(app, 'stack');
      const tags = Tags.fromStack(stack);

      // Since the tags are defaulted to the empty object, using the `absent()`
      // matcher will never work, instead throwing an error.
      expect(() => tags.hasValues(Match.absent())).toThrow(
        /^match.absent\(\) will never match Tags/i,
      );
    });

    test('no tags matches empty object successfully', () => {
      const stack = new Stack(app, 'stack');
      const tags = Tags.fromStack(stack);

      tags.hasValues(Match.exact({}));
    });

    test('no match', () => {
      const stack = new Stack(app, 'stack', {
        tags: { 'tag-one': 'tag-one-value' },
      });
      const tags = Tags.fromStack(stack);

      expect(() =>
        tags.hasValues({
          'tag-one': 'mismatched value',
        }),
      ).toThrow(/Expected mismatched value but received tag-one-value/);
    });
  });

  describe('hasNone', () => {
    test.each([undefined, {}])('matches empty: %s', (v) => {
      const stack = new Stack(app, 'stack', { tags: v });
      const tags = Tags.fromStack(stack);

      tags.hasNone();
    });

    test.each(<Record<string, string>[]>[
      { ['tagOne']: 'single-tag' },
      { ['tagOne']: 'first-value', ['tag-two']: 'second-value' },
    ])('does not match with values: %s', (v) => {
      const stack = new Stack(app, 'stack', { tags: v });
      const tags = Tags.fromStack(stack);

      expect(() => tags.hasNone()).toThrow(/unexpected key/i);
    });
  });

  describe('all', () => {
    test('simple match', () => {
      const stack = new Stack(app, 'stack', {
        tags: { 'tag-one': 'tag-one-value' },
      });
      const tags = Tags.fromStack(stack);
      expect(tags.all()).toStrictEqual({
        'tag-one': 'tag-one-value',
      });
    });

    test('no tags', () => {
      const stack = new Stack(app, 'stack');
      const tags = Tags.fromStack(stack);

      expect(tags.all()).toStrictEqual({});
    });

    test('empty tags', () => {
      const stack = new Stack(app, 'stack', { tags: {} });
      const tags = Tags.fromStack(stack);

      expect(tags.all()).toStrictEqual({});
    });
  });
});
