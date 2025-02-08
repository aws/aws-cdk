import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const executionOutput = 'Hello World';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly kmsKey: kms.Key;
  readonly logGroup: logs.LogGroup;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.kmsKey = new kms.Key(this, 'Key used for encryption', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/vendedlogs/states/MyLogGroup',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKWithCWLEncryption', {
      stateMachineName: 'StateMachineWithCMKWithCWLEncryption',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(this, 'PassState', {
        result: sfn.Result.fromString(executionOutput),
      }))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(this.kmsKey, cdk.Duration.seconds(300)),
      logs: {
        destination: this.logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
const app = new cdk.App();
const stack = new KMSStateMachine(app, 'aws-stepfunctions-statemachine-and-activity-with-cmk-encryptionconfig');

const testCase = new IntegTest(app, 'StateMachineAndActivityWithCMKEncryptionConfiguration', {
  testCases: [stack],
});

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
});

start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});

const filterLogEvents = testCase.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: stack.logGroup.logGroupName,
  filterPattern: executionOutput,
});

describe.next(filterLogEvents);

filterLogEvents.assertAtPath('events.0.message.details.output', ExpectedResult.stringLikeRegexp(executionOutput)).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(2),
});

app.synth();
