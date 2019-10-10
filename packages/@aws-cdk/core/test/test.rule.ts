import { Test } from 'nodeunit';
import { CfnRule, Fn, Stack } from '../lib';
import { toCloudFormation } from './util';

export = {
  'Rule can be used to create rules'(test: Test) {
    const stack = new Stack();

    const rule = new CfnRule(stack, 'MyRule');
    rule.addAssertion(Fn.conditionEquals('lhs', 'rhs'), 'lhs equals rhs');
    rule.addAssertion(Fn.conditionNot(Fn.conditionAnd(Fn.conditionContains([ 'hello', 'world' ], "world"))), 'some assertion');

    test.deepEqual(toCloudFormation(stack), {
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
