import { Template } from '../../assertions';
import { Duration, Stack } from '../../core';
import { FairshareSchedulingPolicy } from '../lib';

test('empty fairshare policy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ShareDistribution: [],
    },
  });
});

test('fairshare policy respects computeReservation', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
    computeReservation: 75,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ComputeReservation: 75,
      ShareDistribution: [],
    },
  });
});

test('fairshare policy respects name', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
    schedulingPolicyName: 'FairsharePolicyName',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    Name: 'FairsharePolicyName',
    FairsharePolicy: {
      ShareDistribution: [],
    },
  });
});

test('fairshare policy respects shareDecay', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
    shareDecay: Duration.hours(1),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ShareDecaySeconds: 3600,
      ShareDistribution: [],
    },
  });
});

test('fairshare policy respects shares', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
    shares: [
      {
        shareIdentifier: 'myShareId',
        weightFactor: 0.5,
      },
      {
        shareIdentifier: 'myShareId2',
        weightFactor: 1,
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ShareDistribution: [
        {
          ShareIdentifier: 'myShareId',
          WeightFactor: 0.5,
        },
        {
          ShareIdentifier: 'myShareId2',
          WeightFactor: 1,
        },
      ],
    },
  });
});

test('addShare() works', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const policy = new FairshareSchedulingPolicy(stack, 'schedulingPolicy', {
    shares: [{
      shareIdentifier: 'myShareId',
      weightFactor: 0.5,
    }],
  });
  policy.addShare({
    shareIdentifier: 'addedShareId',
    weightFactor: 0.5,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ShareDistribution: [
        {
          ShareIdentifier: 'myShareId',
          WeightFactor: 0.5,
        },
        {
          ShareIdentifier: 'addedShareId',
          WeightFactor: 0.5,
        },
      ],
    },
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const policy = FairshareSchedulingPolicy.fromFairshareSchedulingPolicyArn(stack, 'policyImport',
    'arn:aws:batch:us-east-1:123456789012:scheduling-policy/policyImport');

  // THEN
  expect(policy.schedulingPolicyArn).toEqual('arn:aws:batch:us-east-1:123456789012:scheduling-policy/policyImport');
});
