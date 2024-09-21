import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as iot from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new iot.Logging(stack, 'Logging');

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::Logging', {
    DefaultLogLevel: 'ERROR',
    AccountId: { Ref: 'AWS::AccountId' },
    RoleArn: { 'Fn::GetAtt': ['LoggingRoleF8CB8FA1', 'Arn'] },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'iot.amazonaws.com' },
        },
      ],
      Version: '2012-10-17',
    },
    Policies: [
      {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:PutMetricFilter',
                'logs:PutRetentionPolicy',
                'iot:GetLoggingOptions',
                'iot:SetLoggingOptions',
                'iot:SetV2LoggingOptions',
                'iot:GetV2LoggingOptions',
                'iot:SetV2LoggingLevel',
                'iot:ListV2LoggingLevels',
                'iot:DeleteV2LoggingLevel',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':logs:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':log-group:AWSIotLogsV2:*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: 'LoggingPolicy',
      },
    ],
  });
});

test.each([
  iot.LogLevel.ERROR,
  iot.LogLevel.WARN,
  iot.LogLevel.INFO,
  iot.LogLevel.DEBUG,
  iot.LogLevel.DISABLED,
])('Log level %s', (logLevel) => {
  const stack = new cdk.Stack();

  new iot.Logging(stack, 'Logging', {
    logLevel,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::Logging', {
    DefaultLogLevel: logLevel,
  });
});

test('import by Log ID', () => {
  const stack = new cdk.Stack();

  const logId = 'Log-12345';

  const logging = iot.Logging.fromLogId(stack, 'LoggingFromId', logId);

  expect(logging).toMatchObject({
    logId,
  });
});
