import * as cdk from 'aws-cdk-lib';
import type * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';

/*
 * Two state machines in one stack, each with an EvaluateExpression task that uses the
 * same runtime and architecture. With the
 * `@aws-cdk/aws-stepfunctions-tasks:evaluateExpressionDedicatedFunction` feature flag
 * each task has its own function.
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-stepfunctions-tasks:evaluateExpressionDedicatedFunction': true,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-sfn-evaluate-expression-isolation-integ');

const writeGlobal = new tasks.EvaluateExpression(stack, 'WriteGlobal', {
  expression: '(globalThis.__evaluateExpressionMarker = $.marker)',
  resultPath: '$.written',
});
const writer = new sfn.StateMachine(stack, 'WriterStateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(writeGlobal),
});

const reader = new sfn.StateMachine(stack, 'ReaderStateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(new tasks.EvaluateExpression(stack, 'ReadGlobal', {
    expression: 'typeof globalThis.__evaluateExpressionMarker',
    resultPath: '$.markerType',
  })),
});
const writerFunction = writeGlobal.node.findChild('EvalFunction') as lambda.IFunction;

const integ = new IntegTest(app, 'EvaluateExpressionIsolationTest', {
  testCases: [stack],
});

const readerDefinition = integ.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: reader.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  definition: Match.stringLikeRegexp(`^(?![\\s\\S]*${writerFunction.functionArn})`),
}));

const writerExecution = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: writer.stateMachineArn,
  input: JSON.stringify({ marker: 'written-by-another-state-machine' }),
});

const writerResult = integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: writerExecution.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: Match.serializedJson(Match.objectLike({ written: 'written-by-another-state-machine' })),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(5),
});

const readerExecution = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: reader.stateMachineArn,
  input: JSON.stringify({}),
});

const readerResult = integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: readerExecution.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: Match.serializedJson(Match.objectLike({ markerType: 'undefined' })),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(5),
});

readerDefinition.next(writerExecution).next(writerResult).next(readerExecution).next(readerResult);
