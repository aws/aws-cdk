import { DynamicInput, InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack, SecretValue } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as events from 'aws-cdk-lib/aws-events';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { TestSource, TestTarget } from './test-classes';
import { ApiDestinationEnrichment } from '../lib';

describe('api-destination', () => {
  let app: App;
  let stack: Stack;
  let secret: Secret;
  let connection: events.Connection;
  let apiDestination: events.ApiDestination;

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

    apiDestination = new events.ApiDestination(stack, 'ApiDestination', {
      apiDestinationName: 'ApiDestination',
      connection,
      description: 'ApiDestination',
      httpMethod: events.HttpMethod.GET,
      endpoint: 'someendpoint',
      rateLimitPerSecond: 60,
    });
  });

  it('should have only enrichment arn', () => {
    // ARRANGE
    const enrichment = new ApiDestinationEnrichment(apiDestination);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      enrichment,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Enrichment: {
        'Fn::GetAtt': [
          'ApiDestination3AB57A39',
          'Arn',
        ],
      },
      EnrichmentParameters: {},
    });
  });

  it('should have enrichment parameters', () => {
    // ARRANGE
    const enrichment = new ApiDestinationEnrichment(apiDestination, {
      inputTransformation: InputTransformation.fromObject({
        body: DynamicInput.fromEventPath('$.body'),
      }),
      headerParameters: {
        headerParam: 'headerParam',
      },
      pathParameterValues: ['pathParam'],
      queryStringParameters: {
        param: 'queryParam',
      },
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      enrichment,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      EnrichmentParameters: {
        InputTemplate: '{"body":<$.body>}',
        HttpParameters: {
          HeaderParameters: {
            headerParam: 'headerParam',
          },
          PathParameterValues: [
            'pathParam',
          ],
          QueryStringParameters: {
            param: 'queryParam',
          },
        },
      },
    });
  });

  it('should grant pipe role invoke access', () => {
    // ARRANGE
    const enrichment = new ApiDestinationEnrichment(apiDestination);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      enrichment,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    expect(template.findResources('AWS::IAM::Policy')).toMatchSnapshot();
  });
});

