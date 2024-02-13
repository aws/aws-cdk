import { DynamicInput, InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { TestSource, TestTarget } from './test-classes';
import { LambdaEnrichment } from '../lib';

describe('lambda', () => {
  let lambda: Function;
  let stack : Stack;
  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'TestStack');
    const enrichmentHandlerCode = 'exports.handler = async (event) => { return event.map( record => ({...record, body: `${record.body}-${record.name}-${record.static}` }) ) };';
    lambda = new Function(stack, 'EnrichmentLambda', {
      code: Code.fromInline(enrichmentHandlerCode),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_LATEST,
    });
  });

  it('should have only enrichment arn', () => {
    // ARRANGE
    const enrichment = new LambdaEnrichment(lambda);

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
          'EnrichmentLambda3D6CE785',
          'Arn',
        ],
      },
      EnrichmentParameters: {},
    });
  });

  it('should have enrichment parameters', () => {
    // ARRANGE
    const enrichment = new LambdaEnrichment(lambda, {
      inputTransformation: InputTransformation.fromObject({
        body: DynamicInput.fromEventPath('$.body'),
      }),
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
      },
    });
  });

  it('should grant pipe role invoke access', () => {
    // ARRANGE
    const enrichment = new LambdaEnrichment(lambda);

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

