import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { TopicRule, S3Action } from '../../../lib';

test('Default s3 action', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          S3: {
            BucketName: { Ref: 'MyBucketF68F3FF0' },
            Key: '${topic()}/${timestamp()}',
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

  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket);
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

test('Default policy for putting item to a bucket', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket);
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:PutObject',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::GetAtt': [
                    'MyBucketF68F3FF0',
                    'Arn',
                  ],
                },
                '/*',
              ],
            ],
          },
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

test('Can set key of bucket', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket, {
    key: 'test-key',
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          S3: {
            BucketName: { Ref: 'MyBucketF68F3FF0' },
            Key: 'test-key',
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

test('Can set canned ACL and it convert to kebab case', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket, {
    cannedAcl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          S3: {
            BucketName: { Ref: 'MyBucketF68F3FF0' },
            Key: '${topic()}/${timestamp()}',
            CannedAcl: 'bucket-owner-full-control',
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

test('Can set role', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket, { role });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          S3: {
            BucketName: { Ref: 'MyBucketF68F3FF0' },
            Key: '${topic()}/${timestamp()}',
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

test('Add role to a policy for putting item to a bucket', () => {
  const stack = new cdk.Stack();
  const topicRule = new TopicRule(stack, 'MyTopicRule', {
    topicRulePayload: { sql: "SELECT topic(2) as device_id FROM 'device/+/data'" },
  });

  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
  });
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const action = new S3Action(bucket, { role });
  topicRule.addAction(action);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:PutObject',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::GetAtt': [
                    'MyBucketF68F3FF0',
                    'Arn',
                  ],
                },
                '/*',
              ],
            ],
          },
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
