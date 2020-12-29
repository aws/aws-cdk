import { nodeunitShim, Test } from 'nodeunit-shim';
import { Fn, isResolvableObject, Lazy, Stack, Token, Tokenization } from '../lib';
import { createTokenDouble, extractTokenDouble } from '../lib/private/encoding';
import { Intrinsic } from '../lib/private/intrinsic';
import { findTokens } from '../lib/private/resolve';
import { IResolvable } from '../lib/resolvable';
import { evaluateCFN } from './evaluate-cfn';
import { reEnableStackTraceCollection, restoreStackTraceColection } from './util';

nodeunitShim({
  'resolve a plain old object should just return the object'(test: Test) {
    const obj = { PlainOldObject: 123, Array: [1, 2, 3] };
    test.deepEqual(resolve(obj), obj);
    test.done();
  },

  'if a value is an object with a token value, it will be evaluated'(test: Test) {
    const obj = {
      RegularValue: 'hello',
      LazyValue: new Intrinsic('World'),
    };

    test.deepEqual(resolve(obj), {
      RegularValue: 'hello',
      LazyValue: 'World',
    });

    test.done();
  },

  'tokens are evaluated anywhere in the object tree'(test: Test) {
    const obj = new Promise1();
    const actual = resolve({ Obj: obj });

    test.deepEqual(actual, {
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

    test.done();
  },

  'tokens are evaluated recursively'(test: Test) {
    const obj = new Promise1();
    const actual = resolve(new Intrinsic({ Obj: obj }));

    test.deepEqual(actual, {
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

    test.done();
  },

  'empty arrays or objects are kept'(test: Test) {
    test.deepEqual(resolve({ }), { });
    test.deepEqual(resolve([]), []);

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

    test.deepEqual(resolve(obj), {
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

    test.done();
  },

  'if an object has a "resolve" property that is not a function, it is not considered a token'(test: Test) {
    test.deepEqual(resolve({ a_token: { resolve: () => 78787 } }), { a_token: 78787 });
    test.deepEqual(resolve({ not_a_token: { resolve: 12 } }), { not_a_token: { resolve: 12 } });
    test.done();
  },

  // eslint-disable-next-line max-len
  'if a resolvable object inherits from a class that is also resolvable, the "constructor" function will not get in the way (uses Object.keys instead of "for in")'(test: Test) {
    test.deepEqual(resolve({ prop: new DataType() }), { prop: { foo: 12, goo: 'hello' } });
    test.done();
  },

  'isToken(obj) can be used to determine if an object is a token'(test: Test) {
    test.ok(isResolvableObject({ resolve: () => 123 }));
    test.ok(isResolvableObject({ a: 1, b: 2, resolve: () => 'hello' }));
    test.ok(!isResolvableObject({ a: 1, b: 2, resolve: 3 }));
    test.done();
  },

  'Token can be used to create tokens that contain a constant value'(test: Test) {
    test.equal(resolve(new Intrinsic(12)), 12);
    test.equal(resolve(new Intrinsic('hello')), 'hello');
    test.deepEqual(resolve(new Intrinsic(['hi', 'there'])), ['hi', 'there']);
    test.done();
  },

  'resolving leaves a Date object in working order'(test: Test) {
    const date = new Date('2000-01-01');
    const resolved = resolve(date);

    test.equal(date.toString(), resolved.toString());
    test.done();
  },

  'tokens can be stringified and evaluated to conceptual value'(test: Test) {
    // GIVEN
    const token = new Intrinsic('woof woof');

    // WHEN
    const stringified = `The dog says: ${token}`;
    const resolved = resolve(stringified);

    // THEN
    test.deepEqual(evaluateCFN(resolved), 'The dog says: woof woof');
    test.done();
  },

  'tokens stringification can be reversed'(test: Test) {
    // GIVEN
    const token = new Intrinsic('woof woof');

    // THEN
    test.equal(token, Tokenization.reverseString(`${token}`).firstToken);
    test.done();
  },

  'Tokens stringification and reversing of CloudFormation Tokens is implemented using Fn::Join'(test: Test) {
    // GIVEN
    const token = new Intrinsic( ({ woof: 'woof' }));

    // WHEN
    const stringified = `The dog says: ${token}`;
    const resolved = resolve(stringified);

    // THEN
    test.deepEqual(resolved, {
      'Fn::Join': ['', ['The dog says: ', { woof: 'woof' }]],
    });
    test.done();
  },

  'Doubly nested strings evaluate correctly in scalar context'(test: Test) {
    // GIVEN
    const token1 = new Intrinsic( 'world');
    const token2 = new Intrinsic( `hello ${token1}`);

    // WHEN
    const resolved1 = resolve(token2.toString());
    const resolved2 = resolve(token2);

    // THEN
    test.deepEqual(evaluateCFN(resolved1), 'hello world');
    test.deepEqual(evaluateCFN(resolved2), 'hello world');

    test.done();
  },

  'integer Tokens can be stringified and evaluate to conceptual value'(test: Test) {
    // GIVEN
    for (const token of tokensThatResolveTo(1)) {
      // WHEN
      const stringified = `the number is ${token}`;
      const resolved = resolve(stringified);

      // THEN
      test.deepEqual(evaluateCFN(resolved), 'the number is 1');
    }
    test.done();
  },

  'intrinsic Tokens can be stringified and evaluate to conceptual value'(test: Test) {
    // GIVEN
    for (const bucketName of tokensThatResolveTo({ Ref: 'MyBucket' })) {
      // WHEN
      const resolved = resolve(`my bucket is named ${bucketName}`);

      // THEN
      const context = { MyBucket: 'TheName' };
      test.equal(evaluateCFN(resolved, context), 'my bucket is named TheName');
    }

    test.done();
  },

  'tokens resolve properly in initial position'(test: Test) {
    // GIVEN
    for (const token of tokensThatResolveTo('Hello')) {
      // WHEN
      const resolved = resolve(`${token} world`);

      // THEN
      test.equal(evaluateCFN(resolved), 'Hello world');
    }

    test.done();
  },

  'side-by-side Tokens resolve correctly'(test: Test) {
    // GIVEN
    for (const token1 of tokensThatResolveTo('Hello ')) {
      for (const token2 of tokensThatResolveTo('world')) {
        // WHEN
        const resolved = resolve(`${token1}${token2}`);

        // THEN
        test.equal(evaluateCFN(resolved), 'Hello world');
      }
    }

    test.done();
  },

  'tokens can be used in hash keys but must resolve to a string'(test: Test) {
    // GIVEN
    const token = new Intrinsic( 'I am a string');

    // WHEN
    const s = {
      [token.toString()]: `boom ${token}`,
    };

    // THEN
    test.deepEqual(resolve(s), { 'I am a string': 'boom I am a string' });
    test.done();
  },

  'tokens can be nested in hash keys'(test: Test) {
    // GIVEN
    const token = new Intrinsic(Lazy.string({ produce: () => Lazy.string({ produce: (() => 'I am a string') }) }));

    // WHEN
    const s = {
      [token.toString()]: `boom ${token}`,
    };

    // THEN
    test.deepEqual(resolve(s), { 'I am a string': 'boom I am a string' });
    test.done();
  },

  'Function passed to Lazy.uncachedString() is evaluated multiple times'(test: Test) {
    // GIVEN
    let counter = 0;
    const counterString = Lazy.uncachedString({ produce: () => `${++counter}` });

    // THEN
    expect(resolve(counterString)).toEqual('1');
    expect(resolve(counterString)).toEqual('2');

    test.done();
  },

  'Function passed to Lazy.string() is only evaluated once'(test: Test) {
    // GIVEN
    let counter = 0;
    const counterString = Lazy.string({ produce: () => `${++counter}` });

    // THEN
    expect(resolve(counterString)).toEqual('1');
    expect(resolve(counterString)).toEqual('1');

    test.done();
  },

  'Uncached tokens returned by cached tokens are still evaluated multiple times'(test: Test) {
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

    test.done();
  },

  'tokens can be nested and concatenated in hash keys'(test: Test) {
    // GIVEN
    const innerToken = new Intrinsic( 'toot');
    const token = new Intrinsic( `${innerToken} the woot`);

    // WHEN
    const s = {
      [token.toString()]: 'boom chicago',
    };

    // THEN
    test.deepEqual(resolve(s), { 'toot the woot': 'boom chicago' });
    test.done();
  },

  'can find nested tokens in hash keys'(test: Test) {
    // GIVEN
    const innerToken = new Intrinsic( 'toot');
    const token = new Intrinsic( `${innerToken} the woot`);

    // WHEN
    const s = {
      [token.toString()]: 'boom chicago',
    };

    // THEN
    const tokens = findTokens(new Stack(), () => s);
    test.ok(tokens.some(t => t === innerToken), 'Cannot find innerToken');
    test.ok(tokens.some(t => t === token), 'Cannot find token');
    test.done();
  },

  'fails if token in a hash key resolves to a non-string'(test: Test) {
    // GIVEN
    const token = new Intrinsic({ Ref: 'Other' });

    // WHEN
    const s = {
      [token.toString()]: `boom ${token}`,
    };

    // THEN
    test.throws(() => resolve(s), 'is used as the key in a map so must resolve to a string, but it resolves to:');
    test.done();
  },

  'list encoding': {
    'can encode Token to string and resolve the encoding'(test: Test) {
      // GIVEN
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const struct = {
        XYZ: Token.asList(token),
      };

      // THEN
      test.deepEqual(resolve(struct), {
        XYZ: { Ref: 'Other' },
      });

      test.done();
    },

    'cannot add to encoded list'(test: Test) {
      // GIVEN
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const encoded: string[] = Token.asList(token);
      encoded.push('hello');

      // THEN
      test.throws(() => {
        resolve(encoded);
      }, /Cannot add elements to list token/);

      test.done();
    },

    'cannot add to strings in encoded list'(test: Test) {
      // GIVEN
      const token = new Intrinsic({ Ref: 'Other' });

      // WHEN
      const encoded: string[] = Token.asList(token);
      encoded[0] += 'hello';

      // THEN
      test.throws(() => {
        resolve(encoded);
      }, /concatenate strings in/);

      test.done();
    },

    'can pass encoded lists to FnSelect'(test: Test) {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.select(1, encoded);

      // THEN
      test.deepEqual(resolve(struct), {
        'Fn::Select': [1, { Ref: 'Other' }],
      });

      test.done();
    },

    'can pass encoded lists to FnJoin'(test: Test) {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.join('/', encoded);

      // THEN
      test.deepEqual(resolve(struct), {
        'Fn::Join': ['/', { Ref: 'Other' }],
      });

      test.done();
    },

    'can pass encoded lists to FnJoin, even if join is stringified'(test: Test) {
      // GIVEN
      const encoded: string[] = Token.asList(new Intrinsic({ Ref: 'Other' }));

      // WHEN
      const struct = Fn.join('/', encoded).toString();

      // THEN
      test.deepEqual(resolve(struct), {
        'Fn::Join': ['/', { Ref: 'Other' }],
      });

      test.done();
    },

    'detect and error when list token values are illegally extracted'(test: Test) {
      // GIVEN
      const encoded: string[] = Token.asList({ Ref: 'Other' });

      // THEN
      test.throws(() => {
        resolve({ value: encoded[0] });
      }, /Found an encoded list/);

      test.done();
    },
  },

  'number encoding': {
    'basic integer encoding works'(test: Test) {
      test.equal(16, extractTokenDouble(createTokenDouble(16)));
      test.done();
    },

    'arbitrary integers can be encoded, stringified, and recovered'(test: Test) {
      for (let i = 0; i < 100; i++) {
        // We can encode all numbers up to 2^48-1
        const x = Math.floor(Math.random() * (Math.pow(2, 48) - 1));

        const encoded = createTokenDouble(x);
        // Roundtrip through JSONification
        const roundtripped = JSON.parse(JSON.stringify({ theNumber: encoded })).theNumber;
        const decoded = extractTokenDouble(roundtripped);
        test.equal(decoded, x, `Fail roundtrip encoding of ${x}`);
      }

      test.done();
    },

    'arbitrary numbers are correctly detected as not being tokens'(test: Test) {
      test.equal(undefined, extractTokenDouble(0));
      test.equal(undefined, extractTokenDouble(1243));
      test.equal(undefined, extractTokenDouble(4835e+532));

      test.done();
    },

    'can number-encode and resolve Token objects'(test: Test) {
      // GIVEN
      const x = new Intrinsic( 123);

      // THEN
      const encoded = Token.asNumber(x);
      test.equal(false, isResolvableObject(encoded), 'encoded number does not test as token');
      test.equal(true, Token.isUnresolved(encoded), 'encoded number does not test as token');

      // THEN
      const resolved = resolve({ value: encoded });
      test.deepEqual(resolved, { value: 123 });

      test.done();
    },
  },

  'stack trace is captured at token creation'(test: Test) {
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
    test.ok(token.creationTrace.find(x => x.includes('fn1')));
    test.ok(token.creationTrace.find(x => x.includes('fn2')));
    test.done();
  },

  'newError returns an error with the creation stack trace'(test: Test) {
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
    test.throws(() => token.throwError('message!'), /Token created:/);
    test.done();
  },

  'type coercion': (() => {
    const tests: any = { };

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

      tests[`${input}<string>.toNumber()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asNumber(new Intrinsic(stringToken))), expected);
        test.done();
      };

      tests[`${input}<list>.toNumber()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asNumber(new Intrinsic(listToken))), expected);
        test.done();
      };

      tests[`${input}<number>.toNumber()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asNumber(new Intrinsic(numberToken))), expected);
        test.done();
      };

      tests[`${input}<string>.toString()`] = (test: Test) => {
        test.deepEqual(resolve(new Intrinsic(stringToken).toString()), expected);
        test.done();
      };

      tests[`${input}<list>.toString()`] = (test: Test) => {
        test.deepEqual(resolve(new Intrinsic(listToken).toString()), expected);
        test.done();
      };

      tests[`${input}<number>.toString()`] = (test: Test) => {
        test.deepEqual(resolve(new Intrinsic(numberToken).toString()), expected);
        test.done();
      };

      tests[`${input}<string>.toList()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asList(new Intrinsic(stringToken))), expected);
        test.done();
      };

      tests[`${input}<list>.toList()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asList(new Intrinsic(listToken))), expected);
        test.done();
      };

      tests[`${input}<number>.toList()`] = (test: Test) => {
        test.deepEqual(resolve(Token.asList(new Intrinsic(numberToken))), expected);
        test.done();
      };
    }

    return tests;
  })(),

  'creation stack is attached to errors emitted during resolve with CDK_DEBUG=true'(test: Test) {
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
      message = e.message;
    } finally {
      process.env.CDK_DEBUG = previousValue;
    }

    test.ok(message && message.includes('showMeInTheStackTrace'));
    test.done();
  },

  'creation stack is omitted without CDK_DEBUG=true'(test: Test) {
    function showMeInTheStackTrace() {
      return Lazy.stringValue({ produce: () => { throw new Error('fooError'); } });
    }

    const previousValue = process.env.CDK_DEBUG;
    delete process.env.CDK_DEBUG;

    const x = showMeInTheStackTrace();
    let message;
    try {
      resolve(x);
    } catch (e) {
      message = e.message;
    } finally {
      process.env.CDK_DEBUG = previousValue;
    }

    test.ok(message && message.includes('Execute again with CDK_DEBUG=true'));
    test.done();
  },

  'stringifyNumber': {
    'converts number to string'(test: Test) {
      test.equal(Tokenization.stringifyNumber(100), '100');
      test.done();
    },

    'converts tokenized number to string'(test: Test) {
      test.equal(resolve(Tokenization.stringifyNumber({
        resolve: () => 100,
      } as any)), '100');
      test.done();
    },

    'string remains the same'(test: Test) {
      test.equal(Tokenization.stringifyNumber('123' as any), '123');
      test.done();
    },

    'Ref remains the same'(test: Test) {
      const val = { Ref: 'SomeLogicalId' };
      test.deepEqual(Tokenization.stringifyNumber(val as any), val);
      test.done();
    },

    'lazy Ref remains the same'(test: Test) {
      const resolvedVal = { Ref: 'SomeLogicalId' };
      const tokenizedVal = Lazy.any({
        produce: () => resolvedVal,
      });
      const res = Tokenization.stringifyNumber(tokenizedVal as any) as any;
      test.notDeepEqual(res, resolvedVal);
      test.deepEqual(resolve(res), resolvedVal);
      test.done();
    },

    'tokenized Ref remains the same'(test: Test) {
      const resolvedVal = { Ref: 'SomeLogicalId' };
      const tokenizedVal = Token.asNumber(resolvedVal);
      const res = Tokenization.stringifyNumber(tokenizedVal) as any;
      test.notDeepEqual(res, resolvedVal);
      test.deepEqual(resolve(res), resolvedVal);
      test.done();
    },
  },
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
