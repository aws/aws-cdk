import { toCloudFormation } from './util';
import { CfnRule, Fn, Stack } from '../lib';

describe('rule', () => {
  test('Rule can be used to create rules', () => {
    const stack = new Stack();

    const rule = new CfnRule(stack, 'MyRule');
    rule.addAssertion(Fn.conditionEquals('lhs', 'rhs'), 'lhs equals rhs');
    rule.addAssertion(Fn.conditionNot(Fn.conditionAnd(Fn.conditionContains(['hello', 'world'], 'world'))), 'some assertion');

    expect(toCloudFormation(stack)).toEqual({
      Rules: {
        MyRule: {
          Assertions: [
            {
              Assert: { 'Fn::Equals': ['lhs', 'rhs'] },
              AssertDescription: 'lhs equals rhs',
            },
            {
              Assert: { 'Fn::Not': [{ 'Fn::Contains': [['hello', 'world'], 'world'] }] },
              AssertDescription: 'some assertion',
            },
          ],
        },
      },
    });
  });

  test('a template can contain multiple Rules', () => {
    const stack = new Stack();

    new CfnRule(stack, 'Rule1');
    new CfnRule(stack, 'Rule2');

    expect(toCloudFormation(stack)).toEqual({
      Rules: {
        Rule1: {},
        Rule2: {},
      },
    });
  });
});
