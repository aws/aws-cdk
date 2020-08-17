#!/usr/bin/env node
/// !cdk-integ pragma:ignore-assets
import * as sns from '@aws-cdk/aws-sns';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-sdk-js');

const topic = new sns.Topic(stack, 'Topic');

const snsPublish = new AwsCustomResource(stack, 'Publish', {
  resourceType: 'Custom::SNSPublisher',
  onUpdate: {
    service: 'SNS',
    action: 'publish',
    parameters: {
      Message: 'hello',
      TopicArn: topic.topicArn,
    },
    physicalResourceId: PhysicalResourceId.of(topic.topicArn),
  },
  policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
});

const listTopics = new AwsCustomResource(stack, 'ListTopics', {
  onUpdate: {
    service: 'SNS',
    action: 'listTopics',
    physicalResourceId: PhysicalResourceId.fromResponse('Topics.0.TopicArn'),
  },
  policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
});
listTopics.node.addDependency(topic);

const ssmParameter = new ssm.StringParameter(stack, 'DummyParameter', {
  stringValue: '1337',
});
const getParameter = new AwsCustomResource(stack, 'GetParameter', {
  resourceType: 'Custom::SSMParameter',
  onUpdate: {
    service: 'SSM',
    action: 'getParameter',
    parameters: {
      Name: ssmParameter.parameterName,
      WithDecryption: true,
    },
    physicalResourceId: PhysicalResourceId.fromResponse('Parameter.ARN'),
  },
  policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
});

new cdk.CfnOutput(stack, 'MessageId', { value: snsPublish.getResponseField('MessageId') });
new cdk.CfnOutput(stack, 'TopicArn', { value: listTopics.getResponseField('Topics.0.TopicArn') });
new cdk.CfnOutput(stack, 'ParameterValue', { value: getParameter.getResponseField('Parameter.Value') });

app.synth();
