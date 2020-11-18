import '@aws-cdk/assert/jest';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '../lib';

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
    new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

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
    new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

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

  test('creates minimal constructs if scope region is us-east-1', () => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack', {
      env: { account: '111111111111', region: 'us-east-1' },
    });
    new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

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
    new cloudfront.EdgeFunctionExperimental(stack, 'MyFn1', defaultEdgeFunctionProps());
    new cloudfront.EdgeFunctionExperimental(stack, 'MyFn2', defaultEdgeFunctionProps());

    const fnStack = getFnStack();
    expect(fnStack).toCountResources('AWS::Lambda::Function', 2);
  });
});

test('addAlias() creates alias in function stack', () => {
  const fn = new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

  fn.addAlias('MyCurrentAlias');

  const fnStack = getFnStack();
  expect(fnStack).toHaveResourceLike('AWS::Lambda::Alias', {
    Name: 'MyCurrentAlias',
  });
});

test('addPermission() creates permissions in function stack', () => {
  const fn = new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

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
  const fn = new cloudfront.EdgeFunctionExperimental(stack, 'MyFn', defaultEdgeFunctionProps());

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

function defaultEdgeFunctionProps() {
  return {
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_12_X,
  };
}

function getFnStack(region: string = 'testregion'): cdk.Stack {
  return app.node.findChild(`edge-lambda-stack-${region}`) as cdk.Stack;
}
