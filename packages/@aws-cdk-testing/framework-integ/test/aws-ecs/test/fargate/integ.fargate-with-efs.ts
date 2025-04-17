import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as integ from '@aws-cdk/integ-tests-alpha';

class FargateWithEfsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const fs = new efs.FileSystem(this, 'etcdata', {
      vpc: vpc,
    });

    // Just need a TaskDefinition to test this
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addVolume({
      name: 'somedata',
      efsVolumeConfiguration: {
        fileSystemId: fs.fileSystemId,
      },
    });
  }
}

const app = new cdk.App();
const stack = new FargateWithEfsStack(app, 'aws-ecs-fargate-efs');

new integ.IntegTest(app, 'aws-ecs-fargate-test', {
  testCases: [stack],
});
app.synth();
