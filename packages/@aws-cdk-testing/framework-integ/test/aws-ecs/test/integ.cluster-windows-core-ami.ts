import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for Windows Server Core AMI support
 *
 * This test uses the WindowsOptimizedCoreVersion enum and windowsCore() method
 * to create ECS capacity providers with Windows Core AMIs.
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'integ-ecs-windows-core-ami');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
});

// Create an ASG using Windows Server 2022 Core
const autoScalingGroup2022Core = new autoscaling.AutoScalingGroup(
  stack,
  'ASG-Win2022Core',
  {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: ecs.EcsOptimizedImage.windowsCore(
      ecs.WindowsOptimizedCoreVersion.SERVER_2022_CORE,
    ),
    minCapacity: 0,
  },
);

const cp2022 = new ecs.AsgCapacityProvider(
  stack,
  'EC2CapacityProvider2022Core',
  {
    autoScalingGroup: autoScalingGroup2022Core,
    enableManagedTerminationProtection: false,
  },
);

// Create an ASG using Windows Server 2019 Core
const autoScalingGroup2019Core = new autoscaling.AutoScalingGroup(
  stack,
  'ASG-Win2019Core',
  {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    // Use the regular windows method for now
    // We'll change this to windowsCore() after PR is merged
    machineImage: ecs.EcsOptimizedImage.windowsCore(
      ecs.WindowsOptimizedCoreVersion.SERVER_2019_CORE,
    ),
    minCapacity: 0,
  },
);

const cp2019 = new ecs.AsgCapacityProvider(
  stack,
  'EC2CapacityProvider2019Core',
  {
    autoScalingGroup: autoScalingGroup2019Core,
    enableManagedTerminationProtection: false,
  },
);

// Add both capacity providers to the cluster
cluster.addAsgCapacityProvider(cp2022);
cluster.addAsgCapacityProvider(cp2019);

new integ.IntegTest(app, 'ClusterWindowsCoreAmi', {
  testCases: [stack],
});

app.synth();
