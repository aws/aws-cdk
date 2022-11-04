import { Match, Template } from '@aws-cdk/assertions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { Fact, FactName } from '@aws-cdk/region-info';
import * as lambda from '../lib';

/**
 * Boilerplate code to create a Function with a given insights version
 */
function functionWithInsightsVersion(
  stack: cdk.Stack,
  id: string,
  insightsVersion: lambda.LambdaInsightsVersion,
  architecture?: lambda.Architecture,
): lambda.IFunction {
  return new lambda.Function(stack, id, {
    functionName: id,
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
    architecture,
    insightsVersion,
  });
}

/**
 * Check if the function's Role has the Lambda Insights IAM policy
 */
function verifyRoleHasCorrectPolicies(stack: cdk.Stack) {
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns:
      [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy']] },
      ],
  });
}

// This test code has app.synth() because the lambda-insights code has functions that are only run on synthesis
describe('lambda-insights', () => {
  test('can provide arn to enable insights', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14';
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.fromInsightVersionArn(layerArn));

    verifyRoleHasCorrectPolicies(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('can provide a version to enable insights', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);

    verifyRoleHasCorrectPolicies(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2'],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('existing region with existing but unsupported version throws error', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'af-south-1' },
    });

    // AF-SOUTH-1 exists, 1.0.54.0 exists, but 1.0.54.0 isn't supported in AF-SOUTH-1
    expect(() => {
      functionWithInsightsVersion(stack, 'BadVersion', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);
    }).toThrow('Insights version 1.0.54.0 is not supported in region af-south-1');
  });

  test('using a specific version without providing a region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_98_0);

    // Still resolves because all elements of the mapping map to the same value
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [{
        'Fn::FindInMap': [
          'CloudwatchlambdainsightsversionMap',
          {
            Ref: 'AWS::Region',
          },
          '1x0x98x0xx86x64',
        ],
      }],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  // Here we're error checking the code which verifies if the mapping exists already
  test('can create two functions in a region agnostic stack with the same version', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda1', lambda.LambdaInsightsVersion.VERSION_1_0_98_0);
    functionWithInsightsVersion(stack, 'MyLambda2', lambda.LambdaInsightsVersion.VERSION_1_0_98_0);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'MyLambda1',
      Layers: [{
        'Fn::FindInMap': ['CloudwatchlambdainsightsversionMap', { Ref: 'AWS::Region' }, '1x0x98x0xx86x64'],
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'MyLambda2',
      Layers: [{
        'Fn::FindInMap': ['CloudwatchlambdainsightsversionMap', { Ref: 'AWS::Region' }, '1x0x98x0xx86x64'],
      }],
    });

    Template.fromStack(stack).hasMapping('CloudwatchlambdainsightsversionMap', {
      'af-south-1': {
        '1x0x98x0xx86x64': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:8',
      },
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('insights layer is skipped for container images and the role is updated', () => {
    const stack = new cdk.Stack();
    new lambda.DockerImageFunction(stack, 'MyFunction', {
      code: lambda.DockerImageCode.fromEcr(ecr.Repository.fromRepositoryArn(stack, 'MyRepo',
        'arn:aws:ecr:us-east-1:0123456789:repository/MyRepo')),
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::LayerVersion', 0);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
          },
        ],
      },
      ManagedPolicyArns: Match.arrayWith([
        {
          'Fn::Join': ['', [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
          ]],
        },
      ]),
    });
  });

  test('can use with arm architecture', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:1'],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('throws if arm is not available in this version', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    expect(() => functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_98_0, lambda.Architecture.ARM_64)).toThrow('Insights version 1.0.98.0 does not exist.');
  });
  test('throws if arm is available in this version, but not in this region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-west-1' },
    });

    expect(() => {
      functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);
    }).toThrow('Insights version 1.0.119.0 is not supported in region us-west-1');
  });

  test('can create two functions, with different architectures in a region agnostic stack with the same version', () => {
    // We mess with the fact database a bit here -- add a fact for the ARM LambdaInsights layer which
    // is different from the existing facts, to force the region info to render a lookup table (instead
    // of being able to just insert a literal).
    Fact.register({ name: FactName.cloudwatchLambdaInsightsVersion('1.0.119.0', 'arm64'), region: 'eu-west-1', value: 'CompletelyDifferent' }, true);

    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda1', lambda.LambdaInsightsVersion.VERSION_1_0_119_0);
    functionWithInsightsVersion(stack, 'MyLambda2', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'MyLambda1',
      Layers: [{
        'Fn::FindInMap': ['CloudwatchlambdainsightsversionMap', { Ref: 'AWS::Region' }, '1x0x119x0xx86x64'],
      }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'MyLambda2',
      Layers: [{
        'Fn::FindInMap': ['CloudwatchlambdainsightsversionMap', { Ref: 'AWS::Region' }, '1x0x119x0xarm64'],
      }],
    });

    Template.fromStack(stack).hasMapping('CloudwatchlambdainsightsversionMap', {
      'ap-south-1': {
        '1x0x119x0xx86x64': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:16',
        '1x0x119x0xarm64': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
      },
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });
  test('can use layer v1.0.143.0', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_143_0, lambda.Architecture.X86_64);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:21'],
    });
  });
});
