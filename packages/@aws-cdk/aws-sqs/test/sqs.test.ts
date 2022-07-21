import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { CfnParameter, Duration, Stack, App, Token } from '@aws-cdk/core';
import * as sqs from '../lib';

/* eslint-disable quote-props */

test('default properties', () => {
  const stack = new Stack();
  const q = new sqs.Queue(stack, 'Queue');

  expect(q.fifo).toEqual(false);

  Template.fromStack(stack).templateMatches({
    'Resources': {
      'Queue4A7E3555': {
        'Type': 'AWS::SQS::Queue',
        'UpdateReplacePolicy': 'Delete',
        'DeletionPolicy': 'Delete',
      },
    },
  });

  Template.fromStack(stack).hasResource('AWS::SQS::Queue', {
    DeletionPolicy: 'Delete',
  });
});

test('sets timeout prop to default value if not passed', () => {
  const stack = new Stack();
  const q = new sqs.Queue(stack, 'Queue');

  expect(q.visibilityTimeout).toEqual(Duration.seconds(30));
});

test('with a dead letter queue', () => {
  const stack = new Stack();
  const dlq = new sqs.Queue(stack, 'DLQ');
  const dlqProps = { queue: dlq, maxReceiveCount: 3 };
  const queue = new sqs.Queue(stack, 'Queue', { deadLetterQueue: dlqProps });

  Template.fromStack(stack).templateMatches({
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
  const stack = new Stack();

  // THEN
  expect(() => new sqs.Queue(stack, 'MyQueue', {
    retentionPeriod: Duration.seconds(30),
  })).toThrow(/message retention period must be 60 seconds or more/);

  expect(() => new sqs.Queue(stack, 'AnotherQueue', {
    retentionPeriod: Duration.days(15),
  })).toThrow(/message retention period must be 1209600 seconds or less/);
});

test('message retention period can be provided as a parameter', () => {
  // GIVEN
  const stack = new Stack();
  const parameter = new CfnParameter(stack, 'my-retention-period', {
    type: 'Number',
    default: 30,
  });

  // WHEN
  new sqs.Queue(stack, 'MyQueue', {
    retentionPeriod: Duration.seconds(parameter.valueAsNumber),
  });

  // THEN
  Template.fromStack(stack).templateMatches({
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
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');
  queue.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: ['sqs:*'],
    principals: [new iam.ArnPrincipal('arn')],
  }));

  Template.fromStack(stack).templateMatches({
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
  test('importing from Arn works correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imports = sqs.Queue.fromQueueArn(stack, 'Imported', 'arn:aws:sqs:us-east-1:123456789012:queue1');

    // THEN

    // "import" returns an IQueue bound to `Fn::ImportValue`s.
    expect(stack.resolve(imports.queueArn)).toEqual('arn:aws:sqs:us-east-1:123456789012:queue1');
    expect(stack.resolve(imports.queueUrl)).toEqual({
      'Fn::Join':
      ['', ['https://sqs.us-east-1.', { Ref: 'AWS::URLSuffix' }, '/123456789012/queue1']],
    });
    expect(stack.resolve(imports.queueName)).toEqual('queue1');
  });

  test('importing fifo and standard queues from Arn are detected correctly', () => {
    const stack = new Stack();
    const stdQueue = sqs.Queue.fromQueueArn(stack, 'StdQueue', 'arn:aws:sqs:us-east-1:123456789012:queue1');
    const fifoQueue = sqs.Queue.fromQueueArn(stack, 'FifoQueue', 'arn:aws:sqs:us-east-1:123456789012:queue2.fifo');
    expect(stdQueue.fifo).toEqual(false);
    expect(fifoQueue.fifo).toEqual(true);
  });

  test('import queueArn from token, fifo and standard queues can be defined', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const stdQueue1 = sqs.Queue.fromQueueAttributes(stack, 'StdQueue1', {
      queueArn: Token.asString({ Ref: 'ARN' }),
    });
    const stdQueue2 = sqs.Queue.fromQueueAttributes(stack, 'StdQueue2', {
      queueArn: Token.asString({ Ref: 'ARN' }),
      fifo: false,
    });
    const fifoQueue = sqs.Queue.fromQueueAttributes(stack, 'FifoQueue', {
      queueArn: Token.asString({ Ref: 'ARN' }),
      fifo: true,
    });

    // THEN
    expect(stdQueue1.fifo).toEqual(false);
    expect(stdQueue2.fifo).toEqual(false);
    expect(fifoQueue.fifo).toEqual(true);
  });

  test('import queueArn from token, check attributes', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const stdQueue1 = sqs.Queue.fromQueueArn(stack, 'StdQueue', Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(stdQueue1.queueArn)).toEqual({
      Ref: 'ARN',
    });
    expect(stack.resolve(stdQueue1.queueName)).toEqual({
      'Fn::Select': [5, { 'Fn::Split': [':', { Ref: 'ARN' }] }],
    });
    expect(stack.resolve(stdQueue1.queueUrl)).toEqual({
      'Fn::Join':
        ['',
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
    const app = new App();
    const stack = new Stack(app, 'my-stack');

    // THEN
    expect(() => sqs.Queue.fromQueueAttributes(stack, 'ImportedStdQueue', {
      queueArn: 'arn:aws:sqs:us-west-2:123456789012:queue1',
      fifo: true,
    })).toThrow(/FIFO queue names must end in '.fifo'/);
  });

  test('fails if fifo flag is false for fifo queue name', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'my-stack');

    // THEN
    expect(() => sqs.Queue.fromQueueAttributes(stack, 'ImportedFifoQueue', {
      queueArn: 'arn:aws:sqs:us-west-2:123456789012:queue1.fifo',
      fifo: false,
    })).toThrow(/Non-FIFO queue name may not end in '.fifo'/);
  });

  test('importing works correctly for cross region queue', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    const imports = sqs.Queue.fromQueueArn(stack, 'Imported', 'arn:aws:sqs:us-west-2:123456789012:queue1');

    // THEN

    // "import" returns an IQueue bound to `Fn::ImportValue`s.
    expect(stack.resolve(imports.queueArn)).toEqual('arn:aws:sqs:us-west-2:123456789012:queue1');
    expect(stack.resolve(imports.queueUrl)).toEqual({
      'Fn::Join':
      ['', ['https://sqs.us-west-2.', { Ref: 'AWS::URLSuffix' }, '/123456789012/queue1']],
    });
    expect(stack.resolve(imports.queueName)).toEqual('queue1');
  });

  test('importing correctly sets visibility timeout if passed', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imports = sqs.Queue.fromQueueAttributes(stack, 'Imported', {
      queueArn: 'arn:aws:sqs:region:account:queue',
      visibilityTimeout: Duration.minutes(5),
    });

    // THEN
    expect(imports.visibilityTimeout).toEqual(Duration.minutes(5));
  });
});

