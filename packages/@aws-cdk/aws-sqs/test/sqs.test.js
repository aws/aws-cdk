"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const sqs = require("../lib");
/* eslint-disable quote-props */
test('default properties', () => {
    const stack = new core_1.Stack();
    const q = new sqs.Queue(stack, 'Queue');
    expect(q.fifo).toEqual(false);
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'Queue4A7E3555': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::SQS::Queue', {
        DeletionPolicy: 'Delete',
    });
});
test('with a dead letter queue', () => {
    const stack = new core_1.Stack();
    const dlq = new sqs.Queue(stack, 'DLQ');
    const dlqProps = { queue: dlq, maxReceiveCount: 3 };
    const queue = new sqs.Queue(stack, 'Queue', { deadLetterQueue: dlqProps });
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'DLQ581697C4': {
                'Type': 'AWS::SQS::Queue',
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
            'Queue4A7E3555': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'RedrivePolicy': {
                        'deadLetterTargetArn': {
                            'Fn::GetAtt': [
                                'DLQ581697C4',
                                'Arn',
                            ],
                        },
                        'maxReceiveCount': 3,
                    },
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
    expect(queue.deadLetterQueue).toEqual(dlqProps);
});
test('message retention period must be between 1 minute to 14 days', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // THEN
    expect(() => new sqs.Queue(stack, 'MyQueue', {
        retentionPeriod: core_1.Duration.seconds(30),
    })).toThrow(/message retention period must be 60 seconds or more/);
    expect(() => new sqs.Queue(stack, 'AnotherQueue', {
        retentionPeriod: core_1.Duration.days(15),
    })).toThrow(/message retention period must be 1209600 seconds or less/);
});
test('message retention period can be provided as a parameter', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const parameter = new core_1.CfnParameter(stack, 'my-retention-period', {
        type: 'Number',
        default: 30,
    });
    // WHEN
    new sqs.Queue(stack, 'MyQueue', {
        retentionPeriod: core_1.Duration.seconds(parameter.valueAsNumber),
    });
    // THEN
    assertions_1.Template.fromStack(stack).templateMatches({
        'Parameters': {
            'myretentionperiod': {
                'Type': 'Number',
                'Default': 30,
            },
        },
        'Resources': {
            'MyQueueE6CA6235': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'MessageRetentionPeriod': {
                        'Ref': 'myretentionperiod',
                    },
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
});
test('addToPolicy will automatically create a policy for this queue', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    queue.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['sqs:*'],
        principals: [new iam.ArnPrincipal('arn')],
    }));
    assertions_1.Template.fromStack(stack).templateMatches({
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
                                'Action': 'sqs:*',
                                'Effect': 'Allow',
                                'Principal': {
                                    'AWS': 'arn',
                                },
                                'Resource': '*',
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
        },
    });
});
describe('export and import', () => {
    test('importing works correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const imports = sqs.Queue.fromQueueArn(stack, 'Imported', 'arn:aws:sqs:us-east-1:123456789012:queue1');
        // THEN
        // "import" returns an IQueue bound to `Fn::ImportValue`s.
        expect(stack.resolve(imports.queueArn)).toEqual('arn:aws:sqs:us-east-1:123456789012:queue1');
        expect(stack.resolve(imports.queueUrl)).toEqual({
            'Fn::Join': ['', ['https://sqs.us-east-1.', { Ref: 'AWS::URLSuffix' }, '/123456789012/queue1']],
        });
        expect(stack.resolve(imports.queueName)).toEqual('queue1');
    });
    test('importing fifo and standard queues are detected correctly', () => {
        const stack = new core_1.Stack();
        const stdQueue = sqs.Queue.fromQueueArn(stack, 'StdQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');
        const fifoQueue = sqs.Queue.fromQueueArn(stack, 'FifoQueue', 'arn:aws:sqs:us-east-1:123456789012:queue2.fifo');
        expect(stdQueue.fifo).toEqual(false);
        expect(fifoQueue.fifo).toEqual(true);
    });
    test('import queueArn from token, fifo and standard queues can be defined', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const stdQueue1 = sqs.Queue.fromQueueAttributes(stack, 'StdQueue1', {
            queueArn: core_1.Token.asString({ Ref: 'ARN' }),
        });
        const stdQueue2 = sqs.Queue.fromQueueAttributes(stack, 'StdQueue2', {
            queueArn: core_1.Token.asString({ Ref: 'ARN' }),
            fifo: false,
        });
        const fifoQueue = sqs.Queue.fromQueueAttributes(stack, 'FifoQueue', {
            queueArn: core_1.Token.asString({ Ref: 'ARN' }),
            fifo: true,
        });
        // THEN
        expect(stdQueue1.fifo).toEqual(false);
        expect(stdQueue2.fifo).toEqual(false);
        expect(fifoQueue.fifo).toEqual(true);
    });
    test('import queueArn from token, check attributes', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const stdQueue1 = sqs.Queue.fromQueueArn(stack, 'StdQueue', core_1.Token.asString({ Ref: 'ARN' }));
        // THEN
        expect(stack.resolve(stdQueue1.queueArn)).toEqual({
            Ref: 'ARN',
        });
        expect(stack.resolve(stdQueue1.queueName)).toEqual({
            'Fn::Select': [5, { 'Fn::Split': [':', { Ref: 'ARN' }] }],
        });
        expect(stack.resolve(stdQueue1.queueUrl)).toEqual({
            'Fn::Join': ['',
                ['https://sqs.',
                    { 'Fn::Select': [3, { 'Fn::Split': [':', { Ref: 'ARN' }] }] },
                    '.',
                    { Ref: 'AWS::URLSuffix' },
                    '/',
                    { 'Fn::Select': [4, { 'Fn::Split': [':', { Ref: 'ARN' }] }] },
                    '/',
                    { 'Fn::Select': [5, { 'Fn::Split': [':', { Ref: 'ARN' }] }] }]],
        });
        expect(stdQueue1.fifo).toEqual(false);
    });
    test('fails if fifo flag is set for non fifo queue name', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        // THEN
        expect(() => sqs.Queue.fromQueueAttributes(stack, 'ImportedStdQueue', {
            queueArn: 'arn:aws:sqs:us-west-2:123456789012:queue1',
            fifo: true,
        })).toThrow(/FIFO queue names must end in '.fifo'/);
    });
    test('fails if fifo flag is false for fifo queue name', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        // THEN
        expect(() => sqs.Queue.fromQueueAttributes(stack, 'ImportedFifoQueue', {
            queueArn: 'arn:aws:sqs:us-west-2:123456789012:queue1.fifo',
            fifo: false,
        })).toThrow(/Non-FIFO queue name may not end in '.fifo'/);
    });
    test('importing works correctly for cross region queue', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });
        // WHEN
        const imports = sqs.Queue.fromQueueArn(stack, 'Imported', 'arn:aws:sqs:us-west-2:123456789012:queue1');
        // THEN
        // "import" returns an IQueue bound to `Fn::ImportValue`s.
        expect(stack.resolve(imports.queueArn)).toEqual('arn:aws:sqs:us-west-2:123456789012:queue1');
        expect(stack.resolve(imports.queueUrl)).toEqual({
            'Fn::Join': ['', ['https://sqs.us-west-2.', { Ref: 'AWS::URLSuffix' }, '/123456789012/queue1']],
        });
        expect(stack.resolve(imports.queueName)).toEqual('queue1');
    });
});
describe('grants', () => {
    test('grantConsumeMessages', () => {
        testGrant((q, p) => q.grantConsumeMessages(p), 'sqs:ReceiveMessage', 'sqs:ChangeMessageVisibility', 'sqs:GetQueueUrl', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes');
    });
    test('grantSendMessages', () => {
        testGrant((q, p) => q.grantSendMessages(p), 'sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl');
    });
    test('grantPurge', () => {
        testGrant((q, p) => q.grantPurge(p), 'sqs:PurgeQueue', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl');
    });
    test('grant() is general purpose', () => {
        testGrant((q, p) => q.grant(p, 'service:hello', 'service:world'), 'service:hello', 'service:world');
    });
    test('grants also work on imported queues', () => {
        const stack = new core_1.Stack();
        const queue = sqs.Queue.fromQueueAttributes(stack, 'Import', {
            queueArn: 'arn:aws:sqs:us-east-1:123456789012:queue1',
            queueUrl: 'https://queue-url',
        });
        const user = new iam.User(stack, 'User');
        queue.grantPurge(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'sqs:PurgeQueue',
                            'sqs:GetQueueAttributes',
                            'sqs:GetQueueUrl',
                        ],
                        'Effect': 'Allow',
                        'Resource': 'arn:aws:sqs:us-east-1:123456789012:queue1',
                    },
                ],
                'Version': '2012-10-17',
            },
        });
    });
});
describe('queue encryption', () => {
    test('encryptionMasterKey can be set to a custom KMS key', () => {
        const stack = new core_1.Stack();
        const key = new kms.Key(stack, 'CustomKey');
        const queue = new sqs.Queue(stack, 'Queue', { encryptionMasterKey: key });
        expect(queue.encryptionMasterKey).toEqual(key);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
            'KmsMasterKeyId': { 'Fn::GetAtt': ['CustomKey1E6D0D07', 'Arn'] },
        });
    });
    test('a kms key will be allocated if encryption = kms but a master key is not specified', () => {
        const stack = new core_1.Stack();
        new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', assertions_1.Match.anyValue());
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
            'KmsMasterKeyId': {
                'Fn::GetAtt': [
                    'QueueKey39FCBAE6',
                    'Arn',
                ],
            },
        });
    });
    test('it is possible to use a managed kms key', () => {
        const stack = new core_1.Stack();
        new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS_MANAGED });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Queue4A7E3555': {
                    'Type': 'AWS::SQS::Queue',
                    'Properties': {
                        'KmsMasterKeyId': 'alias/aws/sqs',
                    },
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
            },
        });
    });
    test('grant also affects key on encrypted queue', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const queue = new sqs.Queue(stack, 'Queue', {
            encryption: sqs.QueueEncryption.KMS,
        });
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('someone'),
        });
        // WHEN
        queue.grantSendMessages(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'sqs:SendMessage',
                            'sqs:GetQueueAttributes',
                            'sqs:GetQueueUrl',
                        ],
                        'Effect': 'Allow',
                        'Resource': { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] },
                    },
                    {
                        'Action': [
                            'kms:Decrypt',
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        'Effect': 'Allow',
                        'Resource': { 'Fn::GetAtt': ['QueueKey39FCBAE6', 'Arn'] },
                    },
                ],
                'Version': '2012-10-17',
            },
        });
    });
    test('it is possible to use sqs managed server side encryption', () => {
        const stack = new core_1.Stack();
        new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.SQS_MANAGED });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Queue4A7E3555': {
                    'Type': 'AWS::SQS::Queue',
                    'Properties': {
                        'SqsManagedSseEnabled': true,
                    },
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
            },
        });
    });
    test('it is possible to disable encryption (unencrypted)', () => {
        const stack = new core_1.Stack();
        new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.UNENCRYPTED });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Queue4A7E3555': {
                    'Type': 'AWS::SQS::Queue',
                    'Properties': {
                        'SqsManagedSseEnabled': false,
                    },
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
            },
        });
    });
    test('encryptionMasterKey is not supported if encryption type SQS_MANAGED is used', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const key = new kms.Key(stack, 'CustomKey');
        // THEN
        expect(() => new sqs.Queue(stack, 'Queue', {
            encryption: sqs.QueueEncryption.SQS_MANAGED,
            encryptionMasterKey: key,
        })).toThrow(/'encryptionMasterKey' is not supported if encryption type 'SQS_MANAGED' is used/);
    });
});
describe('encryption in transit', () => {
    test('enforceSSL can be enabled', () => {
        const stack = new core_1.Stack();
        new sqs.Queue(stack, 'Queue', { enforceSSL: true });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'Queue4A7E3555': {
                    'Type': 'AWS::SQS::Queue',
                    'UpdateReplacePolicy': 'Delete',
                    'DeletionPolicy': 'Delete',
                },
                'QueuePolicy25439813': {
                    'Type': 'AWS::SQS::QueuePolicy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sqs:*',
                                    'Condition': {
                                        'Bool': {
                                            'aws:SecureTransport': 'false',
                                        },
                                    },
                                    'Effect': 'Deny',
                                    'Principal': {
                                        'AWS': '*',
                                    },
                                    'Resource': {
                                        'Fn::GetAtt': [
                                            'Queue4A7E3555',
                                            'Arn',
                                        ],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
            },
        });
    });
});
test('test ".fifo" suffixed queues register as fifo', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'Queue', {
        queueName: 'MyQueue.fifo',
    });
    expect(queue.fifo).toEqual(true);
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'Queue4A7E3555': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'QueueName': 'MyQueue.fifo',
                    'FifoQueue': true,
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
});
test('test a fifo queue is observed when the "fifo" property is specified', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'Queue', {
        fifo: true,
    });
    expect(queue.fifo).toEqual(true);
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'Queue4A7E3555': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'FifoQueue': true,
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
});
test('test a fifo queue is observed when high throughput properties are specified', () => {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'Queue', {
        fifo: true,
        fifoThroughputLimit: sqs.FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
        deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
    });
    expect(queue.fifo).toEqual(true);
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'Queue4A7E3555': {
                'Type': 'AWS::SQS::Queue',
                'Properties': {
                    'DeduplicationScope': 'messageGroup',
                    'FifoQueue': true,
                    'FifoThroughputLimit': 'perMessageGroupId',
                },
                'UpdateReplacePolicy': 'Delete',
                'DeletionPolicy': 'Delete',
            },
        },
    });
});
test('test a queue throws when fifoThroughputLimit specified on non fifo queue', () => {
    const stack = new core_1.Stack();
    expect(() => {
        new sqs.Queue(stack, 'Queue', {
            fifo: false,
            fifoThroughputLimit: sqs.FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
        });
    }).toThrow();
});
test('test a queue throws when deduplicationScope specified on non fifo queue', () => {
    const stack = new core_1.Stack();
    expect(() => {
        new sqs.Queue(stack, 'Queue', {
            fifo: false,
            deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
        });
    }).toThrow();
});
test('test metrics', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'Queue');
    // THEN
    expect(stack.resolve(queue.metricNumberOfMessagesSent())).toEqual({
        dimensions: { QueueName: { 'Fn::GetAtt': ['Queue4A7E3555', 'QueueName'] } },
        namespace: 'AWS/SQS',
        metricName: 'NumberOfMessagesSent',
        period: core_1.Duration.minutes(5),
        statistic: 'Sum',
    });
    expect(stack.resolve(queue.metricSentMessageSize())).toEqual({
        dimensions: { QueueName: { 'Fn::GetAtt': ['Queue4A7E3555', 'QueueName'] } },
        namespace: 'AWS/SQS',
        metricName: 'SentMessageSize',
        period: core_1.Duration.minutes(5),
        statistic: 'Average',
    });
});
test('fails if queue policy has no actions', () => {
    // GIVEN
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack');
    const queue = new sqs.Queue(stack, 'Queue');
    // WHEN
    queue.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        principals: [new iam.ArnPrincipal('arn')],
    }));
    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});
