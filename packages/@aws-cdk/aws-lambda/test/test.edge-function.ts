import { countResources, expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { ICallbackFunction, Test } from 'nodeunit';
import * as lambda from '../lib';

let app: App;
let stack: Stack;

export = {
  setUp: function (cb: ICallbackFunction) {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '111111111111', region: 'testregion' },
    });
    cb();
  },

  stacks: {
    'creates a custom resource and supporting resources in main stack'(test: Test) {
      new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

      expect(stack).to(haveResource('AWS::IAM::Role', {
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
                'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':ssm:us-east-1:111111111111:parameter/EdgeFunctionArnMyFn']],
              },
              Action: ['ssm:GetParameter'],
            }],
          },
        }],
      }));
      expect(stack).to(haveResourceLike('AWS::Lambda::Function', {
        Handler: '__entrypoint__.handler',
        Role: {
          'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderRole71CD6825', 'Arn'],
        },
      }));
      expect(stack).to(haveResource('Custom::CrossRegionStringParameterReader', {
        ServiceToken: {
          'Fn::GetAtt': ['CustomCrossRegionStringParameterReaderCustomResourceProviderHandler65B5F33A', 'Arn'],
        },
        Region: 'us-east-1',
        ParameterName: 'EdgeFunctionArnMyFn',
      }));

      test.done();
    },

    'creates the actual function and supporting resources in us-east-1 stack'(test: Test) {
      new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

      const fnStack = getFnStack();

      expect(fnStack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
                'edgelambda.amazonaws.com',
              ],
            },
          }],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
        ],
      }));
      expect(fnStack).to(haveResource('AWS::Lambda::Function', {
        Code: { ZipFile: 'foo' },
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': ['MyFnServiceRole10C2021A', 'Arn'] },
        Runtime: 'nodejs12.x',
      }));
      expect(fnStack).to(haveResource('AWS::Lambda::Version', {
        FunctionName: { Ref: 'MyFn6F8F742F' },
      }));
      expect(fnStack).to(haveResource('AWS::SSM::Parameter', {
        Type: 'String',
        Value: { Ref: 'MyFnCurrentVersion309B29FCd8b4ee70a56dc81a87f1bef55d3f737c' },
        Name: 'EdgeFunctionArnMyFn',
      }));

      test.done();
    },

    'creates minimal constructs if scope region is us-east-1'(test: Test) {
      app = new App();
      stack = new Stack(app, 'Stack', {
        env: { account: '111111111111', region: 'us-east-1' },
      });
      new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

      expect(stack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: [
                'lambda.amazonaws.com',
                'edgelambda.amazonaws.com',
              ],
            },
          }],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
        ],
      }));
      expect(stack).to(haveResource('AWS::Lambda::Function', {
        Code: { ZipFile: 'foo' },
        Handler: 'index.handler',
        Role: { 'Fn::GetAtt': ['MyFnMyFnServiceRole787DF257', 'Arn'] },
        Runtime: 'nodejs12.x',
      }));
      expect(stack).to(haveResource('AWS::Lambda::Version', {
        FunctionName: { Ref: 'MyFn223608AD' },
      }));

      test.done();
    },

    'only one cross-region stack is created for multiple functions'(test: Test) {
      new lambda.EdgeFunction(stack, 'MyFn1', defaultEdgeFunctionProps());
      new lambda.EdgeFunction(stack, 'MyFn2', defaultEdgeFunctionProps());

      const fnStack = getFnStack();
      expect(fnStack).to(countResources('AWS::Lambda::Function', 2));

      test.done();
    },
  },

  'addAlias() creates alias in function stack'(test: Test) {
    const fn = new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    fn.addAlias('MyCurrentAlias');

    const fnStack = getFnStack();
    expect(fnStack).to(haveResourceLike('AWS::Lambda::Alias', {
      Name: 'MyCurrentAlias',
    }));

    test.done();
  },

  'addPermission() creates permissions in function stack'(test: Test) {
    const fn = new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    fn.addPermission('MyPerms', {
      action: 'lambda:InvokeFunction',
      principal: new iam.AccountPrincipal('123456789012'),
    });

    const fnStack = getFnStack();
    expect(fnStack).to(haveResourceLike('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: '123456789012',
    }));

    test.done();
  },

  'metric methods'(test: Test) {
    const fn = new lambda.EdgeFunction(stack, 'MyFn', defaultEdgeFunctionProps());

    const metrics = new Array<cloudwatch.Metric>();
    metrics.push(fn.metricDuration());
    metrics.push(fn.metricErrors());
    metrics.push(fn.metricInvocations());
    metrics.push(fn.metricThrottles());

    for (const metric of metrics) {
      test.equals(metric.namespace, 'AWS/Lambda');
      test.equals(metric.region, 'us-east-1');
    }

    test.done();
  },
};

function defaultEdgeFunctionProps() {
  return {
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_12_X,
  };
}

function getFnStack(region: string = 'testregion'): Stack {
  return app.node.findChild(`edge-lambda-stack-${region}`) as Stack;
}
