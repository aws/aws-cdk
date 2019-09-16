import fc = require('fast-check');
import _ = require('lodash');
import nodeunit = require('nodeunit');
import { App, CfnOutput, Fn, Stack, Token } from '../lib';
import { Intrinsic } from '../lib/private/intrinsic';

function asyncTest(cb: (test: nodeunit.Test) => Promise<void>): (test: nodeunit.Test) => void {
  return async (test: nodeunit.Test) => {
    let error: Error;
    try {
      await cb(test);
    } catch (e) {
      error = e;
    } finally {
      test.doesNotThrow(() => {
        if (error) { throw error; }
      });
      test.done();
    }
  };
}

const nonEmptyString = fc.string(1, 16);
const tokenish = fc.array(nonEmptyString, 2, 2).map(arr => ({ [arr[0]]: arr[1] }));
const anyValue = fc.oneof<any>(nonEmptyString, tokenish);

export = nodeunit.testCase({
  'eager resolution for non-tokens': {
    'Fn.select'(test: nodeunit.Test) {
      test.deepEqual(Fn.select(2, [ 'hello', 'you', 'dude' ]), 'dude');
      test.done();
    },
    'Fn.split'(test: nodeunit.Test) {
      test.deepEqual(Fn.split(':', 'hello:world:yeah'), [ 'hello', 'world', 'yeah' ]);
      test.done();
    }
  },
  'FnJoin': {
    'rejects empty list of arguments to join'(test: nodeunit.Test) {
      test.throws(() => Fn.join('.', []));
      test.done();
    },
    'collapse nested FnJoins even if they contain tokens'(test: nodeunit.Test) {
      const stack = new Stack();

      const obj = Fn.join('', [
        'a',
        Fn.join('', [Fn.getAtt('a', 'bc').toString(), 'c']),
        'd'
      ]);

      test.deepEqual(stack.resolve(obj), { 'Fn::Join': [ "",
        [
          "a",
          { 'Fn::GetAtt': ['a', 'bc'] },
          'cd',
        ]
      ]});

      test.done();
    },
    'resolves to the value if only one value is joined': asyncTest(async () => {
      const stack = new Stack();
      await fc.assert(
        fc.property(
          fc.string(), anyValue,
          (delimiter, value) => _.isEqual(stack.resolve(Fn.join(delimiter, [value])), value)
        ),
        { verbose: true }
      );
    }),
    'pre-concatenates string literals': asyncTest(async () => {
      const stack = new Stack();
      await fc.assert(
        fc.property(
          fc.string(), fc.array(nonEmptyString, 1, 15),
          (delimiter, values) => stack.resolve(Fn.join(delimiter, values)) === values.join(delimiter)
        ),
        { verbose: true }
      );
    }),
    'pre-concatenates around tokens': asyncTest(async () => {
      const stack = new Stack();
      await fc.assert(
        fc.property(
          fc.string(), fc.array(nonEmptyString, 1, 3), tokenish, fc.array(nonEmptyString, 1, 3),
          (delimiter, prefix, obj, suffix) =>
            _.isEqual(stack.resolve(Fn.join(delimiter, [...prefix, stringToken(obj), ...suffix])),
                      { 'Fn::Join': [delimiter, [prefix.join(delimiter), obj, suffix.join(delimiter)]] })
        ),
        { verbose: true, seed: 1539874645005, path: "0:0:0:0:0:0:0:0:0" }
      );
    }),
    'flattens joins nested under joins with same delimiter': asyncTest(async () => {
      const stack = new Stack();
      await fc.assert(
        fc.property(
          fc.string(), fc.array(anyValue),
                      fc.array(anyValue, 1, 3),
                      fc.array(anyValue),
          (delimiter, prefix, nested, suffix) =>
            // Gonna test
            _.isEqual(stack.resolve(Fn.join(delimiter, [...prefix, Fn.join(delimiter, nested), ...suffix])),
                      stack.resolve(Fn.join(delimiter, [...prefix, ...nested, ...suffix])))
        ),
        { verbose: true }
      );
    }),
    'does not flatten joins nested under joins with different delimiter': asyncTest(async () => {
      const stack = new Stack();
      await fc.assert(
        fc.property(
          fc.string(), fc.string(),
          fc.array(anyValue, 1, 3),
          fc.array(tokenish, 2, 3),
          fc.array(anyValue, 3),
          (delimiter1, delimiter2, prefix,  nested, suffix) => {
            fc.pre(delimiter1 !== delimiter2);
            const join = Fn.join(delimiter1, [...prefix, Fn.join(delimiter2, stringListToken(nested)), ...suffix]);
            const resolved = stack.resolve(join);
            return resolved['Fn::Join'][1].find((e: any) => typeof e === 'object'
                                                        && ('Fn::Join' in e)
                                                        && e['Fn::Join'][0] === delimiter2) != null;
          }
        ),
        { verbose: true }
      );
    }),
    'Fn::EachMemberIn': asyncTest(async (test) => {
      const stack = new Stack();
      const eachMemberIn = Fn.conditionEachMemberIn(
        Fn.valueOfAll('AWS::EC2::Subnet::Id', 'VpcId'),
        Fn.refAll('AWS::EC2::VPC::Id')
      );
      test.deepEqual(stack.resolve(eachMemberIn), {
        'Fn::EachMemberIn': [
          { 'Fn::ValueOfAll': ['AWS::EC2::Subnet::Id', 'VpcId'] },
          { 'Fn::RefAll': 'AWS::EC2::VPC::Id'}
        ]
      });
    }),

    'cross-stack FnJoin elements are properly resolved': asyncTest(async (test) => {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const stack2 = new Stack(app, 'Stack2');

      // WHEN
      new CfnOutput(stack2, 'Stack1Id', {
        value: Fn.join(' = ', [ 'Stack1Id', stack1.stackId ])
      });

      // THEN
      const template = app.synth().getStack('Stack2').template;

      test.deepEqual(template, {
        Outputs: {
          Stack1Id: {
            Value: {
              'Fn::Join': [' = ', [
                'Stack1Id',
                { 'Fn::ImportValue': 'Stack1:ExportsOutputRefAWSStackIdB2DD5BAA' }
              ]]
            }
          }
        }
      });
    }),
  },
});

function stringListToken(o: any): string[] {
  return Token.asList(new Intrinsic(o));
}
function stringToken(o: any): string {
  return Token.asString(new Intrinsic(o));
}
