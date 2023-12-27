import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-bottlerocket-nvidia-ami');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});
cluster.addCapacity('bottlerocket-asg', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('p3.2xlarge'),
  machineImage: new ecs.BottleRocketImage({
    variant: ecs.BottlerocketEcsVariant.AWS_ECS_1_NVIDIA,
  }),
});

new integ.IntegTest(app, 'aws-ecs-bottlerocket-nvidia-ami', {
  testCases: [stack],
});

app.synth();
