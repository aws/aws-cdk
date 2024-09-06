import { Template, Match } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import * as lambda from '../../aws-lambda';
import { Stack } from '../../core';
import * as cdk from '../../core';
import { FunctionUrlOrigin } from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

test('Correctly renders the origin for a Lambda Function URL', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  const origin = new FunctionUrlOrigin(fnUrl);
  const originBindConfig = origin.bind(stack, { originId: 'StackOriginLambdaFunctionURL' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOriginLambdaFunctionURL',
    domainName: {
      'Fn::Select': [
        2,
        {
          'Fn::Split': [
            '/',
            { 'Fn::GetAtt': ['MyFunctionFunctionUrlFF6DE78C', 'FunctionUrl'] },
          ],
        },
      ],
    },
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: ['TLSv1.2'],
    },
  });
});

test('Correctly sets readTimeout and keepaliveTimeout', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  const origin = new FunctionUrlOrigin(fnUrl, {
    readTimeout: cdk.Duration.seconds(120),
    keepaliveTimeout: cdk.Duration.seconds(60),
  });

  const originBindConfig = origin.bind(stack, { originId: 'StackOriginLambdaFunctionURL' });

  expect(stack.resolve(originBindConfig.originProperty)).toMatchObject({
    customOriginConfig: {
      originReadTimeout: 120,
      originKeepaliveTimeout: 60,
    },
  });
});

test('Correctly adds permission to Lambda for CloudFront', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  const distribution = new cloudfront.Distribution(stack, 'MyDistribution', {
    defaultBehavior: {
      origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
        originAccessControl: undefined,
      }),
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          DomainName: {
            'Fn::Select': [
              2,
              {
                'Fn::Split': [
                  '/',
                  {
                    'Fn::GetAtt': ['MyFunctionFunctionUrlFF6DE78C', 'FunctionUrl'],
                  },
                ],
              },
            ],
          },
          OriginAccessControlId: Match.objectLike({
            'Fn::GetAtt': [
              Match.stringLikeRegexp('MyDistributionOrigin.*LambdaOriginAccessControl.*'),
              'Id',
            ],
          }),
        }),
      ]),
    },
  });
});

test('Correctly configures CloudFront Distribution with Origin Access Control', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  new cloudfront.Distribution(stack, 'MyDistribution', {
    defaultBehavior: {
      origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
        originAccessControl: undefined,
      }),
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          DomainName: {
            'Fn::Select': [
              2,
              {
                'Fn::Split': [
                  '/',
                  {
                    'Fn::GetAtt': ['MyFunctionFunctionUrlFF6DE78C', 'FunctionUrl'],
                  },
                ],
              },
            ],
          },
          OriginAccessControlId: Match.objectLike({
            'Fn::GetAtt': [
              Match.stringLikeRegexp('MyDistributionOrigin.*LambdaOriginAccessControl.*'),
              'Id',
            ],
          }),
        }),
      ]),
    },
  });

  template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
    OriginAccessControlConfig: {
      OriginAccessControlOriginType: 'lambda',
      SigningBehavior: 'always',
      SigningProtocol: 'sigv4',
    },
  });
});

test('Correctly configures CloudFront Distribution with a custom Origin Access Control', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  // Custom OAC configuration
  const oac = new cloudfront.FunctionUrlOriginAccessControl(stack, 'CustomOAC', {
    originAccessControlName: 'CustomLambdaOAC',
    signing: cloudfront.Signing.SIGV4_ALWAYS,
  });

  new cloudfront.Distribution(stack, 'MyDistribution', {
    defaultBehavior: {
      origin: FunctionUrlOrigin.withOriginAccessControl(fnUrl, {
        originAccessControl: oac,
      }),
    },
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudFront::OriginAccessControl', {
    OriginAccessControlConfig: {
      Name: 'CustomLambdaOAC',
      OriginAccessControlOriginType: 'lambda',
      SigningBehavior: 'always',
      SigningProtocol: 'sigv4',
    },
  });
});