test('fails if queue policy has no IAM principals', () => {
    // GIVEN
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack');
    const queue = new sqs.Queue(stack, 'Queue');
    // WHEN
    queue.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['sqs:*'],
    }));
    // THEN
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});
function testGrant(action, ...expectedActions) {
    const stack = new core_1.Stack();
    const queue = new sqs.Queue(stack, 'MyQueue');
    const principal = new iam.User(stack, 'User');
    action(queue, principal);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
            'Statement': [
                {
                    'Action': expectedActions,
                    'Effect': 'Allow',
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
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUEwRTtBQUMxRSw4QkFBOEI7QUFFOUIsZ0NBQWdDO0FBRWhDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXhDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTlCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxXQUFXLEVBQUU7WUFDWCxlQUFlLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIscUJBQXFCLEVBQUUsUUFBUTtnQkFDL0IsZ0JBQWdCLEVBQUUsUUFBUTthQUMzQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFO1FBQ3ZELGNBQWMsRUFBRSxRQUFRO0tBQ3pCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsTUFBTSxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNwRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRTNFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxXQUFXLEVBQUU7WUFDWCxhQUFhLEVBQUU7Z0JBQ2IsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIscUJBQXFCLEVBQUUsUUFBUTtnQkFDL0IsZ0JBQWdCLEVBQUUsUUFBUTthQUMzQjtZQUNELGVBQWUsRUFBRTtnQkFDZixNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osZUFBZSxFQUFFO3dCQUNmLHFCQUFxQixFQUFFOzRCQUNyQixZQUFZLEVBQUU7Z0NBQ1osYUFBYTtnQ0FDYixLQUFLOzZCQUNOO3lCQUNGO3dCQUNELGlCQUFpQixFQUFFLENBQUM7cUJBQ3JCO2lCQUNGO2dCQUNELHFCQUFxQixFQUFFLFFBQVE7Z0JBQy9CLGdCQUFnQixFQUFFLFFBQVE7YUFDM0I7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtJQUN4RSxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNDLGVBQWUsRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztLQUN0QyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscURBQXFELENBQUMsQ0FBQztJQUVuRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDaEQsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQ25DLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtJQUNuRSxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFO1FBQy9ELElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLEVBQUU7S0FDWixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDOUIsZUFBZSxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztLQUMzRCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQ3hDLFlBQVksRUFBRTtZQUNaLG1CQUFtQixFQUFFO2dCQUNuQixNQUFNLEVBQUUsUUFBUTtnQkFDaEIsU0FBUyxFQUFFLEVBQUU7YUFDZDtTQUNGO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsaUJBQWlCLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLFlBQVksRUFBRTtvQkFDWix3QkFBd0IsRUFBRTt3QkFDeEIsS0FBSyxFQUFFLG1CQUFtQjtxQkFDM0I7aUJBQ0Y7Z0JBQ0QscUJBQXFCLEVBQUUsUUFBUTtnQkFDL0IsZ0JBQWdCLEVBQUUsUUFBUTthQUMzQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO0lBQ3pFLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5QyxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ2hELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNoQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDbEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUoscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLGlCQUFpQixFQUFFO2dCQUNqQixNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixxQkFBcUIsRUFBRSxRQUFRO2dCQUMvQixnQkFBZ0IsRUFBRSxRQUFRO2FBQzNCO1lBQ0QsdUJBQXVCLEVBQUU7Z0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7Z0JBQy9CLFlBQVksRUFBRTtvQkFDWixnQkFBZ0IsRUFBRTt3QkFDaEIsV0FBVyxFQUFFOzRCQUNYO2dDQUNFLFFBQVEsRUFBRSxPQUFPO2dDQUNqQixRQUFRLEVBQUUsT0FBTztnQ0FDakIsV0FBVyxFQUFFO29DQUNYLEtBQUssRUFBRSxLQUFLO2lDQUNiO2dDQUNELFVBQVUsRUFBRSxHQUFHOzZCQUNoQjt5QkFDRjt3QkFDRCxTQUFTLEVBQUUsWUFBWTtxQkFDeEI7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSOzRCQUNFLEtBQUssRUFBRSxpQkFBaUI7eUJBQ3pCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7UUFFdkcsT0FBTztRQUVQLDBEQUEwRDtRQUMxRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUM3RixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDOUMsVUFBVSxFQUNWLENBQUMsRUFBRSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BGLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7UUFDckUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7UUFDeEcsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO1FBQy9HLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtRQUMvRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ2xFLFFBQVEsRUFBRSxZQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNsRSxRQUFRLEVBQUUsWUFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN4QyxJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNsRSxRQUFRLEVBQUUsWUFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN4QyxJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFNUYsT0FBTztRQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNoRCxHQUFHLEVBQUUsS0FBSztTQUNYLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNqRCxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQzFELENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNoRCxVQUFVLEVBQ1IsQ0FBQyxFQUFFO2dCQUNELENBQUMsY0FBYztvQkFDYixFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDN0QsR0FBRztvQkFDSCxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTtvQkFDekIsR0FBRztvQkFDSCxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDN0QsR0FBRztvQkFDSCxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1FBQzdELFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQ3BFLFFBQVEsRUFBRSwyQ0FBMkM7WUFDckQsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXpDLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7WUFDckUsUUFBUSxFQUFFLGdEQUFnRDtZQUMxRCxJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFOUUsT0FBTztRQUNQLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztRQUV2RyxPQUFPO1FBRVAsMERBQTBEO1FBQzFELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUM5QyxVQUFVLEVBQ1YsQ0FBQyxFQUFFLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLHNCQUFzQixDQUFDLENBQUM7U0FDcEYsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFDM0Msb0JBQW9CLEVBQ3BCLDZCQUE2QixFQUM3QixpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLHdCQUF3QixDQUN6QixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzdCLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFDeEMsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixpQkFBaUIsQ0FDbEIsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDdEIsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFDakMsZ0JBQWdCLEVBQ2hCLHdCQUF3QixFQUN4QixpQkFBaUIsQ0FDbEIsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLEVBQzlELGVBQWUsRUFDZixlQUFlLENBQ2hCLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDM0QsUUFBUSxFQUFFLDJDQUEyQztZQUNyRCxRQUFRLEVBQUUsbUJBQW1CO1NBQzlCLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxnQkFBZ0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFO29CQUNYO3dCQUNFLFFBQVEsRUFBRTs0QkFDUixnQkFBZ0I7NEJBQ2hCLHdCQUF3Qjs0QkFDeEIsaUJBQWlCO3lCQUNsQjt3QkFDRCxRQUFRLEVBQUUsT0FBTzt3QkFDakIsVUFBVSxFQUFFLDJDQUEyQztxQkFDeEQ7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLFlBQVk7YUFDeEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzlELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFMUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRSxnQkFBZ0IsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxFQUFFO1NBQ2pFLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1GQUFtRixFQUFFLEdBQUcsRUFBRTtRQUM3RixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUV2RSxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsa0JBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ25GLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLGdCQUFnQixFQUFFO2dCQUNoQixZQUFZLEVBQUU7b0JBQ1osa0JBQWtCO29CQUNsQixLQUFLO2lCQUNOO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDL0UscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFdBQVcsRUFBRTtnQkFDWCxlQUFlLEVBQUU7b0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsWUFBWSxFQUFFO3dCQUNaLGdCQUFnQixFQUFFLGVBQWU7cUJBQ2xDO29CQUNELHFCQUFxQixFQUFFLFFBQVE7b0JBQy9CLGdCQUFnQixFQUFFLFFBQVE7aUJBQzNCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDMUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRztTQUNwQyxDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGdCQUFnQixFQUFFO2dCQUNoQixXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsUUFBUSxFQUFFOzRCQUNSLGlCQUFpQjs0QkFDakIsd0JBQXdCOzRCQUN4QixpQkFBaUI7eUJBQ2xCO3dCQUNELFFBQVEsRUFBRSxPQUFPO3dCQUNqQixVQUFVLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLEVBQUU7cUJBQ3ZEO29CQUNEO3dCQUNFLFFBQVEsRUFBRTs0QkFDUixhQUFhOzRCQUNiLGFBQWE7NEJBQ2IsZ0JBQWdCOzRCQUNoQixzQkFBc0I7eUJBQ3ZCO3dCQUNELFFBQVEsRUFBRSxPQUFPO3dCQUNqQixVQUFVLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsRUFBRTtxQkFDMUQ7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLFlBQVk7YUFDeEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDL0UscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFdBQVcsRUFBRTtnQkFDWCxlQUFlLEVBQUU7b0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsWUFBWSxFQUFFO3dCQUNaLHNCQUFzQixFQUFFLElBQUk7cUJBQzdCO29CQUNELHFCQUFxQixFQUFFLFFBQVE7b0JBQy9CLGdCQUFnQixFQUFFLFFBQVE7aUJBQzNCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDL0UscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFdBQVcsRUFBRTtnQkFDWCxlQUFlLEVBQUU7b0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsWUFBWSxFQUFFO3dCQUNaLHNCQUFzQixFQUFFLEtBQUs7cUJBQzlCO29CQUNELHFCQUFxQixFQUFFLFFBQVE7b0JBQy9CLGdCQUFnQixFQUFFLFFBQVE7aUJBQzNCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7UUFDdkYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUU1QyxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3pDLFVBQVUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVc7WUFDM0MsbUJBQW1CLEVBQUUsR0FBRztTQUN6QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUZBQWlGLENBQUMsQ0FBQztJQUNqRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtJQUNyQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVwRCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxFQUFFO2dCQUNYLGVBQWUsRUFBRTtvQkFDZixNQUFNLEVBQUUsaUJBQWlCO29CQUN6QixxQkFBcUIsRUFBRSxRQUFRO29CQUMvQixnQkFBZ0IsRUFBRSxRQUFRO2lCQUMzQjtnQkFDRCxxQkFBcUIsRUFBRTtvQkFDckIsTUFBTSxFQUFFLHVCQUF1QjtvQkFDL0IsWUFBWSxFQUFFO3dCQUNaLGdCQUFnQixFQUFFOzRCQUNoQixXQUFXLEVBQUU7Z0NBQ1g7b0NBQ0UsUUFBUSxFQUFFLE9BQU87b0NBQ2pCLFdBQVcsRUFBRTt3Q0FDWCxNQUFNLEVBQUU7NENBQ04scUJBQXFCLEVBQUUsT0FBTzt5Q0FDL0I7cUNBQ0Y7b0NBQ0QsUUFBUSxFQUFFLE1BQU07b0NBQ2hCLFdBQVcsRUFBRTt3Q0FDWCxLQUFLLEVBQUUsR0FBRztxQ0FDWDtvQ0FDRCxVQUFVLEVBQUU7d0NBQ1YsWUFBWSxFQUFFOzRDQUNaLGVBQWU7NENBQ2YsS0FBSzt5Q0FDTjtxQ0FDRjtpQ0FDRjs2QkFDRjs0QkFDRCxTQUFTLEVBQUUsWUFBWTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO0lBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDMUMsU0FBUyxFQUFFLGNBQWM7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLGVBQWUsRUFBRTtnQkFDZixNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osV0FBVyxFQUFFLGNBQWM7b0JBQzNCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQjtnQkFDRCxxQkFBcUIsRUFBRSxRQUFRO2dCQUMvQixnQkFBZ0IsRUFBRSxRQUFRO2FBQzNCO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7SUFDL0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUMxQyxJQUFJLEVBQUUsSUFBSTtLQUNYLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxXQUFXLEVBQUU7WUFDWCxlQUFlLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLGlCQUFpQjtnQkFDekIsWUFBWSxFQUFFO29CQUNaLFdBQVcsRUFBRSxJQUFJO2lCQUNsQjtnQkFDRCxxQkFBcUIsRUFBRSxRQUFRO2dCQUMvQixnQkFBZ0IsRUFBRSxRQUFRO2FBQzNCO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7SUFDdkYsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUMxQyxJQUFJLEVBQUUsSUFBSTtRQUNWLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0I7UUFDakUsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGFBQWE7S0FDekQsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLGVBQWUsRUFBRTtnQkFDZixNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixZQUFZLEVBQUU7b0JBQ1osb0JBQW9CLEVBQUUsY0FBYztvQkFDcEMsV0FBVyxFQUFFLElBQUk7b0JBQ2pCLHFCQUFxQixFQUFFLG1CQUFtQjtpQkFDM0M7Z0JBQ0QscUJBQXFCLEVBQUUsUUFBUTtnQkFDL0IsZ0JBQWdCLEVBQUUsUUFBUTthQUMzQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMEVBQTBFLEVBQUUsR0FBRyxFQUFFO0lBQ3BGLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzVCLElBQUksRUFBRSxLQUFLO1lBQ1gsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQjtTQUNsRSxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNmLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtJQUNuRixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDVixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUM1QixJQUFJLEVBQUUsS0FBSztZQUNYLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhO1NBQ3pELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUN4QixRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTVDLE9BQU87SUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hFLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsRUFBRSxFQUFFO1FBQzNFLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxzQkFBc0I7UUFDbEMsTUFBTSxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzNCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDM0QsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUU7UUFDM0UsU0FBUyxFQUFFLFNBQVM7UUFDcEIsVUFBVSxFQUFFLGlCQUFpQjtRQUM3QixNQUFNLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDM0IsU0FBUyxFQUFFLFNBQVM7S0FDckIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELFFBQVE7SUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTVDLE9BQU87SUFDUCxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQ2hELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNoQixVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSixPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO0FBQy9HLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUN2RCxRQUFRO0lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztJQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDekMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUU1QyxPQUFPO0lBQ1AsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztRQUNoRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDaEIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO0tBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUosT0FBTztJQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsMkZBQTJGLENBQUMsQ0FBQztBQUNqSSxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsU0FBUyxDQUFDLE1BQXlELEVBQUUsR0FBRyxlQUF5QjtJQUN4RyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU5QyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXpCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1FBQ2xFLGdCQUFnQixFQUFFO1lBQ2hCLFdBQVcsRUFBRTtnQkFDWDtvQkFDRSxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLFVBQVUsRUFBRTt3QkFDVixZQUFZLEVBQUU7NEJBQ1osaUJBQWlCOzRCQUNqQixLQUFLO3lCQUNOO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxTQUFTLEVBQUUsWUFBWTtTQUN4QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IENmblBhcmFtZXRlciwgRHVyYXRpb24sIFN0YWNrLCBBcHAsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxudGVzdCgnZGVmYXVsdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJyk7XG5cbiAgZXhwZWN0KHEuZmlmbykudG9FcXVhbChmYWxzZSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnUXVldWU0QTdFMzU1NSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3dpdGggYSBkZWFkIGxldHRlciBxdWV1ZScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgZGxxID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ0RMUScpO1xuICBjb25zdCBkbHFQcm9wcyA9IHsgcXVldWU6IGRscSwgbWF4UmVjZWl2ZUNvdW50OiAzIH07XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJywgeyBkZWFkTGV0dGVyUXVldWU6IGRscVByb3BzIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ0RMUTU4MTY5N0M0Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgICAnUXVldWU0QTdFMzU1NSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1JlZHJpdmVQb2xpY3knOiB7XG4gICAgICAgICAgICAnZGVhZExldHRlclRhcmdldEFybic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0RMUTU4MTY5N0M0JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnbWF4UmVjZWl2ZUNvdW50JzogMyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgZXhwZWN0KHF1ZXVlLmRlYWRMZXR0ZXJRdWV1ZSkudG9FcXVhbChkbHFQcm9wcyk7XG59KTtcblxudGVzdCgnbWVzc2FnZSByZXRlbnRpb24gcGVyaW9kIG11c3QgYmUgYmV0d2VlbiAxIG1pbnV0ZSB0byAxNCBkYXlzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJywge1xuICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gIH0pKS50b1Rocm93KC9tZXNzYWdlIHJldGVudGlvbiBwZXJpb2QgbXVzdCBiZSA2MCBzZWNvbmRzIG9yIG1vcmUvKTtcblxuICBleHBlY3QoKCkgPT4gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ0Fub3RoZXJRdWV1ZScsIHtcbiAgICByZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLmRheXMoMTUpLFxuICB9KSkudG9UaHJvdygvbWVzc2FnZSByZXRlbnRpb24gcGVyaW9kIG11c3QgYmUgMTIwOTYwMCBzZWNvbmRzIG9yIGxlc3MvKTtcbn0pO1xuXG50ZXN0KCdtZXNzYWdlIHJldGVudGlvbiBwZXJpb2QgY2FuIGJlIHByb3ZpZGVkIGFzIGEgcGFyYW1ldGVyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBwYXJhbWV0ZXIgPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnbXktcmV0ZW50aW9uLXBlcmlvZCcsIHtcbiAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICBkZWZhdWx0OiAzMCxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScsIHtcbiAgICByZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLnNlY29uZHMocGFyYW1ldGVyLnZhbHVlQXNOdW1iZXIpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUGFyYW1ldGVycyc6IHtcbiAgICAgICdteXJldGVudGlvbnBlcmlvZCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnTnVtYmVyJyxcbiAgICAgICAgJ0RlZmF1bHQnOiAzMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ01lc3NhZ2VSZXRlbnRpb25QZXJpb2QnOiB7XG4gICAgICAgICAgICAnUmVmJzogJ215cmV0ZW50aW9ucGVyaW9kJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnYWRkVG9Qb2xpY3kgd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIHBvbGljeSBmb3IgdGhpcyBxdWV1ZScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScpO1xuICBxdWV1ZS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIGFjdGlvbnM6IFsnc3FzOionXSxcbiAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgfSkpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ015UXVldWVFNkNBNjIzNSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgICAgJ015UXVldWVQb2xpY3k2QkJFRERBQyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3FzOionLFxuICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAnQVdTJzogJ2FybicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnUXVldWVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnUmVmJzogJ015UXVldWVFNkNBNjIzNScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdleHBvcnQgYW5kIGltcG9ydCcsICgpID0+IHtcbiAgdGVzdCgnaW1wb3J0aW5nIHdvcmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0cyA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBcm4oc3RhY2ssICdJbXBvcnRlZCcsICdhcm46YXdzOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnF1ZXVlMScpO1xuXG4gICAgLy8gVEhFTlxuXG4gICAgLy8gXCJpbXBvcnRcIiByZXR1cm5zIGFuIElRdWV1ZSBib3VuZCB0byBgRm46OkltcG9ydFZhbHVlYHMuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0cy5xdWV1ZUFybikpLnRvRXF1YWwoJ2Fybjphd3M6c3FzOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6cXVldWUxJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0cy5xdWV1ZVVybCkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzpcbiAgICAgIFsnJywgWydodHRwczovL3Nxcy51cy1lYXN0LTEuJywgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSwgJy8xMjM0NTY3ODkwMTIvcXVldWUxJ11dLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydHMucXVldWVOYW1lKSkudG9FcXVhbCgncXVldWUxJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGluZyBmaWZvIGFuZCBzdGFuZGFyZCBxdWV1ZXMgYXJlIGRldGVjdGVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHN0ZFF1ZXVlID0gc3FzLlF1ZXVlLmZyb21RdWV1ZUFybihzdGFjaywgJ1N0ZFF1ZXVlJywgJ2Fybjphd3M6c3FzOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6cXVldWUxJyk7XG4gICAgY29uc3QgZmlmb1F1ZXVlID0gc3FzLlF1ZXVlLmZyb21RdWV1ZUFybihzdGFjaywgJ0ZpZm9RdWV1ZScsICdhcm46YXdzOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnF1ZXVlMi5maWZvJyk7XG4gICAgZXhwZWN0KHN0ZFF1ZXVlLmZpZm8pLnRvRXF1YWwoZmFsc2UpO1xuICAgIGV4cGVjdChmaWZvUXVldWUuZmlmbykudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IHF1ZXVlQXJuIGZyb20gdG9rZW4sIGZpZm8gYW5kIHN0YW5kYXJkIHF1ZXVlcyBjYW4gYmUgZGVmaW5lZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RkUXVldWUxID0gc3FzLlF1ZXVlLmZyb21RdWV1ZUF0dHJpYnV0ZXMoc3RhY2ssICdTdGRRdWV1ZTEnLCB7XG4gICAgICBxdWV1ZUFybjogVG9rZW4uYXNTdHJpbmcoeyBSZWY6ICdBUk4nIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0ZFF1ZXVlMiA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBdHRyaWJ1dGVzKHN0YWNrLCAnU3RkUXVldWUyJywge1xuICAgICAgcXVldWVBcm46IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnQVJOJyB9KSxcbiAgICAgIGZpZm86IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IGZpZm9RdWV1ZSA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBdHRyaWJ1dGVzKHN0YWNrLCAnRmlmb1F1ZXVlJywge1xuICAgICAgcXVldWVBcm46IFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnQVJOJyB9KSxcbiAgICAgIGZpZm86IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0ZFF1ZXVlMS5maWZvKS50b0VxdWFsKGZhbHNlKTtcbiAgICBleHBlY3Qoc3RkUXVldWUyLmZpZm8pLnRvRXF1YWwoZmFsc2UpO1xuICAgIGV4cGVjdChmaWZvUXVldWUuZmlmbykudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IHF1ZXVlQXJuIGZyb20gdG9rZW4sIGNoZWNrIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0ZFF1ZXVlMSA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBcm4oc3RhY2ssICdTdGRRdWV1ZScsIFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnQVJOJyB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RkUXVldWUxLnF1ZXVlQXJuKSkudG9FcXVhbCh7XG4gICAgICBSZWY6ICdBUk4nLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0ZFF1ZXVlMS5xdWV1ZU5hbWUpKS50b0VxdWFsKHtcbiAgICAgICdGbjo6U2VsZWN0JzogWzUsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgUmVmOiAnQVJOJyB9XSB9XSxcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGRRdWV1ZTEucXVldWVVcmwpKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6XG4gICAgICAgIFsnJyxcbiAgICAgICAgICBbJ2h0dHBzOi8vc3FzLicsXG4gICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzMsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgUmVmOiAnQVJOJyB9XSB9XSB9LFxuICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSxcbiAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbNCwgeyAnRm46OlNwbGl0JzogWyc6JywgeyBSZWY6ICdBUk4nIH1dIH1dIH0sXG4gICAgICAgICAgICAnLycsXG4gICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzUsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgUmVmOiAnQVJOJyB9XSB9XSB9XV0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHN0ZFF1ZXVlMS5maWZvKS50b0VxdWFsKGZhbHNlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgZmlmbyBmbGFnIGlzIHNldCBmb3Igbm9uIGZpZm8gcXVldWUgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBzcXMuUXVldWUuZnJvbVF1ZXVlQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkU3RkUXVldWUnLCB7XG4gICAgICBxdWV1ZUFybjogJ2Fybjphd3M6c3FzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6cXVldWUxJyxcbiAgICAgIGZpZm86IHRydWUsXG4gICAgfSkpLnRvVGhyb3coL0ZJRk8gcXVldWUgbmFtZXMgbXVzdCBlbmQgaW4gJy5maWZvJy8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBmaWZvIGZsYWcgaXMgZmFsc2UgZm9yIGZpZm8gcXVldWUgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBzcXMuUXVldWUuZnJvbVF1ZXVlQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkRmlmb1F1ZXVlJywge1xuICAgICAgcXVldWVBcm46ICdhcm46YXdzOnNxczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnF1ZXVlMS5maWZvJyxcbiAgICAgIGZpZm86IGZhbHNlLFxuICAgIH0pKS50b1Rocm93KC9Ob24tRklGTyBxdWV1ZSBuYW1lIG1heSBub3QgZW5kIGluICcuZmlmbycvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0aW5nIHdvcmtzIGNvcnJlY3RseSBmb3IgY3Jvc3MgcmVnaW9uIHF1ZXVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnU3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0cyA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBcm4oc3RhY2ssICdJbXBvcnRlZCcsICdhcm46YXdzOnNxczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnF1ZXVlMScpO1xuXG4gICAgLy8gVEhFTlxuXG4gICAgLy8gXCJpbXBvcnRcIiByZXR1cm5zIGFuIElRdWV1ZSBib3VuZCB0byBgRm46OkltcG9ydFZhbHVlYHMuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0cy5xdWV1ZUFybikpLnRvRXF1YWwoJ2Fybjphd3M6c3FzOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6cXVldWUxJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0cy5xdWV1ZVVybCkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzpcbiAgICAgIFsnJywgWydodHRwczovL3Nxcy51cy13ZXN0LTIuJywgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSwgJy8xMjM0NTY3ODkwMTIvcXVldWUxJ11dLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydHMucXVldWVOYW1lKSkudG9FcXVhbCgncXVldWUxJyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdncmFudHMnLCAoKSA9PiB7XG4gIHRlc3QoJ2dyYW50Q29uc3VtZU1lc3NhZ2VzJywgKCkgPT4ge1xuICAgIHRlc3RHcmFudCgocSwgcCkgPT4gcS5ncmFudENvbnN1bWVNZXNzYWdlcyhwKSxcbiAgICAgICdzcXM6UmVjZWl2ZU1lc3NhZ2UnLFxuICAgICAgJ3NxczpDaGFuZ2VNZXNzYWdlVmlzaWJpbGl0eScsXG4gICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICdzcXM6RGVsZXRlTWVzc2FnZScsXG4gICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnRTZW5kTWVzc2FnZXMnLCAoKSA9PiB7XG4gICAgdGVzdEdyYW50KChxLCBwKSA9PiBxLmdyYW50U2VuZE1lc3NhZ2VzKHApLFxuICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdncmFudFB1cmdlJywgKCkgPT4ge1xuICAgIHRlc3RHcmFudCgocSwgcCkgPT4gcS5ncmFudFB1cmdlKHApLFxuICAgICAgJ3NxczpQdXJnZVF1ZXVlJyxcbiAgICAgICdzcXM6R2V0UXVldWVBdHRyaWJ1dGVzJyxcbiAgICAgICdzcXM6R2V0UXVldWVVcmwnLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50KCkgaXMgZ2VuZXJhbCBwdXJwb3NlJywgKCkgPT4ge1xuICAgIHRlc3RHcmFudCgocSwgcCkgPT4gcS5ncmFudChwLCAnc2VydmljZTpoZWxsbycsICdzZXJ2aWNlOndvcmxkJyksXG4gICAgICAnc2VydmljZTpoZWxsbycsXG4gICAgICAnc2VydmljZTp3b3JsZCcsXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnRzIGFsc28gd29yayBvbiBpbXBvcnRlZCBxdWV1ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBxdWV1ZSA9IHNxcy5RdWV1ZS5mcm9tUXVldWVBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0Jywge1xuICAgICAgcXVldWVBcm46ICdhcm46YXdzOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnF1ZXVlMScsXG4gICAgICBxdWV1ZVVybDogJ2h0dHBzOi8vcXVldWUtdXJsJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICBxdWV1ZS5ncmFudFB1cmdlKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ3NxczpQdXJnZVF1ZXVlJyxcbiAgICAgICAgICAgICAgJ3NxczpHZXRRdWV1ZUF0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgICAnc3FzOkdldFF1ZXVlVXJsJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnF1ZXVlMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncXVldWUgZW5jcnlwdGlvbicsICgpID0+IHtcbiAgdGVzdCgnZW5jcnlwdGlvbk1hc3RlcktleSBjYW4gYmUgc2V0IHRvIGEgY3VzdG9tIEtNUyBrZXknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnQ3VzdG9tS2V5Jyk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnLCB7IGVuY3J5cHRpb25NYXN0ZXJLZXk6IGtleSB9KTtcblxuICAgIGV4cGVjdChxdWV1ZS5lbmNyeXB0aW9uTWFzdGVyS2V5KS50b0VxdWFsKGtleSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAgICdLbXNNYXN0ZXJLZXlJZCc6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0N1c3RvbUtleTFFNkQwRDA3JywgJ0FybiddIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Ega21zIGtleSB3aWxsIGJlIGFsbG9jYXRlZCBpZiBlbmNyeXB0aW9uID0ga21zIGJ1dCBhIG1hc3RlciBrZXkgaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJywgeyBlbmNyeXB0aW9uOiBzcXMuUXVldWVFbmNyeXB0aW9uLktNUyB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5JywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U1FTOjpRdWV1ZScsIHtcbiAgICAgICdLbXNNYXN0ZXJLZXlJZCc6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ1F1ZXVlS2V5MzlGQ0JBRTYnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaXQgaXMgcG9zc2libGUgdG8gdXNlIGEgbWFuYWdlZCBrbXMga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnLCB7IGVuY3J5cHRpb246IHNxcy5RdWV1ZUVuY3J5cHRpb24uS01TX01BTkFHRUQgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ1F1ZXVlNEE3RTM1NTUnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdLbXNNYXN0ZXJLZXlJZCc6ICdhbGlhcy9hd3Mvc3FzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCBhbHNvIGFmZmVjdHMga2V5IG9uIGVuY3J5cHRlZCBxdWV1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnLCB7XG4gICAgICBlbmNyeXB0aW9uOiBzcXMuUXVldWVFbmNyeXB0aW9uLktNUyxcbiAgICB9KTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzb21lb25lJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcXVldWUuZ3JhbnRTZW5kTWVzc2FnZXMocm9sZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICAgICAgICdzcXM6R2V0UXVldWVBdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgICAgJ3NxczpHZXRRdWV1ZVVybCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6R2V0QXR0JzogWydRdWV1ZTRBN0UzNTU1JywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkdldEF0dCc6IFsnUXVldWVLZXkzOUZDQkFFNicsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaXQgaXMgcG9zc2libGUgdG8gdXNlIHNxcyBtYW5hZ2VkIHNlcnZlciBzaWRlIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScsIHsgZW5jcnlwdGlvbjogc3FzLlF1ZXVlRW5jcnlwdGlvbi5TUVNfTUFOQUdFRCB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnUXVldWU0QTdFMzU1NSc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1Nxc01hbmFnZWRTc2VFbmFibGVkJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpdCBpcyBwb3NzaWJsZSB0byBkaXNhYmxlIGVuY3J5cHRpb24gKHVuZW5jcnlwdGVkKScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJywgeyBlbmNyeXB0aW9uOiBzcXMuUXVldWVFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdRdWV1ZTRBN0UzNTU1Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnU3FzTWFuYWdlZFNzZUVuYWJsZWQnOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbmNyeXB0aW9uTWFzdGVyS2V5IGlzIG5vdCBzdXBwb3J0ZWQgaWYgZW5jcnlwdGlvbiB0eXBlIFNRU19NQU5BR0VEIGlzIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnQ3VzdG9tS2V5Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScsIHtcbiAgICAgIGVuY3J5cHRpb246IHNxcy5RdWV1ZUVuY3J5cHRpb24uU1FTX01BTkFHRUQsXG4gICAgICBlbmNyeXB0aW9uTWFzdGVyS2V5OiBrZXksXG4gICAgfSkpLnRvVGhyb3coLydlbmNyeXB0aW9uTWFzdGVyS2V5JyBpcyBub3Qgc3VwcG9ydGVkIGlmIGVuY3J5cHRpb24gdHlwZSAnU1FTX01BTkFHRUQnIGlzIHVzZWQvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2VuY3J5cHRpb24gaW4gdHJhbnNpdCcsICgpID0+IHtcbiAgdGVzdCgnZW5mb3JjZVNTTCBjYW4gYmUgZW5hYmxlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScsIHsgZW5mb3JjZVNTTDogdHJ1ZSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdRdWV1ZTRBN0UzNTU1Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZScsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1F1ZXVlUG9saWN5MjU0Mzk4MTMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlUG9saWN5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3NxczoqJyxcbiAgICAgICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgICdCb29sJzoge1xuICAgICAgICAgICAgICAgICAgICAgICdhd3M6U2VjdXJlVHJhbnNwb3J0JzogJ2ZhbHNlJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0RlbnknLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0FXUyc6ICcqJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCd0ZXN0IFwiLmZpZm9cIiBzdWZmaXhlZCBxdWV1ZXMgcmVnaXN0ZXIgYXMgZmlmbycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnLCB7XG4gICAgcXVldWVOYW1lOiAnTXlRdWV1ZS5maWZvJyxcbiAgfSk7XG5cbiAgZXhwZWN0KHF1ZXVlLmZpZm8pLnRvRXF1YWwodHJ1ZSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnUXVldWU0QTdFMzU1NSc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpTUVM6OlF1ZXVlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1F1ZXVlTmFtZSc6ICdNeVF1ZXVlLmZpZm8nLFxuICAgICAgICAgICdGaWZvUXVldWUnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndGVzdCBhIGZpZm8gcXVldWUgaXMgb2JzZXJ2ZWQgd2hlbiB0aGUgXCJmaWZvXCIgcHJvcGVydHkgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScsIHtcbiAgICBmaWZvOiB0cnVlLFxuICB9KTtcblxuICBleHBlY3QocXVldWUuZmlmbykudG9FcXVhbCh0cnVlKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICdRdWV1ZTRBN0UzNTU1Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OlNRUzo6UXVldWUnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnRmlmb1F1ZXVlJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rlc3QgYSBmaWZvIHF1ZXVlIGlzIG9ic2VydmVkIHdoZW4gaGlnaCB0aHJvdWdocHV0IHByb3BlcnRpZXMgYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnLCB7XG4gICAgZmlmbzogdHJ1ZSxcbiAgICBmaWZvVGhyb3VnaHB1dExpbWl0OiBzcXMuRmlmb1Rocm91Z2hwdXRMaW1pdC5QRVJfTUVTU0FHRV9HUk9VUF9JRCxcbiAgICBkZWR1cGxpY2F0aW9uU2NvcGU6IHNxcy5EZWR1cGxpY2F0aW9uU2NvcGUuTUVTU0FHRV9HUk9VUCxcbiAgfSk7XG5cbiAgZXhwZWN0KHF1ZXVlLmZpZm8pLnRvRXF1YWwodHJ1ZSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgJ1F1ZXVlNEE3RTM1NTUnOiB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6U1FTOjpRdWV1ZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdEZWR1cGxpY2F0aW9uU2NvcGUnOiAnbWVzc2FnZUdyb3VwJyxcbiAgICAgICAgICAnRmlmb1F1ZXVlJzogdHJ1ZSxcbiAgICAgICAgICAnRmlmb1Rocm91Z2hwdXRMaW1pdCc6ICdwZXJNZXNzYWdlR3JvdXBJZCcsXG4gICAgICAgIH0sXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd0ZXN0IGEgcXVldWUgdGhyb3dzIHdoZW4gZmlmb1Rocm91Z2hwdXRMaW1pdCBzcGVjaWZpZWQgb24gbm9uIGZpZm8gcXVldWUnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJywge1xuICAgICAgZmlmbzogZmFsc2UsXG4gICAgICBmaWZvVGhyb3VnaHB1dExpbWl0OiBzcXMuRmlmb1Rocm91Z2hwdXRMaW1pdC5QRVJfTUVTU0FHRV9HUk9VUF9JRCxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygpO1xufSk7XG5cbnRlc3QoJ3Rlc3QgYSBxdWV1ZSB0aHJvd3Mgd2hlbiBkZWR1cGxpY2F0aW9uU2NvcGUgc3BlY2lmaWVkIG9uIG5vbiBmaWZvIHF1ZXVlJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBzcXMuUXVldWUoc3RhY2ssICdRdWV1ZScsIHtcbiAgICAgIGZpZm86IGZhbHNlLFxuICAgICAgZGVkdXBsaWNhdGlvblNjb3BlOiBzcXMuRGVkdXBsaWNhdGlvblNjb3BlLk1FU1NBR0VfR1JPVVAsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coKTtcbn0pO1xuXG50ZXN0KCd0ZXN0IG1ldHJpY3MnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShxdWV1ZS5tZXRyaWNOdW1iZXJPZk1lc3NhZ2VzU2VudCgpKSkudG9FcXVhbCh7XG4gICAgZGltZW5zaW9uczogeyBRdWV1ZU5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1F1ZXVlNEE3RTM1NTUnLCAnUXVldWVOYW1lJ10gfSB9LFxuICAgIG5hbWVzcGFjZTogJ0FXUy9TUVMnLFxuICAgIG1ldHJpY05hbWU6ICdOdW1iZXJPZk1lc3NhZ2VzU2VudCcsXG4gICAgcGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gIH0pO1xuXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHF1ZXVlLm1ldHJpY1NlbnRNZXNzYWdlU2l6ZSgpKSkudG9FcXVhbCh7XG4gICAgZGltZW5zaW9uczogeyBRdWV1ZU5hbWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1F1ZXVlNEE3RTM1NTUnLCAnUXVldWVOYW1lJ10gfSB9LFxuICAgIG5hbWVzcGFjZTogJ0FXUy9TUVMnLFxuICAgIG1ldHJpY05hbWU6ICdTZW50TWVzc2FnZVNpemUnLFxuICAgIHBlcmlvZDogRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZmFpbHMgaWYgcXVldWUgcG9saWN5IGhhcyBubyBhY3Rpb25zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ1F1ZXVlJyk7XG5cbiAgLy8gV0hFTlxuICBxdWV1ZS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuJyldLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy8pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIGlmIHF1ZXVlIHBvbGljeSBoYXMgbm8gSUFNIHByaW5jaXBhbHMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAvLyBXSEVOXG4gIHF1ZXVlLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIHJlc291cmNlczogWycqJ10sXG4gICAgYWN0aW9uczogWydzcXM6KiddLFxuICB9KSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IHVzZWQgaW4gYSByZXNvdXJjZS1iYXNlZCBwb2xpY3kgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBJQU0gcHJpbmNpcGFsLyk7XG59KTtcblxuZnVuY3Rpb24gdGVzdEdyYW50KGFjdGlvbjogKHE6IHNxcy5RdWV1ZSwgcHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbCkgPT4gdm9pZCwgLi4uZXhwZWN0ZWRBY3Rpb25zOiBzdHJpbmdbXSkge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUoc3RhY2ssICdNeVF1ZXVlJyk7XG4gIGNvbnN0IHByaW5jaXBhbCA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcblxuICBhY3Rpb24ocXVldWUsIHByaW5jaXBhbCk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdBY3Rpb24nOiBleHBlY3RlZEFjdGlvbnMsXG4gICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeVF1ZXVlRTZDQTYyMzUnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==