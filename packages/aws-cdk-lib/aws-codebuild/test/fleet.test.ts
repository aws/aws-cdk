import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as codebuild from '../lib';

test('can construct a default fleet', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new codebuild.Fleet(stack, 'Fleet');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: Match.absent(),
    BaseCapacity: Match.absent(),
    ComputeType: Match.absent(),
    EnvironmentType: Match.absent(),
  });
});

test('can construct a fleet with properties', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new codebuild.Fleet(stack, 'Fleet', {
    fleetName: 'MyFleet',
    baseCapacity: 2,
    computeType: codebuild.FleetComputeType.SMALL,
    environmentType: codebuild.FleetEnvironmentType.LINUX_CONTAINER,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Fleet', {
    Name: 'MyFleet',
    BaseCapacity: 2,
    ComputeType: 'BUILD_GENERAL1_SMALL',
    EnvironmentType: 'LINUX_CONTAINER',
  });
});

test('can import with a concrete ARN', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = codebuild.Fleet.fromFleetArn(stack, 'Fleet', 'arn:aws:codebuild:us-east-1:123456789012:fleet/MyFleet');

  // THEN
  expect(fleet.fleetArn).toEqual('arn:aws:codebuild:us-east-1:123456789012:fleet/MyFleet');
  expect(fleet.fleetName).toEqual('MyFleet');
});

test('can import with a concrete name', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const fleet = codebuild.Fleet.fromFleetName(stack, 'Fleet', 'MyFleet');
  new cdk.CfnOutput(stack, 'FleetArn', { value: fleet.fleetArn });
  new cdk.CfnOutput(stack, 'FleetName', { value: fleet.fleetName });

  // THEN
  Template.fromStack(stack).hasOutput('*', {
    Value: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':codebuild:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':fleet/MyFleet',
      ]],
    },
  });
  Template.fromStack(stack).hasOutput('*', {
    Value: 'MyFleet',
  });
});

test('throws if fleet name is longer than 128 characters', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'a'.repeat(129),
    });
  }).toThrow(/Fleet name can not be longer than 128 characters but has 129 characters./);
});

test('throws if fleet name is shorter than 2 characters', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'a',
    });
  }).toThrow(/Fleet name can not be shorter than 2 characters but has 1 characters./);
});

test('throws if baseCapacity is less than 1', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new codebuild.Fleet(stack, 'Fleet', {
      fleetName: 'MyFleet',
      baseCapacity: 0,
    });
  }).toThrow(/baseCapacity must be greater than or equal to 1/);
});