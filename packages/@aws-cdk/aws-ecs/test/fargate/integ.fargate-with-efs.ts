import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ecs from '../../lib';


class FargateWithEfsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

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
new FargateWithEfsStack(app, 'aws-ecs-fargate-efs');

app.synth();
