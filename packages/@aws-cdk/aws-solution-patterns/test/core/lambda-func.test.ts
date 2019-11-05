import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import { Duration, Stack } from '@aws-cdk/core';
import path = require('path');
import { DefaultFunctionProps } from '../../lib/core/lambda-defaults';
import { overrideProps } from '../../lib/core/utils';

test('snapshot test LambdaFunction default params', () => {
    const stack = new Stack();

    const inProps: lambda.FunctionProps = {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler'
    };
    new lambda.Function(stack, 'LambdaFunction', inProps);

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('test FunctionProps override code and runtime', () => {
    const stack = new Stack();

    const inProps: lambda.FunctionProps = {
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
        runtime: lambda.Runtime.PYTHON_3_6,
        handler: 'index.handler'
    };

    const outProps = overrideProps(DefaultFunctionProps, inProps);

    new lambda.Function(stack, 'LambdaFunction', outProps);

    expect(stack).toHaveResource('AWS::Lambda::Function', {
        Handler: "index.handler",
        Role: {
          "Fn::GetAtt": [
            "LambdaFunctionServiceRoleC555A460",
            "Arn"
          ]
        },
        Runtime: "python3.6",
        Environment: {
          Variables: {
            LOGLEVEL: "INFO"
          }
        }
    });
});

test('test FunctionProps override timeout', () => {
    const stack = new Stack();

    const defaultProps: lambda.FunctionProps = DefaultFunctionProps;

    const inProps: lambda.FunctionProps = {
        code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'index.handler',
        timeout: Duration.seconds(5),
    };

    const outProps = overrideProps(defaultProps, inProps);

    new lambda.Function(stack, 'LambdaFunction', outProps);

    expect(stack).toHaveResource('AWS::Lambda::Function', {
        Handler: "index.handler",
        Role: {
          "Fn::GetAtt": [
            "LambdaFunctionServiceRoleC555A460",
            "Arn"
          ]
        },
        Runtime: "nodejs10.x",
        Environment: {
          Variables: {
            LOGLEVEL: "INFO"
          }
        },
        Timeout: 5
    });
});