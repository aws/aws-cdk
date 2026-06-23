import * as autoscaling from '../../aws-autoscaling';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as ecs from '../lib';

export function addDefaultCapacityProvider(cluster: ecs.Cluster,
  stack: cdk.Stack,
  vpc: ec2.Vpc,
  props?: Omit<ecs.AsgCapacityProviderProps, 'autoScalingGroup'>) {
  const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
    vpc,
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    instanceType: new ec2.InstanceType('t2.micro'),
  });
  cdk.Validations.of(autoScalingGroup).acknowledge(
    { id: 'CloudFormation-Validate::E1152', reason: 'SSM parameter reference is resolved at deploy time' },
    { id: 'CloudFormation-Validate::W3697', reason: 'LaunchConfiguration used intentionally in tests' },
  );
  const provider = new ecs.AsgCapacityProvider(stack, 'AsgCapacityProvider', {
    ...props,
    autoScalingGroup,
  });
  cluster.addAsgCapacityProvider(provider);
  cluster.connections.addSecurityGroup(...autoScalingGroup.connections.securityGroups);
}
