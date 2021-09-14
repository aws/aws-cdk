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

  test('asString()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' });
    expect(capture.asString()).toEqual('bar');

    matcher.test({ foo: 3 });
    expect(() => capture.asString()).toThrow(/expected to be string but found number/);
  });

  test('asNumber()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 3 });
    expect(capture.asNumber()).toEqual(3);

    matcher.test({ foo: 'bar' });
    expect(() => capture.asNumber()).toThrow(/expected to be number but found string/);
  });

  test('asArray()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: ['bar'] });
    expect(capture.asArray()).toEqual(['bar']);

    matcher.test({ foo: 'bar' });
    expect(() => capture.asArray()).toThrow(/expected to be array but found string/);
  });

  test('asObject()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: { fred: 'waldo' } });
    expect(capture.asObject()).toEqual({ fred: 'waldo' });

    matcher.test({ foo: 'bar' });
    expect(() => capture.asObject()).toThrow(/expected to be object but found string/);
  });

  test('nested within an array', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: ['bar', capture] });

    matcher.test({ foo: ['bar', 'baz'] });
    expect(capture.asString()).toEqual('baz');
  });
});