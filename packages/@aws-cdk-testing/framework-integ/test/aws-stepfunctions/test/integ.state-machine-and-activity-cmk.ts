import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as task from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly activity: sfn.Activity;
  readonly kmsKey: kms.Key;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.kmsKey = new kms.Key(this, 'Key used for encryption', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.activity = new sfn.Activity(this, 'ActivityWithCMKEncryptionConfiguration', {
      activityName: 'ActivityWithCMKEncryptionConfiguration',
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKEncryptionConfiguration', {
      stateMachineName: 'StateMachineWithCMKEncryptionConfiguration',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new task.StepFunctionsInvokeActivity(this, 'Activity', {
        activity: this.activity,
        parameters: {
          Hello: 'World',
        },
      }))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
const app = new cdk.App();
const stack = new KMSStateMachine(app, 'aws-stepfunctions-statemachine-and-activity-with-cmk-encryptionconfig');

const testCase = new IntegTest(app, 'StateMachineAndActivityWithCMKEncryptionConfiguration', {
  testCases: [stack],
});

//Start execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});

const getActivityTask = testCase.assertions.awsApiCall('StepFunctions', 'getActivityTask', {
  activityArn: stack.activity.activityArn,
});

getActivityTask.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'kms:Decrypt',
  Resource: `${stack.kmsKey.keyArn}`,
});

const sendTaskSuccess = testCase.assertions.awsApiCall('StepFunctions', 'sendTaskSuccess', {
  taskToken: getActivityTask.getAttString('taskToken'),
  output: JSON.stringify({
    hello: 'world',
  }),
});

sendTaskSuccess.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'kms:Decrypt',
  Resource: `${stack.kmsKey.keyArn}`,
});

start.next(getActivityTask);
getActivityTask.next(sendTaskSuccess);

getActivityTask.assertAtPath('input.Hello', ExpectedResult.stringLikeRegexp('World'));

app.synth();
