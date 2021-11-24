/*
 * We write unit tests using the Jest framework
 * (some modules might still use NodeUnit,
 * but it's considered Names, and we want to migrate to Jest).
 */

import { Match, Template } from '@aws-cdk/assertions';

import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';

// Always import the module you're testing qualified -
// don't import individual classes from it!
// Importing it qualified tests whether everything that needs to be exported
// from the module is.
import * as er from '../lib';

/* We allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

const EXAMPLE_RESOURCE_NAME = {
  'Fn::Select': [1, {
    'Fn::Split': ['/', { 'Ref': 'ExampleResourceAC53F4AE' }],
  }],
};

describe('Example Resource', () => {
  let stack: core.Stack;

  beforeEach(() => {
    // try to factor out as much boilerplate test setup to before methods -
    // makes the tests much more readable
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    let exampleResource: er.IExampleResource;

    beforeEach(() => {
      exampleResource = new er.ExampleResource(stack, 'ExampleResource');
    });

    test('creates a CFN WaitConditionHandle resource', () => {
      // you can simply assert that a resource of a given type
      // was generated in the resulting template
      Template.fromStack(stack).resourceCountIs('AWS::CloudFormation::WaitConditionHandle', 1);
    });

    describe('creates a CFN WaitCondition resource', () => {
      test('with count = 0 and timeout = 10', () => {
        // you can also assert the properties of the resulting resource
        Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::WaitCondition', {
          'Count': 0,
          'Timeout': '10',
          'Handle': {
            // Don't be afraid of using the generated logical IDs in your tests!
            // While they look random, they are actually only dependent on the
            // path constructs have in the tree.
            // Since changing logical IDs as the library changes actually causes
            // problems for their customers (their CloudFormation resources will be replaced),
            // it's good for the unit tests to verify that the logical IDs are stable.
            'Ref': 'ExampleResourceWaitConditionHandle9C53A8D3',
          },
          // this is how you can check a given property is _not_ set
          'RandomProperty': Match.absent(),
        });
      });

      test('with retention policy = Retain', () => {
        // hasResource asserts _all_ properties of a resource,
        // while hasResourceProperties only those within the 'Property' block
        Template.fromStack(stack).hasResource('AWS::CloudFormation::WaitCondition', {
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        // by default, haveResource and haveResourceLike only assert the properties of a resource -
        // here's how you make them look at the entire resource definition
        });
      });
    });

    test('returns true from addToResourcePolicy', () => {
      const result = exampleResource.addToRolePolicy(new iam.PolicyStatement({
        actions: ['kms:*'],
        resources: ['*'],
      }));

      expect(result).toBe(true);
    });

    test('correctly adds s3:Get* permissions when grantRead() is called', () => {
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AnyPrincipal(),
      });

      exampleResource.grantRead(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:Get*',
              'Effect': 'Allow',
              'Resource': {
                'Fn::Join': ['', [
                  'arn:',
                  { 'Ref': 'AWS::Partition' },
                  ':cloudformation:',
                  { 'Ref': 'AWS::Region' },
                  ':',
                  { 'Ref': 'AWS::AccountId' },
                  ':wait-condition/',
                  { 'Ref': 'ExampleResourceAC53F4AE' },
                ]],
              },
            },
          ],
        },
      });
    });

    test('onEvent adds an Event Rule', () => {
      exampleResource.onEvent('MyEvent');

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        EventPattern: {
          detail: {
            'example-resource-name': [EXAMPLE_RESOURCE_NAME],
          },
        },
      });
    });

    test('metricCount returns a metric with correct dimensions', () => {
      const countMetric = exampleResource.metricCount();

      new cloudwatch.Alarm(stack, 'Alarm', {
        metric: countMetric,
        threshold: 10,
        evaluationPeriods: 2,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        EvaluationPeriods: 2,
        Dimensions: [
          {
            Name: 'ExampleResource',
            Value: EXAMPLE_RESOURCE_NAME,
          },
        ],
        MetricName: 'Count',
        Namespace: 'AWS/ExampleResource',
      });
    });
  });

  describe('created with a VPC', () => {
    let exampleResource: er.IExampleResource;
    let vpc: ec2.IVpc;

    beforeEach(() => {
      vpc = new ec2.Vpc(stack, 'Vpc');
      exampleResource = new er.ExampleResource(stack, 'ExampleResource', {
        vpc,
      });
    });

    test('allows manipulating its connections object', () => {
      exampleResource.connections.allowToAnyIpv4(ec2.Port.allTcp());
    });

    test('correctly fills out the subnetIds property of the created VPC endpoint', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
        'SubnetIds': [
          { 'Ref': 'VpcPrivateSubnet1Subnet536B997A' },
          { 'Ref': 'VpcPrivateSubnet2Subnet3788AAA1' },
        ],
      });
    });
  });

  describe('imported by name', () => {
    let exampleResource: er.IExampleResource;

    beforeEach(() => {
      exampleResource = er.ExampleResource.fromExampleResourceName(stack, 'ExampleResource',
        'my-example-resource-name');
    });

    test('throws when accessing connections', () => {
      expect(() => exampleResource.connections).toThrow();
    });

    test('has the same name as it was imported with', () => {
      expect(exampleResource.exampleResourceName).toEqual('my-example-resource-name');
    });

    test('renders the correct ARN for Example Resource', () => {
      // We can't simply compare the value we get from exampleResource.exampleResourceArn,
      // as it will contain unresolved late-bound values
      // (what we in the CDK call Tokens).
      // So, use a utility method on Stack that allows you to resolve those Tokens
      // into their correct values.
      const arn = stack.resolve(exampleResource.exampleResourceArn);
      expect(arn).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { 'Ref': 'AWS::Partition' },
          ':cloudformation:',
          { 'Ref': 'AWS::Region' },
          ':',
          { 'Ref': 'AWS::AccountId' },
          ':wait-condition/my-example-resource-name',
        ]],
      });
    });

    test('returns false from addToResourcePolicy', () => {
      const result = exampleResource.addToRolePolicy(new iam.PolicyStatement({
        actions: ['kms:*'],
        resources: ['*'],
      }));

      expect(result).toEqual(false);
    });
  });

  test('cannot be created with a physical name containing illegal characters', () => {
    // this is how we write tests that expect an exception to be thrown
    expect(() => {
      new er.ExampleResource(stack, 'ExampleResource', {
        waitConditionHandleName: 'a-1234',
      });
    // it's not enough to know an exception was thrown -
    // we have to verify that its message is what we expected
    }).toThrow(/waitConditionHandleName must be non-empty and contain only letters and underscores, got: 'a-1234'/);
  });

  test('does not fail validation if the physical name is a late-bound value', () => {
    const parameter = new core.CfnParameter(stack, 'Parameter');

    // no assertion necessary - the lack of an exception being thrown is all we need in this case
    new er.ExampleResource(stack, 'ExampleResource', {
      waitConditionHandleName: parameter.valueAsString,
    });
  });
});
