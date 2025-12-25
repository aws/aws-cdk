import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'integ-ecs-imported-cluster');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const kmsKey = new kms.Key(stack, 'KmsKey');
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  managedStorageConfiguration: {
    kmsKey,
  },
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD),
  minCapacity: 0,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup,
  enableManagedTerminationProtection: false,
});

cluster.addAsgCapacityProvider(cp);

const importedCluster = ecs.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
  clusterName: cluster.clusterName,
  vpc,
  autoscalingGroup: autoScalingGroup,
  managedStorageConfiguration: {
    kmsKey,
  },
});

// Verify that managedStorageConfiguration is accessible on imported cluster
if (!importedCluster.managedStorageConfiguration) {
  throw new Error('managedStorageConfiguration should be defined on imported cluster');
}

new integ.IntegTest(app, 'ClusterImported', {
  testCases: [stack],
});

app.synth();
