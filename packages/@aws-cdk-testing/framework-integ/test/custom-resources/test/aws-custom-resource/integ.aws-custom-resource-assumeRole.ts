#!/usr/bin/env node
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-custom-resource-assume-role');

const assumedRole = new cdk.aws_iam.Role(stack, 'AssumedRole', {
  assumedBy: new cdk.aws_iam.AccountRootPrincipal(),
  inlinePolicies: {
    ManageTopic: new cdk.aws_iam.PolicyDocument({
      statements: [new cdk.aws_iam.PolicyStatement({
        actions: ['sns:CreateTopic', 'sns:DeleteTopic'],
        resources: ['*'],
      })],
    }),
  },
});

new custom_resources.AwsCustomResource(stack, 'TestCase', {
  installLatestAwsSdk: false,
  onCreate: {
    assumedRoleArn: assumedRole.roleArn,
    service: 'sns',
    action: 'CreateTopic',
    parameters: {
      Name: 'TestCaseTopic',
    },
    physicalResourceId: cdk.custom_resources.PhysicalResourceId.fromResponse('TopicArn'),
  },
  onDelete: {
    assumedRoleArn: assumedRole.roleArn,
    service: 'sns',
    action: 'DeleteTopic',
    parameters: {
      TopicArn: new cdk.custom_resources.PhysicalResourceIdReference(),
    },
  },
  policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: [] }),
});

new integ.IntegTest(app, 'AwsCustomResourceAssumeRoleTest', {
  testCases: [stack],
});
