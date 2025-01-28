import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { TestSource } from './test-classes';
import { LambdaFunction } from '../lib/lambda';

describe('lambda-function', () => {
  it('should have only target arn and default invocation type REQUEST_RESPONSE', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestLambdaFunctionStack');

    const lambdaFunction = new lambda.Function(stack, 'MyLambda', {
      code: lambda.Code.fromInline('console.log("Hello, world!")'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });

    const target = new LambdaFunction(lambdaFunction, {});

    new Pipe(stack, 'MyLambdaPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MyLambdaCCE802FB',
          'Arn',
        ],
      },
      TargetParameters: {
        LambdaFunctionParameters: {
          InvocationType: 'REQUEST_RESPONSE',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestLambdaFunctionStack');

    const lambdaFunctionArn = 'arn:aws:lambda:eu-central-1:133713371337:function:MyLambda';
    const lambdaFunction = lambda.Function.fromFunctionAttributes(stack, 'MyLambda', {
      functionArn: lambdaFunctionArn,
      sameEnvironment: true,
    });

    const inputTransformation = InputTransformation.fromObject({
      key: '👀',
    });
    const target = new LambdaFunction(lambdaFunction, { inputTransformation });

    new Pipe(stack, 'MyLambdaPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: lambdaFunctionArn,
      TargetParameters: {
        InputTemplate: '{"key":"👀"}',
        LambdaFunctionParameters: {
          InvocationType: 'REQUEST_RESPONSE',
        },
      },
    });
  });

  it('should grant lambda function invoke', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestLambdaFunctionStack');

    const lambdaFunctionArn = 'arn:aws:lambda:eu-central-1:133713371337:function:MyLambda';
    const lambdaFunction = lambda.Function.fromFunctionAttributes(stack, 'MyLambda', {
      functionArn: lambdaFunctionArn,
      sameEnvironment: true,
    });

    const target = new LambdaFunction(lambdaFunction, {});

    new Pipe(stack, 'MyLambdaPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [lambdaFunctionArn, `${lambdaFunctionArn}:*`],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('should work with imported function', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestLambdaFunctionStack');

    const lambdaFunction = new lambda.Function(stack, 'MyLambda', {
      code: lambda.Code.fromInline('console.log("Hello, world!")'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    });

    const importedFunction = lambda.Function.fromFunctionArn(stack, 'MyImportedLambda', lambdaFunction.functionArn);
    const target = new LambdaFunction(importedFunction, {});

    new Pipe(stack, 'MyLambdaPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MyLambdaCCE802FB',
          'Arn',
        ],
      },
      TargetParameters: {
        LambdaFunctionParameters: {
          InvocationType: 'REQUEST_RESPONSE',
        },
      },
    });
  });
});
