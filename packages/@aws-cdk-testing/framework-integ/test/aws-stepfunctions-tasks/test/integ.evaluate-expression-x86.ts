import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();
const stack = new Stack(app, 'aws-cdk-sfn-evaluate-expression-x86-integ');

const evaluateExpression = new tasks.EvaluateExpression(stack, 'EvaluateExpression', {
  expression: '$.a + $.b',
  architecture: lambda.Architecture.X86_64,
});

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(evaluateExpression),
  timeout: cdk.Duration.seconds(30),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new integ.IntegTest(app, 'EvaluateExpressionX86Test', {
  testCases: [stack],
});
