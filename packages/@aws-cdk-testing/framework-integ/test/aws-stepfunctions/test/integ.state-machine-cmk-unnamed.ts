import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * A state machine without a name, encrypted with a customer managed key.
 *
 * The execution role may only use the key under the state machine's ARN as
 * encryption context, so executions can only succeed if that condition
 * resolves to the CloudFormation-generated ARN.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-unnamed-statemachine-with-cmk');

const kmsKey = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  pendingWindow: cdk.Duration.days(7),
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(new sfn.Pass(stack, 'Pass', {
    result: sfn.Result.fromObject({ hello: 'world' }),
  })),
  encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(kmsKey),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const testCase = new IntegTest(app, 'UnnamedStateMachineWithCMKEncryptionConfiguration', {
  testCases: [stack],
});

const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

const describeExecution = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
  output: JSON.stringify({ hello: 'world' }),
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(10),
});

// The assertion providers write the encrypted execution input and read the
// encrypted execution output
const keyAccess = {
  Effect: 'Allow',
  Action: ['kms:Decrypt', 'kms:GenerateDataKey'],
  Resource: kmsKey.keyArn,
};
start.provider.addToRolePolicy(keyAccess);
if (describeExecution instanceof AwsApiCall) {
  describeExecution.waiterProvider?.addToRolePolicy(keyAccess);
}

start.next(describeExecution);
