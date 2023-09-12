"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch = require("../../lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const events = require("aws-cdk-lib/aws-events");
const targets = require("aws-cdk-lib/aws-events-targets");
const sqs = require("aws-cdk-lib/aws-sqs");
describe('Batch job event target', () => {
    let stack;
    let jobQueue;
    let jobDefinition;
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        jobQueue = new batch.JobQueue(stack, 'MyQueue', {
            computeEnvironments: [
                {
                    computeEnvironment: new batch.UnmanagedComputeEnvironment(stack, 'ComputeEnvironment'),
                    order: 1,
                },
            ],
        });
        jobDefinition = new batch.EcsJobDefinition(stack, 'MyJob', {
            container: new batch.EcsEc2ContainerDefinition(stack, 'container', {
                image: aws_ecs_1.ContainerImage.fromRegistry('test-repo'),
                cpu: 256,
                memory: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
        });
    });
    test('use aws batch job as an event rule target', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 min)'),
        });
        // WHEN
        rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            ScheduleExpression: 'rate(1 min)',
            State: 'ENABLED',
            Targets: [
                {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'JobQueueArn',
                        ],
                    },
                    Id: 'Target0',
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyJobEventsRoleCF43C336',
                            'Arn',
                        ],
                    },
                    BatchParameters: {
                        JobDefinition: {
                            Ref: 'MyJob8719E923',
                        },
                        JobName: 'Rule',
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'batch:SubmitJob',
                        Effect: 'Allow',
                        Resource: [
                            { Ref: 'MyJob8719E923' },
                            {
                                'Fn::GetAtt': [
                                    'MyQueueE6CA6235',
                                    'JobQueueArn',
                                ],
                            },
                        ],
                    },
                ],
                Version: '2012-10-17',
            },
            Roles: [
                { Ref: 'MyJobEventsRoleCF43C336' },
            ],
        });
    });
    test('use a Dead Letter Queue for the rule target', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        const queue = new sqs.Queue(stack, 'Queue');
        // WHEN
        const eventInput = {
            buildspecOverride: 'buildspecs/hourly.yml',
        };
        rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition, {
            deadLetterQueue: queue,
            event: events.RuleTargetInput.fromObject(eventInput),
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'JobQueueArn',
                        ],
                    },
                    Id: 'Target0',
                    DeadLetterConfig: {
                        Arn: {
                            'Fn::GetAtt': [
                                'Queue4A7E3555',
                                'Arn',
                            ],
                        },
                    },
                    Input: JSON.stringify(eventInput),
                    RoleArn: {
                        'Fn::GetAtt': ['MyJobEventsRoleCF43C336', 'Arn'],
                    },
                    BatchParameters: {
                        JobDefinition: {
                            Ref: 'MyJob8719E923',
                        },
                        JobName: 'Rule',
                    },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sqs:SendMessage',
                        Condition: {
                            ArnEquals: {
                                'aws:SourceArn': {
                                    'Fn::GetAtt': [
                                        'Rule4C995B7F',
                                        'Arn',
                                    ],
                                },
                            },
                        },
                        Effect: 'Allow',
                        Principal: {
                            Service: 'events.amazonaws.com',
                        },
                        Resource: {
                            'Fn::GetAtt': [
                                'Queue4A7E3555',
                                'Arn',
                            ],
                        },
                        Sid: 'AllowEventRuleRule',
                    },
                ],
                Version: '2012-10-17',
            },
            Queues: [
                {
                    Ref: 'Queue4A7E3555',
                },
            ],
        });
    });
    test('specifying retry policy', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        const queue = new sqs.Queue(stack, 'Queue');
        // WHEN
        const eventInput = {
            buildspecOverride: 'buildspecs/hourly.yml',
        };
        rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition, {
            deadLetterQueue: queue,
            event: events.RuleTargetInput.fromObject(eventInput),
            retryAttempts: 2,
            maxEventAge: aws_cdk_lib_1.Duration.hours(2),
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            ScheduleExpression: 'rate(1 hour)',
            State: 'ENABLED',
            Targets: [
                {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'JobQueueArn',
                        ],
                    },
                    BatchParameters: {
                        JobDefinition: {
                            Ref: 'MyJob8719E923',
                        },
                        JobName: 'Rule',
                    },
                    DeadLetterConfig: {
                        Arn: {
                            'Fn::GetAtt': [
                                'Queue4A7E3555',
                                'Arn',
                            ],
                        },
                    },
                    Id: 'Target0',
                    Input: JSON.stringify(eventInput),
                    RetryPolicy: {
                        MaximumEventAgeInSeconds: 7200,
                        MaximumRetryAttempts: 2,
                    },
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyJobEventsRoleCF43C336',
                            'Arn',
                        ],
                    },
                },
            ],
        });
    });
    test('specifying retry policy with 0 retryAttempts', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        // WHEN
        const eventInput = {
            buildspecOverride: 'buildspecs/hourly.yml',
        };
        rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition, {
            event: events.RuleTargetInput.fromObject(eventInput),
            retryAttempts: 0,
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            ScheduleExpression: 'rate(1 hour)',
            State: 'ENABLED',
            Targets: [
                {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'JobQueueArn',
                        ],
                    },
                    BatchParameters: {
                        JobDefinition: {
                            Ref: 'MyJob8719E923',
                        },
                        JobName: 'Rule',
                    },
                    Id: 'Target0',
                    Input: JSON.stringify(eventInput),
                    RetryPolicy: {
                        MaximumRetryAttempts: 0,
                    },
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyJobEventsRoleCF43C336',
                            'Arn',
                        ],
                    },
                },
            ],
        });
    });
    test('should validate jobName minimum and maximum length', () => {
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 min)'),
        });
        expect(() => {
            rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition, {
                jobName: '',
            }));
        }).toThrowError(/must have length between 1 and 128/);
        expect(() => {
            rule.addTarget(new targets.BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition, {
                jobName: 'a'.repeat(200),
            }));
        }).toThrowError(/must have length between 1 and 128/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2gudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhdGNoLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsNkNBQW9EO0FBQ3BELHVEQUFrRDtBQUNsRCxpREFBcUQ7QUFDckQsaURBQWlEO0FBQ2pELDBEQUEwRDtBQUMxRCwyQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLEtBQVksQ0FBQztJQUNqQixJQUFJLFFBQXlCLENBQUM7SUFDOUIsSUFBSSxhQUFtQyxDQUFDO0lBRXhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxtQkFBSyxFQUFFLENBQUM7UUFDcEIsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQzlDLG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxrQkFBa0IsRUFBRSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUM7b0JBQ3RGLEtBQUssRUFBRSxDQUFDO2lCQUNUO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUN6RCxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtnQkFDakUsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDL0MsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUM3QixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFD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QUFhLEVBQ2I7Z0JBQ0UsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ3pCLENBQ0YsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGJhdGNoIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU2l6ZSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWV2ZW50cy10YXJnZXRzJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcblxuZGVzY3JpYmUoJ0JhdGNoIGpvYiBldmVudCB0YXJnZXQnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG4gIGxldCBqb2JRdWV1ZTogYmF0Y2guSUpvYlF1ZXVlO1xuICBsZXQgam9iRGVmaW5pdGlvbjogYmF0Y2guSUpvYkRlZmluaXRpb247XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBqb2JRdWV1ZSA9IG5ldyBiYXRjaC5Kb2JRdWV1ZShzdGFjaywgJ015UXVldWUnLCB7XG4gICAgICBjb21wdXRlRW52aXJvbm1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb21wdXRlRW52aXJvbm1lbnQ6IG5ldyBiYXRjaC5Vbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdDb21wdXRlRW52aXJvbm1lbnQnKSxcbiAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgam9iRGVmaW5pdGlvbiA9IG5ldyBiYXRjaC5FY3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnTXlKb2InLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBiYXRjaC5FY3NFYzJDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnY29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0LXJlcG8nKSxcbiAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgIG1lbW9yeTogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlIGF3cyBiYXRjaCBqb2IgYXMgYW4gZXZlbnQgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIG1pbiknKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihqb2JRdWV1ZS5qb2JRdWV1ZUFybiwgam9iUXVldWUsIGpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybiwgam9iRGVmaW5pdGlvbikpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBtaW4pJyxcbiAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgJ0pvYlF1ZXVlQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlKb2JFdmVudHNSb2xlQ0Y0M0MzMzYnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCYXRjaFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIEpvYkRlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgUmVmOiAnTXlKb2I4NzE5RTkyMycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSm9iTmFtZTogJ1J1bGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdiYXRjaDpTdWJtaXRKb2InLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAgeyBSZWY6ICdNeUpvYjg3MTlFOTIzJyB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgICAgICdKb2JRdWV1ZUFybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHsgUmVmOiAnTXlKb2JFdmVudHNSb2xlQ0Y0M0MzMzYnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1c2UgYSBEZWFkIExldHRlciBRdWV1ZSBmb3IgdGhlIHJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBob3VyKScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iUXVldWUsXG4gICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JEZWZpbml0aW9uLCB7XG4gICAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogcXVldWUsXG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICB9LFxuICAgICkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnSm9iUXVldWVBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJbnB1dDogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbnB1dCksXG4gICAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015Sm9iRXZlbnRzUm9sZUNGNDNDMzM2JywgJ0FybiddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQmF0Y2hQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBKb2JEZWZpbml0aW9uOiB7XG4gICAgICAgICAgICAgIFJlZjogJ015Sm9iODcxOUU5MjMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEpvYk5hbWU6ICdSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNRUzo6UXVldWVQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIEFybkVxdWFsczoge1xuICAgICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdSdWxlNEM5OTVCN0YnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2V2ZW50cy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnUXVldWU0QTdFMzU1NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2lkOiAnQWxsb3dFdmVudFJ1bGVSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUXVldWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnlpbmcgcmV0cnkgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBob3VyKScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iUXVldWUsXG4gICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JEZWZpbml0aW9uLCB7XG4gICAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogcXVldWUsXG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyKSxcbiAgICAgIH0sXG4gICAgKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIGhvdXIpJyxcbiAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgJ0pvYlF1ZXVlQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCYXRjaFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIEpvYkRlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgUmVmOiAnTXlKb2I4NzE5RTkyMycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSm9iTmFtZTogJ1J1bGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiBKU09OLnN0cmluZ2lmeShldmVudElucHV0KSxcbiAgICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgICAgTWF4aW11bUV2ZW50QWdlSW5TZWNvbmRzOiA3MjAwLFxuICAgICAgICAgICAgTWF4aW11bVJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015Sm9iRXZlbnRzUm9sZUNGNDNDMzM2JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzcGVjaWZ5aW5nIHJldHJ5IHBvbGljeSB3aXRoIDAgcmV0cnlBdHRlbXB0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgaG91ciknKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iUXVldWUsXG4gICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JEZWZpbml0aW9uLCB7XG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IDAsXG4gICAgICB9LFxuICAgICkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBob3VyKScsXG4gICAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdKb2JRdWV1ZUFybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQmF0Y2hQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBKb2JEZWZpbml0aW9uOiB7XG4gICAgICAgICAgICAgIFJlZjogJ015Sm9iODcxOUU5MjMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEpvYk5hbWU6ICdSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgSW5wdXQ6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5wdXQpLFxuICAgICAgICAgIFJldHJ5UG9saWN5OiB7XG4gICAgICAgICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlKb2JFdmVudHNSb2xlQ0Y0M0MzMzYnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCB2YWxpZGF0ZSBqb2JOYW1lIG1pbmltdW0gYW5kIG1heGltdW0gbGVuZ3RoJywgKCkgPT4ge1xuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KFxuICAgICAgICBuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgICAgICBqb2JRdWV1ZS5qb2JRdWV1ZUFybixcbiAgICAgICAgICBqb2JRdWV1ZSxcbiAgICAgICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICAgICAgam9iRGVmaW5pdGlvbixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBqb2JOYW1lOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KS50b1Rocm93RXJyb3IoL211c3QgaGF2ZSBsZW5ndGggYmV0d2VlbiAxIGFuZCAxMjgvKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcnVsZS5hZGRUYXJnZXQoXG4gICAgICAgIG5ldyB0YXJnZXRzLkJhdGNoSm9iKFxuICAgICAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgICAgIGpvYlF1ZXVlLFxuICAgICAgICAgIGpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgICAgICBqb2JEZWZpbml0aW9uLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGpvYk5hbWU6ICdhJy5yZXBlYXQoMjAwKSxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KS50b1Rocm93RXJyb3IoL211c3QgaGF2ZSBsZW5ndGggYmV0d2VlbiAxIGFuZCAxMjgvKTtcbiAgfSk7XG59KTtcbiJdfQ==