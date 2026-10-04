import { Construct } from 'constructs';
import { acknowledgeTestValidationRules } from './util';
import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import { Duration, Stack, App } from '../../core';
import * as ecs from '../lib';
import { CapacityProviderInfrastructureOptimization, ClusterSettings } from '../lib/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('ECS Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('ClusterSettings', () => {
    test('applies setting to ECS cluster', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(cluster)).toBe(true);
      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enabled' },
      ]);
    });

    test('updates existing setting with same name', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'containerInsights', value: 'disabled' },
        ],
      });
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('adds setting when different name exists', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'otherSetting', value: 'someValue' },
        ],
      });
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'otherSetting', value: 'someValue' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('wraps non-array clusterSettings and preserves existing value', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      (cluster as any).clusterSettings = { Ref: 'ExistingSettings' };
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { Ref: 'ExistingSettings' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('does not support non-ECS cluster constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(construct)).toBe(false);
    });
  });

  describe('CapacityProviderInfrastructureOptimization', () => {
    const managedInstancesProvider = {
      infrastructureRoleArn: 'infra-role-arn',
      instanceLaunchTemplate: {
        ec2InstanceProfileArn: 'instance-profile-arn',
        networkConfiguration: { subnets: ['subnet-1'], securityGroups: ['sg-1'] },
      },
    };

    test('sets scaleInAfter on a managed instances capacity provider', () => {
      const capacityProvider = new ecs.CfnCapacityProvider(stack, 'CapacityProvider', {
        managedInstancesProvider,
      });
      const mixin = new CapacityProviderInfrastructureOptimization({ scaleInAfter: Duration.minutes(10) });

      expect(mixin.supports(capacityProvider)).toBe(true);
      mixin.applyTo(capacityProvider);

      expect(capacityProvider.managedInstancesProvider).toMatchObject({
        infrastructureRoleArn: 'infra-role-arn',
        infrastructureOptimization: { scaleInAfter: 600 },
      });
    });

    test('disables infrastructure optimization', () => {
      const capacityProvider = new ecs.CfnCapacityProvider(stack, 'CapacityProvider', {
        managedInstancesProvider,
      });
      const mixin = new CapacityProviderInfrastructureOptimization({ disableInfrastructureOptimization: true });

      mixin.applyTo(capacityProvider);

      expect(capacityProvider.managedInstancesProvider).toMatchObject({
        infrastructureOptimization: { scaleInAfter: -1 },
      });
    });

    test('does not support non-capacity-provider constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new CapacityProviderInfrastructureOptimization({ scaleInAfter: Duration.seconds(60) });

      expect(mixin.supports(construct)).toBe(false);
    });

    test('fails when scaleInAfter and disableInfrastructureOptimization are both specified', () => {
      expect(() => new CapacityProviderInfrastructureOptimization({
        scaleInAfter: Duration.seconds(60),
        disableInfrastructureOptimization: true,
      })).toThrow('The options "scaleInAfter" and "disableInfrastructureOptimization" are mutually exclusive');
    });

    test('fails when scaleInAfter exceeds 3600 seconds', () => {
      expect(() => new CapacityProviderInfrastructureOptimization({
        scaleInAfter: Duration.hours(2),
      })).toThrow('scaleInAfter must be between 0 seconds and 3600 seconds (1 hour), got 7200 seconds');
    });

    test('fails when applied to a capacity provider without managedInstancesProvider', () => {
      const capacityProvider = new ecs.CfnCapacityProvider(stack, 'CapacityProvider', {
        autoScalingGroupProvider: {
          autoScalingGroupArn: 'asg-arn',
        },
      });
      const mixin = new CapacityProviderInfrastructureOptimization({ scaleInAfter: Duration.seconds(60) });

      expect(() => mixin.applyTo(capacityProvider)).toThrow(
        'CapacityProviderInfrastructureOptimization can only be applied to a capacity provider configured with managedInstancesProvider',
      );
    });

    test('can be applied to a ManagedInstancesCapacityProvider L2 construct via .with()', () => {
      acknowledgeTestValidationRules(stack);
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const infrastructureRole = new iam.Role(stack, 'InfrastructureRole', {
        assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
        ],
      });
      const instanceRole = new iam.Role(stack, 'InstanceRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
        ],
      });
      const instanceProfile = new iam.InstanceProfile(stack, 'InstanceProfile', { role: instanceRole });
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

      const provider = new ecs.ManagedInstancesCapacityProvider(stack, 'Provider', {
        infrastructureRole,
        ec2InstanceProfile: instanceProfile,
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      provider.with(new CapacityProviderInfrastructureOptimization({ scaleInAfter: Duration.minutes(5) }));

      Template.fromStack(stack).hasResourceProperties('AWS::ECS::CapacityProvider', {
        ManagedInstancesProvider: Match.objectLike({
          InfrastructureOptimization: { ScaleInAfter: 300 },
        }),
      });
    });
  });
});
