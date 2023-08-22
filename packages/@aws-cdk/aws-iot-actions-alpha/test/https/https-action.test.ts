import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

test('Default HTTPS action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      "SELECT topic(2) as device_id FROM 'device/+/data'",
    ),
  });
  const expectedUrl = 'https://example.com';

  // WHEN
  topicRule.addAction(new actions.HttpsAction(expectedUrl));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: {
            Url: expectedUrl,
          },
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'iot.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('can set confirmation url', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      "SELECT topic(2) as device_id FROM 'device/+/data'",
    ),
  });
  const expectedUrl = 'https://example.com';
  const expectedConfirmationUrl = 'https://example.com/confirm';

  // WHEN
  topicRule.addAction(
    new actions.HttpsAction(expectedUrl, {
      confirmationUrl: expectedConfirmationUrl,
    }),
  );

  //THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: {
            Url: expectedUrl,
            ConfirmationUrl: expectedConfirmationUrl,
          },
        },
      ],
    },
  });
});

test('can set http headers', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      "SELECT topic(2) as device_id FROM 'device/+/data'",
    ),
  });
  const expectedUrl = 'https://example.com';
  const headers = [
    { key: 'key0', value: 'value0' },
    { key: 'key1', value: 'value1' },
  ];

  // WHEN
  topicRule.addAction(
    new actions.HttpsAction(expectedUrl, { headers: headers }),
  );

  //THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: {
            Url: expectedUrl,
            Headers: [
              { Key: 'key0', Value: 'value0' },
              { Key: 'key1', Value: 'value1' },
            ],
          },
        },
      ],
    },
  });
});

test('can set http auth', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323(
      "SELECT topic(2) as device_id FROM 'device/+/data'",
    ),
  });
  const expectedUrl = 'https://example.com';
  const expectedAuth = {
    serviceName: 'serviceName',
    signingRegion: 'signingName',
  };

  // WHEN
  topicRule.addAction(
    new actions.HttpsAction(expectedUrl, { auth: expectedAuth }),
  );

  //THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          Http: {
            Url: expectedUrl,
            Auth: {
              Sigv4: {
                RoleArn: {
                  'Fn::GetAtt': [
                    Match.stringLikeRegexp('MyTopicRuleTopicRuleActionRole'),
                    'Arn',
                  ],
                },
                ServiceName: expectedAuth.serviceName,
                SigningRegion: expectedAuth.signingRegion,
              },
            },
          },
        },
      ],
    },
  });
});
