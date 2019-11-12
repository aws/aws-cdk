import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as batch from '../lib';

describe('When creating a batch job queue', () => {
    describe('with no compute environment provided', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new batch.JobQueue(stack, 'test-job-queue', {
            priority: 1,
            state: batch.JobQueueState.DISABLED,
        });

        // THEN
        expect(stack).toHaveResource('AWS::Batch::JobQueue');
        expect(stack).toHaveResource('AWS::Batch::ComputeEnvironment');
    });

    it('should be possible to create one from a provided ARN', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const existingJobQ = new batch.JobQueue(stack, 'test-job-queue', {
            priority: 1,
            state: batch.JobQueueState.DISABLED,
        });
        const jobQFromArn = batch.JobQueue.fromJobQueueArn(stack, 'test-job-queue-from-arn', existingJobQ.jobQueueArn);

        // THEN
        expect(jobQFromArn.jobQueueArn).toEqual(existingJobQ.jobQueueArn);
    });

    it('should match all specified properties', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const computeEnvironment = new batch.ComputeEnvironment(stack, 'test-compute-env');
        const props: batch.JobQueueProps = {
            priority: 1,
            state: batch.JobQueueState.DISABLED,
            computeEnvironmentOrder: [
                {
                    computeEnvironment,
                    order: 1,
                },
            ],
            jobQueueName: 'test-job-queue-name'
        };
        new batch.JobQueue(stack, 'test-job-queue', props);

        // THEN
        expect(stack).toHaveResourceLike('AWS::Batch::JobQueue', {
            JobQueueName: props.jobQueueName,
            State: props.state,
            Priority: props.priority,
            ComputeEnvironmentOrder: [
                {
                    ComputeEnvironment: {
                        Ref: 'testcomputeenv547FFD1A'
                    },
                    Order: 1,
                }
            ],
        }, ResourcePart.Properties);
    });

    it('should default to level 1 queue priority', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new batch.JobQueue(stack, 'test-job-queue', {
            state: batch.JobQueueState.DISABLED,
        });

        // THEN
        expect(stack).toHaveResourceLike('AWS::Batch::JobQueue', {
            Priority: 1,
        }, ResourcePart.Properties);
    });
});
