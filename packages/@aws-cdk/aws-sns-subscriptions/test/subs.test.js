"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const sns = require("@aws-cdk/aws-sns");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const subs = require("../lib");
/* eslint-disable quote-props */
const restrictSqsDescryption = { [cxapi.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: true };
let stack;
let topic;
beforeEach(() => {
    stack = new core_1.Stack();
    topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
});
test('url subscription', () => {
    topic.addSubscription(new subs.UrlSubscription('https://foobar.com/'));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopichttpsfoobarcomDEA92AB5': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': 'https://foobar.com/',
                    'Protocol': 'https',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
test('url subscription with user provided dlq', () => {
    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
        queueName: 'MySubscription_DLQ',
        retentionPeriod: core_1.Duration.days(14),
    });
    topic.addSubscription(new subs.UrlSubscription('https://foobar.com/', {
        deadLetterQueue: dlQueue,
    }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopichttpsfoobarcomDEA92AB5': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': 'https://foobar.com/',
                    'Protocol': 'https',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'RedrivePolicy': {
                        'deadLetterTargetArn': {
                            'Fn::GetAtt': [
                                'DeadLetterQueue9F481546',
                                'Arn',
                            ],
                        },
                    },
                },
            },
            'DeadLetterQueue9F481546': {
                'Type': 'AWS::SQS::Queue',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
                'Properties': {
                    'MessageRetentionPeriod': 1209600,
                    'QueueName': 'MySubscription_DLQ',
                },
            },
            'DeadLetterQueuePolicyB1FB890C': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'DeadLetterQueue9F481546',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'DeadLetterQueue9F481546',
                        },
                    ],
                },
            },
        },
    });
});
test('url subscription (with raw delivery)', () => {
    topic.addSubscription(new subs.UrlSubscription('https://foobar.com/', {
        rawMessageDelivery: true,
    }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopichttpsfoobarcomDEA92AB5': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': 'https://foobar.com/',
                    'Protocol': 'https',
                    'TopicArn': { 'Ref': 'MyTopic86869434' },
                    'RawMessageDelivery': true,
                },
            },
        },
    });
});
test('url subscription (unresolved url with protocol)', () => {
    const urlToken = core_1.Token.asString({ Ref: 'my-url-1' });
    topic.addSubscription(new subs.UrlSubscription(urlToken, { protocol: sns.SubscriptionProtocol.HTTPS }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-url-1',
                    },
                    'Protocol': 'https',
                    'TopicArn': { 'Ref': 'MyTopic86869434' },
                },
            },
        },
    });
});
test('url subscription (double unresolved url with protocol)', () => {
    const urlToken1 = core_1.Token.asString({ Ref: 'my-url-1' });
    const urlToken2 = core_1.Token.asString({ Ref: 'my-url-2' });
    topic.addSubscription(new subs.UrlSubscription(urlToken1, { protocol: sns.SubscriptionProtocol.HTTPS }));
    topic.addSubscription(new subs.UrlSubscription(urlToken2, { protocol: sns.SubscriptionProtocol.HTTPS }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-url-1',
                    },
                    'Protocol': 'https',
                    'TopicArn': { 'Ref': 'MyTopic86869434' },
                },
            },
            'MyTopicTokenSubscription293BFE3F9': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-url-2',
                    },
                    'Protocol': 'https',
                    'TopicArn': { 'Ref': 'MyTopic86869434' },
                },
            },
        },
    });
});
test('url subscription (unknown protocol)', () => {
    expect(() => topic.addSubscription(new subs.UrlSubscription('some-protocol://foobar.com/')))
        .toThrowError(/URL must start with either http:\/\/ or https:\/\//);
});
test('url subscription (unresolved url without protocol)', () => {
    const urlToken = core_1.Token.asString({ Ref: 'my-url-1' });
    expect(() => topic.addSubscription(new subs.UrlSubscription(urlToken)))
        .toThrowError(/Must provide protocol if url is unresolved/);
});
test('queue subscription', () => {
    const queue = new sqs.Queue(stack, 'MyQueue');
    topic.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueMyTopic9B00631B': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('queue subscription cross region', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {
        env: {
            account: '11111111111',
            region: 'us-east-1',
        },
    });
    const queueStack = new core_1.Stack(app, 'QueueStack', {
        env: {
            account: '11111111111',
            region: 'us-east-2',
        },
    });
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const queue = new sqs.Queue(queueStack, 'MyQueue');
    topic1.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(topicStack).templateMatches({
        'Resources': {
            'TopicBFC7AF6E': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
        },
    });
    assertions_1.Template.fromStack(queueStack).templateMatches({
        'Resources': {
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':sns:us-east-1:11111111111:topicName',
                                                ],
                                            ],
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueTopicStackTopicFBF76EB349BDFA94': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    'Ref': 'AWS::Partition',
                                },
                                ':sns:us-east-1:11111111111:topicName',
                            ],
                        ],
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                    'Region': 'us-east-1',
                },
            },
        },
    });
});
test('queue subscription cross region, env agnostic', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {});
    const queueStack = new core_1.Stack(app, 'QueueStack', {});
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const queue = new sqs.Queue(queueStack, 'MyQueue');
    topic1.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(topicStack).templateMatches({
        'Resources': {
            'TopicBFC7AF6E': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
        },
        'Outputs': {
            'ExportsOutputRefTopicBFC7AF6ECB4A357A': {
                'Value': {
                    'Ref': 'TopicBFC7AF6E',
                },
                'Export': {
                    'Name': 'TopicStack:ExportsOutputRefTopicBFC7AF6ECB4A357A',
                },
            },
        },
    });
    assertions_1.Template.fromStack(queueStack).templateMatches({
        'Resources': {
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Fn::ImportValue': 'TopicStack:ExportsOutputRefTopicBFC7AF6ECB4A357A',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueTopicStackTopicFBF76EB349BDFA94': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Fn::ImportValue': 'TopicStack:ExportsOutputRefTopicBFC7AF6ECB4A357A',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('queue subscription cross region, topic env agnostic', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {});
    const queueStack = new core_1.Stack(app, 'QueueStack', {
        env: {
            account: '11111111111',
            region: 'us-east-1',
        },
    });
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const queue = new sqs.Queue(queueStack, 'MyQueue');
    topic1.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(topicStack).templateMatches({
        'Resources': {
            'TopicBFC7AF6E': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
        },
    });
    assertions_1.Template.fromStack(queueStack).templateMatches({
        'Resources': {
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':sns:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':topicName',
                                                ],
                                            ],
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueTopicStackTopicFBF76EB349BDFA94': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    'Ref': 'AWS::Partition',
                                },
                                ':sns:',
                                {
                                    'Ref': 'AWS::Region',
                                },
                                ':',
                                {
                                    'Ref': 'AWS::AccountId',
                                },
                                ':topicName',
                            ],
                        ],
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('queue subscription cross region, queue env agnostic', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {
        env: {
            account: '11111111111',
            region: 'us-east-1',
        },
    });
    const queueStack = new core_1.Stack(app, 'QueueStack', {});
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const queue = new sqs.Queue(queueStack, 'MyQueue');
    topic1.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(topicStack).templateMatches({
        'Resources': {
            'TopicBFC7AF6E': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
        },
    });
    assertions_1.Template.fromStack(queueStack).templateMatches({
        'Resources': {
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':sns:us-east-1:11111111111:topicName',
                                                ],
                                            ],
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueTopicStackTopicFBF76EB349BDFA94': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    'Ref': 'AWS::Partition',
                                },
                                ':sns:us-east-1:11111111111:topicName',
                            ],
                        ],
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                    'Region': 'us-east-1',
                },
            },
        },
    });
});
test('queue subscription with user provided dlq', () => {
    const queue = new sqs.Queue(stack, 'MyQueue');
    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
        queueName: 'MySubscription_DLQ',
        retentionPeriod: core_1.Duration.days(14),
    });
    topic.addSubscription(new subs.SqsSubscription(queue, {
        deadLetterQueue: dlQueue,
    }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueMyTopic9B00631B': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                    'RedrivePolicy': {
                        'deadLetterTargetArn': {
                            'Fn::GetAtt': [
                                'DeadLetterQueue9F481546',
                                'Arn',
                            ],
                        },
                    },
                },
            },
            'DeadLetterQueue9F481546': {
                'Type': 'AWS::SQS::Queue',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
                'Properties': {
                    'MessageRetentionPeriod': 1209600,
                    'QueueName': 'MySubscription_DLQ',
                },
            },
            'DeadLetterQueuePolicyB1FB890C': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'DeadLetterQueue9F481546',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'DeadLetterQueue9F481546',
                        },
                    ],
                },
            },
        },
    });
});
test('queue subscription (with raw delivery)', () => {
    const queue = new sqs.Queue(stack, 'MyQueue');
    topic.addSubscription(new subs.SqsSubscription(queue, { rawMessageDelivery: true }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        'Endpoint': {
            'Fn::GetAtt': [
                'MyQueueE6CA6235',
                'Arn',
            ],
        },
        'Protocol': 'sqs',
        'TopicArn': {
            'Ref': 'MyTopic86869434',
        },
        'RawMessageDelivery': true,
    });
});
test('encrypted queue subscription', () => {
    const key = new kms.Key(stack, 'MyKey', {
        removalPolicy: core_1.RemovalPolicy.DESTROY,
    });
    const queue = new sqs.Queue(stack, 'MyQueue', {
        encryption: sqs.QueueEncryption.KMS,
        encryptionMasterKey: key,
    });
    topic.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyKey6AB29FA6': {
                'Type': 'AWS::KMS::Key',
                'Properties': {
                    'KeyPolicy': {
                        'Statement': [
                            {
                                'Action': 'kms:*',
                                'Effect': 'Allow',
                                'Principal': {
                                    'AWS': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    'Ref': 'AWS::Partition',
                                                },
                                                ':iam::',
                                                {
                                                    'Ref': 'AWS::AccountId',
                                                },
                                                ':root',
                                            ],
                                        ],
                                    },
                                },
                                'Resource': '*',
                            },
                            {
                                'Action': [
                                    'kms:Decrypt',
                                    'kms:GenerateDataKey',
                                ],
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': '*',
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'KmsMasterKeyId': {
                        'Fn::GetAtt': [
                            'MyKey6AB29FA6',
                            'Arn',
                        ],
                    },
                },
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueMyTopic9B00631B': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
describe('Restrict sqs decryption feature flag', () => {
    test('Restrict decryption of sqs to sns service principal', () => {
        const stackUnderTest = new core_1.Stack(new core_1.App());
        const topicUnderTest = new sns.Topic(stackUnderTest, 'MyTopic', {
            topicName: 'topicName',
            displayName: 'displayName',
        });
        const key = new kms.Key(stackUnderTest, 'MyKey', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        const queue = new sqs.Queue(stackUnderTest, 'MyQueue', {
            encryptionMasterKey: key,
        });
        topicUnderTest.addSubscription(new subs.SqsSubscription(queue));
        assertions_1.Template.fromStack(stackUnderTest).templateMatches({
            'Resources': {
                'MyKey6AB29FA6': {
                    'Type': 'AWS::KMS::Key',
                    'Properties': {
                        'KeyPolicy': {
                            'Statement': [
                                {
                                    'Action': 'kms:*',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                    'Resource': '*',
                                },
                                {
                                    'Action': [
                                        'kms:Decrypt',
                                        'kms:GenerateDataKey',
                                    ],
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'sns.amazonaws.com',
                                    },
                                    'Resource': '*',
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
            },
        });
    });
    test('Restrict decryption of sqs to sns topic', () => {
        const stackUnderTest = new core_1.Stack(new core_1.App({
            context: restrictSqsDescryption,
        }));
        const topicUnderTest = new sns.Topic(stackUnderTest, 'MyTopic', {
            topicName: 'topicName',
            displayName: 'displayName',
        });
        const key = new kms.Key(stackUnderTest, 'MyKey', {
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        const queue = new sqs.Queue(stackUnderTest, 'MyQueue', {
            encryptionMasterKey: key,
        });
        topicUnderTest.addSubscription(new subs.SqsSubscription(queue));
        assertions_1.Template.fromStack(stackUnderTest).templateMatches({
            'Resources': {
                'MyKey6AB29FA6': {
                    'Type': 'AWS::KMS::Key',
                    'Properties': {
                        'KeyPolicy': {
                            'Statement': [
                                {
                                    'Action': 'kms:*',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                    'Resource': '*',
                                },
                                {
                                    'Action': [
                                        'kms:Decrypt',
                                        'kms:GenerateDataKey',
                                    ],
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'sns.amazonaws.com',
                                    },
                                    'Resource': '*',
                                    'Condition': {
                                        'ArnEquals': {
                                            'aws:SourceArn': {
                                                'Ref': 'MyTopic86869434',
                                            },
                                        },
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
            },
        });
    });
});
test('lambda subscription', () => {
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyFuncServiceRole54065130': {
                'Type': 'AWS::IAM::Role',
                'Properties': {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'lambda.amazonaws.com',
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'ManagedPolicyArns': [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                                ],
                            ],
                        },
                    ],
                },
            },
            'MyFunc8A243A2C': {
                'Type': 'AWS::Lambda::Function',
                'Properties': {
                    'Code': {
                        'ZipFile': 'exports.handler = function(e, c, cb) { return cb() }',
                    },
                    'Handler': 'index.handler',
                    'Role': {
                        'Fn::GetAtt': [
                            'MyFuncServiceRole54065130',
                            'Arn',
                        ],
                    },
                    'Runtime': 'nodejs14.x',
                },
                'DependsOn': [
                    'MyFuncServiceRole54065130',
                ],
            },
            'MyFuncAllowInvokeMyTopicDD0A15B8': {
                'Type': 'AWS::Lambda::Permission',
                'Properties': {
                    'Action': 'lambda:InvokeFunction',
                    'FunctionName': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                    'Principal': 'sns.amazonaws.com',
                    'SourceArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyFuncMyTopic93B6FB00': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'lambda',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('lambda subscription, cross region env agnostic', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {});
    const lambdaStack = new core_1.Stack(app, 'LambdaStack', {});
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const func = new lambda.Function(lambdaStack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic1.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(lambdaStack).templateMatches({
        'Resources': {
            'MyFuncServiceRole54065130': {
                'Type': 'AWS::IAM::Role',
                'Properties': {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'lambda.amazonaws.com',
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'ManagedPolicyArns': [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                                ],
                            ],
                        },
                    ],
                },
            },
            'MyFunc8A243A2C': {
                'Type': 'AWS::Lambda::Function',
                'Properties': {
                    'Code': {
                        'ZipFile': 'exports.handler = function(e, c, cb) { return cb() }',
                    },
                    'Role': {
                        'Fn::GetAtt': [
                            'MyFuncServiceRole54065130',
                            'Arn',
                        ],
                    },
                    'Handler': 'index.handler',
                    'Runtime': 'nodejs14.x',
                },
                'DependsOn': [
                    'MyFuncServiceRole54065130',
                ],
            },
            'MyFuncAllowInvokeTopicStackTopicFBF76EB3D4A699EF': {
                'Type': 'AWS::Lambda::Permission',
                'Properties': {
                    'Action': 'lambda:InvokeFunction',
                    'FunctionName': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                    'Principal': 'sns.amazonaws.com',
                    'SourceArn': {
                        'Fn::ImportValue': 'TopicStack:ExportsOutputRefTopicBFC7AF6ECB4A357A',
                    },
                },
            },
            'MyFuncTopic3B7C24C5': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'lambda',
                    'TopicArn': {
                        'Fn::ImportValue': 'TopicStack:ExportsOutputRefTopicBFC7AF6ECB4A357A',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('lambda subscription, cross region', () => {
    const app = new core_1.App();
    const topicStack = new core_1.Stack(app, 'TopicStack', {
        env: {
            account: '11111111111',
            region: 'us-east-1',
        },
    });
    const lambdaStack = new core_1.Stack(app, 'LambdaStack', {
        env: {
            account: '11111111111',
            region: 'us-east-2',
        },
    });
    const topic1 = new sns.Topic(topicStack, 'Topic', {
        topicName: 'topicName',
        displayName: 'displayName',
    });
    const func = new lambda.Function(lambdaStack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic1.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(lambdaStack).templateMatches({
        'Resources': {
            'MyFuncServiceRole54065130': {
                'Type': 'AWS::IAM::Role',
                'Properties': {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'lambda.amazonaws.com',
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'ManagedPolicyArns': [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                                ],
                            ],
                        },
                    ],
                },
            },
            'MyFunc8A243A2C': {
                'Type': 'AWS::Lambda::Function',
                'Properties': {
                    'Code': {
                        'ZipFile': 'exports.handler = function(e, c, cb) { return cb() }',
                    },
                    'Role': {
                        'Fn::GetAtt': [
                            'MyFuncServiceRole54065130',
                            'Arn',
                        ],
                    },
                    'Handler': 'index.handler',
                    'Runtime': 'nodejs14.x',
                },
                'DependsOn': [
                    'MyFuncServiceRole54065130',
                ],
            },
            'MyFuncAllowInvokeTopicStackTopicFBF76EB3D4A699EF': {
                'Type': 'AWS::Lambda::Permission',
                'Properties': {
                    'Action': 'lambda:InvokeFunction',
                    'FunctionName': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                    'Principal': 'sns.amazonaws.com',
                    'SourceArn': {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    'Ref': 'AWS::Partition',
                                },
                                ':sns:us-east-1:11111111111:topicName',
                            ],
                        ],
                    },
                },
            },
            'MyFuncTopic3B7C24C5': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'lambda',
                    'TopicArn': {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    'Ref': 'AWS::Partition',
                                },
                                ':sns:us-east-1:11111111111:topicName',
                            ],
                        ],
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                    'Region': 'us-east-1',
                },
            },
        },
    });
});
test('email subscription', () => {
    topic.addSubscription(new subs.EmailSubscription('foo@bar.com'));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicfoobarcomA344CADA': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': 'foo@bar.com',
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
test('email subscription with unresolved', () => {
    const emailToken = core_1.Token.asString({ Ref: 'my-email-1' });
    topic.addSubscription(new subs.EmailSubscription(emailToken));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-1',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
test('email and url subscriptions with unresolved', () => {
    const emailToken = core_1.Token.asString({ Ref: 'my-email-1' });
    const urlToken = core_1.Token.asString({ Ref: 'my-url-1' });
    topic.addSubscription(new subs.EmailSubscription(emailToken));
    topic.addSubscription(new subs.UrlSubscription(urlToken, { protocol: sns.SubscriptionProtocol.HTTPS }));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-1',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyTopicTokenSubscription293BFE3F9': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-url-1',
                    },
                    'Protocol': 'https',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
test('email and url subscriptions with unresolved - four subscriptions', () => {
    const emailToken1 = core_1.Token.asString({ Ref: 'my-email-1' });
    const emailToken2 = core_1.Token.asString({ Ref: 'my-email-2' });
    const emailToken3 = core_1.Token.asString({ Ref: 'my-email-3' });
    const emailToken4 = core_1.Token.asString({ Ref: 'my-email-4' });
    topic.addSubscription(new subs.EmailSubscription(emailToken1));
    topic.addSubscription(new subs.EmailSubscription(emailToken2));
    topic.addSubscription(new subs.EmailSubscription(emailToken3));
    topic.addSubscription(new subs.EmailSubscription(emailToken4));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-1',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyTopicTokenSubscription293BFE3F9': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-2',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyTopicTokenSubscription335C2B4CA': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-3',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyTopicTokenSubscription4DBE52A3F': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-email-4',
                    },
                    'Protocol': 'email',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
test('multiple subscriptions', () => {
    const queue = new sqs.Queue(stack, 'MyQueue');
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic.addSubscription(new subs.SqsSubscription(queue));
    topic.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
            },
            'MyQueuePolicy6BBEDDAC': {
                'Type': 'AWS::SQS::QueuePolicy',
                'Properties': {
                    'PolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sqs:SendMessage',
                                'Condition': {
                                    'ArnEquals': {
                                        'aws:SourceArn': {
                                            'Ref': 'MyTopic86869434',
                                        },
                                    },
                                },
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'sns.amazonaws.com',
                                },
                                'Resource': {
                                    'Fn::GetAtt': [
                                        'MyQueueE6CA6235',
                                        'Arn',
                                    ],
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'Queues': [
                        {
                            'Ref': 'MyQueueE6CA6235',
                        },
                    ],
                },
            },
            'MyQueueMyTopic9B00631B': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sqs',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyQueueE6CA6235',
                            'Arn',
                        ],
                    },
                },
            },
            'MyFuncServiceRole54065130': {
                'Type': 'AWS::IAM::Role',
                'Properties': {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'lambda.amazonaws.com',
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'ManagedPolicyArns': [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                                ],
                            ],
                        },
                    ],
                },
            },
            'MyFunc8A243A2C': {
                'Type': 'AWS::Lambda::Function',
                'Properties': {
                    'Code': {
                        'ZipFile': 'exports.handler = function(e, c, cb) { return cb() }',
                    },
                    'Handler': 'index.handler',
                    'Role': {
                        'Fn::GetAtt': [
                            'MyFuncServiceRole54065130',
                            'Arn',
                        ],
                    },
                    'Runtime': 'nodejs14.x',
                },
                'DependsOn': [
                    'MyFuncServiceRole54065130',
                ],
            },
            'MyFuncAllowInvokeMyTopicDD0A15B8': {
                'Type': 'AWS::Lambda::Permission',
                'Properties': {
                    'Action': 'lambda:InvokeFunction',
                    'FunctionName': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                    'Principal': 'sns.amazonaws.com',
                    'SourceArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
            'MyFuncMyTopic93B6FB00': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'lambda',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': {
                        'Fn::GetAtt': [
                            'MyFunc8A243A2C',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
test('throws with mutliple subscriptions of the same subscriber', () => {
    const queue = new sqs.Queue(stack, 'MyQueue');
    topic.addSubscription(new subs.SqsSubscription(queue));
    expect(() => topic.addSubscription(new subs.SqsSubscription(queue)))
        .toThrowError(/A subscription with id \"MyTopic\" already exists under the scope Default\/MyQueue/);
});
test('with filter policy', () => {
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic.addSubscription(new subs.LambdaSubscription(func, {
        filterPolicy: {
            color: sns.SubscriptionFilter.stringFilter({
                allowlist: ['red'],
                matchPrefixes: ['bl', 'ye'],
            }),
            size: sns.SubscriptionFilter.stringFilter({
                denylist: ['small', 'medium'],
            }),
            price: sns.SubscriptionFilter.numericFilter({
                between: { start: 100, stop: 200 },
            }),
        },
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        'FilterPolicy': {
            'color': [
                'red',
                {
                    'prefix': 'bl',
                },
                {
                    'prefix': 'ye',
                },
            ],
            'size': [
                {
                    'anything-but': [
                        'small',
                        'medium',
                    ],
                },
            ],
            'price': [
                {
                    'numeric': [
                        '>=',
                        100,
                        '<=',
                        200,
                    ],
                },
            ],
        },
    });
});
test('with filter policy scope MessageBody', () => {
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    topic.addSubscription(new subs.LambdaSubscription(func, {
        filterPolicyWithMessageBody: {
            color: sns.FilterOrPolicy.policy({
                background: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
                    allowlist: ['red'],
                    matchPrefixes: ['bl', 'ye'],
                })),
            }),
            size: sns.FilterOrPolicy.filter(sns.SubscriptionFilter.stringFilter({
                denylist: ['small', 'medium'],
            })),
        },
    }));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        'FilterPolicy': {
            'color': {
                'background': [
                    'red',
                    {
                        'prefix': 'bl',
                    },
                    {
                        'prefix': 'ye',
                    },
                ],
            },
            'size': [
                {
                    'anything-but': [
                        'small',
                        'medium',
                    ],
                },
            ],
        },
        FilterPolicyScope: 'MessageBody',
    });
});
test('region property is present on an imported topic - sqs', () => {
    const imported = sns.Topic.fromTopicArn(stack, 'mytopic', 'arn:aws:sns:us-east-1:1234567890:mytopic');
    const queue = new sqs.Queue(stack, 'myqueue');
    imported.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        Region: 'us-east-1',
    });
});
test('region property on an imported topic as a parameter - sqs', () => {
    const topicArn = new core_1.CfnParameter(stack, 'topicArn');
    const imported = sns.Topic.fromTopicArn(stack, 'mytopic', topicArn.valueAsString);
    const queue = new sqs.Queue(stack, 'myqueue');
    imported.addSubscription(new subs.SqsSubscription(queue));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        Region: {
            'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'topicArn' }] }],
        },
    });
});
test('region property is present on an imported topic - lambda', () => {
    const imported = sns.Topic.fromTopicArn(stack, 'mytopic', 'arn:aws:sns:us-east-1:1234567890:mytopic');
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    imported.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        Region: 'us-east-1',
    });
});
test('region property on an imported topic as a parameter - lambda', () => {
    const topicArn = new core_1.CfnParameter(stack, 'topicArn');
    const imported = sns.Topic.fromTopicArn(stack, 'mytopic', topicArn.valueAsString);
    const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }'),
    });
    imported.addSubscription(new subs.LambdaSubscription(func));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
        Region: {
            'Fn::Select': [3, { 'Fn::Split': [':', { 'Ref': 'topicArn' }] }],
        },
    });
});
test('sms subscription', () => {
    topic.addSubscription(new subs.SmsSubscription('+15551231234'));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopic155512312349C8DEEEE': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Protocol': 'sms',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                    'Endpoint': '+15551231234',
                },
            },
        },
    });
});
test('sms subscription with unresolved', () => {
    const smsToken = core_1.Token.asString({ Ref: 'my-sms-1' });
    topic.addSubscription(new subs.SmsSubscription(smsToken));
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'MyTopic86869434': {
                'Type': 'AWS::SNS::Topic',
                'Properties': {
                    'DisplayName': 'displayName',
                    'TopicName': 'topicName',
                },
            },
            'MyTopicTokenSubscription141DD1BE2': {
                'Type': 'AWS::SNS::Subscription',
                'Properties': {
                    'Endpoint': {
                        'Ref': 'my-sms-1',
                    },
                    'Protocol': 'sms',
                    'TopicArn': {
                        'Ref': 'MyTopic86869434',
                    },
                },
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vicy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Vicy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBeUY7QUFDekYseUNBQXlDO0FBQ3pDLCtCQUErQjtBQUUvQixnQ0FBZ0M7QUFDaEMsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDekYsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxLQUFnQixDQUFDO0FBRXJCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUNwQixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDdEMsU0FBUyxFQUFFLFdBQVc7UUFDdEIsV0FBVyxFQUFFLGFBQWE7S0FDM0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQzVCLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztJQUV2RSxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7UUFDeEMsV0FBVyxFQUFFO1lBQ1gsaUJBQWlCLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLFlBQVksRUFBRTtvQkFDWixhQUFhLEVBQUUsYUFBYTtvQkFDNUIsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCO2FBQ0Y7WUFDRCwrQkFBK0IsRUFBRTtnQkFDL0IsTUFBTSxFQUFFLHdCQUF3QjtnQkFDaEMsWUFBWSxFQUFFO29CQUNaLFVBQVUsRUFB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QU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLFlBQVksRUFBRTtvQkFDWixhQUFhLEVBQUUsYUFBYTtvQkFDNUIsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCO2FBQ0Y7WUFDRCxtQ0FBbUMsRUFBRTtnQkFDbkMsTUFBTSxFQUFFLHdCQUF3QjtnQkFDaEMsWUFBWSxFQUFFO29CQUNaLFVBQVUsRUFBRTt3QkFDVixLQUFLLEVBQUUsVUFBVTtxQkFDbEI7b0JBQ0QsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLFVBQVUsRUFBRTt3QkFDVixLQUFLLEVBQUUsaUJBQWlCO3FCQUN6QjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnQGF3cy1jZGsvYXdzLXNxcyc7XG5pbXBvcnQgeyBBcHAsIENmblBhcmFtZXRlciwgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cbmNvbnN0IHJlc3RyaWN0U3FzRGVzY3J5cHRpb24gPSB7IFtjeGFwaS5TTlNfU1VCU0NSSVBUSU9OU19TUVNfREVDUllQVElPTl9QT0xJQ1ldOiB0cnVlIH07XG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IHRvcGljOiBzbnMuVG9waWM7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdNeVRvcGljJywge1xuICAgIHRvcGljTmFtZTogJ3RvcGljTmFtZScsXG4gICAgZGlzcGxheU5hbWU6ICdkaXNwbGF5TmFtZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VybCBzdWJzY3JpcHRpb24nLCAoKSA9PiB7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5VcmxTdWJzY3JpcHRpb24oJ2h0dHBzOi8vZm9vYmFyLmNvbS8nKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY2h0dHBzZm9vYmFyY29tREVBOTJBQjUnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRW5kcG9pbnQnOiAnaHR0cHM6Ly9mb29iYXIuY29tLycsXG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2h0dHBzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndXJsIHN1YnNjcmlwdGlvbiB3aXRoIHVzZXIgcHJvdmlkZWQgZGxxJywgKCkgPT4ge1xuICBjb25zdCBkbFF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ0RlYWRMZXR0ZXJRdWV1ZScsIHtcbiAgICBxdWV1ZU5hbWU6ICdNeVN1YnNjcmlwdGlvbl9ETFEnLFxuICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uZGF5cygxNCksXG4gIH0pO1xuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuVXJsU3Vic2NyaXB0aW9uKCdodHRwczovL2Zvb2Jhci5jb20vJywge1xuICAgIGRlYWRMZXR0ZXJRdWV1ZTogZGxRdWV1ZSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWNodHRwc2Zvb2JhcmNvbURFQTkyQUI1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50JzogJ2h0dHBzOi8vZm9vYmFyLmNvbS8nLFxuICAgICAgICAgICdQcm90b2NvbCc6ICdodHRwcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1JlZHJpdmVQb2xpY3knOiB7XG4gICAgICAgICAgICAnZGVhZExldHRlclRhcmdldEFybic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0RlYWRMZXR0ZXJRdWV1ZTlGNDgxNTQ2JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZScsXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnTWVzc2FnZVJldGVudGlvblBlcmlvZCc6IDEyMDk2MDAsXG4gICAgICAgICAgJ1F1ZXVlTmFtZSc6ICdNeVN1YnNjcmlwdGlvbl9ETFEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdEZWFkTGV0dGVyUXVldWVQb2xpY3lCMUZCODkwQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgICAgICAnQ29uZGl0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0FybkVxdWFscyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0RlYWRMZXR0ZXJRdWV1ZTlGNDgxNTQ2JyxcbiAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUXVldWVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnUmVmJzogJ0RlYWRMZXR0ZXJRdWV1ZTlGNDgxNTQ2JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndXJsIHN1YnNjcmlwdGlvbiAod2l0aCByYXcgZGVsaXZlcnkpJywgKCkgPT4ge1xuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuVXJsU3Vic2NyaXB0aW9uKCdodHRwczovL2Zvb2Jhci5jb20vJywge1xuICAgIHJhd01lc3NhZ2VEZWxpdmVyeTogdHJ1ZSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWNodHRwc2Zvb2JhcmNvbURFQTkyQUI1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50JzogJ2h0dHBzOi8vZm9vYmFyLmNvbS8nLFxuICAgICAgICAgICdQcm90b2NvbCc6ICdodHRwcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzogeyAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcgfSxcbiAgICAgICAgICAnUmF3TWVzc2FnZURlbGl2ZXJ5JzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndXJsIHN1YnNjcmlwdGlvbiAodW5yZXNvbHZlZCB1cmwgd2l0aCBwcm90b2NvbCknLCAoKSA9PiB7XG4gIGNvbnN0IHVybFRva2VuID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdteS11cmwtMScgfSk7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5VcmxTdWJzY3JpcHRpb24odXJsVG9rZW4sIHsgcHJvdG9jb2w6IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbC5IVFRQUyB9KSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY1Rva2VuU3Vic2NyaXB0aW9uMTQxREQxQkUyJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ1JlZic6ICdteS11cmwtMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnaHR0cHMnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHsgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VybCBzdWJzY3JpcHRpb24gKGRvdWJsZSB1bnJlc29sdmVkIHVybCB3aXRoIHByb3RvY29sKScsICgpID0+IHtcbiAgY29uc3QgdXJsVG9rZW4xID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdteS11cmwtMScgfSk7XG4gIGNvbnN0IHVybFRva2VuMiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnbXktdXJsLTInIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5VcmxTdWJzY3JpcHRpb24odXJsVG9rZW4xLCB7IHByb3RvY29sOiBzbnMuU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUFMgfSkpO1xuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuVXJsU3Vic2NyaXB0aW9uKHVybFRva2VuMiwgeyBwcm90b2NvbDogc25zLlN1YnNjcmlwdGlvblByb3RvY29sLkhUVFBTIH0pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeVRvcGljODY4Njk0MzQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpUb3BpYycsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICAgICAgJ1RvcGljTmFtZSc6ICd0b3BpY05hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVRvcGljVG9rZW5TdWJzY3JpcHRpb24xNDFERDFCRTInOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnUmVmJzogJ215LXVybC0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdQcm90b2NvbCc6ICdodHRwcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzogeyAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY1Rva2VuU3Vic2NyaXB0aW9uMjkzQkZFM0Y5Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ1JlZic6ICdteS11cmwtMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnaHR0cHMnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHsgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VybCBzdWJzY3JpcHRpb24gKHVua25vd24gcHJvdG9jb2wpJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4gdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlVybFN1YnNjcmlwdGlvbignc29tZS1wcm90b2NvbDovL2Zvb2Jhci5jb20vJykpKVxuICAgIC50b1Rocm93RXJyb3IoL1VSTCBtdXN0IHN0YXJ0IHdpdGggZWl0aGVyIGh0dHA6XFwvXFwvIG9yIGh0dHBzOlxcL1xcLy8pO1xufSk7XG5cbnRlc3QoJ3VybCBzdWJzY3JpcHRpb24gKHVucmVzb2x2ZWQgdXJsIHdpdGhvdXQgcHJvdG9jb2wpJywgKCkgPT4ge1xuICBjb25zdCB1cmxUb2tlbiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnbXktdXJsLTEnIH0pO1xuXG4gIGV4cGVjdCgoKSA9PiB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuVXJsU3Vic2NyaXB0aW9uKHVybFRva2VuKSkpXG4gICAgLnRvVGhyb3dFcnJvcigvTXVzdCBwcm92aWRlIHByb3RvY29sIGlmIHVybCBpcyB1bnJlc29sdmVkLyk7XG59KTtcblxudGVzdCgncXVldWUgc3Vic2NyaXB0aW9uJywgKCkgPT4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG5cbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgICAgJ015UXVldWVQb2xpY3k2QkJFRERBQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgICAgICAnQ29uZGl0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0FybkVxdWFscyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1F1ZXVlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZic6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVF1ZXVlTXlUb3BpYzlCMDA2MzFCJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1Byb3RvY29sJzogJ3NxcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgncXVldWUgc3Vic2NyaXB0aW9uIGNyb3NzIHJlZ2lvbicsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCB0b3BpY1N0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1RvcGljU3RhY2snLCB7XG4gICAgZW52OiB7XG4gICAgICBhY2NvdW50OiAnMTExMTExMTExMTEnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9LFxuICB9KTtcbiAgY29uc3QgcXVldWVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdRdWV1ZVN0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgdG9waWMxID0gbmV3IHNucy5Ub3BpYyh0b3BpY1N0YWNrLCAnVG9waWMnLCB7XG4gICAgdG9waWNOYW1lOiAndG9waWNOYW1lJyxcbiAgICBkaXNwbGF5TmFtZTogJ2Rpc3BsYXlOYW1lJyxcbiAgfSk7XG5cbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHF1ZXVlU3RhY2ssICdNeVF1ZXVlJyk7XG5cbiAgdG9waWMxLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2sodG9waWNTdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ1RvcGljQkZDN0FGNkUnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpUb3BpYycsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICAgICAgJ1RvcGljTmFtZSc6ICd0b3BpY05hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2socXVldWVTdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgICAgJ015UXVldWVQb2xpY3k2QkJFRERBQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgICAgICAnQ29uZGl0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0FybkVxdWFscyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOnNuczp1cy1lYXN0LTE6MTExMTExMTExMTE6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdRdWV1ZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVRvcGljU3RhY2tUb3BpY0ZCRjc2RUIzNDlCREZBOTQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnc3FzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpzbnM6dXMtZWFzdC0xOjExMTExMTExMTExOnRvcGljTmFtZScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUmVnaW9uJzogJ3VzLWVhc3QtMScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3F1ZXVlIHN1YnNjcmlwdGlvbiBjcm9zcyByZWdpb24sIGVudiBhZ25vc3RpYycsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCB0b3BpY1N0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1RvcGljU3RhY2snLCB7fSk7XG4gIGNvbnN0IHF1ZXVlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUXVldWVTdGFjaycsIHt9KTtcblxuICBjb25zdCB0b3BpYzEgPSBuZXcgc25zLlRvcGljKHRvcGljU3RhY2ssICdUb3BpYycsIHtcbiAgICB0b3BpY05hbWU6ICd0b3BpY05hbWUnLFxuICAgIGRpc3BsYXlOYW1lOiAnZGlzcGxheU5hbWUnLFxuICB9KTtcblxuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUocXVldWVTdGFjaywgJ015UXVldWUnKTtcblxuICB0b3BpYzEuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayh0b3BpY1N0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnVG9waWNCRkM3QUY2RSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgJ091dHB1dHMnOiB7XG4gICAgICAnRXhwb3J0c091dHB1dFJlZlRvcGljQkZDN0FGNkVDQjRBMzU3QSc6IHtcbiAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICdSZWYnOiAnVG9waWNCRkM3QUY2RScsXG4gICAgICAgIH0sXG4gICAgICAgICdFeHBvcnQnOiB7XG4gICAgICAgICAgJ05hbWUnOiAnVG9waWNTdGFjazpFeHBvcnRzT3V0cHV0UmVmVG9waWNCRkM3QUY2RUNCNEEzNTdBJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHF1ZXVlU3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeVF1ZXVlRTZDQTYyMzUnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZScsXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICAgICdNeVF1ZXVlUG9saWN5NkJCRUREQUMnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZVBvbGljeScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdBcm5FcXVhbHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnVG9waWNTdGFjazpFeHBvcnRzT3V0cHV0UmVmVG9waWNCRkM3QUY2RUNCNEEzNTdBJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdRdWV1ZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVRvcGljU3RhY2tUb3BpY0ZCRjc2RUIzNDlCREZBOTQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnc3FzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ1RvcGljU3RhY2s6RXhwb3J0c091dHB1dFJlZlRvcGljQkZDN0FGNkVDQjRBMzU3QScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdxdWV1ZSBzdWJzY3JpcHRpb24gY3Jvc3MgcmVnaW9uLCB0b3BpYyBlbnYgYWdub3N0aWMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3QgdG9waWNTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUb3BpY1N0YWNrJywge30pO1xuICBjb25zdCBxdWV1ZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1F1ZXVlU3RhY2snLCB7XG4gICAgZW52OiB7XG4gICAgICBhY2NvdW50OiAnMTExMTExMTExMTEnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCB0b3BpYzEgPSBuZXcgc25zLlRvcGljKHRvcGljU3RhY2ssICdUb3BpYycsIHtcbiAgICB0b3BpY05hbWU6ICd0b3BpY05hbWUnLFxuICAgIGRpc3BsYXlOYW1lOiAnZGlzcGxheU5hbWUnLFxuICB9KTtcblxuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUocXVldWVTdGFjaywgJ015UXVldWUnKTtcblxuICB0b3BpYzEuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayh0b3BpY1N0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnVG9waWNCRkM3QUY2RSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhxdWV1ZVN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlRdWV1ZUU2Q0E2MjM1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVBvbGljeTZCQkVEREFDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWVQb2xpY3knLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnQXJuRXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6c25zOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdRdWV1ZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVRvcGljU3RhY2tUb3BpY0ZCRjc2RUIzNDlCREZBOTQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnc3FzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpzbnM6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdxdWV1ZSBzdWJzY3JpcHRpb24gY3Jvc3MgcmVnaW9uLCBxdWV1ZSBlbnYgYWdub3N0aWMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3QgdG9waWNTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUb3BpY1N0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnN0IHF1ZXVlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUXVldWVTdGFjaycsIHt9KTtcblxuICBjb25zdCB0b3BpYzEgPSBuZXcgc25zLlRvcGljKHRvcGljU3RhY2ssICdUb3BpYycsIHtcbiAgICB0b3BpY05hbWU6ICd0b3BpY05hbWUnLFxuICAgIGRpc3BsYXlOYW1lOiAnZGlzcGxheU5hbWUnLFxuICB9KTtcblxuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUocXVldWVTdGFjaywgJ015UXVldWUnKTtcblxuICB0b3BpYzEuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayh0b3BpY1N0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnVG9waWNCRkM3QUY2RSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhxdWV1ZVN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlRdWV1ZUU2Q0E2MjM1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVBvbGljeTZCQkVEREFDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWVQb2xpY3knLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnQXJuRXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6c25zOnVzLWVhc3QtMToxMTExMTExMTExMTp0b3BpY05hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1F1ZXVlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZic6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVF1ZXVlVG9waWNTdGFja1RvcGljRkJGNzZFQjM0OUJERkE5NCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQcm90b2NvbCc6ICdzcXMnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOnNuczp1cy1lYXN0LTE6MTExMTExMTExMTE6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdSZWdpb24nOiAndXMtZWFzdC0xJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcbnRlc3QoJ3F1ZXVlIHN1YnNjcmlwdGlvbiB3aXRoIHVzZXIgcHJvdmlkZWQgZGxxJywgKCkgPT4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG4gIGNvbnN0IGRsUXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnRGVhZExldHRlclF1ZXVlJywge1xuICAgIHF1ZXVlTmFtZTogJ015U3Vic2NyaXB0aW9uX0RMUScsXG4gICAgcmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5kYXlzKDE0KSxcbiAgfSk7XG5cbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSwge1xuICAgIGRlYWRMZXR0ZXJRdWV1ZTogZGxRdWV1ZSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgICAgJ015UXVldWVQb2xpY3k2QkJFRERBQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgICAgICAnQ29uZGl0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0FybkVxdWFscyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1F1ZXVlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ1JlZic6ICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVF1ZXVlTXlUb3BpYzlCMDA2MzFCJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1Byb3RvY29sJzogJ3NxcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUmVkcml2ZVBvbGljeSc6IHtcbiAgICAgICAgICAgICdkZWFkTGV0dGVyVGFyZ2V0QXJuJzoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdEZWFkTGV0dGVyUXVldWU5RjQ4MTU0Nic6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdNZXNzYWdlUmV0ZW50aW9uUGVyaW9kJzogMTIwOTYwMCxcbiAgICAgICAgICAnUXVldWVOYW1lJzogJ015U3Vic2NyaXB0aW9uX0RMUScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ0RlYWRMZXR0ZXJRdWV1ZVBvbGljeUIxRkI4OTBDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWVQb2xpY3knLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnQXJuRXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ3Nucy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdRdWV1ZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWYnOiAnRGVhZExldHRlclF1ZXVlOUY0ODE1NDYnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdxdWV1ZSBzdWJzY3JpcHRpb24gKHdpdGggcmF3IGRlbGl2ZXJ5KScsICgpID0+IHtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScpO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUsIHsgcmF3TWVzc2FnZURlbGl2ZXJ5OiB0cnVlIH0pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsIHtcbiAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICAgICdQcm90b2NvbCc6ICdzcXMnLFxuICAgICdUb3BpY0Fybic6IHtcbiAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICB9LFxuICAgICdSYXdNZXNzYWdlRGVsaXZlcnknOiB0cnVlLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlbmNyeXB0ZWQgcXVldWUgc3Vic2NyaXB0aW9uJywgKCkgPT4ge1xuICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jywge1xuICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgfSk7XG5cbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScsIHtcbiAgICBlbmNyeXB0aW9uOiBzcXMuUXVldWVFbmNyeXB0aW9uLktNUyxcbiAgICBlbmNyeXB0aW9uTWFzdGVyS2V5OiBrZXksXG4gIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeVRvcGljODY4Njk0MzQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpUb3BpYycsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICAgICAgJ1RvcGljTmFtZSc6ICd0b3BpY05hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUtleTZBQjI5RkE2Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OktNUzo6S2V5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0tleVBvbGljeSc6IHtcbiAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ2ttczoqJyxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnU2VydmljZSc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0ttc01hc3RlcktleUlkJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUtleTZBQjI5RkE2JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICAgICdNeVF1ZXVlUG9saWN5NkJCRUREQUMnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZVBvbGljeScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdBcm5FcXVhbHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdRdWV1ZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZU15VG9waWM5QjAwNjMxQic6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQcm90b2NvbCc6ICdzcXMnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdFbmRwb2ludCc6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdSZXN0cmljdCBzcXMgZGVjcnlwdGlvbiBmZWF0dXJlIGZsYWcnLCAoKSA9PiB7XG4gIHRlc3QoJ1Jlc3RyaWN0IGRlY3J5cHRpb24gb2Ygc3FzIHRvIHNucyBzZXJ2aWNlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFja1VuZGVyVGVzdCA9IG5ldyBTdGFjayhcbiAgICAgIG5ldyBBcHAoKSxcbiAgICApO1xuICAgIGNvbnN0IHRvcGljVW5kZXJUZXN0ID0gbmV3IHNucy5Ub3BpYyhzdGFja1VuZGVyVGVzdCwgJ015VG9waWMnLCB7XG4gICAgICB0b3BpY05hbWU6ICd0b3BpY05hbWUnLFxuICAgICAgZGlzcGxheU5hbWU6ICdkaXNwbGF5TmFtZScsXG4gICAgfSk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2tVbmRlclRlc3QsICdNeUtleScsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFja1VuZGVyVGVzdCwgJ015UXVldWUnLCB7XG4gICAgICBlbmNyeXB0aW9uTWFzdGVyS2V5OiBrZXksXG4gICAgfSk7XG5cbiAgICB0b3BpY1VuZGVyVGVzdC5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tVbmRlclRlc3QpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlLZXk2QUIyOUZBNic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OktNUzo6S2V5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdLZXlQb2xpY3knOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdrbXM6KicsXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAgICdBV1MnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ3Nucy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdSZXN0cmljdCBkZWNyeXB0aW9uIG9mIHNxcyB0byBzbnMgdG9waWMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2tVbmRlclRlc3QgPSBuZXcgU3RhY2soXG4gICAgICBuZXcgQXBwKHtcbiAgICAgICAgY29udGV4dDogcmVzdHJpY3RTcXNEZXNjcnlwdGlvbixcbiAgICAgIH0pLFxuICAgICk7XG4gICAgY29uc3QgdG9waWNVbmRlclRlc3QgPSBuZXcgc25zLlRvcGljKHN0YWNrVW5kZXJUZXN0LCAnTXlUb3BpYycsIHtcbiAgICAgIHRvcGljTmFtZTogJ3RvcGljTmFtZScsXG4gICAgICBkaXNwbGF5TmFtZTogJ2Rpc3BsYXlOYW1lJyxcbiAgICB9KTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFja1VuZGVyVGVzdCwgJ015S2V5Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrVW5kZXJUZXN0LCAnTXlRdWV1ZScsIHtcbiAgICAgIGVuY3J5cHRpb25NYXN0ZXJLZXk6IGtleSxcbiAgICB9KTtcblxuICAgIHRvcGljVW5kZXJUZXN0LmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja1VuZGVyVGVzdCkudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUtleTZBQjI5RkE2Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6S01TOjpLZXknLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0tleVBvbGljeSc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ2ttczoqJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXknLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgICdBcm5FcXVhbHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2xhbWJkYSBzdWJzY3JpcHRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5MYW1iZGFTdWJzY3JpcHRpb24oZnVuYykpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015RnVuY1NlcnZpY2VSb2xlNTQwNjUxMzAnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnTWFuYWdlZFBvbGljeUFybnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015RnVuYzhBMjQzQTJDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnQ29kZSc6IHtcbiAgICAgICAgICAgICdaaXBGaWxlJzogJ2V4cG9ydHMuaGFuZGxlciA9IGZ1bmN0aW9uKGUsIGMsIGNiKSB7IHJldHVybiBjYigpIH0nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0hhbmRsZXInOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgJ1JvbGUnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RnVuY1NlcnZpY2VSb2xlNTQwNjUxMzAnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUnVudGltZSc6ICdub2RlanMxNC54JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0RlcGVuZHNPbic6IFtcbiAgICAgICAgICAnTXlGdW5jU2VydmljZVJvbGU1NDA2NTEzMCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ015RnVuY0FsbG93SW52b2tlTXlUb3BpY0REMEExNUI4Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdBY3Rpb24nOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAnRnVuY3Rpb25OYW1lJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmM4QTI0M0EyQycsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdQcmluY2lwYWwnOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICdTb3VyY2VBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlGdW5jTXlUb3BpYzkzQjZGQjAwJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2xhbWJkYScsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmM4QTI0M0EyQycsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdsYW1iZGEgc3Vic2NyaXB0aW9uLCBjcm9zcyByZWdpb24gZW52IGFnbm9zdGljJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHRvcGljU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVG9waWNTdGFjaycsIHt9KTtcbiAgY29uc3QgbGFtYmRhU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTGFtYmRhU3RhY2snLCB7fSk7XG5cbiAgY29uc3QgdG9waWMxID0gbmV3IHNucy5Ub3BpYyh0b3BpY1N0YWNrLCAnVG9waWMnLCB7XG4gICAgdG9waWNOYW1lOiAndG9waWNOYW1lJyxcbiAgICBkaXNwbGF5TmFtZTogJ2Rpc3BsYXlOYW1lJyxcbiAgfSk7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKGxhbWJkYVN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuXG4gIHRvcGljMS5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuTGFtYmRhU3Vic2NyaXB0aW9uKGZ1bmMpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2sobGFtYmRhU3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ01hbmFnZWRQb2xpY3lBcm5zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmM4QTI0M0EyQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0NvZGUnOiB7XG4gICAgICAgICAgICAnWmlwRmlsZSc6ICdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdSb2xlJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0hhbmRsZXInOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgJ1J1bnRpbWUnOiAnbm9kZWpzMTQueCcsXG4gICAgICAgIH0sXG4gICAgICAgICdEZXBlbmRzT24nOiBbXG4gICAgICAgICAgJ015RnVuY1NlcnZpY2VSb2xlNTQwNjUxMzAnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmNBbGxvd0ludm9rZVRvcGljU3RhY2tUb3BpY0ZCRjc2RUIzRDRBNjk5RUYnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0FjdGlvbic6ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICdGdW5jdGlvbk5hbWUnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RnVuYzhBMjQzQTJDJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1ByaW5jaXBhbCc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgJ1NvdXJjZUFybic6IHtcbiAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnVG9waWNTdGFjazpFeHBvcnRzT3V0cHV0UmVmVG9waWNCRkM3QUY2RUNCNEEzNTdBJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmNUb3BpYzNCN0MyNEM1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2xhbWJkYScsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdUb3BpY1N0YWNrOkV4cG9ydHNPdXRwdXRSZWZUb3BpY0JGQzdBRjZFQ0I0QTM1N0EnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmM4QTI0M0EyQycsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdsYW1iZGEgc3Vic2NyaXB0aW9uLCBjcm9zcyByZWdpb24nLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3QgdG9waWNTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUb3BpY1N0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnN0IGxhbWJkYVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0xhbWJkYVN0YWNrJywge1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgfSxcbiAgfSk7XG5cbiAgY29uc3QgdG9waWMxID0gbmV3IHNucy5Ub3BpYyh0b3BpY1N0YWNrLCAnVG9waWMnLCB7XG4gICAgdG9waWNOYW1lOiAndG9waWNOYW1lJyxcbiAgICBkaXNwbGF5TmFtZTogJ2Rpc3BsYXlOYW1lJyxcbiAgfSk7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKGxhbWJkYVN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuXG4gIHRvcGljMS5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuTGFtYmRhU3Vic2NyaXB0aW9uKGZ1bmMpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2sobGFtYmRhU3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ01hbmFnZWRQb2xpY3lBcm5zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmM4QTI0M0EyQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0NvZGUnOiB7XG4gICAgICAgICAgICAnWmlwRmlsZSc6ICdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdSb2xlJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0hhbmRsZXInOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgICAgJ1J1bnRpbWUnOiAnbm9kZWpzMTQueCcsXG4gICAgICAgIH0sXG4gICAgICAgICdEZXBlbmRzT24nOiBbXG4gICAgICAgICAgJ015RnVuY1NlcnZpY2VSb2xlNTQwNjUxMzAnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmNBbGxvd0ludm9rZVRvcGljU3RhY2tUb3BpY0ZCRjc2RUIzRDRBNjk5RUYnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0FjdGlvbic6ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgICAgICdGdW5jdGlvbk5hbWUnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RnVuYzhBMjQzQTJDJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1ByaW5jaXBhbCc6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgJ1NvdXJjZUFybic6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOnNuczp1cy1lYXN0LTE6MTExMTExMTExMTE6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlGdW5jVG9waWMzQjdDMjRDNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQcm90b2NvbCc6ICdsYW1iZGEnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOnNuczp1cy1lYXN0LTE6MTExMTExMTExMTE6dG9waWNOYW1lJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RnVuYzhBMjQzQTJDJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1JlZ2lvbic6ICd1cy1lYXN0LTEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlbWFpbCBzdWJzY3JpcHRpb24nLCAoKSA9PiB7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5FbWFpbFN1YnNjcmlwdGlvbignZm9vQGJhci5jb20nKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY2Zvb2JhcmNvbUEzNDRDQURBJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50JzogJ2Zvb0BiYXIuY29tJyxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnZW1haWwnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlbWFpbCBzdWJzY3JpcHRpb24gd2l0aCB1bnJlc29sdmVkJywgKCkgPT4ge1xuICBjb25zdCBlbWFpbFRva2VuID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdteS1lbWFpbC0xJyB9KTtcbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkVtYWlsU3Vic2NyaXB0aW9uKGVtYWlsVG9rZW4pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdNeVRvcGljODY4Njk0MzQnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpUb3BpYycsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdEaXNwbGF5TmFtZSc6ICdkaXNwbGF5TmFtZScsXG4gICAgICAgICAgJ1RvcGljTmFtZSc6ICd0b3BpY05hbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVRvcGljVG9rZW5TdWJzY3JpcHRpb24xNDFERDFCRTInOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnUmVmJzogJ215LWVtYWlsLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2VtYWlsJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZW1haWwgYW5kIHVybCBzdWJzY3JpcHRpb25zIHdpdGggdW5yZXNvbHZlZCcsICgpID0+IHtcbiAgY29uc3QgZW1haWxUb2tlbiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnbXktZW1haWwtMScgfSk7XG4gIGNvbnN0IHVybFRva2VuID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdteS11cmwtMScgfSk7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5FbWFpbFN1YnNjcmlwdGlvbihlbWFpbFRva2VuKSk7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5VcmxTdWJzY3JpcHRpb24odXJsVG9rZW4sIHsgcHJvdG9jb2w6IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbC5IVFRQUyB9KSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY1Rva2VuU3Vic2NyaXB0aW9uMTQxREQxQkUyJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ1JlZic6ICdteS1lbWFpbC0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdQcm90b2NvbCc6ICdlbWFpbCcsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWNUb2tlblN1YnNjcmlwdGlvbjI5M0JGRTNGOSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdFbmRwb2ludCc6IHtcbiAgICAgICAgICAgICdSZWYnOiAnbXktdXJsLTEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2h0dHBzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZW1haWwgYW5kIHVybCBzdWJzY3JpcHRpb25zIHdpdGggdW5yZXNvbHZlZCAtIGZvdXIgc3Vic2NyaXB0aW9ucycsICgpID0+IHtcbiAgY29uc3QgZW1haWxUb2tlbjEgPSBUb2tlbi5hc1N0cmluZyh7IFJlZjogJ215LWVtYWlsLTEnIH0pO1xuICBjb25zdCBlbWFpbFRva2VuMiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnbXktZW1haWwtMicgfSk7XG4gIGNvbnN0IGVtYWlsVG9rZW4zID0gVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdteS1lbWFpbC0zJyB9KTtcbiAgY29uc3QgZW1haWxUb2tlbjQgPSBUb2tlbi5hc1N0cmluZyh7IFJlZjogJ215LWVtYWlsLTQnIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5FbWFpbFN1YnNjcmlwdGlvbihlbWFpbFRva2VuMSkpO1xuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuRW1haWxTdWJzY3JpcHRpb24oZW1haWxUb2tlbjIpKTtcbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkVtYWlsU3Vic2NyaXB0aW9uKGVtYWlsVG9rZW4zKSk7XG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5FbWFpbFN1YnNjcmlwdGlvbihlbWFpbFRva2VuNCkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWNUb2tlblN1YnNjcmlwdGlvbjE0MUREMUJFMic6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdFbmRwb2ludCc6IHtcbiAgICAgICAgICAgICdSZWYnOiAnbXktZW1haWwtMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnZW1haWwnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeVRvcGljVG9rZW5TdWJzY3JpcHRpb24yOTNCRkUzRjknOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnUmVmJzogJ215LWVtYWlsLTInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1Byb3RvY29sJzogJ2VtYWlsJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY1Rva2VuU3Vic2NyaXB0aW9uMzM1QzJCNENBJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ1JlZic6ICdteS1lbWFpbC0zJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdQcm90b2NvbCc6ICdlbWFpbCcsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWNUb2tlblN1YnNjcmlwdGlvbjREQkU1MkEzRic6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdFbmRwb2ludCc6IHtcbiAgICAgICAgICAgICdSZWYnOiAnbXktZW1haWwtNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnZW1haWwnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdtdWx0aXBsZSBzdWJzY3JpcHRpb25zJywgKCkgPT4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkxhbWJkYVN1YnNjcmlwdGlvbihmdW5jKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZUU2Q0E2MjM1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgICAnTXlRdWV1ZVBvbGljeTZCQkVEREFDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWVQb2xpY3knLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnQXJuRXF1YWxzJzoge1xuICAgICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ3Nucy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnTXlRdWV1ZUU2Q0E2MjM1JyxcbiAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUXVldWVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnUmVmJzogJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015UXVldWVNeVRvcGljOUIwMDYzMUInOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnc3FzJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRW5kcG9pbnQnOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ01hbmFnZWRQb2xpY3lBcm5zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmM4QTI0M0EyQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0NvZGUnOiB7XG4gICAgICAgICAgICAnWmlwRmlsZSc6ICdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdIYW5kbGVyJzogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICAgICdSb2xlJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUZ1bmNTZXJ2aWNlUm9sZTU0MDY1MTMwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1J1bnRpbWUnOiAnbm9kZWpzMTQueCcsXG4gICAgICAgIH0sXG4gICAgICAgICdEZXBlbmRzT24nOiBbXG4gICAgICAgICAgJ015RnVuY1NlcnZpY2VSb2xlNTQwNjUxMzAnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdNeUZ1bmNBbGxvd0ludm9rZU15VG9waWNERDBBMTVCOCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnQWN0aW9uJzogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgJ0Z1bmN0aW9uTmFtZSc6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlGdW5jOEEyNDNBMkMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJpbmNpcGFsJzogJ3Nucy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAnU291cmNlQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015RnVuY015VG9waWM5M0I2RkIwMCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdQcm90b2NvbCc6ICdsYW1iZGEnLFxuICAgICAgICAgICdUb3BpY0Fybic6IHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdFbmRwb2ludCc6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlGdW5jOEEyNDNBMkMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIHdpdGggbXV0bGlwbGUgc3Vic2NyaXB0aW9ucyBvZiB0aGUgc2FtZSBzdWJzY3JpYmVyJywgKCkgPT4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG5cbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIGV4cGVjdCgoKSA9PiB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSkpXG4gICAgLnRvVGhyb3dFcnJvcigvQSBzdWJzY3JpcHRpb24gd2l0aCBpZCBcXFwiTXlUb3BpY1xcXCIgYWxyZWFkeSBleGlzdHMgdW5kZXIgdGhlIHNjb3BlIERlZmF1bHRcXC9NeVF1ZXVlLyk7XG59KTtcblxudGVzdCgnd2l0aCBmaWx0ZXIgcG9saWN5JywgKCkgPT4ge1xuICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0gZnVuY3Rpb24oZSwgYywgY2IpIHsgcmV0dXJuIGNiKCkgfScpLFxuICB9KTtcblxuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuTGFtYmRhU3Vic2NyaXB0aW9uKGZ1bmMsIHtcbiAgICBmaWx0ZXJQb2xpY3k6IHtcbiAgICAgIGNvbG9yOiBzbnMuU3Vic2NyaXB0aW9uRmlsdGVyLnN0cmluZ0ZpbHRlcih7XG4gICAgICAgIGFsbG93bGlzdDogWydyZWQnXSxcbiAgICAgICAgbWF0Y2hQcmVmaXhlczogWydibCcsICd5ZSddLFxuICAgICAgfSksXG4gICAgICBzaXplOiBzbnMuU3Vic2NyaXB0aW9uRmlsdGVyLnN0cmluZ0ZpbHRlcih7XG4gICAgICAgIGRlbnlsaXN0OiBbJ3NtYWxsJywgJ21lZGl1bSddLFxuICAgICAgfSksXG4gICAgICBwcmljZTogc25zLlN1YnNjcmlwdGlvbkZpbHRlci5udW1lcmljRmlsdGVyKHtcbiAgICAgICAgYmV0d2VlbjogeyBzdGFydDogMTAwLCBzdG9wOiAyMDAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsIHtcbiAgICAnRmlsdGVyUG9saWN5Jzoge1xuICAgICAgJ2NvbG9yJzogW1xuICAgICAgICAncmVkJyxcbiAgICAgICAge1xuICAgICAgICAgICdwcmVmaXgnOiAnYmwnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ3ByZWZpeCc6ICd5ZScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgJ3NpemUnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnYW55dGhpbmctYnV0JzogW1xuICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICdtZWRpdW0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgJ3ByaWNlJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ251bWVyaWMnOiBbXG4gICAgICAgICAgICAnPj0nLFxuICAgICAgICAgICAgMTAwLFxuICAgICAgICAgICAgJzw9JyxcbiAgICAgICAgICAgIDIwMCxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd3aXRoIGZpbHRlciBwb2xpY3kgc2NvcGUgTWVzc2FnZUJvZHknLCAoKSA9PiB7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuXG4gIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5MYW1iZGFTdWJzY3JpcHRpb24oZnVuYywge1xuICAgIGZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keToge1xuICAgICAgY29sb3I6IHNucy5GaWx0ZXJPclBvbGljeS5wb2xpY3koe1xuICAgICAgICBiYWNrZ3JvdW5kOiBzbnMuRmlsdGVyT3JQb2xpY3kuZmlsdGVyKHNucy5TdWJzY3JpcHRpb25GaWx0ZXIuc3RyaW5nRmlsdGVyKHtcbiAgICAgICAgICBhbGxvd2xpc3Q6IFsncmVkJ10sXG4gICAgICAgICAgbWF0Y2hQcmVmaXhlczogWydibCcsICd5ZSddLFxuICAgICAgICB9KSksXG4gICAgICB9KSxcbiAgICAgIHNpemU6IHNucy5GaWx0ZXJPclBvbGljeS5maWx0ZXIoc25zLlN1YnNjcmlwdGlvbkZpbHRlci5zdHJpbmdGaWx0ZXIoe1xuICAgICAgICBkZW55bGlzdDogWydzbWFsbCcsICdtZWRpdW0nXSxcbiAgICAgIH0pKSxcbiAgICB9LFxuICB9KSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCB7XG4gICAgJ0ZpbHRlclBvbGljeSc6IHtcbiAgICAgICdjb2xvcic6IHtcbiAgICAgICAgJ2JhY2tncm91bmQnOiBbXG4gICAgICAgICAgJ3JlZCcsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ3ByZWZpeCc6ICdibCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAncHJlZml4JzogJ3llJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdzaXplJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ2FueXRoaW5nLWJ1dCc6IFtcbiAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAnbWVkaXVtJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIEZpbHRlclBvbGljeVNjb3BlOiAnTWVzc2FnZUJvZHknLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdyZWdpb24gcHJvcGVydHkgaXMgcHJlc2VudCBvbiBhbiBpbXBvcnRlZCB0b3BpYyAtIHNxcycsICgpID0+IHtcbiAgY29uc3QgaW1wb3J0ZWQgPSBzbnMuVG9waWMuZnJvbVRvcGljQXJuKHN0YWNrLCAnbXl0b3BpYycsICdhcm46YXdzOnNuczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDpteXRvcGljJyk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ215cXVldWUnKTtcbiAgaW1wb3J0ZWQuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJywge1xuICAgIFJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3JlZ2lvbiBwcm9wZXJ0eSBvbiBhbiBpbXBvcnRlZCB0b3BpYyBhcyBhIHBhcmFtZXRlciAtIHNxcycsICgpID0+IHtcbiAgY29uc3QgdG9waWNBcm4gPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAndG9waWNBcm4nKTtcbiAgY29uc3QgaW1wb3J0ZWQgPSBzbnMuVG9waWMuZnJvbVRvcGljQXJuKHN0YWNrLCAnbXl0b3BpYycsIHRvcGljQXJuLnZhbHVlQXNTdHJpbmcpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdteXF1ZXVlJyk7XG4gIGltcG9ydGVkLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsIHtcbiAgICBSZWdpb246IHtcbiAgICAgICdGbjo6U2VsZWN0JzogWzMsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgJ1JlZic6ICd0b3BpY0FybicgfV0gfV0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgncmVnaW9uIHByb3BlcnR5IGlzIHByZXNlbnQgb24gYW4gaW1wb3J0ZWQgdG9waWMgLSBsYW1iZGEnLCAoKSA9PiB7XG4gIGNvbnN0IGltcG9ydGVkID0gc25zLlRvcGljLmZyb21Ub3BpY0FybihzdGFjaywgJ215dG9waWMnLCAnYXJuOmF3czpzbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTA6bXl0b3BpYycpO1xuICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015RnVuYycsIHtcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0gZnVuY3Rpb24oZSwgYywgY2IpIHsgcmV0dXJuIGNiKCkgfScpLFxuICB9KTtcbiAgaW1wb3J0ZWQuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkxhbWJkYVN1YnNjcmlwdGlvbihmdW5jKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCB7XG4gICAgUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgfSk7XG59KTtcblxudGVzdCgncmVnaW9uIHByb3BlcnR5IG9uIGFuIGltcG9ydGVkIHRvcGljIGFzIGEgcGFyYW1ldGVyIC0gbGFtYmRhJywgKCkgPT4ge1xuICBjb25zdCB0b3BpY0FybiA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICd0b3BpY0FybicpO1xuICBjb25zdCBpbXBvcnRlZCA9IHNucy5Ub3BpYy5mcm9tVG9waWNBcm4oc3RhY2ssICdteXRvcGljJywgdG9waWNBcm4udmFsdWVBc1N0cmluZyk7XG4gIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlGdW5jJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnRzLmhhbmRsZXIgPSBmdW5jdGlvbihlLCBjLCBjYikgeyByZXR1cm4gY2IoKSB9JyksXG4gIH0pO1xuICBpbXBvcnRlZC5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuTGFtYmRhU3Vic2NyaXB0aW9uKGZ1bmMpKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTTlM6OlN1YnNjcmlwdGlvbicsIHtcbiAgICBSZWdpb246IHtcbiAgICAgICdGbjo6U2VsZWN0JzogWzMsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgJ1JlZic6ICd0b3BpY0FybicgfV0gfV0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnc21zIHN1YnNjcmlwdGlvbicsICgpID0+IHtcbiAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNtc1N1YnNjcmlwdGlvbignKzE1NTUxMjMxMjM0JykpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015VG9waWM4Njg2OTQzNCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTTlM6OlRvcGljJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0Rpc3BsYXlOYW1lJzogJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgICAnVG9waWNOYW1lJzogJ3RvcGljTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ015VG9waWMxNTU1MTIzMTIzNDlDOERFRUVFJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1Byb3RvY29sJzogJ3NtcycsXG4gICAgICAgICAgJ1RvcGljQXJuJzoge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VuZHBvaW50JzogJysxNTU1MTIzMTIzNCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NtcyBzdWJzY3JpcHRpb24gd2l0aCB1bnJlc29sdmVkJywgKCkgPT4ge1xuICBjb25zdCBzbXNUb2tlbiA9IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnbXktc21zLTEnIH0pO1xuICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU21zU3Vic2NyaXB0aW9uKHNtc1Rva2VuKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnTXlUb3BpYzg2ODY5NDM0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRGlzcGxheU5hbWUnOiAnZGlzcGxheU5hbWUnLFxuICAgICAgICAgICdUb3BpY05hbWUnOiAndG9waWNOYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnTXlUb3BpY1Rva2VuU3Vic2NyaXB0aW9uMTQxREQxQkUyJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ0VuZHBvaW50Jzoge1xuICAgICAgICAgICAgJ1JlZic6ICdteS1zbXMtMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUHJvdG9jb2wnOiAnc21zJyxcbiAgICAgICAgICAnVG9waWNBcm4nOiB7XG4gICAgICAgICAgICAnUmVmJzogJ015VG9waWM4Njg2OTQzNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcbiJdfQ==