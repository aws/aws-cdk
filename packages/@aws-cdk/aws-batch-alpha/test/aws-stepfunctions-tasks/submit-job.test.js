"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const batch = require("../../lib");
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const aws_stepfunctions_tasks_1 = require("aws-cdk-lib/aws-stepfunctions-tasks");
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
test('Task with only the required parameters', () => {
    // WHEN
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobName: 'JobName',
        jobQueueArn: batchJobQueue.jobQueueArn,
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
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobName: 'JobName',
        jobQueueArn: batchJobQueue.jobQueueArn,
        arraySize: 15,
        containerOverrides: {
            command: ['sudo', 'rm'],
            environment: { key: 'value' },
            instanceType: new ec2.InstanceType('MULTI'),
            memory: cdk.Size.mebibytes(1024),
            gpuCount: 1,
            vcpus: 10,
        },
        dependsOn: [{ jobId: '1234', type: 'some_type' }],
        payload: sfn.TaskInput.fromObject({
            foo: sfn.JsonPath.stringAt('$.bar'),
        }),
        attempts: 3,
        taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(60)),
        integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
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
                ResourceRequirements: [{ Type: 'GPU', Value: '1' }, { Type: 'MEMORY', Value: '1024' }, { Type: 'VCPU', Value: '10' }],
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
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobName: sfn.JsonPath.stringAt('$.jobName'),
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobQueueArn: batchJobQueue.jobQueueArn,
        arraySize: sfn.JsonPath.numberAt('$.arraySize'),
        taskTimeout: sfn.Timeout.at('$.timeout'),
        attempts: sfn.JsonPath.numberAt('$.attempts'),
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
test('container overrides are tokens', () => {
    // WHEN
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobName: 'JobName',
        jobQueueArn: batchJobQueue.jobQueueArn,
        containerOverrides: {
            memory: cdk.Size.mebibytes(sfn.JsonPath.numberAt('$.asdf')),
        },
    });
    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
        Type: 'Task',
        Resource: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::batch:submitJob.sync']] },
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
            ContainerOverrides: {
                ResourceRequirements: [{ 'Type': 'MEMORY', 'Value.$': '$.asdf' }],
            },
        },
    });
});
test('supports passing task input into payload', () => {
    // WHEN
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobQueueArn: batchJobQueue.jobQueueArn,
        jobName: sfn.JsonPath.stringAt('$.jobName'),
        payload: sfn.TaskInput.fromJsonPathAt('$.foo'),
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
            'Parameters.$': '$.foo',
        },
    });
});
test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        });
    }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
});
test('Task throws if environment in containerOverrides contain env with name starting with AWS_BATCH', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            containerOverrides: {
                environment: { AWS_BATCH_MY_NAME: 'MY_VALUE' },
            },
        });
    }).toThrow(/Invalid environment variable name: AWS_BATCH_MY_NAME. Environment variable names starting with 'AWS_BATCH' are reserved./);
});
test('Task throws if arraySize is out of limits 2-10000', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            arraySize: 1,
        });
    }).toThrow(/arraySize must be between 2 and 10,000/);
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task2', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            arraySize: 10001,
        });
    }).toThrow(/arraySize must be between 2 and 10,000/);
});
test('Task throws if dependencies exceeds 20', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            dependsOn: [...Array(21).keys()].map(i => ({
                jobId: `${i}`,
                type: `some_type-${i}`,
            })),
        });
    }).toThrow(/dependencies must be 20 or less/);
});
test('Task throws if attempts is out of limits 1-10', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            attempts: 0,
        });
    }).toThrow(/attempts must be between 1 and 10/);
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task2', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            attempts: 11,
        });
    }).toThrow(/attempts must be between 1 and 10/);
});
test('Task throws if attempt duration is less than 60 sec', () => {
    expect(() => {
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(59)),
        });
    }).toThrow(/attempt duration must be greater than 60 seconds./);
});
test('supports passing tags', () => {
    // WHEN
    const task = new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task', {
        jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
        jobQueueArn: batchJobQueue.jobQueueArn,
        jobName: sfn.JsonPath.stringAt('$.jobName'),
        tags: {
            test: 'this is a tag',
        },
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
            'Tags': {
                test: 'this is a tag',
            },
        },
    });
});
test('throws if tags has invalid value', () => {
    expect(() => {
        const tags = {};
        for (let i = 0; i < 100; i++) {
            tags[i] = 'tag';
        }
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task1', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            tags,
        });
    }).toThrow(/Maximum tag number of entries is 50./);
    expect(() => {
        const keyTooLong = 'k'.repeat(150);
        const tags = {};
        tags[keyTooLong] = 'tag';
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task2', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            tags,
        });
    }).toThrow(/Tag key size must be between 1 and 128/);
    expect(() => {
        const tags = { key: 'k'.repeat(300) };
        new aws_stepfunctions_tasks_1.BatchSubmitJob(stack, 'Task3', {
            jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
            jobName: 'JobName',
            jobQueueArn: batchJobQueue.jobQueueArn,
            tags,
        });
    }).toThrow(/Tag value maximum size is 256/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VibWl0LWpvYi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3VibWl0LWpvYi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQyxtQ0FBbUM7QUFDbkMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxxREFBcUQ7QUFDckQsaUZBQXFFO0FBRXJFLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLGtCQUF3QyxDQUFDO0FBQzdDLElBQUksYUFBOEIsQ0FBQztBQUVuQyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsUUFBUTtJQUNSLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUV4QixrQkFBa0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQ3RFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ2pFLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FDMUM7WUFDRCxHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7U0FDakMsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNwRCxtQkFBbUIsRUFBRTtZQUNuQjtnQkFDRSxLQUFLLEVBQUUsQ0FBQztnQkFDUixrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO29CQUNqRixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxL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OEIsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSx3Q0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDakMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsZ0JBQWdCO1lBQ3JELE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxhQUFhLENBQUMsV0FBVztZQUN0QyxJQUFJO1NBQ0wsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNSLHdDQUF3QyxDQUN6QyxDQUFDO0lBRUYsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxJQUFJLHdDQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNqQyxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxnQkFBZ0I7WUFDckQsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO1lBQ3RDLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ1IsK0JBQStCLENBQ2hDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBCYXRjaFN1Ym1pdEpvYiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcblxubGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5sZXQgYmF0Y2hKb2JEZWZpbml0aW9uOiBiYXRjaC5JSm9iRGVmaW5pdGlvbjtcbmxldCBiYXRjaEpvYlF1ZXVlOiBiYXRjaC5JSm9iUXVldWU7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICAvLyBHSVZFTlxuICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBiYXRjaEpvYkRlZmluaXRpb24gPSBuZXcgYmF0Y2guRWNzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0pvYkRlZmluaXRpb24nLCB7XG4gICAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vYmF0Y2hqb2ItaW1hZ2UnKSxcbiAgICAgICksXG4gICAgICBjcHU6IDI1NixcbiAgICAgIG1lbW9yeTogY2RrLlNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgIH0pLFxuICB9KTtcblxuICBiYXRjaEpvYlF1ZXVlID0gbmV3IGJhdGNoLkpvYlF1ZXVlKHN0YWNrLCAnSm9iUXVldWUnLCB7XG4gICAgY29tcHV0ZUVudmlyb25tZW50czogW1xuICAgICAge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgY29tcHV0ZUVudmlyb25tZW50OiBuZXcgYmF0Y2guTWFuYWdlZEVjMkVjc0NvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ0NvbXB1dGVFbnYnLCB7XG4gICAgICAgICAgdnBjOiBuZXcgZWMyLlZwYyhzdGFjaywgJ3ZwYycpLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnVGFzayB3aXRoIG9ubHkgdGhlIHJlcXVpcmVkIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgdGFzayA9IG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHRhc2sudG9TdGF0ZUpzb24oKSkpLnRvRXF1YWwoe1xuICAgIFR5cGU6ICdUYXNrJyxcbiAgICBSZXNvdXJjZToge1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnOnN0YXRlczo6OmJhdGNoOnN1Ym1pdEpvYi5zeW5jJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBFbmQ6IHRydWUsXG4gICAgUGFyYW1ldGVyczoge1xuICAgICAgSm9iRGVmaW5pdGlvbjogeyBSZWY6ICdKb2JEZWZpbml0aW9uMjRGRkUzRUQnIH0sXG4gICAgICBKb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBKb2JRdWV1ZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnSm9iUXVldWVFRTNBRDQ5OScsXG4gICAgICAgICAgJ0pvYlF1ZXVlQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnVGFzayB3aXRoIGFsbCB0aGUgcGFyYW1ldGVycycsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCB0YXNrID0gbmV3IEJhdGNoU3VibWl0Sm9iKHN0YWNrLCAnVGFzaycsIHtcbiAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgYXJyYXlTaXplOiAxNSxcbiAgICBjb250YWluZXJPdmVycmlkZXM6IHtcbiAgICAgIGNvbW1hbmQ6IFsnc3VkbycsICdybSddLFxuICAgICAgZW52aXJvbm1lbnQ6IHsga2V5OiAndmFsdWUnIH0sXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdNVUxUSScpLFxuICAgICAgbWVtb3J5OiBjZGsuU2l6ZS5tZWJpYnl0ZXMoMTAyNCksXG4gICAgICBncHVDb3VudDogMSxcbiAgICAgIHZjcHVzOiAxMCxcbiAgICB9LFxuICAgIGRlcGVuZHNPbjogW3sgam9iSWQ6ICcxMjM0JywgdHlwZTogJ3NvbWVfdHlwZScgfV0sXG4gICAgcGF5bG9hZDogc2ZuLlRhc2tJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgIGZvbzogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmJhcicpLFxuICAgIH0pLFxuICAgIGF0dGVtcHRzOiAzLFxuICAgIHRhc2tUaW1lb3V0OiBzZm4uVGltZW91dC5kdXJhdGlvbihjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCkpLFxuICAgIGludGVncmF0aW9uUGF0dGVybjogc2ZuLkludGVncmF0aW9uUGF0dGVybi5SRVFVRVNUX1JFU1BPTlNFLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHRhc2sudG9TdGF0ZUpzb24oKSkpLnRvRXF1YWwoe1xuICAgIFR5cGU6ICdUYXNrJyxcbiAgICBSZXNvdXJjZToge1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnOnN0YXRlczo6OmJhdGNoOnN1Ym1pdEpvYicsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgRW5kOiB0cnVlLFxuICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgIEpvYkRlZmluaXRpb246IHsgUmVmOiAnSm9iRGVmaW5pdGlvbjI0RkZFM0VEJyB9LFxuICAgICAgSm9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgSm9iUXVldWU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0pvYlF1ZXVlRUUzQUQ0OTknLFxuICAgICAgICAgICdKb2JRdWV1ZUFybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQXJyYXlQcm9wZXJ0aWVzOiB7IFNpemU6IDE1IH0sXG4gICAgICBDb250YWluZXJPdmVycmlkZXM6IHtcbiAgICAgICAgQ29tbWFuZDogWydzdWRvJywgJ3JtJ10sXG4gICAgICAgIEVudmlyb25tZW50OiBbeyBOYW1lOiAna2V5JywgVmFsdWU6ICd2YWx1ZScgfV0sXG4gICAgICAgIEluc3RhbmNlVHlwZTogJ01VTFRJJyxcbiAgICAgICAgUmVzb3VyY2VSZXF1aXJlbWVudHM6IFt7IFR5cGU6ICdHUFUnLCBWYWx1ZTogJzEnIH0sIHsgVHlwZTogJ01FTU9SWScsIFZhbHVlOiAnMTAyNCcgfSwgeyBUeXBlOiAnVkNQVScsIFZhbHVlOiAnMTAnIH1dLFxuICAgICAgfSxcbiAgICAgIERlcGVuZHNPbjogW3sgSm9iSWQ6ICcxMjM0JywgVHlwZTogJ3NvbWVfdHlwZScgfV0sXG4gICAgICBQYXJhbWV0ZXJzOiB7ICdmb28uJCc6ICckLmJhcicgfSxcbiAgICAgIFJldHJ5U3RyYXRlZ3k6IHsgQXR0ZW1wdHM6IDMgfSxcbiAgICAgIFRpbWVvdXQ6IHsgQXR0ZW1wdER1cmF0aW9uU2Vjb25kczogNjAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzdXBwb3J0cyB0b2tlbnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgdGFzayA9IG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgam9iTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmpvYk5hbWUnKSxcbiAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICBhcnJheVNpemU6IHNmbi5Kc29uUGF0aC5udW1iZXJBdCgnJC5hcnJheVNpemUnKSxcbiAgICB0YXNrVGltZW91dDogc2ZuLlRpbWVvdXQuYXQoJyQudGltZW91dCcpLFxuICAgIGF0dGVtcHRzOiBzZm4uSnNvblBhdGgubnVtYmVyQXQoJyQuYXR0ZW1wdHMnKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0YXNrLnRvU3RhdGVKc29uKCkpKS50b0VxdWFsKHtcbiAgICBUeXBlOiAnVGFzaycsXG4gICAgUmVzb3VyY2U6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJzpzdGF0ZXM6OjpiYXRjaDpzdWJtaXRKb2Iuc3luYycsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgRW5kOiB0cnVlLFxuICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICdKb2JEZWZpbml0aW9uJzogeyBSZWY6ICdKb2JEZWZpbml0aW9uMjRGRkUzRUQnIH0sXG4gICAgICAnSm9iTmFtZS4kJzogJyQuam9iTmFtZScsXG4gICAgICAnSm9iUXVldWUnOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdKb2JRdWV1ZUVFM0FENDk5JyxcbiAgICAgICAgICAnSm9iUXVldWVBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdBcnJheVByb3BlcnRpZXMnOiB7XG4gICAgICAgICdTaXplLiQnOiAnJC5hcnJheVNpemUnLFxuICAgICAgfSxcbiAgICAgICdSZXRyeVN0cmF0ZWd5Jzoge1xuICAgICAgICAnQXR0ZW1wdHMuJCc6ICckLmF0dGVtcHRzJyxcbiAgICAgIH0sXG4gICAgICAnVGltZW91dCc6IHtcbiAgICAgICAgJ0F0dGVtcHREdXJhdGlvblNlY29uZHMuJCc6ICckLnRpbWVvdXQnLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjb250YWluZXIgb3ZlcnJpZGVzIGFyZSB0b2tlbnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgdGFzayA9IG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgIGNvbnRhaW5lck92ZXJyaWRlczoge1xuICAgICAgbWVtb3J5OiBjZGsuU2l6ZS5tZWJpYnl0ZXMoc2ZuLkpzb25QYXRoLm51bWJlckF0KCckLmFzZGYnKSksXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0YXNrLnRvU3RhdGVKc29uKCkpKS50b0VxdWFsKHtcbiAgICBUeXBlOiAnVGFzaycsXG4gICAgUmVzb3VyY2U6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnN0YXRlczo6OmJhdGNoOnN1Ym1pdEpvYi5zeW5jJ11dIH0sXG4gICAgRW5kOiB0cnVlLFxuICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgIEpvYkRlZmluaXRpb246IHsgUmVmOiAnSm9iRGVmaW5pdGlvbjI0RkZFM0VEJyB9LFxuICAgICAgSm9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgSm9iUXVldWU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0pvYlF1ZXVlRUUzQUQ0OTknLFxuICAgICAgICAgICdKb2JRdWV1ZUFybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQ29udGFpbmVyT3ZlcnJpZGVzOiB7XG4gICAgICAgIFJlc291cmNlUmVxdWlyZW1lbnRzOiBbeyAnVHlwZSc6ICdNRU1PUlknLCAnVmFsdWUuJCc6ICckLmFzZGYnIH1dLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzdXBwb3J0cyBwYXNzaW5nIHRhc2sgaW5wdXQgaW50byBwYXlsb2FkJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IHRhc2sgPSBuZXcgQmF0Y2hTdWJtaXRKb2Ioc3RhY2ssICdUYXNrJywge1xuICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgIGpvYk5hbWU6IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5qb2JOYW1lJyksXG4gICAgcGF5bG9hZDogc2ZuLlRhc2tJbnB1dC5mcm9tSnNvblBhdGhBdCgnJC5mb28nKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0YXNrLnRvU3RhdGVKc29uKCkpKS50b0VxdWFsKHtcbiAgICBUeXBlOiAnVGFzaycsXG4gICAgUmVzb3VyY2U6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJzpzdGF0ZXM6OjpiYXRjaDpzdWJtaXRKb2Iuc3luYycsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgRW5kOiB0cnVlLFxuICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICdKb2JEZWZpbml0aW9uJzogeyBSZWY6ICdKb2JEZWZpbml0aW9uMjRGRkUzRUQnIH0sXG4gICAgICAnSm9iTmFtZS4kJzogJyQuam9iTmFtZScsXG4gICAgICAnSm9iUXVldWUnOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdKb2JRdWV1ZUVFM0FENDk5JyxcbiAgICAgICAgICAnSm9iUXVldWVBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdQYXJhbWV0ZXJzLiQnOiAnJC5mb28nLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1Rhc2sgdGhyb3dzIGlmIFdBSVRfRk9SX1RBU0tfVE9LRU4gaXMgc3VwcGxpZWQgYXMgc2VydmljZSBpbnRlZ3JhdGlvbiBwYXR0ZXJuJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgaW50ZWdyYXRpb25QYXR0ZXJuOiBzZm4uSW50ZWdyYXRpb25QYXR0ZXJuLldBSVRfRk9SX1RBU0tfVE9LRU4sXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coXG4gICAgL1Vuc3VwcG9ydGVkIHNlcnZpY2UgaW50ZWdyYXRpb24gcGF0dGVybi4gU3VwcG9ydGVkIFBhdHRlcm5zOiBSRVFVRVNUX1JFU1BPTlNFLFJVTl9KT0IuIFJlY2VpdmVkOiBXQUlUX0ZPUl9UQVNLX1RPS0VOLyxcbiAgKTtcbn0pO1xuXG50ZXN0KCdUYXNrIHRocm93cyBpZiBlbnZpcm9ubWVudCBpbiBjb250YWluZXJPdmVycmlkZXMgY29udGFpbiBlbnYgd2l0aCBuYW1lIHN0YXJ0aW5nIHdpdGggQVdTX0JBVENIJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgY29udGFpbmVyT3ZlcnJpZGVzOiB7XG4gICAgICAgIGVudmlyb25tZW50OiB7IEFXU19CQVRDSF9NWV9OQU1FOiAnTVlfVkFMVUUnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KS50b1Rocm93KFxuICAgIC9JbnZhbGlkIGVudmlyb25tZW50IHZhcmlhYmxlIG5hbWU6IEFXU19CQVRDSF9NWV9OQU1FLiBFbnZpcm9ubWVudCB2YXJpYWJsZSBuYW1lcyBzdGFydGluZyB3aXRoICdBV1NfQkFUQ0gnIGFyZSByZXNlcnZlZC4vLFxuICApO1xufSk7XG5cbnRlc3QoJ1Rhc2sgdGhyb3dzIGlmIGFycmF5U2l6ZSBpcyBvdXQgb2YgbGltaXRzIDItMTAwMDAnLCAoKSA9PiB7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IEJhdGNoU3VibWl0Sm9iKHN0YWNrLCAnVGFzaycsIHtcbiAgICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICBhcnJheVNpemU6IDEsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coXG4gICAgL2FycmF5U2l6ZSBtdXN0IGJlIGJldHdlZW4gMiBhbmQgMTAsMDAwLyxcbiAgKTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2syJywge1xuICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIGFycmF5U2l6ZTogMTAwMDEsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coXG4gICAgL2FycmF5U2l6ZSBtdXN0IGJlIGJldHdlZW4gMiBhbmQgMTAsMDAwLyxcbiAgKTtcbn0pO1xuXG50ZXN0KCdUYXNrIHRocm93cyBpZiBkZXBlbmRlbmNpZXMgZXhjZWVkcyAyMCcsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgQmF0Y2hTdWJtaXRKb2Ioc3RhY2ssICdUYXNrJywge1xuICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIGRlcGVuZHNPbjogWy4uLkFycmF5KDIxKS5rZXlzKCldLm1hcChpID0+ICh7XG4gICAgICAgIGpvYklkOiBgJHtpfWAsXG4gICAgICAgIHR5cGU6IGBzb21lX3R5cGUtJHtpfWAsXG4gICAgICB9KSksXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coXG4gICAgL2RlcGVuZGVuY2llcyBtdXN0IGJlIDIwIG9yIGxlc3MvLFxuICApO1xufSk7XG5cbnRlc3QoJ1Rhc2sgdGhyb3dzIGlmIGF0dGVtcHRzIGlzIG91dCBvZiBsaW1pdHMgMS0xMCcsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgQmF0Y2hTdWJtaXRKb2Ioc3RhY2ssICdUYXNrJywge1xuICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIGF0dGVtcHRzOiAwLFxuICAgIH0pO1xuICB9KS50b1Rocm93KFxuICAgIC9hdHRlbXB0cyBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAvLFxuICApO1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IEJhdGNoU3VibWl0Sm9iKHN0YWNrLCAnVGFzazInLCB7XG4gICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgYXR0ZW1wdHM6IDExLFxuICAgIH0pO1xuICB9KS50b1Rocm93KFxuICAgIC9hdHRlbXB0cyBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTAvLFxuICApO1xufSk7XG5cbnRlc3QoJ1Rhc2sgdGhyb3dzIGlmIGF0dGVtcHQgZHVyYXRpb24gaXMgbGVzcyB0aGFuIDYwIHNlYycsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgQmF0Y2hTdWJtaXRKb2Ioc3RhY2ssICdUYXNrJywge1xuICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIHRhc2tUaW1lb3V0OiBzZm4uVGltZW91dC5kdXJhdGlvbihjZGsuRHVyYXRpb24uc2Vjb25kcyg1OSkpLFxuICAgIH0pO1xuICB9KS50b1Rocm93KFxuICAgIC9hdHRlbXB0IGR1cmF0aW9uIG11c3QgYmUgZ3JlYXRlciB0aGFuIDYwIHNlY29uZHMuLyxcbiAgKTtcbn0pO1xuXG50ZXN0KCdzdXBwb3J0cyBwYXNzaW5nIHRhZ3MnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgdGFzayA9IG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2snLCB7XG4gICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgam9iTmFtZTogc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLmpvYk5hbWUnKSxcbiAgICB0YWdzOiB7XG4gICAgICB0ZXN0OiAndGhpcyBpcyBhIHRhZycsXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0YXNrLnRvU3RhdGVKc29uKCkpKS50b0VxdWFsKHtcbiAgICBUeXBlOiAnVGFzaycsXG4gICAgUmVzb3VyY2U6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJzpzdGF0ZXM6OjpiYXRjaDpzdWJtaXRKb2Iuc3luYycsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgRW5kOiB0cnVlLFxuICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICdKb2JEZWZpbml0aW9uJzogeyBSZWY6ICdKb2JEZWZpbml0aW9uMjRGRkUzRUQnIH0sXG4gICAgICAnSm9iTmFtZS4kJzogJyQuam9iTmFtZScsXG4gICAgICAnSm9iUXVldWUnOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdKb2JRdWV1ZUVFM0FENDk5JyxcbiAgICAgICAgICAnSm9iUXVldWVBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdUYWdzJzoge1xuICAgICAgICB0ZXN0OiAndGhpcyBpcyBhIHRhZycsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rocm93cyBpZiB0YWdzIGhhcyBpbnZhbGlkIHZhbHVlJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICB0YWdzW2ldID0gJ3RhZyc7XG4gICAgfVxuICAgIG5ldyBCYXRjaFN1Ym1pdEpvYihzdGFjaywgJ1Rhc2sxJywge1xuICAgICAgam9iRGVmaW5pdGlvbkFybjogYmF0Y2hKb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JOYW1lOiAnSm9iTmFtZScsXG4gICAgICBqb2JRdWV1ZUFybjogYmF0Y2hKb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgIHRhZ3MsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coXG4gICAgL01heGltdW0gdGFnIG51bWJlciBvZiBlbnRyaWVzIGlzIDUwLi8sXG4gICk7XG5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBjb25zdCBrZXlUb29Mb25nID0gJ2snLnJlcGVhdCgxNTApO1xuICAgIGNvbnN0IHRhZ3M6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICB0YWdzW2tleVRvb0xvbmddID0gJ3RhZyc7XG4gICAgbmV3IEJhdGNoU3VibWl0Sm9iKHN0YWNrLCAnVGFzazInLCB7XG4gICAgICBqb2JEZWZpbml0aW9uQXJuOiBiYXRjaEpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYk5hbWU6ICdKb2JOYW1lJyxcbiAgICAgIGpvYlF1ZXVlQXJuOiBiYXRjaEpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgdGFncyxcbiAgICB9KTtcbiAgfSkudG9UaHJvdyhcbiAgICAvVGFnIGtleSBzaXplIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMjgvLFxuICApO1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgY29uc3QgdGFncyA9IHsga2V5OiAnaycucmVwZWF0KDMwMCkgfTtcbiAgICBuZXcgQmF0Y2hTdWJtaXRKb2Ioc3RhY2ssICdUYXNrMycsIHtcbiAgICAgIGpvYkRlZmluaXRpb25Bcm46IGJhdGNoSm9iRGVmaW5pdGlvbi5qb2JEZWZpbml0aW9uQXJuLFxuICAgICAgam9iTmFtZTogJ0pvYk5hbWUnLFxuICAgICAgam9iUXVldWVBcm46IGJhdGNoSm9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICB0YWdzLFxuICAgIH0pO1xuICB9KS50b1Rocm93KFxuICAgIC9UYWcgdmFsdWUgbWF4aW11bSBzaXplIGlzIDI1Ni8sXG4gICk7XG59KTtcbiJdfQ==