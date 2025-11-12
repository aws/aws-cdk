import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam/index';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as lambda from '../lib/index';

describe('addToRolePolicy token conflict detection', () => {
  test('consolidates homogeneous array token statements into ServiceRoleDefaultPolicy', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false, // Feature flag disabled
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // Create a parameter to use in Fn.split to ensure it remains a token
    const bucketListParam = new cdk.CfnParameter(stack, 'BucketList', {
      type: 'String',
      default: 'bucket1,bucket2,bucket3',
    });

    // WHEN - Add policy with CloudFormation intrinsic function (Fn::Split)
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: cdk.Fn.split(',', bucketListParam.valueAsString), // This creates array tokens
    }));

    // THEN - Smart detection consolidates homogeneous array token resources into ServiceRoleDefaultPolicy
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*ServiceRoleDefaultPolicy.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: { 'Fn::Split': [',', { Ref: 'BucketList' }] },
        }]),
      },
    });

    // Should not create separate inline policies for homogeneous array tokens
    template.resourceCountIs('AWS::IAM::Policy', 1);
  });

  test('consolidates homogeneous literal statements into ServiceRoleDefaultPolicy', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // WHEN - Add multiple policies with literal resources (no array tokens)
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: ['arn:aws:s3:::bucket1/*'], // Literal string
    }));

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::bucket2'], // Another literal string
    }));

    // THEN - Smart detection consolidates homogeneous literal resources into ServiceRoleDefaultPolicy
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*ServiceRoleDefaultPolicy.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: 'arn:aws:s3:::bucket1/*',
          },
          {
            Action: 's3:ListBucket',
            Effect: 'Allow',
            Resource: 'arn:aws:s3:::bucket2',
          },
        ]),
      },
    });

    // Should not create separate inline policies for homogeneous literals
    template.resourceCountIs('AWS::IAM::Policy', 1);
  });

  test('separates mixed array token and literal statements to prevent conflicts', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // Create a parameter for array token
    const bucketListParam = new cdk.CfnParameter(stack, 'BucketList', {
      type: 'String',
      default: 'bucket1,bucket2,bucket3',
    });

    // WHEN - Add array token statement first, then literal statement
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: cdk.Fn.split(',', bucketListParam.valueAsString), // Array token
    }));

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::static-bucket'], // Literal
    }));

    // THEN - Smart detection separates mixed scenarios to prevent CloudFormation conflicts
    const template = Template.fromStack(stack);

    // ServiceRoleDefaultPolicy contains array token resources
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*ServiceRoleDefaultPolicy.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: { 'Fn::Split': [',', { Ref: 'BucketList' }] },
        }]),
      },
    });

    // Separate inline policy contains literal resources
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*inlinePolicyAddedToExecutionRole.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 's3:ListBucket',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::static-bucket',
        }],
      },
    });

    // Should create 2 policies: ServiceRoleDefaultPolicy + inline policy
    template.resourceCountIs('AWS::IAM::Policy', 2);
  });

  test('separates mixed literal and array token statements to prevent conflicts (reverse order)', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // Create a parameter for array token
    const bucketListParam = new cdk.CfnParameter(stack, 'BucketList', {
      type: 'String',
      default: 'bucket1,bucket2,bucket3',
    });

    // WHEN - Add literal statement first, then array token statement
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::static-bucket'], // Literal
    }));

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: cdk.Fn.split(',', bucketListParam.valueAsString), // Array token
    }));

    // THEN - Smart detection separates mixed scenarios to prevent CloudFormation conflicts
    const template = Template.fromStack(stack);

    // ServiceRoleDefaultPolicy contains literal resources (added first)
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*ServiceRoleDefaultPolicy.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([{
          Action: 's3:ListBucket',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::static-bucket',
        }]),
      },
    });

    // Separate inline policy contains array token resources
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*inlinePolicyAddedToExecutionRole.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: { 'Fn::Split': [',', { Ref: 'BucketList' }] },
        }],
      },
    });

    // Should create 2 policies: ServiceRoleDefaultPolicy + inline policy
    template.resourceCountIs('AWS::IAM::Policy', 2);
  });

  test('handles CommaDelimitedList parameter as array token', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: false,
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // Create a CommaDelimitedList parameter
    const resourceListParam = new cdk.CfnParameter(stack, 'ResourceList', {
      type: 'CommaDelimitedList',
      default: 'arn:aws:s3:::bucket1/*,arn:aws:s3:::bucket2/*',
    });

    // WHEN - Add policy where the entire resources array is a token
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: resourceListParam.valueAsList, // This is an array token
    }));

    // THEN - Smart detection treats this as array token and consolidates into ServiceRoleDefaultPolicy
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*ServiceRoleDefaultPolicy.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: { Ref: 'ResourceList' },
        }]),
      },
    });

    // Should not create separate inline policies for homogeneous array tokens
    template.resourceCountIs('AWS::IAM::Policy', 1);
  });

  test('respects feature flag when enabled - always creates separate policies', () => {
    // GIVEN
    const app = new cdk.App({
      context: {
        [cxapi.LAMBDA_CREATE_NEW_POLICIES_WITH_ADDTOROLEPOLICY]: true, // Feature flag enabled
      },
    });
    const stack = new cdk.Stack(app);

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('test'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.test',
    });

    // WHEN - Add multiple policies (both literal and array token)
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListBucket'],
      resources: ['arn:aws:s3:::static-bucket'], // Literal
    }));

    const bucketListParam = new cdk.CfnParameter(stack, 'BucketList', {
      type: 'String',
      default: 'bucket1,bucket2,bucket3',
    });

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: cdk.Fn.split(',', bucketListParam.valueAsString), // Array token
    }));

    // THEN - Feature flag overrides smart detection, creates separate policies for all statements
    const template = Template.fromStack(stack);

    // Should create separate inline policies for each statement
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*inlinePolicyAddedToExecutionRole0.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 's3:ListBucket',
          Effect: 'Allow',
          Resource: 'arn:aws:s3:::static-bucket',
        }],
      },
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp('.*inlinePolicyAddedToExecutionRole1.*'),
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 's3:GetObject',
          Effect: 'Allow',
          Resource: { 'Fn::Split': [',', { Ref: 'BucketList' }] },
        }],
      },
    });

    // Should create 2 inline policies (no ServiceRoleDefaultPolicy when feature flag is enabled)
    template.resourceCountIs('AWS::IAM::Policy', 2);
  });
});
