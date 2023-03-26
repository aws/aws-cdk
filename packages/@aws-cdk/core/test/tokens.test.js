"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evaluate_cfn_1 = require("./evaluate-cfn");
const util_1 = require("./util");
const lib_1 = require("../lib");
const encoding_1 = require("../lib/private/encoding");
const intrinsic_1 = require("../lib/private/intrinsic");
const resolve_1 = require("../lib/private/resolve");
describe('tokens', () => {
    test('resolve a plain old object should just return the object', () => {
        const obj = { PlainOldObject: 123, Array: [1, 2, 3] };
        expect(resolve(obj)).toEqual(obj);
    });
    test('if a value is an object with a token value, it will be evaluated', () => {
        const obj = {
            RegularValue: 'hello',
            LazyValue: new intrinsic_1.Intrinsic('World'),
        };
        expect(resolve(obj)).toEqual({
            RegularValue: 'hello',
            LazyValue: 'World',
        });
    });
    test('tokens are evaluated anywhere in the object tree', () => {
        const obj = new Promise1();
        const actual = resolve({ Obj: obj });
        expect(actual).toEqual({
            Obj: [
                {
                    Data: {
                        stringProp: 'hello',
                        numberProp: 1234,
                    },
                    Recurse: 42,
                },
                {
                    Data: {
                        stringProp: 'hello',
                        numberProp: 1234,
                    },
                    Recurse: 42,
                },
            ],
        });
    });
    test('tokens are evaluated recursively', () => {
        const obj = new Promise1();
        const actual = resolve(new intrinsic_1.Intrinsic({ Obj: obj }));
        expect(actual).toEqual({
            Obj: [
                {
                    Data: {
                        stringProp: 'hello',
                        numberProp: 1234,
                    },
                    Recurse: 42,
                },
                {
                    Data: {
                        stringProp: 'hello',
                        numberProp: 1234,
                    },
                    Recurse: 42,
                },
            ],
        });
    });
    test('empty arrays or objects are kept', () => {
        expect(resolve({})).toEqual({});
        expect(resolve([])).toEqual([]);
        const obj = {
            Prop1: 1234,
            Prop2: {},
            Prop3: [],
            Prop4: 'hello',
            Prop5: {
                PropA: {},
                PropB: {
                    PropC: [undefined, undefined],
                    PropD: 'Yoohoo',
                },
            },
        };
        expect(resolve(obj)).toEqual({
            Prop1: 1234,
            Prop2: {},
            Prop3: [],
            Prop4: 'hello',
            Prop5: {
                PropA: {},
                PropB: {
                    PropC: [],
                    PropD: 'Yoohoo',
                },
            },
        });
    });
    test('if an object has a "resolve" property that is not a function, it is not considered a token', () => {
        expect(resolve({ a_token: { resolve: () => 78787 } })).toEqual({ a_token: 78787 });
        expect(resolve({ not_a_token: { resolve: 12 } })).toEqual({ not_a_token: { resolve: 12 } });
    });
    // eslint-disable-next-line max-len
    test('if a resolvable object inherits from a class that is also resolvable, the "constructor" function will not get in the way (uses Object.keys instead of "for in")', () => {
        expect(resolve({ prop: new DataType() })).toEqual({ prop: { foo: 12, goo: 'hello' } });
    });
    test('isToken(obj) can be used to determine if an object is a token', () => {
        expect((0, lib_1.isResolvableObject)({ resolve: () => 123 })).toEqual(true);
        expect((0, lib_1.isResolvableObject)({ a: 1, b: 2, resolve: () => 'hello' })).toEqual(true);
        expect((0, lib_1.isResolvableObject)({ a: 1, b: 2, resolve: 3 })).toEqual(false);
    });
    test('Token can be used to create tokens that contain a constant value', () => {
        expect(resolve(new intrinsic_1.Intrinsic(12))).toEqual(12);
        expect(resolve(new intrinsic_1.Intrinsic('hello'))).toEqual('hello');
        expect(resolve(new intrinsic_1.Intrinsic(['hi', 'there']))).toEqual(['hi', 'there']);
    });
    test('resolving leaves a Date object in working order', () => {
        const date = new Date('2000-01-01');
        const resolved = resolve(date);
        expect(date.toString()).toEqual(resolved.toString());
    });
    test('tokens can be stringified and evaluated to conceptual value', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic('woof woof');
        // WHEN
        const stringified = `The dog says: ${token}`;
        const resolved = resolve(stringified);
        // THEN
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('The dog says: woof woof');
    });
    test('tokens stringification can be reversed', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic('woof woof');
        // THEN
        expect(token).toEqual(lib_1.Tokenization.reverseString(`${token}`).firstToken);
    });
    test('Tokens stringification and reversing of CloudFormation Tokens is implemented using Fn::Join', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic(({ woof: 'woof' }));
        // WHEN
        const stringified = `The dog says: ${token}`;
        const resolved = resolve(stringified);
        // THEN
        expect(resolved).toEqual({
            'Fn::Join': ['', ['The dog says: ', { woof: 'woof' }]],
        });
    });
    test('Doubly nested strings evaluate correctly in scalar context', () => {
        // GIVEN
        const token1 = new intrinsic_1.Intrinsic('world');
        const token2 = new intrinsic_1.Intrinsic(`hello ${token1}`);
        // WHEN
        const resolved1 = resolve(token2.toString());
        const resolved2 = resolve(token2);
        // THEN
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved1)).toEqual('hello world');
        expect((0, evaluate_cfn_1.evaluateCFN)(resolved2)).toEqual('hello world');
    });
    test('integer Tokens can be stringified and evaluate to conceptual value', () => {
        // GIVEN
        for (const token of tokensThatResolveTo(1)) {
            // WHEN
            const stringified = `the number is ${token}`;
            const resolved = resolve(stringified);
            // THEN
            expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('the number is 1');
        }
    });
    test('intrinsic Tokens can be stringified and evaluate to conceptual value', () => {
        // GIVEN
        for (const bucketName of tokensThatResolveTo({ Ref: 'MyBucket' })) {
            // WHEN
            const resolved = resolve(`my bucket is named ${bucketName}`);
            // THEN
            const context = { MyBucket: 'TheName' };
            expect((0, evaluate_cfn_1.evaluateCFN)(resolved, context)).toEqual('my bucket is named TheName');
        }
    });
    test('tokens resolve properly in initial position', () => {
        // GIVEN
        for (const token of tokensThatResolveTo('Hello')) {
            // WHEN
            const resolved = resolve(`${token} world`);
            // THEN
            expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('Hello world');
        }
    });
    test('side-by-side Tokens resolve correctly', () => {
        // GIVEN
        for (const token1 of tokensThatResolveTo('Hello ')) {
            for (const token2 of tokensThatResolveTo('world')) {
                // WHEN
                const resolved = resolve(`${token1}${token2}`);
                // THEN
                expect((0, evaluate_cfn_1.evaluateCFN)(resolved)).toEqual('Hello world');
            }
        }
    });
    test('tokens can be used in hash keys but must resolve to a string', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic('I am a string');
        // WHEN
        const s = {
            [token.toString()]: `boom ${token}`,
        };
        // THEN
        expect(resolve(s)).toEqual({ 'I am a string': 'boom I am a string' });
    });
    test('tokens can be nested in hash keys', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic(lib_1.Lazy.string({ produce: () => lib_1.Lazy.string({ produce: (() => 'I am a string') }) }));
        // WHEN
        const s = {
            [token.toString()]: `boom ${token}`,
        };
        // THEN
        expect(resolve(s)).toEqual({ 'I am a string': 'boom I am a string' });
    });
    test('Function passed to Lazy.uncachedString() is evaluated multiple times', () => {
        // GIVEN
        let counter = 0;
        const counterString = lib_1.Lazy.uncachedString({ produce: () => `${++counter}` });
        // THEN
        expect(resolve(counterString)).toEqual('1');
        expect(resolve(counterString)).toEqual('2');
    });
    test('Function passed to Lazy.string() is only evaluated once', () => {
        // GIVEN
        let counter = 0;
        const counterString = lib_1.Lazy.string({ produce: () => `${++counter}` });
        // THEN
        expect(resolve(counterString)).toEqual('1');
        expect(resolve(counterString)).toEqual('1');
    });
    test('Uncached tokens returned by cached tokens are still evaluated multiple times', () => {
        // Check that nested token returns aren't accidentally fully resolved by the
        // first resolution. On every evaluation, Tokens referenced inside the
        // structure should be given a chance to be either cached or uncached.
        // GIVEN
        let counter = 0;
        const uncachedToken = lib_1.Lazy.uncachedString({ produce: () => `${++counter}` });
        // Directly returned
        const counterString1 = lib_1.Lazy.string({ produce: () => uncachedToken });
        // In quoted context
        const counterString2 = lib_1.Lazy.string({ produce: () => `->${uncachedToken}` });
        // In object context
        const counterObject = lib_1.Lazy.any({ produce: () => ({ finalCount: uncachedToken }) });
        // THEN
        expect(resolve(counterString1)).toEqual('1');
        expect(resolve(counterString1)).toEqual('2');
        expect(resolve(counterString2)).toEqual('->3');
        expect(resolve(counterString2)).toEqual('->4');
        expect(resolve(counterObject)).toEqual({ finalCount: '5' });
    });
    test('tokens can be nested and concatenated in hash keys', () => {
        // GIVEN
        const innerToken = new intrinsic_1.Intrinsic('toot');
        const token = new intrinsic_1.Intrinsic(`${innerToken} the woot`);
        // WHEN
        const s = {
            [token.toString()]: 'boom chicago',
        };
        // THEN
        expect(resolve(s)).toEqual({ 'toot the woot': 'boom chicago' });
    });
    test('can find nested tokens in hash keys', () => {
        // GIVEN
        const innerToken = new intrinsic_1.Intrinsic('toot');
        const token = new intrinsic_1.Intrinsic(`${innerToken} the woot`);
        // WHEN
        const s = {
            [token.toString()]: 'boom chicago',
        };
        // THEN
        const tokens = (0, resolve_1.findTokens)(new lib_1.Stack(), () => s);
        expect(tokens.some(t => t === innerToken)).toEqual(true);
        expect(tokens.some(t => t === token)).toEqual(true);
    });
    test('fails if token in a hash key resolves to a non-string', () => {
        // GIVEN
        const token = new intrinsic_1.Intrinsic({ Ref: 'Other' });
        // WHEN
        const s = {
            [token.toString()]: `boom ${token}`,
        };
        // THEN
        expect(() => resolve(s)).toThrow('is used as the key in a map so must resolve to a string, but it resolves to:');
    });
    describe('list encoding', () => {
        test('can encode Token to string and resolve the encoding', () => {
            // GIVEN
            const token = new intrinsic_1.Intrinsic({ Ref: 'Other' });
            // WHEN
            const struct = {
                XYZ: lib_1.Token.asList(token),
            };
            // THEN
            expect(resolve(struct)).toEqual({
                XYZ: { Ref: 'Other' },
            });
        });
        test('cannot add to encoded list', () => {
            // GIVEN
            const token = new intrinsic_1.Intrinsic({ Ref: 'Other' });
            // WHEN
            const encoded = lib_1.Token.asList(token);
            encoded.push('hello');
            // THEN
            expect(() => {
                resolve(encoded);
            }).toThrow(/Cannot add elements to list token/);
        });
        test('cannot add to strings in encoded list', () => {
            // GIVEN
            const token = new intrinsic_1.Intrinsic({ Ref: 'Other' });
            // WHEN
            const encoded = lib_1.Token.asList(token);
            encoded[0] += 'hello';
            // THEN
            expect(() => {
                resolve(encoded);
            }).toThrow(/concatenate strings in/);
        });
        test('can pass encoded lists to FnSelect', () => {
            // GIVEN
            const encoded = lib_1.Token.asList(new intrinsic_1.Intrinsic({ Ref: 'Other' }));
            // WHEN
            const struct = lib_1.Fn.select(1, encoded);
            // THEN
            expect(resolve(struct)).toEqual({
                'Fn::Select': [1, { Ref: 'Other' }],
            });
        });
        test('can pass encoded lists to FnJoin', () => {
            // GIVEN
            const encoded = lib_1.Token.asList(new intrinsic_1.Intrinsic({ Ref: 'Other' }));
            // WHEN
            const struct = lib_1.Fn.join('/', encoded);
            // THEN
            expect(resolve(struct)).toEqual({
                'Fn::Join': ['/', { Ref: 'Other' }],
            });
        });
        test('can pass encoded lists to FnJoin, even if join is stringified', () => {
            // GIVEN
            const encoded = lib_1.Token.asList(new intrinsic_1.Intrinsic({ Ref: 'Other' }));
            // WHEN
            const struct = lib_1.Fn.join('/', encoded).toString();
            // THEN
            expect(resolve(struct)).toEqual({
                'Fn::Join': ['/', { Ref: 'Other' }],
            });
        });
        test('detect and error when list token values are illegally extracted', () => {
            // GIVEN
            const encoded = lib_1.Token.asList({ Ref: 'Other' });
            // THEN
            expect(() => {
                resolve({ value: encoded[0] });
            }).toThrow(/Found an encoded list/);
        });
    });
    describe('number encoding', () => {
        test('basic integer encoding works', () => {
            expect(16).toEqual((0, encoding_1.extractTokenDouble)((0, encoding_1.createTokenDouble)(16)));
        });
        test('arbitrary integers can be encoded, stringified, and recovered', () => {
            for (let i = 0; i < 100; i++) {
                // We can encode all numbers up to 2^48-1
                const x = Math.floor(Math.random() * (Math.pow(2, 48) - 1));
                const encoded = (0, encoding_1.createTokenDouble)(x);
                // Roundtrip through JSONification
                const roundtripped = JSON.parse(JSON.stringify({ theNumber: encoded })).theNumber;
                const decoded = (0, encoding_1.extractTokenDouble)(roundtripped);
                expect(decoded).toEqual(x);
            }
        });
        test('arbitrary numbers are correctly detected as not being tokens', () => {
            expect(undefined).toEqual((0, encoding_1.extractTokenDouble)(0));
            expect(undefined).toEqual((0, encoding_1.extractTokenDouble)(1243));
            expect(undefined).toEqual((0, encoding_1.extractTokenDouble)(4835e+532));
        });
        test('can number-encode and resolve Token objects', () => {
            // GIVEN
            const x = new intrinsic_1.Intrinsic(123);
            // THEN
            const encoded = lib_1.Token.asNumber(x);
            expect(false).toEqual((0, lib_1.isResolvableObject)(encoded));
            expect(true).toEqual(lib_1.Token.isUnresolved(encoded));
            // THEN
            const resolved = resolve({ value: encoded });
            expect(resolved).toEqual({ value: 123 });
        });
        test('Tokens are still reversible after having been encoded multiple times', () => {
            // GIVEN
            const original = new intrinsic_1.Intrinsic(123);
            // WHEN
            let x = original;
            x = lib_1.Token.asString(x);
            x = lib_1.Token.asNumber(x);
            x = lib_1.Token.asList(x);
            x = lib_1.Token.asString(x);
            // THEN
            expect(lib_1.Tokenization.reverse(x)).toBe(original);
        });
        test('regex detects all stringifications of encoded tokens', () => {
            expect((0, encoding_1.stringContainsNumberTokens)(`${(0, encoding_1.createTokenDouble)(0)}`)).toBeTruthy();
            expect((0, encoding_1.stringContainsNumberTokens)(`${(0, encoding_1.createTokenDouble)(Math.pow(2, 48) - 1)}`)).toBeTruthy(); // MAX_ENCODABLE_INTEGER
            expect((0, encoding_1.stringContainsNumberTokens)('1234')).toBeFalsy();
        });
        test('check that the first N encoded numbers can be detected', () => {
            const re = new RegExp(encoding_1.STRINGIFIED_NUMBER_PATTERN);
            // Ran this up to 1 million offline
            for (let i = 0; i < 1000; i++) {
                expect(`${(0, encoding_1.createTokenDouble)(i)}`).toMatch(re);
            }
        });
        test('handle stringified number token', () => {
            // GIVEN
            const tok = `the answer is: ${lib_1.Lazy.number({ produce: () => 86 })}`;
            // THEN
            expect(resolve({ value: `${tok}` })).toEqual({
                value: 'the answer is: 86',
            });
        });
        test('handle stringified number reference', () => {
            const stack = new lib_1.Stack();
            const res = new lib_1.CfnResource(stack, 'Resource', { type: 'My::Resource' });
            // GIVEN
            const tok = `the answer is: ${lib_1.Token.asNumber(res.ref)}`;
            // THEN
            expect(resolve({ value: `${tok}` })).toEqual({
                value: { 'Fn::Join': ['', ['the answer is: ', { Ref: 'Resource' }]] },
            });
        });
    });
    test('`stack trace is captured at token creati`on', () => {
        function fn1() {
            function fn2() {
                class ExposeTrace extends intrinsic_1.Intrinsic {
                    get creationTrace() {
                        return this.creationStack;
                    }
                }
                return new ExposeTrace('hello');
            }
            return fn2();
        }
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const token = fn1();
        (0, util_1.restoreStackTraceColection)(previousValue);
        expect(token.creationTrace.find(x => x.includes('fn1'))).toBeDefined();
        expect(token.creationTrace.find(x => x.includes('fn2'))).toBeDefined();
    });
    test('newError returns an error with the creation stack trace', () => {
        function fn1() {
            function fn2() {
                function fn3() {
                    class ThrowingToken extends intrinsic_1.Intrinsic {
                        throwError(message) {
                            throw this.newError(message);
                        }
                    }
                    return new ThrowingToken('boom');
                }
                return fn3();
            }
            return fn2();
        }
        const previousValue = (0, util_1.reEnableStackTraceCollection)();
        const token = fn1();
        (0, util_1.restoreStackTraceColection)(previousValue);
        expect(() => token.throwError('message!')).toThrow(/Token created:/);
    });
    describe('type coercion', () => {
        const inputs = [
            'a string',
            1234,
            { an_object: 1234 },
            [1, 2, 3],
            false,
        ];
        for (const input of inputs) {
            // GIVEN
            const stringToken = lib_1.Token.asString(new intrinsic_1.Intrinsic(input));
            const numberToken = lib_1.Token.asNumber(new intrinsic_1.Intrinsic(input));
            const listToken = lib_1.Token.asList(new intrinsic_1.Intrinsic(input));
            // THEN
            const expected = input;
            test(`${input}<string>.toNumber()`, () => {
                expect(resolve(lib_1.Token.asNumber(new intrinsic_1.Intrinsic(stringToken)))).toEqual(expected);
            });
            test(`${input}<list>.toNumber()`, () => {
                expect(resolve(lib_1.Token.asNumber(new intrinsic_1.Intrinsic(listToken)))).toEqual(expected);
            });
            test(`${input}<number>.toNumber()`, () => {
                expect(resolve(lib_1.Token.asNumber(new intrinsic_1.Intrinsic(numberToken)))).toEqual(expected);
            });
            test(`${input}<string>.toString()`, () => {
                expect(resolve(new intrinsic_1.Intrinsic(stringToken).toString())).toEqual(expected);
            });
            test(`${input}<list>.toString()`, () => {
                expect(resolve(new intrinsic_1.Intrinsic(listToken).toString())).toEqual(expected);
            });
            test(`${input}<number>.toString()`, () => {
                expect(resolve(new intrinsic_1.Intrinsic(numberToken).toString())).toEqual(expected);
            });
            test(`${input}<string>.toList()`, () => {
                expect(resolve(lib_1.Token.asList(new intrinsic_1.Intrinsic(stringToken)))).toEqual(expected);
            });
            test(`${input}<list>.toList()`, () => {
                expect(resolve(lib_1.Token.asList(new intrinsic_1.Intrinsic(listToken)))).toEqual(expected);
            });
            test(`${input}<number>.toList()`, () => {
                expect(resolve(lib_1.Token.asList(new intrinsic_1.Intrinsic(numberToken)))).toEqual(expected);
            });
        }
    });
    test('creation stack is attached to errors emitted during resolve with CDK_DEBUG=true', () => {
        function showMeInTheStackTrace() {
            return lib_1.Lazy.string({ produce: () => { throw new Error('fooError'); } });
        }
        const previousValue = process.env.CDK_DEBUG;
        process.env.CDK_DEBUG = 'true';
        const x = showMeInTheStackTrace();
        let message;
        try {
            resolve(x);
        }
        catch (e) {
            message = e.message;
        }
        finally {
            process.env.CDK_DEBUG = previousValue;
        }
        expect(message && message.includes('showMeInTheStackTrace')).toEqual(true);
    });
    test('creation stack is omitted without CDK_DEBUG=true', () => {
        function showMeInTheStackTrace() {
            return lib_1.Lazy.string({ produce: () => { throw new Error('fooError'); } });
        }
        const previousValue = process.env.CDK_DEBUG;
        delete process.env.CDK_DEBUG;
        const x = showMeInTheStackTrace();
        let message;
        try {
            resolve(x);
        }
        catch (e) {
            message = e.message;
        }
        finally {
            process.env.CDK_DEBUG = previousValue;
        }
        expect(message && message.includes('Execute again with CDK_DEBUG=true')).toEqual(true);
    });
    describe('stringifyNumber', () => {
        test('converts number to string', () => {
            expect(lib_1.Tokenization.stringifyNumber(100)).toEqual('100');
        });
        test('converts tokenized number to string', () => {
            expect(resolve(lib_1.Tokenization.stringifyNumber({
                resolve: () => 100,
            }))).toEqual('100');
        });
        test('string remains the same', () => {
            expect(lib_1.Tokenization.stringifyNumber('123')).toEqual('123');
        });
        test('Ref remains the same', () => {
            const val = { Ref: 'SomeLogicalId' };
            expect(lib_1.Tokenization.stringifyNumber(val)).toEqual(val);
        });
        test('lazy Ref remains the same', () => {
            const resolvedVal = { Ref: 'SomeLogicalId' };
            const tokenizedVal = lib_1.Lazy.any({
                produce: () => resolvedVal,
            });
            const res = lib_1.Tokenization.stringifyNumber(tokenizedVal);
            expect(res).not.toEqual(resolvedVal);
            expect(resolve(res)).toEqual(resolvedVal);
        });
        test('tokenized Ref remains the same', () => {
            const resolvedVal = { Ref: 'SomeLogicalId' };
            const tokenizedVal = lib_1.Token.asNumber(resolvedVal);
            const res = lib_1.Tokenization.stringifyNumber(tokenizedVal);
            expect(res).not.toEqual(resolvedVal);
            expect(resolve(res)).toEqual(resolvedVal);
        });
    });
});
class Promise2 {
    constructor() {
        this.creationStack = [];
    }
    resolve() {
        return {
            Data: {
                stringProp: 'hello',
                numberProp: 1234,
            },
            Recurse: new intrinsic_1.Intrinsic(42),
        };
    }
}
class Promise1 {
    constructor() {
        this.creationStack = [];
        this.p2 = [new Promise2(), new Promise2()];
    }
    resolve() {
        return this.p2;
    }
}
class BaseDataType {
    constructor(foo) {
        this.foo = foo;
    }
}
class DataType extends BaseDataType {
    constructor() {
        super(12);
        this.goo = 'hello';
    }
}
/**
 * Return Tokens in both flavors that resolve to the given string
 */