describe('grants', () => {
  test('grantConsumeMessages', () => {
    testGrant((q, p) => q.grantConsumeMessages(p),
      'sqs:ReceiveMessage',
      'sqs:ChangeMessageVisibility',
      'sqs:GetQueueUrl',
      'sqs:DeleteMessage',
      'sqs:GetQueueAttributes',
    );
  });

  test('grantSendMessages', () => {
    testGrant((q, p) => q.grantSendMessages(p),
      'sqs:SendMessage',
      'sqs:GetQueueAttributes',
      'sqs:GetQueueUrl',
    );
  });

  test('grantPurge', () => {
    testGrant((q, p) => q.grantPurge(p),
      'sqs:PurgeQueue',
      'sqs:GetQueueAttributes',
      'sqs:GetQueueUrl',
    );
  });

  test('grant() is general purpose', () => {
    testGrant((q, p) => q.grant(p, 'service:hello', 'service:world'),
      'service:hello',
      'service:world',
    );
  });

  test('grants also work on imported queues', () => {
    const stack = new Stack();
    const queue = sqs.Queue.fromQueueAttributes(stack, 'Import', {
      queueArn: 'arn:aws:sqs:us-east-1:123456789012:queue1',
      queueUrl: 'https://queue-url',
    });

    const user = new iam.User(stack, 'User');

    queue.grantPurge(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    const stack = new Stack();

    const key = new kms.Key(stack, 'CustomKey');
    const queue = new sqs.Queue(stack, 'Queue', { encryptionMasterKey: key });

    expect(queue.encryptionMasterKey).toEqual(key);
    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
      'KmsMasterKeyId': { 'Fn::GetAtt': ['CustomKey1E6D0D07', 'Arn'] },
    });
  });

  test('a kms key will be allocated if encryption = kms but a master key is not specified', () => {
    const stack = new Stack();

    new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', Match.anyValue());
    Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
      'KmsMasterKeyId': {
        'Fn::GetAtt': [
          'QueueKey39FCBAE6',
          'Arn',
        ],
      },
    });
  });

  test('it is possible to use a managed kms key', () => {
    const stack = new Stack();

    new sqs.Queue(stack, 'Queue', { encryption: sqs.QueueEncryption.KMS_MANAGED });
    Template.fromStack(stack).templateMatches({
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
    const stack = new Stack();
    const queue = new sqs.Queue(stack, 'Queue', {
      encryption: sqs.QueueEncryption.KMS,
    });
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('someone'),
    });

    // WHEN
    queue.grantSendMessages(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
});

test('test ".fifo" suffixed queues register as fifo', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'Queue', {
    queueName: 'MyQueue.fifo',
  });

  expect(queue.fifo).toEqual(true);

  Template.fromStack(stack).templateMatches({
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
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'Queue', {
    fifo: true,
  });

  expect(queue.fifo).toEqual(true);

  Template.fromStack(stack).templateMatches({
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
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'Queue', {
    fifo: true,
    fifoThroughputLimit: sqs.FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
    deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
  });

  expect(queue.fifo).toEqual(true);
  Template.fromStack(stack).templateMatches({
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
  const stack = new Stack();
  expect(() => {
    new sqs.Queue(stack, 'Queue', {
      fifo: false,
      fifoThroughputLimit: sqs.FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
    });
  }).toThrow();
});

test('test a queue throws when deduplicationScope specified on non fifo queue', () => {
  const stack = new Stack();
  expect(() => {
    new sqs.Queue(stack, 'Queue', {
      fifo: false,
      deduplicationScope: sqs.DeduplicationScope.MESSAGE_GROUP,
    });
  }).toThrow();
});

test('test metrics', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'Queue');

  // THEN
  expect(stack.resolve(queue.metricNumberOfMessagesSent())).toEqual({
    dimensions: { QueueName: { 'Fn::GetAtt': ['Queue4A7E3555', 'QueueName'] } },
    namespace: 'AWS/SQS',
    metricName: 'NumberOfMessagesSent',
    period: Duration.minutes(5),
    statistic: 'Sum',
  });

  expect(stack.resolve(queue.metricSentMessageSize())).toEqual({
    dimensions: { QueueName: { 'Fn::GetAtt': ['Queue4A7E3555', 'QueueName'] } },
    namespace: 'AWS/SQS',
    metricName: 'SentMessageSize',
    period: Duration.minutes(5),
    statistic: 'Average',
  });
});

test('fails if queue policy has no actions', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'my-stack');
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
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const queue = new sqs.Queue(stack, 'Queue');

  // WHEN
  queue.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: ['sqs:*'],
  }));

  // THEN
  expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});

function testGrant(action: (q: sqs.Queue, principal: iam.IPrincipal) => void, ...expectedActions: string[]) {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');
  const principal = new iam.User(stack, 'User');

  action(queue, principal);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
