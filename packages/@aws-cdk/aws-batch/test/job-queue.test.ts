import { Template } from '@aws-cdk/assertions';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { FairshareSchedulingPolicy, JobQueue, ManagedEc2EcsComputeEnvironment } from '../lib';


test('JobQueue respects computeEnvironments', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
    ComputeEnvironmentOrder: [{
      ComputeEnvironment: { 'Fn::GetAtt': ['CE1BFE03A1', 'ComputeEnvironmentArn'] },
      Order: 1,
    }],
    Priority: 10,
  });
});

test('JobQueue respects enabled', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    enabled: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
    ComputeEnvironmentOrder: [{
      ComputeEnvironment: { 'Fn::GetAtt': ['CE1BFE03A1', 'ComputeEnvironmentArn'] },
      Order: 1,
    }],
    Priority: 10,
    State: 'DISABLED',
  });
});

test('JobQueue respects name', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    name: 'JoBBQ',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
    ComputeEnvironmentOrder: [{
      ComputeEnvironment: { 'Fn::GetAtt': ['CE1BFE03A1', 'ComputeEnvironmentArn'] },
      Order: 1,
    }],
    Priority: 10,
    JobQueueName: 'JoBBQ',
  });
});

test('JobQueue respects schedulingPolicy', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    schedulingPolicy: new FairshareSchedulingPolicy(stack, 'FairsharePolicy'),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
    ComputeEnvironmentOrder: [{
      ComputeEnvironment: { 'Fn::GetAtt': ['CE1BFE03A1', 'ComputeEnvironmentArn'] },
      Order: 1,
    }],
    Priority: 10,
    SchedulingPolicyArn: {
      'Fn::GetAtt': ['FairsharePolicy51969009', 'Arn'],
    },
  });
});

test('JobQueue respects addComputeEnvironment', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new Vpc(stack, 'vpc');

  // WHEN
  const joBBQ = new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'FirstCE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    schedulingPolicy: new FairshareSchedulingPolicy(stack, 'FairsharePolicy'),
  });

  joBBQ.addComputeEnvironment(
    new ManagedEc2EcsComputeEnvironment(stack, 'SecondCE', {
      vpc,
    }),
    2,
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
    ComputeEnvironmentOrder: [
      {
        ComputeEnvironment: { 'Fn::GetAtt': ['FirstCEAD3794AD', 'ComputeEnvironmentArn'] },
        Order: 1,
      },
      {
        ComputeEnvironment: { 'Fn::GetAtt': ['SecondCEEBA93938', 'ComputeEnvironmentArn'] },
        Order: 2,
      },
    ],
    Priority: 10,
    SchedulingPolicyArn: {
      'Fn::GetAtt': ['FairsharePolicy51969009', 'Arn'],
    },
  });
});
