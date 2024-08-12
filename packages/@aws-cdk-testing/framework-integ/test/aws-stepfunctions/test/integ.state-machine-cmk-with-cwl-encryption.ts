import * as cdk from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class KMSStateMachine extends cdk.Stack {
  readonly stateMachine: sfn.StateMachine;
  readonly stateMachineKmsKey: kms.Key;
  readonly logGroupKmsKey: kms.Key;
  readonly logGroup: logs.LogGroup;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stateMachineKmsKey = new kms.Key(this, 'StateMachineKey');
    this.logGroupKmsKey = new kms.Key(this, 'LogGroupKey');
    /**
     * We need to grant the service principal encrypt and decrypt permissions since passing
     *  a KMS key when creating a LogGroup doesn't automatically grant the service principal encrypt/decrypt permissions
     *  see: https://github.com/aws/aws-cdk/issues/28304
     * */
    this.logGroupKmsKey.grantEncryptDecrypt(new iam.ServicePrincipal('logs.amazonaws.com'));
    this.logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/vendedlogs/states/MyLogGroup',
      encryptionKey: this.logGroupKmsKey,
    });

    this.stateMachine = new sfn.StateMachine(this, 'StateMachineWithCMKWithCWLEncryption', {
      stateMachineName: 'StateMachineWithCMKWithCWLEncryption',
      definitionBody: sfn.DefinitionBody.fromChainable(sfn.Chain.start(new sfn.Pass(this, 'Pass'))),
      stateMachineType: sfn.StateMachineType.STANDARD,
      kmsKey: this.stateMachineKmsKey,
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
