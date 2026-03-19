import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      restrictDefaultSecurityGroup: false,
    });

    const sourceVolume = new ec2.Volume(this, 'SourceVolume', {
      availabilityZone: vpc.availabilityZones[0],
      size: cdk.Size.gibibytes(1),
      volumeType: ec2.EbsDeviceVolumeType.GP3,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const snapshotFn = new lambda.NodejsFunction(this, 'SnapshotFn', {
      entry: path.join(__dirname, 'snapshot-provider', 'index.ts'),
      handler: 'handler',
      timeout: cdk.Duration.minutes(10),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['ec2:CreateSnapshot', 'ec2:DescribeSnapshots', 'ec2:DeleteSnapshot'],
          resources: ['*'],
        }),
      ],
    });

    const snapshotCr = new cdk.CustomResource(this, 'Snapshot', {
      serviceToken: snapshotFn.functionArn,
      properties: { VolumeId: sourceVolume.volumeId },
    });

    const snapShotId = snapshotCr.getAttString('SnapshotId');

    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');

    const container = taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ containerPort: 80, protocol: ecs.Protocol.TCP }],
    });

    const ebsVolume = new ecs.ServiceManagedVolume(this, 'EBSVolume', {
      name: 'ebs1',
      managedEBSVolume: {
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        size: cdk.Size.gibibytes(1),
        fileSystemType: ecs.FileSystemType.EXT4,
        volumeInitializationRate: cdk.Size.mebibytes(200),
        snapShotId: snapShotId,
      },
    });

    ebsVolume.mountIn(container, { containerPath: '/var/lib', readOnly: false });
    taskDefinition.addVolume(ebsVolume);

    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });
    service.addVolume(ebsVolume);
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'integ-aws-ecs-ebs-volume-initialization-rate');

new integ.IntegTest(app, 'EBSVolumeInitializationRate', {
  testCases: [stack],
});
