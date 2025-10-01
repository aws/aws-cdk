import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as secretsmanager from '../../aws-secretsmanager';
import * as firehose from '../lib';

describe('Datadog destination', () => {
  let stack: cdk.Stack;
  let secret: secretsmanager.Secret;

  beforeEach(() => {
    stack = new cdk.Stack();
    secret = new secretsmanager.Secret(stack, 'ApiSecret', {});
  });

  it('provides defaults when only required configuration is provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.Datadog({
        apiKey: secret,
        url: firehose.DatadogLogsEndpointUrl.DATADOG_LOGS_US1,
      }),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      HttpEndpointDestinationConfiguration: {
        RoleARN: {
          'Fn::GetAtt': [
            'DeliveryStreamHTTPDestinationRoleD8ECD827',
            'Arn',
          ],
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
        },
        BufferingHints: {
          IntervalInSeconds: 60,
          SizeInMBs: 4,
        },
        RequestConfiguration: {
          ContentEncoding: 'GZIP',
          CommonAttributes: [],
        },
        RetryOptions: {
          DurationInSeconds: 60,
        },
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
  });

  it('adds attributes when tags are provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.Datadog({
        apiKey: secret,
        url: firehose.DatadogLogsEndpointUrl.DATADOG_LOGS_US1,
        tags: [{ name: 'source', value: 'cloudfront' }, { name: 'region', value: 'us-west-2' }],
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      HttpEndpointDestinationConfiguration: {
        RequestConfiguration: {
          CommonAttributes: [
            {
              AttributeName: 'source',
              AttributeValue: 'cloudfront',
            },
            {
              AttributeName: 'region',
              AttributeValue: 'us-west-2',
            },
          ],
        },
      },
    });
  });
});
