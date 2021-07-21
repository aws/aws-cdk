import '@aws-cdk/assert-internal/jest';
import { ResourcePart } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('lambda-insights', () => {
  test('can provide arn to enable insights', () => {
    const stack = new cdk.Stack();
    const layerArn = 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14';
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      insightsVersion: lambda.LambdaInsightsVersion.fromInsightVersionArn(layerArn),
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      ManagedPolicyArns:
        [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy']] },
        ],
    });

    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Properties:
      {
        Code: { ZipFile: 'foo' },
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
        Runtime: 'nodejs10.x',
        Layers: [layerArn],
      },
      DependsOn: ['MyLambdaServiceRole4539ECB6'],
    }, ResourcePart.CompleteDefinition);
  });

  test('can provide a version to enable insights', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_54_0,
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      ManagedPolicyArns:
        [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy']] },
        ],
    });

    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Properties:
      {
        Code: { ZipFile: 'foo' },
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
        Runtime: 'nodejs10.x',
        Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2'],
      },
      DependsOn: ['MyLambdaServiceRole4539ECB6'],
    }, ResourcePart.CompleteDefinition);

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('existing region with existing but unsupported version throws error', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'af-south-1' },
    });

    // AF-SOUTH-1 exists, 1.0.54.0 exists, but 1.0.54.0 isn't supported in AF-SOUTH-1
    new lambda.Function(stack, 'BadVersion', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_54_0,
    });

    // On synthesis it should throw an error
    expect(() => app.synth()).toThrow();
  });

  test('using a specific version without providing a region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    // AF-SOUTH-1 exists, 1.0.54.0 exists, but 1.0.54.0 isn't supported in AF-SOUTH-1
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_54_0,
    });

    // Should be looking up a mapping
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Properties:
      {
        Code: { ZipFile: 'foo' },
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
        Runtime: 'nodejs10.x',
        Layers: [{
          'Fn::FindInMap': [
            'CloudWatchLambdaInsightsVersions10540',
            {
              Ref: 'AWS::Region',
            },
            'arn',
          ],
        }],
      },
      DependsOn: ['MyLambdaServiceRole4539ECB6'],
    }, ResourcePart.CompleteDefinition);

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });
});
