import * as cdk from '../..';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as secretsmanager from '../../aws-secretsmanager';
import * as firehose from '../lib';

describe('HTTP destination', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  it('provides defaults when only required configuration is provided', () => {
    new firehose.DeliveryStream(stack, 'DeliveryStream', {
      destination: new firehose.HTTPEndpoint({
        endpointConfig: {
          url: 'https://test-endpoint.com',
        },
        attributes: [{
          name: 'source',
          value: 'test',
        }],
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
        RequestConfiguration: {
          ContentEncoding: 'NONE',
        },
        S3BackupMode: 'FailedDataOnly',
        S3Configuration: {
          RoleARN: {
            'Fn::GetAtt': [
              'DeliveryStreamHTTPDestinationRoleD8ECD827',
              'Arn',
            ],
          },
        },
      },
    });
  });
});
