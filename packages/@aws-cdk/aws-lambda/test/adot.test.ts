import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

describe('ADOT Lambda Layer', () => {

  describe('when the stack region is specified and supported', () => {

    let fn: lambda.Function;

    beforeEach(() => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', { env: { region: 'us-west-2' } });
      const bucket = new s3.Bucket(stack, 'CodeBucket');
      fn = new lambda.Function(stack, 'Function', {
        code: lambda.Code.fromBucket(bucket, 'mock_key'),
        handler: 'index.handler',
        runtime: lambda.Runtime.JAVA_11,
      });
    });

    test('is added properly when the region information is available at synthesis time', () => {
      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.V1_19_0.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      );
    });

    test('is added properly when using "LATEST" version', () => {
      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.LATEST.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-19-0:1',
      );
    });
  });

  describe('when the stack region is not supported', () => {
    test('throws error if the region is not supported', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', { env: { region: 'neverland' } });
      const bucket = new s3.Bucket(stack, 'CodeBucket');
      const fn = new lambda.Function(stack, 'Function', {
        code: lambda.Code.fromBucket(bucket, 'mock_key'),
        handler: 'index.handler',
        runtime: lambda.Runtime.JAVA_11,
      });

      expect(() => {
        lambda.AdotLayerVersion.fromJavaSdkLayerVersion(
          lambda.AdotLambdaLayerJavaSdkVersion.LATEST,
        )._bind(fn).arn;
      }).toThrow(/Could not find the ARN information for the ADOT Lambda Layer/);
    });
  });

  describe('when the stack is region agnostic', () => {
    test('is added properly', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'region-agnostic-stack');
      const fn = new lambda.Function(stack, 'Function', {
        code: new lambda.InlineCode('FooBar'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        architecture: lambda.Architecture.ARM_64,
      });

      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.LATEST.layerArn(stack, fn.architecture);
      fn.stack.exportValue(layerArn, {
        name: 'LayerArn',
      });

      // THEN
      Template.fromStack(fn.stack).hasOutput('ExportLayerArn', {
        Value: {
          'Fn::FindInMap': [
            'AdotlambdalayerMap',
            {
              Ref: 'AWS::Region',
            },
            'JAVAxSDKx1x19x0xarm64',
          ],
        },
      });
    });
  });
});
