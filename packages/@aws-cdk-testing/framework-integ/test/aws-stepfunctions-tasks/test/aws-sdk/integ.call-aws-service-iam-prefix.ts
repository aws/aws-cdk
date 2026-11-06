import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { CallAwsService } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * SDK service names whose IAM service prefix differs from the service name:
 * - sesv2 -> ses
 * - emrserverless -> emr-serverless
 * The state machine role must get `ses:listEmailIdentities` and
 * `emr-serverless:listApplications` for the execution to succeed.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-call-aws-service-iam-prefix-integ');

const listEmailIdentities = new CallAwsService(stack, 'ListEmailIdentities', {
  service: 'sesv2',
  action: 'listEmailIdentities',
  resultPath: sfn.JsonPath.DISCARD,
  iamResources: ['*'],
});

const listApplications = new CallAwsService(stack, 'ListApplications', {
  service: 'emrserverless',
  action: 'listApplications',
  resultPath: sfn.JsonPath.DISCARD,
  iamResources: ['*'],
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(listEmailIdentities.next(listApplications)),
});

// THEN
const integ = new IntegTest(app, 'IntegTest', {
  testCases: [stack],
});
const res = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});
const executionArn = res.getAttString('executionArn');
integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn,
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.seconds(30),
  interval: cdk.Duration.seconds(3),
});
