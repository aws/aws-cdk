/// !cdk-integ *
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { LogLevel } from 'aws-cdk-lib/aws-stepfunctions';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'Vpc');
    const securityGroup = new SecurityGroup(this, 'SecurityGroup', { vpc });
    const logGroup = new LogGroup(this, 'LogGroup');

    // WHEN
    new Provider(this, 'MyProvider', {
      onEventHandler: new Function(this, 'OnEvent', {
        code: Code.fromInline('foo'),
        handler: 'index.onEvent',
        runtime: Runtime.NODEJS_LATEST,
      }),
      isCompleteHandler: new Function(this, 'IsComplete', {
        code: Code.fromInline('foo'),
        handler: 'index.isComplete',
        runtime: Runtime.NODEJS_LATEST,
      }),
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [securityGroup],
      waiterStateMachineLogOptions: {
        destination: logGroup,
        includeExecutionData: true,
        level: LogLevel.ALL,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'integ-provider-with-waiter-state-machine');

new integ.IntegTest(app, 'IntegProviderWithWaiterStateMachine', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
