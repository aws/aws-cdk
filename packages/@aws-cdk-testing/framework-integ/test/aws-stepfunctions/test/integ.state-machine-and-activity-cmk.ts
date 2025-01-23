import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as task from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as kms from 'aws-cdk-lib/aws-kms';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly activity: sfn.Activity;
  readonly stateMachineKmsKey: kms.Key;
  readonly activityKmsKey: kms.Key;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stateMachineKmsKey = new kms.Key(this, 'StateMachine Key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.activityKmsKey = new kms.Key(this, 'Activity Key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.activity = new sfn.Activity(this, 'ActivityWithCMKEncryptionConfiguration', {
      activityName: 'ActivityWithCMKEncryptionConfiguration',
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(this.activityKmsKey, cdk.Duration.seconds(75)),
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
      encryptionConfiguration: new sfn.CustomerManagedEncryptionConfiguration(this.stateMachineKmsKey, cdk.Duration.seconds(75)),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
const app = new cdk.App();
const stack = new KMSStateMachine(app, 'aws-stepfunctions-statemachine-and-activity-with-cmk-encryptionconfig');

const testCase = new IntegTest(app, 'StateMachineAndActivityWithCMKEncryptionConfiguration', {
  testCases: [stack],
});

// Start execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});

const getActivityTask = testCase.assertions.awsApiCall('StepFunctions', 'getActivityTask', {
  activityArn: stack.activity.activityArn,
});

getActivityTask.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: 'kms:Decrypt',
  Resource: `${stack.activityKmsKey.keyArn}`,
});

const sendTaskSuccess = testCase.assertions.awsApiCall('StepFunctions', 'sendTaskSuccess', {
  taskToken: getActivityTask.getAttString('taskToken'),
  output: JSON.stringify({
    hello: 'world',
  }),
});

start.next(getActivityTask);
getActivityTask.next(sendTaskSuccess);

getActivityTask.assertAtPath('input.Hello', ExpectedResult.stringLikeRegexp('World'));

app.synth();
