import '@aws-cdk/assert/jest';
import { ResourcePart } from '@aws-cdk/assert/lib/assertions/have-resource';
import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { Repository } from '@aws-cdk/aws-ecr';
import { EcrImage, LinuxParameters, MountPoint, Ulimit, Volume } from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');
import batch = require('../lib');

const getJobProps = (scope: cdk.Stack, overrideProps?: batch.JobDefinitionProps): batch.JobDefinitionProps => {
    const jobRepo = new Repository(scope, 'job-repo');

    const role = new iam.Role(scope, 'job-role', {
        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
    });

    const linuxParams = new LinuxParameters(scope, 'job-linux-params', {
        initProcessEnabled: true,
        sharedMemorySize: 1,
    });

    return Object.assign({
        jobDefinitionName: 'test-job',
        containerProps: {
            command: [ 'echo "Hello World"' ],
            environment: {
                foo: 'bar',
            },
            jobRole: role,
            gpuCount: 1,
            image: EcrImage.fromEcrRepository(jobRepo),
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            linuxParams,
            memoryLimitMiB: 1,
            mountPoints: new Array<MountPoint>(),
            privileged: true,
            readOnly: true,
            ulimits: new Array<Ulimit>(),
            user: 'root',
            vcpus: 2,
            volumes: new Array<Volume>(),
        },
        nodeProps: {
            count: 2,
            mainNode: 1,
            rangeProps: new Array<batch.INodeRangeProps>(),
        },
        parameters: {
            foo: 'bar',
        },
        retryAttempts: 2,
        timeout: Duration.seconds(30),
    } as batch.JobDefinitionProps, overrideProps);
};

describe('When creating a Batch Job Definition', () => {
    test('it should match all specified properties', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const jobDefProps = getJobProps(stack);
        new batch.JobDefinition(stack, 'job-def', jobDefProps);

        // THEN
        expect(stack).toHaveResourceLike('AWS::Batch::JobDefinition', {
            JobDefinitionName: jobDefProps.jobDefinitionName,
            ContainerProperties: jobDefProps.containerProps ? {
                Command: jobDefProps.containerProps.command,
                Environment: [
                    {
                        Name: 'foo',
                        Value: 'bar',
                    },
                ],
                InstanceType: jobDefProps.containerProps.instanceType.toString(),
                LinuxParameters: {},
                Memory: jobDefProps.containerProps.memoryLimitMiB,
                MountPoints: [],
                Privileged: jobDefProps.containerProps.privileged,
                ReadonlyRootFilesystem: jobDefProps.containerProps.readOnly,
                Ulimits: [],
                User: jobDefProps.containerProps.user,
                Vcpus: jobDefProps.containerProps.vcpus,
                Volumes: [],
            } : undefined,
            NodeProperties: jobDefProps.nodeProps ? {
                MainNode: jobDefProps.nodeProps.mainNode,
                NodeRangeProperties: [],
                NumNodes: jobDefProps.nodeProps.count,
            } : undefined,
            Parameters: {
                foo: 'bar',
            },
            RetryStrategy: {
                Attempts: jobDefProps.retryAttempts,
            },
            Timeout: {
                AttemptDurationSeconds: jobDefProps.timeout ? jobDefProps.timeout.toSeconds() : -1,
            },
            Type: 'container',
        }, ResourcePart.Properties);
    });

    test('it should be possible to create one from an ARN', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const jobDefProps = getJobProps(stack);
        const existingJob = new batch.JobDefinition(stack, 'job-def', jobDefProps);
        const job = batch.JobDefinition.fromJobDefinitionArn(stack, 'job-def-clone', existingJob.jobDefinitionArn);

        // THEN
        expect(job.jobDefinitionArn).toEqual(existingJob.jobDefinitionArn);
    });
});
