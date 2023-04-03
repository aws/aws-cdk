"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const kms = require("@aws-cdk/aws-kms");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const targets = require("../../lib");
test('sqs queue as an event rule target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'sqs:SendMessage',
                        'sqs:GetQueueAttributes',
                        'sqs:GetQueueUrl',
                    ],
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': {
                                'Fn::GetAtt': [
                                    'MyRuleA44AB831',
                                    'Arn',
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: { Service: 'events.amazonaws.com' },
                    Resource: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        Queues: [{ Ref: 'MyQueueE6CA6235' }],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
            },
        ],
    });
});
test('multiple uses of a queue as a target results in multi policy statement because of condition', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    // WHEN
    for (let i = 0; i < 2; ++i) {
        const rule = new events.Rule(stack, `Rule${i}`, {
            schedule: events.Schedule.rate(core_1.Duration.hours(1)),
        });
        rule.addTarget(new targets.SqsQueue(queue));
    }
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'sqs:SendMessage',
                        'sqs:GetQueueAttributes',
                        'sqs:GetQueueUrl',
                    ],
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': {
                                'Fn::GetAtt': [
                                    'Rule071281D88',
                                    'Arn',
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: { Service: 'events.amazonaws.com' },
                    Resource: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
                {
                    Action: [
                        'sqs:SendMessage',
                        'sqs:GetQueueAttributes',
                        'sqs:GetQueueUrl',
                    ],
                    Condition: {
                        ArnEquals: {
                            'aws:SourceArn': {
                                'Fn::GetAtt': [
                                    'Rule136483A30',
                                    'Arn',
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: { Service: 'events.amazonaws.com' },
                    Resource: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        Queues: [{ Ref: 'MyQueueE6CA6235' }],
    });
});
test('Encrypted queues result in a policy statement with aws:sourceAccount condition when the feature flag is on', () => {
    const app = new core_1.App();
    // GIVEN
    const ruleStack = new core_1.Stack(app, 'ruleStack', {
        env: {
            account: '111111111111',
            region: 'us-east-1',
        },
    });
    ruleStack.node.setContext(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT, true);
    const rule = new events.Rule(ruleStack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    const queueStack = new core_1.Stack(app, 'queueStack', {
        env: {
            account: '222222222222',
            region: 'us-east-1',
        },
    });
    const queue = new sqs.Queue(queueStack, 'MyQueue', {
        encryptionMasterKey: kms.Key.fromKeyArn(queueStack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab'),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue));
    // THEN
    assertions_1.Template.fromStack(queueStack).hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([
                {
                    Action: [
                        'sqs:SendMessage',
                        'sqs:GetQueueAttributes',
                        'sqs:GetQueueUrl',
                    ],
                    Condition: {
                        StringEquals: {
                            'aws:SourceAccount': '111111111111',
                        },
                    },
                    Effect: 'Allow',
                    Principal: { Service: 'events.amazonaws.com' },
                    Resource: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            ]),
            Version: '2012-10-17',
        },
        Queues: [{ Ref: 'MyQueueE6CA6235' }],
    });
});
test('Encrypted queues result in a permissive policy statement when the feature flag is off', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue', {
        encryptionMasterKey: kms.Key.fromKeyArn(stack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab'),
    });
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'sqs:SendMessage',
                        'sqs:GetQueueAttributes',
                        'sqs:GetQueueUrl',
                    ],
                    Effect: 'Allow',
                    Principal: { Service: 'events.amazonaws.com' },
                    Resource: {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        Queues: [{ Ref: 'MyQueueE6CA6235' }],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
            },
        ],
    });
});
test('fail if messageGroupId is specified on non-fifo queues', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    expect(() => new targets.SqsQueue(queue, { messageGroupId: 'MyMessageGroupId' }))
        .toThrow(/messageGroupId cannot be specified/);
});
test('fifo queues are synthesized correctly', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue, {
        messageGroupId: 'MyMessageGroupId',
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                SqsParameters: {
                    MessageGroupId: 'MyMessageGroupId',
                },
            },
        ],
    });
});
test('dead letter queue is configured correctly', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
    const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue, {
        deadLetterQueue,
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                DeadLetterConfig: {
                    Arn: {
                        'Fn::GetAtt': [
                            'MyDeadLetterQueueD997968A',
                            'Arn',
                        ],
                    },
                },
            },
        ],
    });
});
test('specifying retry policy', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue, {
        retryAttempts: 2,
        maxEventAge: core_1.Duration.hours(2),
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                RetryPolicy: {
                    MaximumEventAgeInSeconds: 7200,
                    MaximumRetryAttempts: 2,
                },
            },
        ],
    });
});
test('specifying retry policy with 0 retryAttempts', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
    const rule = new events.Rule(stack, 'MyRule', {
        schedule: events.Schedule.rate(core_1.Duration.hours(1)),
    });
    // WHEN
    rule.addTarget(new targets.SqsQueue(queue, {
        retryAttempts: 0,
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 hour)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::GetAtt': [
                        'MyQueueE6CA6235',
                        'Arn',
                    ],
                },
                Id: 'Target0',
                RetryPolicy: {
                    MaximumRetryAttempts: 0,
                },
            },
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBcUQ7QUFDckQseUNBQXlDO0FBQ3pDLHFDQUFxQztBQUVyQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO0lBQzdDLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDNUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEQsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFNUMsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO1FBQ3ZFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUU7d0JBQ04saUJBQWlCO3dCQUNqQix3QkFBd0I7d0JBQ3hCLGlCQUFpQjtxQkFDbEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULFNBQVMsRUFBRTs0QkFDVCxlQUFlLEVBQUU7Z0NBQ2YsWUFBWSxFQUFFO29DQUNaLGdCQUFnQjtvQ0FDaEIsS0FBSztpQ0FDTjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxNQUFNLEVBQUUs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Q3hELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM1QyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsRCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ3pDLGFBQWEsRUFBRSxDQUFDO0tBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBRUoscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7UUFDbkUsa0JBQWtCLEVBQUUsY0FBYztRQUNsQyxLQUFLLEVBQUUsU0FBUztRQUNoQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxHQUFHLEVBQUU7b0JBQ0gsWUFBWSxFQUFFO3dCQUNaLGlCQUFpQjt3QkFDakIsS0FBSztxQkFDTjtpQkFDRjtnQkFDRCxFQUFFLEVBQUUsU0FBUztnQkFDYixXQUFXLEVBQUU7b0JBQ1gsb0JBQW9CLEVBQUUsQ0FBQztpQkFDeEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi8uLi9saWInO1xuXG50ZXN0KCdzcXMgcXVldWUgYXMgYW4gZXZlbnQgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015UXVldWUnKTtcbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoRHVyYXRpb24uaG91cnMoMSkpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLlNxc1F1ZXVlKHF1ZXVlKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQXJuRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015UnVsZUE0NEFCODMxJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnZXZlbnRzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUXVldWVzOiBbeyBSZWY6ICdNeVF1ZXVlRTZDQTYyMzUnIH1dLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIGhvdXIpJyxcbiAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ211bHRpcGxlIHVzZXMgb2YgYSBxdWV1ZSBhcyBhIHRhcmdldCByZXN1bHRzIGluIG11bHRpIHBvbGljeSBzdGF0ZW1lbnQgYmVjYXVzZSBvZiBjb25kaXRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015UXVldWUnKTtcblxuICAvLyBXSEVOXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgKytpKSB7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgYFJ1bGUke2l9YCwge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKER1cmF0aW9uLmhvdXJzKDEpKSxcbiAgICB9KTtcbiAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5TcXNRdWV1ZShxdWV1ZSkpO1xuICB9XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQXJuRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1J1bGUwNzEyODFEODgnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdldmVudHMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQXJuRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1J1bGUxMzY0ODNBMzAnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdldmVudHMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBRdWV1ZXM6IFt7IFJlZjogJ015UXVldWVFNkNBNjIzNScgfV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0VuY3J5cHRlZCBxdWV1ZXMgcmVzdWx0IGluIGEgcG9saWN5IHN0YXRlbWVudCB3aXRoIGF3czpzb3VyY2VBY2NvdW50IGNvbmRpdGlvbiB3aGVuIHRoZSBmZWF0dXJlIGZsYWcgaXMgb24nLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgLy8gR0lWRU5cbiAgY29uc3QgcnVsZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3J1bGVTdGFjaycsIHtcbiAgICBlbnY6IHtcbiAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMTEnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9LFxuICB9KTtcbiAgcnVsZVN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5FVkVOVFNfVEFSR0VUX1FVRVVFX1NBTUVfQUNDT1VOVCwgdHJ1ZSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShydWxlU3RhY2ssICdNeVJ1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKER1cmF0aW9uLmhvdXJzKDEpKSxcbiAgfSk7XG5cbiAgY29uc3QgcXVldWVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdxdWV1ZVN0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzIyMjIyMjIyMjIyMicsXG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgIH0sXG4gIH0pO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUocXVldWVTdGFjaywgJ015UXVldWUnLCB7XG4gICAgZW5jcnlwdGlvbk1hc3RlcktleToga21zLktleS5mcm9tS2V5QXJuKHF1ZXVlU3RhY2ssICdrZXknLCAnYXJuOmF3czprbXM6dXMtd2VzdC0yOjExMTEyMjIyMzMzMzprZXkvMTIzNGFiY2QtMTJhYi0zNGNkLTU2ZWYtMTIzNDU2Nzg5MGFiJyksXG4gIH0pO1xuXG5cbiAgLy8gV0hFTlxuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5TcXNRdWV1ZShxdWV1ZSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHF1ZXVlU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgJ3NxczpHZXRRdWV1ZUF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgJ3NxczpHZXRRdWV1ZVVybCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiAnMTExMTExMTExMTExJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdldmVudHMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0pLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUXVldWVzOiBbeyBSZWY6ICdNeVF1ZXVlRTZDQTYyMzUnIH1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdFbmNyeXB0ZWQgcXVldWVzIHJlc3VsdCBpbiBhIHBlcm1pc3NpdmUgcG9saWN5IHN0YXRlbWVudCB3aGVuIHRoZSBmZWF0dXJlIGZsYWcgaXMgb2ZmJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJywge1xuICAgIGVuY3J5cHRpb25NYXN0ZXJLZXk6IGttcy5LZXkuZnJvbUtleUFybihzdGFjaywgJ2tleScsICdhcm46YXdzOmttczp1cy13ZXN0LTI6MTExMTIyMjIzMzMzOmtleS8xMjM0YWJjZC0xMmFiLTM0Y2QtNTZlZi0xMjM0NTY3ODkwYWInKSxcbiAgfSk7XG5cbiAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoRHVyYXRpb24uaG91cnMoMSkpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLlNxc1F1ZXVlKHF1ZXVlKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2V2ZW50cy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICAgIFF1ZXVlczogW3sgUmVmOiAnTXlRdWV1ZUU2Q0E2MjM1JyB9XSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBob3VyKScsXG4gICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmYWlsIGlmIG1lc3NhZ2VHcm91cElkIGlzIHNwZWNpZmllZCBvbiBub24tZmlmbyBxdWV1ZXMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015UXVldWUnKTtcblxuICBleHBlY3QoKCkgPT4gbmV3IHRhcmdldHMuU3FzUXVldWUocXVldWUsIHsgbWVzc2FnZUdyb3VwSWQ6ICdNeU1lc3NhZ2VHcm91cElkJyB9KSlcbiAgICAudG9UaHJvdygvbWVzc2FnZUdyb3VwSWQgY2Fubm90IGJlIHNwZWNpZmllZC8pO1xufSk7XG5cbnRlc3QoJ2ZpZm8gcXVldWVzIGFyZSBzeW50aGVzaXplZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015UXVldWUnLCB7IGZpZm86IHRydWUgfSk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdNeVJ1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKER1cmF0aW9uLmhvdXJzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5TcXNRdWV1ZShxdWV1ZSwge1xuICAgIG1lc3NhZ2VHcm91cElkOiAnTXlNZXNzYWdlR3JvdXBJZCcsXG4gIH0pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIGhvdXIpJyxcbiAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgIFNxc1BhcmFtZXRlcnM6IHtcbiAgICAgICAgICBNZXNzYWdlR3JvdXBJZDogJ015TWVzc2FnZUdyb3VwSWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdkZWFkIGxldHRlciBxdWV1ZSBpcyBjb25maWd1cmVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScsIHsgZmlmbzogdHJ1ZSB9KTtcbiAgY29uc3QgZGVhZExldHRlclF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ015RGVhZExldHRlclF1ZXVlJyk7XG4gIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdNeVJ1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKER1cmF0aW9uLmhvdXJzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5TcXNRdWV1ZShxdWV1ZSwge1xuICAgIGRlYWRMZXR0ZXJRdWV1ZSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgaG91ciknLFxuICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgRGVhZExldHRlckNvbmZpZzoge1xuICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeURlYWRMZXR0ZXJRdWV1ZUQ5OTc5NjhBJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NwZWNpZnlpbmcgcmV0cnkgcG9saWN5JywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJywgeyBmaWZvOiB0cnVlIH0pO1xuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnTXlSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShEdXJhdGlvbi5ob3VycygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuU3FzUXVldWUocXVldWUsIHtcbiAgICByZXRyeUF0dGVtcHRzOiAyLFxuICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyKSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgaG91ciknLFxuICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgUmV0cnlQb2xpY3k6IHtcbiAgICAgICAgICBNYXhpbXVtRXZlbnRBZ2VJblNlY29uZHM6IDcyMDAsXG4gICAgICAgICAgTWF4aW11bVJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NwZWNpZnlpbmcgcmV0cnkgcG9saWN5IHdpdGggMCByZXRyeUF0dGVtcHRzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJywgeyBmaWZvOiB0cnVlIH0pO1xuICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnTXlSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShEdXJhdGlvbi5ob3VycygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZS5hZGRUYXJnZXQobmV3IHRhcmdldHMuU3FzUXVldWUocXVldWUsIHtcbiAgICByZXRyeUF0dGVtcHRzOiAwLFxuICB9KSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBob3VyKScsXG4gICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgIE1heGltdW1SZXRyeUF0dGVtcHRzOiAwLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuIl19