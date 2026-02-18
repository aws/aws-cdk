import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();
const stack = new Stack(app, 'aws-cdk-sfn-evaluate-expression-default-integ');

const evaluateExpression = new tasks.EvaluateExpression(stack, 'EvaluateExpression', {
  expression: '$.a + $.b',
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(evaluateExpression),
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new integ.IntegTest(app, 'EvaluateExpressionDefaultTest', {
  testCases: [stack],
});
