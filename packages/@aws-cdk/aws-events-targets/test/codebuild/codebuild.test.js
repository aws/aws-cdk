"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
describe('CodeBuild event target', () => {
    let stack;
    let project;
    let projectArn;
    beforeEach(() => {
        stack = new core_1.Stack();
        project = new codebuild.PipelineProject(stack, 'MyProject');
        projectArn = { 'Fn::GetAtt': ['MyProject39F7B0AE', 'Arn'] };
    });
    test('use codebuild project as an eventrule target', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 min)'),
        });
        // WHEN
        rule.addTarget(new targets.CodeBuildProject(project));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: projectArn,
                    Id: 'Target0',
                    RoleArn: { 'Fn::GetAtt': ['MyProjectEventsRole5B7D93F5', 'Arn'] },
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { Service: 'events.amazonaws.com' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'codebuild:StartBuild',
                        Effect: 'Allow',
                        Resource: projectArn,
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('specifying event for codebuild project target', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        // WHEN
        const eventInput = {
            buildspecOverride: 'buildspecs/hourly.yml',
        };
        rule.addTarget(new targets.CodeBuildProject(project, {
            event: events.RuleTargetInput.fromObject(eventInput),
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: projectArn,
                    Id: 'Target0',
                    Input: JSON.stringify(eventInput),
                    RoleArn: {
                        'Fn::GetAtt': ['MyProjectEventsRole5B7D93F5', 'Arn'],
                    },
                },
            ],
        });
    });
    test('specifying custom role for codebuild project target', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        const role = new iam.Role(stack, 'MyExampleRole', {
            assumedBy: new iam.AnyPrincipal(),
        });
        const roleResource = role.node.defaultChild;
        roleResource.overrideLogicalId('MyRole'); // to make it deterministic in the assertion below
        // WHEN
        rule.addTarget(new targets.CodeBuildProject(project, { eventRole: role }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: projectArn,
                    Id: 'Target0',
                    RoleArn: { 'Fn::GetAtt': ['MyRole', 'Arn'] },
                },
            ],
        });
    });
    test('specifying retry policy', () => {
        // GIVEN
        const rule = new events.Rule(stack, 'Rule', {
            schedule: events.Schedule.expression('rate(1 hour)'),
        });
        // WHEN
        const eventInput = {
            buildspecOverride: 'buildspecs/hourly.yml',
        };
        rule.addTarget(new targets.CodeBuildProject(project, {
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
                        'Fn::GetAtt': [
                            'MyProject39F7B0AE',
                            'Arn',
                        ],
                    },
                    Id: 'Target0',
                    Input: '{"buildspecOverride":"buildspecs/hourly.yml"}',
                    RetryPolicy: {
                        MaximumEventAgeInSeconds: 7200,
                        MaximumRetryAttempts: 2,
                    },
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyProjectEventsRole5B7D93F5',
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
        rule.addTarget(new targets.CodeBuildProject(project, {
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
                            'MyProject39F7B0AE',
                            'Arn',
                        ],
                    },
                    Id: 'Target0',
                    Input: '{"buildspecOverride":"buildspecs/hourly.yml"}',
                    RetryPolicy: {
                        MaximumRetryAttempts: 0,
                    },
                    RoleArn: {
                        'Fn::GetAtt': [
                            'MyProjectEventsRole5B7D93F5',
                            'Arn',
                        ],
                    },
                },
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
        rule.addTarget(new targets.CodeBuildProject(project, {
            event: events.RuleTargetInput.fromObject(eventInput),
            deadLetterQueue: queue,
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
            Targets: [
                {
                    Arn: projectArn,
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
                        'Fn::GetAtt': ['MyProjectEventsRole5B7D93F5', 'Arn'],
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJ1aWxkLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2RlYnVpbGQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxvREFBb0Q7QUFDcEQsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQTREO0FBQzVELHFDQUFxQztBQUVyQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLElBQUksS0FBWSxDQUFDO0lBQ2pCLElBQUksT0FBa0MsQ0FBQztJQUN2QyxJQUFJLFVBQWUsQ0FBQztJQUVwQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDcEIsT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUQsVUFBVSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsUUFBUTtRQUNSLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUV0RCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEdBQUcsRUFB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Q0Y7cUJBQ0Y7b0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO29CQUNqQyxPQUFPLEVBQUU7d0JBQ1AsWUFBWSxFQUFFLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDO3FCQUNyRDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxNQUFNLEVBQUUsaUJBQWlCO3dCQUN6QixTQUFTLEVBQUU7NEJBQ1QsU0FBUyxFQUFFO2dDQUNULGVBQWUsRUFBRTtvQ0FDZixZQUFZLEVBQUU7d0NBQ1osY0FBYzt3Q0FDZCxLQUFLO3FDQUNOO2lDQUNGOzZCQUNGO3lCQUNGO3dCQUNELE1BQU0sRUFBRSxPQUFPO3dCQUNmLFNBQVMsRUFBRTs0QkFDVCxPQUFPLEVBQUUsc0JBQXNCO3lCQUNoQzt3QkFDRCxRQUFRLEVBQUU7NEJBQ1IsWUFBWSxFQUFFO2dDQUNaLGVBQWU7Z0NBQ2YsS0FBSzs2QkFDTjt5QkFDRjt3QkFDRCxHQUFHLEVBQUUsb0JBQW9CO3FCQUMxQjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsWUFBWTthQUN0QjtZQUNELE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxHQUFHLEVBQUUsZUFBZTtpQkFDckI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdDb2RlQnVpbGQgZXZlbnQgdGFyZ2V0JywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuICBsZXQgcHJvamVjdDogY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdDtcbiAgbGV0IHByb2plY3RBcm46IGFueTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcpO1xuICAgIHByb2plY3RBcm4gPSB7ICdGbjo6R2V0QXR0JzogWydNeVByb2plY3QzOUY3QjBBRScsICdBcm4nXSB9O1xuICB9KTtcblxuICB0ZXN0KCd1c2UgY29kZWJ1aWxkIHByb2plY3QgYXMgYW4gZXZlbnRydWxlIHRhcmdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWluKScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNvZGVCdWlsZFByb2plY3QocHJvamVjdCkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjogcHJvamVjdEFybixcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UHJvamVjdEV2ZW50c1JvbGU1QjdEOTNGNScsICdBcm4nXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2V2ZW50cy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2NvZGVidWlsZDpTdGFydEJ1aWxkJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBwcm9qZWN0QXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnlpbmcgZXZlbnQgZm9yIGNvZGVidWlsZCBwcm9qZWN0IHRhcmdldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgZXZlbnRzLlJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgaG91ciknKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudElucHV0ID0ge1xuICAgICAgYnVpbGRzcGVjT3ZlcnJpZGU6ICdidWlsZHNwZWNzL2hvdXJseS55bWwnLFxuICAgIH07XG5cbiAgICBydWxlLmFkZFRhcmdldChcbiAgICAgIG5ldyB0YXJnZXRzLkNvZGVCdWlsZFByb2plY3QocHJvamVjdCwge1xuICAgICAgICBldmVudDogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KGV2ZW50SW5wdXQpLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHByb2plY3RBcm4sXG4gICAgICAgICAgSWQ6ICdUYXJnZXQwJyxcbiAgICAgICAgICBJbnB1dDogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbnB1dCksXG4gICAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015UHJvamVjdEV2ZW50c1JvbGU1QjdEOTNGNScsICdBcm4nXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lmeWluZyBjdXN0b20gcm9sZSBmb3IgY29kZWJ1aWxkIHByb2plY3QgdGFyZ2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBob3VyKScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeUV4YW1wbGVSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGVSZXNvdXJjZSA9IHJvbGUubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuRWxlbWVudDtcbiAgICByb2xlUmVzb3VyY2Uub3ZlcnJpZGVMb2dpY2FsSWQoJ015Um9sZScpOyAvLyB0byBtYWtlIGl0IGRldGVybWluaXN0aWMgaW4gdGhlIGFzc2VydGlvbiBiZWxvd1xuXG4gICAgLy8gV0hFTlxuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNvZGVCdWlsZFByb2plY3QocHJvamVjdCwgeyBldmVudFJvbGU6IHJvbGUgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjogcHJvamVjdEFybixcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015Um9sZScsICdBcm4nXSB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lmeWluZyByZXRyeSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIGhvdXIpJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZXZlbnRJbnB1dCA9IHtcbiAgICAgIGJ1aWxkc3BlY092ZXJyaWRlOiAnYnVpbGRzcGVjcy9ob3VybHkueW1sJyxcbiAgICB9O1xuXG4gICAgcnVsZS5hZGRUYXJnZXQoXG4gICAgICBuZXcgdGFyZ2V0cy5Db2RlQnVpbGRQcm9qZWN0KHByb2plY3QsIHtcbiAgICAgICAgZXZlbnQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdChldmVudElucHV0KSxcbiAgICAgICAgcmV0cnlBdHRlbXB0czogMixcbiAgICAgICAgbWF4RXZlbnRBZ2U6IER1cmF0aW9uLmhvdXJzKDIpLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICBTY2hlZHVsZUV4cHJlc3Npb246ICdyYXRlKDEgaG91ciknLFxuICAgICAgU3RhdGU6ICdFTkFCTEVEJyxcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgSW5wdXQ6ICd7XCJidWlsZHNwZWNPdmVycmlkZVwiOlwiYnVpbGRzcGVjcy9ob3VybHkueW1sXCJ9JyxcbiAgICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgICAgTWF4aW11bUV2ZW50QWdlSW5TZWNvbmRzOiA3MjAwLFxuICAgICAgICAgICAgTWF4aW11bVJldHJ5QXR0ZW1wdHM6IDIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UHJvamVjdEV2ZW50c1JvbGU1QjdEOTNGNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3BlY2lmeWluZyByZXRyeSBwb2xpY3kgd2l0aCAwIHJldHJ5QXR0ZW1wdHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIGhvdXIpJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZXZlbnRJbnB1dCA9IHtcbiAgICAgIGJ1aWxkc3BlY092ZXJyaWRlOiAnYnVpbGRzcGVjcy9ob3VybHkueW1sJyxcbiAgICB9O1xuXG4gICAgcnVsZS5hZGRUYXJnZXQoXG4gICAgICBuZXcgdGFyZ2V0cy5Db2RlQnVpbGRQcm9qZWN0KHByb2plY3QsIHtcbiAgICAgICAgZXZlbnQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdChldmVudElucHV0KSxcbiAgICAgICAgcmV0cnlBdHRlbXB0czogMCxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIGhvdXIpJyxcbiAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlQcm9qZWN0MzlGN0IwQUUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIElucHV0OiAne1wiYnVpbGRzcGVjT3ZlcnJpZGVcIjpcImJ1aWxkc3BlY3MvaG91cmx5LnltbFwifScsXG4gICAgICAgICAgUmV0cnlQb2xpY3k6IHtcbiAgICAgICAgICAgIE1heGltdW1SZXRyeUF0dGVtcHRzOiAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVByb2plY3RFdmVudHNSb2xlNUI3RDkzRjUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBhIERlYWQgTGV0dGVyIFF1ZXVlIGZvciB0aGUgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgIHNjaGVkdWxlOiBldmVudHMuU2NoZWR1bGUuZXhwcmVzc2lvbigncmF0ZSgxIGhvdXIpJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGV2ZW50SW5wdXQgPSB7XG4gICAgICBidWlsZHNwZWNPdmVycmlkZTogJ2J1aWxkc3BlY3MvaG91cmx5LnltbCcsXG4gICAgfTtcblxuICAgIHJ1bGUuYWRkVGFyZ2V0KFxuICAgICAgbmV3IHRhcmdldHMuQ29kZUJ1aWxkUHJvamVjdChwcm9qZWN0LCB7XG4gICAgICAgIGV2ZW50OiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoZXZlbnRJbnB1dCksXG4gICAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogcXVldWUsXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFybjogcHJvamVjdEFybixcbiAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgIERlYWRMZXR0ZXJDb25maWc6IHtcbiAgICAgICAgICAgIEFybjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnUXVldWU0QTdFMzU1NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSW5wdXQ6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5wdXQpLFxuICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydNeVByb2plY3RFdmVudHNSb2xlNUI3RDkzRjUnLCAnQXJuJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlUG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBBcm5FcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnUnVsZTRDOTk1QjdGJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdldmVudHMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1F1ZXVlNEE3RTM1NTUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNpZDogJ0FsbG93RXZlbnRSdWxlUnVsZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFF1ZXVlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnUXVldWU0QTdFMzU1NScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19