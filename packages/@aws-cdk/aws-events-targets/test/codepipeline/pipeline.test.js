"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const targets = require("../../lib");
describe('CodePipeline event target', () => {
    let stack;
    let pipeline;
    let pipelineArn;
    beforeEach(() => {
        stack = new core_1.Stack();
        pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
        const srcArtifact = new codepipeline.Artifact('Src');
        const buildArtifact = new codepipeline.Artifact('Bld');
        pipeline.addStage({
            stageName: 'Source',
            actions: [new TestAction({
                    actionName: 'Hello',
                    category: codepipeline.ActionCategory.SOURCE,
                    provider: 'x',
                    artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
                    outputs: [srcArtifact],
                })],
        });
        pipeline.addStage({
            stageName: 'Build',
            actions: [new TestAction({
                    actionName: 'Hello',
                    category: codepipeline.ActionCategory.BUILD,
                    provider: 'y',
                    inputs: [srcArtifact],
                    outputs: [buildArtifact],
                    artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 1, maxOutputs: 1 },
                })],
        });
        pipelineArn = {
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':codepipeline:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'PipelineC660917D' },
                ]],
        };
    });
    describe('when added to an event rule as a target', () => {
        let rule;
        beforeEach(() => {
            rule = new events.Rule(stack, 'rule', {
                schedule: events.Schedule.expression('rate(1 minute)'),
            });
        });
        describe('with default settings', () => {
            beforeEach(() => {
                rule.addTarget(new targets.CodePipeline(pipeline));
            });
            test("adds the pipeline's ARN and role to the targets of the rule", () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                    Targets: [
                        {
                            Arn: pipelineArn,
                            Id: 'Target0',
                            RoleArn: { 'Fn::GetAtt': ['PipelineEventsRole46BEEA7C', 'Arn'] },
                        },
                    ],
                });
            });
            test("creates a policy that has StartPipeline permissions on the pipeline's ARN", () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'codepipeline:StartPipelineExecution',
                                Effect: 'Allow',
                                Resource: pipelineArn,
                            },
                        ],
                        Version: '2012-10-17',
                    },
                });
            });
        });
        describe('with retry policy and dead letter queue', () => {
            test('adds retry attempts and maxEventAge to the target configuration', () => {
                // WHEN
                let queue = new sqs.Queue(stack, 'dlq');
                rule.addTarget(new targets.CodePipeline(pipeline, {
                    retryAttempts: 2,
                    maxEventAge: core_1.Duration.hours(2),
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
                                        ':codepipeline:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':',
                                        {
                                            Ref: 'PipelineC660917D',
                                        },
                                    ],
                                ],
                            },
                            DeadLetterConfig: {
                                Arn: {
                                    'Fn::GetAtt': [
                                        'dlq09C78ACC',
                                        'Arn',
                                    ],
                                },
                            },
                            Id: 'Target0',
                            RetryPolicy: {
                                MaximumEventAgeInSeconds: 7200,
                                MaximumRetryAttempts: 2,
                            },
                            RoleArn: {
                                'Fn::GetAtt': [
                                    'PipelineEventsRole46BEEA7C',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                });
            });
            test('adds 0 retry attempts to the target configuration', () => {
                // WHEN
                rule.addTarget(new targets.CodePipeline(pipeline, {
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
                                        ':codepipeline:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':',
                                        {
                                            Ref: 'PipelineC660917D',
                                        },
                                    ],
                                ],
                            },
                            Id: 'Target0',
                            RetryPolicy: {
                                MaximumRetryAttempts: 0,
                            },
                            RoleArn: {
                                'Fn::GetAtt': [
                                    'PipelineEventsRole46BEEA7C',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                });
            });
        });
        describe('with an explicit event role', () => {
            beforeEach(() => {
                const role = new iam.Role(stack, 'MyExampleRole', {
                    assumedBy: new iam.AnyPrincipal(),
                });
                const roleResource = role.node.defaultChild;
                roleResource.overrideLogicalId('MyRole'); // to make it deterministic in the assertion below
                rule.addTarget(new targets.CodePipeline(pipeline, {
                    eventRole: role,
                }));
            });
            test("points at the given event role in the rule's targets", () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                    Targets: [
                        {
                            Arn: pipelineArn,
                            RoleArn: { 'Fn::GetAtt': ['MyRole', 'Arn'] },
                        },
                    ],
                });
            });
        });
    });
});
class TestAction {
    constructor(actionProperties) {
        this.actionProperties = actionProperties;
    }
    bind(_scope, _stage, _options) {
        return {};
    }
    onStateChange(_name, _target, _options) {
        throw new Error('onStateChange() is not available on MockAction');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsMERBQTBEO0FBQzFELDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUE0RDtBQUU1RCxxQ0FBcUM7QUFFckMsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxJQUFJLEtBQVksQ0FBQztJQUNqQixJQUFJLFFBQStCLENBQUM7SUFDcEMsSUFBSSxXQUFnQixDQUFDO0lBRXJCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUNwQixRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RCxNQUFNLFdBQVcsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEIsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUM7b0JBQ3ZCLFVBQVUsRUFBRSxPQUFPO29CQUNuQixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO29CQUM1QyxRQUFRLEVBQUUsR0FBRztvQkFDYixjQUFjLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFO29CQUM1RSxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3ZCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FB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QUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUEwQixDQUFDO2dCQUMxRCxZQUFZLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrREFBa0Q7Z0JBRTVGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTtvQkFDaEQsU0FBUyxFQUFFLElBQUk7aUJBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO2dCQUNoRSxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbkUsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLEdBQUcsRUFBRSxXQUFXOzRCQUNoQixPQUFPLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7eUJBQzdDO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxVQUFVO0lBQ2QsWUFBNEIsZ0JBQStDO1FBQS9DLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBK0I7S0FFMUU7SUFFTSxJQUFJLENBQUMsTUFBaUIsRUFBRSxNQUEyQixFQUFFLFFBQXdDO1FBRWxHLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFTSxhQUFhLENBQUMsS0FBYSxFQUFFLE9BQTRCLEVBQUUsUUFBMkI7UUFDM0YsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0tBQ25FO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zcXMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCwgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ0NvZGVQaXBlbGluZSBldmVudCB0YXJnZXQnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG4gIGxldCBwaXBlbGluZTogY29kZXBpcGVsaW5lLlBpcGVsaW5lO1xuICBsZXQgcGlwZWxpbmVBcm46IGFueTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG4gICAgY29uc3Qgc3JjQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTcmMnKTtcbiAgICBjb25zdCBidWlsZEFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQmxkJyk7XG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtuZXcgVGVzdEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdIZWxsbycsXG4gICAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuU09VUkNFLFxuICAgICAgICBwcm92aWRlcjogJ3gnLFxuICAgICAgICBhcnRpZmFjdEJvdW5kczogeyBtaW5JbnB1dHM6IDAsIG1heElucHV0czogMCwgbWluT3V0cHV0czogMSwgbWF4T3V0cHV0czogMSB9LFxuICAgICAgICBvdXRwdXRzOiBbc3JjQXJ0aWZhY3RdLFxuICAgICAgfSldLFxuICAgIH0pO1xuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgIGFjdGlvbnM6IFtuZXcgVGVzdEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdIZWxsbycsXG4gICAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuQlVJTEQsXG4gICAgICAgIHByb3ZpZGVyOiAneScsXG4gICAgICAgIGlucHV0czogW3NyY0FydGlmYWN0XSxcbiAgICAgICAgb3V0cHV0czogW2J1aWxkQXJ0aWZhY3RdLFxuICAgICAgICBhcnRpZmFjdEJvdW5kczogeyBtaW5JbnB1dHM6IDEsIG1heElucHV0czogMSwgbWluT3V0cHV0czogMSwgbWF4T3V0cHV0czogMSB9LFxuICAgICAgfSldLFxuICAgIH0pO1xuICAgIHBpcGVsaW5lQXJuID0ge1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICdhcm46JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgJzpjb2RlcGlwZWxpbmU6JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgJzonLFxuICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAnOicsXG4gICAgICAgIHsgUmVmOiAnUGlwZWxpbmVDNjYwOTE3RCcgfSxcbiAgICAgIF1dLFxuICAgIH07XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGFkZGVkIHRvIGFuIGV2ZW50IHJ1bGUgYXMgYSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgbGV0IHJ1bGU6IGV2ZW50cy5SdWxlO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHN0YWNrLCAncnVsZScsIHtcbiAgICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5leHByZXNzaW9uKCdyYXRlKDEgbWludXRlKScpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBkZWZhdWx0IHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNvZGVQaXBlbGluZShwaXBlbGluZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJhZGRzIHRoZSBwaXBlbGluZSdzIEFSTiBhbmQgcm9sZSB0byB0aGUgdGFyZ2V0cyBvZiB0aGUgcnVsZVwiLCAoKSA9PiB7XG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFybjogcGlwZWxpbmVBcm4sXG4gICAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICAgIFJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ1BpcGVsaW5lRXZlbnRzUm9sZTQ2QkVFQTdDJywgJ0FybiddIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJjcmVhdGVzIGEgcG9saWN5IHRoYXQgaGFzIFN0YXJ0UGlwZWxpbmUgcGVybWlzc2lvbnMgb24gdGhlIHBpcGVsaW5lJ3MgQVJOXCIsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnY29kZXBpcGVsaW5lOlN0YXJ0UGlwZWxpbmVFeGVjdXRpb24nLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogcGlwZWxpbmVBcm4sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCByZXRyeSBwb2xpY3kgYW5kIGRlYWQgbGV0dGVyIHF1ZXVlJywgKCkgPT4ge1xuICAgICAgdGVzdCgnYWRkcyByZXRyeSBhdHRlbXB0cyBhbmQgbWF4RXZlbnRBZ2UgdG8gdGhlIHRhcmdldCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGxldCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdkbHEnKTtcblxuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5Db2RlUGlwZWxpbmUocGlwZWxpbmUsIHtcbiAgICAgICAgICByZXRyeUF0dGVtcHRzOiAyLFxuICAgICAgICAgIG1heEV2ZW50QWdlOiBEdXJhdGlvbi5ob3VycygyKSxcbiAgICAgICAgICBkZWFkTGV0dGVyUXVldWU6IHF1ZXVlLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIG1pbnV0ZSknLFxuICAgICAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmNvZGVwaXBlbGluZTonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1BpcGVsaW5lQzY2MDkxN0QnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBEZWFkTGV0dGVyQ29uZmlnOiB7XG4gICAgICAgICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2RscTA5Qzc4QUNDJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICAgIFJldHJ5UG9saWN5OiB7XG4gICAgICAgICAgICAgICAgTWF4aW11bUV2ZW50QWdlSW5TZWNvbmRzOiA3MjAwLFxuICAgICAgICAgICAgICAgIE1heGltdW1SZXRyeUF0dGVtcHRzOiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUGlwZWxpbmVFdmVudHNSb2xlNDZCRUVBN0MnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnYWRkcyAwIHJldHJ5IGF0dGVtcHRzIHRvIHRoZSB0YXJnZXQgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBydWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5Db2RlUGlwZWxpbmUocGlwZWxpbmUsIHtcbiAgICAgICAgICByZXRyeUF0dGVtcHRzOiAwLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICAgU2NoZWR1bGVFeHByZXNzaW9uOiAncmF0ZSgxIG1pbnV0ZSknLFxuICAgICAgICAgIFN0YXRlOiAnRU5BQkxFRCcsXG4gICAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBcm46IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmNvZGVwaXBlbGluZTonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1BpcGVsaW5lQzY2MDkxN0QnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBJZDogJ1RhcmdldDAnLFxuICAgICAgICAgICAgICBSZXRyeVBvbGljeToge1xuICAgICAgICAgICAgICAgIE1heGltdW1SZXRyeUF0dGVtcHRzOiAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSb2xlQXJuOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUGlwZWxpbmVFdmVudHNSb2xlNDZCRUVBN0MnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGFuIGV4cGxpY2l0IGV2ZW50IHJvbGUnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ015RXhhbXBsZVJvbGUnLCB7XG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgcm9sZVJlc291cmNlID0gcm9sZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5FbGVtZW50O1xuICAgICAgICByb2xlUmVzb3VyY2Uub3ZlcnJpZGVMb2dpY2FsSWQoJ015Um9sZScpOyAvLyB0byBtYWtlIGl0IGRldGVybWluaXN0aWMgaW4gdGhlIGFzc2VydGlvbiBiZWxvd1xuXG4gICAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkNvZGVQaXBlbGluZShwaXBlbGluZSwge1xuICAgICAgICAgIGV2ZW50Um9sZTogcm9sZSxcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoXCJwb2ludHMgYXQgdGhlIGdpdmVuIGV2ZW50IHJvbGUgaW4gdGhlIHJ1bGUncyB0YXJnZXRzXCIsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQXJuOiBwaXBlbGluZUFybixcbiAgICAgICAgICAgICAgUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlSb2xlJywgJ0FybiddIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFRlc3RBY3Rpb24gaW1wbGVtZW50cyBjb2RlcGlwZWxpbmUuSUFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBhY3Rpb25Qcm9wZXJ0aWVzOiBjb2RlcGlwZWxpbmUuQWN0aW9uUHJvcGVydGllcykge1xuICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIF9vcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShfbmFtZTogc3RyaW5nLCBfdGFyZ2V0PzogZXZlbnRzLklSdWxlVGFyZ2V0LCBfb3B0aW9ucz86IGV2ZW50cy5SdWxlUHJvcHMpOiBldmVudHMuUnVsZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvblN0YXRlQ2hhbmdlKCkgaXMgbm90IGF2YWlsYWJsZSBvbiBNb2NrQWN0aW9uJyk7XG4gIH1cbn1cbiJdfQ==