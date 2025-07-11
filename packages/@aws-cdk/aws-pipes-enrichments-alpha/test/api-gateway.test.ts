import { DynamicInput, InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { TestSource, TestTarget } from './test-classes';
import { ApiGatewayEnrichment } from '../lib/api-gateway';

describe('api-destination', () => {
  let app: App;
  let stack: Stack;
  let restApi: LambdaRestApi;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    restApi = new RestApi(stack, 'RestApi');
    restApi.root.addResource('test').addMethod('GET');
  });

  it('should have only enrichment arn', () => {
    // ARRANGE
    const enrichment = new ApiGatewayEnrichment(restApi);

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
            { Ref: 'RestApi0C43BF4B' },
            '/',
            { Ref: 'RestApiDeploymentStageprod3855DE66' },
            '/*/',
          ],
        ],
      },
      EnrichmentParameters: {},
    });
  });

  it('should have only enrichment arn with api gateway parameters', () => {
    // ARRANGE
    const enrichment = new ApiGatewayEnrichment(restApi, {
      stage: 'dev',
      method: 'GET',
      path: '/test',
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
      Enrichment: {
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
            { Ref: 'RestApi0C43BF4B' },
            '/dev/GET/test',
          ],
        ],
      },
      EnrichmentParameters: {},
    });
  });

  it('should have enrichment parameters', () => {
    // ARRANGE
    const enrichment = new ApiGatewayEnrichment(restApi, {
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
    const enrichment = new ApiGatewayEnrichment(restApi);

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

