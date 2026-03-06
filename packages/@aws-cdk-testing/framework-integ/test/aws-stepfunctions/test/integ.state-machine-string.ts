import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
/*
 * Stack verification steps:
 *
 * -- aws stepfunctions describe-state-machine --state-machine-arn <stack-output> has a status of `ACTIVE` and the definition is correct
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-integ');

new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromString('{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}'),
});

const smWithTimeout = new sfn.StateMachine(stack, 'StateMachineWithTimeout', {
  definitionBody: sfn.DefinitionBody.fromString('{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}}}'),
  timeout: cdk.Duration.hours(1),
});

const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});

integ.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: smWithTimeout.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  definition: '{"StartAt":"Pass","States":{"Pass":{"Type":"Pass","End":true}},"TimeoutSeconds":3600}',
}));
