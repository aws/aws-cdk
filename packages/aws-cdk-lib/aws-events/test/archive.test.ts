import { Template } from '../../assertions';

import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';

import { Duration, Stack } from '../../core';
import { EventBus } from '../lib';
import { Archive } from '../lib/archive';

describe('archive', () => {
  test('creates an archive for an EventBus', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const eventBus = new EventBus(stack, 'Bus');

    new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        account: [stack.account],
      },
      retention: Duration.days(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
      Name: 'Bus',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
      EventPattern: {
        account: [{
          Ref: 'AWS::AccountId',
        }],
      },
      RetentionDays: 10,
      SourceArn: {
        'Fn::GetAtt': [
          'BusEA82B648',
          'Arn',
        ],
      },
    });
  });

  test('creates an archive for an EventBus with a pattern including a detailType property', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const eventBus = new EventBus(stack, 'Bus');

    new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        account: [stack.account],
        detailType: ['Custom Detail Type'],
      },
      retention: Duration.days(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
      Name: 'Bus',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
      EventPattern: {
        'account': [{
          Ref: 'AWS::AccountId',
        }],
        'detail-type': ['Custom Detail Type'],
      },
      RetentionDays: 10,
      SourceArn: {
        'Fn::GetAtt': [
          'BusEA82B648',
          'Arn',
        ],
      },
    });
  });

  test('should have defined defaultChild', () => {
    const stack = new Stack();

    const eventBus = new EventBus(stack, 'Bus');

    const archive = new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        account: [stack.account],
      },
      retention: Duration.days(10),
    });

    expect(archive.node.defaultChild).toBe(archive.node.findChild('Archive'));
  });

  // Create archive with CMK
  test('Archive with a customer managed key on an event bus', () => {
    // GIVEN
    const stack = new Stack();

    const eventBus = new EventBus(stack, 'Bus');
    const key = new kms.Key(stack, 'Key');

    // WHEN
    const archive = new Archive(stack, 'Archive', {
      kmsKey: key,
      sourceEventBus: eventBus,
      eventPattern: {
        source: ['test'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
      KmsKeyIdentifier: stack.resolve(key.keyArn),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          // Match IAM User permissions, should exist by default
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:GenerateDataKey',
              'kms:ReEncrypt*',
            ],
            Effect: 'Allow',
            Principal: {
              Service: 'events.amazonaws.com',
            },
            Resource: '*',
            Sid: 'Allow EventBridge to use kms operations',
            Condition: {
              StringEquals: {
                'kms:EncryptionContext:aws:events:event-bus:arn': {
                  'Fn::GetAtt': [
                    'BusEA82B648',
                    'Arn',
                  ],
                },
              },
            },
          },
          {
            Action: 'kms:DescribeKey',
            Effect: 'Allow',
            Principal: {
              Service: 'events.amazonaws.com',
            },
            Resource: '*',
            Sid: 'Allow EventBridge to call kms:DescribeKey',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  // Create archive without supplying CMK, verify that the template contains the empty key identifier
  test('Archive without passing a key has an empty key identifier', () => {
    // GIVEN
    const stack = new Stack();

    const eventBus = new EventBus(stack, 'Bus');

    // WHEN
    const archive = new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        source: ['test'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
      KmsKeyIdentifier: '',
    });
  });
});
