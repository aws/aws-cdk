import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { DefaultTokenResolver, Stack, StringConcat, Tokenization } from '../../core';
import { FairshareSchedulingPolicy, JobQueue, ManagedEc2EcsComputeEnvironment } from '../lib';

test('JobQueue respects computeEnvironments', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'joBBQ', {
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
    State: 'ENABLED',
  });
});

test('JobQueue respects enabled', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'joBBQ', {
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
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  new JobQueue(stack, 'joBBQ', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    jobQueueName: 'JoBBQ',
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

test('JobQueue name is parsed from arn', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  const queue = new JobQueue(stack, 'joBBQ', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'CE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    jobQueueName: 'JoBBQ',
  });

  // THEN
  expect(Tokenization.resolve(queue.jobQueueName, {
    scope: stack,
    resolver: new DefaultTokenResolver(new StringConcat()),
  })).toEqual({
    'Fn::Select': [
      1,
      {
        'Fn::Split': [
          '/',
          {
            'Fn::Select': [
              5,
              {
                'Fn::Split': [
                  ':',
                  {
                    'Fn::GetAtt': [
                      'joBBQ9FD52DAF',
                      'JobQueueArn',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
});

test('JobQueue respects schedulingPolicy', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

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
      'Fn::GetAtt': ['FairsharePolicyA0C549BE', 'Arn'],
    },
  });
});

test('JobQueue respects addComputeEnvironment', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  const queue = new JobQueue(stack, 'JobQueue', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'FirstCE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
    schedulingPolicy: new FairshareSchedulingPolicy(stack, 'FairsharePolicy'),
  });

  queue.addComputeEnvironment(
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
      'Fn::GetAtt': ['FairsharePolicyA0C549BE', 'Arn'],
    },
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const queue = JobQueue.fromJobQueueArn(stack, 'importedJobQueue',
    'arn:aws:batch:us-east-1:123456789012:job-queue/importedJobQueue');

  // THEN
  expect(queue.jobQueueArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-queue/importedJobQueue');
});

test('JobQueue throws when the same order is assigned to multiple ComputeEnvironments', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'vpc');

  // WHEN
  const joBBQ = new JobQueue(stack, 'joBBQ', {
    computeEnvironments: [{
      computeEnvironment: new ManagedEc2EcsComputeEnvironment(stack, 'FirstCE', {
        vpc,
      }),
      order: 1,
    }],
    priority: 10,
  });

  joBBQ.addComputeEnvironment(
    new ManagedEc2EcsComputeEnvironment(stack, 'SecondCE', {
      vpc,
    }),
    1,
  );

  expect(() => {
    Template.fromStack(stack);
  }).toThrow(/assigns the same order to different ComputeEnvironments/);
});

test('JobQueue throws when there are no linked ComputeEnvironments', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new JobQueue(stack, 'joBBQ');

  expect(() => {
    Template.fromStack(stack);
  }).toThrow(/This JobQueue does not link any ComputeEnvironments/);
});
