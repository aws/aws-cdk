import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as integ from '@aws-cdk/integ-tests-alpha';

class FargateWithEbsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addVolume({
      name: 'ebs-volume',
      configuredAtLaunch: true,
    });

    const containerDefinition = new ecs.ContainerDefinition(this, 'Container', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      taskDefinition,
    });
    containerDefinition.addMountPoints({
      containerPath: '/mnt/ebs',
      sourceVolume: 'ebs-volume',
      readOnly: false,
    });

    new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      ebsVolumeConfiguration: {
        volumeName: 'ebs-volume',
        encrypted: true,
        filesystemType: ecs.FilesystemType.XFS,
        iops: 3000,
        sizeInGiB: 1,
        tagSpecifications: [{
          propagateTags: ecs.EbsPropagatedTagSource.SERVICE,
          tags: [{
            key: 'ebs',
            value: 'volume',
          }],
        }],
        throughput: 100,
        volumeType: ecs.VolumeType.GP3,
      },
    });
  }
}

const app = new cdk.App();
const stack = new FargateWithEbsStack(app, 'aws-ecs-fargate-ebs');

new integ.IntegTest(app, 'aws-ecs-fargate-ebs-test', {
  testCases: [stack],
});
app.synth();