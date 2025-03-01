import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as secretsmanager from '../../aws-secretsmanager';
import * as firehose from '../lib';

describe('Datadog destination', () => {
  let stack: cdk.Stack;
  let destinationRole: iam.IRole;
  let secret: secretsmanager.Secret;

  beforeEach(() => {
    stack = new cdk.Stack();
    secret = new secretsmanager.Secret(stack, 'ApiSecret', {});
    destinationRole = new iam.Role(stack, 'Destination Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  });

  it('provides defaults when only required configuration is provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.Datadog({
        apiKey: secret,
        url: firehose.DatadogLogsEndpointUrl.DATADOG_LOGS_US1,
        role: destinationRole,
      }),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      HttpEndpointDestinationConfiguration: {
        RoleARN: stack.resolve(destinationRole.roleArn),
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
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogStream', 1);
  });

  it('creates a role when none is provided', () => {
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
            'DeliveryStreamDatadogDestinationRoleBBA16F35',
            'Arn',
          ],
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'firehose.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      },
    });
  });

  it('adds attributes when tags are provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.Datadog({
        apiKey: secret,
        url: firehose.DatadogLogsEndpointUrl.DATADOG_LOGS_US1,
        tags: [{ key: 'source', value: 'cloudfront' }],
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
          ],
        },
      },
    });
  });
});
