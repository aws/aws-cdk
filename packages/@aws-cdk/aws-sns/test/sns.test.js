"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const notifications = require("@aws-cdk/aws-codestarnotifications");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const cdk = require("@aws-cdk/core");
const sns = require("../lib");
/* eslint-disable quote-props */
describe('Topic', () => {
    describe('topic tests', () => {
        test('all defaults', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic');
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::SNS::Topic', 1);
        });
        test('specify topicName', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                topicName: 'topicName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'TopicName': 'topicName',
            });
        });
        test('specify displayName', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                displayName: 'displayName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'DisplayName': 'displayName',
            });
        });
        test('specify kmsMasterKey', () => {
            const stack = new cdk.Stack();
            const key = new kms.Key(stack, 'CustomKey');
            new sns.Topic(stack, 'MyTopic', {
                masterKey: key,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'KmsMasterKeyId': { 'Fn::GetAtt': ['CustomKey1E6D0D07', 'Arn'] },
            });
        });
        test('specify displayName and topicName', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                topicName: 'topicName',
                displayName: 'displayName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'DisplayName': 'displayName',
                'TopicName': 'topicName',
            });
        });
        test('Adds .fifo suffix when no topicName is passed', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                fifo: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'FifoTopic': true,
                'TopicName': 'MyTopic.fifo',
            });
        });
        test('specify fifo without .fifo suffix in topicName', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                fifo: true,
                topicName: 'topicName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'FifoTopic': true,
                'TopicName': 'topicName.fifo',
            });
        });
        test('specify fifo with .fifo suffix in topicName', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                fifo: true,
                topicName: 'topicName.fifo',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'FifoTopic': true,
                'TopicName': 'topicName.fifo',
            });
        });
        test('specify fifo without contentBasedDeduplication', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                fifo: true,
                topicName: 'topicName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'FifoTopic': true,
                'TopicName': 'topicName.fifo',
            });
        });
        test('specify fifo with contentBasedDeduplication', () => {
            const stack = new cdk.Stack();
            new sns.Topic(stack, 'MyTopic', {
                contentBasedDeduplication: true,
                fifo: true,
                topicName: 'topicName',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
                'ContentBasedDeduplication': true,
                'FifoTopic': true,
                'TopicName': 'topicName.fifo',
            });
        });
        test('throw with contentBasedDeduplication on non-fifo topic', () => {
            const stack = new cdk.Stack();
            expect(() => new sns.Topic(stack, 'MyTopic', {
                contentBasedDeduplication: true,
            })).toThrow(/Content based deduplication can only be enabled for FIFO SNS topics./);
        });
    });
    test('can add a policy to the topic', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        topic.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['sns:*'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        'Sid': '0',
                        'Action': 'sns:*',
                        'Effect': 'Allow',
                        'Principal': { 'AWS': 'arn' },
                        'Resource': '*',
                    }],
            },
        });
    });
    test('give publishing permissions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'Topic');
        const user = new iam.User(stack, 'User');
        // WHEN
        topic.grantPublish(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                Version: '2012-10-17',
                'Statement': [
                    {
                        'Action': 'sns:Publish',
                        'Effect': 'Allow',
                        'Resource': stack.resolve(topic.topicArn),
                    },
                ],
            },
        });
    });
    test('TopicPolicy passed document', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'MyTopic');
        const ps = new iam.PolicyStatement({
            actions: ['service:statement0'],
            principals: [new iam.ArnPrincipal('arn')],
        });
        // WHEN
        new sns.TopicPolicy(stack, 'topicpolicy', { topics: [topic], policyDocument: new iam.PolicyDocument({ assignSids: true, statements: [ps] }) });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': 'service:statement0',
                        'Effect': 'Allow',
                        'Principal': { 'AWS': 'arn' },
                        'Sid': '0',
                    },
                ],
                'Version': '2012-10-17',
            },
            'Topics': [
                {
                    'Ref': 'MyTopic86869434',
                },
            ],
        });
    });
    test('Add statements to policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'MyTopic');
        // WHEN
        const topicPolicy = new sns.TopicPolicy(stack, 'TopicPolicy', {
            topics: [topic],
        });
        topicPolicy.document.addStatements(new iam.PolicyStatement({
            actions: ['service:statement0'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': 'service:statement0',
                        'Effect': 'Allow',
                        'Principal': { 'AWS': 'arn' },
                        'Sid': '0',
                    },
                ],
                'Version': '2012-10-17',
            },
            'Topics': [
                {
                    'Ref': 'MyTopic86869434',
                },
            ],
        });
    });
    test('topic resource policy includes unique SIDs', () => {
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'MyTopic');
        topic.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['service:statement0'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        topic.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['service:statement1'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': 'service:statement0',
                        'Effect': 'Allow',
                        'Principal': { 'AWS': 'arn' },
                        'Sid': '0',
                    },
                    {
                        'Action': 'service:statement1',
                        'Effect': 'Allow',
                        'Principal': { 'AWS': 'arn' },
                        'Sid': '1',
                    },
                ],
                'Version': '2012-10-17',
            },
            'Topics': [
                {
                    'Ref': 'MyTopic86869434',
                },
            ],
        });
    });
    test('fromTopicArn', () => {
        // GIVEN
        const stack2 = new cdk.Stack();
        // WHEN
        const imported = sns.Topic.fromTopicArn(stack2, 'Imported', 'arn:aws:sns:*:123456789012:my_corporate_topic');
        // THEN
        expect(imported.topicName).toEqual('my_corporate_topic');
        expect(imported.topicArn).toEqual('arn:aws:sns:*:123456789012:my_corporate_topic');
        expect(imported.fifo).toEqual(false);
    });
    test('fromTopicArn fifo', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const imported = sns.Topic.fromTopicArn(stack, 'Imported', 'arn:aws:sns:*:123456789012:mytopic.fifo');
        // THEN
        expect(imported.topicName).toEqual('mytopic.fifo');
        expect(imported.topicArn).toEqual('arn:aws:sns:*:123456789012:mytopic.fifo');
        expect(imported.fifo).toEqual(true);
    });
    test('test metrics', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'Topic');
        // THEN
        expect(stack.resolve(topic.metricNumberOfMessagesPublished())).toEqual({
            dimensions: { TopicName: { 'Fn::GetAtt': ['TopicBFC7AF6E', 'TopicName'] } },
            namespace: 'AWS/SNS',
            metricName: 'NumberOfMessagesPublished',
            period: cdk.Duration.minutes(5),
            statistic: 'Sum',
        });
        expect(stack.resolve(topic.metricPublishSize())).toEqual({
            dimensions: { TopicName: { 'Fn::GetAtt': ['TopicBFC7AF6E', 'TopicName'] } },
            namespace: 'AWS/SNS',
            metricName: 'PublishSize',
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
        });
    });
    test('subscription is created under the topic scope by default', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        topic.addSubscription({
            bind: () => ({
                protocol: sns.SubscriptionProtocol.HTTP,
                endpoint: 'http://foo/bar',
                subscriberId: 'my-subscription',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::SNS::Subscription', 1);
    });
    test('if "scope" is defined, subscription will be created under that scope', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'A');
        const stack2 = new cdk.Stack(app, 'B');
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        topic.addSubscription({
            bind: () => ({
                protocol: sns.SubscriptionProtocol.HTTP,
                endpoint: 'http://foo/bar',
                subscriberScope: stack2,
                subscriberId: 'subscriberId',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::SNS::Subscription', 0);
        assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::SNS::Subscription', 1);
    });
    test('fails if topic policy has no actions', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        topic.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        // THEN
        expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
    });
    test('fails if topic policy has no IAM principals', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        topic.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['sns:*'],
        }));
        // THEN
        expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
    });
    test('topic policy should be set if topic as a notifications rule target', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const topic = new sns.Topic(stack, 'Topic');
        const rule = new notifications.NotificationRule(stack, 'MyNotificationRule', {
            source: {
                bindAsNotificationRuleSource: () => ({
                    sourceArn: 'ARN',
                }),
            },
            events: ['codebuild-project-build-state-succeeded'],
        });
        rule.addTarget(topic);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [{
                        'Sid': '0',
                        'Action': 'sns:Publish',
                        'Effect': 'Allow',
                        'Principal': { 'Service': 'codestar-notifications.amazonaws.com' },
                        'Resource': { 'Ref': 'TopicBFC7AF6E' },
                    }],
            },
            Topics: [{
                    Ref: 'TopicBFC7AF6E',
                }],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzbnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxvRUFBb0U7QUFDcEUsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRWhDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7WUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFOUIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQzlCLFNBQVMsRUFBRSxXQUFXO2FBQ3ZCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO2dCQUNqRSxXQUFXLEVBQUUsV0FBVzthQUN6QixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7WUFDL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFOUIs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b3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIG5vdGlmaWNhdGlvbnMgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVzdGFybm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ1RvcGljJywgKCkgPT4ge1xuICBkZXNjcmliZSgndG9waWMgdGVzdHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYWxsIGRlZmF1bHRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTTlM6OlRvcGljJywgMSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NwZWNpZnkgdG9waWNOYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIG5ldyBzbnMuVG9waWMoc3RhY2ssICdNeVRvcGljJywge1xuICAgICAgICB0b3BpY05hbWU6ICd0b3BpY05hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NwZWNpZnkgZGlzcGxheU5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIGRpc3BsYXlOYW1lOiAnZGlzcGxheU5hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzcGVjaWZ5IGttc01hc3RlcktleScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdDdXN0b21LZXknKTtcblxuICAgICAgbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIG1hc3RlcktleToga2V5LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICAgICdLbXNNYXN0ZXJLZXlJZCc6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0N1c3RvbUtleTFFNkQwRDA3JywgJ0FybiddIH0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzcGVjaWZ5IGRpc3BsYXlOYW1lIGFuZCB0b3BpY05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIHRvcGljTmFtZTogJ3RvcGljTmFtZScsXG4gICAgICAgIGRpc3BsYXlOYW1lOiAnZGlzcGxheU5hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ0FkZHMgLmZpZm8gc3VmZml4IHdoZW4gbm8gdG9waWNOYW1lIGlzIHBhc3NlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycsIHtcbiAgICAgICAgZmlmbzogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlRvcGljJywge1xuICAgICAgICAnRmlmb1RvcGljJzogdHJ1ZSxcbiAgICAgICAgJ1RvcGljTmFtZSc6ICdNeVRvcGljLmZpZm8nLFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NwZWNpZnkgZmlmbyB3aXRob3V0IC5maWZvIHN1ZmZpeCBpbiB0b3BpY05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIGZpZm86IHRydWUsXG4gICAgICAgIHRvcGljTmFtZTogJ3RvcGljTmFtZScsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpYycsIHtcbiAgICAgICAgJ0ZpZm9Ub3BpYyc6IHRydWUsXG4gICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lLmZpZm8nLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc3BlY2lmeSBmaWZvIHdpdGggLmZpZm8gc3VmZml4IGluIHRvcGljTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycsIHtcbiAgICAgICAgZmlmbzogdHJ1ZSxcbiAgICAgICAgdG9waWNOYW1lOiAndG9waWNOYW1lLmZpZm8nLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICAgICdGaWZvVG9waWMnOiB0cnVlLFxuICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZS5maWZvJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NwZWNpZnkgZmlmbyB3aXRob3V0IGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIGZpZm86IHRydWUsXG4gICAgICAgIHRvcGljTmFtZTogJ3RvcGljTmFtZScsXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpYycsIHtcbiAgICAgICAgJ0ZpZm9Ub3BpYyc6IHRydWUsXG4gICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lLmZpZm8nLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc3BlY2lmeSBmaWZvIHdpdGggY29udGVudEJhc2VkRGVkdXBsaWNhdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycsIHtcbiAgICAgICAgY29udGVudEJhc2VkRGVkdXBsaWNhdGlvbjogdHJ1ZSxcbiAgICAgICAgZmlmbzogdHJ1ZSxcbiAgICAgICAgdG9waWNOYW1lOiAndG9waWNOYW1lJyxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlRvcGljJywge1xuICAgICAgICAnQ29udGVudEJhc2VkRGVkdXBsaWNhdGlvbic6IHRydWUsXG4gICAgICAgICdGaWZvVG9waWMnOiB0cnVlLFxuICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZS5maWZvJyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IHdpdGggY29udGVudEJhc2VkRGVkdXBsaWNhdGlvbiBvbiBub24tZmlmbyB0b3BpYycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnLCB7XG4gICAgICAgIGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb246IHRydWUsXG4gICAgICB9KSkudG9UaHJvdygvQ29udGVudCBiYXNlZCBkZWR1cGxpY2F0aW9uIGNhbiBvbmx5IGJlIGVuYWJsZWQgZm9yIEZJRk8gU05TIHRvcGljcy4vKTtcblxuXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgYSBwb2xpY3kgdG8gdGhlIHRvcGljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0b3BpYy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NuczoqJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpY1BvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgICdTaWQnOiAnMCcsXG4gICAgICAgICAgJ0FjdGlvbic6ICdzbnM6KicsXG4gICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgJ0FXUyc6ICdhcm4nIH0sXG4gICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdnaXZlIHB1Ymxpc2hpbmcgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdUb3BpYycpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdG9waWMuZ3JhbnRQdWJsaXNoKHVzZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHN0YWNrLnJlc29sdmUodG9waWMudG9waWNBcm4pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnVG9waWNQb2xpY3kgcGFzc2VkIGRvY3VtZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuICAgIGNvbnN0IHBzID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOnN0YXRlbWVudDAnXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuJyldLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzbnMuVG9waWNQb2xpY3koc3RhY2ssICd0b3BpY3BvbGljeScsIHsgdG9waWNzOiBbdG9waWNdLCBwb2xpY3lEb2N1bWVudDogbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7IGFzc2lnblNpZHM6IHRydWUsIHN0YXRlbWVudHM6IFtwc10gfSkgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpY1BvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlcnZpY2U6c3RhdGVtZW50MCcsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdQcmluY2lwYWwnOiB7ICdBV1MnOiAnYXJuJyB9LFxuICAgICAgICAgICAgJ1NpZCc6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICAnVG9waWNzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0FkZCBzdGF0ZW1lbnRzIHRvIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ015VG9waWMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0b3BpY1BvbGljeSA9IG5ldyBzbnMuVG9waWNQb2xpY3koc3RhY2ssICdUb3BpY1BvbGljeScsIHtcbiAgICAgIHRvcGljczogW3RvcGljXSxcbiAgICB9KTtcbiAgICB0b3BpY1BvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpzdGF0ZW1lbnQwJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpY1BvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlcnZpY2U6c3RhdGVtZW50MCcsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdQcmluY2lwYWwnOiB7ICdBV1MnOiAnYXJuJyB9LFxuICAgICAgICAgICAgJ1NpZCc6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICAnVG9waWNzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCd0b3BpYyByZXNvdXJjZSBwb2xpY3kgaW5jbHVkZXMgdW5pcXVlIFNJRHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdNeVRvcGljJyk7XG5cbiAgICB0b3BpYy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTpzdGF0ZW1lbnQwJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgICB9KSk7XG4gICAgdG9waWMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6c3RhdGVtZW50MSddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpY1BvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlcnZpY2U6c3RhdGVtZW50MCcsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdQcmluY2lwYWwnOiB7ICdBV1MnOiAnYXJuJyB9LFxuICAgICAgICAgICAgJ1NpZCc6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc2VydmljZTpzdGF0ZW1lbnQxJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgJ0FXUyc6ICdhcm4nIH0sXG4gICAgICAgICAgICAnU2lkJzogJzEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgICdUb3BpY3MnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVRvcGljQXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkID0gc25zLlRvcGljLmZyb21Ub3BpY0FybihzdGFjazIsICdJbXBvcnRlZCcsICdhcm46YXdzOnNuczoqOjEyMzQ1Njc4OTAxMjpteV9jb3Jwb3JhdGVfdG9waWMnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWQudG9waWNOYW1lKS50b0VxdWFsKCdteV9jb3Jwb3JhdGVfdG9waWMnKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQudG9waWNBcm4pLnRvRXF1YWwoJ2Fybjphd3M6c25zOio6MTIzNDU2Nzg5MDEyOm15X2NvcnBvcmF0ZV90b3BpYycpO1xuICAgIGV4cGVjdChpbXBvcnRlZC5maWZvKS50b0VxdWFsKGZhbHNlKTtcblxuICB9KTtcblxuICB0ZXN0KCdmcm9tVG9waWNBcm4gZmlmbycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkID0gc25zLlRvcGljLmZyb21Ub3BpY0FybihzdGFjaywgJ0ltcG9ydGVkJywgJ2Fybjphd3M6c25zOio6MTIzNDU2Nzg5MDEyOm15dG9waWMuZmlmbycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChpbXBvcnRlZC50b3BpY05hbWUpLnRvRXF1YWwoJ215dG9waWMuZmlmbycpO1xuICAgIGV4cGVjdChpbXBvcnRlZC50b3BpY0FybikudG9FcXVhbCgnYXJuOmF3czpzbnM6KjoxMjM0NTY3ODkwMTI6bXl0b3BpYy5maWZvJyk7XG4gICAgZXhwZWN0KGltcG9ydGVkLmZpZm8pLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3QgbWV0cmljcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ1RvcGljJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodG9waWMubWV0cmljTnVtYmVyT2ZNZXNzYWdlc1B1Ymxpc2hlZCgpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFRvcGljTmFtZTogeyAnRm46OkdldEF0dCc6IFsnVG9waWNCRkM3QUY2RScsICdUb3BpY05hbWUnXSB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvU05TJyxcbiAgICAgIG1ldHJpY05hbWU6ICdOdW1iZXJPZk1lc3NhZ2VzUHVibGlzaGVkJyxcbiAgICAgIHBlcmlvZDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUodG9waWMubWV0cmljUHVibGlzaFNpemUoKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczogeyBUb3BpY05hbWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1RvcGljQkZDN0FGNkUnLCAnVG9waWNOYW1lJ10gfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL1NOUycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHVibGlzaFNpemUnLFxuICAgICAgcGVyaW9kOiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnc3Vic2NyaXB0aW9uIGlzIGNyZWF0ZWQgdW5kZXIgdGhlIHRvcGljIHNjb3BlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdUb3BpYycpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbih7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBwcm90b2NvbDogc25zLlN1YnNjcmlwdGlvblByb3RvY29sLkhUVFAsXG4gICAgICAgIGVuZHBvaW50OiAnaHR0cDovL2Zvby9iYXInLFxuICAgICAgICBzdWJzY3JpYmVySWQ6ICdteS1zdWJzY3JpcHRpb24nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCAxKTtcblxuICB9KTtcblxuICB0ZXN0KCdpZiBcInNjb3BlXCIgaXMgZGVmaW5lZCwgc3Vic2NyaXB0aW9uIHdpbGwgYmUgY3JlYXRlZCB1bmRlciB0aGF0IHNjb3BlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQicpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ1RvcGljJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKHtcbiAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgIHByb3RvY29sOiBzbnMuU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgZW5kcG9pbnQ6ICdodHRwOi8vZm9vL2JhcicsXG4gICAgICAgIHN1YnNjcmliZXJTY29wZTogc3RhY2syLFxuICAgICAgICBzdWJzY3JpYmVySWQ6ICdzdWJzY3JpYmVySWQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCAxKTtcblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiB0b3BpYyBwb2xpY3kgaGFzIG5vIGFjdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhzdGFjaywgJ1RvcGljJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdG9waWMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBcXCdhY3Rpb25cXCcgb3IgXFwnbm90QWN0aW9uXFwnLyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgdG9waWMgcG9saWN5IGhhcyBubyBJQU0gcHJpbmNpcGFscycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0b3BpYy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ3NuczoqJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwvKTtcblxuICB9KTtcblxuICB0ZXN0KCd0b3BpYyBwb2xpY3kgc2hvdWxkIGJlIHNldCBpZiB0b3BpYyBhcyBhIG5vdGlmaWNhdGlvbnMgcnVsZSB0YXJnZXQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdUb3BpYycpO1xuICAgIGNvbnN0IHJ1bGUgPSBuZXcgbm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25SdWxlKHN0YWNrLCAnTXlOb3RpZmljYXRpb25SdWxlJywge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGJpbmRBc05vdGlmaWNhdGlvblJ1bGVTb3VyY2U6ICgpID0+ICh7XG4gICAgICAgICAgc291cmNlQXJuOiAnQVJOJyxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgICAgZXZlbnRzOiBbJ2NvZGVidWlsZC1wcm9qZWN0LWJ1aWxkLXN0YXRlLXN1Y2NlZWRlZCddLFxuICAgIH0pO1xuXG4gICAgcnVsZS5hZGRUYXJnZXQodG9waWMpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpUb3BpY1BvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgICdTaWQnOiAnMCcsXG4gICAgICAgICAgJ0FjdGlvbic6ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgJ1NlcnZpY2UnOiAnY29kZXN0YXItbm90aWZpY2F0aW9ucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICdSZXNvdXJjZSc6IHsgJ1JlZic6ICdUb3BpY0JGQzdBRjZFJyB9LFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgICBUb3BpY3M6IFt7XG4gICAgICAgIFJlZjogJ1RvcGljQkZDN0FGNkUnLFxuICAgICAgfV0sXG4gICAgfSk7XG5cblxuICB9KTtcbn0pO1xuIl19