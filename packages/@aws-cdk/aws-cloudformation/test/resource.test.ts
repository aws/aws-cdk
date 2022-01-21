import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import { describeDeprecated, testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { CustomResource, CustomResourceProvider } from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/* eslint-disable @aws-cdk/no-core-construct */
/* eslint-disable quote-props */

describeDeprecated('custom resources honor removalPolicy', () => {
  test('unspecified (aka .Destroy)', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    // WHEN
    new TestCustomResource(stack, 'Custom');

    // THEN
    Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {});
    expect(app.synth().tryGetArtifact(stack.stackName)!.findMetadataByType('aws:cdk:protected').length).toEqual(0);
  });

  test('.Destroy', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    // WHEN
    new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.DESTROY });

    // THEN
    Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {});
    expect(app.synth().tryGetArtifact(stack.stackName)!.findMetadataByType('aws:cdk:protected').length).toEqual(0);
  });

  test('.Retain', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    // WHEN
    new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.RETAIN });

    // THEN
    Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });
});

testDeprecated('custom resource is added twice, lambda is added once', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Test');

  // WHEN
  new TestCustomResource(stack, 'Custom1');
  new TestCustomResource(stack, 'Custom2');

  // THEN
  Template.fromStack(stack).templateMatches({
    'Resources': {
      'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C': {
        'Type': 'AWS::IAM::Role',
        'Properties': {
          'AssumeRolePolicyDocument': {
            'Statement': [
              {
                'Action': 'sts:AssumeRole',
                'Effect': 'Allow',
                'Principal': {
                  'Service': 'lambda.amazonaws.com',
                },
              },
            ],
            'Version': '2012-10-17',
          },
          'ManagedPolicyArns': [
            {
              'Fn::Join': ['', [
                'arn:', { 'Ref': 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ]],
            },
          ],
        },
      },
      'SingletonLambdaTestCustomResourceProviderA9255269': {
        'Type': 'AWS::Lambda::Function',
        'Properties': {
          'Code': {
            'ZipFile': 'def hello(): pass',
          },
          'Handler': 'index.hello',
          'Role': {
            'Fn::GetAtt': [
              'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C',
              'Arn',
            ],
          },
          'Runtime': 'python3.9',
          'Timeout': 300,
        },
        'DependsOn': [
          'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C',
        ],
      },
      'Custom1D319B237': {
        'Type': 'AWS::CloudFormation::CustomResource',
        'DeletionPolicy': 'Delete',
        'UpdateReplacePolicy': 'Delete',
        'Properties': {
          'ServiceToken': {
            'Fn::GetAtt': [
              'SingletonLambdaTestCustomResourceProviderA9255269',
              'Arn',
            ],
          },
        },
      },
      'Custom2DD5FB44D': {
        'Type': 'AWS::CloudFormation::CustomResource',
        'DeletionPolicy': 'Delete',
        'UpdateReplacePolicy': 'Delete',
        'Properties': {
          'ServiceToken': {
            'Fn::GetAtt': [
              'SingletonLambdaTestCustomResourceProviderA9255269',
              'Arn',
            ],
          },
        },
      },
    },
  });
});

testDeprecated('custom resources can specify a resource type that starts with Custom::', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Test');
  new CustomResource(stack, 'MyCustomResource', {
    resourceType: 'Custom::MyCustomResourceType',
    provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
  });
  Template.fromStack(stack).hasResourceProperties('Custom::MyCustomResourceType', {});
});

describeDeprecated('fails if custom resource type is invalid', () => {
  test('does not start with "Custom::"', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    expect(() => {
      new CustomResource(stack, 'MyCustomResource', {
        resourceType: 'NoCustom::MyCustomResourceType',
        provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
      });
    }).toThrow(/Custom resource type must begin with "Custom::"/);
  });

  test('has invalid characters', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    expect(() => {
      new CustomResource(stack, 'MyCustomResource', {
        resourceType: 'Custom::My Custom?ResourceType',
        provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
      });
    }).toThrow(/Custom resource type name can only include alphanumeric characters and/);
  });

  test('is longer than 60 characters', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    expect(() => {
      new CustomResource(stack, 'MyCustomResource', {
        resourceType: 'Custom::0123456789012345678901234567890123456789012345678901234567891',
        provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
      });
    }).toThrow(/Custom resource type length > 60/);
  });
});

testDeprecated('.ref returns the intrinsic reference (physical name)', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const res = new TestCustomResource(stack, 'myResource');

  // THEN
  expect(stack.resolve(res.resource.ref)).toEqual({ Ref: 'myResourceC6A188A9' });
});

class TestCustomResource extends Construct {
  public readonly resource: CustomResource;

  constructor(scope: Construct, id: string, opts: { removalPolicy?: cdk.RemovalPolicy } = {}) {
    super(scope, id);

    const singletonLambda = new lambda.SingletonFunction(this, 'Lambda', {
      uuid: 'TestCustomResourceProvider',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });

    this.resource = new CustomResource(this, 'Resource', {
      ...opts,
      provider: CustomResourceProvider.fromLambda(singletonLambda),
    });
  }
}
