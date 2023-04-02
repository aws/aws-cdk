import { evaluateCFN } from './evaluate-cfn';
import { reEnableStackTraceCollection, restoreStackTraceColection } from './util';
import { CfnResource, Fn, isResolvableObject, Lazy, Stack, Token, Tokenization } from '../lib';
import { createTokenDouble, extractTokenDouble, stringContainsNumberTokens, STRINGIFIED_NUMBER_PATTERN } from '../lib/private/encoding';
import { Intrinsic } from '../lib/private/intrinsic';
import { findTokens } from '../lib/private/resolve';
import { IResolvable } from '../lib/resolvable';

describe('tokens', () => {
  test('resolve a plain old object should just return the object', () => {
    const obj = { PlainOldObject: 123, Array: [1, 2, 3] };
    expect(resolve(obj)).toEqual(obj);
  });

  test('if a value is an object with a token value, it will be evaluated', () => {
    const obj = {
      RegularValue: 'hello',
      LazyValue: new Intrinsic('World'),
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
    const actual = resolve(new Intrinsic({ Obj: obj }));

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
    expect(resolve({ })).toEqual({ });
    expect(resolve([])).toEqual([]);

    const obj = {
      Prop1: 1234,
      Prop2: { },
      Prop3: [],
      Prop4: 'hello',
      Prop5: {
        PropA: { },
        PropB: {
          PropC: [undefined, undefined],
          PropD: 'Yoohoo',
        },
      },
    };

    expect(resolve(obj)).toEqual({
      Prop1: 1234,
      Prop2: { },
      Prop3: [],
      Prop4: 'hello',
      Prop5: {
        PropA: { },
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
    expect(isResolvableObject({ resolve: () => 123 })).toEqual(true);
    expect(isResolvableObject({ a: 1, b: 2, resolve: () => 'hello' })).toEqual(true);
    expect(isResolvableObject({ a: 1, b: 2, resolve: 3 })).toEqual(false);
  });

  test('Token can be used to create tokens that contain a constant value', () => {
    expect(resolve(new Intrinsic(12))).toEqual(12);
    expect(resolve(new Intrinsic('hello'))).toEqual('hello');
    expect(resolve(new Intrinsic(['hi', 'there']))).toEqual(['hi', 'there']);
  });

  test('resolving leaves a Date object in working order', () => {
    const date = new Date('2000-01-01');
    const resolved = resolve(date);

    expect(date.toString()).toEqual(resolved.toString());
  });

  test('tokens can be stringified and evaluated to conceptual value', () => {
    // GIVEN
    const token = new Intrinsic('woof woof');

    // WHEN
    const stringified = `The dog says: ${token}`;
    const resolved = resolve(stringified);

    // THEN
    expect(evaluateCFN(resolved)).toEqual('The dog says: woof woof');
  });

  test('tokens stringification can be reversed', () => {
    // GIVEN
    const token = new Intrinsic('woof woof');

    // THEN
    expect(token).toEqual(Tokenization.reverseString(`${token}`).firstToken);
  });

  test('Tokens stringification and reversing of CloudFormation Tokens is implemented using Fn::Join', () => {
    // GIVEN
    const token = new Intrinsic( ({ woof: 'woof' }));

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
    const token1 = new Intrinsic( 'world');
    const token2 = new Intrinsic( `hello ${token1}`);

    // WHEN
    const resolved1 = resolve(token2.toString());
    const resolved2 = resolve(token2);

    // THEN
    expect(evaluateCFN(resolved1)).toEqual('hello world');
    expect(evaluateCFN(resolved2)).toEqual('hello world');
  });

  test('integer Tokens can be stringified and evaluate to conceptual value', () => {
    // GIVEN
    for (const token of tokensThatResolveTo(1)) {
      // WHEN
      const stringified = `the number is ${token}`;
      const resolved = resolve(stringified);

      // THEN
      expect(evaluateCFN(resolved)).toEqual('the number is 1');
    }
  });

  test('intrinsic Tokens can be stringified and evaluate to conceptual value', () => {
    // GIVEN
    for (const bucketName of tokensThatResolveTo({ Ref: 'MyBucket' })) {
      // WHEN
      const resolved = resolve(`my bucket is named ${bucketName}`);

      // THEN
      const context = { MyBucket: 'TheName' };
      expect(evaluateCFN(resolved, context)).toEqual('my bucket is named TheName');
    }
  });

  test('tokens resolve properly in initial position', () => {
    // GIVEN
    for (const token of tokensThatResolveTo('Hello')) {
      // WHEN
      const resolved = resolve(`${token} world`);

      // THEN
      expect(evaluateCFN(resolved)).toEqual('Hello world');
    }
  });

  test('side-by-side Tokens resolve correctly', () => {
    // GIVEN
    for (const token1 of tokensThatResolveTo('Hello ')) {
      for (const token2 of tokensThatResolveTo('world')) {
        // WHEN
        const resolved = resolve(`${token1}${token2}`);

        // THEN
        expect(evaluateCFN(resolved)).toEqual('Hello world');
      }
    }
  });

  test('tokens can be used in hash keys but must resolve to a string', () => {
    // GIVEN
    const token = new Intrinsic( 'I am a string');

    // WHEN
    const s = {
      [token.toString()]: `boom ${token}`,
    };

    // THEN
    expect(resolve(s)).toEqual({ 'I am a string': 'boom I am a string' });
  });

  test('tokens can be nested in hash keys', () => {
    // GIVEN
    const token = new Intrinsic(Lazy.string({ produce: () => Lazy.string({ produce: (() => 'I am a string') }) }));

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
    const counterString = Lazy.uncachedString({ produce: () => `${++counter}` });

    // THEN
    expect(resolve(counterString)).toEqual('1');
    expect(resolve(counterString)).toEqual('2');
  });

  test('Function passed to Lazy.string() is only evaluated once', () => {
    // GIVEN
    let counter = 0;
    const counterString = Lazy.string({ produce: () => `${++counter}` });

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
    const uncachedToken = Lazy.uncachedString({ produce: () => `${++counter}` });
    // Directly returned
    const counterString1 = Lazy.string({ produce: () => uncachedToken });
    // In quoted context
    const counterString2 = Lazy.string({ produce: () => `->${uncachedToken}` });
    // In object context
    const counterObject = Lazy.any({ produce: () => ({ finalCount: uncachedToken }) });

    // THEN
    expect(resolve(counterString1)).toEqual('1');
    expect(resolve(counterString1)).toEqual('2');
    expect(resolve(counterString2)).toEqual('->3');
    expect(resolve(counterString2)).toEqual('->4');
    expect(resolve(counterObject)).toEqual({ finalCount: '5' });
  });

  test('tokens can be nested and concatenated in hash keys', () => {
    // GIVEN
    const innerToken = new Intrinsic( 'toot');
    const token = new Intrinsic( `${innerToken} the woot`);

    // WHEN
    const s = {
      [token.toString()]: 'boom chicago',
    };

    // THEN
    expect(resolve(s)).toEqual({ 'toot the woot': 'boom chicago' });
  });

  test('can find nested tokens in hash keys', () => {
    // GIVEN
    const innerToken = new Intrinsic( 'toot');
    const token = new Intrinsic( `${innerToken} the woot`);

    // WHEN
    const s = {
      [token.toString()]: 'boom chicago',
    };

    // THEN
    const tokens = findTokens(new Stack(), () => s);
    expect(tokens.some(t => t === innerToken)).toEqual(true);
    expect(tokens.some(t => t === token)).toEqual(true);
  });

  test('fails if token in a hash key resolves to a non-string', () => {
    // GIVEN
    const token = new Intrinsic({ Ref: 'Other' });

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
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const struct = {
        XYZ: Token.asList(token),
      };

      // THEN
      expect(resolve(struct)).toEqual({
        XYZ: { Ref: 'Other' },
      });
    });

    test('cannot add to encoded list', () => {
      // GIVEN
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const encoded: string[] = Token.asList(token);
      encoded.push('hello');

      // THEN
      expect(() => {
        resolve(encoded);
      }).toThrow(/Cannot add elements to list token/);
    });

    test('cannot add to strings in encoded list', () => {
      // GIVEN
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const encoded: string[] = Token.asList(token);
      encoded[0] += 'hello';

      // THEN
      expect(() => {
        resolve(encoded);
      }).toThrow(/concatenate strings in/);
    });

    test('can pass encoded lists to FnSelect', () => {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.select(1, encoded);

      // THEN
      expect(resolve(struct)).toEqual({
        'Fn::Select': [1, { Ref: 'Other' }],
      });
    });

    test('can pass encoded lists to FnJoin', () => {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.join('/', encoded);

      // THEN
      expect(resolve(struct)).toEqual({
        'Fn::Join': ['/', { Ref: 'Other' }],
      });
    });

    test('can pass encoded lists to FnJoin, even if join is stringified', () => {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.join('/', encoded).toString();

      // THEN
      expect(resolve(struct)).toEqual({
        'Fn::Join': ['/', { Ref: 'Other' }],
      });
    });

    test('detect and error when list token values are illegally extracted', () => {
      // GIVEN
      const encoded: string[] = Token.asList({ Ref: 'Other' });

      // THEN
      expect(() => {
        resolve({ value: encoded[0] });
      }).toThrow(/Found an encoded list/);
    });
  });

  describe('number encoding', () => {
    test('basic integer encoding works', () => {
      expect(16).toEqual(extractTokenDouble(createTokenDouble(16)));
    });

    test('arbitrary integers can be encoded, stringified, and recovered', () => {
      for (let i = 0; i < 100; i++) {
        // We can encode all numbers up to 2^48-1
        const x = Math.floor(Math.random() * (Math.pow(2, 48) - 1));

        const encoded = createTokenDouble(x);
        // Roundtrip through JSONification
        const roundtripped = JSON.parse(JSON.stringify({ theNumber: encoded })).theNumber;
        const decoded = extractTokenDouble(roundtripped);
        expect(decoded).toEqual(x);
      }
    });

    test('arbitrary numbers are correctly detected as not being tokens', () => {
      expect(undefined).toEqual(extractTokenDouble(0));
      expect(undefined).toEqual(extractTokenDouble(1243));
      expect(undefined).toEqual(extractTokenDouble(4835e+532));
    });

    test('can number-encode and resolve Token objects', () => {
      // GIVEN
      const x = new Intrinsic( 123);

      // THEN
      const encoded = Token.asNumber(x);
      expect(false).toEqual(isResolvableObject(encoded));
      expect(true).toEqual(Token.isUnresolved(encoded));

      // THEN
      const resolved = resolve({ value: encoded });
      expect(resolved).toEqual({ value: 123 });
    });

    test('Tokens are still reversible after having been encoded multiple times', () => {
      // GIVEN
      const original = new Intrinsic(123);

      // WHEN
      let x: any = original;
      x = Token.asString(x);
      x = Token.asNumber(x);
      x = Token.asList(x);
      x = Token.asString(x);

      // THEN
      expect(Tokenization.reverse(x)).toBe(original);
    });

    test('regex detects all stringifications of encoded tokens', () => {
      expect(stringContainsNumberTokens(`${createTokenDouble(0)}`)).toBeTruthy();
      expect(stringContainsNumberTokens(`${createTokenDouble(Math.pow(2, 48) - 1)}`)).toBeTruthy(); // MAX_ENCODABLE_INTEGER
      expect(stringContainsNumberTokens('1234')).toBeFalsy();
    });

    test('check that the first N encoded numbers can be detected', () => {
      const re = new RegExp(STRINGIFIED_NUMBER_PATTERN);
      // Ran this up to 1 million offline
      for (let i = 0; i < 1000; i++) {
        expect(`${createTokenDouble(i)}`).toMatch(re);
      }
    });

    test('handle stringified number token', () => {
      // GIVEN
      const tok = `the answer is: ${Lazy.number({ produce: () => 86 })}`;

      // THEN
      expect(resolve({ value: `${tok}` })).toEqual({
        value: 'the answer is: 86',
      });
    });

    test('handle stringified number reference', () => {
      const stack = new Stack();
      const res = new CfnResource(stack, 'Resource', { type: 'My::Resource' });
      // GIVEN
      const tok = `the answer is: ${Token.asNumber(res.ref)}`;

      // THEN
      expect(resolve({ value: `${tok}` })).toEqual({
        value: { 'Fn::Join': ['', ['the answer is: ', { Ref: 'Resource' }]] },
      });
    });
  });

  test('`stack trace is captured at token creati`on', () => {
    function fn1() {
      function fn2() {
        class ExposeTrace extends Intrinsic {
          public get creationTrace() {
            return this.creationStack;
          }
        }

        return new ExposeTrace('hello');
      }

      return fn2();
    }

    const previousValue = reEnableStackTraceCollection();
    const token = fn1();
    restoreStackTraceColection(previousValue);
    expect(token.creationTrace.find(x => x.includes('fn1'))).toBeDefined();
    expect(token.creationTrace.find(x => x.includes('fn2'))).toBeDefined();

  });

  test('newError returns an error with the creation stack trace', () => {
    function fn1() {
      function fn2() {
        function fn3() {
          class ThrowingToken extends Intrinsic {
            public throwError(message: string) {
              throw this.newError(message);
            }
          }
          return new ThrowingToken('boom');
        }

        return fn3();
      }
      return fn2();
    }

    const previousValue = reEnableStackTraceCollection();
    const token = fn1();
    restoreStackTraceColection(previousValue);
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
      const stringToken = Token.asString(new Intrinsic(input));
      const numberToken = Token.asNumber(new Intrinsic(input));
      const listToken = Token.asList(new Intrinsic(input));

      // THEN
      const expected = input;

      test(`${input}<string>.toNumber()`, () => {
        expect(resolve(Token.asNumber(new Intrinsic(stringToken)))).toEqual(expected);
      });

      test(`${input}<list>.toNumber()`, () => {
        expect(resolve(Token.asNumber(new Intrinsic(listToken)))).toEqual(expected);
      });

      test(`${input}<number>.toNumber()`, () => {
        expect(resolve(Token.asNumber(new Intrinsic(numberToken)))).toEqual(expected);
      });

      test(`${input}<string>.toString()`, () => {
        expect(resolve(new Intrinsic(stringToken).toString())).toEqual(expected);
      });

      test(`${input}<list>.toString()`, () => {
        expect(resolve(new Intrinsic(listToken).toString())).toEqual(expected);
      });

      test(`${input}<number>.toString()`, () => {
        expect(resolve(new Intrinsic(numberToken).toString())).toEqual(expected);
      });

      test(`${input}<string>.toList()`, () => {
        expect(resolve(Token.asList(new Intrinsic(stringToken)))).toEqual(expected);
      });

      test(`${input}<list>.toList()`, () => {
        expect(resolve(Token.asList(new Intrinsic(listToken)))).toEqual(expected);
      });

      test(`${input}<number>.toList()`, () => {
        expect(resolve(Token.asList(new Intrinsic(numberToken)))).toEqual(expected);
      });
    }
  });

  test('creation stack is attached to errors emitted during resolve with CDK_DEBUG=true', () => {
    function showMeInTheStackTrace() {
      return Lazy.string({ produce: () => { throw new Error('fooError'); } });
    }

    const previousValue = process.env.CDK_DEBUG;

    process.env.CDK_DEBUG = 'true';
    const x = showMeInTheStackTrace();
    let message;
    try {
      resolve(x);
    } catch (e) {
      message = (e as Error).message;
    } finally {
      process.env.CDK_DEBUG = previousValue;
    }

    expect(message && message.includes('showMeInTheStackTrace')).toEqual(true);
  });

  test('creation stack is omitted without CDK_DEBUG=true', () => {
    function showMeInTheStackTrace() {
      return Lazy.string({ produce: () => { throw new Error('fooError'); } });
    }

    const previousValue = process.env.CDK_DEBUG;
    delete process.env.CDK_DEBUG;

    const x = showMeInTheStackTrace();
    let message;
    try {
      resolve(x);
    } catch (e) {
      message = (e as Error).message;
    } finally {
      process.env.CDK_DEBUG = previousValue;
    }

    expect(message && message.includes('Execute again with CDK_DEBUG=true')).toEqual(true);
  });

  describe('stringifyNumber', () => {
    test('converts number to string', () => {
      expect(Tokenization.stringifyNumber(100)).toEqual('100');
    });

    test('converts tokenized number to string', () => {
      expect(resolve(Tokenization.stringifyNumber({
        resolve: () => 100,
      } as any))).toEqual('100');
    });

    test('string remains the same', () => {
      expect(Tokenization.stringifyNumber('123' as any)).toEqual('123');
    });

    test('Ref remains the same', () => {
      const val = { Ref: 'SomeLogicalId' };
      expect(Tokenization.stringifyNumber(val as any)).toEqual(val);
    });

    test('lazy Ref remains the same', () => {
      const resolvedVal = { Ref: 'SomeLogicalId' };
      const tokenizedVal = Lazy.any({
        produce: () => resolvedVal,
      });
      const res = Tokenization.stringifyNumber(tokenizedVal as any) as any;
      expect(res).not.toEqual(resolvedVal);
      expect(resolve(res)).toEqual(resolvedVal);
    });

    test('tokenized Ref remains the same', () => {
      const resolvedVal = { Ref: 'SomeLogicalId' };
      const tokenizedVal = Token.asNumber(resolvedVal);
      const res = Tokenization.stringifyNumber(tokenizedVal) as any;
      expect(res).not.toEqual(resolvedVal);
      expect(resolve(res)).toEqual(resolvedVal);
    });
  });
});

class Promise2 implements IResolvable {
  public readonly creationStack = [];

  public resolve() {
    return {
      Data: {
        stringProp: 'hello',
        numberProp: 1234,
      },
      Recurse: new Intrinsic( 42),
    };
  }
}

class Promise1 implements IResolvable {
  public readonly creationStack = [];
  public p2 = [new Promise2(), new Promise2()];

  public resolve() {
    return this.p2;
  }
}

class BaseDataType {
  constructor(readonly foo: number) {
  }
}

class DataType extends BaseDataType {
  public goo = 'hello';

  constructor() {
    super(12);
  }
}

/**
 * Return Tokens in both flavors that resolve to the given string
 */
function tokensThatResolveTo(value: any): Token[] {
  return [
    new Intrinsic(value),
    Lazy.any({ produce: () => value }),
  ];
}

/**
 * Wrapper for resolve that creates an throwaway Construct to call it on
 *
 * So I don't have to change all call sites in this file.
 */
function resolve(x: any) {
  return new Stack().resolve(x);
}

