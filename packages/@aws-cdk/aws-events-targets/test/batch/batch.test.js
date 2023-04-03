"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const batch = require("@aws-cdk/aws-batch");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
describe('Batch job event target', () => {
    let stack;
    let jobQueue;
    let jobDefinition;
    beforeEach(() => {
        stack = new core_1.Stack();
        jobQueue = new batch.JobQueue(stack, 'MyQueue', {
            computeEnvironments: [
                {
                    computeEnvironment: new batch.ComputeEnvironment(stack, 'ComputeEnvironment', {
                        managed: false,
                    }),
                    order: 1,
                },
            ],
        });
        jobDefinition = new batch.JobDefinition(stack, 'MyJob', {
            container: {
                image: aws_ecs_1.ContainerImage.fromRegistry('test-repo'),
            },
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
                        Ref: 'MyQueueE6CA6235',
                    },
                    Id: 'Target0',
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyJobEventsRoleCF43C336',
                            'Arn',
                        ],
                    },
                    BatchParameters: {
                        JobDefinition: { Ref: 'MyJob8719E923' },
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
                            { Ref: 'MyQueueE6CA6235' },
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
                        Ref: 'MyQueueE6CA6235',
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
                        JobDefinition: { Ref: 'MyJob8719E923' },
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
            maxEventAge: core_1.Duration.hours(2),
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            ScheduleExpression: 'rate(1 hour)',
            State: 'ENABLED',
            Targets: [
                {
                    Arn: {
                        Ref: 'MyQueueE6CA6235',
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
                        Ref: 'MyQueueE6CA6235',
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2gudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhdGNoLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsNENBQTRDO0FBQzVDLDhDQUFrRDtBQUNsRCw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHdDQUFnRDtBQUNoRCxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLEtBQVksQ0FBQztJQUNqQixJQUFJLFFBQXdCLENBQUM7SUFDN0IsSUFBSSxhQUFrQyxDQUFDO0lBR3ZDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUNwQixRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDOUMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBRTt3QkFDNUUsT0FBTyxFQUFFLEtBQUs7cUJBQ2YsQ0FBQztvQkFDRixLQUFLLEVBQUUsQ0FBQztpQkFDVDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3RELFNBQVMsRUFBRTtnQkFDVCxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO2FBQ2hEO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFDUixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1NBQ3BELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUVwSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUUsYUFBYTtZQUNqQyxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFO3dCQUNILEdBQUcsRUFBRSxpQkFBaUI7cUJBQ3ZCO29CQUNELEVBQUUsRUFBRSxTQUFTO29CQUNiLE9BQU8sRUFBRTt3QkFDUCxZQUFZLEVBQUU7NEJBQ1oseUJBQXlCOzRCQUN6QixLQUFLO3lCQUNOO3FCQUNGO29CQUNELGVBQWUsRUFBRTt3QkFDZixhQUFhLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFO3dCQUN2QyxPQUFPLEVBQUUsTUFBTTtxQkFDaEI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLGlCQUFpQjt3QkFDekIsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFOzRCQUNSLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRTs0QkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7eUJBQzNCO3FCQUNGO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEVBQUUsR0FBRyxFQUFFLHlCQUF5QixFQUFFO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFFBQVE7UUFDUixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1NBQ3JELENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUMsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLGlCQUFpQixFQUFFLHVCQUF1QjtTQUMzQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQ2pDLFFBQVEsQ0FBQyxXQUFXLEVBQ3BCLFFBQVEsRUFDUixhQUFhLENBQUMsZ0JBQWdCLEVBQzlCLGFBQWEsRUFBRTtZQUNiLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7U0FDckQsQ0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRTt3QkFDSCxHQUFHLEVBQUUsaUJBQWlCO3FCQUN2QjtvQkFDRCxFQUFFLEVBQUUsU0FBUztvQkFDYixnQkFBZ0IsRUFBRTt3QkFDaEIsR0FBRyxFQUFFOzRCQUNILFlBQVksRUFBRTtnQ0FDWixlQUFlO2dDQUNmLEtBQUs7NkJBQ047eUJBQ0Y7cUJBQ0Y7b0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO29CQUNqQyxPQUFPLEVBQUU7d0JBQ1AsWUFBWSxFQUFFLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDO3FCQUNqRDtvQkFDRCxlQUFlLEVBQUU7d0JBQ2YsYUFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRTt3QkFDdkMsT0FBTyxFQUFFLE1BQU07cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxpQkFBaUI7d0JBQ3pCLFNBQVMsRUFBRTs0QkFDVCxTQUFTLEVBQUU7Z0NBQ1QsZUFBZSxFQUFFO29DQUNmLFlBQVksRUFBRTt3Q0FDWixjQUFjO3dDQUNkLEtBQUs7cUNBQ047aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7d0JBQ0QsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFOzRCQUNULE9BQU8sRUFBRSxzQkFBc0I7eUJBQ2hDO3dCQUNELFFBQVEsRUFBRTs0QkFDUixZQUFZLEVBQUU7Z0NBQ1osZUFBZTtnQ0FDZixLQUFLOzZCQUNOO3lCQUNGO3dCQUNELEdBQUcsRUFBRSxvQkFBb0I7cUJBQzFCO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEdBQUcsRUFBRSxlQUFlO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLFFBQVE7UUFDUixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1NBQ3JELENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFNUMsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLGlCQUFpQixFQUFFLHVCQUF1QjtTQUMzQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQ2pDLFFBQVEsQ0FBQyxXQUFXLEVBQ3BCLFFBQVEsRUFDUixhQUFhLENBQUMsZ0JBQWdCLEVBQzlCLGFBQWEsRUFBRTtZQUNiLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDcEQsYUFBYSxFQUFFLENBQUM7WUFDaEIsV0FBVyxFQUFFLGVBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9CLENBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1lBQ25FLGtCQUFrQixFQUFFLGNBQWM7WUFDbEMsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFBRTt3QkFDSCxHQUFHLEVBQUUsaUJBQWlCO3FCQUN2QjtvQkFDRCxlQUFlLEVBQUU7d0JBQ2YsYUFBYSxFQUFFOzRCQUNiLEdBQUcsRUFBRSxlQUFlO3lCQUNyQjt3QkFDRCxPQUFPLEVBQUUsTUFBTTtxQkFDaEI7b0JBQ0QsZ0JBQWdCLEVBQUU7d0JBQ2hCLEdBQUcsRUFBRTs0QkFDSCxZQUFZLEVBQUU7Z0NBQ1osZUFBZTtnQ0FDZixLQUFLOzZCQUNOO3lCQUNGO3FCQUNGO29CQUNELEVBQUUsRUFBRSxTQUFTO29CQUNiLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFDakMsV0FBVyxFQUFFO3dCQUNYLHdCQUF3QixFQUFFLElBQUk7d0JBQzlCLG9CQUFvQixFQUFFLENBQUM7cUJBQ3hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZLEVBQUU7NEJBQ1oseUJBQXlCOzRCQUN6QixLQUFLO3lCQUNOO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsUUFBUTtRQUNSLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7U0FDckQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLGlCQUFpQixFQUFFLHVCQUF1QjtTQUMzQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQ2pDLFFBQVEsQ0FBQyxXQUFXLEVBQ3BCLFFBQVEsRUFDUixhQUFhLENBQUMsZ0JBQWdCLEVBQzlCLGFBQWEsRUFBRTtZQUNiLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7WUFDcEQsYUFBYSxFQUFFLENBQUM7U0FDakIsQ0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUUsY0FBYztZQUNsQyxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsR0FBRyxFQUFFO3dCQUNILEdBQUcsRUFBRSxpQkFBaUI7cUJBQ3ZCO29CQUNELGVBQWUsRUFBRTt3QkFDZixhQUFhLEVBQUU7NEJBQ2IsR0FBRyxFQUFFLGVBQWU7eUJBQ3JCO3dCQUNELE9BQU8sRUFBRSxNQUFNO3FCQUNoQjtvQkFDRCxFQUFFLEVBQUUsU0FBUztvQkFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7b0JBQ2pDLFdBQVcsRUFBRTt3QkFDWCxvQkFBb0IsRUFBRSxDQUFDO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsWUFBWSxFQUFFOzRCQUNaLHlCQUF5Qjs0QkFDekIsS0FBSzt5QkFDTjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBiYXRjaCBmcm9tICdAYXdzLWNkay9hd3MtYmF0Y2gnO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnQmF0Y2ggam9iIGV2ZW50IHRhcmdldCcsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IGpvYlF1ZXVlOiBiYXRjaC5Kb2JRdWV1ZTtcbiAgbGV0IGpvYkRlZmluaXRpb246IGJhdGNoLkpvYkRlZmluaXRpb247XG5cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGpvYlF1ZXVlID0gbmV3IGJhdGNoLkpvYlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScsIHtcbiAgICAgIGNvbXB1dGVFbnZpcm9ubWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbXB1dGVFbnZpcm9ubWVudDogbmV3IGJhdGNoLkNvbXB1dGVFbnZpcm9ubWVudChzdGFjaywgJ0NvbXB1dGVFbnZpcm9ubWVudCcsIHtcbiAgICAgICAgICAgIG1hbmFnZWQ6IGZhbHNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBqb2JEZWZpbml0aW9uID0gbmV3IGJhdGNoLkpvYkRlZmluaXRpb24oc3RhY2ssICdNeUpvYicsIHtcbiAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0LXJlcG8nKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBhd3MgYmF0Y2ggam9iIGFzIGFuIGV2ZW50IHJ1bGUgdGFyZ2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBtaW4pJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuQmF0Y2hKb2Ioam9iUXVldWUuam9iUXVldWVBcm4sIGpvYlF1ZXVlLCBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sIGpvYkRlZmluaXRpb24pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgbWluKScsXG4gICAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICBSZWY6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015Sm9iRXZlbnRzUm9sZUNGNDNDMzM2JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQmF0Y2hQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBKb2JEZWZpbml0aW9uOiB7IFJlZjogJ015Sm9iODcxOUU5MjMnIH0sXG4gICAgICAgICAgICBKb2JOYW1lOiAnUnVsZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2JhdGNoOlN1Ym1pdEpvYicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICB7IFJlZjogJ015Sm9iODcxOUU5MjMnIH0sXG4gICAgICAgICAgICAgIHsgUmVmOiAnTXlRdWV1ZUU2Q0E2MjM1JyB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAgeyBSZWY6ICdNeUpvYkV2ZW50c1JvbGVDRjQzQzMzNicgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBhIERlYWQgTGV0dGVyIFF1ZXVlIGZvciB0aGUgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIGhvdXIpJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGV2ZW50SW5wdXQgPSB7XG4gICAgICBidWlsZHNwZWNPdmVycmlkZTogJ2J1aWxkc3BlY3MvaG91cmx5LnltbCcsXG4gICAgfTtcblxuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkJhdGNoSm9iKFxuICAgICAgam9iUXVldWUuam9iUXVldWVBcm4sXG4gICAgICBqb2JRdWV1ZSxcbiAgICAgIGpvYkRlZmluaXRpb24uam9iRGVmaW5pdGlvbkFybixcbiAgICAgIGpvYkRlZmluaXRpb24sIHtcbiAgICAgICAgZGVhZExldHRlclF1ZXVlOiBxdWV1ZSxcbiAgICAgICAgZXZlbnQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdChldmVudElucHV0KSxcbiAgICAgIH0sXG4gICAgKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICBSZWY6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1F1ZXVlNEE3RTM1NTUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElucHV0OiBKU09OLnN0cmluZ2lmeShldmVudElucHV0KSxcbiAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlKb2JFdmVudHNSb2xlQ0Y0M0MzMzYnLCAnQXJuJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCYXRjaFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIEpvYkRlZmluaXRpb246IHsgUmVmOiAnTXlKb2I4NzE5RTkyMycgfSxcbiAgICAgICAgICAgIEpvYk5hbWU6ICdSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNRUzo6UXVldWVQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIEFybkVxdWFsczoge1xuICAgICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdSdWxlNEM5OTVCN0YnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2V2ZW50cy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnUXVldWU0QTdFMzU1NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2lkOiAnQWxsb3dFdmVudFJ1bGVSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUXVldWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnlpbmcgcmV0cnkgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBob3VyKScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iUXVldWUsXG4gICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JEZWZpbml0aW9uLCB7XG4gICAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogcXVldWUsXG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyKSxcbiAgICAgIH0sXG4gICAgKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIGhvdXIpJyxcbiAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgIFJlZjogJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCYXRjaFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIEpvYkRlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgUmVmOiAnTXlKb2I4NzE5RTkyMycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSm9iTmFtZTogJ1J1bGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiBKU09OLnN0cmluZ2lmeShldmVudElucHV0KSxcbiAgICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgICAgTWF4aW11bUV2ZW50QWdlSW5TZWNvbmRzOiA3MjAwLFxuICAgICAgICAgICAgTWF4aW11bVJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015Sm9iRXZlbnRzUm9sZUNGNDNDMzM2JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzcGVjaWZ5aW5nIHJldHJ5IHBvbGljeSB3aXRoIDAgcmV0cnlBdHRlbXB0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgaG91ciknKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihcbiAgICAgIGpvYlF1ZXVlLmpvYlF1ZXVlQXJuLFxuICAgICAgam9iUXVldWUsXG4gICAgICBqb2JEZWZpbml0aW9uLmpvYkRlZmluaXRpb25Bcm4sXG4gICAgICBqb2JEZWZpbml0aW9uLCB7XG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICAgIHJldHJ5QXR0ZW1wdHM6IDAsXG4gICAgICB9LFxuICAgICkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBob3VyKScsXG4gICAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICBSZWY6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQmF0Y2hQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBKb2JEZWZpbml0aW9uOiB7XG4gICAgICAgICAgICAgIFJlZjogJ015Sm9iODcxOUU5MjMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEpvYk5hbWU6ICdSdWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgSW5wdXQ6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5wdXQpLFxuICAgICAgICAgIFJldHJ5UG9saWN5OiB7XG4gICAgICAgICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlKb2JFdmVudHNSb2xlQ0Y0M0MzMzYnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7Il19