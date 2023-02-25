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

  test('no captures if not finished', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' }); // Not calling finished()
    expect(() => capture.asString()).toThrow(/No value captured/);
  });

  test('asString()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 'bar' }).finished();
    matcher.test({ foo: 3 }).finished();

    expect(capture.asString()).toEqual('bar');
    expect(capture.next()).toEqual(true);
    expect(() => capture.asString()).toThrow(/expected to be string but found number/);
  });

  test('asNumber()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: 3 }).finished();
    matcher.test({ foo: 'bar' }).finished();

    expect(capture.asNumber()).toEqual(3);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asNumber()).toThrow(/expected to be number but found string/);
  });

  test('asArray()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: ['bar'] }).finished();
    matcher.test({ foo: 'bar' }).finished();

    expect(capture.asArray()).toEqual(['bar']);
    expect(capture.next()).toEqual(true);
    expect(() => capture.asArray()).toThrow(/expected to be array but found string/);
  });

  test('asObject()', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture });

    matcher.test({ foo: { fred: 'waldo' } }).finished();
    matcher.test({ foo: 'bar' }).finished();

    expect(capture.asObject()).toEqual({ fred: 'waldo' });
    expect(capture.next()).toEqual(true);
    expect(() => capture.asObject()).toThrow(/expected to be object but found string/);
  });

  test('nested within an array', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: ['bar', capture] });

    matcher.test({ foo: ['bar', 'baz'] }).finished();
    expect(capture.asString()).toEqual('baz');
  });

  test('multiple captures', () => {
    const capture = new Capture();
    const matcher = Match.objectEquals({ foo: capture, real: true });

    matcher.test({ foo: 3, real: true }).finished();
    matcher.test({ foo: 5, real: true }).finished();
    matcher.test({ foo: 7, real: false }).finished();

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
    }).finished();

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
    }).finished();

    expect(() => capture.asObject()).toThrow(/No value captured/);
  });

  test('capture in arraywith and objectlike', () => {
    const capture = new Capture();
    const matcher = Match.objectLike({
      People: Match.arrayWith([{
        Name: 'Alice',
        Attributes: [
          Match.objectLike({
            Name: 'HairColor',
            Value: capture,
          }),
        ],
      }]),
    });

    const result = matcher.test({
      People: [
        {
          Name: 'Alice',
          Attributes: [
            { Name: 'HairColor', Value: 'Black' },
          ],
        },
      ],
    });

    expect(result.isSuccess).toEqual(true);
    result.finished();
    expect(capture.asString()).toEqual('Black');
  });
});
