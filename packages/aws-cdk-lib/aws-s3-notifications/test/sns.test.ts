import { Annotations, Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import * as notif from '../lib';

test('asBucketNotificationDestination adds bucket permissions only once for each bucket', () => {
  const stack = new cdk.Stack();

  const topic = new sns.Topic(stack, 'MyTopic');
  const bucket = new s3.Bucket(stack, 'Bucket');
  const bucket2 = new s3.Bucket(stack, 'Bucket2');

  new notif.SnsDestination(topic).bind(bucket, bucket);
  new notif.SnsDestination(topic).bind(bucket, bucket);
  // another bucket will be added to the topic policy
  new notif.SnsDestination(topic).bind(bucket2, bucket2);

  Template.fromStack(stack).templateMatches({
    Resources: {
      Bucket83908E77: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
      Bucket25524B414: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
      MyTopic86869434: {
        Type: 'AWS::SNS::Topic',
      },
      MyTopicPolicy12A5EC17: {
        Type: 'AWS::SNS::TopicPolicy',
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: 'sns:Publish',
                Condition: {
                  ArnLike: {
                    'aws:SourceArn': { 'Fn::GetAtt': ['Bucket83908E77', 'Arn'] },
                  },
                },
                Effect: 'Allow',
                Principal: {
                  Service: 's3.amazonaws.com',
                },
                Resource: {
                  Ref: 'MyTopic86869434',
                },
                Sid: '0',
              },
              {
                Action: 'sns:Publish',
                Condition: {
                  ArnLike: {
                    'aws:SourceArn': { 'Fn::GetAtt': ['Bucket25524B414', 'Arn'] },
                  },
                },
                Effect: 'Allow',
                Principal: {
                  Service: 's3.amazonaws.com',
                },
                Resource: {
                  Ref: 'MyTopic86869434',
                },
                Sid: '1',
              },
            ],
            Version: '2012-10-17',
          },
          Topics: [
            {
              Ref: 'MyTopic86869434',
            },
          ],
        },
      },
    },
  });
});

test('encrypted sns topic adds KMS permissions', () => {
  const app = new cdk.App({
    postCliContext: {
      '@aws-cdk/s3-notifications:addS3TrustKeyPolicyForSnsSubscriptions': true,
    },
  });
  const stack = new cdk.Stack(app);

  const topic = new sns.Topic(stack, 'Topic', {
    masterKey: new kms.Key(stack, 'Key'),
  });
  const bucket = new s3.Bucket(stack, 'Bucket');

  new notif.SnsDestination(topic).bind(bucket, bucket);

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    KeyPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'kms:*',
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        },
        {
          Action: ['kms:GenerateDataKey', 'kms:Decrypt'],
          Effect: 'Allow',
          Principal: {
            Service: 's3.amazonaws.com',
          },
          Resource: '*',
        },
      ],
    },
  });
});
