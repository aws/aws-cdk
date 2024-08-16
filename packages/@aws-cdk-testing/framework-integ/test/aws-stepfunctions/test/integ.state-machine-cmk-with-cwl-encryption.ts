import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly kmsKey: kms.Key;
  readonly logGroupKey: kms.Key;
  readonly logGroup: logs.LogGroup;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.kmsKey = new kms.Key(this, 'Key used for encryption');
    this.logGroupKey = new kms.Key(this, 'LogGroup Key');

    this.logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/vendedlogs/states/MyLogGroup',
      encryptionKey: this.logGroupKey,
    });

    /**
     * We need to grant the service principal encrypt and decrypt permissions since passing
     *  a KMS key when creating a LogGroup doesn't automatically grant the service principal encrypt/decrypt permissions
     *  see: https://github.com/aws/aws-cdk/issues/28304
     */
    this.logGroupKey.grantEncryptDecrypt(new iam.ServicePrincipal('logs.amazonaws.com'));

    this.logGroupKey.addToResourcePolicy(new cdk.aws_iam.PolicyStatement({
      resources: ['*'],
      actions: ['kms:Encrypt*', 'kms:Decrypt*', 'kms:ReEncrypt*', 'kms:GenerateDataKey*', 'kms:Describe*'],
      principals: [new cdk.aws_iam.ServicePrincipal(`logs.${cdk.Stack.of(this).region}.amazonaws.com`)],
      conditions: {
        ArnEquals: {
          'kms:EncryptionContext:aws:logs:arn': cdk.Stack.of(this).formatArn({
            service: 'logs',
            resource: 'log-group',
            sep: ':',
            resourceName: 'MyLogGroup', // Cannot use this.logGroup.logGroupName since this will cause a circular dependency
          }),
        },
      },
    }));

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKWithCWLEncryption', {
      stateMachineName: 'StateMachineWithCMKWithCWLEncryption',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(this, 'PassState'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(300),
      logs: {
        destination: this.logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: false,
      },
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
  totalTimeout: cdk.Duration.minutes(5),
});

const logStreamNamePrefix = 'states/StateMachineWithCMKWithCWLEncryption';

const describeLogStream = testCase.assertions.awsApiCall('CloudWatchLogs', 'describeLogStreams', {
  logGroupName: stack.logGroup.logGroupName,
  logStreamNamePrefix: logStreamNamePrefix,
});

describeLogStream.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:Decrypt'],
  Resource: [stack.logGroupKey.keyArn],
});

describe.next(describeLogStream);
describeLogStream.assertAtPath('logStreams.0.logStreamName', ExpectedResult.stringLikeRegexp(logStreamNamePrefix));

app.synth();
