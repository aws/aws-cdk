import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack, SecretValue } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as events from 'aws-cdk-lib/aws-events';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TestSource } from './test-classes';
import { ApiDestinationTarget } from '../lib';

describe('API destination', () => {
  let app: App;
  let stack: Stack;
  let secret: Secret;
  let connection: events.Connection;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
    secret = new Secret(stack, 'MySecret', {
      secretStringValue: SecretValue.unsafePlainText('abc123'),
    });
    connection = new events.Connection(stack, 'MyConnection', {
      authorization: events.Authorization.apiKey('x-api-key', secret.secretValue),
      description: 'Connection with API Key x-api-key',
      connectionName: 'MyConnection',
    });
  });

  it('should have only target arn', () => {
    // ARRANGE
    const destination = new events.ApiDestination(stack, 'MyApiDestination', {
      connection,
      endpoint: 'https://httpbin.org/headers',
      httpMethod: events.HttpMethod.GET,
      apiDestinationName: 'MyDestination',
      rateLimitPerSecond: 1,
      description: 'Calling example.com with API key x-api-key',
    });
    const target = new ApiDestinationTarget(destination);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MyApiDestination07E6A8F9',
          'Arn',
        ],
      },
      TargetParameters: {},
    });
  });

  it('should have target parameters', () => {
    // ARRANGE
    const destination = new events.ApiDestination(stack, 'MyApiDestination', {
      connection,
      endpoint: 'https://httpbin.org/headers',
      httpMethod: events.HttpMethod.GET,
      apiDestinationName: 'MyDestination',
      rateLimitPerSecond: 1,
      description: 'Calling example.com with API key x-api-key',
    });
    const target = new ApiDestinationTarget(destination, {
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
    const destination = new events.ApiDestination(stack, 'MyApiDestination', {
      connection,
      endpoint: 'https://httpbin.org/headers',
      httpMethod: events.HttpMethod.GET,
      apiDestinationName: 'MyDestination',
      rateLimitPerSecond: 1,
      description: 'Calling example.com with API key x-api-key',
    });

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });

    const target = new ApiDestinationTarget(destination, {
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
    const destination = new events.ApiDestination(stack, 'MyApiDestination', {
      connection,
      endpoint: 'https://httpbin.org/headers',
      httpMethod: events.HttpMethod.GET,
      apiDestinationName: 'MyDestination',
      rateLimitPerSecond: 1,
      description: 'Calling example.com with API key x-api-key',
    });
    const target = new ApiDestinationTarget(destination);

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
            Action: 'events:InvokeApiDestination',
            Resource: {
              'Fn::GetAtt': ['MyApiDestination07E6A8F9', 'Arn'],
            },
          }],
        },
      },
    });
  });
});
