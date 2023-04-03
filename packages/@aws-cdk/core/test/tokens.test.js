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
        expect(lib_1.isResolvableObject({ resolve: () => 123 })).toEqual(true);
        expect(lib_1.isResolvableObject({ a: 1, b: 2, resolve: () => 'hello' })).toEqual(true);
        expect(lib_1.isResolvableObject({ a: 1, b: 2, resolve: 3 })).toEqual(false);
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
        expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('The dog says: woof woof');
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
        expect(evaluate_cfn_1.evaluateCFN(resolved1)).toEqual('hello world');
        expect(evaluate_cfn_1.evaluateCFN(resolved2)).toEqual('hello world');
    });
    test('integer Tokens can be stringified and evaluate to conceptual value', () => {
        // GIVEN
        for (const token of tokensThatResolveTo(1)) {
            // WHEN
            const stringified = `the number is ${token}`;
            const resolved = resolve(stringified);
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('the number is 1');
        }
    });
    test('intrinsic Tokens can be stringified and evaluate to conceptual value', () => {
        // GIVEN
        for (const bucketName of tokensThatResolveTo({ Ref: 'MyBucket' })) {
            // WHEN
            const resolved = resolve(`my bucket is named ${bucketName}`);
            // THEN
            const context = { MyBucket: 'TheName' };
            expect(evaluate_cfn_1.evaluateCFN(resolved, context)).toEqual('my bucket is named TheName');
        }
    });
    test('tokens resolve properly in initial position', () => {
        // GIVEN
        for (const token of tokensThatResolveTo('Hello')) {
            // WHEN
            const resolved = resolve(`${token} world`);
            // THEN
            expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('Hello world');
        }
    });
    test('side-by-side Tokens resolve correctly', () => {
        // GIVEN
        for (const token1 of tokensThatResolveTo('Hello ')) {
            for (const token2 of tokensThatResolveTo('world')) {
                // WHEN
                const resolved = resolve(`${token1}${token2}`);
                // THEN
                expect(evaluate_cfn_1.evaluateCFN(resolved)).toEqual('Hello world');
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
        const tokens = resolve_1.findTokens(new lib_1.Stack(), () => s);
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
            expect(16).toEqual(encoding_1.extractTokenDouble(encoding_1.createTokenDouble(16)));
        });
        test('arbitrary integers can be encoded, stringified, and recovered', () => {
            for (let i = 0; i < 100; i++) {
                // We can encode all numbers up to 2^48-1
                const x = Math.floor(Math.random() * (Math.pow(2, 48) - 1));
                const encoded = encoding_1.createTokenDouble(x);
                // Roundtrip through JSONification
                const roundtripped = JSON.parse(JSON.stringify({ theNumber: encoded })).theNumber;
                const decoded = encoding_1.extractTokenDouble(roundtripped);
                expect(decoded).toEqual(x);
            }
        });
        test('arbitrary numbers are correctly detected as not being tokens', () => {
            expect(undefined).toEqual(encoding_1.extractTokenDouble(0));
            expect(undefined).toEqual(encoding_1.extractTokenDouble(1243));
            expect(undefined).toEqual(encoding_1.extractTokenDouble(4835e+532));
        });
        test('can number-encode and resolve Token objects', () => {
            // GIVEN
            const x = new intrinsic_1.Intrinsic(123);
            // THEN
            const encoded = lib_1.Token.asNumber(x);
            expect(false).toEqual(lib_1.isResolvableObject(encoded));
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
            expect(encoding_1.stringContainsNumberTokens(`${encoding_1.createTokenDouble(0)}`)).toBeTruthy();
            expect(encoding_1.stringContainsNumberTokens(`${encoding_1.createTokenDouble(Math.pow(2, 48) - 1)}`)).toBeTruthy(); // MAX_ENCODABLE_INTEGER
            expect(encoding_1.stringContainsNumberTokens('1234')).toBeFalsy();
        });
        test('check that the first N encoded numbers can be detected', () => {
            const re = new RegExp(encoding_1.STRINGIFIED_NUMBER_PATTERN);
            // Ran this up to 1 million offline
            for (let i = 0; i < 1000; i++) {
                expect(`${encoding_1.createTokenDouble(i)}`).toMatch(re);
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
        const previousValue = util_1.reEnableStackTraceCollection();
        const token = fn1();
        util_1.restoreStackTraceColection(previousValue);
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
        const previousValue = util_1.reEnableStackTraceCollection();
        const token = fn1();
        util_1.restoreStackTraceColection(previousValue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b2tlbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE2QztBQUM3QyxpQ0FBa0Y7QUFDbEYsZ0NBQStGO0FBQy9GLHNEQUF3STtBQUN4SSx3REFBcUQ7QUFDckQsb0RBQW9EO0FBR3BELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxNQUFNLEdBQUcsR0FBRztZQUNWLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxJQUFJLHFCQUFTLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUM7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzNCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxPQUFPO1NBQ25CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzNCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7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QUFDO0lBV3JDLENBQUM7SUFUUSxPQUFPO1FBQ1osT0FBTztZQUNMLElBQUksRUFBRTtnQkFDSixVQUFVLEVBQUUsT0FBTztnQkFDbkIsVUFBVSxFQUFFLElBQUk7YUFDakI7WUFDRCxPQUFPLEVBQUUsSUFBSSxxQkFBUyxDQUFFLEVBQUUsQ0FBQztTQUM1QixDQUFDO0tBQ0g7Q0FDRjtBQUVELE1BQU0sUUFBUTtJQUFkO1FBQ2tCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQzVCLE9BQUUsR0FBRyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBSy9DLENBQUM7SUFIUSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQ2hCO0NBQ0Y7QUFFRCxNQUFNLFlBQVk7SUFDaEIsWUFBcUIsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7S0FDL0I7Q0FDRjtBQUVELE1BQU0sUUFBUyxTQUFRLFlBQVk7SUFHakM7UUFDRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFITCxRQUFHLEdBQUcsT0FBTyxDQUFDO0tBSXBCO0NBQ0Y7QUFFRDs7R0FFRztBQUNILFNBQVMsbUJBQW1CLENBQUMsS0FBVTtJQUNyQyxPQUFPO1FBQ0wsSUFBSSxxQkFBUyxDQUFDLEtBQUssQ0FBQztRQUNwQixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ25DLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsT0FBTyxDQUFDLENBQU07SUFDckIsT0FBTyxJQUFJLFdBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXZhbHVhdGVDRk4gfSBmcm9tICcuL2V2YWx1YXRlLWNmbic7XG5pbXBvcnQgeyByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uLCByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSwgRm4sIGlzUmVzb2x2YWJsZU9iamVjdCwgTGF6eSwgU3RhY2ssIFRva2VuLCBUb2tlbml6YXRpb24gfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgY3JlYXRlVG9rZW5Eb3VibGUsIGV4dHJhY3RUb2tlbkRvdWJsZSwgc3RyaW5nQ29udGFpbnNOdW1iZXJUb2tlbnMsIFNUUklOR0lGSUVEX05VTUJFUl9QQVRURVJOIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvZW5jb2RpbmcnO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvaW50cmluc2ljJztcbmltcG9ydCB7IGZpbmRUb2tlbnMgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9yZXNvbHZlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlIH0gZnJvbSAnLi4vbGliL3Jlc29sdmFibGUnO1xuXG5kZXNjcmliZSgndG9rZW5zJywgKCkgPT4ge1xuICB0ZXN0KCdyZXNvbHZlIGEgcGxhaW4gb2xkIG9iamVjdCBzaG91bGQganVzdCByZXR1cm4gdGhlIG9iamVjdCcsICgpID0+IHtcbiAgICBjb25zdCBvYmogPSB7IFBsYWluT2xkT2JqZWN0OiAxMjMsIEFycmF5OiBbMSwgMiwgM10gfTtcbiAgICBleHBlY3QocmVzb2x2ZShvYmopKS50b0VxdWFsKG9iaik7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGEgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYSB0b2tlbiB2YWx1ZSwgaXQgd2lsbCBiZSBldmFsdWF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgUmVndWxhclZhbHVlOiAnaGVsbG8nLFxuICAgICAgTGF6eVZhbHVlOiBuZXcgSW50cmluc2ljKCdXb3JsZCcpLFxuICAgIH07XG5cbiAgICBleHBlY3QocmVzb2x2ZShvYmopKS50b0VxdWFsKHtcbiAgICAgIFJlZ3VsYXJWYWx1ZTogJ2hlbGxvJyxcbiAgICAgIExhenlWYWx1ZTogJ1dvcmxkJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIGFyZSBldmFsdWF0ZWQgYW55d2hlcmUgaW4gdGhlIG9iamVjdCB0cmVlJywgKCkgPT4ge1xuICAgIGNvbnN0IG9iaiA9IG5ldyBQcm9taXNlMSgpO1xuICAgIGNvbnN0IGFjdHVhbCA9IHJlc29sdmUoeyBPYmo6IG9iaiB9KTtcblxuICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoe1xuICAgICAgT2JqOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBEYXRhOiB7XG4gICAgICAgICAgICBzdHJpbmdQcm9wOiAnaGVsbG8nLFxuICAgICAgICAgICAgbnVtYmVyUHJvcDogMTIzNCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlY3Vyc2U6IDQyLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGF0YToge1xuICAgICAgICAgICAgc3RyaW5nUHJvcDogJ2hlbGxvJyxcbiAgICAgICAgICAgIG51bWJlclByb3A6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWN1cnNlOiA0MixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyBhcmUgZXZhbHVhdGVkIHJlY3Vyc2l2ZWx5JywgKCkgPT4ge1xuICAgIGNvbnN0IG9iaiA9IG5ldyBQcm9taXNlMSgpO1xuICAgIGNvbnN0IGFjdHVhbCA9IHJlc29sdmUobmV3IEludHJpbnNpYyh7IE9iajogb2JqIH0pKTtcblxuICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoe1xuICAgICAgT2JqOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBEYXRhOiB7XG4gICAgICAgICAgICBzdHJpbmdQcm9wOiAnaGVsbG8nLFxuICAgICAgICAgICAgbnVtYmVyUHJvcDogMTIzNCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlY3Vyc2U6IDQyLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGF0YToge1xuICAgICAgICAgICAgc3RyaW5nUHJvcDogJ2hlbGxvJyxcbiAgICAgICAgICAgIG51bWJlclByb3A6IDEyMzQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZWN1cnNlOiA0MixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtcHR5IGFycmF5cyBvciBvYmplY3RzIGFyZSBrZXB0JywgKCkgPT4ge1xuICAgIGV4cGVjdChyZXNvbHZlKHsgfSkpLnRvRXF1YWwoeyB9KTtcbiAgICBleHBlY3QocmVzb2x2ZShbXSkpLnRvRXF1YWwoW10pO1xuXG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgUHJvcDE6IDEyMzQsXG4gICAgICBQcm9wMjogeyB9LFxuICAgICAgUHJvcDM6IFtdLFxuICAgICAgUHJvcDQ6ICdoZWxsbycsXG4gICAgICBQcm9wNToge1xuICAgICAgICBQcm9wQTogeyB9LFxuICAgICAgICBQcm9wQjoge1xuICAgICAgICAgIFByb3BDOiBbdW5kZWZpbmVkLCB1bmRlZmluZWRdLFxuICAgICAgICAgIFByb3BEOiAnWW9vaG9vJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGV4cGVjdChyZXNvbHZlKG9iaikpLnRvRXF1YWwoe1xuICAgICAgUHJvcDE6IDEyMzQsXG4gICAgICBQcm9wMjogeyB9LFxuICAgICAgUHJvcDM6IFtdLFxuICAgICAgUHJvcDQ6ICdoZWxsbycsXG4gICAgICBQcm9wNToge1xuICAgICAgICBQcm9wQTogeyB9LFxuICAgICAgICBQcm9wQjoge1xuICAgICAgICAgIFByb3BDOiBbXSxcbiAgICAgICAgICBQcm9wRDogJ1lvb2hvbycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiBhbiBvYmplY3QgaGFzIGEgXCJyZXNvbHZlXCIgcHJvcGVydHkgdGhhdCBpcyBub3QgYSBmdW5jdGlvbiwgaXQgaXMgbm90IGNvbnNpZGVyZWQgYSB0b2tlbicsICgpID0+IHtcbiAgICBleHBlY3QocmVzb2x2ZSh7IGFfdG9rZW46IHsgcmVzb2x2ZTogKCkgPT4gNzg3ODcgfSB9KSkudG9FcXVhbCh7IGFfdG9rZW46IDc4Nzg3IH0pO1xuICAgIGV4cGVjdChyZXNvbHZlKHsgbm90X2FfdG9rZW46IHsgcmVzb2x2ZTogMTIgfSB9KSkudG9FcXVhbCh7IG5vdF9hX3Rva2VuOiB7IHJlc29sdmU6IDEyIH0gfSk7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIHRlc3QoJ2lmIGEgcmVzb2x2YWJsZSBvYmplY3QgaW5oZXJpdHMgZnJvbSBhIGNsYXNzIHRoYXQgaXMgYWxzbyByZXNvbHZhYmxlLCB0aGUgXCJjb25zdHJ1Y3RvclwiIGZ1bmN0aW9uIHdpbGwgbm90IGdldCBpbiB0aGUgd2F5ICh1c2VzIE9iamVjdC5rZXlzIGluc3RlYWQgb2YgXCJmb3IgaW5cIiknLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJlc29sdmUoeyBwcm9wOiBuZXcgRGF0YVR5cGUoKSB9KSkudG9FcXVhbCh7IHByb3A6IHsgZm9vOiAxMiwgZ29vOiAnaGVsbG8nIH0gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lzVG9rZW4ob2JqKSBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgdG9rZW4nLCAoKSA9PiB7XG4gICAgZXhwZWN0KGlzUmVzb2x2YWJsZU9iamVjdCh7IHJlc29sdmU6ICgpID0+IDEyMyB9KSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QoaXNSZXNvbHZhYmxlT2JqZWN0KHsgYTogMSwgYjogMiwgcmVzb2x2ZTogKCkgPT4gJ2hlbGxvJyB9KSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QoaXNSZXNvbHZhYmxlT2JqZWN0KHsgYTogMSwgYjogMiwgcmVzb2x2ZTogMyB9KSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rva2VuIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSB0b2tlbnMgdGhhdCBjb250YWluIGEgY29uc3RhbnQgdmFsdWUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJlc29sdmUobmV3IEludHJpbnNpYygxMikpKS50b0VxdWFsKDEyKTtcbiAgICBleHBlY3QocmVzb2x2ZShuZXcgSW50cmluc2ljKCdoZWxsbycpKSkudG9FcXVhbCgnaGVsbG8nKTtcbiAgICBleHBlY3QocmVzb2x2ZShuZXcgSW50cmluc2ljKFsnaGknLCAndGhlcmUnXSkpKS50b0VxdWFsKFsnaGknLCAndGhlcmUnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc29sdmluZyBsZWF2ZXMgYSBEYXRlIG9iamVjdCBpbiB3b3JraW5nIG9yZGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgnMjAwMC0wMS0wMScpO1xuICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShkYXRlKTtcblxuICAgIGV4cGVjdChkYXRlLnRvU3RyaW5nKCkpLnRvRXF1YWwocmVzb2x2ZWQudG9TdHJpbmcoKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyBjYW4gYmUgc3RyaW5naWZpZWQgYW5kIGV2YWx1YXRlZCB0byBjb25jZXB0dWFsIHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKCd3b29mIHdvb2YnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdHJpbmdpZmllZCA9IGBUaGUgZG9nIHNheXM6ICR7dG9rZW59YDtcbiAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmUoc3RyaW5naWZpZWQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ1RoZSBkb2cgc2F5czogd29vZiB3b29mJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rva2VucyBzdHJpbmdpZmljYXRpb24gY2FuIGJlIHJldmVyc2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKCd3b29mIHdvb2YnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9rZW4pLnRvRXF1YWwoVG9rZW5pemF0aW9uLnJldmVyc2VTdHJpbmcoYCR7dG9rZW59YCkuZmlyc3RUb2tlbik7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rva2VucyBzdHJpbmdpZmljYXRpb24gYW5kIHJldmVyc2luZyBvZiBDbG91ZEZvcm1hdGlvbiBUb2tlbnMgaXMgaW1wbGVtZW50ZWQgdXNpbmcgRm46OkpvaW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoICh7IHdvb2Y6ICd3b29mJyB9KSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RyaW5naWZpZWQgPSBgVGhlIGRvZyBzYXlzOiAke3Rva2VufWA7XG4gICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKHN0cmluZ2lmaWVkKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzb2x2ZWQpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbJ1RoZSBkb2cgc2F5czogJywgeyB3b29mOiAnd29vZicgfV1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdEb3VibHkgbmVzdGVkIHN0cmluZ3MgZXZhbHVhdGUgY29ycmVjdGx5IGluIHNjYWxhciBjb250ZXh0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4xID0gbmV3IEludHJpbnNpYyggJ3dvcmxkJyk7XG4gICAgY29uc3QgdG9rZW4yID0gbmV3IEludHJpbnNpYyggYGhlbGxvICR7dG9rZW4xfWApO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc29sdmVkMSA9IHJlc29sdmUodG9rZW4yLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHJlc29sdmVkMiA9IHJlc29sdmUodG9rZW4yKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQxKSkudG9FcXVhbCgnaGVsbG8gd29ybGQnKTtcbiAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQyKSkudG9FcXVhbCgnaGVsbG8gd29ybGQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW50ZWdlciBUb2tlbnMgY2FuIGJlIHN0cmluZ2lmaWVkIGFuZCBldmFsdWF0ZSB0byBjb25jZXB0dWFsIHZhbHVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnNUaGF0UmVzb2x2ZVRvKDEpKSB7XG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJpbmdpZmllZCA9IGB0aGUgbnVtYmVyIGlzICR7dG9rZW59YDtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShzdHJpbmdpZmllZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ3RoZSBudW1iZXIgaXMgMScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnaW50cmluc2ljIFRva2VucyBjYW4gYmUgc3RyaW5naWZpZWQgYW5kIGV2YWx1YXRlIHRvIGNvbmNlcHR1YWwgdmFsdWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBmb3IgKGNvbnN0IGJ1Y2tldE5hbWUgb2YgdG9rZW5zVGhhdFJlc29sdmVUbyh7IFJlZjogJ015QnVja2V0JyB9KSkge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKGBteSBidWNrZXQgaXMgbmFtZWQgJHtidWNrZXROYW1lfWApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBjb250ZXh0ID0geyBNeUJ1Y2tldDogJ1RoZU5hbWUnIH07XG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQsIGNvbnRleHQpKS50b0VxdWFsKCdteSBidWNrZXQgaXMgbmFtZWQgVGhlTmFtZScpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIHJlc29sdmUgcHJvcGVybHkgaW4gaW5pdGlhbCBwb3NpdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zVGhhdFJlc29sdmVUbygnSGVsbG8nKSkge1xuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKGAke3Rva2VufSB3b3JsZGApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoZXZhbHVhdGVDRk4ocmVzb2x2ZWQpKS50b0VxdWFsKCdIZWxsbyB3b3JsZCcpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnc2lkZS1ieS1zaWRlIFRva2VucyByZXNvbHZlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGZvciAoY29uc3QgdG9rZW4xIG9mIHRva2Vuc1RoYXRSZXNvbHZlVG8oJ0hlbGxvICcpKSB7XG4gICAgICBmb3IgKGNvbnN0IHRva2VuMiBvZiB0b2tlbnNUaGF0UmVzb2x2ZVRvKCd3b3JsZCcpKSB7XG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKGAke3Rva2VuMX0ke3Rva2VuMn1gKTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdChldmFsdWF0ZUNGTihyZXNvbHZlZCkpLnRvRXF1YWwoJ0hlbGxvIHdvcmxkJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgY2FuIGJlIHVzZWQgaW4gaGFzaCBrZXlzIGJ1dCBtdXN0IHJlc29sdmUgdG8gYSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoICdJIGFtIGEgc3RyaW5nJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcyA9IHtcbiAgICAgIFt0b2tlbi50b1N0cmluZygpXTogYGJvb20gJHt0b2tlbn1gLFxuICAgIH07XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmUocykpLnRvRXF1YWwoeyAnSSBhbSBhIHN0cmluZyc6ICdib29tIEkgYW0gYSBzdHJpbmcnIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgY2FuIGJlIG5lc3RlZCBpbiBoYXNoIGtleXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgoKSA9PiAnSSBhbSBhIHN0cmluZycpIH0pIH0pKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzID0ge1xuICAgICAgW3Rva2VuLnRvU3RyaW5nKCldOiBgYm9vbSAke3Rva2VufWAsXG4gICAgfTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzb2x2ZShzKSkudG9FcXVhbCh7ICdJIGFtIGEgc3RyaW5nJzogJ2Jvb20gSSBhbSBhIHN0cmluZycgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Z1bmN0aW9uIHBhc3NlZCB0byBMYXp5LnVuY2FjaGVkU3RyaW5nKCkgaXMgZXZhbHVhdGVkIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IGNvdW50ZXJTdHJpbmcgPSBMYXp5LnVuY2FjaGVkU3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gYCR7Kytjb3VudGVyfWAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZykpLnRvRXF1YWwoJzEnKTtcbiAgICBleHBlY3QocmVzb2x2ZShjb3VudGVyU3RyaW5nKSkudG9FcXVhbCgnMicpO1xuICB9KTtcblxuICB0ZXN0KCdGdW5jdGlvbiBwYXNzZWQgdG8gTGF6eS5zdHJpbmcoKSBpcyBvbmx5IGV2YWx1YXRlZCBvbmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IGNvdW50ZXJTdHJpbmcgPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IGAkeysrY291bnRlcn1gIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJTdHJpbmcpKS50b0VxdWFsKCcxJyk7XG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZykpLnRvRXF1YWwoJzEnKTtcbiAgfSk7XG5cbiAgdGVzdCgnVW5jYWNoZWQgdG9rZW5zIHJldHVybmVkIGJ5IGNhY2hlZCB0b2tlbnMgYXJlIHN0aWxsIGV2YWx1YXRlZCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICAvLyBDaGVjayB0aGF0IG5lc3RlZCB0b2tlbiByZXR1cm5zIGFyZW4ndCBhY2NpZGVudGFsbHkgZnVsbHkgcmVzb2x2ZWQgYnkgdGhlXG4gICAgLy8gZmlyc3QgcmVzb2x1dGlvbi4gT24gZXZlcnkgZXZhbHVhdGlvbiwgVG9rZW5zIHJlZmVyZW5jZWQgaW5zaWRlIHRoZVxuICAgIC8vIHN0cnVjdHVyZSBzaG91bGQgYmUgZ2l2ZW4gYSBjaGFuY2UgdG8gYmUgZWl0aGVyIGNhY2hlZCBvciB1bmNhY2hlZC5cblxuICAgIC8vIEdJVkVOXG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHVuY2FjaGVkVG9rZW4gPSBMYXp5LnVuY2FjaGVkU3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gYCR7Kytjb3VudGVyfWAgfSk7XG4gICAgLy8gRGlyZWN0bHkgcmV0dXJuZWRcbiAgICBjb25zdCBjb3VudGVyU3RyaW5nMSA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdW5jYWNoZWRUb2tlbiB9KTtcbiAgICAvLyBJbiBxdW90ZWQgY29udGV4dFxuICAgIGNvbnN0IGNvdW50ZXJTdHJpbmcyID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBgLT4ke3VuY2FjaGVkVG9rZW59YCB9KTtcbiAgICAvLyBJbiBvYmplY3QgY29udGV4dFxuICAgIGNvbnN0IGNvdW50ZXJPYmplY3QgPSBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+ICh7IGZpbmFsQ291bnQ6IHVuY2FjaGVkVG9rZW4gfSkgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZzEpKS50b0VxdWFsKCcxJyk7XG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZzEpKS50b0VxdWFsKCcyJyk7XG4gICAgZXhwZWN0KHJlc29sdmUoY291bnRlclN0cmluZzIpKS50b0VxdWFsKCctPjMnKTtcbiAgICBleHBlY3QocmVzb2x2ZShjb3VudGVyU3RyaW5nMikpLnRvRXF1YWwoJy0+NCcpO1xuICAgIGV4cGVjdChyZXNvbHZlKGNvdW50ZXJPYmplY3QpKS50b0VxdWFsKHsgZmluYWxDb3VudDogJzUnIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbnMgY2FuIGJlIG5lc3RlZCBhbmQgY29uY2F0ZW5hdGVkIGluIGhhc2gga2V5cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGlubmVyVG9rZW4gPSBuZXcgSW50cmluc2ljKCAndG9vdCcpO1xuICAgIGNvbnN0IHRva2VuID0gbmV3IEludHJpbnNpYyggYCR7aW5uZXJUb2tlbn0gdGhlIHdvb3RgKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzID0ge1xuICAgICAgW3Rva2VuLnRvU3RyaW5nKCldOiAnYm9vbSBjaGljYWdvJyxcbiAgICB9O1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNvbHZlKHMpKS50b0VxdWFsKHsgJ3Rvb3QgdGhlIHdvb3QnOiAnYm9vbSBjaGljYWdvJyB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGZpbmQgbmVzdGVkIHRva2VucyBpbiBoYXNoIGtleXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBpbm5lclRva2VuID0gbmV3IEludHJpbnNpYyggJ3Rvb3QnKTtcbiAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoIGAke2lubmVyVG9rZW59IHRoZSB3b290YCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcyA9IHtcbiAgICAgIFt0b2tlbi50b1N0cmluZygpXTogJ2Jvb20gY2hpY2FnbycsXG4gICAgfTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0b2tlbnMgPSBmaW5kVG9rZW5zKG5ldyBTdGFjaygpLCAoKSA9PiBzKTtcbiAgICBleHBlY3QodG9rZW5zLnNvbWUodCA9PiB0ID09PSBpbm5lclRva2VuKSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QodG9rZW5zLnNvbWUodCA9PiB0ID09PSB0b2tlbikpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHRva2VuIGluIGEgaGFzaCBrZXkgcmVzb2x2ZXMgdG8gYSBub24tc3RyaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHMgPSB7XG4gICAgICBbdG9rZW4udG9TdHJpbmcoKV06IGBib29tICR7dG9rZW59YCxcbiAgICB9O1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiByZXNvbHZlKHMpKS50b1Rocm93KCdpcyB1c2VkIGFzIHRoZSBrZXkgaW4gYSBtYXAgc28gbXVzdCByZXNvbHZlIHRvIGEgc3RyaW5nLCBidXQgaXQgcmVzb2x2ZXMgdG86Jyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsaXN0IGVuY29kaW5nJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBlbmNvZGUgVG9rZW4gdG8gc3RyaW5nIGFuZCByZXNvbHZlIHRoZSBlbmNvZGluZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB0b2tlbiA9IG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdPdGhlcicgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN0cnVjdCA9IHtcbiAgICAgICAgWFlaOiBUb2tlbi5hc0xpc3QodG9rZW4pLFxuICAgICAgfTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHJlc29sdmUoc3RydWN0KSkudG9FcXVhbCh7XG4gICAgICAgIFhZWjogeyBSZWY6ICdPdGhlcicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2Fubm90IGFkZCB0byBlbmNvZGVkIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBlbmNvZGVkOiBzdHJpbmdbXSA9IFRva2VuLmFzTGlzdCh0b2tlbik7XG4gICAgICBlbmNvZGVkLnB1c2goJ2hlbGxvJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoZW5jb2RlZCk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkIGVsZW1lbnRzIHRvIGxpc3QgdG9rZW4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBhZGQgdG8gc3RyaW5ncyBpbiBlbmNvZGVkIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgdG9rZW4gPSBuZXcgSW50cmluc2ljKHsgUmVmOiAnT3RoZXInIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBlbmNvZGVkOiBzdHJpbmdbXSA9IFRva2VuLmFzTGlzdCh0b2tlbik7XG4gICAgICBlbmNvZGVkWzBdICs9ICdoZWxsbyc7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoZW5jb2RlZCk7XG4gICAgICB9KS50b1Rocm93KC9jb25jYXRlbmF0ZSBzdHJpbmdzIGluLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gcGFzcyBlbmNvZGVkIGxpc3RzIHRvIEZuU2VsZWN0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGVuY29kZWQ6IHN0cmluZ1tdID0gVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdPdGhlcicgfSkpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJ1Y3QgPSBGbi5zZWxlY3QoMSwgZW5jb2RlZCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChyZXNvbHZlKHN0cnVjdCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OlNlbGVjdCc6IFsxLCB7IFJlZjogJ090aGVyJyB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHBhc3MgZW5jb2RlZCBsaXN0cyB0byBGbkpvaW4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZW5jb2RlZDogc3RyaW5nW10gPSBUb2tlbi5hc0xpc3QobmV3IEludHJpbnNpYyh7IFJlZjogJ090aGVyJyB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHN0cnVjdCA9IEZuLmpvaW4oJy8nLCBlbmNvZGVkKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHJlc29sdmUoc3RydWN0KSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFsnLycsIHsgUmVmOiAnT3RoZXInIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gcGFzcyBlbmNvZGVkIGxpc3RzIHRvIEZuSm9pbiwgZXZlbiBpZiBqb2luIGlzIHN0cmluZ2lmaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGVuY29kZWQ6IHN0cmluZ1tdID0gVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoeyBSZWY6ICdPdGhlcicgfSkpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzdHJ1Y3QgPSBGbi5qb2luKCcvJywgZW5jb2RlZCkudG9TdHJpbmcoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHJlc29sdmUoc3RydWN0KSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFsnLycsIHsgUmVmOiAnT3RoZXInIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkZXRlY3QgYW5kIGVycm9yIHdoZW4gbGlzdCB0b2tlbiB2YWx1ZXMgYXJlIGlsbGVnYWxseSBleHRyYWN0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgZW5jb2RlZDogc3RyaW5nW10gPSBUb2tlbi5hc0xpc3QoeyBSZWY6ICdPdGhlcicgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoeyB2YWx1ZTogZW5jb2RlZFswXSB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0ZvdW5kIGFuIGVuY29kZWQgbGlzdC8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbnVtYmVyIGVuY29kaW5nJywgKCkgPT4ge1xuICAgIHRlc3QoJ2Jhc2ljIGludGVnZXIgZW5jb2Rpbmcgd29ya3MnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoMTYpLnRvRXF1YWwoZXh0cmFjdFRva2VuRG91YmxlKGNyZWF0ZVRva2VuRG91YmxlKDE2KSkpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXJiaXRyYXJ5IGludGVnZXJzIGNhbiBiZSBlbmNvZGVkLCBzdHJpbmdpZmllZCwgYW5kIHJlY292ZXJlZCcsICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICAgICAgLy8gV2UgY2FuIGVuY29kZSBhbGwgbnVtYmVycyB1cCB0byAyXjQ4LTFcbiAgICAgICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChNYXRoLnBvdygyLCA0OCkgLSAxKSk7XG5cbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGNyZWF0ZVRva2VuRG91YmxlKHgpO1xuICAgICAgICAvLyBSb3VuZHRyaXAgdGhyb3VnaCBKU09OaWZpY2F0aW9uXG4gICAgICAgIGNvbnN0IHJvdW5kdHJpcHBlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoeyB0aGVOdW1iZXI6IGVuY29kZWQgfSkpLnRoZU51bWJlcjtcbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IGV4dHJhY3RUb2tlbkRvdWJsZShyb3VuZHRyaXBwZWQpO1xuICAgICAgICBleHBlY3QoZGVjb2RlZCkudG9FcXVhbCh4KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRlc3QoJ2FyYml0cmFyeSBudW1iZXJzIGFyZSBjb3JyZWN0bHkgZGV0ZWN0ZWQgYXMgbm90IGJlaW5nIHRva2VucycsICgpID0+IHtcbiAgICAgIGV4cGVjdCh1bmRlZmluZWQpLnRvRXF1YWwoZXh0cmFjdFRva2VuRG91YmxlKDApKTtcbiAgICAgIGV4cGVjdCh1bmRlZmluZWQpLnRvRXF1YWwoZXh0cmFjdFRva2VuRG91YmxlKDEyNDMpKTtcbiAgICAgIGV4cGVjdCh1bmRlZmluZWQpLnRvRXF1YWwoZXh0cmFjdFRva2VuRG91YmxlKDQ4MzVlKzUzMikpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIG51bWJlci1lbmNvZGUgYW5kIHJlc29sdmUgVG9rZW4gb2JqZWN0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB4ID0gbmV3IEludHJpbnNpYyggMTIzKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgZW5jb2RlZCA9IFRva2VuLmFzTnVtYmVyKHgpO1xuICAgICAgZXhwZWN0KGZhbHNlKS50b0VxdWFsKGlzUmVzb2x2YWJsZU9iamVjdChlbmNvZGVkKSk7XG4gICAgICBleHBlY3QodHJ1ZSkudG9FcXVhbChUb2tlbi5pc1VucmVzb2x2ZWQoZW5jb2RlZCkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmUoeyB2YWx1ZTogZW5jb2RlZCB9KTtcbiAgICAgIGV4cGVjdChyZXNvbHZlZCkudG9FcXVhbCh7IHZhbHVlOiAxMjMgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdUb2tlbnMgYXJlIHN0aWxsIHJldmVyc2libGUgYWZ0ZXIgaGF2aW5nIGJlZW4gZW5jb2RlZCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBvcmlnaW5hbCA9IG5ldyBJbnRyaW5zaWMoMTIzKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbGV0IHg6IGFueSA9IG9yaWdpbmFsO1xuICAgICAgeCA9IFRva2VuLmFzU3RyaW5nKHgpO1xuICAgICAgeCA9IFRva2VuLmFzTnVtYmVyKHgpO1xuICAgICAgeCA9IFRva2VuLmFzTGlzdCh4KTtcbiAgICAgIHggPSBUb2tlbi5hc1N0cmluZyh4KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KFRva2VuaXphdGlvbi5yZXZlcnNlKHgpKS50b0JlKG9yaWdpbmFsKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlZ2V4IGRldGVjdHMgYWxsIHN0cmluZ2lmaWNhdGlvbnMgb2YgZW5jb2RlZCB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3RyaW5nQ29udGFpbnNOdW1iZXJUb2tlbnMoYCR7Y3JlYXRlVG9rZW5Eb3VibGUoMCl9YCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdChzdHJpbmdDb250YWluc051bWJlclRva2VucyhgJHtjcmVhdGVUb2tlbkRvdWJsZShNYXRoLnBvdygyLCA0OCkgLSAxKX1gKSkudG9CZVRydXRoeSgpOyAvLyBNQVhfRU5DT0RBQkxFX0lOVEVHRVJcbiAgICAgIGV4cGVjdChzdHJpbmdDb250YWluc051bWJlclRva2VucygnMTIzNCcpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NoZWNrIHRoYXQgdGhlIGZpcnN0IE4gZW5jb2RlZCBudW1iZXJzIGNhbiBiZSBkZXRlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChTVFJJTkdJRklFRF9OVU1CRVJfUEFUVEVSTik7XG4gICAgICAvLyBSYW4gdGhpcyB1cCB0byAxIG1pbGxpb24gb2ZmbGluZVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAwOyBpKyspIHtcbiAgICAgICAgZXhwZWN0KGAke2NyZWF0ZVRva2VuRG91YmxlKGkpfWApLnRvTWF0Y2gocmUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGVzdCgnaGFuZGxlIHN0cmluZ2lmaWVkIG51bWJlciB0b2tlbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB0b2sgPSBgdGhlIGFuc3dlciBpczogJHtMYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDg2IH0pfWA7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChyZXNvbHZlKHsgdmFsdWU6IGAke3Rva31gIH0pKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICd0aGUgYW5zd2VyIGlzOiA4NicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2hhbmRsZSBzdHJpbmdpZmllZCBudW1iZXIgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcyA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnTXk6OlJlc291cmNlJyB9KTtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB0b2sgPSBgdGhlIGFuc3dlciBpczogJHtUb2tlbi5hc051bWJlcihyZXMucmVmKX1gO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QocmVzb2x2ZSh7IHZhbHVlOiBgJHt0b2t9YCB9KSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnJywgWyd0aGUgYW5zd2VyIGlzOiAnLCB7IFJlZjogJ1Jlc291cmNlJyB9XV0gfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdgc3RhY2sgdHJhY2UgaXMgY2FwdHVyZWQgYXQgdG9rZW4gY3JlYXRpYG9uJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIGZuMSgpIHtcbiAgICAgIGZ1bmN0aW9uIGZuMigpIHtcbiAgICAgICAgY2xhc3MgRXhwb3NlVHJhY2UgZXh0ZW5kcyBJbnRyaW5zaWMge1xuICAgICAgICAgIHB1YmxpYyBnZXQgY3JlYXRpb25UcmFjZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0aW9uU3RhY2s7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFeHBvc2VUcmFjZSgnaGVsbG8nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuMigpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSByZUVuYWJsZVN0YWNrVHJhY2VDb2xsZWN0aW9uKCk7XG4gICAgY29uc3QgdG9rZW4gPSBmbjEoKTtcbiAgICByZXN0b3JlU3RhY2tUcmFjZUNvbGVjdGlvbihwcmV2aW91c1ZhbHVlKTtcbiAgICBleHBlY3QodG9rZW4uY3JlYXRpb25UcmFjZS5maW5kKHggPT4geC5pbmNsdWRlcygnZm4xJykpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdCh0b2tlbi5jcmVhdGlvblRyYWNlLmZpbmQoeCA9PiB4LmluY2x1ZGVzKCdmbjInKSkpLnRvQmVEZWZpbmVkKCk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnbmV3RXJyb3IgcmV0dXJucyBhbiBlcnJvciB3aXRoIHRoZSBjcmVhdGlvbiBzdGFjayB0cmFjZScsICgpID0+IHtcbiAgICBmdW5jdGlvbiBmbjEoKSB7XG4gICAgICBmdW5jdGlvbiBmbjIoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGZuMygpIHtcbiAgICAgICAgICBjbGFzcyBUaHJvd2luZ1Rva2VuIGV4dGVuZHMgSW50cmluc2ljIHtcbiAgICAgICAgICAgIHB1YmxpYyB0aHJvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICAgICAgICB0aHJvdyB0aGlzLm5ld0Vycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFRocm93aW5nVG9rZW4oJ2Jvb20nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbjMoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmbjIoKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcmVFbmFibGVTdGFja1RyYWNlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IHRva2VuID0gZm4xKCk7XG4gICAgcmVzdG9yZVN0YWNrVHJhY2VDb2xlY3Rpb24ocHJldmlvdXNWYWx1ZSk7XG4gICAgZXhwZWN0KCgpID0+IHRva2VuLnRocm93RXJyb3IoJ21lc3NhZ2UhJykpLnRvVGhyb3coL1Rva2VuIGNyZWF0ZWQ6Lyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd0eXBlIGNvZXJjaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0cyA9IFtcbiAgICAgICdhIHN0cmluZycsXG4gICAgICAxMjM0LFxuICAgICAgeyBhbl9vYmplY3Q6IDEyMzQgfSxcbiAgICAgIFsxLCAyLCAzXSxcbiAgICAgIGZhbHNlLFxuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGlucHV0cykge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0cmluZ1Rva2VuID0gVG9rZW4uYXNTdHJpbmcobmV3IEludHJpbnNpYyhpbnB1dCkpO1xuICAgICAgY29uc3QgbnVtYmVyVG9rZW4gPSBUb2tlbi5hc051bWJlcihuZXcgSW50cmluc2ljKGlucHV0KSk7XG4gICAgICBjb25zdCBsaXN0VG9rZW4gPSBUb2tlbi5hc0xpc3QobmV3IEludHJpbnNpYyhpbnB1dCkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBleHBlY3RlZCA9IGlucHV0O1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxzdHJpbmc+LnRvTnVtYmVyKClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuLmFzTnVtYmVyKG5ldyBJbnRyaW5zaWMoc3RyaW5nVG9rZW4pKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PGxpc3Q+LnRvTnVtYmVyKClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuLmFzTnVtYmVyKG5ldyBJbnRyaW5zaWMobGlzdFRva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KGAke2lucHV0fTxudW1iZXI+LnRvTnVtYmVyKClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuLmFzTnVtYmVyKG5ldyBJbnRyaW5zaWMobnVtYmVyVG9rZW4pKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PHN0cmluZz4udG9TdHJpbmcoKWAsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc29sdmUobmV3IEludHJpbnNpYyhzdHJpbmdUb2tlbikudG9TdHJpbmcoKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PGxpc3Q+LnRvU3RyaW5nKClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKG5ldyBJbnRyaW5zaWMobGlzdFRva2VuKS50b1N0cmluZygpKSkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChgJHtpbnB1dH08bnVtYmVyPi50b1N0cmluZygpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShuZXcgSW50cmluc2ljKG51bWJlclRva2VuKS50b1N0cmluZygpKSkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdChgJHtpbnB1dH08c3RyaW5nPi50b0xpc3QoKWAsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc29sdmUoVG9rZW4uYXNMaXN0KG5ldyBJbnRyaW5zaWMoc3RyaW5nVG9rZW4pKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PGxpc3Q+LnRvTGlzdCgpYCwgKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzb2x2ZShUb2tlbi5hc0xpc3QobmV3IEludHJpbnNpYyhsaXN0VG9rZW4pKSkpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoYCR7aW5wdXR9PG51bWJlcj4udG9MaXN0KClgLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXNvbHZlKFRva2VuLmFzTGlzdChuZXcgSW50cmluc2ljKG51bWJlclRva2VuKSkpKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRpb24gc3RhY2sgaXMgYXR0YWNoZWQgdG8gZXJyb3JzIGVtaXR0ZWQgZHVyaW5nIHJlc29sdmUgd2l0aCBDREtfREVCVUc9dHJ1ZScsICgpID0+IHtcbiAgICBmdW5jdGlvbiBzaG93TWVJblRoZVN0YWNrVHJhY2UoKSB7XG4gICAgICByZXR1cm4gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB7IHRocm93IG5ldyBFcnJvcignZm9vRXJyb3InKTsgfSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHO1xuXG4gICAgcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHID0gJ3RydWUnO1xuICAgIGNvbnN0IHggPSBzaG93TWVJblRoZVN0YWNrVHJhY2UoKTtcbiAgICBsZXQgbWVzc2FnZTtcbiAgICB0cnkge1xuICAgICAgcmVzb2x2ZSh4KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBtZXNzYWdlID0gKGUgYXMgRXJyb3IpLm1lc3NhZ2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHByb2Nlc3MuZW52LkNES19ERUJVRyA9IHByZXZpb3VzVmFsdWU7XG4gICAgfVxuXG4gICAgZXhwZWN0KG1lc3NhZ2UgJiYgbWVzc2FnZS5pbmNsdWRlcygnc2hvd01lSW5UaGVTdGFja1RyYWNlJykpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0aW9uIHN0YWNrIGlzIG9taXR0ZWQgd2l0aG91dCBDREtfREVCVUc9dHJ1ZScsICgpID0+IHtcbiAgICBmdW5jdGlvbiBzaG93TWVJblRoZVN0YWNrVHJhY2UoKSB7XG4gICAgICByZXR1cm4gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB7IHRocm93IG5ldyBFcnJvcignZm9vRXJyb3InKTsgfSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gcHJvY2Vzcy5lbnYuQ0RLX0RFQlVHO1xuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5DREtfREVCVUc7XG5cbiAgICBjb25zdCB4ID0gc2hvd01lSW5UaGVTdGFja1RyYWNlKCk7XG4gICAgbGV0IG1lc3NhZ2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc29sdmUoeCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbWVzc2FnZSA9IChlIGFzIEVycm9yKS5tZXNzYWdlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBwcm9jZXNzLmVudi5DREtfREVCVUcgPSBwcmV2aW91c1ZhbHVlO1xuICAgIH1cblxuICAgIGV4cGVjdChtZXNzYWdlICYmIG1lc3NhZ2UuaW5jbHVkZXMoJ0V4ZWN1dGUgYWdhaW4gd2l0aCBDREtfREVCVUc9dHJ1ZScpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3RyaW5naWZ5TnVtYmVyJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NvbnZlcnRzIG51bWJlciB0byBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcigxMDApKS50b0VxdWFsKCcxMDAnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvbnZlcnRzIHRva2VuaXplZCBudW1iZXIgdG8gc3RyaW5nJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHJlc29sdmUoVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcih7XG4gICAgICAgIHJlc29sdmU6ICgpID0+IDEwMCxcbiAgICAgIH0gYXMgYW55KSkpLnRvRXF1YWwoJzEwMCcpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3RyaW5nIHJlbWFpbnMgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoVG9rZW5pemF0aW9uLnN0cmluZ2lmeU51bWJlcignMTIzJyBhcyBhbnkpKS50b0VxdWFsKCcxMjMnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlZiByZW1haW5zIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsID0geyBSZWY6ICdTb21lTG9naWNhbElkJyB9O1xuICAgICAgZXhwZWN0KFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIodmFsIGFzIGFueSkpLnRvRXF1YWwodmFsKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2xhenkgUmVmIHJlbWFpbnMgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZFZhbCA9IHsgUmVmOiAnU29tZUxvZ2ljYWxJZCcgfTtcbiAgICAgIGNvbnN0IHRva2VuaXplZFZhbCA9IExhenkuYW55KHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4gcmVzb2x2ZWRWYWwsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlcyA9IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIodG9rZW5pemVkVmFsIGFzIGFueSkgYXMgYW55O1xuICAgICAgZXhwZWN0KHJlcykubm90LnRvRXF1YWwocmVzb2x2ZWRWYWwpO1xuICAgICAgZXhwZWN0KHJlc29sdmUocmVzKSkudG9FcXVhbChyZXNvbHZlZFZhbCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0b2tlbml6ZWQgUmVmIHJlbWFpbnMgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZFZhbCA9IHsgUmVmOiAnU29tZUxvZ2ljYWxJZCcgfTtcbiAgICAgIGNvbnN0IHRva2VuaXplZFZhbCA9IFRva2VuLmFzTnVtYmVyKHJlc29sdmVkVmFsKTtcbiAgICAgIGNvbnN0IHJlcyA9IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIodG9rZW5pemVkVmFsKSBhcyBhbnk7XG4gICAgICBleHBlY3QocmVzKS5ub3QudG9FcXVhbChyZXNvbHZlZFZhbCk7XG4gICAgICBleHBlY3QocmVzb2x2ZShyZXMpKS50b0VxdWFsKHJlc29sdmVkVmFsKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgUHJvbWlzZTIgaW1wbGVtZW50cyBJUmVzb2x2YWJsZSB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrID0gW107XG5cbiAgcHVibGljIHJlc29sdmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIERhdGE6IHtcbiAgICAgICAgc3RyaW5nUHJvcDogJ2hlbGxvJyxcbiAgICAgICAgbnVtYmVyUHJvcDogMTIzNCxcbiAgICAgIH0sXG4gICAgICBSZWN1cnNlOiBuZXcgSW50cmluc2ljKCA0MiksXG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBQcm9taXNlMSBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2sgPSBbXTtcbiAgcHVibGljIHAyID0gW25ldyBQcm9taXNlMigpLCBuZXcgUHJvbWlzZTIoKV07XG5cbiAgcHVibGljIHJlc29sdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMucDI7XG4gIH1cbn1cblxuY2xhc3MgQmFzZURhdGFUeXBlIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZm9vOiBudW1iZXIpIHtcbiAgfVxufVxuXG5jbGFzcyBEYXRhVHlwZSBleHRlbmRzIEJhc2VEYXRhVHlwZSB7XG4gIHB1YmxpYyBnb28gPSAnaGVsbG8nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDEyKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBUb2tlbnMgaW4gYm90aCBmbGF2b3JzIHRoYXQgcmVzb2x2ZSB0byB0aGUgZ2l2ZW4gc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHRva2Vuc1RoYXRSZXNvbHZlVG8odmFsdWU6IGFueSk6IFRva2VuW10ge1xuICByZXR1cm4gW1xuICAgIG5ldyBJbnRyaW5zaWModmFsdWUpLFxuICAgIExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdmFsdWUgfSksXG4gIF07XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgcmVzb2x2ZSB0aGF0IGNyZWF0ZXMgYW4gdGhyb3dhd2F5IENvbnN0cnVjdCB0byBjYWxsIGl0IG9uXG4gKlxuICogU28gSSBkb24ndCBoYXZlIHRvIGNoYW5nZSBhbGwgY2FsbCBzaXRlcyBpbiB0aGlzIGZpbGUuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmUoeDogYW55KSB7XG4gIHJldHVybiBuZXcgU3RhY2soKS5yZXNvbHZlKHgpO1xufVxuXG4iXX0=