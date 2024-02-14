import * as lambda from '../../aws-lambda';
import { Stack } from '../../core';
import { FunctionUrlOrigin } from '../lib';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

test('Correctly renders the origin for a Lambda Function URL', () => {
  const fn = new lambda.Function(stack, 'MyFunction', {
    code: lambda.Code.fromInline('exports.handler = async () => {};'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_20_X,
  });

  const fnUrl = fn.addFunctionUrl({
    authType: lambda.FunctionUrlAuthType.NONE,
  });

  const origin = new FunctionUrlOrigin(fnUrl);
  const originBindConfig = origin.bind(stack, { originId: 'StackOriginLambdaFunctionURL' });

  expect(stack.resolve(originBindConfig.originProperty)).toEqual({
    id: 'StackOriginLambdaFunctionURL',
    domainName: {
      'Fn::Select': [
        2,
        {
          'Fn::Split': [
            '/',
            { 'Fn::GetAtt': ['MyFunctionFunctionUrlFF6DE78C', 'FunctionUrl'] },
          ],
        },
      ],
    },
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: ['TLSv1.2'],
    },
  });
});
