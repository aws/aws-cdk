import { Template } from '../../../assertions';
import { Stack } from '../../../core';
import { AwsCustomResource, PhysicalResourceId } from '../../lib';
import { Logging } from '../../lib/aws-custom-resource/logging';

describe('logging configuration', () => {
  test('logging is on by default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      resourceType: 'Custom::LogRetentionPolicy',
      onCreate: {
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90,
        },
        physicalResourceId: PhysicalResourceId.of('loggroup'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetentionPolicy', {
      Create: JSON.stringify({
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90,
        },
        physicalResourceId: {
          id: 'loggroup',
        },
      }),
      InstallLatestAwsSdk: true,
    });
  });

  test('with logging on set explicitly', () => {
    // GIVEN
    const stack = new Stack();
    const logging = Logging.on();

    // WHEN
    new AwsCustomResource(stack, 'AwsSdk', {
      resourceType: 'Custom::LogRetentionPolicy',
      onCreate: {
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90,
        },
        physicalResourceId: PhysicalResourceId.of('loggroup'),
      },
      logging,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::LogRetentionPolicy', {
      Create: JSON.stringify({
        service: 'CloudWatchLogs',
        action: 'putRetentionPolicy',
        parameters: {
          logGroupName: '/aws/lambda/loggroup',
          retentionInDays: 90,
        },
        physicalResourceId: {
          id: 'loggroup',
        },
      }),
      InstallLatestAwsSdk: true,
    });
  });
});