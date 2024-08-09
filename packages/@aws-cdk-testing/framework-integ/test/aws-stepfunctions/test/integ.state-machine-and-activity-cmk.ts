import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly activity: sfn.Activity;
  readonly kmsKey: kms.Key;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.kmsKey = new kms.Key(this, 'Key');

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKEncryptionConfiguration', {
      stateMachineName: 'StateMachineWithCMKEncryptionConfiguration',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(this, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
    });

    this.activity = new sfn.Activity(this, 'ActivityWithCMKEncryptionConfiguration', {
      activityName: 'ActivityWithCMKEncryptionConfiguration',
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
    });

  }
}
const app = new cdk.App();
const stack = new KMSStateMachine(app, 'aws-stepfunctions-statemachine-and-activity-with-cmk-encryptionconfig');

new IntegTest(app, 'StateMachineAndActivityWithCMKEncryptionConfiguration', {
  testCases: [stack],
});

app.synth();
