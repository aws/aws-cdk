import { Capture, Match, Matcher, MatchResult } from '../lib';

/**
 * The matcher engine lives in `core` and is re-exported by `aws-cdk-lib/assertions`.
 * These tests exercise it through the new **core** public surface directly (not via
 * assertions), to guard the relocation and the newly-exposed API.
 */
describe('matcher engine via core public API', () => {
  test('Match and Matcher are exported from core', () => {
    expect(typeof Match.objectLike).toBe('function');
    expect(typeof Matcher.isMatcher).toBe('function');
  });

  test('objectLike performs subset matching', () => {
    const matcher = Match.objectLike({ foo: 'bar' });
    expect(Matcher.isMatcher(matcher)).toBe(true);

    const pass: MatchResult = matcher.test({ foo: 'bar', baz: 'qux' });
    expect(pass.hasFailed()).toBe(false);

    const fail: MatchResult = matcher.test({ foo: 'nope' });
    expect(fail.hasFailed()).toBe(true);
  });

  test('exact matching fails on extra keys', () => {
    const result = Match.exact({ foo: 'bar' }).test({ foo: 'bar', extra: true });
    expect(result.hasFailed()).toBe(true);
  });

  test('Capture retrieves the matched value', () => {
    const capture = new Capture();
    const result = Match.objectLike({ foo: capture }).test({ foo: 'captured-value' });
    result.finished();
    expect(result.hasFailed()).toBe(false);
    expect(capture.asString()).toBe('captured-value');
  });
});
