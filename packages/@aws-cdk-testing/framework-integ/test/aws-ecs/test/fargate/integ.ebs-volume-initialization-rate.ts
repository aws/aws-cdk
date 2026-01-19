import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

/*
 * This integration test demonstrates how to use EBS volume initialization rate
 * with Service Managed Volumes.
 *
 * To run this test with a real EBS snapshot:
 * 1. Create an EBS volume:
 *    aws ec2 create-volume --size 1 --volume-type gp3 --availability-zone us-east-1a
 * 2. Create a snapshot from the volume:
 *    aws ec2 create-snapshot --volume-id vol-xxxxxxxxx --description "Test snapshot"
 * 3. Wait for snapshot completion:
 *    aws ec2 wait snapshot-completed --snapshot-ids snap-xxxxxxxxx
 * 4. Set the environment variable SNAPSHOT_ID to the snapshot ID:
 *    export SNAPSHOT_ID=snap-xxxxxxxxx
 */

const snapShotId = process.env.SNAPSHOT_ID ?? 'snap-123456789abcdef0';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      restrictDefaultSecurityGroup: false,
    });

    const cluster = new ecs.Cluster(this, 'FargateCluster', {
      vpc,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');

    const container = taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{
        containerPort: 80,
        protocol: ecs.Protocol.TCP,
      }],
    });

    const volume = new ecs.ServiceManagedVolume(this, 'EBSVolume', {
      name: 'ebs1',
      managedEBSVolume: {
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        size: cdk.Size.gibibytes(1),
        fileSystemType: ecs.FileSystemType.EXT4,
        volumeInitializationRate: cdk.Size.mebibytes(200),
        snapShotId: snapShotId,
      },
    });

    volume.mountIn(container, {
      containerPath: '/var/lib',
      readOnly: false,
    });

    taskDefinition.addVolume(volume);

    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });

    service.addVolume(volume);
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'integ-aws-ecs-ebs-volume-initialization-rate');

new integ.IntegTest(app, 'EBSVolumeInitializationRate', {
  testCases: [stack],
});
