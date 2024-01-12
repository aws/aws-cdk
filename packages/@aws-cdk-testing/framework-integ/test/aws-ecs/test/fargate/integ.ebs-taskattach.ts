import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      restrictDefaultSecurityGroup: false,
    });

    const ebsRole = new iam.Role(this, 'EBSRole', {
      assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess')],
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

    const volume = new ecs.ServiceManagedVolume({
      name: 'ebs1',
      managedEBSVolume: {
        role: ebsRole,
        sizeInGiB: 20,
        tagSpecifications: [{
          tags: {
            purpose: 'production',
          },
          propagateTags: ecs.PropagatedTagSource.SERVICE,
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

const app = new cdk.App();
const stack = new TestStack(app, 'integ-aws-ecs-ebs-task-attach');

new integ.IntegTest(app, 'EBSTaskAttach', {
  testCases: [stack],
});
app.synth();