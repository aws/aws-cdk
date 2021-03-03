import * as path from 'path';
import '@aws-cdk/assert/jest';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../../lib';

let app: cdk.App;
let stack: cdk.Stack;

beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'testregion' },
  });
});

describe('stacks', () => {
  test('creates a custom resource and supporting resources in main stack', () => {
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
        }],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        { 'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
      ],
      Policies: [{
        PolicyName: 'Inline',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:us-east-1:111111111111:parameter/EdgeFunctionArn*']],
            },
            Action: ['ssm:GetParameter'],
          }],
        },
      }],
    });
    expect(stack).toHaveResourceLike('AWS::Lambda::Function', {
      Handler: '__entrypoint__.handler',
      Role: {
        'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderRole71CD6825', 'Arn'],
      },
    });
    expect(stack).toHaveResource('Custom::CrossRegionStringParameterReader', {
      ServiceToken: {
        'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderHandler65B5F33A', 'Arn'],
      },
      Region: 'us-east-1',
      ParameterName: 'EdgeFunctionArnMyFn',
    });
  });

  test('creates the actual function and supporting resources in us-east-1 stack', () => {
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    const fnStack = getFnStack();

    expect(fnStack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
          },
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'edgelambda.amazonaws.com' },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
      ],
    });
    expect(fnStack).toHaveResource('AWS::Lambda::Function', {
      Code: { ZipFile: 'foo' },
      Handler: 'index.handler',
      Role: { 'Fn::GetAtt': ['MyFnServiceRoleF3016589', 'Arn'] },
      Runtime: 'nodejs12.x',
    });
    expect(fnStack).toHaveResource('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyFn6F8F742F' },
    });
    expect(fnStack).toHaveResource('AWS::SSM::Parameter', {
      Type: 'String',
      Value: { Ref: 'MyFnCurrentVersion309B29FC29686ce94039b6e08d1645be854b3ac9' },
      Name: 'EdgeFunctionArnMyFn',
    });
  });

  test('us-east-1 stack inherits account of parent stack', () => {
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    const fnStack = getFnStack();

    expect(fnStack.account).toEqual('111111111111');
  });

  test('us-east-1 stack inherits account of parent stack, when parent stack account is undefined', () => {
    stack = new cdk.Stack(app, 'StackWithDefaultAccount', {
      env: { region: 'testregion' },
    });
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    const fnStack = getFnStack();

    expect(fnStack.account).toEqual(cdk.Aws.ACCOUNT_ID);
  });

  test('creates minimal constructs if scope region is us-east-1', () => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', {
      env: { account: '111111111111', region: 'us-east-1' },
    });
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
          },
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'edgelambda.amazonaws.com' },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
      ],
    });
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Code: { ZipFile: 'foo' },
      Handler: 'index.handler',
      Role: { 'Fn::GetAtt': ['MyFnServiceRole3F9D41E1', 'Arn'] },
      Runtime: 'nodejs12.x',
    });
    expect(stack).toHaveResource('AWS::Lambda::Version', {
      FunctionName: { Ref: 'MyFn223608AD' },
    });
  });

  test('only one cross-region stack is created for multiple functions', () => {
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn1', defaultEdgeFunctionProps());
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn2', defaultEdgeFunctionProps());

    const fnStack = getFnStack();
    expect(fnStack).toCountResources('AWS::Lambda::Function', 2);
  });

  test('can set the stack id for each function', () => {
    const fn1StackId = 'edge-lambda-stack-testregion-1';
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn1', defaultEdgeFunctionProps(fn1StackId));
    const fn2StackId = 'edge-lambda-stack-testregion-2';
    new cloudfront.experimental.EdgeFunction(stack, 'MyFn2', defaultEdgeFunctionProps(fn2StackId));

    const fn1Stack = app.node.findChild(fn1StackId) as cdk.Stack;
    expect(fn1Stack).toCountResources('AWS::Lambda::Function', 1);
    const fn2Stack = app.node.findChild(fn2StackId) as cdk.Stack;
    expect(fn2Stack).toCountResources('AWS::Lambda::Function', 1);
  });

  test('cross-region stack supports defining functions within stages', () => {
    app = new cdk.App();
    const stage = new cdk.Stage(app, 'Stage');
    stack = new cdk.Stack(stage, 'Stack', {
      env: { account: '111111111111', region: 'testregion' },
    });

    new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    // Because 'expect(stack)' doesn't work correctly for stacks in nested assemblies
    const stackArtifact = stage.synth().getStackArtifact(stack.artifactId);
    expect(stackArtifact).toHaveResourceLike('AWS::Lambda::Function', {
      Handler: '__entrypoint__.handler',
      Role: {
        'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderRole71CD6825', 'Arn'],
      },
    });
    expect(stackArtifact).toHaveResource('Custom::CrossRegionStringParameterReader', {
      ServiceToken: {
        'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderHandler65B5F33A', 'Arn'],
      },
      Region: 'us-east-1',
      ParameterName: 'EdgeFunctionArnMyFn',
    });
  });
});

test('addAlias() creates alias in function stack', () => {
  const fn = new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

  fn.addAlias('MyCurrentAlias');

  const fnStack = getFnStack();
  expect(fnStack).toHaveResourceLike('AWS::Lambda::Alias', {
    Name: 'MyCurrentAlias',
  });
});

test('mutliple aliases with the same name can be added to the same stack', () => {
  const fn1 = new cloudfront.experimental.EdgeFunction(stack, 'MyFn1', defaultEdgeFunctionProps());
  const fn2 = new cloudfront.experimental.EdgeFunction(stack, 'MyFn2', defaultEdgeFunctionProps());
  fn1.addAlias('live');
  fn2.addAlias('live');

  const fnStack = getFnStack();
  expect(fnStack).toCountResources('AWS::Lambda::Function', 2);
  expect(fnStack).toCountResources('AWS::Lambda::Alias', 2);
});

test('addPermission() creates permissions in function stack', () => {
  const fn = new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

  fn.addPermission('MyPerms', {
    action: 'lambda:InvokeFunction',
    principal: new iam.AccountPrincipal('123456789012'),
  });

  const fnStack = getFnStack();
  expect(fnStack).toHaveResourceLike('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    Principal: '123456789012',
  });
});

test('metric methods', () => {
  const fn = new cloudfront.experimental.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

  const metrics = new Array<cloudwatch.Metric>();
  metrics.push(fn.metricDuration());
  metrics.push(fn.metricErrors());
  metrics.push(fn.metricInvocations());
  metrics.push(fn.metricThrottles());

  for (const metric of metrics) {
    expect(metric.namespace).toEqual('AWS/Lambda');
    expect(metric.region).toEqual('us-east-1');
  }
});

test('cross-region stack supports new-style synthesis with assets', () => {
  app = new cdk.App({
    context: { '@aws-cdk/core:newStyleStackSynthesis': true },
  });
  stack = new cdk.Stack(app, 'Stack', {
    env: { account: '111111111111', region: 'testregion' },
  });

  new cloudfront.experimental.EdgeFunction(stack, 'MyFn', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
    handler: 'index.handler',
    runtime: lambda.Runtime.PYTHON_3_8,
  });

  expect(() => app.synth()).not.toThrow();
});

function defaultEdgeFunctionProps(stackId?: string) {
  return {
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_12_X,
    stackId: stackId,
  };
}

function getFnStack(): cdk.Stack {
  return app.node.findChild(`edge-lambda-stack-${stack.node.addr}`) as cdk.Stack;
}
