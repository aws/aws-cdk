import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly kmsKey: kms.Key;
  readonly logGroup: logs.LogGroup;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.kmsKey = new kms.Key(this, 'Key');
    this.logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/vendedlogs/states/MyLogGroup',
      encryptionKey: this.kmsKey,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKWithCWLEncryption', {
      stateMachineName: 'StateMachineWithCMKWithCWLEncryption',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(this, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      kmsKey: this.kmsKey,
      kmsDataKeyReusePeriodSeconds: cdk.Duration.seconds(75),
      enableEncryptedLogging: true,
      logs: {
        destination: this.logGroup,
        level: sfn.LogLevel.FATAL,
        includeExecutionData: false,
      },
    });
  }
}
const app = new cdk.App();
const stack = new KMSStateMachine(app, 'stepfunctions-cmk-cwl-integ');

new IntegTest(app, 'StateMachineWithCMKWithCWLEncryption', {
  testCases: [stack],
});

app.synth();
