import { toCloudFormation } from './util';
import * as cdk from '../lib';

describe('condition', () => {
  test('chain conditions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new cdk.CfnParameter(stack, 'Param1', { type: 'String' });
    const cond1 = new cdk.CfnCondition(stack, 'Condition1', { expression: cdk.Fn.conditionEquals('a', 'b') });
    const cond2 = new cdk.CfnCondition(stack, 'Condition2', { expression: cdk.Fn.conditionContains(['a', 'b', 'c'], 'c') });
    const cond3 = new cdk.CfnCondition(stack, 'Condition3', { expression: cdk.Fn.conditionEquals(param, 'hello') });

    // WHEN
    new cdk.CfnCondition(stack, 'Condition4', {
      expression: cdk.Fn.conditionOr(cond1, cond2, cdk.Fn.conditionNot(cond3)),
    });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Parameters: { Param1: { Type: 'String' } },
      Conditions: {
        Condition1: { 'Fn::Equals': ['a', 'b'] },
        Condition2: { 'Fn::Contains': [['a', 'b', 'c'], 'c'] },
        Condition3: { 'Fn::Equals': [{ Ref: 'Param1' }, 'hello'] },
        Condition4: {
          'Fn::Or': [
            { Condition: 'Condition1' },
            { Condition: 'Condition2' },
            { 'Fn::Not': [{ Condition: 'Condition3' }] },
          ],
        },
      },
    });
  });

  test('condition expressions can be embedded as strings', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const propValue: string = cdk.Fn.conditionIf('Cond', 'A', 'B').toString();

    // WHEN
    new cdk.CfnResource(stack, 'MyResource', {
      type: 'AWS::Foo::Bar',
      properties: {
        StringProp: propValue,
      },
    });

    // THEN
    expect(cdk.Token.isUnresolved(propValue)).toEqual(true);
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyResource: {
          Type: 'AWS::Foo::Bar',
          Properties: {
            StringProp: { 'Fn::If': ['Cond', 'A', 'B'] },
          },
        },
      },
    });
  });
});
