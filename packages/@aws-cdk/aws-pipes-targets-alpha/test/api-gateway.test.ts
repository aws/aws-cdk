import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { TestSource } from './test-classes';
import { ApiGatewayTarget } from '../lib';

describe('API Gateway REST API', () => {
  let app: App;
  let stack: Stack;
  let restApi: LambdaRestApi;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    restApi = newTestRestApi(stack);
  });

  it('should have only target arn', () => {
    // ARRANGE
    const target = new ApiGatewayTarget(restApi);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'MyLambdaRestApiECB8AFAF' },
            '/',
            { Ref: 'MyLambdaRestApiDeploymentStageprodA127C527' },
            '/*/',
          ],
        ],
      },
      TargetParameters: {},
    });
  });

  it('should have only target arn with stage/method/path', () => {
    // ARRANGE
    const target = new ApiGatewayTarget(restApi, {
      stage: 'prod',
      method: 'GET',
      path: '/books',
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'MyLambdaRestApiECB8AFAF' },
            '/prod/GET/books',
          ],
        ],
      },
      TargetParameters: {},
    });
  });

  it('should have target parameters', () => {
    // ARRANGE
    const target = new ApiGatewayTarget(restApi, {
      headerParameters: { headerName: 'headerValue' },
      pathParameterValues: ['pathValue'],
      queryStringParameters: { queryName: 'queryValue' },
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        HttpParameters: {
          HeaderParameters: {
            headerName: 'headerValue',
          },
          PathParameterValues: ['pathValue'],
          QueryStringParameters: {
            queryName: 'queryValue',
          },
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });

    const target = new ApiGatewayTarget(restApi, {
      inputTransformation,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        InputTemplate: '{"key":"value"}',
      },
    });
  });

  it('should grant pipe role push access', () => {
    // ARRANGE
    const target = new ApiGatewayTarget(restApi);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResource('AWS::IAM::Policy', {
      Properties: {
        Roles: [{
          Ref: 'MyPipeRoleCBC8E9AB',
        }],
        PolicyDocument: {
          Statement: [{
            Action: [
              'execute-api:Invoke',
              'execute-api:ManageConnections',
            ],
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':execute-api:',
                  { Ref: 'AWS::Region' },
                  ':',
                  { Ref: 'AWS::AccountId' },
                  ':',
                  { Ref: 'MyLambdaRestApiECB8AFAF' },
                  '/',
                  { Ref: 'MyLambdaRestApiDeploymentStageprodA127C527' },
                  '/*/',
                ],
              ],
            },
          }],
        },
      },
    });
  });
});

function newTestRestApi(scope: Construct) {
  const lambdaFunction = new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });

  return new LambdaRestApi(scope, 'MyLambdaRestApi', {
    handler: lambdaFunction,
  });
}
