import '@aws-cdk/assert-internal/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as firehose from '../lib';
import { LambdaFunctionProcessor } from '../lib/processor';

describe('processor', () => {
  let stack: cdk.Stack;
  let deliveryStream: firehose.IDeliveryStream;

  beforeEach(() => {
    stack = new cdk.Stack();
    deliveryStream = firehose.DeliveryStream.fromDeliveryStreamAttributes(stack, 'Delivery Stream', {
      deliveryStreamName: 'mydeliverystream',
      role: iam.Role.fromRoleArn(stack, 'Delivery Stream Role', 'arn:aws:iam::111122223333:role/DeliveryStreamRole'),
    });
  });

  describe('createProcessingConfig', () => {
    let lambdaFunction: lambda.IFunction;
    const functionArn = 'arn:aws:lambda:xx-west-1:111122223333:function:my-function';
    beforeEach(() => {
      lambdaFunction = lambda.Function.fromFunctionAttributes(stack, 'Processor', {
        functionArn: functionArn,
        sameEnvironment: true,
      });
    });

    test('correctly sets processor type and identifier', () => {
      const processor = new LambdaFunctionProcessor(lambdaFunction);

      const processorConfig = processor.bind(deliveryStream);

      expect(stack.resolve(processorConfig)).toStrictEqual({
        processorType: 'Lambda',
        processorIdentifier: {
          parameterName: 'LambdaArn',
          parameterValue: functionArn,
        },
      });
    });

    test('passes configuration through', () => {
      const processor = new LambdaFunctionProcessor(lambdaFunction, {
        bufferInterval: cdk.Duration.minutes(10),
        bufferSize: cdk.Size.mebibytes(64),
        retries: 5,
      });

      const processorConfig = processor.bind(deliveryStream);

      expect(stack.resolve(processorConfig)).toMatchObject({
        bufferInterval: cdk.Duration.minutes(10),
        bufferSize: cdk.Size.mebibytes(64),
        retries: 5,
      });
    });
  });
});