function tokensThatResolveTo(value) {
    return [
        new intrinsic_1.Intrinsic(value),
        lib_1.Lazy.any({ produce: () => value }),
    ];
}
/**
 * Wrapper for resolve that creates an throwaway Construct to call it on
 *
 * So I don't have to change all call sites in this file.
 */
function resolve(x) {
    return new lib_1.Stack().resolve(x);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b2tlbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE2QztBQUM3QyxpQ0FBa0Y7QUFDbEYsZ0NBQStGO0FBQy9GLHNEQUF3STtBQUN4SSx3REFBcUQ7QUFDckQsb0RBQW9EO0FBR3BELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxNQUFNLEdBQUcsR0FBRztZQUNWLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxJQUFJLHFCQUFTLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUM7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzNCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzNCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckIsR0FBRyxFQUFFO2dCQUNIO29CQUNFLElBQUksRUFBRTt3QkFDSixVQUFVLEVBQUUsT0FBTzt3QkFDbkIsVUFBVSxFQUFFLElBQUk7cUJBQ2pCO29CQUNELE9BQU8sRUFBRSxFQUFFO2lCQUNaO2dCQUNEO29CQUNFLElBQUksRUFBRTt3QkFDSixVQUFVLEVBQUUsT0FBTzt3QkFDbkIsVUFBVSxFQUFFLElBQUk7cUJBQ2pCO29CQUNELE9BQU8sRUFBRSxFQUFFO2lCQUNaO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUMzQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxxQkFBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVwRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3JCLEdBQUcsRUFBRTtnQkFDSDtvQkFDRSxJQUFJLEVBQUU7d0JBQ0osVUFBVSxFQUFFLE9BQU87d0JBQ25CLFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtvQkFDRCxPQUFPLEVBQUUsRUFBRTtpQkFDWjtnQkFDRDtvQkFDRSxJQUFJLEVBQUU7d0JBQ0osVUFBVSxFQUFFLE9BQU87d0JBQ25CLFVBQVUsRUFBRSxJQUFJO3FCQUNqQjtvQkFDRCxPQUFPLEVBQUUsRUFBRTtpQkFDWjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVoQyxNQUFNLEdBQUcsR0FBRztZQUNWLEtBQUssRUFBRSxJQUFJO1lBQ1gsS0FBSyxFQUFFLEVBQUc7WUFDVixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxFQUFHO2dCQUNWLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO29CQUM3QixLQUFLLEVBQUUsUUFBUTtpQkFDaEI7YUFDRjtTQUNGLENBQUM7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzNCLEtBQUssRUFBRSxJQUFJO1lBQ1gsS0FBSyxFQUFFLEVBQUc7WUFDVixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxFQUFHO2dCQUNWLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxLQUFLLEVBQUUsUUFBUTtpQkFDaEI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRGQUE0RixFQUFFLEdBQUcsRUFBRTtRQUN0RyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDLENBQUMsQ0FBQztJQUVILG1DQUFtQztJQUNuQyxJQUFJLENBQUMsaUtBQWlLLEVBQUUsR0FBRyxFQUFFO1FBQzNLLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1FBQ3pFLE1BQU0sQ0FBQyxJQUFBLHdCQUFrQixFQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsTUFBTSxDQUFDLElBQUEsd0JBQWtCLEVBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakYsTUFBTSxDQUFDLElBQUEsd0JBQWtCLEVBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0VBQWtFLEVBQUUsR0FBRyxFQUFFO1FBQzVFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxxQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLHFCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUkscUJBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRS9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFekMsT0FBTztRQUNQLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixLQUFLLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFBLDBCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkZBQTZGLEVBQUUsR0FBRyxFQUFFO1FBQ3ZHLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFTLENBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakQsT0FBTztRQUNQLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixLQUFLLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdkIsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN2RCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDdEUsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVMsQ0FBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFTLENBQUUsU0FBUyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRWpELE9BQU87UUFDUCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxNQUFNLENBQUMsSUFBQSwwQkFBVyxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxJQUFBLDBCQUFXLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsR0FBRyxFQUFFO1FBQzlFLFFBQVE7UUFDUixLQUFLLE1BQU0sS0FBSyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFDLE9BQU87WUFDUCxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsS0FBSyxFQUFFLENBQUM7WUFDN0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXRDLE9BQU87WUFDUCxNQUFNLENBQUMsSUFBQSwwQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLEVBQUU7UUFDaEYsUUFBUTtRQUNSLEtBQUssTUFBTSxVQUFVLElBQUksbUJBQW1CLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRTtZQUNqRSxPQUFPO1lBQ1AsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBRTdELE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUN4QyxNQUFNLENBQUMsSUFBQSwwQkFBVyxFQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFFBQVE7UUFDUixLQUFLLE1BQU0sS0FBSyxJQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2hELE9BQU87WUFDUCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRTNDLE9BQU87WUFDUCxNQUFNLENBQUMsSUFBQSwwQkFBVyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3REO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELFFBQVE7UUFDUixLQUFLLE1BQU0sTUFBTSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2xELEtBQUssTUFBTSxNQUFNLElBQUksbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2pELE9BQU87Z0JBQ1AsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBRS9DLE9BQU87Z0JBQ1AsTUFBTSxDQUFDLElBQUEsMEJBQVcsRUFBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN0RDtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFTLENBQUUsZUFBZSxDQUFDLENBQUM7UUFFOUMsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHO1lBQ1IsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLEtBQUssRUFBRTtTQUNwQyxDQUFDO1FBRUYsT0FBTztRQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBUyxDQUFDLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUvRyxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUc7WUFDUixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsS0FBSyxFQUFFO1NBQ3BDLENBQUM7UUFFRixPQUFPO1FBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLFFBQVE7UUFDUixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxhQUFhLEdBQUcsVUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTdFLE9BQU87UUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLFFBQVE7UUFDUixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxhQUFhLEdBQUcsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLE9BQU87UUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOEVBQThFLEVBQUUsR0FBRyxFQUFFO1FBQ3hGLDRFQUE0RTtRQUM1RSxzRUFBc0U7UUFDdEUsc0VBQXNFO1FBRXRFLFFBQVE7UUFDUixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxhQUFhLEdBQUcsVUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLG9CQUFvQjtRQUNwQixNQUFNLGNBQWMsR0FBRyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDckUsb0JBQW9CO1FBQ3BCLE1BQU0sY0FBYyxHQUFHLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUUsb0JBQW9CO1FBQ3BCLE1BQU0sYUFBYSxHQUFHLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRixPQUFPO1FBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzlELFFBQVE7UUFDUixNQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFTLENBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBUyxDQUFFLEdBQUcsVUFBVSxXQUFXLENBQUMsQ0FBQztRQUV2RCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUc7WUFDUixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLGNBQWM7U0FDbkMsQ0FBQztRQUVGLE9BQU87UUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLFFBQVE7UUFDUixNQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFTLENBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBUyxDQUFFLEdBQUcsVUFBVSxXQUFXLENBQUMsQ0FBQztRQUV2RCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUc7WUFDUixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLGNBQWM7U0FDbkMsQ0FBQztRQUVGLE9BQU87UUFDUCxNQUFNLE1BQU0sR0FBRyxJQUFBLG9CQUFVLEVBQUMsSUFBSSxXQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRTlDLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRztZQUNSLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxLQUFLLEVBQUU7U0FDcEMsQ0FBQztRQUVGLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7SUFDbkgsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1lBQy9ELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUU5QyxPQUFPO1lBQ1AsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsR0FBRyxFQUFFLFdBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ3pCLENBQUM7WUFFRixPQUFPO1lBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTthQUN0QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRTlDLE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBYSxXQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdEIsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFOUMsT0FBTztZQUNQLE1BQU0sT0FBTyxHQUFhLFdBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztZQUV0QixPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLFFBQVE7WUFDUixNQUFNLE9BQU8sR0FBYSxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFeEUsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFFBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXJDLE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5QixZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLFFBQVE7WUFDUixNQUFNLE9BQU8sR0FBYSxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFeEUsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFFBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXJDLE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5QixVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3pFLFFBQVE7WUFDUixNQUFNLE9BQU8sR0FBYSxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFeEUsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUFHLFFBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWhELE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5QixVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDcEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1lBQzNFLFFBQVE7WUFDUixNQUFNLE9BQU8sR0FBYSxXQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFekQsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN4QyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsNkJBQWtCLEVBQUMsSUFBQSw0QkFBaUIsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3pFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVCLHlDQUF5QztnQkFDekMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RCxNQUFNLE9BQU8sR0FBRyxJQUFBLDRCQUFpQixFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxrQ0FBa0M7Z0JBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNsRixNQUFNLE9BQU8sR0FBRyxJQUFBLDZCQUFrQixFQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1lBQ3hFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSw2QkFBa0IsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSw2QkFBa0IsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSw2QkFBa0IsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxRQUFRO1lBQ1IsTUFBTSxDQUFDLEdBQUcsSUFBSSxxQkFBUyxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLE9BQU8sR0FBRyxXQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSx3QkFBa0IsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRWxELE9BQU87WUFDUCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1lBQ2hGLFFBQVE7WUFDUixNQUFNLFFBQVEsR0FBRyxJQUFJLHFCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFcEMsT0FBTztZQUNQLElBQUksQ0FBQyxHQUFRLFFBQVEsQ0FBQztZQUN0QixDQUFDLEdBQUcsV0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixDQUFDLEdBQUcsV0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixDQUFDLEdBQUcsV0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixDQUFDLEdBQUcsV0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV0QixPQUFPO1lBQ1AsTUFBTSxDQUFDLGtCQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxNQUFNLENBQUMsSUFBQSxxQ0FBMEIsRUFBQyxHQUFHLElBQUEsNEJBQWlCLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDM0UsTUFBTSxDQUFDLElBQUEscUNBQTBCLEVBQUMsR0FBRyxJQUFBLDRCQUFpQixFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1lBQ3RILE1BQU0sQ0FBQyxJQUFBLHFDQUEwQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2xFLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLHFDQUEwQixDQUFDLENBQUM7WUFDbEQsbUNBQW1DO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdCLE1BQU0sQ0FBQyxHQUFHLElBQUEsNEJBQWlCLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMvQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsa0JBQWtCLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBRW5FLE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMzQyxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDekUsUUFBUTtZQUNSLE1BQU0sR0FBRyxHQUFHLGtCQUFrQixXQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBRXhELE9BQU87WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMzQyxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUU7YUFDdEUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsU0FBUyxHQUFHO1lBQ1YsU0FBUyxHQUFHO2dCQUNWLE1BQU0sV0FBWSxTQUFRLHFCQUFTO29CQUNqQyxJQUFXLGFBQWE7d0JBQ3RCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztxQkFDM0I7aUJBQ0Y7Z0JBRUQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBRUQsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFBLG1DQUE0QixHQUFFLENBQUM7UUFDckQsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBQSxpQ0FBMEIsRUFBQyxhQUFhLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUV6RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsU0FBUyxHQUFHO1lBQ1YsU0FBUyxHQUFHO2dCQUNWLFNBQVMsR0FBRztvQkFDVixNQUFNLGFBQWMsU0FBUSxxQkFBUzt3QkFDNUIsVUFBVSxDQUFDLE9BQWU7NEJBQy9CLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDOUI7cUJBQ0Y7b0JBQ0QsT0FBTyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFRCxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUNELE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQ0FBNEIsR0FBRSxDQUFDO1FBQ3JELE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUEsaUNBQTBCLEVBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLE1BQU0sTUFBTSxHQUFHO1lBQ2IsVUFBVTtZQUNWLElBQUk7WUFDSixFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7WUFDbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNULEtBQUs7U0FDTixDQUFDO1FBRUYsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDMUIsUUFBUTtZQUNSLE1BQU0sV0FBVyxHQUFHLFdBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxxQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxXQUFXLEdBQUcsV0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHFCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLFNBQVMsR0FBRyxXQUFLLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJELE9BQU87WUFDUCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBSSxDQUFDLEdBQUcsS0FBSyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHFCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHFCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHFCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsR0FBRyxLQUFLLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtnQkFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLHFCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxHQUFHLEtBQUsscUJBQXFCLEVBQUUsR0FBRyxFQUFFO2dCQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUkscUJBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNFLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHFCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHFCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEdBQUcsS0FBSyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHFCQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpRkFBaUYsRUFBRSxHQUFHLEVBQUU7UUFDM0YsU0FBUyxxQkFBcUI7WUFDNUIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUU1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDL0IsTUFBTSxDQUFDLEdBQUcscUJBQXFCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE9BQU8sQ0FBQztRQUNaLElBQUk7WUFDRixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDWjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxHQUFJLENBQVcsQ0FBQyxPQUFPLENBQUM7U0FDaEM7Z0JBQVM7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7U0FDdkM7UUFFRCxNQUFNLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsU0FBUyxxQkFBcUI7WUFDNUIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUM1QyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRTdCLE1BQU0sQ0FBQyxHQUFHLHFCQUFxQixFQUFFLENBQUM7UUFDbEMsSUFBSSxPQUFPLENBQUM7UUFDWixJQUFJO1lBQ0YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sR0FBSSxDQUFXLENBQUMsT0FBTyxDQUFDO1NBQ2hDO2dCQUFTO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1NBQ3ZDO1FBRUQsTUFBTSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDckMsTUFBTSxDQUFDLGtCQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFZLENBQUMsZUFBZSxDQUFDO2dCQUMxQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRzthQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUNuQyxNQUFNLENBQUMsa0JBQVksQ0FBQyxlQUFlLENBQUMsS0FBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxrQkFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDckMsTUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUM7WUFDN0MsTUFBTSxZQUFZLEdBQUcsVUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVc7YUFDM0IsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxHQUFHLEdBQUcsa0JBQVksQ0FBQyxlQUFlLENBQUMsWUFBbUIsQ0FBUSxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQzFDLE1BQU0sV0FBVyxHQUFHLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO1lBQzdDLE1BQU0sWUFBWSxHQUFHLFdBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDakQsTUFBTSxHQUFHLEdBQUcsa0JBQVksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFRLENBQUM7WUFDOUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLFFBQVE7SUFBZDtRQUNrQixrQkFBYSxHQUFHLEVBQUUsQ0FBQztJQVdyQyxDQUFDO0lBVFEsT0FBTztRQUNaLE9BQU87WUFDTCxJQUFJLEVBQUU7Z0JBQ0osVUFBVSxFQUFFLE9BQU87Z0JBQ25CLFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1lBQ0QsT0FBTyxFQUFFLElBQUkscUJBQVMsQ0FBRSxFQUFFLENBQUM7U0FDNUIsQ0FBQztLQUNIO0NBQ0Y7QUFFRCxNQUFNLFFBQVE7SUFBZDtRQUNrQixrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUM1QixPQUFFLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztJQUsvQyxDQUFDO0lBSFEsT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztLQUNoQjtDQUNGO0FBRUQsTUFBTSxZQUFZO0lBQ2hCLFlBQXFCLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0tBQy9CO0NBQ0Y7QUFFRCxNQUFNLFFBQVMsU0FBUSxZQUFZO0lBR2pDO1FBQ0UsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBSEwsUUFBRyxHQUFHLE9BQU8sQ0FBQztLQUlwQjtDQUNGO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLG1CQUFtQixDQUFDLEtBQVU7SUFDckMsT0FBTztRQUNMLElBQUkscUJBQVMsQ0FBQyxLQUFLLENBQUM7UUFDcEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNuQyxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxDQUFNO0lBQ3JCLE9BQU8sSUFBSSxXQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV2YWx1YXRlQ0ZOIH0gZnJvbSAnLi9ldmFsdWF0ZS1jZm4nO1xuaW1wb3J0IHsgcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbiwgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UsIEZuLCBpc1Jlc29sdmFibGVPYmplY3QsIExhenksIFN0YWNrLCBUb2tlbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IGNyZWF0ZVRva2VuRG91YmxlLCBleHRyYWN0VG9rZW5Eb3VibGUsIHN0cmluZ0NvbnRhaW5zTnVtYmVyVG9rZW5zLCBTVFJJTkdJRklFRF9OVU1CRVJfUEFUVEVSTiB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2VuY29kaW5nJztcbmltcG9ydCB7IEludHJpbnNpYyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2ludHJpbnNpYyc7XG5pbXBvcnQgeyBmaW5kVG9rZW5zIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvcmVzb2x2ZSc7XG5pbXBvcnQgeyBJUmVzb2x2YWJsZSB9IGZyb20gJy4uL2xpYi9yZXNvbHZhYmxlJztcblxuZGVzY3JpYmUoJ3Rva2VucycsICgpID0+IHtcbiAgdGVzdCgncmVzb2x2ZSBhIHBsYWluIG9sZCBvYmplY3Qgc2hvdWxkIGp1c3QgcmV0dXJuIHRoZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgb2JqID0geyBQbGFpbk9sZE9iamVjdDogMTIzLCBBcnJheTogWzEsIDIsIDNdIH07XG4gICAgZXhwZWN0KHJlc29sdmUob2JqKSkudG9FcXVhbChvYmopO1xuICB9KTtcblxuICB0ZXN0KCdpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGEgdG9rZW4gdmFsdWUsIGl0IHdpbGwgYmUgZXZhbHVhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIFJlZ3VsYXJWYWx1ZTogJ2hlbGxvJyxcbiAgICAgIExhenlWYWx1ZTogbmV3IEludHJpbnNpYygnV29ybGQnKSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KHJlc29sdmUob2JqKSkudG9FcXVhbCh7XG4gICAgICBSZWd1bGFyVmFsdWU6ICdoZWxsbycsXG4gICAgICBMYXp5VmFsdWU6ICdXb3JsZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyBhcmUgZXZhbHVhdGVkIGFueXdoZXJlIGluIHRoZSBvYmplY3QgdHJlZScsICgpID0+IHtcbiAgICBjb25zdCBvYmogPSBuZXcgUHJvbWlzZTEoKTtcbiAgICBjb25zdCBhY3R1YWwgPSByZXNvbHZlKHsgT2JqOiBvYmogfSk7XG5cbiAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKHtcbiAgICAgIE9iajogW1xuICAgICAgICB7XG4gICAgICAgICAgRGF0YToge1xuICAgICAgICAgICAgc3RyaW5nUHJvcDogJ2hlbGxvJyxcbiAgICAgICAgICAgIG51bWJlclByb3A6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWN1cnNlOiA0MixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERhdGE6IHtcbiAgICAgICAgICAgIHN0cmluZ1Byb3A6ICdoZWxsbycsXG4gICAgICAgICAgICBudW1iZXJQcm9wOiAxMjM0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmVjdXJzZTogNDIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgYXJlIGV2YWx1YXRlZCByZWN1cnNpdmVseScsICgpID0+IHtcbiAgICBjb25zdCBvYmogPSBuZXcgUHJvbWlzZTEoKTtcbiAgICBjb25zdCBhY3R1YWwgPSByZXNvbHZlKG5ldyBJbnRyaW5zaWMoeyBPYmo6IG9iaiB9KSk7XG5cbiAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKHtcbiAgICAgIE9iajogW1xuICAgICAgICB7XG4gICAgICAgICAgRGF0YToge1xuICAgICAgICAgICAgc3RyaW5nUHJvcDogJ2hlbGxvJyxcbiAgICAgICAgICAgIG51bWJlclByb3A6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWN1cnNlOiA0MixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERhdGE6IHtcbiAgICAgICAgICAgIHN0cmluZ1Byb3A6ICdoZWxsbycsXG4gICAgICAgICAgICBudW1iZXJQcm9wOiAxMjM0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUmVjdXJzZTogNDIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbXB0eSBhcnJheXMgb3Igb2JqZWN0cyBhcmUga2VwdCcsICgpID0+IHtcbiAgICBleHBlY3QocmVzb2x2ZSh7IH0pKS50b0VxdWFsKHsgfSk7XG4gICAgZXhwZWN0KHJlc29sdmUoW10pKS50b0VxdWFsKFtdKTtcblxuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIFByb3AxOiAxMjM0LFxuICAgICAgUHJvcDI6IHsgfSxcbiAgICAgIFByb3AzOiBbXSxcbiAgICAgIFByb3A0OiAnaGVsbG8nLFxuICAgICAgUHJvcDU6IHtcbiAgICAgICAgUHJvcEE6IHsgfSxcbiAgICAgICAgUHJvcEI6IHtcbiAgICAgICAgICBQcm9wQzogW3VuZGVmaW5lZCwgdW5kZWZpbmVkXSxcbiAgICAgICAgICBQcm9wRDogJ1lvb2hvbycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBleHBlY3QocmVzb2x2ZShvYmopKS50b0VxdWFsKHtcbiAgICAgIFByb3AxOiAxMjM0LFxuICAgICAgUHJvcDI6IHsgfSxcbiAgICAgIFByb3AzOiBbXSxcbiAgICAgIFByb3A0OiAnaGVsbG8nLFxuICAgICAgUHJvcDU6IHtcbiAgICAgICAgUHJvcEE6IHsgfSxcbiAgICAgICAgUHJvcEI6IHtcbiAgICAgICAgICBQcm9wQzogW10sXG4gICAgICAgICAgUHJvcEQ6ICdZb29ob28nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgYW4gb2JqZWN0IGhhcyBhIFwicmVzb2x2ZVwiIHByb3BlcnR5IHRoYXQgaXMgbm90IGEgZnVuY3Rpb24sIGl0IGlzIG5vdCBjb25zaWRlcmVkIGEgdG9rZW4nLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJlc29sdmUoeyBhX3Rva2VuOiB7IHJlc29sdmU6ICgpID0+IDc4Nzg3IH0gfSkpLnRvRXF1YWwoeyBhX3Rva2VuOiA3ODc4NyB9KTtcbiAgICBleHBlY3QocmVzb2x2ZSh7IG5vdF9hX3Rva2VuOiB7IHJlc29sdmU6IDEyIH0gfSkpLnRvRXF1YWwoeyBub3RfYV90b2tlbjogeyByZXNvbHZlOiAxMiB9IH0pO1xuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICB0ZXN0KCdpZiBhIHJlc29sdmFibGUgb2JqZWN0IGluaGVyaXRzIGZyb20gYSBjbGFzcyB0aGF0IGlzIGFsc28gcmVzb2x2YWJsZSwgdGhlIFwiY29uc3RydWN0b3JcIiBmdW5jdGlvbiB3aWxsIG5vdCBnZXQgaW4gdGhlIHdheSAodXNlcyBPYmplY3Qua2V5cyBpbnN0ZWFkIG9mIFwiZm9yIGluXCIpJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXNvbHZlKHsgcHJvcDogbmV3IERhdGFUeXBlKCkgfSkpLnRvRXF1YWwoeyBwcm9wOiB7IGZvbzogMTIsIGdvbzogJ2hlbGxvJyB9IH0pO1xuICB9KTtcblxuICB0ZXN0KCdpc1Rva2VuKG9iaikgY2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIGV4cGVjdChpc1Jlc29sdmFibGVPYmplY3QoeyByZXNvbHZlOiAoKSA9PiAxMjMgfSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGlzUmVzb2x2YWJsZU9iamVjdCh7IGE6IDEsIGI6IDIsIHJlc29sdmU6ICgpID0+ICdoZWxsbycgfSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGlzUmVzb2x2YWJsZU9iamVjdCh7IGE6IDEsIGI6IDIsIHJlc29sdmU6IDMgfSkpLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICB0ZXN0KCdUb2tlbiBjYW4gYmUgdXNlZCB0byBjcmVhdGUgdG9rZW5zIHRoYXQgY29udGFpbiBhIGNvbnN0YW50IHZhbHVlJywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXNvbHZlKG5ldyBJbnRyaW5zaWMoMTIpKSkudG9FcXVhbCgxMik7XG4gICAgZXhwZWN0KHJlc29sdmUobmV3IEludHJpbnNpYygnaGVsbG8nKSkpLnRvRXF1YWwoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KHJlc29sdmUobmV3IEludHJpbnNpYyhbJ2hpJywgJ3RoZXJlJ10pKSkudG9FcXVhbChbJ2hpJywgJ3RoZXJlJ10pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvbHZpbmcgbGVhdmVzIGEgRGF0ZSBvYmplY3QgaW4gd29ya2luZyBvcmRlcicsICgpID0+IHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoJzIwMDAtMDEtMDEnKTtcbiAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmUoZGF0ZSk7XG5cbiAgICBleHBlY3QoZGF0ZS50b1N0cmluZygpKS50b0VxdWFsKHJlc29sdmVkLnRvU3RyaW5nKCkpO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgY2FuIGJlIHN0cmluZ2lmaWVkIGFuZCBldmFsdWF0ZWQgdG8gY29uY2VwdHVhbCB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYygnd29vZiB3b29mJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RyaW5naWZpZWQgPSBgVGhlIGRvZyBzYXlzOiAke3Rva2VufWA7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKHN0cmluZ2lmaWVkKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCdUaGUgZG9nIHNheXM6IHdvb2Ygd29vZicpO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgc3RyaW5naWZpY2F0aW9uIGNhbiBiZSByZXZlcnNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYygnd29vZiB3b29mJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRva2VuKS50b0VxdWFsKFRva2VuaXphdGlvbi5yZXZlcnNlU3RyaW5nKGAke3Rva2VufWApLmZpcnN0VG9rZW4pO1xuICB9KTtcblxuICB0ZXN0KCdUb2tlbnMgc3RyaW5naWZpY2F0aW9uIGFuZCByZXZlcnNpbmcgb2YgQ2xvdWRGb3JtYXRpb24gVG9rZW5zIGlzIGltcGxlbWVudGVkIHVzaW5nIEZuOjpKb2luJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKCAoeyB3b29mOiAnd29vZicgfSkpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gYFRoZSBkb2cgc2F5czogJHt0b2tlbn1gO1xuICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShzdHJpbmdpZmllZCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmVkKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgWydUaGUgZG9nIHNheXM6ICcsIHsgd29vZjogJ3dvb2YnIH1dXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRG91Ymx5IG5lc3RlZCBzdHJpbmdzIGV2YWx1YXRlIGNvcnJlY3RseSBpbiBzY2FsYXIgY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuMSA9IG5ldyBJbnRyaW5zaWMoICd3b3JsZCcpO1xuICAgIGNvbnN0IHRva2VuMiA9IG5ldyBJbnRyaW5zaWMoIGBoZWxsbyAke3Rva2VuMX1gKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvbHZlZDEgPSByZXNvbHZlKHRva2VuMi50b1N0cmluZygpKTtcbiAgICBjb25zdCByZXNvbHZlZDIgPSByZXNvbHZlKHRva2VuMik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkMSkpLnRvRXF1YWwoJ2hlbGxvIHdvcmxkJyk7XG4gICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkMikpLnRvRXF1YWwoJ2hlbGxvIHdvcmxkJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ludGVnZXIgVG9rZW5zIGNhbiBiZSBzdHJpbmdpZmllZCBhbmQgZXZhbHVhdGUgdG8gY29uY2VwdHVhbCB2YWx1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zVGhhdFJlc29sdmVUbygxKSkge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3RyaW5naWZpZWQgPSBgdGhlIG51bWJlciBpcyAke3Rva2VufWA7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmUoc3RyaW5naWZpZWQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCd0aGUgbnVtYmVyIGlzIDEnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ2ludHJpbnNpYyBUb2tlbnMgY2FuIGJlIHN0cmluZ2lmaWVkIGFuZCBldmFsdWF0ZSB0byBjb25jZXB0dWFsIHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgZm9yIChjb25zdCBidWNrZXROYW1lIG9mIHRva2Vuc1RoYXRSZXNvbHZlVG8oeyBSZWY6ICdNeUJ1Y2tldCcgfSkpIHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShgbXkgYnVja2V0IGlzIG5hbWVkICR7YnVja2V0TmFtZX1gKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgY29udGV4dCA9IHsgTXlCdWNrZXQ6ICdUaGVOYW1lJyB9O1xuICAgICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkLCBjb250ZXh0KSkudG9FcXVhbCgnbXkgYnVja2V0IGlzIG5hbWVkIFRoZU5hbWUnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyByZXNvbHZlIHByb3Blcmx5IGluIGluaXRpYWwgcG9zaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vuc1RoYXRSZXNvbHZlVG8oJ0hlbGxvJykpIHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShgJHt0b2tlbn0gd29ybGRgKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGV2YWx1YXRlQ0ZOKHJlc29sdmVkKSkudG9FcXVhbCgnSGVsbG8gd29ybGQnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ3NpZGUtYnktc2lkZSBUb2tlbnMgcmVzb2x2ZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBmb3IgKGNvbnN0IHRva2VuMSBvZiB0b2tlbnNUaGF0UmVzb2x2ZVRvKCdIZWxsbyAnKSkge1xuICAgICAgZm9yIChjb25zdCB0b2tlbjIgb2YgdG9rZW5zVGhhdFJlc29sdmVUbygnd29ybGQnKSkge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShgJHt0b2tlbjF9JHt0b2tlbjJ9YCk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCdIZWxsbyB3b3JsZCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIGNhbiBiZSB1c2VkIGluIGhhc2gga2V5cyBidXQgbXVzdCByZXNvbHZlIHRvIGEgc3RyaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKCAnSSBhbSBhIHN0cmluZycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHMgPSB7XG4gICAgICBbdG9rZW4udG9TdHJpbmcoKV06IGBib29tICR7dG9rZW59YCxcbiAgICB9O1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlKHMpKS50b0VxdWFsKHsgJ0kgYW0gYSBzdHJpbmcnOiAnYm9vbSBJIGFtIGEgc3RyaW5nJyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIGNhbiBiZSBuZXN0ZWQgaW4gaGFzaCBrZXlzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKCkgPT4gJ0kgYW0gYSBzdHJpbmcnKSB9KSB9KSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcyA9IHtcbiAgICAgIFt0b2tlbi50b1N0cmluZygpXTogYGJvb20gJHt0b2tlbn1gLFxuICAgIH07XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmUocykpLnRvRXF1YWwoeyAnSSBhbSBhIHN0cmluZyc6ICdib29tIEkgYW0gYSBzdHJpbmcnIH0pO1xuICB9KTtcblxuICB0ZXN0KCdGdW5jdGlvbiBwYXNzZWQgdG8gTGF6eS51bmNhY2hlZFN0cmluZygpIGlzIGV2YWx1YXRlZCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb25zdCBjb3VudGVyU3RyaW5nID0gTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6ICgpID0+IGAkeysrY291bnRlcn1gIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcpKS50b0VxdWFsKCcxJyk7XG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZykpLnRvRXF1YWwoJzInKTtcbiAgfSk7XG5cbiAgdGVzdCgnRnVuY3Rpb24gcGFzc2VkIHRvIExhenkuc3RyaW5nKCkgaXMgb25seSBldmFsdWF0ZWQgb25jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb25zdCBjb3VudGVyU3RyaW5nID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBgJHsrK2NvdW50ZXJ9YCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzb2x2ZShjb3VudGVyU3RyaW5nKSkudG9FcXVhbCgnMScpO1xuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcpKS50b0VxdWFsKCcxJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1VuY2FjaGVkIHRva2VucyByZXR1cm5lZCBieSBjYWNoZWQgdG9rZW5zIGFyZSBzdGlsbCBldmFsdWF0ZWQgbXVsdGlwbGUgdGltZXMnLCAoKSA9PiB7XG4gICAgLy8gQ2hlY2sgdGhhdCBuZXN0ZWQgdG9rZW4gcmV0dXJucyBhcmVuJ3QgYWNjaWRlbnRhbGx5IGZ1bGx5IHJlc29sdmVkIGJ5IHRoZVxuICAgIC8vIGZpcnN0IHJlc29sdXRpb24uIE9uIGV2ZXJ5IGV2YWx1YXRpb24sIFRva2VucyByZWZlcmVuY2VkIGluc2lkZSB0aGVcbiAgICAvLyBzdHJ1Y3R1cmUgc2hvdWxkIGJlIGdpdmVuIGEgY2hhbmNlIHRvIGJlIGVpdGhlciBjYWNoZWQgb3IgdW5jYWNoZWQuXG5cbiAgICAvLyBHSVZFTlxuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBjb25zdCB1bmNhY2hlZFRva2VuID0gTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6ICgpID0+IGAkeysrY291bnRlcn1gIH0pO1xuICAgIC8vIERpcmVjdGx5IHJldHVybmVkXG4gICAgY29uc3QgY291bnRlclN0cmluZzEgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHVuY2FjaGVkVG9rZW4gfSk7XG4gICAgLy8gSW4gcXVvdGVkIGNvbnRleHRcbiAgICBjb25zdCBjb3VudGVyU3RyaW5nMiA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gYC0+JHt1bmNhY2hlZFRva2VufWAgfSk7XG4gICAgLy8gSW4gb2JqZWN0IGNvbnRleHRcbiAgICBjb25zdCBjb3VudGVyT2JqZWN0ID0gTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiAoeyBmaW5hbENvdW50OiB1bmNhY2hlZFRva2VuIH0pIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcxKSkudG9FcXVhbCgnMScpO1xuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcxKSkudG9FcXVhbCgnMicpO1xuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcyKSkudG9FcXVhbCgnLT4zJyk7XG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZzIpKS50b0VxdWFsKCctPjQnKTtcbiAgICBleHBlY3QocmVzb2x2ZShjb3VudGVyT2JqZWN0KSkudG9FcXVhbCh7IGZpbmFsQ291bnQ6ICc1JyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIGNhbiBiZSBuZXN0ZWQgYW5kIGNvbmNhdGVuYXRlZCBpbiBoYXNoIGtleXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBpbm5lclRva2VuID0gbmV3IEludHJpbnNpYyggJ3Rvb3QnKTtcbiAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoIGAke2lubmVyVG9rZW59IHRoZSB3b290YCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcyA9IHtcbiAgICAgIFt0b2tlbi50b1N0cmluZygpXTogJ2Jvb20gY2hpY2FnbycsXG4gICAgfTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzb2x2ZShzKSkudG9FcXVhbCh7ICd0b290IHRoZSB3b290JzogJ2Jvb20gY2hpY2FnbycgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBmaW5kIG5lc3RlZCB0b2tlbnMgaW4gaGFzaCBrZXlzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgaW5uZXJUb2tlbiA9IG5ldyBJbnRyaW5zaWMoICd0b290Jyk7XG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKCBgJHtpbm5lclRva2VufSB0aGUgd29vdGApO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHMgPSB7XG4gICAgICBbdG9rZW4udG9TdHJpbmcoKV06ICdib29tIGNoaWNhZ28nLFxuICAgIH07XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdG9rZW5zID0gZmluZFRva2VucyhuZXcgU3RhY2soKSwgKCkgPT4gcyk7XG4gICAgZXhwZWN0KHRva2Vucy5zb21lKHQgPT4gdCA9PT0gaW5uZXJUb2tlbikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHRva2Vucy5zb21lKHQgPT4gdCA9PT0gdG9rZW4pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiB0b2tlbiBpbiBhIGhhc2gga2V5IHJlc29sdmVzIHRvIGEgbm9uLXN0cmluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYyh7IFJlZjogJ090aGVyJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzID0ge1xuICAgICAgW3Rva2VuLnRvU3RyaW5nKCldOiBgYm9vbSAke3Rva2VufWAsXG4gICAgfTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gcmVzb2x2ZShzKSkudG9UaHJvdygnaXMgdXNlZCBhcyB0aGUga2V5IGluIGEgbWFwIHNvIG11c3QgcmVzb2x2ZSB0byBhIHN0cmluZywgYnV0IGl0IHJlc29sdmVzIHRvOicpO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGlzdCBlbmNvZGluZycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gZW5jb2RlIFRva2VuIHRvIHN0cmluZyBhbmQgcmVzb2x2ZSB0aGUgZW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJ1Y3QgPSB7XG4gICAgICAgIFhZWjogVG9rZW4uYXNMaXN0KHRva2VuKSxcbiAgICAgIH07XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChyZXNvbHZlKHN0cnVjdCkpLnRvRXF1YWwoe1xuICAgICAgICBYWVo6IHsgUmVmOiAnT3RoZXInIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBhZGQgdG8gZW5jb2RlZCBsaXN0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYyh7IFJlZjogJ090aGVyJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgZW5jb2RlZDogc3RyaW5nW10gPSBUb2tlbi5hc0xpc3QodG9rZW4pO1xuICAgICAgZW5jb2RlZC5wdXNoKCdoZWxsbycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGVuY29kZWQpO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IGFkZCBlbGVtZW50cyB0byBsaXN0IHRva2VuLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW5ub3QgYWRkIHRvIHN0cmluZ3MgaW4gZW5jb2RlZCBsaXN0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYyh7IFJlZjogJ090aGVyJyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgZW5jb2RlZDogc3RyaW5nW10gPSBUb2tlbi5hc0xpc3QodG9rZW4pO1xuICAgICAgZW5jb2RlZFswXSArPSAnaGVsbG8nO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGVuY29kZWQpO1xuICAgICAgfSkudG9UaHJvdygvY29uY2F0ZW5hdGUgc3RyaW5ncyBpbi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHBhc3MgZW5jb2RlZCBsaXN0cyB0byBGblNlbGVjdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBlbmNvZGVkOiBzdHJpbmdbXSA9IFRva2VuLmFzTGlzdChuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3RydWN0ID0gRm4uc2VsZWN0KDEsIGVuY29kZWQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QocmVzb2x2ZShzdHJ1Y3QpKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbMSwgeyBSZWY6ICdPdGhlcicgfV0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBwYXNzIGVuY29kZWQgbGlzdHMgdG8gRm5Kb2luJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGVuY29kZWQ6IHN0cmluZ1tdID0gVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdPdGhlcicgfSkpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJ1Y3QgPSBGbi5qb2luKCcvJywgZW5jb2RlZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChyZXNvbHZlKHN0cnVjdCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbJy8nLCB7IFJlZjogJ090aGVyJyB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHBhc3MgZW5jb2RlZCBsaXN0cyB0byBGbkpvaW4sIGV2ZW4gaWYgam9pbiBpcyBzdHJpbmdpZmllZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBlbmNvZGVkOiBzdHJpbmdbXSA9IFRva2VuLmFzTGlzdChuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc3RydWN0ID0gRm4uam9pbignLycsIGVuY29kZWQpLnRvU3RyaW5nKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChyZXNvbHZlKHN0cnVjdCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbJy8nLCB7IFJlZjogJ090aGVyJyB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGV0ZWN0IGFuZCBlcnJvciB3aGVuIGxpc3QgdG9rZW4gdmFsdWVzIGFyZSBpbGxlZ2FsbHkgZXh0cmFjdGVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGVuY29kZWQ6IHN0cmluZ1tdID0gVG9rZW4uYXNMaXN0KHsgUmVmOiAnT3RoZXInIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHsgdmFsdWU6IGVuY29kZWRbMF0gfSk7XG4gICAgICB9KS50b1Rocm93KC9Gb3VuZCBhbiBlbmNvZGVkIGxpc3QvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ251bWJlciBlbmNvZGluZycsICgpID0+IHtcbiAgICB0ZXN0KCdiYXNpYyBpbnRlZ2VyIGVuY29kaW5nIHdvcmtzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KDE2KS50b0VxdWFsKGV4dHJhY3RUb2tlbkRvdWJsZShjcmVhdGVUb2tlbkRvdWJsZSgxNikpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FyYml0cmFyeSBpbnRlZ2VycyBjYW4gYmUgZW5jb2RlZCwgc3RyaW5naWZpZWQsIGFuZCByZWNvdmVyZWQnLCAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICAgIC8vIFdlIGNhbiBlbmNvZGUgYWxsIG51bWJlcnMgdXAgdG8gMl40OC0xXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoTWF0aC5wb3coMiwgNDgpIC0gMSkpO1xuXG4gICAgICAgIGNvbnN0IGVuY29kZWQgPSBjcmVhdGVUb2tlbkRvdWJsZSh4KTtcbiAgICAgICAgLy8gUm91bmR0cmlwIHRocm91Z2ggSlNPTmlmaWNhdGlvblxuICAgICAgICBjb25zdCByb3VuZHRyaXBwZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHsgdGhlTnVtYmVyOiBlbmNvZGVkIH0pKS50aGVOdW1iZXI7XG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSBleHRyYWN0VG9rZW5Eb3VibGUocm91bmR0cmlwcGVkKTtcbiAgICAgICAgZXhwZWN0KGRlY29kZWQpLnRvRXF1YWwoeCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcmJpdHJhcnkgbnVtYmVycyBhcmUgY29ycmVjdGx5IGRldGVjdGVkIGFzIG5vdCBiZWluZyB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QodW5kZWZpbmVkKS50b0VxdWFsKGV4dHJhY3RUb2tlbkRvdWJsZSgwKSk7XG4gICAgICBleHBlY3QodW5kZWZpbmVkKS50b0VxdWFsKGV4dHJhY3RUb2tlbkRvdWJsZSgxMjQzKSk7XG4gICAgICBleHBlY3QodW5kZWZpbmVkKS50b0VxdWFsKGV4dHJhY3RUb2tlbkRvdWJsZSg0ODM1ZSs1MzIpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBudW1iZXItZW5jb2RlIGFuZCByZXNvbHZlIFRva2VuIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeCA9IG5ldyBJbnRyaW5zaWMoIDEyMyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGVuY29kZWQgPSBUb2tlbi5hc051bWJlcih4KTtcbiAgICAgIGV4cGVjdChmYWxzZSkudG9FcXVhbChpc1Jlc29sdmFibGVPYmplY3QoZW5jb2RlZCkpO1xuICAgICAgZXhwZWN0KHRydWUpLnRvRXF1YWwoVG9rZW4uaXNVbnJlc29sdmVkKGVuY29kZWQpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKHsgdmFsdWU6IGVuY29kZWQgfSk7XG4gICAgICBleHBlY3QocmVzb2x2ZWQpLnRvRXF1YWwoeyB2YWx1ZTogMTIzIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnVG9rZW5zIGFyZSBzdGlsbCByZXZlcnNpYmxlIGFmdGVyIGhhdmluZyBiZWVuIGVuY29kZWQgbXVsdGlwbGUgdGltZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgb3JpZ2luYWwgPSBuZXcgSW50cmluc2ljKDEyMyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGxldCB4OiBhbnkgPSBvcmlnaW5hbDtcbiAgICAgIHggPSBUb2tlbi5hc1N0cmluZyh4KTtcbiAgICAgIHggPSBUb2tlbi5hc051bWJlcih4KTtcbiAgICAgIHggPSBUb2tlbi5hc0xpc3QoeCk7XG4gICAgICB4ID0gVG9rZW4uYXNTdHJpbmcoeCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChUb2tlbml6YXRpb24ucmV2ZXJzZSh4KSkudG9CZShvcmlnaW5hbCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZWdleCBkZXRlY3RzIGFsbCBzdHJpbmdpZmljYXRpb25zIG9mIGVuY29kZWQgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHN0cmluZ0NvbnRhaW5zTnVtYmVyVG9rZW5zKGAke2NyZWF0ZVRva2VuRG91YmxlKDApfWApKS50b0JlVHJ1dGh5KCk7XG4gICAgICBleHBlY3Qoc3RyaW5nQ29udGFpbnNOdW1iZXJUb2tlbnMoYCR7Y3JlYXRlVG9rZW5Eb3VibGUoTWF0aC5wb3coMiwgNDgpIC0gMSl9YCkpLnRvQmVUcnV0aHkoKTsgLy8gTUFYX0VOQ09EQUJMRV9JTlRFR0VSXG4gICAgICBleHBlY3Qoc3RyaW5nQ29udGFpbnNOdW1iZXJUb2tlbnMoJzEyMzQnKSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjaGVjayB0aGF0IHRoZSBmaXJzdCBOIGVuY29kZWQgbnVtYmVycyBjYW4gYmUgZGV0ZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoU1RSSU5HSUZJRURfTlVNQkVSX1BBVFRFUk4pO1xuICAgICAgLy8gUmFuIHRoaXMgdXAgdG8gMSBtaWxsaW9uIG9mZmxpbmVcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG4gICAgICAgIGV4cGVjdChgJHtjcmVhdGVUb2tlbkRvdWJsZShpKX1gKS50b01hdGNoKHJlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QoJ2hhbmRsZSBzdHJpbmdpZmllZCBudW1iZXIgdG9rZW4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgdG9rID0gYHRoZSBhbnN3ZXIgaXM6ICR7TGF6eS5udW1iZXIoeyBwcm9kdWNlOiAoKSA9PiA4NiB9KX1gO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QocmVzb2x2ZSh7IHZhbHVlOiBgJHt0b2t9YCB9KSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAndGhlIGFuc3dlciBpczogODYnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdoYW5kbGUgc3RyaW5naWZpZWQgbnVtYmVyIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCByZXMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHsgdHlwZTogJ015OjpSZXNvdXJjZScgfSk7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgdG9rID0gYHRoZSBhbnN3ZXIgaXM6ICR7VG9rZW4uYXNOdW1iZXIocmVzLnJlZil9YDtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHJlc29sdmUoeyB2YWx1ZTogYCR7dG9rfWAgfSkpLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogeyAnRm46OkpvaW4nOiBbJycsIFsndGhlIGFuc3dlciBpczogJywgeyBSZWY6ICdSZXNvdXJjZScgfV1dIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYHN0YWNrIHRyYWNlIGlzIGNhcHR1cmVkIGF0IHRva2VuIGNyZWF0aWBvbicsICgpID0+IHtcbiAgICBmdW5jdGlvbiBmbjEoKSB7XG4gICAgICBmdW5jdGlvbiBmbjIoKSB7XG4gICAgICAgIGNsYXNzIEV4cG9zZVRyYWNlIGV4dGVuZHMgSW50cmluc2ljIHtcbiAgICAgICAgICBwdWJsaWMgZ2V0IGNyZWF0aW9uVHJhY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGlvblN0YWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRXhwb3NlVHJhY2UoJ2hlbGxvJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbjIoKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHRva2VuID0gZm4xKCk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG4gICAgZXhwZWN0KHRva2VuLmNyZWF0aW9uVHJhY2UuZmluZCh4ID0+IHguaW5jbHVkZXMoJ2ZuMScpKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QodG9rZW4uY3JlYXRpb25UcmFjZS5maW5kKHggPT4geC5pbmNsdWRlcygnZm4yJykpKS50b0JlRGVmaW5lZCgpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ25ld0Vycm9yIHJldHVybnMgYW4gZXJyb3Igd2l0aCB0aGUgY3JlYXRpb24gc3RhY2sgdHJhY2UnLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gZm4xKCkge1xuICAgICAgZnVuY3Rpb24gZm4yKCkge1xuICAgICAgICBmdW5jdGlvbiBmbjMoKSB7XG4gICAgICAgICAgY2xhc3MgVGhyb3dpbmdUb2tlbiBleHRlbmRzIEludHJpbnNpYyB7XG4gICAgICAgICAgICBwdWJsaWMgdGhyb3dFcnJvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgdGhyb3cgdGhpcy5uZXdFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBUaHJvd2luZ1Rva2VuKCdib29tJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm4zKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZm4yKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHJlRW5hYmxlU3RhY2tUcmFjZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCB0b2tlbiA9IGZuMSgpO1xuICAgIHJlc3RvcmVTdGFja1RyYWNlQ29sZWN0aW9uKHByZXZpb3VzVmFsdWUpO1xuICAgIGV4cGVjdCgoKSA9PiB0b2tlbi50aHJvd0Vycm9yKCdtZXNzYWdlIScpKS50b1Rocm93KC9Ub2tlbiBjcmVhdGVkOi8pO1xuICB9KTtcblxuICBkZXNjcmliZSgndHlwZSBjb2VyY2lvbicsICgpID0+IHtcbiAgICBjb25zdCBpbnB1dHMgPSBbXG4gICAgICAnYSBzdHJpbmcnLFxuICAgICAgMTIzNCxcbiAgICAgIHsgYW5fb2JqZWN0OiAxMjM0IH0sXG4gICAgICBbMSwgMiwgM10sXG4gICAgICBmYWxzZSxcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCBpbnB1dCBvZiBpbnB1dHMpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdHJpbmdUb2tlbiA9IFRva2VuLmFzU3RyaW5nKG5ldyBJbnRyaW5zaWMoaW5wdXQpKTtcbiAgICAgIGNvbnN0IG51bWJlclRva2VuID0gVG9rZW4uYXNOdW1iZXIobmV3IEludHJpbnNpYyhpbnB1dCkpO1xuICAgICAgY29uc3QgbGlzdFRva2VuID0gVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoaW5wdXQpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBpbnB1dDtcblxuICAgICAgdGVzdChgJHtpbnB1dH08c3RyaW5nPi50b051bWJlcigpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShUb2tlbi5hc051bWJlcihuZXcgSW50cmluc2ljKHN0cmluZ1Rva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxsaXN0Pi50b051bWJlcigpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShUb2tlbi5hc051bWJlcihuZXcgSW50cmluc2ljKGxpc3RUb2tlbikpKSkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChgJHtpbnB1dH08bnVtYmVyPi50b051bWJlcigpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShUb2tlbi5hc051bWJlcihuZXcgSW50cmluc2ljKG51bWJlclRva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxzdHJpbmc+LnRvU3RyaW5nKClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKG5ldyBJbnRyaW5zaWMoc3RyaW5nVG9rZW4pLnRvU3RyaW5nKCkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxsaXN0Pi50b1N0cmluZygpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShuZXcgSW50cmluc2ljKGxpc3RUb2tlbikudG9TdHJpbmcoKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PG51bWJlcj4udG9TdHJpbmcoKWAsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc29sdmUobmV3IEludHJpbnNpYyhudW1iZXJUb2tlbikudG9TdHJpbmcoKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PHN0cmluZz4udG9MaXN0KClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuLmFzTGlzdChuZXcgSW50cmluc2ljKHN0cmluZ1Rva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxsaXN0Pi50b0xpc3QoKWAsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc29sdmUoVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMobGlzdFRva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxudW1iZXI+LnRvTGlzdCgpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShUb2tlbi5hc0xpc3QobmV3IEludHJpbnNpYyhudW1iZXJUb2tlbikpKSkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0aW9uIHN0YWNrIGlzIGF0dGFjaGVkIHRvIGVycm9ycyBlbWl0dGVkIGR1cmluZyByZXNvbHZlIHdpdGggQ0RLX0RFQlVHPXRydWUnLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gc2hvd01lSW5UaGVTdGFja1RyYWNlKCkge1xuICAgICAgcmV0dXJuIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ2Zvb0Vycm9yJyk7IH0gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHByb2Nlc3MuZW52LkNES19ERUJVRztcblxuICAgIHByb2Nlc3MuZW52LkNES19ERUJVRyA9ICd0cnVlJztcbiAgICBjb25zdCB4ID0gc2hvd01lSW5UaGVTdGFja1RyYWNlKCk7XG4gICAgbGV0IG1lc3NhZ2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc29sdmUoeCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbWVzc2FnZSA9IChlIGFzIEVycm9yKS5tZXNzYWdlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBwcm9jZXNzLmVudi5DREtfREVCVUcgPSBwcmV2aW91c1ZhbHVlO1xuICAgIH1cblxuICAgIGV4cGVjdChtZXNzYWdlICYmIG1lc3NhZ2UuaW5jbHVkZXMoJ3Nob3dNZUluVGhlU3RhY2tUcmFjZScpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGlvbiBzdGFjayBpcyBvbWl0dGVkIHdpdGhvdXQgQ0RLX0RFQlVHPXRydWUnLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gc2hvd01lSW5UaGVTdGFja1RyYWNlKCkge1xuICAgICAgcmV0dXJuIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ2Zvb0Vycm9yJyk7IH0gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHByb2Nlc3MuZW52LkNES19ERUJVRztcbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHO1xuXG4gICAgY29uc3QgeCA9IHNob3dNZUluVGhlU3RhY2tUcmFjZSgpO1xuICAgIGxldCBtZXNzYWdlO1xuICAgIHRyeSB7XG4gICAgICByZXNvbHZlKHgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG1lc3NhZ2UgPSAoZSBhcyBFcnJvcikubWVzc2FnZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHID0gcHJldmlvdXNWYWx1ZTtcbiAgICB9XG5cbiAgICBleHBlY3QobWVzc2FnZSAmJiBtZXNzYWdlLmluY2x1ZGVzKCdFeGVjdXRlIGFnYWluIHdpdGggQ0RLX0RFQlVHPXRydWUnKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N0cmluZ2lmeU51bWJlcicsICgpID0+IHtcbiAgICB0ZXN0KCdjb252ZXJ0cyBudW1iZXIgdG8gc3RyaW5nJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoMTAwKSkudG9FcXVhbCgnMTAwJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb252ZXJ0cyB0b2tlbml6ZWQgbnVtYmVyIHRvIHN0cmluZycsICgpID0+IHtcbiAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoe1xuICAgICAgICByZXNvbHZlOiAoKSA9PiAxMDAsXG4gICAgICB9IGFzIGFueSkpKS50b0VxdWFsKCcxMDAnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N0cmluZyByZW1haW5zIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoJzEyMycgYXMgYW55KSkudG9FcXVhbCgnMTIzJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdSZWYgcmVtYWlucyB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHsgUmVmOiAnU29tZUxvZ2ljYWxJZCcgfTtcbiAgICAgIGV4cGVjdChUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKHZhbCBhcyBhbnkpKS50b0VxdWFsKHZhbCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdsYXp5IFJlZiByZW1haW5zIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWRWYWwgPSB7IFJlZjogJ1NvbWVMb2dpY2FsSWQnIH07XG4gICAgICBjb25zdCB0b2tlbml6ZWRWYWwgPSBMYXp5LmFueSh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+IHJlc29sdmVkVmFsLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXMgPSBUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKHRva2VuaXplZFZhbCBhcyBhbnkpIGFzIGFueTtcbiAgICAgIGV4cGVjdChyZXMpLm5vdC50b0VxdWFsKHJlc29sdmVkVmFsKTtcbiAgICAgIGV4cGVjdChyZXNvbHZlKHJlcykpLnRvRXF1YWwocmVzb2x2ZWRWYWwpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndG9rZW5pemVkIFJlZiByZW1haW5zIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWRWYWwgPSB7IFJlZjogJ1NvbWVMb2dpY2FsSWQnIH07XG4gICAgICBjb25zdCB0b2tlbml6ZWRWYWwgPSBUb2tlbi5hc051bWJlcihyZXNvbHZlZFZhbCk7XG4gICAgICBjb25zdCByZXMgPSBUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKHRva2VuaXplZFZhbCkgYXMgYW55O1xuICAgICAgZXhwZWN0KHJlcykubm90LnRvRXF1YWwocmVzb2x2ZWRWYWwpO1xuICAgICAgZXhwZWN0KHJlc29sdmUocmVzKSkudG9FcXVhbChyZXNvbHZlZFZhbCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFByb21pc2UyIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjayA9IFtdO1xuXG4gIHB1YmxpYyByZXNvbHZlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBEYXRhOiB7XG4gICAgICAgIHN0cmluZ1Byb3A6ICdoZWxsbycsXG4gICAgICAgIG51bWJlclByb3A6IDEyMzQsXG4gICAgICB9LFxuICAgICAgUmVjdXJzZTogbmV3IEludHJpbnNpYyggNDIpLFxuICAgIH07XG4gIH1cbn1cblxuY2xhc3MgUHJvbWlzZTEgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrID0gW107XG4gIHB1YmxpYyBwMiA9IFtuZXcgUHJvbWlzZTIoKSwgbmV3IFByb21pc2UyKCldO1xuXG4gIHB1YmxpYyByZXNvbHZlKCkge1xuICAgIHJldHVybiB0aGlzLnAyO1xuICB9XG59XG5cbmNsYXNzIEJhc2VEYXRhVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZvbzogbnVtYmVyKSB7XG4gIH1cbn1cblxuY2xhc3MgRGF0YVR5cGUgZXh0ZW5kcyBCYXNlRGF0YVR5cGUge1xuICBwdWJsaWMgZ29vID0gJ2hlbGxvJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigxMik7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVG9rZW5zIGluIGJvdGggZmxhdm9ycyB0aGF0IHJlc29sdmUgdG8gdGhlIGdpdmVuIHN0cmluZ1xuICovXG5mdW5jdGlvbiB0b2tlbnNUaGF0UmVzb2x2ZVRvKHZhbHVlOiBhbnkpOiBUb2tlbltdIHtcbiAgcmV0dXJuIFtcbiAgICBuZXcgSW50cmluc2ljKHZhbHVlKSxcbiAgICBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHZhbHVlIH0pLFxuICBdO1xufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHJlc29sdmUgdGhhdCBjcmVhdGVzIGFuIHRocm93YXdheSBDb25zdHJ1Y3QgdG8gY2FsbCBpdCBvblxuICpcbiAqIFNvIEkgZG9uJ3QgaGF2ZSB0byBjaGFuZ2UgYWxsIGNhbGwgc2l0ZXMgaW4gdGhpcyBmaWxlLlxuICovXG5mdW5jdGlvbiByZXNvbHZlKHg6IGFueSkge1xuICByZXR1cm4gbmV3IFN0YWNrKCkucmVzb2x2ZSh4KTtcbn1cblxuIl19