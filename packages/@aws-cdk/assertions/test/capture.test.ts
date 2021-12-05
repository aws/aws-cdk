import { Capture, Match } from '../lib';

describe('Capture', () => {
  test('uncaptured', () => {
    const capture = new Capture();
    expect(() => capture.asString()).toThrow(/No value captured/);
  });

  test('nullish', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    const result = matcher.test({ foo: null });
    expect(result.failCount).toEqual(1);
    expect(result.toHumanStrings()[0]).toMatch(/Can only capture non-nullish values/);
  });

  test('no captures if not finalized', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' }); // Not calling finalize()
    expect(() => capture.asString()).toThrow(/No value captured/);
  });

  test('asString()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' }).finalize();
    matcher.test({ foo: 3 }).finalize();

    expect(capture.asString()).toEqual('bar');
    expect(capture.next()).toEqual(true);
    expect(() => capture.asString()).toThrow(/expected to be string but found number/);
  });

  test('asNumber()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 3 }).finalize();
    matcher.test({ foo: 'bar' }).finalize();

    expect(capture.asNumber()).toEqual(3);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asNumber()).toThrow(/expected to be number but found string/);
  });

  test('asArray()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: ['bar'] }).finalize();
    matcher.test({ foo: 'bar' }).finalize();

    expect(capture.asArray()).toEqual(['bar']);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asArray()).toThrow(/expected to be array but found string/);
  });

  test('asObject()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: { fred: 'waldo' } }).finalize();
    matcher.test({ foo: 'bar' }).finalize();

    expect(capture.asObject()).toEqual({ fred: 'waldo' });
    expect(capture.next()).toEqual(true);
    expect(() => capture.asObject()).toThrow(/expected to be object but found string/);
  });

  test('nested within an array', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: ['bar', capture] });

    matcher.test({ foo: ['bar', 'baz'] }).finalize();
    expect(capture.asString()).toEqual('baz');
  });

  test('multiple captures', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture, real: true });

    matcher.test({ foo: 3, real: true }).finalize();
    matcher.test({ foo: 5, real: true }).finalize();
    matcher.test({ foo: 7, real: false }).finalize();

    expect(capture.asNumber()).toEqual(3);
    expect(capture.next()).toEqual(true);
    expect(capture.asNumber()).toEqual(5);
    expect(capture.next()).toEqual(false);
  });

  test('nested pattern match', () => {
    const capture = new Capture(Match.objectLike({ bar: 'baz' }));
    const matcher = Match.objectLike({ foo: capture });

    matcher.test({
      foo: {
        bar: 'baz',
        fred: 'waldo',
      },
    }).finalize();

    expect(capture.asObject()).toEqual({ bar: 'baz', fred: 'waldo' });
    expect(capture.next()).toEqual(false);
  });

  test('nested pattern does not match', () => {
    const capture = new Capture(Match.objectLike({ bar: 'baz' }));
    const matcher = Match.objectLike({ foo: capture });

    matcher.test({
      foo: {
        fred: 'waldo',
      },
    }).finalize();

    expect(() => capture.asObject()).toThrow(/No value captured/);
  });
});