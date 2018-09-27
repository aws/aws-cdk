import { Test } from 'nodeunit';
import { FnAnd, FnContains, FnEquals, FnNot, Rule, Stack } from '../../lib';

export = {
  'Rule can be used to create rules'(test: Test) {
    const stack = new Stack();

    const rule = new Rule(stack, 'MyRule');
    rule.addAssertion(new FnEquals('lhs', 'rhs'), 'lhs equals rhs');
    rule.addAssertion(new FnNot(new FnAnd(new FnContains([ 'hello', 'world' ], "world"))), 'some assertion');

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
