import { Test } from 'nodeunit';
import cdk = require('../../lib');

export = {
  'chain conditions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const param = new cdk.Parameter(stack, 'Param1', { type: 'String' });
    const cond1 = new cdk.Condition(stack, 'Condition1', { expression: cdk.Fn.conditionEquals("a", "b") });
    const cond2 = new cdk.Condition(stack, 'Condition2', { expression: cdk.Fn.conditionContains([ "a", "b", "c" ], "c") });
    const cond3 = new cdk.Condition(stack, 'Condition3', { expression: cdk.Fn.conditionEquals(param, "hello") });

    // WHEN
    new cdk.Condition(stack, 'Condition4', {
      expression: cdk.Fn.conditionOr(cond1, cond2, cdk.Fn.conditionNot(cond3))
    });

    // THEN
    test.deepEqual(stack.toCloudFormation(), {
      Parameters: { Param1: { Type: 'String' } },
      Conditions: {
        Condition1: { 'Fn::Equals': [ 'a', 'b' ] },
        Condition2: { 'Fn::Contains': [ [ 'a', 'b', 'c' ], 'c' ] },
        Condition3: { 'Fn::Equals': [ { Ref: 'Param1' }, 'hello' ] },
        Condition4: { 'Fn::Or': [
          { Condition: 'Condition1' },
          { Condition: 'Condition2' },
          { 'Fn::Not': [ { Condition: 'Condition3' } ] } ] } } });

    test.done();
  },

  'condition expressions can be embedded as strings'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const propValue: string = cdk.Fn.conditionIf('Cond', 'A', 'B').toString();

    // WHEN
    new cdk.Resource(stack, 'MyResource', {
      type: 'AWS::Foo::Bar',
      properties: {
        StringProp: propValue
      }
    });

    // THEN
    test.ok(cdk.unresolved(propValue));
    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: {
          Type: 'AWS::Foo::Bar',
          Properties: {
            StringProp: { 'Fn::If': [ 'Cond', 'A', 'B' ] }
          }
        }
      }
    });
    test.done();
  }
};
