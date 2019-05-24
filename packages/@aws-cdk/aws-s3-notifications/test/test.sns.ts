import { expect } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import notif = require('../lib');

export = {
  'asBucketNotificationDestination adds bucket permissions only once for each bucket'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');
    const bucket = new s3.Bucket(stack, 'Bucket');

    const dest1 = new notif.SnsDestination(topic).bind(bucket);
    test.deepEqual(stack.node.resolve(dest1.arn), stack.node.resolve(topic.topicArn));
    test.deepEqual(dest1.type, s3.BucketNotificationDestinationType.Topic);

    const dep: cdk.Construct = dest1.dependencies![0] as any;
    test.deepEqual(stack.node.resolve((dep.node.children[0] as any).logicalId),
      'MyTopicPolicy12A5EC17', 'verify topic policy is added as dependency');

    // calling again on the same bucket yields is idempotent
    const dest2 = new notif.SnsDestination(topic).bind(bucket);
    test.deepEqual(stack.node.resolve(dest2.arn), stack.node.resolve(topic.topicArn));
    test.deepEqual(dest2.type, s3.BucketNotificationDestinationType.Topic);

    // another bucket will be added to the topic policy
    const dest3 = new notif.SnsDestination(topic).bind(bucket);
    test.deepEqual(stack.node.resolve(dest3.arn), stack.node.resolve(topic.topicArn));
    test.deepEqual(dest3.type, s3.BucketNotificationDestinationType.Topic);

    expect(stack).toMatch({
      Resources: {
        MyTopic86869434: {
          Type: "AWS::SNS::Topic"
        },
        MyTopicPolicy12A5EC17: {
          Type: "AWS::SNS::TopicPolicy",
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: "sns:Publish",
                  Condition: {
                    ArnLike: {
                      "aws:SourceArn": "arn:bucket"
                    }
                  },
                  Effect: "Allow",
                  Principal: {
                    Service: { "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]] }
                  },
                  Resource: {
                    Ref: "MyTopic86869434"
                  },
                  Sid: "0"
                },
                {
                  Action: "sns:Publish",
                  Condition: {
                    ArnLike: {
                      "aws:SourceArn": "bucket2"
                    }
                  },
                  Effect: "Allow",
                  Principal: {
                    Service: { "Fn::Join": ["", ["s3.", { Ref: "AWS::URLSuffix" }]] }
                  },
                  Resource: {
                    Ref: "MyTopic86869434"
                  },
                  Sid: "1"
                }
              ],
              Version: "2012-10-17"
            },
            Topics: [
              {
                Ref: "MyTopic86869434"
              }
            ]
          }
        }
      }
    });

    test.done();
  },
};