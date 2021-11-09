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

  test('multiple captures', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 3 });
    matcher.test({ foo: 5 });

    expect(capture.asNumber()).toEqual(3);
    expect(capture.next()).toEqual(true);
    expect(capture.asNumber()).toEqual(5);
    expect(capture.next()).toEqual(false);
  });

  test('asString()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' });
    matcher.test({ foo: 3 });

    expect(capture.asString()).toEqual('bar');
    expect(capture.next()).toEqual(true);
    expect(() => capture.asString()).toThrow(/expected to be string but found number/);
  });

  test('asNumber()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 3 });
    matcher.test({ foo: 'bar' });

    expect(capture.asNumber()).toEqual(3);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asNumber()).toThrow(/expected to be number but found string/);
  });

  test('asArray()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: ['bar'] });
    matcher.test({ foo: 'bar' });

    expect(capture.asArray()).toEqual(['bar']);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asArray()).toThrow(/expected to be array but found string/);
  });

  test('asObject()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: { fred: 'waldo' } });
    matcher.test({ foo: 'bar' });

    expect(capture.asObject()).toEqual({ fred: 'waldo' });
    expect(capture.next()).toEqual(true);
    expect(() => capture.asObject()).toThrow(/expected to be object but found string/);
  });

  test('nested within an array', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: ['bar', capture] });

    matcher.test({ foo: ['bar', 'baz'] });
    expect(capture.asString()).toEqual('baz');
  });
});