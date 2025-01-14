import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AthenaStartQueryExecution, EncryptionOption } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-athena-start-query-execution-result-reuse-configuration-integ');

const resultBucket = new Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const task = new AthenaStartQueryExecution(stack, 'Query', {
  queryString: 'SELECT 1',
  workGroup: 'primary',
  resultConfiguration: {
    encryptionConfiguration: {
      encryptionOption: EncryptionOption.S3_MANAGED,
    },
    outputLocation: {
      bucketName: resultBucket.bucketName,
      objectKey: 'folder',
    },
  },
  resultReuseConfigurationMaxAge: cdk.Duration.minutes(100),
});

const chain = sfn.Chain.start(task);

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(chain),
  timeout: cdk.Duration.seconds(30),
});

const testCase = new IntegTest(app, 'AthenaResultReuseConfiguration', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: cdk.Duration.seconds(10),
    totalTimeout: cdk.Duration.minutes(5),
  });

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(5),
});

app.synth();
