import { DynamicInput, InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { TestSource, TestTarget } from './test-classes';
import { StepFunctionsEnrichment } from '../lib';

describe('stepfunctions', () => {
  let stack: Stack;
  let stateMachine: sfn.StateMachine;
  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'TestStack');
    const enrichmentTask = new sfn.Pass(stack, 'EnrichmentTask', {
      parameters: {
        body: sfn.JsonPath.stringAt('States.Format(\'{}{}\',$[0].body,\'-enriched\')'),
      },
    });
    const definition = enrichmentTask;
    stateMachine = new sfn.StateMachine(stack, 'EnrichmentStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });
  });

  it('should have only enrichment arn', () => {
    // ARRANGE
    const enrichment = new StepFunctionsEnrichment(stateMachine);

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
        Ref: 'EnrichmentStateMachine8BED6C4E',
      },
      EnrichmentParameters: {},
    });
  });

  it('should have enrichment parameters', () => {
    // ARRANGE
    const enrichment = new StepFunctionsEnrichment(stateMachine, {
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
    const enrichment = new StepFunctionsEnrichment(stateMachine);

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

test('cannot use STANDARD StateMachine', () => {
  // GIVEN
  const stack = new Stack();
  const enrichmentTask = new sfn.Pass(stack, 'EnrichmentTask', {
    parameters: {
      body: sfn.JsonPath.stringAt('States.Format(\'{}{}\',$[0].body,\'-enriched\')'),
    },
  });

  const definition = enrichmentTask;

  const stateMachine = new sfn.StateMachine(stack, 'EnrichmentStateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(definition),
    stateMachineType: sfn.StateMachineType.STANDARD,
  });

  // WHEN
  expect(() => new StepFunctionsEnrichment(stateMachine),
  ).toThrow('EventBridge pipes only support EXPRESS workflows as enrichment, got STANDARD');
});
