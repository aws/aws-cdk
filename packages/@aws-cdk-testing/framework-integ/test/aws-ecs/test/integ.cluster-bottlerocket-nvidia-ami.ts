import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ-bottlerocket-nvidia-ami');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});
cluster.addCapacity('bottlerocket-asg', {
  minCapacity: 0,
  maxCapacity: 1,
  instanceType: new ec2.InstanceType('g3s.xlarge'),
  machineImage: new ecs.BottleRocketImage({
    variant: ecs.BottlerocketEcsVariant.AWS_ECS_2_NVIDIA,
  }),
});

new integ.IntegTest(app, 'aws-ecs-bottlerocket-nvidia-ami', {
  testCases: [stack],
});

app.synth();
