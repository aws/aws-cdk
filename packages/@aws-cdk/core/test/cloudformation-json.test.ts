import { nodeunitShim, Test } from 'nodeunit-shim';
import { App, CfnOutput, Fn, Lazy, Stack, Token } from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';
import { evaluateCFN } from './evaluate-cfn';

nodeunitShim({
  'string tokens can be JSONified and JSONification can be reversed'(test: Test) {
    const stack = new Stack();

    for (const token of tokensThatResolveTo('woof woof')) {
      // GIVEN
      const fido = { name: 'Fido', speaks: token };

      // WHEN
      const resolved = stack.resolve(stack.toJsonString(fido));

      // THEN
      test.deepEqual(evaluateCFN(resolved), '{"name":"Fido","speaks":"woof woof"}');
    }

    test.done();
  },

  'string tokens can be embedded while being JSONified'(test: Test) {
    const stack = new Stack();

    for (const token of tokensThatResolveTo('woof woof')) {
      // GIVEN
      const fido = { name: 'Fido', speaks: `deep ${token}` };

      // WHEN
      const resolved = stack.resolve(stack.toJsonString(fido));

      // THEN
      test.deepEqual(evaluateCFN(resolved), '{"name":"Fido","speaks":"deep woof woof"}');
    }

    test.done();
  },

  'constant string has correct amount of quotes applied'(test: Test) {
    const stack = new Stack();

    const inputString = 'Hello, "world"';

    // WHEN
    const resolved = stack.resolve(stack.toJsonString(inputString));

    // THEN
    test.deepEqual(evaluateCFN(resolved), JSON.stringify(inputString));

    test.done();
  },

  'integer Tokens behave correctly in stringification and JSONification'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const num = new Intrinsic(1);
    const embedded = `the number is ${num}`;

    // WHEN
    test.equal(evaluateCFN(stack.resolve(embedded)), 'the number is 1');
    test.equal(evaluateCFN(stack.resolve(stack.toJsonString({ embedded }))), '{"embedded":"the number is 1"}');
    test.equal(evaluateCFN(stack.resolve(stack.toJsonString({ num }))), '{"num":1}');

    test.done();
  },

  'tokens in strings survive additional TokenJSON.stringification()'(test: Test) {
    // GIVEN
    const stack = new Stack();
    for (const token of tokensThatResolveTo('pong!')) {
      // WHEN
      const stringified = stack.toJsonString(`ping? ${token}`);

      // THEN
      test.equal(evaluateCFN(stack.resolve(stringified)), '"ping? pong!"');
    }

    test.done();
  },

  'intrinsic Tokens embed correctly in JSONification'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bucketName = new Intrinsic({ Ref: 'MyBucket' });

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({ theBucket: bucketName }));

    // THEN
    const context = { MyBucket: 'TheName' };
    test.equal(evaluateCFN(resolved, context), '{"theBucket":"TheName"}');

    test.done();
  },

  'fake intrinsics are serialized to objects'(test: Test) {
    const stack = new Stack();
    const fakeIntrinsics = new Intrinsic({
      a: {
        'Fn::GetArtifactAtt': {
          key: 'val',
        },
      },
      b: {
        'Fn::GetParam': [
          'val1',
          'val2',
        ],
      },
    });

    const stringified = stack.toJsonString(fakeIntrinsics);
    test.equal(evaluateCFN(stack.resolve(stringified)),
      '{"a":{"Fn::GetArtifactAtt":{"key":"val"}},"b":{"Fn::GetParam":["val1","val2"]}}');

    test.done();
  },

  'embedded string literals in intrinsics are escaped when calling TokenJSON.stringify()'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const token = Fn.join('', ['Hello', 'This\nIs', 'Very "cool"']);

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({
      literal: 'I can also "contain" quotes',
      token,
    }));

    // THEN
    const expected = '{"literal":"I can also \\"contain\\" quotes","token":"HelloThis\\nIsVery \\"cool\\""}';
    test.equal(evaluateCFN(resolved), expected);

    test.done();
  },

  'Tokens in Tokens are handled correctly'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bucketName = new Intrinsic({ Ref: 'MyBucket' });
    const combinedName = Fn.join('', ['The bucket name is ', bucketName.toString()]);

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({ theBucket: combinedName }));

    // THEN
    const context = { MyBucket: 'TheName' };
    test.equal(evaluateCFN(resolved, context), '{"theBucket":"The bucket name is TheName"}');

    test.done();
  },

  'Doubly nested strings evaluate correctly in JSON context'(test: Test) {
    // WHEN
    const stack = new Stack();
    const fidoSays = Lazy.string({ produce: () => 'woof' });

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({
      information: `Did you know that Fido says: ${fidoSays}`,
    }));

    // THEN
    test.deepEqual(evaluateCFN(resolved), '{"information":"Did you know that Fido says: woof"}');

    test.done();
  },

  'Doubly nested intrinsics evaluate correctly in JSON context'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const fidoSays = Lazy.any({ produce: () => ({ Ref: 'Something' }) });

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({
      information: `Did you know that Fido says: ${fidoSays}`,
    }));

    // THEN
    const context = { Something: 'woof woof' };
    test.deepEqual(evaluateCFN(resolved, context), '{"information":"Did you know that Fido says: woof woof"}');

    test.done();
  },

  'Quoted strings in embedded JSON context are escaped'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const fidoSays = Lazy.string({ produce: () => '"woof"' });

    // WHEN
    const resolved = stack.resolve(stack.toJsonString({
      information: `Did you know that Fido says: ${fidoSays}`,
    }));

    // THEN
    test.deepEqual(evaluateCFN(resolved), '{"information":"Did you know that Fido says: \\"woof\\""}');

    test.done();
  },

  'cross-stack references are also properly converted by toJsonString()'(test: Test) {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');

    // WHEN
    new CfnOutput(stack2, 'Stack1Id', {
      value: stack2.toJsonString({
        Stack1Id: stack1.stackId,
        Stack2Id: stack2.stackId,
      }),
    });

    // THEN
    const asm = app.synth();
    test.deepEqual(asm.getStackByName('Stack2').template, {
      Outputs: {
        Stack1Id: {
          Value: {
            'Fn::Join': ['', [
              '{"Stack1Id":"',
              { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSStackIdB2DD5BAA' },
              '","Stack2Id":"',
              { Ref: 'AWS::StackId' },
              '"}',
            ]],
          },
        },
      },
    });

    test.done();
  },

  'Every Token used inside a JSONified string is given an opportunity to be uncached'(test: Test) {
    // Check that tokens aren't accidentally fully resolved by the first invocation/resolution
    // of toJsonString(). On every evaluation, Tokens referenced inside the structure should be
    // given a chance to be either cached or uncached.
    //
    // (NOTE: This does not check whether the implementation of toJsonString() itself is cached or
    // not; that depends on aws/aws-cdk#11224 and should be done in a different PR).

    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack1');

    // WHEN
    let counter = 0;
    const counterString = Token.asString({ resolve: () => `${++counter}` });
    const jsonString = stack.toJsonString({ counterString });

    // THEN
    expect(stack.resolve(jsonString)).toEqual('{"counterString":"1"}');
    expect(stack.resolve(jsonString)).toEqual('{"counterString":"2"}');

    test.done();
  },
});

/**
 * Return two Tokens, one of which evaluates to a Token directly, one which evaluates to it lazily
 */
function tokensThatResolveTo(value: any): Token[] {
  return [
    new Intrinsic(value),
    Lazy.any({ produce: () => value }),
  ];
}
