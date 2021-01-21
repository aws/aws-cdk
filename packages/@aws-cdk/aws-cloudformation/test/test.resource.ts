import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Test, testCase } from 'nodeunit';
import { CustomResource, CustomResourceProvider } from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable cdk/no-core-construct */
/* eslint-disable quote-props */

export = testCase({
  'custom resources honor removalPolicy': {
    'unspecified (aka .Destroy)'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      // WHEN
      new TestCustomResource(stack, 'Custom');

      // THEN
      expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {}, ResourcePart.CompleteDefinition));
      test.equal(app.synth().tryGetArtifact(stack.stackName)!.findMetadataByType('aws:cdk:protected').length, 0);

      test.done();
    },

    '.Destroy'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      // WHEN
      new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.DESTROY });

      // THEN
      expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {}, ResourcePart.CompleteDefinition));
      test.equal(app.synth().tryGetArtifact(stack.stackName)!.findMetadataByType('aws:cdk:protected').length, 0);

      test.done();
    },

    '.Retain'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      // WHEN
      new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.RETAIN });

      // THEN
      expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      }, ResourcePart.CompleteDefinition));

      test.done();
    },
  },

  'custom resource is added twice, lambda is added once'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');

    // WHEN
    new TestCustomResource(stack, 'Custom1');
    new TestCustomResource(stack, 'Custom2');

    // THEN
    expect(stack).toMatch({
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
            'Runtime': 'python2.7',
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
    test.done();
  },

  'custom resources can specify a resource type that starts with Custom::'(test: Test) {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    new CustomResource(stack, 'MyCustomResource', {
      resourceType: 'Custom::MyCustomResourceType',
      provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
    });
    expect(stack).to(haveResource('Custom::MyCustomResourceType'));
    test.done();
  },

  'fails if custom resource type is invalid': {
    'does not start with "Custom::"'(test: Test) {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      test.throws(() => {
        new CustomResource(stack, 'MyCustomResource', {
          resourceType: 'NoCustom::MyCustomResourceType',
          provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
        });
      }, /Custom resource type must begin with "Custom::"/);

      test.done();
    },

    'has invalid characters'(test: Test) {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      test.throws(() => {
        new CustomResource(stack, 'MyCustomResource', {
          resourceType: 'Custom::My Custom?ResourceType',
          provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
        });
      }, /Custom resource type name can only include alphanumeric characters and/);

      test.done();
    },

    'is longer than 60 characters'(test: Test) {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Test');

      test.throws(() => {
        new CustomResource(stack, 'MyCustomResource', {
          resourceType: 'Custom::0123456789012345678901234567890123456789012345678901234567891',
          provider: CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
        });
      }, /Custom resource type length > 60/);

      test.done();
    },

  },

  '.ref returns the intrinsic reference (physical name)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const res = new TestCustomResource(stack, 'myResource');

    // THEN
    test.deepEqual(stack.resolve(res.resource.ref), { Ref: 'myResourceC6A188A9' });
    test.done();
  },
});

class TestCustomResource extends Construct {
  public readonly resource: CustomResource;

  constructor(scope: Construct, id: string, opts: { removalPolicy?: cdk.RemovalPolicy } = {}) {
    super(scope, id);

    const singletonLambda = new lambda.SingletonFunction(this, 'Lambda', {
      uuid: 'TestCustomResourceProvider',
      code: new lambda.InlineCode('def hello(): pass'),
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.hello',
      timeout: cdk.Duration.minutes(5),
    });

    this.resource = new CustomResource(this, 'Resource', {
      ...opts,
      provider: CustomResourceProvider.fromLambda(singletonLambda),
    });
  }
}
