import { Template } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
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

    expect(archive.node.defaultChild).toBeDefined();
  });
});
