import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as batch from '../lib';

export = {
    'with no compute environment provided': {
        'should make a compute environment for you'(test: Test) {
            // GIVEN
            const env = {
                account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION
            };

            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'test-batch-job-queue', { env });

            // WHEN
            new batch.JobQueue(stack, 'job-queue', {
                priority: 1,
                state: batch.JobQueueState.DISABLED,
            });

            // THEN
            expect(stack).to(haveResourceLike('AWS::Batch::JobQueue'));
            expect(stack).to(haveResourceLike('AWS::Batch::ComputeEnvironment'));

            test.done();
        }
    }
};