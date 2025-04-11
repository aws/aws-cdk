import { Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { OrchestrationExecutor } from '../../../bedrock/agents/orchestration-executor';

describe('OrchestrationExecutor', () => {
  let stack: Stack;
  let testFunction: lambda.Function;

  beforeEach(() => {
    stack = new Stack();
    testFunction = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = function() { }'),
    });
  });

  test('can create from lambda function', () => {
    // WHEN
    const executor = OrchestrationExecutor.fromlambdaFunction(testFunction);

    // THEN
    expect(executor).toBeInstanceOf(OrchestrationExecutor);
    expect(executor.lambdaFunction).toBe(testFunction);
  });

  test('renders CFN properties correctly', () => {
    // GIVEN
    const executor = OrchestrationExecutor.fromlambdaFunction(testFunction);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: testFunction.functionArn,
    });
  });

  test('handles undefined lambda function gracefully', () => {
    // GIVEN
    const executor = OrchestrationExecutor.fromlambdaFunction(undefined as any);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: undefined,
    });
  });

  test('handles null lambda function gracefully', () => {
    // GIVEN
    const executor = OrchestrationExecutor.fromlambdaFunction(null as any);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: undefined,
    });
  });

  test('handles lambda function with undefined functionArn', () => {
    // GIVEN
    const mockFunction = {} as lambda.IFunction;
    const executor = OrchestrationExecutor.fromlambdaFunction(mockFunction);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: undefined,
    });
  });

  test('handles non-function input', () => {
    // GIVEN
    const nonFunction = { someProperty: 'value' };

    // THEN
    expect(() => {
      OrchestrationExecutor.fromlambdaFunction(nonFunction as any);
    }).not.toThrow();
  });

  test('handles lambda function with null functionArn', () => {
    // GIVEN
    const mockFunction = {
      functionArn: null,
    } as any as lambda.IFunction;
    const executor = OrchestrationExecutor.fromlambdaFunction(mockFunction);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: null,
    });
  });

  test('preserves lambda function reference', () => {
    // GIVEN
    const executor = OrchestrationExecutor.fromlambdaFunction(testFunction);
    const anotherExecutor = OrchestrationExecutor.fromlambdaFunction(testFunction);

    // THEN
    expect(executor.lambdaFunction).toBe(anotherExecutor.lambdaFunction);
  });

  test('renders with mock lambda function', () => {
    // GIVEN
    const mockFunction = {
      functionArn: 'arn:aws:lambda:us-west-2:123456789012:function:test',
    } as lambda.IFunction;
    const executor = OrchestrationExecutor.fromlambdaFunction(mockFunction);

    // WHEN
    const rendered = executor._render();

    // THEN
    expect(rendered).toEqual({
      lambda: 'arn:aws:lambda:us-west-2:123456789012:function:test',
    });
  });
});
