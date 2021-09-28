import { Template } from '@aws-cdk/assertions';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TopicRule, DynamoDBAction } from '../../../lib';

test('Default dynamodb action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          DynamoDB: {
            TableName: { Ref: 'MyTable794EDED1' },
            HashKeyField: 'pKey',
            HashKeyType: 'STRING',
            HashKeyValue: '${topic(2)}',
            PayloadField: 'payload',
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
    },
  });
});

test('Default role that assumed by iot.amazonaws.com', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
  });
  topicRule.addAction(action);

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

test('Default policy for putting a item to DynamoDB', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'dynamodb:PutItem',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'MyTable794EDED1',
                'Arn',
              ],
            },
            { Ref: 'AWS::NoValue' },
          ],
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyTopicRuleTopicRuleActionRoleDefaultPolicy54A701F7',
    Roles: [
      { Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' },
    ],
  });
});

test('Can not set a table that have binary attribute type key', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'" },
  });

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.BINARY, name: 'pKey' },
  });

  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
  });

  expect(() => topicRule.addAction(action)).toThrowError(
    'DynamoDB Action doesn\'t support binary attribute type.',
  );
});

test('Can set optional properties', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'" },
  });

  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
    sortKey: { type: dynamodb.AttributeType.NUMBER, name: 'sKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
    sortKeyValue: '${timestamp()}',
    payloadField: 'custom-payload-field',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          DynamoDB: {
            TableName: { Ref: 'MyTable794EDED1' },
            HashKeyField: 'pKey',
            HashKeyType: 'STRING',
            HashKeyValue: '${topic(2)}',
            RangeKeyField: 'sKey',
            RangeKeyType: 'NUMBER',
            RangeKeyValue: '${timestamp()}',
            PayloadField: 'custom-payload-field',
            RoleArn: {
              'Fn::GetAtt': [
                'MyTopicRuleTopicRuleActionRoleCE2D05DA',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id, timestamp() as timestamp FROM 'device/+/data'",
    },
  });
});

test('Can set role', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          DynamoDB: {
            TableName: { Ref: 'MyTable794EDED1' },
            HashKeyField: 'pKey',
            HashKeyType: 'STRING',
            HashKeyValue: '${topic(2)}',
            PayloadField: 'payload',
            RoleArn: {
              'Fn::GetAtt': [
                'MyRoleF48FFE04',
                'Arn',
              ],
            },
          },
        },
      ],
      AwsIotSqlVersion: '2015-10-08',
      RuleDisabled: false,
      Sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
    },
  });
});

test('Add role to a policy for putting a item to DynamoDB', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { type: dynamodb.AttributeType.STRING, name: 'pKey' },
  });
  const action = new DynamoDBAction({
    table,
    partitionKeyValue: '${topic(2)}',
    role,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'dynamodb:PutItem',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'MyTable794EDED1',
                'Arn',
              ],
            },
            { Ref: 'AWS::NoValue' },
          ],
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
    Roles: [
      { Ref: 'MyRoleF48FFE04' },
    ],
  });
});
