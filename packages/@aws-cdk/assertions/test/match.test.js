"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('Matchers', () => {
    describe('exactly()', () => {
        let matcher;
        test('simple literals', () => {
            matcher = lib_1.Match.exact('foo');
            expectPass(matcher, 'foo');
            expectFailure(matcher, 'bar', [/Expected foo but received bar/]);
            expectFailure(matcher, 5, [/Expected type string but received number/]);
            matcher = lib_1.Match.exact(3);
            expectPass(matcher, 3);
            expectFailure(matcher, 5, [/Expected 3 but received 5/]);
            expectFailure(matcher, 'foo', [/Expected type number but received string/]);
            matcher = lib_1.Match.exact(true);
            expectPass(matcher, true);
            expectFailure(matcher, false, [/Expected true but received false/]);
            expectFailure(matcher, 'foo', [/Expected type boolean but received string/]);
        });
        test('arrays', () => {
            matcher = lib_1.Match.exact([4]);
            expectPass(matcher, [4]);
            expectFailure(matcher, [4, 5], [/Too many elements in array/]);
            expectFailure(matcher, 'foo', [/Expected type array but received string/]);
            matcher = lib_1.Match.exact(['foo', 3]);
            expectPass(matcher, ['foo', 3]);
            expectFailure(matcher, ['bar', 3], [/Expected foo but received bar at \/0/]);
            expectFailure(matcher, ['foo', 5], [/Expected 3 but received 5 at \/1/]);
            matcher = lib_1.Match.exact([{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
            expectPass(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred', wobble: 'flob' }]);
            expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }], [/Not enough elements in array/]);
            expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'flob', wobble: 'fred' }], [
                'Expected fred but received flob at /1/waldo',
                'Expected flob but received fred at /1/wobble',
            ]);
            expectFailure(matcher, [{ foo: 'bar', baz: 'qux' }, { waldo: 'fred' }], [/Missing key.*at \/1\/wobble/]);
        });
        test('objects', () => {
            matcher = lib_1.Match.exact({ foo: 'bar' });
            expectPass(matcher, { foo: 'bar' });
            expectFailure(matcher, 5, [/Expected type object but received number/]);
            expectFailure(matcher, ['3', 5], [/Expected type object but received array/]);
            expectFailure(matcher, { baz: 'qux' }, [
                'Unexpected key baz at /baz',
                /Missing key.*at \/foo/,
            ]);
            matcher = lib_1.Match.exact({ foo: 'bar', baz: 5 });
            expectFailure(matcher, { foo: 'bar', baz: '5' }, [/Expected type number but received string at \/baz/]);
            expectFailure(matcher, { foo: 'bar', baz: 5, qux: 7 }, [/Unexpected key qux at \/qux/]);
            matcher = lib_1.Match.exact({ foo: [2, 3], bar: 'baz' });
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
            expect(() => lib_1.Match.exact(lib_1.Match.arrayWith(['foo']))).toThrow(/cannot directly contain another matcher/);
        });
        test('absent', () => {
            expect(() => lib_1.Match.exact(lib_1.Match.absent())).toThrow(/cannot directly contain another matcher/);
        });
    });
    describe('arrayWith()', () => {
        let matcher;
        test('subset match', () => {
            matcher = lib_1.Match.arrayWith([]);
            expectPass(matcher, []);
            expectPass(matcher, [3]);
            matcher = lib_1.Match.arrayWith([3]);
            expectPass(matcher, [3]);
            expectPass(matcher, [3, 5]);
            expectPass(matcher, [1, 3, 5]);
            expectFailure(matcher, [5], [/Could not match arrayWith pattern 0/]);
            matcher = lib_1.Match.arrayWith([5, false]);
            expectPass(matcher, [5, false, 'foo']);
            expectPass(matcher, [5, 'foo', false]);
            expectFailure(matcher, [5, 'foo'], [/Could not match arrayWith pattern 1/]);
            matcher = lib_1.Match.arrayWith([{ foo: 'bar' }]);
            expectPass(matcher, [{ fred: 'waldo' }, { foo: 'bar' }, { baz: 'qux' }]);
            expectPass(matcher, [{ foo: 'bar' }]);
            expectFailure(matcher, [{ foo: 'baz' }], [/Could not match arrayWith pattern 0/]);
            expectFailure(matcher, [{ baz: 'qux' }], [/Could not match arrayWith pattern 0/]);
        });
        test('not array', () => {
            matcher = lib_1.Match.arrayWith([3]);
            expectFailure(matcher, 3, [/Expected type array but received number/]);
            expectFailure(matcher, { val: 3 }, [/Expected type array but received object/]);
        });
        test('out of order', () => {
            matcher = lib_1.Match.arrayWith([3, 5]);
            expectFailure(matcher, [5, 3], [/Could not match arrayWith pattern 1/]);
        });
        test('nested with ObjectLike', () => {
            matcher = lib_1.Match.arrayWith([lib_1.Match.objectLike({ foo: 'bar' })]);
            expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar' }]);
            expectPass(matcher, [{ baz: 'qux' }, { foo: 'bar', fred: 'waldo' }]);
            expectFailure(matcher, [{ foo: 'baz', fred: 'waldo' }], [/Could not match arrayWith pattern 0/]);
        });
        test('incompatible with absent', () => {
            matcher = lib_1.Match.arrayWith(['foo', lib_1.Match.absent()]);
            expect(() => matcher.test(['foo', 'bar'])).toThrow(/absent\(\) cannot be nested within arrayWith\(\)/);
        });
        test('incompatible with anyValue', () => {
            matcher = lib_1.Match.arrayWith(['foo', lib_1.Match.anyValue()]);
            expect(() => matcher.test(['foo', 'bar'])).toThrow(/anyValue\(\) cannot be nested within arrayWith\(\)/);
        });
    });
    describe('arrayEquals', () => {
        let matcher;
        test('exact match', () => {
            matcher = lib_1.Match.arrayEquals([5, false]);
            expectPass(matcher, [5, false]);
            expectFailure(matcher, [5, 'foo', false], [/Too many elements in array/]);
            expectFailure(matcher, [5, 'foo'], [/Expected type boolean but received string at \/1/]);
        });
    });
    describe('objectLike()', () => {
        let matcher;
        test('basic', () => {
            matcher = lib_1.Match.objectLike({ foo: 'bar' });
            expectPass(matcher, { foo: 'bar' });
            expectFailure(matcher, { foo: 'baz' }, [/Expected bar but received baz at \/foo/]);
            expectFailure(matcher, { foo: ['bar'] }, [/Expected type string but received array at \/foo/]);
            expectFailure(matcher, { bar: 'foo' }, [/Missing key.*at \/foo/]);
            expectPass(matcher, { foo: 'bar', baz: 'qux' });
        });
        test('not an object', () => {
            matcher = lib_1.Match.objectLike({ foo: 'bar' });
            expectFailure(matcher, ['foo', 'bar'], [/Expected type object but received array/]);
            expectFailure(matcher, 'foo', [/Expected type object but received string/]);
            matcher = lib_1.Match.objectLike({ foo: lib_1.Match.objectLike({ baz: 'qux' }) });
            expectFailure(matcher, { foo: 'baz' }, [/Expected type object but received string at \/foo/]);
        });
        test('partial', () => {
            matcher = lib_1.Match.objectLike({ foo: 'bar' });
            expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo' } });
            matcher = lib_1.Match.objectLike({ baz: { fred: 'waldo' } });
            expectPass(matcher, { foo: 'bar', baz: { fred: 'waldo', wobble: 'flob' } });
        });
        test('ArrayMatch nested inside ObjectMatch', () => {
            matcher = lib_1.Match.objectLike({
                foo: lib_1.Match.arrayWith(['bar']),
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
            matcher = lib_1.Match.objectLike({
                foo: [{ bar: 'bar' }],
            });
            expectPass(matcher, { foo: [{ bar: 'bar' }] }); // Trivially true
            expectPass(matcher, { boo: 'boo', foo: [{ bar: 'bar' }] }); // Additional members at top level okay
            expectPass(matcher, { foo: [{ bar: 'bar', boo: 'boo' }] }); // Additional members at inner level okay
        });
        test('absent', () => {
            matcher = lib_1.Match.objectLike({ foo: lib_1.Match.absent() });
            expectPass(matcher, { bar: 'baz' });
            expectFailure(matcher, { foo: 'baz' }, [/key should be absent at \/foo/]);
        });
    });
    describe('objectEquals()', () => {
        let matcher;
        test('exact match', () => {
            matcher = lib_1.Match.objectEquals({ foo: 'bar' });
            expectPass(matcher, { foo: 'bar' });
            expectFailure(matcher, { foo: 'bar', baz: 'qux' }, [/Unexpected key baz at \/baz/]);
        });
    });
    describe('not()', () => {
        let matcher;
        test('literal', () => {
            matcher = lib_1.Match.not('foo');
            expectPass(matcher, 'bar');
            expectPass(matcher, 3);
            expectFailure(matcher, 'foo', ['Found unexpected match: "foo"']);
        });
        test('object', () => {
            matcher = lib_1.Match.not({ foo: 'bar' });
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
            matcher = lib_1.Match.not(['foo', 'bar']);
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
            matcher = lib_1.Match.exact({
                foo: { bar: lib_1.Match.not([1, 2]) },
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
            matcher = lib_1.Match.not({
                foo: { bar: lib_1.Match.arrayWith([1]) },
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
        let matcher;
        test('simple', () => {
            matcher = lib_1.Match.anyValue();
            expectPass(matcher, 'foo');
            expectPass(matcher, 5);
            expectPass(matcher, false);
            expectPass(matcher, []);
            expectPass(matcher, {});
            expectFailure(matcher, null, ['Expected a value but found none']);
            expectFailure(matcher, undefined, ['Expected a value but found none']);
        });
        test('nested in array', () => {
            matcher = lib_1.Match.arrayEquals(['foo', lib_1.Match.anyValue(), 'bar']);
            expectPass(matcher, ['foo', 'baz', 'bar']);
            expectPass(matcher, ['foo', 3, 'bar']);
            expectFailure(matcher, ['foo', null, 'bar'], ['Expected a value but found none at /1']);
        });
        test('nested in object', () => {
            matcher = lib_1.Match.objectLike({ foo: lib_1.Match.anyValue() });
            expectPass(matcher, { foo: 'bar' });
            expectPass(matcher, { foo: [1, 2] });
            expectFailure(matcher, { foo: null }, ['Expected a value but found none at /foo']);
            expectFailure(matcher, {}, [/Missing key.*at \/foo/]);
        });
    });
    describe('serializedJson()', () => {
        let matcher;
        test('all types', () => {
            matcher = lib_1.Match.serializedJson({ Foo: 'Bar', Baz: 3, Boo: true, Fred: [1, 2] });
            expectPass(matcher, '{ "Foo": "Bar", "Baz": 3, "Boo": true, "Fred": [1, 2] }');
        });
        test('simple match', () => {
            matcher = lib_1.Match.serializedJson({ Foo: 'Bar' });
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
            matcher = lib_1.Match.serializedJson(lib_1.Match.objectLike({
                Foo: lib_1.Match.arrayWith(['Bar']),
            }));
            expectPass(matcher, '{ "Foo": ["Bar"] }');
            expectPass(matcher, '{ "Foo": ["Bar", "Baz"] }');
            expectPass(matcher, '{ "Foo": ["Bar", "Baz"], "Fred": "Waldo" }');
            expectFailure(matcher, '{ "Foo": ["Baz"] }', ['Could not match arrayWith pattern 0']);
            expectFailure(matcher, '{ "Bar": ["Baz"] }', [/Missing key.*at \/Foo/]);
        });
        test('invalid json string', () => {
            matcher = lib_1.Match.serializedJson({ Foo: 'Bar' });
            expectFailure(matcher, '{ "Foo"', [/invalid JSON string/i]);
        });
    });
    describe('absent', () => {
        let matcher;
        test('simple', () => {
            matcher = lib_1.Match.absent();
            expectFailure(matcher, 'foo', ['Received foo, but key should be absent']);
            expectPass(matcher, undefined);
        });
        test('nested in object', () => {
            matcher = lib_1.Match.objectLike({ foo: lib_1.Match.absent() });
            expectFailure(matcher, { foo: 'bar' }, [/key should be absent at \/foo/]);
            expectFailure(matcher, { foo: [1, 2] }, [/key should be absent at \/foo/]);
            expectFailure(matcher, { foo: null }, [/key should be absent at \/foo/]);
            expectPass(matcher, { foo: undefined });
            expectPass(matcher, {});
        });
    });
    describe('stringLikeRegexp', () => {
        let matcher;
        test('simple', () => {
            matcher = lib_1.Match.stringLikeRegexp('.*includeHeaders = true.*');
            expectFailure(matcher, 'const includeHeaders = false;', [/did not match pattern/]);
            expectPass(matcher, 'const includeHeaders = true;');
        });
        test('nested in object', () => {
            matcher = lib_1.Match.objectLike({ foo: lib_1.Match.stringLikeRegexp('.*includeHeaders = true.*') });
            expectFailure(matcher, { foo: 'const includeHeaders = false;' }, [/did not match pattern/]);
            expectPass(matcher, { foo: 'const includeHeaders = true;' });
        });
    });
});
function expectPass(matcher, target) {
    const result = matcher.test(target);
    if (result.hasFailed()) {
        throw new Error(result.toHumanStrings().join('\n')); // eslint-disable-line jest/no-jasmine-globals
    }
}
function expectFailure(matcher, target, expected = []) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBd0M7QUFFeEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDeEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsSUFBSSxPQUFnQixDQUFDO1FBRXJCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDM0IsT0FBTyxHQUFHLFdBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQixhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztZQUNqRSxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztZQUV4RSxPQUFPLEdBQUcsV0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO1lBQ3pELGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDO1lBRTVFLE9BQU8sR0FBRyxXQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUIsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7WUFDcEUsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENB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Yic7XG5cbmRlc2NyaWJlKCdNYXRjaGVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2V4YWN0bHkoKScsICgpID0+IHtcbiAgICBsZXQgbWF0Y2hlcjogTWF0Y2hlcjtcblxuICAgIHRlc3QoJ3NpbXBsZSBsaXRlcmFscycsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5leGFjdCgnZm9vJyk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsICdmb28nKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgJ2JhcicsIFsvRXhwZWN0ZWQgZm9vIGJ1dCByZWNlaXZlZCBiYXIvXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIDUsIFsvRXhwZWN0ZWQgdHlwZSBzdHJpbmcgYnV0IHJlY2VpdmVkIG51bWJlci9dKTtcblxuICAgICAgbWF0Y2hlciA9IE1hdGNoLmV4YWN0KDMpO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCAzKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgNSwgWy9FeHBlY3RlZCAzIGJ1dCByZWNlaXZlZCA1L10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCAnZm9vJywgWy9FeHBlY3RlZCB0eXBlIG51bWJlciBidXQgcmVjZWl2ZWQgc3RyaW5nL10pO1xuXG4gICAgICBtYXRjaGVyID0gTWF0Y2guZXhhY3QodHJ1ZSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHRydWUpO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBmYWxzZSwgWy9FeHBlY3RlZCB0cnVlIGJ1dCByZWNlaXZlZCBmYWxzZS9dKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgJ2ZvbycsIFsvRXhwZWN0ZWQgdHlwZSBib29sZWFuIGJ1dCByZWNlaXZlZCBzdHJpbmcvXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcnJheXMnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guZXhhY3QoWzRdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWzRdKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWzQsIDVdLCBbL1RvbyBtYW55IGVsZW1lbnRzIGluIGFycmF5L10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCAnZm9vJywgWy9FeHBlY3RlZCB0eXBlIGFycmF5IGJ1dCByZWNlaXZlZCBzdHJpbmcvXSk7XG5cbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5leGFjdChbJ2ZvbycsIDNdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWydmb28nLCAzXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFsnYmFyJywgM10sIFsvRXhwZWN0ZWQgZm9vIGJ1dCByZWNlaXZlZCBiYXIgYXQgXFwvMC9dKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWydmb28nLCA1XSwgWy9FeHBlY3RlZCAzIGJ1dCByZWNlaXZlZCA1IGF0IFxcLzEvXSk7XG5cbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5leGFjdChbeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0sIHsgd2FsZG86ICdmcmVkJywgd29iYmxlOiAnZmxvYicgfV0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCBbeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0sIHsgd2FsZG86ICdmcmVkJywgd29iYmxlOiAnZmxvYicgfV0pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBbeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH1dLCBbL05vdCBlbm91Z2ggZWxlbWVudHMgaW4gYXJyYXkvXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFt7IGZvbzogJ2JhcicsIGJhejogJ3F1eCcgfSwgeyB3YWxkbzogJ2Zsb2InLCB3b2JibGU6ICdmcmVkJyB9XSwgW1xuICAgICAgICAnRXhwZWN0ZWQgZnJlZCBidXQgcmVjZWl2ZWQgZmxvYiBhdCAvMS93YWxkbycsXG4gICAgICAgICdFeHBlY3RlZCBmbG9iIGJ1dCByZWNlaXZlZCBmcmVkIGF0IC8xL3dvYmJsZScsXG4gICAgICBdKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgW3sgZm9vOiAnYmFyJywgYmF6OiAncXV4JyB9LCB7IHdhbGRvOiAnZnJlZCcgfV0sIFsvTWlzc2luZyBrZXkuKmF0IFxcLzFcXC93b2JibGUvXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvYmplY3RzJywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLmV4YWN0KHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286ICdiYXInIH0pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCA1LCBbL0V4cGVjdGVkIHR5cGUgb2JqZWN0IGJ1dCByZWNlaXZlZCBudW1iZXIvXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFsnMycsIDVdLCBbL0V4cGVjdGVkIHR5cGUgb2JqZWN0IGJ1dCByZWNlaXZlZCBhcnJheS9dKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBiYXo6ICdxdXgnIH0sIFtcbiAgICAgICAgJ1VuZXhwZWN0ZWQga2V5IGJheiBhdCAvYmF6JyxcbiAgICAgICAgL01pc3Npbmcga2V5LiphdCBcXC9mb28vLFxuICAgICAgXSk7XG5cbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5leGFjdCh7IGZvbzogJ2JhcicsIGJhejogNSB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286ICdiYXInLCBiYXo6ICc1JyB9LCBbL0V4cGVjdGVkIHR5cGUgbnVtYmVyIGJ1dCByZWNlaXZlZCBzdHJpbmcgYXQgXFwvYmF6L10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogJ2JhcicsIGJhejogNSwgcXV4OiA3IH0sIFsvVW5leHBlY3RlZCBrZXkgcXV4IGF0IFxcL3F1eC9dKTtcblxuICAgICAgbWF0Y2hlciA9IE1hdGNoLmV4YWN0KHsgZm9vOiBbMiwgM10sIGJhcjogJ2JheicgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiBbMiwgM10sIGJhcjogJ2JheicgfSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHt9LCBbXG4gICAgICAgIC9NaXNzaW5nIGtleS4qYXQgXFwvZm9vLyxcbiAgICAgICAgL01pc3Npbmcga2V5LiphdCBcXC9iYXIvLFxuICAgICAgXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHsgYmFyOiBbMiwgM10sIGZvbzogJ2JheicgfSwgW1xuICAgICAgICAnRXhwZWN0ZWQgdHlwZSBhcnJheSBidXQgcmVjZWl2ZWQgc3RyaW5nIGF0IC9mb28nLFxuICAgICAgICAnRXhwZWN0ZWQgdHlwZSBzdHJpbmcgYnV0IHJlY2VpdmVkIGFycmF5IGF0IC9iYXInLFxuICAgICAgXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHsgZm9vOiBbMywgNV0sIGJhcjogJ2JheicgfSwgW1xuICAgICAgICAnRXhwZWN0ZWQgMiBidXQgcmVjZWl2ZWQgMyBhdCAvZm9vLzAnLFxuICAgICAgICAnRXhwZWN0ZWQgMyBidXQgcmVjZWl2ZWQgNSBhdCAvZm9vLzEnLFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXN0aW5nJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IE1hdGNoLmV4YWN0KE1hdGNoLmFycmF5V2l0aChbJ2ZvbyddKSkpLnRvVGhyb3coL2Nhbm5vdCBkaXJlY3RseSBjb250YWluIGFub3RoZXIgbWF0Y2hlci8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWJzZW50JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IE1hdGNoLmV4YWN0KE1hdGNoLmFic2VudCgpKSkudG9UaHJvdygvY2Fubm90IGRpcmVjdGx5IGNvbnRhaW4gYW5vdGhlciBtYXRjaGVyLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhcnJheVdpdGgoKScsICgpID0+IHtcbiAgICBsZXQgbWF0Y2hlcjogTWF0Y2hlcjtcblxuICAgIHRlc3QoJ3N1YnNldCBtYXRjaCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5hcnJheVdpdGgoW10pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCBbXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIFszXSk7XG5cbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5hcnJheVdpdGgoWzNdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWzNdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWzMsIDVdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWzEsIDMsIDVdKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWzVdLCBbL0NvdWxkIG5vdCBtYXRjaCBhcnJheVdpdGggcGF0dGVybiAwL10pO1xuXG4gICAgICBtYXRjaGVyID0gTWF0Y2guYXJyYXlXaXRoKFs1LCBmYWxzZV0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCBbNSwgZmFsc2UsICdmb28nXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIFs1LCAnZm9vJywgZmFsc2VdKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWzUsICdmb28nXSwgWy9Db3VsZCBub3QgbWF0Y2ggYXJyYXlXaXRoIHBhdHRlcm4gMS9dKTtcblxuICAgICAgbWF0Y2hlciA9IE1hdGNoLmFycmF5V2l0aChbeyBmb286ICdiYXInIH1dKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgW3sgZnJlZDogJ3dhbGRvJyB9LCB7IGZvbzogJ2JhcicgfSwgeyBiYXo6ICdxdXgnIH1dKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgW3sgZm9vOiAnYmFyJyB9XSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFt7IGZvbzogJ2JheicgfV0sIFsvQ291bGQgbm90IG1hdGNoIGFycmF5V2l0aCBwYXR0ZXJuIDAvXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFt7IGJhejogJ3F1eCcgfV0sIFsvQ291bGQgbm90IG1hdGNoIGFycmF5V2l0aCBwYXR0ZXJuIDAvXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdub3QgYXJyYXknLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guYXJyYXlXaXRoKFszXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIDMsIFsvRXhwZWN0ZWQgdHlwZSBhcnJheSBidXQgcmVjZWl2ZWQgbnVtYmVyL10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IHZhbDogMyB9LCBbL0V4cGVjdGVkIHR5cGUgYXJyYXkgYnV0IHJlY2VpdmVkIG9iamVjdC9dKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ291dCBvZiBvcmRlcicsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5hcnJheVdpdGgoWzMsIDVdKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWzUsIDNdLCBbL0NvdWxkIG5vdCBtYXRjaCBhcnJheVdpdGggcGF0dGVybiAxL10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbmVzdGVkIHdpdGggT2JqZWN0TGlrZScsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2UoeyBmb286ICdiYXInIH0pXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIFt7IGJhejogJ3F1eCcgfSwgeyBmb286ICdiYXInIH1dKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgW3sgYmF6OiAncXV4JyB9LCB7IGZvbzogJ2JhcicsIGZyZWQ6ICd3YWxkbycgfV0pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBbeyBmb286ICdiYXonLCBmcmVkOiAnd2FsZG8nIH1dLCBbL0NvdWxkIG5vdCBtYXRjaCBhcnJheVdpdGggcGF0dGVybiAwL10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW5jb21wYXRpYmxlIHdpdGggYWJzZW50JywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLmFycmF5V2l0aChbJ2ZvbycsIE1hdGNoLmFic2VudCgpXSk7XG4gICAgICBleHBlY3QoKCkgPT4gbWF0Y2hlci50ZXN0KFsnZm9vJywgJ2JhciddKSkudG9UaHJvdygvYWJzZW50XFwoXFwpIGNhbm5vdCBiZSBuZXN0ZWQgd2l0aGluIGFycmF5V2l0aFxcKFxcKS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW5jb21wYXRpYmxlIHdpdGggYW55VmFsdWUnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guYXJyYXlXaXRoKFsnZm9vJywgTWF0Y2guYW55VmFsdWUoKV0pO1xuICAgICAgZXhwZWN0KCgpID0+IG1hdGNoZXIudGVzdChbJ2ZvbycsICdiYXInXSkpLnRvVGhyb3coL2FueVZhbHVlXFwoXFwpIGNhbm5vdCBiZSBuZXN0ZWQgd2l0aGluIGFycmF5V2l0aFxcKFxcKS8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXJyYXlFcXVhbHMnLCAoKSA9PiB7XG4gICAgbGV0IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgICB0ZXN0KCdleGFjdCBtYXRjaCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5hcnJheUVxdWFscyhbNSwgZmFsc2VdKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWzUsIGZhbHNlXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFs1LCAnZm9vJywgZmFsc2VdLCBbL1RvbyBtYW55IGVsZW1lbnRzIGluIGFycmF5L10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBbNSwgJ2ZvbyddLCBbL0V4cGVjdGVkIHR5cGUgYm9vbGVhbiBidXQgcmVjZWl2ZWQgc3RyaW5nIGF0IFxcLzEvXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdvYmplY3RMaWtlKCknLCAoKSA9PiB7XG4gICAgbGV0IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgICB0ZXN0KCdiYXNpYycsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286ICdiYXInIH0pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogJ2JheicgfSwgWy9FeHBlY3RlZCBiYXIgYnV0IHJlY2VpdmVkIGJheiBhdCBcXC9mb28vXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHsgZm9vOiBbJ2JhciddIH0sIFsvRXhwZWN0ZWQgdHlwZSBzdHJpbmcgYnV0IHJlY2VpdmVkIGFycmF5IGF0IFxcL2Zvby9dKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBiYXI6ICdmb28nIH0sIFsvTWlzc2luZyBrZXkuKmF0IFxcL2Zvby9dKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm90IGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgWydmb28nLCAnYmFyJ10sIFsvRXhwZWN0ZWQgdHlwZSBvYmplY3QgYnV0IHJlY2VpdmVkIGFycmF5L10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCAnZm9vJywgWy9FeHBlY3RlZCB0eXBlIG9iamVjdCBidXQgcmVjZWl2ZWQgc3RyaW5nL10pO1xuXG4gICAgICBtYXRjaGVyID0gTWF0Y2gub2JqZWN0TGlrZSh7IGZvbzogTWF0Y2gub2JqZWN0TGlrZSh7IGJhejogJ3F1eCcgfSkgfSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHsgZm9vOiAnYmF6JyB9LCBbL0V4cGVjdGVkIHR5cGUgb2JqZWN0IGJ1dCByZWNlaXZlZCBzdHJpbmcgYXQgXFwvZm9vL10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncGFydGlhbCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286ICdiYXInLCBiYXo6IHsgZnJlZDogJ3dhbGRvJyB9IH0pO1xuXG4gICAgICBtYXRjaGVyID0gTWF0Y2gub2JqZWN0TGlrZSh7IGJhejogeyBmcmVkOiAnd2FsZG8nIH0gfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiAnYmFyJywgYmF6OiB7IGZyZWQ6ICd3YWxkbycsIHdvYmJsZTogJ2Zsb2InIH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdBcnJheU1hdGNoIG5lc3RlZCBpbnNpZGUgT2JqZWN0TWF0Y2gnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIGZvbzogTWF0Y2guYXJyYXlXaXRoKFsnYmFyJ10pLFxuICAgICAgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiBbJ2JhcicsICdiYXonXSwgZnJlZDogJ3dhbGRvJyB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286IFsnYmF6J10sIGZyZWQ6ICd3YWxkbycgfSwgWy9Db3VsZCBub3QgbWF0Y2ggYXJyYXlXaXRoIHBhdHRlcm4gMC9dKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1BhcnRpYWxpdHkgaXMgbWFpbnRhaW5lZCB0aHJvdWdob3V0IGFycmF5cycsICgpID0+IHtcbiAgICAgIC8vIEJlZm9yZSB0aGlzIGZpeDpcbiAgICAgIC8vXG4gICAgICAvLyAgIC0gb2JqZWN0TGlrZSh7IHg6IHsgTElURVJBTCB9KSA9PT4gTElURVJBTCB3b3VsZCBiZSBtYXRjaGVkIHBhcnRpYWxseSBhcyB3ZWxsXG4gICAgICAvLyAgIC0gb2JqZWN0TGlrZSh7IHhzOiBbIHsgTElURVJBTCB9IF0gfSkgPT0+IGJ1dCBoZXJlIExJVEVSQUwgd291bGQgYmUgbWF0Y2hlZCBmdWxseVxuICAgICAgLy9cbiAgICAgIC8vIFRoYXQgcGFzc2luZyB0aHJvdWdoIGFuIGFycmF5IHJlc2V0cyB0aGUgcGFydGlhbCBtYXRjaGluZyB0byBmdWxsIGlzIGFcbiAgICAgIC8vIHN1cnByaXNpbmcgaW5jb25zaXN0ZW5jeS5cbiAgICAgIC8vXG4gICAgICBtYXRjaGVyID0gTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIGZvbzogW3sgYmFyOiAnYmFyJyB9XSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7IGZvbzogW3sgYmFyOiAnYmFyJyB9XSB9KTsgLy8gVHJpdmlhbGx5IHRydWVcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBib286ICdib28nLCBmb286IFt7IGJhcjogJ2JhcicgfV0gfSk7IC8vIEFkZGl0aW9uYWwgbWVtYmVycyBhdCB0b3AgbGV2ZWwgb2theVxuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7IGZvbzogW3sgYmFyOiAnYmFyJywgYm9vOiAnYm9vJyB9XSB9KTsgLy8gQWRkaXRpb25hbCBtZW1iZXJzIGF0IGlubmVyIGxldmVsIG9rYXlcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Fic2VudCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiBNYXRjaC5hYnNlbnQoKSB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBiYXI6ICdiYXonIH0pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogJ2JheicgfSwgWy9rZXkgc2hvdWxkIGJlIGFic2VudCBhdCBcXC9mb28vXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdvYmplY3RFcXVhbHMoKScsICgpID0+IHtcbiAgICBsZXQgbWF0Y2hlcjogTWF0Y2hlcjtcblxuICAgIHRlc3QoJ2V4YWN0IG1hdGNoJywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLm9iamVjdEVxdWFscyh7IGZvbzogJ2JhcicgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0sIFsvVW5leHBlY3RlZCBrZXkgYmF6IGF0IFxcL2Jhei9dKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vdCgpJywgKCkgPT4ge1xuICAgIGxldCBtYXRjaGVyOiBNYXRjaGVyO1xuXG4gICAgdGVzdCgnbGl0ZXJhbCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5ub3QoJ2ZvbycpO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCAnYmFyJyk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIDMpO1xuXG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsICdmb28nLCBbJ0ZvdW5kIHVuZXhwZWN0ZWQgbWF0Y2g6IFwiZm9vXCInXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvYmplY3QnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2gubm90KHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgJ2JhcicpO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCAzKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286ICdiYXonIH0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7IGJhcjogJ2ZvbycgfSk7XG5cbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgJ0ZvdW5kIHVuZXhwZWN0ZWQgbWF0Y2g6IHsnLFxuICAgICAgICAnICBcImZvb1wiOiBcImJhclwiJyxcbiAgICAgICAgJ30nLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286ICdiYXInIH0sIFttc2ddKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FycmF5JywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLm5vdChbJ2ZvbycsICdiYXInXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsICdmb28nKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgW10pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCBbJ2JhciddKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWydmb28nLCAzXSk7XG5cbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgJ0ZvdW5kIHVuZXhwZWN0ZWQgbWF0Y2g6IFsnLFxuICAgICAgICAnICBcImZvb1wiLCcsXG4gICAgICAgICcgIFwiYmFyXCInLFxuICAgICAgICAnXScsXG4gICAgICBdLmpvaW4oJ1xcbicpO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBbJ2ZvbycsICdiYXInXSwgW21zZ10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXMgYSBuZXN0ZWQgbWF0Y2hlcicsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5leGFjdCh7XG4gICAgICAgIGZvbzogeyBiYXI6IE1hdGNoLm5vdChbMSwgMl0pIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7XG4gICAgICAgIGZvbzogeyBiYXI6IFsxXSB9LFxuICAgICAgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHtcbiAgICAgICAgZm9vOiB7IGJhcjogWydiYXonXSB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgJ0ZvdW5kIHVuZXhwZWN0ZWQgbWF0Y2g6IFsnLFxuICAgICAgICAnICAxLCcsXG4gICAgICAgICcgIDInLFxuICAgICAgICAnXSBhdCAvZm9vL2JhcicsXG4gICAgICBdLmpvaW4oJ1xcbicpO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7XG4gICAgICAgIGZvbzogeyBiYXI6IFsxLCAyXSB9LFxuICAgICAgfSwgW21zZ10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBuZXN0ZWQgbWF0Y2hlcicsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5ub3Qoe1xuICAgICAgICBmb286IHsgYmFyOiBNYXRjaC5hcnJheVdpdGgoWzFdKSB9LFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwge1xuICAgICAgICBmb286IHsgYmFyOiBbMl0gfSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCAnZm9vJyk7XG5cbiAgICAgIGNvbnN0IG1zZyA9IFtcbiAgICAgICAgJ0ZvdW5kIHVuZXhwZWN0ZWQgbWF0Y2g6IHsnLFxuICAgICAgICAnICBcImZvb1wiOiB7JyxcbiAgICAgICAgJyAgICBcImJhclwiOiBbJyxcbiAgICAgICAgJyAgICAgIDEsJyxcbiAgICAgICAgJyAgICAgIDInLFxuICAgICAgICAnICAgIF0nLFxuICAgICAgICAnICB9JyxcbiAgICAgICAgJ30nLFxuICAgICAgXS5qb2luKCdcXG4nKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwge1xuICAgICAgICBmb286IHsgYmFyOiBbMSwgMl0gfSxcbiAgICAgIH0sIFttc2ddKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FueVZhbHVlKCknLCAoKSA9PiB7XG4gICAgbGV0IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgICB0ZXN0KCdzaW1wbGUnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guYW55VmFsdWUoKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgJ2ZvbycpO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCA1KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgZmFsc2UpO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCBbXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHt9KTtcblxuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCBudWxsLCBbJ0V4cGVjdGVkIGEgdmFsdWUgYnV0IGZvdW5kIG5vbmUnXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIHVuZGVmaW5lZCwgWydFeHBlY3RlZCBhIHZhbHVlIGJ1dCBmb3VuZCBub25lJ10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbmVzdGVkIGluIGFycmF5JywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLmFycmF5RXF1YWxzKFsnZm9vJywgTWF0Y2guYW55VmFsdWUoKSwgJ2JhciddKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWydmb28nLCAnYmF6JywgJ2JhciddKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgWydmb28nLCAzLCAnYmFyJ10pO1xuXG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsIFsnZm9vJywgbnVsbCwgJ2JhciddLCBbJ0V4cGVjdGVkIGEgdmFsdWUgYnV0IGZvdW5kIG5vbmUgYXQgLzEnXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXN0ZWQgaW4gb2JqZWN0JywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLm9iamVjdExpa2UoeyBmb286IE1hdGNoLmFueVZhbHVlKCkgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgeyBmb286IFsxLCAyXSB9KTtcblxuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogbnVsbCB9LCBbJ0V4cGVjdGVkIGEgdmFsdWUgYnV0IGZvdW5kIG5vbmUgYXQgL2ZvbyddKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwge30sIFsvTWlzc2luZyBrZXkuKmF0IFxcL2Zvby9dKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NlcmlhbGl6ZWRKc29uKCknLCAoKSA9PiB7XG4gICAgbGV0IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgICB0ZXN0KCdhbGwgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guc2VyaWFsaXplZEpzb24oeyBGb286ICdCYXInLCBCYXo6IDMsIEJvbzogdHJ1ZSwgRnJlZDogWzEsIDJdIH0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCAneyBcIkZvb1wiOiBcIkJhclwiLCBcIkJhelwiOiAzLCBcIkJvb1wiOiB0cnVlLCBcIkZyZWRcIjogWzEsIDJdIH0nKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3NpbXBsZSBtYXRjaCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5zZXJpYWxpemVkSnNvbih7IEZvbzogJ0JhcicgfSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsICd7IFwiRm9vXCI6IFwiQmFyXCIgfScpO1xuXG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsICd7IFwiRm9vXCI6IFwiQmF6XCIgfScsIFsvRW5jb2RlZCBKU09OIHZhbHVlIGRvZXMgbm90IG1hdGNoLywgJ0V4cGVjdGVkIEJhciBidXQgcmVjZWl2ZWQgQmF6IGF0IC9Gb28nXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsICd7IFwiRm9vXCI6IDQgfScsIFsvRW5jb2RlZCBKU09OIHZhbHVlIGRvZXMgbm90IG1hdGNoLywgJ0V4cGVjdGVkIHR5cGUgc3RyaW5nIGJ1dCByZWNlaXZlZCBudW1iZXIgYXQgL0ZvbyddKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgJ3sgXCJCYXJcIjogXCJCYXpcIiB9JywgW1xuICAgICAgICAvRW5jb2RlZCBKU09OIHZhbHVlIGRvZXMgbm90IG1hdGNoLyxcbiAgICAgICAgJ1VuZXhwZWN0ZWQga2V5IEJhciBhdCAvQmFyJyxcbiAgICAgICAgL01pc3Npbmcga2V5LiphdCBcXC9Gb28vLFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXN0ZWQgbWF0Y2hlcicsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5zZXJpYWxpemVkSnNvbihNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgRm9vOiBNYXRjaC5hcnJheVdpdGgoWydCYXInXSksXG4gICAgICB9KSk7XG5cbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgJ3sgXCJGb29cIjogW1wiQmFyXCJdIH0nKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgJ3sgXCJGb29cIjogW1wiQmFyXCIsIFwiQmF6XCJdIH0nKTtcbiAgICAgIGV4cGVjdFBhc3MobWF0Y2hlciwgJ3sgXCJGb29cIjogW1wiQmFyXCIsIFwiQmF6XCJdLCBcIkZyZWRcIjogXCJXYWxkb1wiIH0nKTtcblxuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCAneyBcIkZvb1wiOiBbXCJCYXpcIl0gfScsIFsnQ291bGQgbm90IG1hdGNoIGFycmF5V2l0aCBwYXR0ZXJuIDAnXSk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsICd7IFwiQmFyXCI6IFtcIkJhelwiXSB9JywgWy9NaXNzaW5nIGtleS4qYXQgXFwvRm9vL10pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW52YWxpZCBqc29uIHN0cmluZycsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5zZXJpYWxpemVkSnNvbih7IEZvbzogJ0JhcicgfSk7XG5cbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgJ3sgXCJGb29cIicsIFsvaW52YWxpZCBKU09OIHN0cmluZy9pXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhYnNlbnQnLCAoKSA9PiB7XG4gICAgbGV0IG1hdGNoZXI6IE1hdGNoZXI7XG5cbiAgICB0ZXN0KCdzaW1wbGUnLCAoKSA9PiB7XG4gICAgICBtYXRjaGVyID0gTWF0Y2guYWJzZW50KCk7XG4gICAgICBleHBlY3RGYWlsdXJlKG1hdGNoZXIsICdmb28nLCBbJ1JlY2VpdmVkIGZvbywgYnV0IGtleSBzaG91bGQgYmUgYWJzZW50J10pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbmVzdGVkIGluIG9iamVjdCcsICgpID0+IHtcbiAgICAgIG1hdGNoZXIgPSBNYXRjaC5vYmplY3RMaWtlKHsgZm9vOiBNYXRjaC5hYnNlbnQoKSB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286ICdiYXInIH0sIFsva2V5IHNob3VsZCBiZSBhYnNlbnQgYXQgXFwvZm9vL10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogWzEsIDJdIH0sIFsva2V5IHNob3VsZCBiZSBhYnNlbnQgYXQgXFwvZm9vL10pO1xuICAgICAgZXhwZWN0RmFpbHVyZShtYXRjaGVyLCB7IGZvbzogbnVsbCB9LCBbL2tleSBzaG91bGQgYmUgYWJzZW50IGF0IFxcL2Zvby9dKTtcblxuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7IGZvbzogdW5kZWZpbmVkIH0pO1xuICAgICAgZXhwZWN0UGFzcyhtYXRjaGVyLCB7fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdHJpbmdMaWtlUmVnZXhwJywgKCkgPT4ge1xuICAgIGxldCBtYXRjaGVyOiBNYXRjaGVyO1xuXG4gICAgdGVzdCgnc2ltcGxlJywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJy4qaW5jbHVkZUhlYWRlcnMgPSB0cnVlLionKTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgJ2NvbnN0IGluY2x1ZGVIZWFkZXJzID0gZmFsc2U7JywgWy9kaWQgbm90IG1hdGNoIHBhdHRlcm4vXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsICdjb25zdCBpbmNsdWRlSGVhZGVycyA9IHRydWU7Jyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXN0ZWQgaW4gb2JqZWN0JywgKCkgPT4ge1xuICAgICAgbWF0Y2hlciA9IE1hdGNoLm9iamVjdExpa2UoeyBmb286IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJy4qaW5jbHVkZUhlYWRlcnMgPSB0cnVlLionKSB9KTtcbiAgICAgIGV4cGVjdEZhaWx1cmUobWF0Y2hlciwgeyBmb286ICdjb25zdCBpbmNsdWRlSGVhZGVycyA9IGZhbHNlOycgfSwgWy9kaWQgbm90IG1hdGNoIHBhdHRlcm4vXSk7XG4gICAgICBleHBlY3RQYXNzKG1hdGNoZXIsIHsgZm9vOiAnY29uc3QgaW5jbHVkZUhlYWRlcnMgPSB0cnVlOycgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGV4cGVjdFBhc3MobWF0Y2hlcjogTWF0Y2hlciwgdGFyZ2V0OiBhbnkpOiB2b2lkIHtcbiAgY29uc3QgcmVzdWx0ID0gbWF0Y2hlci50ZXN0KHRhcmdldCk7XG4gIGlmIChyZXN1bHQuaGFzRmFpbGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LnRvSHVtYW5TdHJpbmdzKCkuam9pbignXFxuJykpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGplc3Qvbm8tamFzbWluZS1nbG9iYWxzXG4gIH1cbn1cblxuZnVuY3Rpb24gZXhwZWN0RmFpbHVyZShtYXRjaGVyOiBNYXRjaGVyLCB0YXJnZXQ6IGFueSwgZXhwZWN0ZWQ6IChzdHJpbmcgfCBSZWdFeHApW10gPSBbXSk6IHZvaWQge1xuICBjb25zdCByZXN1bHQgPSBtYXRjaGVyLnRlc3QodGFyZ2V0KTtcbiAgZXhwZWN0KHJlc3VsdC5mYWlsQ291bnQpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgY29uc3QgYWN0dWFsID0gcmVzdWx0LnRvSHVtYW5TdHJpbmdzKCk7XG5cbiAgY29uc3Qgbm90Rm91bmQgPSBleHBlY3RlZC5maWx0ZXIobmVlZGxlID0+ICFhY3R1YWwuc29tZShoYXlzdGFjayA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBuZWVkbGUgPT09ICdzdHJpbmcnID8gaGF5c3RhY2suaW5jbHVkZXMobmVlZGxlKSA6IGhheXN0YWNrLm1hdGNoKG5lZWRsZSk7XG4gIH0pKTtcblxuICBpZiAobm90Rm91bmQubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUGF0dGVybnM6ICR7bm90Rm91bmR9XFxuTWlzc2luZyBmcm9tIGVycm9yOlxcbiR7YWN0dWFsLmpvaW4oJ1xcbicpfWApO1xuICB9XG59Il19