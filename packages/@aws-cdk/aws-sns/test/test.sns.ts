import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import sns = require('../lib');
import { SubscriptionProtocol, Topic } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'topic tests': {
    'all defaults'(test: Test) {
      const stack = new cdk.Stack();
      new sns.Topic(stack, 'MyTopic');

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic"
          }
        }
      });

      test.done();
    },

    'specify topicName'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "TopicName": "topicName"
          }
          }
        }
      });

      test.done();
    },

    'specify displayName'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        displayName: 'displayName'
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "DisplayName": "displayName"
          }
          }
        }
      });

      test.done();
    },

    'specify both'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "DisplayName": "displayName",
            "TopicName": "topicName"
          }
          }
        }
      });

      test.done();
    },
  },

  'can add a policy to the topic'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    topic.addToResourcePolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['sns:*'],
      principals: [new iam.ArnPrincipal('arn')]
    }));

    // THEN
    expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        "Sid": "0",
        "Action": "sns:*",
        "Effect": "Allow",
        "Principal": { "AWS": "arn" },
        "Resource": "*"
      }]
    }
    }));

    test.done();
  },

  'give publishing permissions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');
    const user = new iam.User(stack, 'User');

    // WHEN
    topic.grantPublish(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      Version: '2012-10-17',
      "Statement": [
      {
        "Action": "sns:Publish",
        "Effect": "Allow",
        "Resource": stack.resolve(topic.topicArn)
      }
      ],
    }
    }));

    test.done();
  },

  'topic resource policy includes unique SIDs'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');

    topic.addToResourcePolicy(new iam.PolicyStatement({ actions: ['service:statement0'] }));
    topic.addToResourcePolicy(new iam.PolicyStatement({ actions: ['service:statement1'] }));

    expect(stack).toMatch({
      "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic"
      },
      "MyTopicPolicy12A5EC17": {
        "Type": "AWS::SNS::TopicPolicy",
        "Properties": {
        "PolicyDocument": {
          "Statement": [
          {
            "Action": "service:statement0",
            "Effect": "Allow",
            "Sid": "0"
          },
          {
            "Action": "service:statement1",
            "Effect": "Allow",
            "Sid": "1"
          }
          ],
          "Version": "2012-10-17"
        },
        "Topics": [
          {
          "Ref": "MyTopic86869434"
          }
        ]
        }
      }
      }
    });

    test.done();
  },

  'fromTopicArn'(test: Test) {
    // GIVEN
    const stack2 = new cdk.Stack();

    // WHEN
    const imported = sns.Topic.fromTopicArn(stack2, 'Imported', 'arn:aws:sns:*:123456789012:my_corporate_topic');

    // THEN
    test.deepEqual(imported.topicName, 'my_corporate_topic');
    test.deepEqual(imported.topicArn, 'arn:aws:sns:*:123456789012:my_corporate_topic');
    test.done();
  },

  'test metrics'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // THEN
    test.deepEqual(stack.resolve(topic.metricNumberOfMessagesPublished()), {
      dimensions: {TopicName: { 'Fn::GetAtt': [ 'TopicBFC7AF6E', 'TopicName' ] }},
      namespace: 'AWS/SNS',
      metricName: 'NumberOfMessagesPublished',
      period: cdk.Duration.minutes(5),
      statistic: 'Sum'
    });

    test.deepEqual(stack.resolve(topic.metricPublishSize()), {
      dimensions: {TopicName: { 'Fn::GetAtt': [ 'TopicBFC7AF6E', 'TopicName' ] }},
      namespace: 'AWS/SNS',
      metricName: 'PublishSize',
      period: cdk.Duration.minutes(5),
      statistic: 'Average'
    });

    test.done();
  },

  'subscription is created under the topic scope by default'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const topic = new Topic(stack, 'Topic');

    // WHEN
    topic.addSubscription({
      bind: () => ({
        protocol: SubscriptionProtocol.HTTP,
        endpoint: 'http://foo/bar',
        subscriberId: 'my-subscription'
      })
    });

    // THEN
    expect(stack).to(haveResource('AWS::SNS::Subscription'));
    test.done();
  },

  'if "scope" is defined, subscription will be created under that scope'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'A');
    const stack2 = new Stack(app, 'B');
    const topic = new Topic(stack, 'Topic');

    // WHEN
    topic.addSubscription({
      bind: () => ({
        protocol: SubscriptionProtocol.HTTP,
        endpoint: 'http://foo/bar',
        subscriberScope: stack2,
        subscriberId: 'subscriberId'
      })
    });

    // THEN
    expect(stack).notTo(haveResource('AWS::SNS::Subscription'));
    expect(stack2).to(haveResource('AWS::SNS::Subscription'));
    test.done();
  }
};
