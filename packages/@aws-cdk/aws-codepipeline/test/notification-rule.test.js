"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codepipeline = require("../lib");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
describe('pipeline with codestar notification integration', () => {
    let stack;
    let pipeline;
    let sourceArtifact;
    beforeEach(() => {
        stack = new cdk.Stack();
        sourceArtifact = new codepipeline.Artifact();
        pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [new fake_source_action_1.FakeSourceAction({ actionName: 'Fetch', output: sourceArtifact })],
                },
                {
                    stageName: 'Build',
                    actions: [new fake_build_action_1.FakeBuildAction({ actionName: 'Gcc', input: sourceArtifact })],
                },
            ],
        });
    });
    test('On "Pipeline" execution events emitted notification rule', () => {
        const target = {
            bindAsNotificationRuleTarget: () => ({
                targetType: 'AWSChatbotSlack',
                targetAddress: 'SlackID',
            }),
        };
        pipeline.notifyOnExecutionStateChange('NotifyOnExecutionStateChange', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'PipelineNotifyOnExecutionStateChange9FE60973',
            DetailType: 'FULL',
            EventTypeIds: [
                'codepipeline-pipeline-pipeline-execution-failed',
                'codepipeline-pipeline-pipeline-execution-canceled',
                'codepipeline-pipeline-pipeline-execution-started',
                'codepipeline-pipeline-pipeline-execution-resumed',
                'codepipeline-pipeline-pipeline-execution-succeeded',
                'codepipeline-pipeline-pipeline-execution-superseded',
            ],
            Resource: {
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
            },
            Targets: [
                {
                    TargetAddress: 'SlackID',
                    TargetType: 'AWSChatbotSlack',
                },
            ],
        });
    });
    test('On any "Stage" execution events emitted notification rule in pipeline', () => {
        const target = {
            bindAsNotificationRuleTarget: () => ({
                targetType: 'AWSChatbotSlack',
                targetAddress: 'SlackID',
            }),
        };
        pipeline.notifyOnAnyStageStateChange('NotifyOnAnyStageStateChange', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'PipelineNotifyOnAnyStageStateChange05355CCD',
            DetailType: 'FULL',
            EventTypeIds: [
                'codepipeline-pipeline-stage-execution-canceled',
                'codepipeline-pipeline-stage-execution-failed',
                'codepipeline-pipeline-stage-execution-resumed',
                'codepipeline-pipeline-stage-execution-started',
                'codepipeline-pipeline-stage-execution-succeeded',
            ],
            Resource: {
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
            },
            Targets: [
                {
                    TargetAddress: 'SlackID',
                    TargetType: 'AWSChatbotSlack',
                },
            ],
        });
    });
    test('On any "Action" execution events emitted notification rule in pipeline', () => {
        const target = {
            bindAsNotificationRuleTarget: () => ({
                targetType: 'AWSChatbotSlack',
                targetAddress: 'SlackID',
            }),
        };
        pipeline.notifyOnAnyActionStateChange('NotifyOnAnyActionStateChange', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'PipelineNotifyOnAnyActionStateChange64D5B2AA',
            DetailType: 'FULL',
            EventTypeIds: [
                'codepipeline-pipeline-action-execution-canceled',
                'codepipeline-pipeline-action-execution-failed',
                'codepipeline-pipeline-action-execution-started',
                'codepipeline-pipeline-action-execution-succeeded',
            ],
            Resource: {
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
            },
            Targets: [
                {
                    TargetAddress: 'SlackID',
                    TargetType: 'AWSChatbotSlack',
                },
            ],
        });
    });
    test('On any "Manual approval" execution events emitted notification rule in pipeline', () => {
        const target = {
            bindAsNotificationRuleTarget: () => ({
                targetType: 'AWSChatbotSlack',
                targetAddress: 'SlackID',
            }),
        };
        pipeline.notifyOnAnyManualApprovalStateChange('NotifyOnAnyManualApprovalStateChange', target);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'PipelineNotifyOnAnyManualApprovalStateChangeE60778F7',
            DetailType: 'FULL',
            EventTypeIds: [
                'codepipeline-pipeline-manual-approval-failed',
                'codepipeline-pipeline-manual-approval-needed',
                'codepipeline-pipeline-manual-approval-succeeded',
            ],
            Resource: {
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
            },
            Targets: [
                {
                    TargetAddress: 'SlackID',
                    TargetType: 'AWSChatbotSlack',
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLHVDQUF1QztBQUN2QywyREFBc0Q7QUFDdEQsNkRBQXdEO0FBRXhELFFBQVEsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7SUFDL0QsSUFBSSxLQUFnQixDQUFDO0lBQ3JCLElBQUksUUFBK0IsQ0FBQztJQUNwQyxJQUFJLGNBQXFDLENBQUM7SUFDMUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0MsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3RELE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxTQUFTLEVBQUUsUUFBUTtvQkFDbkIsT0FBTyxFQUFFLENBQUMsSUFBSSxxQ0FBZ0IsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7aUJBQ2pGO2dCQUNEO29CQUNFLFNBQVMsRUFBRSxPQUFPO29CQUNsQixPQUFPLEVBQUUsQ0FBQyxJQUFJLG1DQUFlLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RTthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLE1BQU0sTUFBTSxHQUFHO1lBQ2IsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDbkMsVUFBVSxFQUFFLGlC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QUNoQixFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7d0JBQ3RCLEdBQUc7d0JBQ0gsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0JBQ3pCLEdBQUc7d0JBQ0gsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7cUJBQzVCLENBQUM7YUFDSDtZQUNELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxhQUFhLEVBQUUsU0FBUztvQkFDeEIsVUFBVSxFQUFFLGlCQUFpQjtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBGYWtlQnVpbGRBY3Rpb24gfSBmcm9tICcuL2Zha2UtYnVpbGQtYWN0aW9uJztcbmltcG9ydCB7IEZha2VTb3VyY2VBY3Rpb24gfSBmcm9tICcuL2Zha2Utc291cmNlLWFjdGlvbic7XG5cbmRlc2NyaWJlKCdwaXBlbGluZSB3aXRoIGNvZGVzdGFyIG5vdGlmaWNhdGlvbiBpbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG4gIGxldCBwaXBlbGluZTogY29kZXBpcGVsaW5lLlBpcGVsaW5lO1xuICBsZXQgc291cmNlQXJ0aWZhY3Q6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzdGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHsgYWN0aW9uTmFtZTogJ0ZldGNoJywgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCB9KV0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlQnVpbGRBY3Rpb24oeyBhY3Rpb25OYW1lOiAnR2NjJywgaW5wdXQ6IHNvdXJjZUFydGlmYWN0IH0pXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ09uIFwiUGlwZWxpbmVcIiBleGVjdXRpb24gZXZlbnRzIGVtaXR0ZWQgbm90aWZpY2F0aW9uIHJ1bGUnLCAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge1xuICAgICAgYmluZEFzTm90aWZpY2F0aW9uUnVsZVRhcmdldDogKCkgPT4gKHtcbiAgICAgICAgdGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIHRhcmdldEFkZHJlc3M6ICdTbGFja0lEJyxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICBwaXBlbGluZS5ub3RpZnlPbkV4ZWN1dGlvblN0YXRlQ2hhbmdlKCdOb3RpZnlPbkV4ZWN1dGlvblN0YXRlQ2hhbmdlJywgdGFyZ2V0KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIE5hbWU6ICdQaXBlbGluZU5vdGlmeU9uRXhlY3V0aW9uU3RhdGVDaGFuZ2U5RkU2MDk3MycsXG4gICAgICBEZXRhaWxUeXBlOiAnRlVMTCcsXG4gICAgICBFdmVudFR5cGVJZHM6IFtcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tZmFpbGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tY2FuY2VsZWQnLFxuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXBpcGVsaW5lLWV4ZWN1dGlvbi1zdGFydGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tcmVzdW1lZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtcGlwZWxpbmUtZXhlY3V0aW9uLXN1Y2NlZWRlZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtcGlwZWxpbmUtZXhlY3V0aW9uLXN1cGVyc2VkZWQnLFxuICAgICAgXSxcbiAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICc6Y29kZXBpcGVsaW5lOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdQaXBlbGluZUM2NjA5MTdEJyB9LFxuICAgICAgICBdXSxcbiAgICAgIH0sXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRBZGRyZXNzOiAnU2xhY2tJRCcsXG4gICAgICAgICAgVGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdPbiBhbnkgXCJTdGFnZVwiIGV4ZWN1dGlvbiBldmVudHMgZW1pdHRlZCBub3RpZmljYXRpb24gcnVsZSBpbiBwaXBlbGluZScsICgpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSB7XG4gICAgICBiaW5kQXNOb3RpZmljYXRpb25SdWxlVGFyZ2V0OiAoKSA9PiAoe1xuICAgICAgICB0YXJnZXRUeXBlOiAnQVdTQ2hhdGJvdFNsYWNrJyxcbiAgICAgICAgdGFyZ2V0QWRkcmVzczogJ1NsYWNrSUQnLFxuICAgICAgfSksXG4gICAgfTtcblxuICAgIHBpcGVsaW5lLm5vdGlmeU9uQW55U3RhZ2VTdGF0ZUNoYW5nZSgnTm90aWZ5T25BbnlTdGFnZVN0YXRlQ2hhbmdlJywgdGFyZ2V0KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIE5hbWU6ICdQaXBlbGluZU5vdGlmeU9uQW55U3RhZ2VTdGF0ZUNoYW5nZTA1MzU1Q0NEJyxcbiAgICAgIERldGFpbFR5cGU6ICdGVUxMJyxcbiAgICAgIEV2ZW50VHlwZUlkczogW1xuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXN0YWdlLWV4ZWN1dGlvbi1jYW5jZWxlZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtc3RhZ2UtZXhlY3V0aW9uLWZhaWxlZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtc3RhZ2UtZXhlY3V0aW9uLXJlc3VtZWQnLFxuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXN0YWdlLWV4ZWN1dGlvbi1zdGFydGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1zdGFnZS1leGVjdXRpb24tc3VjY2VlZGVkJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAnOmNvZGVwaXBlbGluZTonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnUGlwZWxpbmVDNjYwOTE3RCcgfSxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0QWRkcmVzczogJ1NsYWNrSUQnLFxuICAgICAgICAgIFRhcmdldFR5cGU6ICdBV1NDaGF0Ym90U2xhY2snLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnT24gYW55IFwiQWN0aW9uXCIgZXhlY3V0aW9uIGV2ZW50cyBlbWl0dGVkIG5vdGlmaWNhdGlvbiBydWxlIGluIHBpcGVsaW5lJywgKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHtcbiAgICAgIGJpbmRBc05vdGlmaWNhdGlvblJ1bGVUYXJnZXQ6ICgpID0+ICh7XG4gICAgICAgIHRhcmdldFR5cGU6ICdBV1NDaGF0Ym90U2xhY2snLFxuICAgICAgICB0YXJnZXRBZGRyZXNzOiAnU2xhY2tJRCcsXG4gICAgICB9KSxcbiAgICB9O1xuXG4gICAgcGlwZWxpbmUubm90aWZ5T25BbnlBY3Rpb25TdGF0ZUNoYW5nZSgnTm90aWZ5T25BbnlBY3Rpb25TdGF0ZUNoYW5nZScsIHRhcmdldCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBOYW1lOiAnUGlwZWxpbmVOb3RpZnlPbkFueUFjdGlvblN0YXRlQ2hhbmdlNjRENUIyQUEnLFxuICAgICAgRGV0YWlsVHlwZTogJ0ZVTEwnLFxuICAgICAgRXZlbnRUeXBlSWRzOiBbXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtYWN0aW9uLWV4ZWN1dGlvbi1jYW5jZWxlZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtYWN0aW9uLWV4ZWN1dGlvbi1mYWlsZWQnLFxuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLWFjdGlvbi1leGVjdXRpb24tc3RhcnRlZCcsXG4gICAgICAgICdjb2RlcGlwZWxpbmUtcGlwZWxpbmUtYWN0aW9uLWV4ZWN1dGlvbi1zdWNjZWVkZWQnLFxuICAgICAgXSxcbiAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICc6Y29kZXBpcGVsaW5lOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdQaXBlbGluZUM2NjA5MTdEJyB9LFxuICAgICAgICBdXSxcbiAgICAgIH0sXG4gICAgICBUYXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRBZGRyZXNzOiAnU2xhY2tJRCcsXG4gICAgICAgICAgVGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdPbiBhbnkgXCJNYW51YWwgYXBwcm92YWxcIiBleGVjdXRpb24gZXZlbnRzIGVtaXR0ZWQgbm90aWZpY2F0aW9uIHJ1bGUgaW4gcGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge1xuICAgICAgYmluZEFzTm90aWZpY2F0aW9uUnVsZVRhcmdldDogKCkgPT4gKHtcbiAgICAgICAgdGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIHRhcmdldEFkZHJlc3M6ICdTbGFja0lEJyxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICBwaXBlbGluZS5ub3RpZnlPbkFueU1hbnVhbEFwcHJvdmFsU3RhdGVDaGFuZ2UoJ05vdGlmeU9uQW55TWFudWFsQXBwcm92YWxTdGF0ZUNoYW5nZScsIHRhcmdldCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBOYW1lOiAnUGlwZWxpbmVOb3RpZnlPbkFueU1hbnVhbEFwcHJvdmFsU3RhdGVDaGFuZ2VFNjA3NzhGNycsXG4gICAgICBEZXRhaWxUeXBlOiAnRlVMTCcsXG4gICAgICBFdmVudFR5cGVJZHM6IFtcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1tYW51YWwtYXBwcm92YWwtZmFpbGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1tYW51YWwtYXBwcm92YWwtbmVlZGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1tYW51YWwtYXBwcm92YWwtc3VjY2VlZGVkJyxcbiAgICAgIF0sXG4gICAgICBSZXNvdXJjZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAnOmNvZGVwaXBlbGluZTonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnUGlwZWxpbmVDNjYwOTE3RCcgfSxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgICAgVGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0QWRkcmVzczogJ1NsYWNrSUQnLFxuICAgICAgICAgIFRhcmdldFR5cGU6ICdBV1NDaGF0Ym90U2xhY2snLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==