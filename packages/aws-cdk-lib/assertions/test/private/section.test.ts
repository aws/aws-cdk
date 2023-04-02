import { Match } from '../../lib';
import { MatchFailure, matchSection, MatchSuccess } from '../../lib/private/section';

describe('section', () => {
  describe('matchSection', () => {
    test('success', () => {
      // GIVEN
      const matcher = Match.objectLike({ foo: 'bar' });
      const section = {
        Entry1: { foo: 'bar' },
        Entry2: { foo: 'bar', baz: 'qux' },
        Entry3: { fred: 'waldo' },
      };

      // WHEN
      const result = matchSection(section, matcher);

      // THEN
      expect(result.match).toEqual(true);
      const success = result as MatchSuccess;
      expect(Object.keys(success.matches).length).toEqual(2);
      expect(success.matches.Entry1).toEqual({ foo: 'bar' });
      expect(success.matches.Entry2).toEqual({ foo: 'bar', baz: 'qux' });
    });

    test('failure', () => {
      // GIVEN
      const matcher = Match.objectLike({ foo: 'bar' });
      const section = {
        Entry1: { foo: 'qux' },
        Entry3: { fred: 'waldo' },
      };

      // WHEN
      const result = matchSection(section, matcher);

      // THEN
      expect(result.match).toEqual(false);
      const success = result as MatchFailure;
      expect(success.analyzedCount).toEqual(2);

      const ckeys = Object.keys(success.closestResults);
      expect(ckeys).not.toEqual([]);
      expect(success.closestResults[ckeys[0]].target).toEqual({ foo: 'qux' });
    });
  });
});