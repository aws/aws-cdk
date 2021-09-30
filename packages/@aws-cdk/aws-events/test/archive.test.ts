import '@aws-cdk/assert-internal/jest';
import { Duration, Stack } from '@aws-cdk/core';
import { EventBus } from '../lib';
import { Archive } from '../lib/archive';

describe('archive', () => {
  test('creates an archive for an EventBus', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    let eventBus = new EventBus(stack, 'Bus');

    new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        account: [stack.account],
      },
      retention: Duration.days(10),
    });

    // THEN
    expect(stack).toHaveResource('AWS::Events::EventBus', {
      Name: 'Bus',
    });

    expect(stack).toHaveResource('AWS::Events::Archive', {
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
    let eventBus = new EventBus(stack, 'Bus');

    new Archive(stack, 'Archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        account: [stack.account],
        detailType: ['Custom Detail Type'],
      },
      retention: Duration.days(10),
    });

    // THEN
    expect(stack).toHaveResource('AWS::Events::EventBus', {
      Name: 'Bus',
    });

    expect(stack).toHaveResource('AWS::Events::Archive', {
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
});
