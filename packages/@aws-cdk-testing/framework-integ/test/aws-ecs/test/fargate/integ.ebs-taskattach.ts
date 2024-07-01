import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

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
        encrypted: true,
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        size: cdk.Size.gibibytes(15),
        iops: 4000,
        throughput: 500,
        fileSystemType: ecs.FileSystemType.EXT4,
        tagSpecifications: [{
          tags: {
            purpose: 'production',
          },
          propagateTags: ecs.EbsPropagatedTagSource.SERVICE,
        },
        {
          tags: {
            purpose: 'development',
          },
          propagateTags: ecs.EbsPropagatedTagSource.TASK_DEFINITION,
        }],
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

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new TestStack(app, 'integ-aws-ecs-ebs-task-attach');

new integ.IntegTest(app, 'EBSTaskAttach', {
  testCases: [stack],
});
app.synth();
