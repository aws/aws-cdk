#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';

interface AwsCdkSdkJsStackProps {
  readonly runtime?: lambda.Runtime;
}

class AwsCdkSdkJsStack extends cdk.Stack {
  public readonly topicArn: string;

  constructor(scope: Construct, id: string, props?: AwsCdkSdkJsStackProps) {
    super(scope, id);
    const topic = new sns.Topic(this, 'Topic');
    this.topicArn = topic.topicArn;

    const snsPublish = new AwsCustomResource(this, 'Publish', {
      resourceType: 'Custom::SNSPublisher',
      onUpdate: {
        service: 'SNS',
        action: 'publish',
        parameters: {
          Message: 'hello',
          TopicArn: this.topicArn,
        },
        physicalResourceId: PhysicalResourceId.of(topic.topicArn),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    const listTopics = new AwsCustomResource(this, 'ListTopics', {
      onUpdate: {
        service: 'SNS',
        action: 'listTopics',
        physicalResourceId: PhysicalResourceId.fromResponse('Topics.0.TopicArn'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    listTopics.node.addDependency(topic);

    const ssmParameter = new ssm.StringParameter(this, 'Utf8Parameter', {
      stringValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ!"#¤%&/()=?`´^*+~_-.,:;<>|',
    });
    const getParameter = new AwsCustomResource(this, 'GetParameter', {
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

    const customRole = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    customRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ['*'],
        actions: [
          'ssm:*',
        ],
      }),
    );
    const getParameterNoPolicy = new AwsCustomResource(this, 'GetParameterNoPolicy', {
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
      role: customRole,
    });

    new AwsCustomResource(this, 'DescribeCluster', {
      resourceType: 'Custom::EKSClusterDescription',
      onUpdate: {
        service: 'EKS',
        action: 'describeCluster',
        parameters: {
          name: 'fake-cluster',
        },
        physicalResourceId: PhysicalResourceId.of('fake-cluster'),
        ignoreErrorCodesMatching: 'ResourceNotFoundException',
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    new cdk.CfnOutput(this, 'MessageId', { value: snsPublish.getResponseField('MessageId') });
    new cdk.CfnOutput(this, 'TopicArn', { value: listTopics.getResponseField('Topics.0.TopicArn') });
    new cdk.CfnOutput(this, 'ParameterValue', { value: getParameter.getResponseField('Parameter.Value') });
    new cdk.CfnOutput(this, 'ParameterValueNoPolicy', { value: getParameterNoPolicy.getResponseField('Parameter.Value') });

    if (props?.runtime) {
      const awsCustomResourceProviderId ='AWS679f53fac002430cb0da5b7982bd2287';
      const provider = this.node.findChild(awsCustomResourceProviderId).node.defaultChild as lambda.CfnFunction;
      provider.runtime = props.runtime.name;
    }
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testStack = new AwsCdkSdkJsStack(app, 'aws-cdk-sdk-js-v3', {
  runtime: lambda.Runtime.NODEJS_18_X,
});
const integTest = new integ.IntegTest(app, 'AwsCustomResourceTest', {
  testCases: [testStack],
  diffAssets: true,
});

integTest.assertions.awsApiCall('SNS', 'listTopics').expect(ExpectedResult.objectLike({
  Topics: integ.Match.arrayWith([
    { TopicArn: testStack.topicArn },
  ]),
}));
