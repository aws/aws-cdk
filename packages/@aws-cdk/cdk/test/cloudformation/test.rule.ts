import { Test } from 'nodeunit';
import { Fn, Rule, Stack } from '../../lib';

export = {
  'Rule can be used to create rules'(test: Test) {
    const stack = new Stack();

    const rule = new Rule(stack, 'MyRule');
    rule.addAssertion(Fn.equalsCondition('lhs', 'rhs'), 'lhs equals rhs');
    rule.addAssertion(Fn.notCondition(Fn.andCondition(Fn.containsCondition([ 'hello', 'world' ], "world"))), 'some assertion');

    test.deepEqual(stack.toCloudFormation(), {
      Rules: {
        MyRule: {
          Assertions: [
            {
              Assert: { 'Fn::Equals': [ 'lhs', 'rhs' ] },
              AssertDescription: 'lhs equals rhs'
            },
            {
              Assert: { 'Fn::Not': [ { 'Fn::And': [ { 'Fn::Contains': [ [ 'hello', 'world' ], 'world' ] } ] } ] },
              AssertDescription: 'some assertion'
            }
          ]
        }
      }
    });

    test.done();
  }
};
