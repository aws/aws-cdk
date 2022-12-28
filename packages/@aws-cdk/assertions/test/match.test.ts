import { Matcher, Match } from '../lib';

describe('Matchers', () => {
  describe('exactly()', () => {
    let matcher: Matcher;

    test('simple literals', () => {
      matcher = Match.exact('foo');
      expectPass(matcher, 'foo');
      expectFailure(matcher, 'bar', [/Expected foo but received bar/]);
      expectFailure(matcher, 5, [/Expected type string but received number/]);

      matcher = Match.exact(3);
      expectPass(matcher, 3);
      expectFailure(matcher, 5, [/Expected 3 but received 5/]);
      expectFailure(matcher, 'foo', [/Expected type number but received string/]);

      matcher = Match.exact(true);
      expectPass(matcher, true);
      expectFailure(matcher, false, [/Expected true but received false/]);
      expectFailure(matcher, 'foo', [/Expected type boolean but received string/]);
    });

    test('arrays', () => {
      matcher = Match.exact([4]);
      expectPass(matcher, [4]);
      expectFailure(matcher, [4, 5], [/Too many elements in array/]);
      expectFailure(matcher, 'foo', [/Expected type array but received string/]);

      matcher = Match.exact(['foo', 3]);
      expectPass(matcher, ['foo', 3]);
      expectFailure(matcher, ['bar', 3], [/Expected foo but received bar at \/0/]);
      expectFailure(matcher, ['foo', 5], [/Expected 3 but received 5 at \/1/]);

      matcher = Match.exact([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
      expectPass(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }], [/Not enough elements in array/]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }], [
        'Expected fred but received flob at /1/waldo',
        'Expected flob but received fred at /1/wobble',
      ]);
      expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }], [/Missing key.*at \/1\/wobble/]);
    });

    test('objects', () => {
      matcher = Match.exact({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, 5, [/Expected type object but received number/]);
      expectFailure(matcher, ['3', 5], [/Expected type object but received array/]);
      expectFailure(matcher, { baz: 'qux' }, [
        'Unexpected key baz at /baz',
        /Missing key.*at \/foo/,
      ]);

      matcher = Match.exact({ foo: 'bar', baz: 5 });
      expectFailure(matcher, { foo: 'bar', baz: '5' }, [/Expected type number but received string at \/baz/]);
      expectFailure(matcher, { foo: 'bar', baz: 5, qux: 7 }, [/Unexpected key qux at \/qux/]);

      matcher = Match.exact({ foo: [2, 3], bar: 'baz' });
      expectPass(matcher, { foo: [2, 3], bar: 'baz' });
      expectFailure(matcher, {}, [
        /Missing key.*at \/foo/,
        /Missing key.*at \/bar/,
      ]);
      expectFailure(matcher, { bar: [2, 3], foo: 'baz' }, [
        'Expected type array but received string at /foo',
        'Expected type string but received array at /bar',
      ]);
      expectFailure(matcher, { foo: [3, 5], bar: 'baz' }, [
        'Expected 2 but received 3 at /foo/0',
        'Expected 3 but received 5 at /foo/1',
      ]);
    });

    test('nesting', () => {
      expect(() => Match.exact(Match.arrayWith(['foo']))).toThrow(/cannot directly contain another matcher/);
    });

    test('absent', () => {
      expect(() => Match.exact(Match.absent())).toThrow(/cannot directly contain another matcher/);
    });
  });

  describe('arrayWith()', () => {
    let matcher: Matcher;

    test('subset match', () => {
      matcher = Match.arrayWith([]);
      expectPass(matcher, []);
      expectPass(matcher, [3]);

      matcher = Match.arrayWith([3]);
      expectPass(matcher, [3]);
      expectPass(matcher, [3, 5]);
      expectPass(matcher, [1, 3, 5]);
      expectFailure(matcher, [5], [/Could not match arrayWith pattern 0/]);

      matcher = Match.arrayWith([5, false]);
      expectPass(matcher, [5, false, 'foo']);
      expectPass(matcher, [5, 'foo', false]);
      expectFailure(matcher, [5, 'foo'], [/Could not match arrayWith pattern 1/]);

      matcher = Match.arrayWith([{ foo: 'bar' }]);
      expectPass(matcher, [{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }]);
      expectPass(matcher, [{ foo: 'bar' }]);
      expectFailure(matcher, [{ foo: 'baz' }], [/Could not match arrayWith pattern 0/]);
      expectFailure(matcher, [{ baz: 'qux' }], [/Could not match arrayWith pattern 0/]);
    });

    test('not array', () => {
      matcher = Match.arrayWith([3]);
      expectFailure(matcher, 3, [/Expected type array but received number/]);
      expectFailure(matcher, { val: 3 }, [/Expected type array but received object/]);
    });

    test('out of order', () => {
      matcher = Match.arrayWith([3, 5]);
      expectFailure(matcher, [5, 3], [/Could not match arrayWith pattern 1/]);
    });

    test('nested with ObjectLike', () => {
      matcher = Match.arrayWith([Match.objectLike({ foo: 'bar' })]);
      expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar' }]);
      expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }]);
      expectFailure(matcher, [{ foo: 'baz', fred: 'waldo' }], [/Could not match arrayWith pattern 0/]);
    });

    test('incompatible with absent', () => {
      matcher = Match.arrayWith(['foo', Match.absent()]);
      expect(() => matcher.test(['foo', 'bar'])).toThrow(/absent\(\) cannot be nested within arrayWith\(\)/);
    });

    test('incompatible with anyValue', () => {
      matcher = Match.arrayWith(['foo', Match.anyValue()]);
      expect(() => matcher.test(['foo', 'bar'])).toThrow(/anyValue\(\) cannot be nested within arrayWith\(\)/);
    });
  });

  describe('arrayEquals', () => {
    let matcher: Matcher;

    test('exact match', () => {
      matcher = Match.arrayEquals([5, false]);
      expectPass(matcher, [5, false]);
      expectFailure(matcher, [5, 'foo', false], [/Too many elements in array/]);
      expectFailure(matcher, [5, 'foo'], [/Expected type boolean but received string at \/1/]);
    });
  });

  describe('objectLike()', () => {
    let matcher: Matcher;

    test('basic', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, { foo: 'baz' }, [/Expected bar but received baz at \/foo/]);
      expectFailure(matcher, { foo: ['bar'] }, [/Expected type string but received array at \/foo/]);
      expectFailure(matcher, { bar: 'foo' }, [/Missing key.*at \/foo/]);
      expectPass(matcher, { foo: 'bar', baz: 'qux' });
    });

    test('not an object', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectFailure(matcher, ['foo', 'bar'], [/Expected type object but received array/]);
      expectFailure(matcher, 'foo', [/Expected type object but received string/]);

      matcher = Match.objectLike({ foo: Match.objectLike({ baz: 'qux' }) });
      expectFailure(matcher, { foo: 'baz' }, [/Expected type object but received string at \/foo/]);
    });

    test('partial', () => {
      matcher = Match.objectLike({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo' } });

      matcher = Match.objectLike({ baz: { fred: 'waldo' } });
      expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } });
    });

    test('ArrayMatch nested inside ObjectMatch', () => {
      matcher = Match.objectLike({
        foo: Match.arrayWith(['bar']),
      });
      expectPass(matcher, { foo: ['bar', 'baz'], fred: 'waldo' });
      expectFailure(matcher, { foo: ['baz'], fred: 'waldo' }, [/Could not match arrayWith pattern 0/]);
    });

    test('Partiality is maintained throughout arrays', () => {
      // Before this fix:
      //
      //   - objectLike({ x: { LITERAL }) ==> LITERAL would be matched partially as well
      //   - objectLike({ xs: [ { LITERAL } ] }) ==> but here LITERAL would be matched fully
      //
      // That passing through an array resets the partial matching to full is a
      // surprising inconsistency.
      //
      matcher = Match.objectLike({
        foo: [{ bar: 'bar' }],
      });
      expectPass(matcher, { foo: [{ bar: 'bar' }] }); // Trivially true
      expectPass(matcher, { boo: 'boo', foo: [{ bar: 'bar' }] }); // Additional members at top level okay
      expectPass(matcher, { foo: [{ bar: 'bar', boo: 'boo' }] }); // Additional members at inner level okay
    });

    test('absent', () => {
      matcher = Match.objectLike({ foo: Match.absent() });
      expectPass(matcher, { bar: 'baz' });
      expectFailure(matcher, { foo: 'baz' }, [/key should be absent at \/foo/]);
    });
  });

  describe('objectEquals()', () => {
    let matcher: Matcher;

    test('exact match', () => {
      matcher = Match.objectEquals({ foo: 'bar' });
      expectPass(matcher, { foo: 'bar' });
      expectFailure(matcher, { foo: 'bar', baz: 'qux' }, [/Unexpected key baz at \/baz/]);
    });
  });

  describe('not()', () => {
    let matcher: Matcher;

    test('literal', () => {
      matcher = Match.not('foo');
      expectPass(matcher, 'bar');
      expectPass(matcher, 3);

      expectFailure(matcher, 'foo', ['Found unexpected match: "foo"']);
    });

    test('object', () => {
      matcher = Match.not({ foo: 'bar' });
      expectPass(matcher, 'bar');
      expectPass(matcher, 3);
      expectPass(matcher, { foo: 'baz' });
      expectPass(matcher, { bar: 'foo' });

      const msg = [
        'Found unexpected match: {',
        '  "foo": "bar"',
        '}',
      ].join('\n');
      expectFailure(matcher, { foo: 'bar' }, [msg]);
    });

    test('array', () => {
      matcher = Match.not(['foo', 'bar']);
      expectPass(matcher, 'foo');
      expectPass(matcher, []);
      expectPass(matcher, ['bar']);
      expectPass(matcher, ['foo', 3]);

      const msg = [
        'Found unexpected match: [',
        '  "foo",',
        '  "bar"',
        ']',
      ].join('\n');
      expectFailure(matcher, ['foo', 'bar'], [msg]);
    });

    test('as a nested matcher', () => {
      matcher = Match.exact({
        foo: { bar: Match.not([1, 2]) },
      });

      expectPass(matcher, {
        foo: { bar: [1] },
      });
      expectPass(matcher, {
        foo: { bar: ['baz'] },
      });

      const msg = [
        'Found unexpected match: [',
        '  1,',
        '  2',
        '] at /foo/bar',
      ].join('\n');
      expectFailure(matcher, {
        foo: { bar: [1, 2] },
      }, [msg]);
    });

    test('with nested matcher', () => {
      matcher = Match.not({
        foo: { bar: Match.arrayWith([1]) },
      });

      expectPass(matcher, {
        foo: { bar: [2] },
      });
      expectPass(matcher, 'foo');

      const msg = [
        'Found unexpected match: {',
        '  "foo": {',
        '    "bar": [',
        '      1,',
        '      2',
        '    ]',
        '  }',
        '}',
      ].join('\n');
      expectFailure(matcher, {
        foo: { bar: [1, 2] },
      }, [msg]);
    });
  });

  describe('anyValue()', () => {
    let matcher: Matcher;

    test('simple', () => {
      matcher = Match.anyValue();
      expectPass(matcher, 'foo');
      expectPass(matcher, 5);
      expectPass(matcher, false);
      expectPass(matcher, []);
      expectPass(matcher, {});

      expectFailure(matcher, null, ['Expected a value but found none']);
      expectFailure(matcher, undefined, ['Expected a value but found none']);
    });

    test('nested in array', () => {
      matcher = Match.arrayEquals(['foo', Match.anyValue(), 'bar']);
      expectPass(matcher, ['foo', 'baz', 'bar']);
      expectPass(matcher, ['foo', 3, 'bar']);

      expectFailure(matcher, ['foo', null, 'bar'], ['Expected a value but found none at /1']);
    });

    test('nested in object', () => {
      matcher = Match.objectLike({ foo: Match.anyValue() });
      expectPass(matcher, { foo: 'bar' });
      expectPass(matcher, { foo: [1, 2] });

      expectFailure(matcher, { foo: null }, ['Expected a value but found none at /foo']);
      expectFailure(matcher, {}, [/Missing key.*at \/foo/]);
    });
  });

  describe('serializedJson()', () => {
    let matcher: Matcher;

    test('all types', () => {
      matcher = Match.serializedJson({ Foo: 'Bar', Baz: 3, Boo: true, Fred: [1, 2] });
      expectPass(matcher, '{ "Foo": "Bar", "Baz": 3, "Boo": true, "Fred": [1, 2] }');
    });

    test('simple match', () => {
      matcher = Match.serializedJson({ Foo: 'Bar' });
      expectPass(matcher, '{ "Foo": "Bar" }');

      expectFailure(matcher, '{ "Foo": "Baz" }', [/Encoded JSON value does not match/, 'Expected Bar but received Baz at /Foo']);
      expectFailure(matcher, '{ "Foo": 4 }', [/Encoded JSON value does not match/, 'Expected type string but received number at /Foo']);
      expectFailure(matcher, '{ "Bar": "Baz" }', [
        /Encoded JSON value does not match/,
        'Unexpected key Bar at /Bar',
        /Missing key.*at \/Foo/,
      ]);
    });

    test('nested matcher', () => {
      matcher = Match.serializedJson(Match.objectLike({
        Foo: Match.arrayWith(['Bar']),
      }));

      expectPass(matcher, '{ "Foo": ["Bar"] }');
      expectPass(matcher, '{ "Foo": ["Bar", "Baz"] }');
      expectPass(matcher, '{ "Foo": ["Bar", "Baz"], "Fred": "Waldo" }');

      expectFailure(matcher, '{ "Foo": ["Baz"] }', ['Could not match arrayWith pattern 0']);
      expectFailure(matcher, '{ "Bar": ["Baz"] }', [/Missing key.*at \/Foo/]);
    });

    test('invalid json string', () => {
      matcher = Match.serializedJson({ Foo: 'Bar' });

      expectFailure(matcher, '{ "Foo"', [/invalid JSON string/i]);
    });
  });

  describe('absent', () => {
    let matcher: Matcher;

    test('simple', () => {
      matcher = Match.absent();
      expectFailure(matcher, 'foo', ['Received foo, but key should be absent']);
      expectPass(matcher, undefined);
    });

    test('nested in object', () => {
      matcher = Match.objectLike({ foo: Match.absent() });
      expectFailure(matcher, { foo: 'bar' }, [/key should be absent at \/foo/]);
      expectFailure(matcher, { foo: [1, 2] }, [/key should be absent at \/foo/]);
      expectFailure(matcher, { foo: null }, [/key should be absent at \/foo/]);

      expectPass(matcher, { foo: undefined });
      expectPass(matcher, {});
    });
  });

  describe('stringLikeRegexp', () => {
    let matcher: Matcher;

    test('simple', () => {
      matcher = Match.stringLikeRegexp('.*includeHeaders = true.*');
      expectFailure(matcher, 'const includeHeaders = false;', [/did not match pattern/]);
      expectPass(matcher, 'const includeHeaders = true;');
    });

    test('nested in object', () => {
      matcher = Match.objectLike({ foo: Match.stringLikeRegexp('.*includeHeaders = true.*') });
      expectFailure(matcher, { foo: 'const includeHeaders = false;' }, [/did not match pattern/]);
      expectPass(matcher, { foo: 'const includeHeaders = true;' });
    });
  });
});

function expectPass(matcher: Matcher, target: any): void {
  const result = matcher.test(target);
  if (result.hasFailed()) {
    throw new Error(result.toHumanStrings().join('\n')); // eslint-disable-line jest/no-jasmine-globals
  }
}

function expectFailure(matcher: Matcher, target: any, expected: (string | RegExp)[] = []): void {
  const result = matcher.test(target);
  expect(result.failCount).toBeGreaterThan(0);
  const actual = result.toHumanStrings();

  const notFound = expected.filter(needle => !actual.some(haystack => {
    return typeof needle === 'string' ? haystack.includes(needle) : haystack.match(needle);
  }));

  if (notFound.length > 0) {
    throw new Error(`Patterns: ${notFound}\nMissing from error:\n${actual.join('\n')}`);
  }
}