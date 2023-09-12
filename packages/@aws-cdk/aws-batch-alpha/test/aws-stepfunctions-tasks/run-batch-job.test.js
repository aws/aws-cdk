"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("../../lib");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
let stack;
let batchJobDefinition;
let batchJobQueue;
beforeEach(() => {
    // GIVEN
    stack = new cdk.Stack();
    batchJobDefinition = new batch.EcsJobDefinition(stack, 'JobDefinition', {
        container: new batch.EcsEc2ContainerDefinition(stack, 'Container', {
            image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../batchjob-image')),
            cpu: 256,
            memory: cdk.Size.mebibytes(2048),
        }),
    });
    batchJobQueue = new batch.JobQueue(stack, 'JobQueue', {
        computeEnvironments: [
            {
                order: 1,
                computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'ComputeEnv', {
                    vpc: new ec2.Vpc(stack, 'vpc'),
                }),
            },
        ],
    });
});
(0, cdk_build_tools_1.describeDeprecated)('RunBatchJob', () => {
    test('Task with only the required parameters', () => {
        // WHEN
        const task = new sfn.Task(stack, 'Task', {
            task: new tasks.RunBatchJob({
                jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                jobName: 'JobName',
                jobQueueArn: batchJobQueue.jobQueueArn,
            }),
        });
        // THEN
        expect(stack.resolve(task.toStateJson())).toEqual({
            Type: 'Task',
            Resource: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':states:::batch:submitJob.sync',
                    ],
                ],
            },
            End: true,
            Parameters: {
                JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
                JobName: 'JobName',
                JobQueue: {
                    'Fn::GetAtt': [
                        'JobQueueEE3AD499',
                        'JobQueueArn',
                    ],
                },
            },
        });
    });
    test('Task with all the parameters', () => {
        // WHEN
        const task = new sfn.Task(stack, 'Task', {
            task: new tasks.RunBatchJob({
                jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                jobName: 'JobName',
                jobQueueArn: batchJobQueue.jobQueueArn,
                arraySize: 15,
                containerOverrides: {
                    command: ['sudo', 'rm'],
                    environment: { key: 'value' },
                    instanceType: new ec2.InstanceType('MULTI'),
                    memory: 1024,
                    gpuCount: 1,
                    vcpus: 10,
                },
                dependsOn: [{ jobId: '1234', type: 'some_type' }],
                payload: {
                    foo: sfn.JsonPath.stringAt('$.bar'),
                },
                attempts: 3,
                timeout: cdk.Duration.seconds(60),
                integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
            }),
        });
        // THEN
        expect(stack.resolve(task.toStateJson())).toEqual({
            Type: 'Task',
            Resource: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':states:::batch:submitJob',
                    ],
                ],
            },
            End: true,
            Parameters: {
                JobDefinition: { Ref: 'JobDefinition24FFE3ED' },
                JobName: 'JobName',
                JobQueue: {
                    'Fn::GetAtt': [
                        'JobQueueEE3AD499',
                        'JobQueueArn',
                    ],
                },
                ArrayProperties: { Size: 15 },
                ContainerOverrides: {
                    Command: ['sudo', 'rm'],
                    Environment: [{ Name: 'key', Value: 'value' }],
                    InstanceType: 'MULTI',
                    Memory: 1024,
                    ResourceRequirements: [{ Type: 'GPU', Value: '1' }],
                    Vcpus: 10,
                },
                DependsOn: [{ JobId: '1234', Type: 'some_type' }],
                Parameters: { 'foo.$': '$.bar' },
                RetryStrategy: { Attempts: 3 },
                Timeout: { AttemptDurationSeconds: 60 },
            },
        });
    });
    test('supports tokens', () => {
        // WHEN
        const task = new sfn.Task(stack, 'Task', {
            task: new tasks.RunBatchJob({
                jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                jobQueueArn: batchJobQueue.jobQueueArn,
                jobName: sfn.JsonPath.stringAt('$.jobName'),
                arraySize: sfn.JsonPath.numberAt('$.arraySize'),
                timeout: cdk.Duration.seconds(sfn.JsonPath.numberAt('$.timeout')),
                attempts: sfn.JsonPath.numberAt('$.attempts'),
            }),
        });
        // THEN
        expect(stack.resolve(task.toStateJson())).toEqual({
            Type: 'Task',
            Resource: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':states:::batch:submitJob.sync',
                    ],
                ],
            },
            End: true,
            Parameters: {
                'JobDefinition': { Ref: 'JobDefinition24FFE3ED' },
                'JobName.$': '$.jobName',
                'JobQueue': {
                    'Fn::GetAtt': [
                        'JobQueueEE3AD499',
                        'JobQueueArn',
                    ],
                },
                'ArrayProperties': {
                    'Size.$': '$.arraySize',
                },
                'RetryStrategy': {
                    'Attempts.$': '$.attempts',
                },
                'Timeout': {
                    'AttemptDurationSeconds.$': '$.timeout',
                },
            },
        });
    });
    test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
                }),
            });
        }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call RunBatchJob./i);
    });
    test('Task throws if environment in containerOverrides contain env with name starting with AWS_BATCH', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    containerOverrides: {
                        environment: { AWS_BATCH_MY_NAME: 'MY_VALUE' },
                    },
                }),
            });
        }).toThrow(/Invalid environment variable name: AWS_BATCH_MY_NAME. Environment variable names starting with 'AWS_BATCH' are reserved./i);
    });
    test('Task throws if arraySize is out of limits 2-10000', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    arraySize: 1,
                }),
            });
        }).toThrow(/arraySize must be between 2 and 10,000/);
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    arraySize: 10001,
                }),
            });
        }).toThrow(/arraySize must be between 2 and 10,000/);
    });
    test('Task throws if dependencies exceeds 20', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    dependsOn: [...Array(21).keys()].map(i => ({
                        jobId: `${i}`,
                        type: `some_type-${i}`,
                    })),
                }),
            });
        }).toThrow(/dependencies must be 20 or less/);
    });
    test('Task throws if attempts is out of limits 1-10', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    attempts: 0,
                }),
            });
        }).toThrow(/attempts must be between 1 and 10/);
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    attempts: 11,
                }),
            });
        }).toThrow(/attempts must be between 1 and 10/);
    });
    test('Task throws if timeout is less than 60 sec', () => {
        expect(() => {
            new sfn.Task(stack, 'Task', {
                task: new tasks.RunBatchJob({
                    jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
                    jobName: 'JobName',
                    jobQueueArn: batchJobQueue.jobQueueArn,
                    timeout: cdk.Duration.seconds(59),
                }),
            });
        }).toThrow(/timeout must be greater than 60 seconds/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLWJhdGNoLWpvYi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVuLWJhdGNoLWpvYi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQyw4REFBOEQ7QUFDOUQsbUNBQW1DO0FBQ25DLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELDZEQUE2RDtBQUU3RCxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxrQkFBd0MsQ0FBQztBQUM3QyxJQUFJLGFBQThCLENBQUM7QUFFbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLFFBQVE7SUFDUixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFeEIsa0JBQWtCLEdBQUcsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtRQUN0RSxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNqRSxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQzFDO1lBQ0QsR0FBRyxFQUFFLEdBQUc7WUFDUixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQ2pDLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDcEQsbUJBQW1CLEVBQUU7WUFDbkI7Z0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1Isa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtvQkFDakYsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLEdB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UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ1IsbUNBQW1DLENBQ3BDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUMxQixJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDO29CQUMxQixnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxnQkFBZ0I7b0JBQ3JELE9BQU8sRUFBRSxTQUFTO29CQUNsQixXQUFXLEVBQUUsYUFBYSxDQUFDLFdBQVc7b0JBQ3RDLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7aUJBQ2xDLENBQUM7YUFDSCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ1IseUNBQXlDLENBQzFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGJhdGNoIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBkZXNjcmliZURlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgKiBhcyB0YXNrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrcyc7XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xubGV0IGJhdGNoSm9iRGVmaW5pdGlvbjogYmF0Y2guSUpvYkRlZmluaXRpb247XG5sZXQgYmF0Y2hKb2JRdWV1ZTogYmF0Y2guSUpvYlF1ZXVlO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgLy8gR0lWRU5cbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgYmF0Y2hKb2JEZWZpbml0aW9uID0gbmV3IGJhdGNoLkVjc0pvYkRlZmluaXRpb24oc3RhY2ssICdKb2JEZWZpbml0aW9uJywge1xuICAgIGNvbnRhaW5lcjogbmV3IGJhdGNoLkVjc0VjMkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdDb250YWluZXInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2JhdGNoam9iLWltYWdlJyksXG4gICAgICApLFxuICAgICAgY3B1OiAyNTYsXG4gICAgICBtZW1vcnk6IGNkay5TaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgYmF0Y2hKb2JRdWV1ZSA9IG5ldyBiYXRjaC5Kb2JRdWV1ZShzdGFjaywgJ0pvYlF1ZXVlJywge1xuICAgIGNvbXB1dGVFbnZpcm9ubWVudHM6IFtcbiAgICAgIHtcbiAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIGNvbXB1dGVFbnZpcm9ubWVudDogbmV3IGJhdGNoLk1hbmFnZWRFYzJFY3NDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdDb21wdXRlRW52Jywge1xuICAgICAgICAgIHZwYzogbmV3IGVjMi5WcGMoc3RhY2ssICd2cGMnKSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgnUnVuQmF0Y2hKb2InLCAoKSA9PiB7XG4gIHRlc3QoJ1Rhc2sgd2l0aCBvbmx5IHRoZSByZXF1aXJlZCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gICAgY29uc3QgdGFzayA9IG5ldyBzZm4uVGFzayhzdGFjaywgJ1Rhc2snLCB7XG4gICAgICB0YXNrOiBuZXcgdGFza3MuUnVuQmF0Y2hKb2Ioe1xuICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHRhc2sudG9TdGF0ZUpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6c3RhdGVzOjo6YmF0Y2g6c3VibWl0Sm9iLnN5bmMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRW5kOiB0cnVlLFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBKb2JEZWZpbml0aW9uOiB7IFJlZjogJ0pvYkRlZmluaXRpb24yNEZGRTNFRCcgfSxcbiAgICAgICAgSm9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgICBKb2JRdWV1ZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0pvYlF1ZXVlRUUzQUQ0OTknLFxuICAgICAgICAgICAgJ0pvYlF1ZXVlQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnVGFzayB3aXRoIGFsbCB0aGUgcGFyYW1ldGVycycsICgpID0+IHtcbiAgLy8gV0hFTlxuICAgIGNvbnN0IHRhc2sgPSBuZXcgc2ZuLlRhc2soc3RhY2ssICdUYXNrJywge1xuICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgIGpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgIGFycmF5U2l6ZTogMTUsXG4gICAgICAgIGNvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgICAgIGNvbW1hbmQ6IFsnc3VkbycsICdybSddLFxuICAgICAgICAgIGVudmlyb25tZW50OiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ01VTFRJJyksXG4gICAgICAgICAgbWVtb3J5OiAxMDI0LFxuICAgICAgICAgIGdwdUNvdW50OiAxLFxuICAgICAgICAgIHZjcHVzOiAxMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGVwZW5kc09uOiBbeyBqb2JJZDogJzEyMzQnLCB0eXBlOiAnc29tZV90eXBlJyB9XSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIGZvbzogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmJhcicpLFxuICAgICAgICB9LFxuICAgICAgICBhdHRlbXB0czogMyxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjApLFxuICAgICAgICBpbnRlZ3JhdGlvblBhdHRlcm46IHNmbi5TZXJ2aWNlSW50ZWdyYXRpb25QYXR0ZXJuLkZJUkVfQU5EX0ZPUkdFVCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHRhc2sudG9TdGF0ZUpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6c3RhdGVzOjo6YmF0Y2g6c3VibWl0Sm9iJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEVuZDogdHJ1ZSxcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgSm9iRGVmaW5pdGlvbjogeyBSZWY6ICdKb2JEZWZpbml0aW9uMjRGRkUzRUQnIH0sXG4gICAgICAgIEpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgICAgSm9iUXVldWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdKb2JRdWV1ZUVFM0FENDk5JyxcbiAgICAgICAgICAgICdKb2JRdWV1ZUFybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgQXJyYXlQcm9wZXJ0aWVzOiB7IFNpemU6IDE1IH0sXG4gICAgICAgIENvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgICAgIENvbW1hbmQ6IFsnc3VkbycsICdybSddLFxuICAgICAgICAgIEVudmlyb25tZW50OiBbeyBOYW1lOiAna2V5JywgVmFsdWU6ICd2YWx1ZScgfV0sXG4gICAgICAgICAgSW5zdGFuY2VUeXBlOiAnTVVMVEknLFxuICAgICAgICAgIE1lbW9yeTogMTAyNCxcbiAgICAgICAgICBSZXNvdXJjZVJlcXVpcmVtZW50czogW3sgVHlwZTogJ0dQVScsIFZhbHVlOiAnMScgfV0sXG4gICAgICAgICAgVmNwdXM6IDEwLFxuICAgICAgICB9LFxuICAgICAgICBEZXBlbmRzT246IFt7IEpvYklkOiAnMTIzNCcsIFR5cGU6ICdzb21lX3R5cGUnIH1dLFxuICAgICAgICBQYXJhbWV0ZXJzOiB7ICdmb28uJCc6ICckLmJhcicgfSxcbiAgICAgICAgUmV0cnlTdHJhdGVneTogeyBBdHRlbXB0czogMyB9LFxuICAgICAgICBUaW1lb3V0OiB7IEF0dGVtcHREdXJhdGlvblNlY29uZHM6IDYwIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyB0b2tlbnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgICBjb25zdCB0YXNrID0gbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgIHRhc2s6IG5ldyB0YXNrcy5SdW5CYXRjaEpvYih7XG4gICAgICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgICAgam9iTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmpvYk5hbWUnKSxcbiAgICAgICAgYXJyYXlTaXplOiBzZm4uSnNvblBhdGgubnVtYmVyQXQoJyQuYXJyYXlTaXplJyksXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKHNmbi5Kc29uUGF0aC5udW1iZXJBdCgnJC50aW1lb3V0JykpLFxuICAgICAgICBhdHRlbXB0czogc2ZuLkpzb25QYXRoLm51bWJlckF0KCckLmF0dGVtcHRzJyksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0YXNrLnRvU3RhdGVKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnN0YXRlczo6OmJhdGNoOnN1Ym1pdEpvYi5zeW5jJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEVuZDogdHJ1ZSxcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgJ0pvYkRlZmluaXRpb24nOiB7IFJlZjogJ0pvYkRlZmluaXRpb24yNEZGRTNFRCcgfSxcbiAgICAgICAgJ0pvYk5hbWUuJCc6ICckLmpvYk5hbWUnLFxuICAgICAgICAnSm9iUXVldWUnOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnSm9iUXVldWVFRTNBRDQ5OScsXG4gICAgICAgICAgICAnSm9iUXVldWVBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdBcnJheVByb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1NpemUuJCc6ICckLmFycmF5U2l6ZScsXG4gICAgICAgIH0sXG4gICAgICAgICdSZXRyeVN0cmF0ZWd5Jzoge1xuICAgICAgICAgICdBdHRlbXB0cy4kJzogJyQuYXR0ZW1wdHMnLFxuICAgICAgICB9LFxuICAgICAgICAnVGltZW91dCc6IHtcbiAgICAgICAgICAnQXR0ZW1wdER1cmF0aW9uU2Vjb25kcy4kJzogJyQudGltZW91dCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdUYXNrIHRocm93cyBpZiBXQUlUX0ZPUl9UQVNLX1RPS0VOIGlzIHN1cHBsaWVkIGFzIHNlcnZpY2UgaW50ZWdyYXRpb24gcGF0dGVybicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgaW50ZWdyYXRpb25QYXR0ZXJuOiBzZm4uU2VydmljZUludGVncmF0aW9uUGF0dGVybi5XQUlUX0ZPUl9UQVNLX1RPS0VOLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAvSW52YWxpZCBTZXJ2aWNlIEludGVncmF0aW9uIFBhdHRlcm46IFdBSVRfRk9SX1RBU0tfVE9LRU4gaXMgbm90IHN1cHBvcnRlZCB0byBjYWxsIFJ1bkJhdGNoSm9iLi9pLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rhc2sgdGhyb3dzIGlmIGVudmlyb25tZW50IGluIGNvbnRhaW5lck92ZXJyaWRlcyBjb250YWluIGVudiB3aXRoIG5hbWUgc3RhcnRpbmcgd2l0aCBBV1NfQkFUQ0gnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzZm4uVGFzayhzdGFjaywgJ1Rhc2snLCB7XG4gICAgICAgIHRhc2s6IG5ldyB0YXNrcy5SdW5CYXRjaEpvYih7XG4gICAgICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgICAgIGNvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHsgQVdTX0JBVENIX01ZX05BTUU6ICdNWV9WQUxVRScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAvSW52YWxpZCBlbnZpcm9ubWVudCB2YXJpYWJsZSBuYW1lOiBBV1NfQkFUQ0hfTVlfTkFNRS4gRW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZXMgc3RhcnRpbmcgd2l0aCAnQVdTX0JBVENIJyBhcmUgcmVzZXJ2ZWQuL2ksXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnVGFzayB0aHJvd3MgaWYgYXJyYXlTaXplIGlzIG91dCBvZiBsaW1pdHMgMi0xMDAwMCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgYXJyYXlTaXplOiAxLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAvYXJyYXlTaXplIG11c3QgYmUgYmV0d2VlbiAyIGFuZCAxMCwwMDAvLFxuICAgICk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgYXJyYXlTaXplOiAxMDAwMSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgL2FycmF5U2l6ZSBtdXN0IGJlIGJldHdlZW4gMiBhbmQgMTAsMDAwLyxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdUYXNrIHRocm93cyBpZiBkZXBlbmRlbmNpZXMgZXhjZWVkcyAyMCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgZGVwZW5kc09uOiBbLi4uQXJyYXkoMjEpLmtleXMoKV0ubWFwKGkgPT4gKHtcbiAgICAgICAgICAgIGpvYklkOiBgJHtpfWAsXG4gICAgICAgICAgICB0eXBlOiBgc29tZV90eXBlLSR7aX1gLFxuICAgICAgICAgIH0pKSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgL2RlcGVuZGVuY2llcyBtdXN0IGJlIDIwIG9yIGxlc3MvLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rhc2sgdGhyb3dzIGlmIGF0dGVtcHRzIGlzIG91dCBvZiBsaW1pdHMgMS0xMCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgYXR0ZW1wdHM6IDAsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgIC9hdHRlbXB0cyBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAvLFxuICAgICk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHNmbi5UYXNrKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgICAgdGFzazogbmV3IHRhc2tzLlJ1bkJhdGNoSm9iKHtcbiAgICAgICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICAgICAgYXR0ZW1wdHM6IDExLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAvYXR0ZW1wdHMgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEwLyxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdUYXNrIHRocm93cyBpZiB0aW1lb3V0IGlzIGxlc3MgdGhhbiA2MCBzZWMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzZm4uVGFzayhzdGFjaywgJ1Rhc2snLCB7XG4gICAgICAgIHRhc2s6IG5ldyB0YXNrcy5SdW5CYXRjaEpvYih7XG4gICAgICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDU5KSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgL3RpbWVvdXQgbXVzdCBiZSBncmVhdGVyIHRoYW4gNjAgc2Vjb25kcy8sXG4gICAgKTtcbiAgfSk7XG59KTsiXX0=