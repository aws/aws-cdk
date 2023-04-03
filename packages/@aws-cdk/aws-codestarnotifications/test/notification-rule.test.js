"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const helpers_1 = require("./helpers");
const notifications = require("../lib");
describe('NotificationRule', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('created new notification rule with source', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
        });
    });
    test('created new notification rule from repository source', () => {
        const repository = new helpers_1.FakeCodeCommit();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: repository,
            events: [
                'codecommit-repository-pull-request-created',
                'codecommit-repository-pull-request-merged',
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Resource: repository.repositoryArn,
            EventTypeIds: [
                'codecommit-repository-pull-request-created',
                'codecommit-repository-pull-request-merged',
            ],
        });
    });
    test('created new notification rule with all parameters in constructor props', () => {
        const project = new helpers_1.FakeCodeBuild();
        const slack = new helpers_1.FakeSlackTarget();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            notificationRuleName: 'MyNotificationRule',
            detailType: notifications.DetailType.FULL,
            events: [
                'codebuild-project-build-state-succeeded',
                'codebuild-project-build-state-failed',
            ],
            source: project,
            targets: [slack],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyNotificationRule',
            DetailType: 'FULL',
            EventTypeIds: [
                'codebuild-project-build-state-succeeded',
                'codebuild-project-build-state-failed',
            ],
            Resource: project.projectArn,
            Targets: [
                {
                    TargetAddress: slack.slackChannelConfigurationArn,
                    TargetType: 'AWSChatbotSlack',
                },
            ],
        });
    });
    test('created new notification rule without name and will generate from the `id`', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRuleGeneratedFromId', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyNotificationRuleGeneratedFromId',
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
        });
    });
    test('generating name will cut if id length is over than 64 charts', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'ificationRuleGeneratedFromIdIsToooooooooooooooooooooooooooooLong',
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
        });
    });
    test('created new notification rule without detailType', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            notificationRuleName: 'MyNotificationRule',
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyNotificationRule',
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
            DetailType: 'FULL',
        });
    });
    test('created new notification rule with status DISABLED', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
            enabled: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyNotificationRule',
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
            Status: 'DISABLED',
        });
    });
    test('created new notification rule with status ENABLED', () => {
        const project = new helpers_1.FakeCodeBuild();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
            enabled: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Name: 'MyNotificationRule',
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
            Status: 'ENABLED',
        });
    });
    test('notification added targets', () => {
        const project = new helpers_1.FakeCodeBuild();
        const topic = new helpers_1.FakeSnsTopicTarget();
        const slack = new helpers_1.FakeSlackTarget();
        const rule = new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: project,
            events: ['codebuild-project-build-state-succeeded'],
        });
        rule.addTarget(slack);
        expect(rule.addTarget(topic)).toEqual(true);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Resource: project.projectArn,
            EventTypeIds: ['codebuild-project-build-state-succeeded'],
            Targets: [
                {
                    TargetAddress: slack.slackChannelConfigurationArn,
                    TargetType: 'AWSChatbotSlack',
                },
                {
                    TargetAddress: topic.topicArn,
                    TargetType: 'SNS',
                },
            ],
        });
    });
    test('will not add if notification added duplicating event', () => {
        const pipeline = new helpers_1.FakeCodePipeline();
        new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: pipeline,
            events: [
                'codepipeline-pipeline-pipeline-execution-succeeded',
                'codepipeline-pipeline-pipeline-execution-failed',
                'codepipeline-pipeline-pipeline-execution-succeeded',
                'codepipeline-pipeline-pipeline-execution-canceled',
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
            Resource: pipeline.pipelineArn,
            EventTypeIds: [
                'codepipeline-pipeline-pipeline-execution-succeeded',
                'codepipeline-pipeline-pipeline-execution-failed',
                'codepipeline-pipeline-pipeline-execution-canceled',
            ],
        });
    });
});
describe('NotificationRule from imported', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('from notification rule ARN', () => {
        const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
        expect(imported.notificationRuleArn).toEqual('arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
    });
    test('will not effect and return false when added targets if notification from imported', () => {
        const imported = notifications.NotificationRule.fromNotificationRuleArn(stack, 'MyNotificationRule', 'arn:aws:codestar-notifications::1234567890:notificationrule/1234567890abcdef');
        const slack = new helpers_1.FakeSlackTarget();
        expect(imported.addTarget(slack)).toEqual(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLHVDQU1tQjtBQUNuQix3Q0FBd0M7QUFFeEMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxJQUFJLEtBQWdCLENBQUM7SUFFckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSx1QkFBYSxFQUFFLENBQUM7UUFFcEMsSUFBSSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1lBQzlELE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLENBQUMseUNBQXlDLENBQUM7U0FDcEQsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOENBQThDLEVBQUU7WUFDOUYsUUFBUSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1lBQzVCLFlBQVksRUFBRSxDQUFDLHlDQUF5QyxDQUFDO1NBQzFELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxNQUFNLFVBQVUsR0FBRyxJQUFJLHdCQUFjLEVBQUUsQ0FBQztRQUV4QyxJQUFJLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7WUFDOUQsTUFBTSxFQUFFLFVBQVU7WUFDbEIsTUFBTSxFQUFFO2dCQUNOLDRDQUE0QztnQkFDNUMsMkNBQTJDO2FB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QThFLENBQUMsQ0FBQztJQUMvSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRkFBbUYsRUFBRSxHQUFHLEVBQUU7UUFDN0YsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFDakcsOEVBQThFLENBQUMsQ0FBQztRQUNsRixNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7XG4gIEZha2VDb2RlQnVpbGQsXG4gIEZha2VDb2RlUGlwZWxpbmUsXG4gIEZha2VDb2RlQ29tbWl0LFxuICBGYWtlU2xhY2tUYXJnZXQsXG4gIEZha2VTbnNUb3BpY1RhcmdldCxcbn0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCAqIGFzIG5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ05vdGlmaWNhdGlvblJ1bGUnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIG5ldyBub3RpZmljYXRpb24gcnVsZSB3aXRoIHNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IEZha2VDb2RlQnVpbGQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBSZXNvdXJjZTogcHJvamVjdC5wcm9qZWN0QXJuLFxuICAgICAgRXZlbnRUeXBlSWRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIG5ldyBub3RpZmljYXRpb24gcnVsZSBmcm9tIHJlcG9zaXRvcnkgc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgRmFrZUNvZGVDb21taXQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBzb3VyY2U6IHJlcG9zaXRvcnksXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1wdWxsLXJlcXVlc3QtY3JlYXRlZCcsXG4gICAgICAgICdjb2RlY29tbWl0LXJlcG9zaXRvcnktcHVsbC1yZXF1ZXN0LW1lcmdlZCcsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgUmVzb3VyY2U6IHJlcG9zaXRvcnkucmVwb3NpdG9yeUFybixcbiAgICAgIEV2ZW50VHlwZUlkczogW1xuICAgICAgICAnY29kZWNvbW1pdC1yZXBvc2l0b3J5LXB1bGwtcmVxdWVzdC1jcmVhdGVkJyxcbiAgICAgICAgJ2NvZGVjb21taXQtcmVwb3NpdG9yeS1wdWxsLXJlcXVlc3QtbWVyZ2VkJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZWQgbmV3IG5vdGlmaWNhdGlvbiBydWxlIHdpdGggYWxsIHBhcmFtZXRlcnMgaW4gY29uc3RydWN0b3IgcHJvcHMnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBGYWtlQ29kZUJ1aWxkKCk7XG4gICAgY29uc3Qgc2xhY2sgPSBuZXcgRmFrZVNsYWNrVGFyZ2V0KCk7XG5cbiAgICBuZXcgbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlKHN0YWNrLCAnTXlOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgbm90aWZpY2F0aW9uUnVsZU5hbWU6ICdNeU5vdGlmaWNhdGlvblJ1bGUnLFxuICAgICAgZGV0YWlsVHlwZTogbm90aWZpY2F0aW9ucy5EZXRhaWxUeXBlLkZVTEwsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCcsXG4gICAgICAgICdjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1mYWlsZWQnLFxuICAgICAgXSxcbiAgICAgIHNvdXJjZTogcHJvamVjdCxcbiAgICAgIHRhcmdldHM6IFtzbGFja10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBOYW1lOiAnTXlOb3RpZmljYXRpb25SdWxlJyxcbiAgICAgIERldGFpbFR5cGU6ICdGVUxMJyxcbiAgICAgIEV2ZW50VHlwZUlkczogW1xuICAgICAgICAnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJyxcbiAgICAgICAgJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLWZhaWxlZCcsXG4gICAgICBdLFxuICAgICAgUmVzb3VyY2U6IHByb2plY3QucHJvamVjdEFybixcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEFkZHJlc3M6IHNsYWNrLnNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4sXG4gICAgICAgICAgVGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIG5ldyBub3RpZmljYXRpb24gcnVsZSB3aXRob3V0IG5hbWUgYW5kIHdpbGwgZ2VuZXJhdGUgZnJvbSB0aGUgYGlkYCcsICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IEZha2VDb2RlQnVpbGQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGVHZW5lcmF0ZWRGcm9tSWQnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBOYW1lOiAnTXlOb3RpZmljYXRpb25SdWxlR2VuZXJhdGVkRnJvbUlkJyxcbiAgICAgIFJlc291cmNlOiBwcm9qZWN0LnByb2plY3RBcm4sXG4gICAgICBFdmVudFR5cGVJZHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dlbmVyYXRpbmcgbmFtZSB3aWxsIGN1dCBpZiBpZCBsZW5ndGggaXMgb3ZlciB0aGFuIDY0IGNoYXJ0cycsICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IEZha2VDb2RlQnVpbGQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGVHZW5lcmF0ZWRGcm9tSWRJc1Rvb29vb29vb29vb29vb29vb29vb29vb29vb29vb0xvbmcnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlU3Rhck5vdGlmaWNhdGlvbnM6Ok5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBOYW1lOiAnaWZpY2F0aW9uUnVsZUdlbmVyYXRlZEZyb21JZElzVG9vb29vb29vb29vb29vb29vb29vb29vb29vb29vTG9uZycsXG4gICAgICBSZXNvdXJjZTogcHJvamVjdC5wcm9qZWN0QXJuLFxuICAgICAgRXZlbnRUeXBlSWRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIG5ldyBub3RpZmljYXRpb24gcnVsZSB3aXRob3V0IGRldGFpbFR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBGYWtlQ29kZUJ1aWxkKCk7XG5cbiAgICBuZXcgbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlKHN0YWNrLCAnTXlOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgbm90aWZpY2F0aW9uUnVsZU5hbWU6ICdNeU5vdGlmaWNhdGlvblJ1bGUnLFxuICAgICAgc291cmNlOiBwcm9qZWN0LFxuICAgICAgZXZlbnRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgTmFtZTogJ015Tm90aWZpY2F0aW9uUnVsZScsXG4gICAgICBSZXNvdXJjZTogcHJvamVjdC5wcm9qZWN0QXJuLFxuICAgICAgRXZlbnRUeXBlSWRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgICAgRGV0YWlsVHlwZTogJ0ZVTEwnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIG5ldyBub3RpZmljYXRpb24gcnVsZSB3aXRoIHN0YXR1cyBESVNBQkxFRCcsICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IEZha2VDb2RlQnVpbGQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIE5hbWU6ICdNeU5vdGlmaWNhdGlvblJ1bGUnLFxuICAgICAgUmVzb3VyY2U6IHByb2plY3QucHJvamVjdEFybixcbiAgICAgIEV2ZW50VHlwZUlkczogWydjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1zdWNjZWVkZWQnXSxcbiAgICAgIFN0YXR1czogJ0RJU0FCTEVEJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlZCBuZXcgbm90aWZpY2F0aW9uIHJ1bGUgd2l0aCBzdGF0dXMgRU5BQkxFRCcsICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IEZha2VDb2RlQnVpbGQoKTtcblxuICAgIG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgTmFtZTogJ015Tm90aWZpY2F0aW9uUnVsZScsXG4gICAgICBSZXNvdXJjZTogcHJvamVjdC5wcm9qZWN0QXJuLFxuICAgICAgRXZlbnRUeXBlSWRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgICAgU3RhdHVzOiAnRU5BQkxFRCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ25vdGlmaWNhdGlvbiBhZGRlZCB0YXJnZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgRmFrZUNvZGVCdWlsZCgpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IEZha2VTbnNUb3BpY1RhcmdldCgpO1xuICAgIGNvbnN0IHNsYWNrID0gbmV3IEZha2VTbGFja1RhcmdldCgpO1xuXG4gICAgY29uc3QgcnVsZSA9IG5ldyBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUoc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLCB7XG4gICAgICBzb3VyY2U6IHByb2plY3QsXG4gICAgICBldmVudHM6IFsnY29kZWJ1aWxkLXByb2plY3QtYnVpbGQtc3RhdGUtc3VjY2VlZGVkJ10sXG4gICAgfSk7XG5cbiAgICBydWxlLmFkZFRhcmdldChzbGFjayk7XG5cbiAgICBleHBlY3QocnVsZS5hZGRUYXJnZXQodG9waWMpKS50b0VxdWFsKHRydWUpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgUmVzb3VyY2U6IHByb2plY3QucHJvamVjdEFybixcbiAgICAgIEV2ZW50VHlwZUlkczogWydjb2RlYnVpbGQtcHJvamVjdC1idWlsZC1zdGF0ZS1zdWNjZWVkZWQnXSxcbiAgICAgIFRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEFkZHJlc3M6IHNsYWNrLnNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4sXG4gICAgICAgICAgVGFyZ2V0VHlwZTogJ0FXU0NoYXRib3RTbGFjaycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRBZGRyZXNzOiB0b3BpYy50b3BpY0FybixcbiAgICAgICAgICBUYXJnZXRUeXBlOiAnU05TJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpbGwgbm90IGFkZCBpZiBub3RpZmljYXRpb24gYWRkZWQgZHVwbGljYXRpbmcgZXZlbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgRmFrZUNvZGVQaXBlbGluZSgpO1xuXG4gICAgbmV3IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZShzdGFjaywgJ015Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIHNvdXJjZTogcGlwZWxpbmUsXG4gICAgICBldmVudHM6IFtcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tc3VjY2VlZGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tZmFpbGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tc3VjY2VlZGVkJyxcbiAgICAgICAgJ2NvZGVwaXBlbGluZS1waXBlbGluZS1waXBlbGluZS1leGVjdXRpb24tY2FuY2VsZWQnLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVTdGFyTm90aWZpY2F0aW9uczo6Tm90aWZpY2F0aW9uUnVsZScsIHtcbiAgICAgIFJlc291cmNlOiBwaXBlbGluZS5waXBlbGluZUFybixcbiAgICAgIEV2ZW50VHlwZUlkczogW1xuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXBpcGVsaW5lLWV4ZWN1dGlvbi1zdWNjZWVkZWQnLFxuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXBpcGVsaW5lLWV4ZWN1dGlvbi1mYWlsZWQnLFxuICAgICAgICAnY29kZXBpcGVsaW5lLXBpcGVsaW5lLXBpcGVsaW5lLWV4ZWN1dGlvbi1jYW5jZWxlZCcsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTm90aWZpY2F0aW9uUnVsZSBmcm9tIGltcG9ydGVkJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbSBub3RpZmljYXRpb24gcnVsZSBBUk4nLCAoKSA9PiB7XG4gICAgY29uc3QgaW1wb3J0ZWQgPSBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUuZnJvbU5vdGlmaWNhdGlvblJ1bGVBcm4oc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLFxuICAgICAgJ2Fybjphd3M6Y29kZXN0YXItbm90aWZpY2F0aW9uczo6MTIzNDU2Nzg5MDpub3RpZmljYXRpb25ydWxlLzEyMzQ1Njc4OTBhYmNkZWYnKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQubm90aWZpY2F0aW9uUnVsZUFybikudG9FcXVhbCgnYXJuOmF3czpjb2Rlc3Rhci1ub3RpZmljYXRpb25zOjoxMjM0NTY3ODkwOm5vdGlmaWNhdGlvbnJ1bGUvMTIzNDU2Nzg5MGFiY2RlZicpO1xuICB9KTtcblxuICB0ZXN0KCd3aWxsIG5vdCBlZmZlY3QgYW5kIHJldHVybiBmYWxzZSB3aGVuIGFkZGVkIHRhcmdldHMgaWYgbm90aWZpY2F0aW9uIGZyb20gaW1wb3J0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW1wb3J0ZWQgPSBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUuZnJvbU5vdGlmaWNhdGlvblJ1bGVBcm4oc3RhY2ssICdNeU5vdGlmaWNhdGlvblJ1bGUnLFxuICAgICAgJ2Fybjphd3M6Y29kZXN0YXItbm90aWZpY2F0aW9uczo6MTIzNDU2Nzg5MDpub3RpZmljYXRpb25ydWxlLzEyMzQ1Njc4OTBhYmNkZWYnKTtcbiAgICBjb25zdCBzbGFjayA9IG5ldyBGYWtlU2xhY2tUYXJnZXQoKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQuYWRkVGFyZ2V0KHNsYWNrKSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xufSk7Il19