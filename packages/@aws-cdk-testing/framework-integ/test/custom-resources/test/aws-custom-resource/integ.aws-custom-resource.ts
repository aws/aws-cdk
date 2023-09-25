#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface AwsCdkSdkJsStackProps {
  readonly v3Format?: boolean;
}

class AwsCdkSdkJsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: AwsCdkSdkJsStackProps) {
    super(scope, id);
    const topic = new sns.Topic(this, 'Topic');

    const snsPublish = new AwsCustomResource(this, 'Publish', {
      resourceType: 'Custom::SNSPublisher',
      onUpdate: {
        service: props?.v3Format ? '@aws-sdk/client-sns' : 'SNS',
        action: props?.v3Format ? 'PublishCommand' : 'publish',
        parameters: {
          Message: 'hello',
          TopicArn: topic.topicArn,
        },
        physicalResourceId: PhysicalResourceId.of(topic.topicArn),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    const listTopics = new AwsCustomResource(this, 'ListTopics', {
      onUpdate: {
        service: props?.v3Format ? '@aws-sdk/client-sns' : 'SNS',
        action: props?.v3Format ? 'ListTopicsCommand' : 'listTopics',
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
        service: props?.v3Format ? '@aws-sdk/client-ssm' : 'SSM',
        action: props?.v3Format ? 'GetParameterCommand' : 'getParameter',
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
        service: props?.v3Format ? '@aws-sdk/client-ssm' : 'SSM',
        action: props?.v3Format ? 'GetParameterCommand' : 'getParameter',
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
        service: props?.v3Format ? '@aws-sdk/client-eks' : 'EKS',
        action: props?.v3Format ? 'DescribeClusterCommand' : 'describeCluster',
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
  }
}

const app = new cdk.App();

new integ.IntegTest(app, 'AwsCustomResourceTest', {
  testCases: [
    new AwsCdkSdkJsStack(app, 'aws-cdk-sdk-js'),
    new AwsCdkSdkJsStack(app, 'aws-cdk-sdk-js-v3', {
      v3Format: true,
    }),
  ],
  diffAssets: true,
});

app.synth();
