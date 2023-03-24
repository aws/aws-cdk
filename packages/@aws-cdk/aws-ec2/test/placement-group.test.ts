import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { ArnPrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack, Duration } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import * as batch from '../lib';
import { AllocationStrategy, ManagedEc2EcsComputeEnvironment, ManagedEc2EcsComputeEnvironmentProps, ManagedEc2EksComputeEnvironment, ManagedEc2EksComputeEnvironmentProps, PlacementGroup, PlacementGroupSpreadLevel, PlacementGroupStrategy } from '../lib';
import { CfnComputeEnvironmentProps } from '../lib/batch.generated';


test('can configure empty placement group', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {});
});

test('only spcifiying partitions => strategy is PARTITION', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    Partitions: 5,
    PlacementGroupStrategy: PlacementGroupStrategy.PARTITION,
  });
});

test('placement group respects spreadLevel', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup', {
    spreadLevel: PlacementGroupSpreadLevel.HOST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    PlacementGroupSpreadLevel: PlacementGroupSpreadLevel.HOST,
  });
});

test('placement group respects strategy', () => {
  // GIVEN
  const stack = new Stack();

  new PlacementGroup(stack, 'placementgroup', {
    strategy: PlacementGroupStrategy.SPREAD,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    PlacementGroupStrategy: PlacementGroupStrategy.SPREAD,
  });
});

test('placement group throws if the CLUSTER strategy is used with partitions', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.CLUSTER,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'partitions' with the 'PARTITION' strategy/);
});

test('placement group throws if the SPREAD strategy is used with partitions', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.SPREAD,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'partitions' with the 'PARTITION' strategy/);
});
