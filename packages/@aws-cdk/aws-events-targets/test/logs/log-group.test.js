"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const events = require("@aws-cdk/aws-events");
const logs = require("@aws-cdk/aws-logs");
const sqs = require("@aws-cdk/aws-sqs");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const targets = require("../../lib");
const lib_1 = require("../../lib");
test('use log group as an event rule target', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':logs:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':log-group:',
                            {
                                Ref: 'MyLogGroup5C0DAD85',
                            },
                        ],
                    ],
                },
                Id: 'Target0',
            },
        ],
    });
});
cdk_build_tools_1.testDeprecated('use log group as an event rule target with rule target input', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
        event: events.RuleTargetInput.fromObject({
            message: events.EventField.fromPath('$'),
        }),
    }));
    // THEN
    expect(() => {
        app.synth();
    }).toThrow(/CloudWatchLogGroup targets only support input templates in the format/);
});
cdk_build_tools_1.testDeprecated('cannot use both logEvent and event', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // THEN
    expect(() => {
        rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
            event: events.RuleTargetInput.fromObject({
                message: events.EventField.fromPath('$'),
            }),
            logEvent: lib_1.LogGroupTargetInput.fromObject(),
        }));
    }).toThrow(/Only one of "event" or "logEvent" can be specified/);
});
test('logEvent with defaults', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
        logEvent: lib_1.LogGroupTargetInput.fromObject(),
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':logs:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':log-group:',
                            {
                                Ref: 'MyLogGroup5C0DAD85',
                            },
                        ],
                    ],
                },
                Id: 'Target0',
                InputTransformer: {
                    InputPathsMap: {
                        'time': '$.time',
                        'detail-type': '$.detail-type',
                    },
                    InputTemplate: '{"timestamp":<time>,"message":<detail-type>}',
                },
            },
        ],
    });
});
test('can use logEvent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
        logEvent: lib_1.LogGroupTargetInput.fromObject({
            timestamp: events.EventField.time,
            message: events.EventField.fromPath('$'),
        }),
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':logs:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':log-group:',
                            {
                                Ref: 'MyLogGroup5C0DAD85',
                            },
                        ],
                    ],
                },
                Id: 'Target0',
                InputTransformer: {
                    InputPathsMap: {
                        time: '$.time',
                        f2: '$',
                    },
                    InputTemplate: '{"timestamp":<time>,"message":<f2>}',
                },
            },
        ],
    });
});
cdk_build_tools_1.testDeprecated('specifying retry policy and dead letter queue', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    const queue = new sqs.Queue(stack, 'Queue');
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
        event: events.RuleTargetInput.fromObject({
            timestamp: events.EventField.time,
            message: events.EventField.fromPath('$'),
        }),
        retryAttempts: 2,
        maxEventAge: cdk.Duration.hours(2),
        deadLetterQueue: queue,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':logs:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':log-group:',
                            {
                                Ref: 'MyLogGroup5C0DAD85',
                            },
                        ],
                    ],
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
                InputTransformer: {
                    InputPathsMap: {
                        time: '$.time',
                        f2: '$',
                    },
                    InputTemplate: '{"timestamp":<time>,"message":<f2>}',
                },
                RetryPolicy: {
                    MaximumEventAgeInSeconds: 7200,
                    MaximumRetryAttempts: 2,
                },
            },
        ],
    });
});
cdk_build_tools_1.testDeprecated('specifying retry policy with 0 retryAttempts', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'MyLogGroup', {
        logGroupName: '/aws/events/MyLogGroup',
    });
    const rule1 = new events.Rule(stack, 'Rule', {
        schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });
    // WHEN
    rule1.addTarget(new targets.CloudWatchLogGroup(logGroup, {
        event: events.RuleTargetInput.fromObject({
            timestamp: events.EventField.time,
            message: events.EventField.fromPath('$'),
        }),
        retryAttempts: 0,
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        ScheduleExpression: 'rate(1 minute)',
        State: 'ENABLED',
        Targets: [
            {
                Arn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':logs:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':',
                            {
                                Ref: 'AWS::AccountId',
                            },
                            ':log-group:',
                            {
                                Ref: 'MyLogGroup5C0DAD85',
                            },
                        ],
                    ],
                },
                Id: 'Target0',
                InputTransformer: {
                    InputPathsMap: {
                        time: '$.time',
                        f2: '$',
                    },
                    InputTemplate: '{"timestamp":<time>,"message":<f2>}',
                },
                RetryPolicy: {
                    MaximumRetryAttempts: 0,
                },
            },
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2ctZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4Q0FBOEM7QUFDOUMsMENBQTBDO0FBQzFDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQyxtQ0FBZ0Q7QUFFaEQsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNqRCxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDdEQsWUFBWSxFQUFFLHdCQUF3QjtLQUN2QyxDQUFDLENBQUM7SUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMzQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUUxRCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7UUFDbkUsa0JBQWtCLEVBQUUsZ0JBQWdCO1FBQ3BDLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEdBQUcsRUFBRTtvQkFDSCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxn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Q25FLGtCQUFrQixFQUFFLGdCQUFnQjtRQUNwQyxLQUFLLEVBQUUsU0FBUztRQUNoQixPQUFPLEVBQUU7WUFDUDtnQkFDRSxHQUFHLEVBQUU7b0JBQ0gsVUFBVSxFQUFFO3dCQUNWLEVBQUU7d0JBQ0Y7NEJBQ0UsTUFBTTs0QkFDTjtnQ0FDRSxHQUFHLEVBQUUsZ0JBQWdCOzZCQUN0Qjs0QkFDRCxRQUFROzRCQUNSO2dDQUNFLEdBQUcsRUFBRSxhQUFhOzZCQUNuQjs0QkFDRCxHQUFHOzRCQUNIO2dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7NkJBQ3RCOzRCQUNELGFBQWE7NEJBQ2I7Z0NBQ0UsR0FBRyxFQUFFLG9CQUFvQjs2QkFDMUI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsRUFBRSxFQUFFLFNBQVM7Z0JBQ2IsZ0JBQWdCLEVBQUU7b0JBQ2hCLGFBQWEsRUFBRTt3QkFDYixJQUFJLEVBQUUsUUFBUTt3QkFDZCxFQUFFLEVBQUUsR0FBRztxQkFDUjtvQkFDRCxhQUFhLEVBQUUscUNBQXFDO2lCQUNyRDtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsb0JBQW9CLEVBQUUsQ0FBQztpQkFDeEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnQGF3cy1jZGsvYXdzLXNxcyc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBMb2dHcm91cFRhcmdldElucHV0IH0gZnJvbSAnLi4vLi4vbGliJztcblxudGVzdCgndXNlIGxvZyBncm91cCBhcyBhbiBldmVudCBydWxlIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdNeUxvZ0dyb3VwJywge1xuICAgIGxvZ0dyb3VwTmFtZTogJy9hd3MvZXZlbnRzL015TG9nR3JvdXAnLFxuICB9KTtcbiAgY29uc3QgcnVsZTEgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcnVsZTEuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNsb3VkV2F0Y2hMb2dHcm91cChsb2dHcm91cCkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgIFNjaGVkdWxlRXhwcmVzc2lvbjogJ3JhdGUoMSBtaW51dGUpJyxcbiAgICBTdGF0ZTogJ0VOQUJMRUQnLFxuICAgIFRhcmdldHM6IFtcbiAgICAgIHtcbiAgICAgICAgQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ015TG9nR3JvdXA1QzBEQUQ4NScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd1c2UgbG9nIGdyb3VwIGFzIGFuIGV2ZW50IHJ1bGUgdGFyZ2V0IHdpdGggcnVsZSB0YXJnZXQgaW5wdXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcsIHtcbiAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2V2ZW50cy9NeUxvZ0dyb3VwJyxcbiAgfSk7XG4gIGNvbnN0IHJ1bGUxID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUxLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5DbG91ZFdhdGNoTG9nR3JvdXAobG9nR3JvdXAsIHtcbiAgICBldmVudDogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgIG1lc3NhZ2U6IGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckJyksXG4gICAgfSksXG4gIH0pKTtcblxuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBhcHAuc3ludGgoKTtcbiAgfSkudG9UaHJvdygvQ2xvdWRXYXRjaExvZ0dyb3VwIHRhcmdldHMgb25seSBzdXBwb3J0IGlucHV0IHRlbXBsYXRlcyBpbiB0aGUgZm9ybWF0Lyk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2Nhbm5vdCB1c2UgYm90aCBsb2dFdmVudCBhbmQgZXZlbnQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcsIHtcbiAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2V2ZW50cy9NeUxvZ0dyb3VwJyxcbiAgfSk7XG4gIGNvbnN0IHJ1bGUxID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgcnVsZTEuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNsb3VkV2F0Y2hMb2dHcm91cChsb2dHcm91cCwge1xuICAgICAgZXZlbnQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgIG1lc3NhZ2U6IGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckJyksXG4gICAgICB9KSxcbiAgICAgIGxvZ0V2ZW50OiBMb2dHcm91cFRhcmdldElucHV0LmZyb21PYmplY3QoKSxcbiAgICB9KSk7XG4gIH0pLnRvVGhyb3coL09ubHkgb25lIG9mIFwiZXZlbnRcIiBvciBcImxvZ0V2ZW50XCIgY2FuIGJlIHNwZWNpZmllZC8pO1xufSk7XG5cbnRlc3QoJ2xvZ0V2ZW50IHdpdGggZGVmYXVsdHMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBsb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTXlMb2dHcm91cCcsIHtcbiAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2V2ZW50cy9NeUxvZ0dyb3VwJyxcbiAgfSk7XG4gIGNvbnN0IHJ1bGUxID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJ1bGUxLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5DbG91ZFdhdGNoTG9nR3JvdXAobG9nR3JvdXAsIHtcbiAgICBsb2dFdmVudDogTG9nR3JvdXBUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KCksXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgbWludXRlKScsXG4gICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nLWdyb3VwOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeUxvZ0dyb3VwNUMwREFEODUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBJbnB1dFRyYW5zZm9ybWVyOiB7XG4gICAgICAgICAgSW5wdXRQYXRoc01hcDoge1xuICAgICAgICAgICAgJ3RpbWUnOiAnJC50aW1lJyxcbiAgICAgICAgICAgICdkZXRhaWwtdHlwZSc6ICckLmRldGFpbC10eXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElucHV0VGVtcGxhdGU6ICd7XCJ0aW1lc3RhbXBcIjo8dGltZT4sXCJtZXNzYWdlXCI6PGRldGFpbC10eXBlPn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gdXNlIGxvZ0V2ZW50JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnLCB7XG4gICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9ldmVudHMvTXlMb2dHcm91cCcsXG4gIH0pO1xuICBjb25zdCBydWxlMSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBydWxlMS5hZGRUYXJnZXQobmV3IHRhcmdldHMuQ2xvdWRXYXRjaExvZ0dyb3VwKGxvZ0dyb3VwLCB7XG4gICAgbG9nRXZlbnQ6IExvZ0dyb3VwVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICB0aW1lc3RhbXA6IGV2ZW50cy5FdmVudEZpZWxkLnRpbWUsXG4gICAgICBtZXNzYWdlOiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJCcpLFxuICAgIH0pLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIG1pbnV0ZSknLFxuICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgVGFyZ2V0czogW1xuICAgICAge1xuICAgICAgICBBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmxvZy1ncm91cDonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlMb2dHcm91cDVDMERBRDg1JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgIHRpbWU6ICckLnRpbWUnLFxuICAgICAgICAgICAgZjI6ICckJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElucHV0VGVtcGxhdGU6ICd7XCJ0aW1lc3RhbXBcIjo8dGltZT4sXCJtZXNzYWdlXCI6PGYyPn0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnc3BlY2lmeWluZyByZXRyeSBwb2xpY3kgYW5kIGRlYWQgbGV0dGVyIHF1ZXVlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnLCB7XG4gICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9ldmVudHMvTXlMb2dHcm91cCcsXG4gIH0pO1xuICBjb25zdCBydWxlMSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgfSk7XG5cbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAvLyBXSEVOXG4gIHJ1bGUxLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5DbG91ZFdhdGNoTG9nR3JvdXAobG9nR3JvdXAsIHtcbiAgICBldmVudDogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgIHRpbWVzdGFtcDogZXZlbnRzLkV2ZW50RmllbGQudGltZSxcbiAgICAgIG1lc3NhZ2U6IGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckJyksXG4gICAgfSksXG4gICAgcmV0cnlBdHRlbXB0czogMixcbiAgICBtYXhFdmVudEFnZTogY2RrLkR1cmF0aW9uLmhvdXJzKDIpLFxuICAgIGRlYWRMZXR0ZXJRdWV1ZTogcXVldWUsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgbWludXRlKScsXG4gICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nLWdyb3VwOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeUxvZ0dyb3VwNUMwREFEODUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1F1ZXVlNEE3RTM1NTUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgIHRpbWU6ICckLnRpbWUnLFxuICAgICAgICAgICAgZjI6ICckJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElucHV0VGVtcGxhdGU6ICd7XCJ0aW1lc3RhbXBcIjo8dGltZT4sXCJtZXNzYWdlXCI6PGYyPn0nLFxuICAgICAgICB9LFxuICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgIE1heGltdW1FdmVudEFnZUluU2Vjb25kczogNzIwMCxcbiAgICAgICAgICBNYXhpbXVtUmV0cnlBdHRlbXB0czogMixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ3NwZWNpZnlpbmcgcmV0cnkgcG9saWN5IHdpdGggMCByZXRyeUF0dGVtcHRzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ015TG9nR3JvdXAnLCB7XG4gICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9ldmVudHMvTXlMb2dHcm91cCcsXG4gIH0pO1xuICBjb25zdCBydWxlMSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBydWxlMS5hZGRUYXJnZXQobmV3IHRhcmdldHMuQ2xvdWRXYXRjaExvZ0dyb3VwKGxvZ0dyb3VwLCB7XG4gICAgZXZlbnQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICB0aW1lc3RhbXA6IGV2ZW50cy5FdmVudEZpZWxkLnRpbWUsXG4gICAgICBtZXNzYWdlOiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJCcpLFxuICAgIH0pLFxuICAgIHJldHJ5QXR0ZW1wdHM6IDAsXG4gIH0pKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgbWludXRlKScsXG4gICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICBUYXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIEFybjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bG9nLWdyb3VwOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeUxvZ0dyb3VwNUMwREFEODUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICBJbnB1dFRyYW5zZm9ybWVyOiB7XG4gICAgICAgICAgSW5wdXRQYXRoc01hcDoge1xuICAgICAgICAgICAgdGltZTogJyQudGltZScsXG4gICAgICAgICAgICBmMjogJyQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXRUZW1wbGF0ZTogJ3tcInRpbWVzdGFtcFwiOjx0aW1lPixcIm1lc3NhZ2VcIjo8ZjI+fScsXG4gICAgICAgIH0sXG4gICAgICAgIFJldHJ5UG9saWN5OiB7XG4gICAgICAgICAgTWF4aW11bVJldHJ5QXR0ZW1wdHM6IDAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG4iXX0=