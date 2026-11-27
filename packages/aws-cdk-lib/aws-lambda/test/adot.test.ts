import { Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
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
      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.V1_32_0_1.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-32-0:4',
      );
    });

    test('is added properly when using "LATEST" version', () => {
      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.LATEST.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-32-0:4',
      );
    });
  });

  describe('when the Python ADOT version is specified', () => {
    let fn: lambda.Function;

    beforeEach(() => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', { env: { region: 'us-west-2' } });
      const bucket = new s3.Bucket(stack, 'CodeBucket');
      fn = new lambda.Function(stack, 'Function', {
        code: lambda.Code.fromBucket(bucket, 'mock_key'),
        handler: 'index.handler',
        runtime: lambda.Runtime.PYTHON_3_11,
      });
    });

    test('is added properly when the region information is available at synthesis time', () => {
      const layerArn = lambda.AdotLambdaLayerPythonSdkVersion.V1_29_0.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-29-0:1',
      );
    });

    test('is added properly when using "LATEST" version', () => {
      const layerArn = lambda.AdotLambdaLayerPythonSdkVersion.LATEST.layerArn(fn.stack, fn.architecture);

      expect(layerArn).toEqual(
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-29-0:1',
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
        runtime: lambda.Runtime.NODEJS_LATEST,
        architecture: lambda.Architecture.ARM_64,
      });

      const layerArn = lambda.AdotLambdaLayerJavaSdkVersion.LATEST.layerArn(stack, fn.architecture);
      fn.stack.exportValue(layerArn, {
        name: 'LayerArn',
      });

      // THEN
      Template.fromStack(fn.stack).hasOutput('ExportLayerArn', {
        Value: {
          'Fn::Join': [
            '',
            [
              'arn:aws:lambda:',
              {
                Ref: 'AWS::Region',
              },
              ':901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-32-0:4',
            ],
          ],
        },
      });
    });
  });

  describe('AWS Lambda Layer for OpenTelemetry (Distro)', () => {
    test('resolves JavaScript distro layer ARN per region and wires Function with INSTRUMENT_HANDLER', () => {
      const app = new cdk.App();
      const usStack = new cdk.Stack(app, 'us-stack', { env: { region: 'us-east-1' } });
      new lambda.Function(usStack, 'AgentFn', {
        code: new lambda.InlineCode('exports.handler = async () => {};'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        adotInstrumentation: {
          layerVersion: lambda.AdotLayerVersion.fromJavaScriptDistroLayerVersion(
            lambda.AdotLambdaLayerJavaScriptDistroVersion.LATEST,
          ),
          execWrapper: lambda.AdotLambdaExecWrapper.INSTRUMENT_HANDLER,
        },
      });

      Template.fromStack(usStack).hasResourceProperties('AWS::Lambda::Function', {
        Layers: ['arn:aws:lambda:us-east-1:615299751070:layer:AWSOpenTelemetryDistroJs:18'],
        Environment: {
          Variables: {
            AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-instrument',
          },
        },
      });

      const optInStack = new cdk.Stack(app, 'optin-stack', { env: { region: 'ap-east-2' } });
      const optInFn = new lambda.Function(optInStack, 'OptInFn', {
        code: new lambda.InlineCode('exports.handler = async () => {};'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_22_X,
      });
      expect(
        lambda.AdotLambdaLayerJavaScriptDistroVersion.V0_15_0.layerArn(optInFn.stack, optInFn.architecture),
      ).toEqual('arn:aws:lambda:ap-east-2:412664885777:layer:AWSOpenTelemetryDistroJs:7');
    });

    test('resolves Python, Java, and .NET distro layer ARNs', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', { env: { region: 'us-west-2' } });

      expect(
        lambda.AdotLambdaLayerPythonDistroVersion.LATEST.layerArn(stack, lambda.Architecture.ARM_64),
      ).toEqual('arn:aws:lambda:us-west-2:615299751070:layer:AWSOpenTelemetryDistroPython:39');

      expect(
        lambda.AdotLambdaLayerJavaDistroVersion.LATEST.layerArn(stack, lambda.Architecture.X86_64),
      ).toEqual('arn:aws:lambda:us-west-2:615299751070:layer:AWSOpenTelemetryDistroJava:20');

      expect(
        lambda.AdotLambdaLayerDotNetDistroVersion.LATEST.layerArn(stack, lambda.Architecture.X86_64),
      ).toEqual('arn:aws:lambda:us-west-2:615299751070:layer:AWSOpenTelemetryDistroDotNet:15');
    });
  });
});
