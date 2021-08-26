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
      expect(success.matches.length).toEqual(2);
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
      expect(success.closestResult).toBeDefined();
      expect(success.closestResult?.target).toEqual({ foo: 'qux' });
    });
  });
});