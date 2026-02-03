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

  test('condition length is 10n + 1 in Fn.conditionAnd', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const expression = cdk.Fn.conditionAnd(
      cdk.Fn.conditionEquals('a', '1'),
      cdk.Fn.conditionEquals('b', '2'),
      cdk.Fn.conditionEquals('c', '3'),
      cdk.Fn.conditionEquals('d', '4'),
      cdk.Fn.conditionEquals('e', '5'),
      cdk.Fn.conditionEquals('f', '6'),
      cdk.Fn.conditionEquals('g', '7'),
      cdk.Fn.conditionEquals('h', '8'),
      cdk.Fn.conditionEquals('i', '9'),
      cdk.Fn.conditionEquals('j', '10'),
      cdk.Fn.conditionEquals('k', '11'),
    );

    // WHEN
    new cdk.CfnCondition(stack, 'Condition', { expression });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Conditions: {
        Condition: {
          'Fn::And': [
            {
              'Fn::And': [
                { 'Fn::Equals': ['a', '1'] },
                { 'Fn::Equals': ['b', '2'] },
                { 'Fn::Equals': ['c', '3'] },
                { 'Fn::Equals': ['d', '4'] },
                { 'Fn::Equals': ['e', '5'] },
                { 'Fn::Equals': ['f', '6'] },
                { 'Fn::Equals': ['g', '7'] },
                { 'Fn::Equals': ['h', '8'] },
                { 'Fn::Equals': ['i', '9'] },
                { 'Fn::Equals': ['j', '10'] },
              ],
            },
            {
              'Fn::Equals': ['k', '11'],
            },
          ],
        },
      },
    });
  });

  test('condition length is more than 10 in Fn.conditionAnd', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const expression = cdk.Fn.conditionAnd(
      cdk.Fn.conditionEquals('a', '1'),
      cdk.Fn.conditionEquals('b', '2'),
      cdk.Fn.conditionEquals('c', '3'),
      cdk.Fn.conditionEquals('d', '4'),
      cdk.Fn.conditionEquals('e', '5'),
      cdk.Fn.conditionEquals('f', '6'),
      cdk.Fn.conditionEquals('g', '7'),
      cdk.Fn.conditionEquals('h', '8'),
      cdk.Fn.conditionEquals('i', '9'),
      cdk.Fn.conditionEquals('j', '10'),
      cdk.Fn.conditionEquals('k', '11'),
      cdk.Fn.conditionEquals('l', '12'),
    );

    // WHEN
    new cdk.CfnCondition(stack, 'Condition', { expression });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Conditions: {
        Condition: {
          'Fn::And': [
            {
              'Fn::And': [
                { 'Fn::Equals': ['a', '1'] },
                { 'Fn::Equals': ['b', '2'] },
                { 'Fn::Equals': ['c', '3'] },
                { 'Fn::Equals': ['d', '4'] },
                { 'Fn::Equals': ['e', '5'] },
                { 'Fn::Equals': ['f', '6'] },
                { 'Fn::Equals': ['g', '7'] },
                { 'Fn::Equals': ['h', '8'] },
                { 'Fn::Equals': ['i', '9'] },
                { 'Fn::Equals': ['j', '10'] },
              ],
            },
            {
              'Fn::And': [
                { 'Fn::Equals': ['k', '11'] },
                { 'Fn::Equals': ['l', '12'] },
              ],
            },
          ],
        },
      },
    });
  });

  test('condition length is 10n + 1 in Fn.conditionOr', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const expression = cdk.Fn.conditionOr(
      cdk.Fn.conditionEquals('a', '1'),
      cdk.Fn.conditionEquals('b', '2'),
      cdk.Fn.conditionEquals('c', '3'),
      cdk.Fn.conditionEquals('d', '4'),
      cdk.Fn.conditionEquals('e', '5'),
      cdk.Fn.conditionEquals('f', '6'),
      cdk.Fn.conditionEquals('g', '7'),
      cdk.Fn.conditionEquals('h', '8'),
      cdk.Fn.conditionEquals('i', '9'),
      cdk.Fn.conditionEquals('j', '10'),
      cdk.Fn.conditionEquals('k', '11'),
    );

    // WHEN
    new cdk.CfnCondition(stack, 'Condition', { expression });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Conditions: {
        Condition: {
          'Fn::Or': [
            {
              'Fn::Or': [
                { 'Fn::Equals': ['a', '1'] },
                { 'Fn::Equals': ['b', '2'] },
                { 'Fn::Equals': ['c', '3'] },
                { 'Fn::Equals': ['d', '4'] },
                { 'Fn::Equals': ['e', '5'] },
                { 'Fn::Equals': ['f', '6'] },
                { 'Fn::Equals': ['g', '7'] },
                { 'Fn::Equals': ['h', '8'] },
                { 'Fn::Equals': ['i', '9'] },
                { 'Fn::Equals': ['j', '10'] },
              ],
            },
            {
              'Fn::Equals': ['k', '11'],
            },
          ],
        },
      },
    });
  });

  test('condition length is more than 10 in Fn.conditionOr', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const expression = cdk.Fn.conditionOr(
      cdk.Fn.conditionEquals('a', '1'),
      cdk.Fn.conditionEquals('b', '2'),
      cdk.Fn.conditionEquals('c', '3'),
      cdk.Fn.conditionEquals('d', '4'),
      cdk.Fn.conditionEquals('e', '5'),
      cdk.Fn.conditionEquals('f', '6'),
      cdk.Fn.conditionEquals('g', '7'),
      cdk.Fn.conditionEquals('h', '8'),
      cdk.Fn.conditionEquals('i', '9'),
      cdk.Fn.conditionEquals('j', '10'),
      cdk.Fn.conditionEquals('k', '11'),
      cdk.Fn.conditionEquals('l', '12'),
    );

    // WHEN
    new cdk.CfnCondition(stack, 'Condition', { expression });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Conditions: {
        Condition: {
          'Fn::Or': [
            {
              'Fn::Or': [
                { 'Fn::Equals': ['a', '1'] },
                { 'Fn::Equals': ['b', '2'] },
                { 'Fn::Equals': ['c', '3'] },
                { 'Fn::Equals': ['d', '4'] },
                { 'Fn::Equals': ['e', '5'] },
                { 'Fn::Equals': ['f', '6'] },
                { 'Fn::Equals': ['g', '7'] },
                { 'Fn::Equals': ['h', '8'] },
                { 'Fn::Equals': ['i', '9'] },
                { 'Fn::Equals': ['j', '10'] },
              ],
            },
            {
              'Fn::Or': [
                { 'Fn::Equals': ['k', '11'] },
                { 'Fn::Equals': ['l', '12'] },
              ],
            },
          ],
        },
      },
    });
  });
});
