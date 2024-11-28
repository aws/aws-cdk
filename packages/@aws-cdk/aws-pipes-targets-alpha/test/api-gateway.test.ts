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
            { Ref: 'MyLambdaRestApiDeployTrueD6F0338A' },
            '/',
            { Ref: 'MyLambdaRestApiDeployTrueDeploymentStageprodAA1DAA0D' },
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
            { Ref: 'MyLambdaRestApiDeployTrueD6F0338A' },
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
            Action: 'execute-api:Invoke',
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
                  { Ref: 'MyLambdaRestApiDeployTrueD6F0338A' },
                  '/',
                  { Ref: 'MyLambdaRestApiDeployTrueDeploymentStageprodAA1DAA0D' },
                  '/*/',
                ],
              ],
            },
          }],
        },
      },
    });
  });

  it('should throw error when REST API does not have a deployed stage', () => {
    // ARRANGE
    const restApiNoDeploy = newTestRestApi(stack, false);

    // ACT & ASSERT
    expect(() => {
      new ApiGatewayTarget(restApiNoDeploy);
    }).toThrow('The REST API must have a deployed stage.');
  });
});

function newTestRestApi(scope: Construct, deploy: boolean = true) {
  const deployStr = String(deploy)[0].toUpperCase() + String(deploy).slice(1);
  const lambdaFunction = new lambda.Function(scope, `MyLambdaDeploy${deployStr}`, {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });

  return new LambdaRestApi(scope, `MyLambdaRestApiDeploy${deployStr}`, {
    handler: lambdaFunction,
    deploy,
  });
}
