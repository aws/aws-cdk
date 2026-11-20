import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-managedinstances-launch-template-options');
// TODO: Remove this acknowledge once the bundled CFN validation schema includes NitroEnclavesEnabled
cdk.Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'NitroEnclavesEnabled is a newly launched property not yet in the bundled schema' });

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: true });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', { vpc });

const securityGroup = new ec2.SecurityGroup(stack, 'ManagedInstancesSecurityGroup', {
  vpc,
  description: 'Security group for ManagedInstances capacity provider instances',
});

// No service is created, so the capacity provider does not launch any instances.
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  // FIPS can only be enabled in AWS GovCloud (US) Regions, so the test sets it explicitly to false.
  fipsEnabled: false,
  instanceMetadataTagsPropagation: false,
  nitroEnclavesEnabled: true,
});

cluster.addManagedInstancesCapacityProvider(miCapacityProvider);

new integ.IntegTest(app, 'ManagedInstancesLaunchTemplateOptions', {
  testCases: [stack],
});
