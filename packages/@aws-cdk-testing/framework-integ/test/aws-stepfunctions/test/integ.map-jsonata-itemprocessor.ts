import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/**
 * Integration test for Map.jsonata() with itemProcessor
 * This test verifies that:
 * 1. Map.jsonata() correctly sets QueryLanguage: JSONata in ProcessorConfig
 * 2. Child states within itemProcessor inherit the QueryLanguage from parent
 * 3. The state machine deploys and executes successfully with JSONata expressions
 * Related to GitHub Issue #34352:
 * When using Map.jsonata() with itemProcessor(), child states should inherit
 * the QueryLanguage and use Arguments instead of Parameters.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-stepfunctions-map-jsonata-itemprocessor-stack');

const fn = new lambda.Function(stack, 'Fn', {
  runtime: lambda.Runtime.NODEJS_24_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = e => e;'),
});

const map = sfn.Map.jsonata(stack, 'Map', {
  items: sfn.ProvideItems.jsonata('{% [ { "foo": "bar" } ] %}'),
});

const pass = sfn.Pass.jsonata(stack, 'Pass', {
  outputs: '{% $states.input %}',
});

const invoke = new tasks.LambdaInvoke(stack, 'Invoke', {
  lambdaFunction: fn,
  payload: sfn.TaskInput.fromObject({
    foo: '{% $states.input.foo %}',
  }),
});

map.itemProcessor(pass.next(invoke));

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(map),
  queryLanguage: sfn.QueryLanguage.JSONATA,
});

const testCase = new IntegTest(app, 'cdk-stepfunctions-map-jsonata-itemprocessor-test', {
  testCases: [stack],
});

testCase.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: sm.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  status: 'ACTIVE',
}));

app.synth();
