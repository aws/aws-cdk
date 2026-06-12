import { Template } from '../../assertions';
import { Duration, Stack } from '../../core';
import { FairshareSchedulingPolicy, IdleResourceAssignmentStrategy, QuotaShareSchedulingPolicy } from '../lib';

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

test('fairshare policy respects quotaSharePolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new QuotaShareSchedulingPolicy(stack, 'schedulingPolicy', {
    idleResourceAssignmentStrategy: IdleResourceAssignmentStrategy.FIFO,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    QuotaSharePolicy: {
      IdleResourceAssignmentStrategy: 'FIFO',
    },
  });
});

test('fairshare policy without quotaSharePolicy does not render QuotaSharePolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new FairshareSchedulingPolicy(stack, 'schedulingPolicy');

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    FairsharePolicy: {
      ShareDistribution: [],
    },
  });
  // QuotaSharePolicy should not be present
  const resources = template.findResources('AWS::Batch::SchedulingPolicy');
  const [resource] = Object.values(resources);
  expect(resource.Properties.QuotaSharePolicy).toBeUndefined();
});

test('quota share policy respects name', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new QuotaShareSchedulingPolicy(stack, 'schedulingPolicy', {
    schedulingPolicyName: 'QuotaSharePolicyName',
    idleResourceAssignmentStrategy: IdleResourceAssignmentStrategy.FIFO,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    Name: 'QuotaSharePolicyName',
    QuotaSharePolicy: {
      IdleResourceAssignmentStrategy: 'FIFO',
    },
  });
});

test('quota share policy without idleResourceAssignmentStrategy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new QuotaShareSchedulingPolicy(stack, 'schedulingPolicy');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::SchedulingPolicy', {
    QuotaSharePolicy: {},
  });
});

test('quota share policy can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const policy = QuotaShareSchedulingPolicy.fromQuotaShareSchedulingPolicyArn(stack, 'policyImport',
    'arn:aws:batch:us-east-1:123456789012:scheduling-policy/quotaSharePolicy');

  // THEN
  expect(policy.schedulingPolicyArn).toEqual('arn:aws:batch:us-east-1:123456789012:scheduling-policy/quotaSharePolicy');
});

test('quota share policy does not render FairsharePolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new QuotaShareSchedulingPolicy(stack, 'schedulingPolicy', {
    idleResourceAssignmentStrategy: IdleResourceAssignmentStrategy.FIFO,
  });

  // THEN
  const resources = Template.fromStack(stack).findResources('AWS::Batch::SchedulingPolicy');
  const [resource] = Object.values(resources);
  expect(resource.Properties.FairsharePolicy).toBeUndefined();
});
