import { Test } from 'nodeunit';
import { CloudFormationIntrinsicToken, isToken, resolve, Token } from '../../lib';
import { evaluateCFN } from './evaluate-cfn';

export = {
    'resolve a plain old object should just return the object'(test: Test) {
        const obj = { PlainOldObject: 123, Array: [ 1, 2, 3 ] };
        test.deepEqual(resolve(obj), obj);
        test.done();
    },

    'if a value is an object with a token value, it will be evaluated'(test: Test) {
        const obj = {
            RegularValue: 'hello',
            LazyValue: new Token('World')
        };

        test.deepEqual(resolve(obj), {
            RegularValue: 'hello',
            LazyValue: 'World'
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
                  stringProp: "hello",
                  numberProp: 1234
                },
                Recurse: 42
              },
              {
                Data: {
                  stringProp: "hello",
                  numberProp: 1234
                },
                Recurse: 42
              }
            ]
        });

        test.done();
    },

    'tokens are evaluated recursively'(test: Test) {
        const obj = new Promise1();
        const actual = resolve(new Token(() => ({ Obj: obj })));

        test.deepEqual(actual, {
            Obj: [
              {
                Data: {
                  stringProp: "hello",
                  numberProp: 1234
                },
                Recurse: 42
              },
              {
                Data: {
                  stringProp: "hello",
                  numberProp: 1234
                },
                Recurse: 42
              }
            ]
        });

        test.done();
    },

    'empty arrays or objects are kept'(test: Test) {
        test.deepEqual(resolve({ }), { });
        test.deepEqual(resolve([ ]), [ ]);

        const obj = {
            Prop1: 1234,
            Prop2: { },
            Prop3: [ ],
            Prop4: 'hello',
            Prop5: {
                PropA: { },
                PropB: {
                    PropC: [ undefined, undefined ],
                    PropD: 'Yoohoo'
                }
            }
        };

        test.deepEqual(resolve(obj), {
            Prop1: 1234,
            Prop2: { },
            Prop3: [ ],
            Prop4: 'hello',
            Prop5: {
                PropA: { },
                PropB: {
                    PropC: [ ],
                    PropD: 'Yoohoo'
                }
            }
        });

        test.done();
    },

    'if an object has a "resolve" property that is not a function, it is not considered a token'(test: Test) {
        test.deepEqual(resolve({ a_token: { resolve: () => 78787 }}), { a_token: 78787 });
        test.deepEqual(resolve({ not_a_token: { resolve: 12 } }),     { not_a_token: { resolve: 12 } });
        test.done();
    },

    // tslint:disable-next-line:max-line-length
    'if a resolvable object inherits from a class that is also resolvable, the "constructor" function will not get in the way (uses Object.keys instead of "for in")'(test: Test) {
        test.deepEqual(resolve({ prop: new DataType() }), { prop: { foo: 12, goo: 'hello' } });
        test.done();
    },

    'isToken(obj) can be used to determine if an object is a token'(test: Test) {
        test.ok(isToken({ resolve: () => 123 }));
        test.ok(isToken({ a: 1, b: 2, resolve: () => 'hello' }));
        test.ok(!isToken({ a: 1, b: 2, resolve: 3 }));
        test.done();
    },

    'Token can be used to create tokens that contain a constant value'(test: Test) {
        test.equal(resolve(new Token(12)), 12);
        test.equal(resolve(new Token('hello')), 'hello');
        test.deepEqual(resolve(new Token([ 'hi', 'there' ])), [ 'hi', 'there' ]);
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
        const token = new Token(() => 'woof woof');

        // WHEN
        const stringified = `The dog says: ${token}`;
        const resolved = resolve(stringified);

        // THEN
        test.deepEqual(resolved, {'Fn::Join': ['', ['The dog says: ', 'woof woof']]});
        test.done();
    },

    'Doubly nested strings evaluate correctly in scalar context'(test: Test) {
        // GIVEN
        const token1 = new Token(() => "world");
        const token2 = new Token(() => `hello ${token1}`);

        // WHEN
        const resolved1 = resolve(token2.toString());
        const resolved2 = resolve(token2);

        // THEN
        test.deepEqual(evaluateCFN(resolved1), "hello world");
        test.deepEqual(evaluateCFN(resolved2), "hello world");

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
        const bucketName = new CloudFormationIntrinsicToken({ Ref: 'MyBucket' });

        // WHEN
        const resolved = resolve(`my bucket is named ${bucketName}`);

        // THEN
        const context = {MyBucket: 'TheName'};
        test.equal(evaluateCFN(resolved, context), 'my bucket is named TheName');

        test.done();
    },
};

class Promise2 extends Token {
    public resolve() {
        return {
            Data: {
                stringProp: 'hello',
                numberProp: 1234,
            },
            Recurse: new Token(() => 42)
        };
    }
}

class Promise1 extends Token {
    public p2 = [ new Promise2(), new Promise2() ];

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
 * Return two Tokens, one of which evaluates to a Token directly, one which evaluates to it lazily
 */
function tokensThatResolveTo(value: any): Token[] {
    return [
        new Token(value),
        new Token(() => value)
    ];
}