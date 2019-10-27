import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as batch from '../lib';
import { JobQueueState } from '../lib';

export = {
    'When creating a Batch Job Queue': {
        'with a new compute environment on construction': {
            'should add compute environment resource'(test: Test) {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'compute-vpc');

                // WHEN
                new batch.JobQueue(stack, 'job-queue', {
                    jobQueueName: 'test-job-queue',
                    computeEnvironmentOrder: [
                        {
                            computeEnvironment: new batch.ComputeEnvironment(stack, 'compute-env', {
                                computeResources: {
                                    subnets: vpc.privateSubnets,
                                    instanceRole: new iam.Role(stack, 'compute-role', {
                                        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                                    }),
                                },
                            }),
                            order: 1,
                        },
                    ],
                    priority: 1,
                    state: JobQueueState.DISABLED,
                });

                // THEN
                expect(stack).to(haveResourceLike('AWS::Batch::JobQueue', {
                    JobQueueName: 'test-job-queue',
                    ComputeEnvironmentOrder: [
                        {
                            Order: 1,
                        },
                    ],
                    Priority: 1,
                    State: 'DISABLED',
                }, ResourcePart.Properties));

                expect(stack).to(haveResource('AWS::Batch::ComputeEnvironment'));

                test.done();
            },
            'should be able to get an existing queue by Arn'(test: Test) {
                // GIVEN
                const stack = new cdk.Stack();
                const vpc = new ec2.Vpc(stack, 'compute-vpc');

                // WHEN
                const existingJobQueue = new batch.JobQueue(stack, 'job-queue', {
                    computeEnvironmentOrder: [
                        {
                            computeEnvironment: new batch.ComputeEnvironment(stack, 'compute-env', {
                                computeResources: {
                                    subnets: vpc.privateSubnets,
                                    instanceRole: new iam.Role(stack, 'compute-role', {
                                        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                                    }),
                                },
                            }),
                            order: 1,
                        },
                    ],
                    priority: 1,
                    state: JobQueueState.DISABLED,
                });

                const jobQueueByArn = batch.JobQueue.fromJobQueueArn(stack, 'existing-job-queue', existingJobQueue.jobQueueArn);

                // THEN
                test.equal(jobQueueByArn.jobQueueArn, existingJobQueue.jobQueueArn);

                test.done();
            },
        },
    }
};