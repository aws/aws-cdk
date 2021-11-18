import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as batch from '../lib';

describe('Batch Job Queue', () => {
  let stack: cdk.Stack;
  let computeEnvironment: batch.ComputeEnvironment;

  beforeEach(() => {
    stack = new cdk.Stack();
    computeEnvironment = new batch.ComputeEnvironment(stack, 'test-compute-env', {
      managed: false,
    });
  });

  it('can be imported from an ARN', () => {
    // WHEN
    const existingJobQ = new batch.JobQueue(stack, 'test-job-queue', {
      priority: 1,
      enabled: false,
      computeEnvironments: [
        {
          computeEnvironment,
          order: 1,
        },
      ],
    });
    const jobQFromArn = batch.JobQueue.fromJobQueueArn(stack, 'test-job-queue-from-arn', existingJobQ.jobQueueArn);

    // THEN
    expect(jobQFromArn.jobQueueArn).toEqual(existingJobQ.jobQueueArn);
  });

  it('renders the correct CloudFormation properties', () => {
    // WHEN
    const props: batch.JobQueueProps = {
      priority: 1,
      enabled: false,
      computeEnvironments: [
        {
          computeEnvironment,
          order: 1,
        },
      ],
      jobQueueName: 'test-job-queue-name',
    };
    new batch.JobQueue(stack, 'test-job-queue', props);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
      JobQueueName: props.jobQueueName,
      State: props.enabled ? 'ENABLED' : 'DISABLED',
      Priority: props.priority,
      ComputeEnvironmentOrder: [
        {
          ComputeEnvironment: {
            Ref: 'testcomputeenv547FFD1A',
          },
          Order: 1,
        },
      ],
    });
  });

  it('should have a default queue priority of 1', () => {
    // WHEN
    new batch.JobQueue(stack, 'test-job-queue', {
      enabled: false,
      computeEnvironments: [
        {
          computeEnvironment,
          order: 1,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobQueue', {
      Priority: 1,
    });
  });
});
