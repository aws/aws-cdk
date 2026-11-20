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
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-java-wrapper-amd64-ver-1-32-0:9',
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
        'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-python-amd64-ver-1-32-0:7',
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
      // The us-east-1 layer version differs from the other regions, so the ARN is
      // looked up from a mapping instead of being built from the region name.
      const template = Template.fromStack(fn.stack);
      template.hasOutput('ExportLayerArn', {
        Value: {
          'Fn::FindInMap': ['AdotlambdalayerMap', { Ref: 'AWS::Region' }, 'JAVAxSDKx1x32x0x2xarm64'],
        },
      });
      // Only us-east-1 has :10; every other region has :9 (see fact-tables.ts).
      const regions = [
        'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ca-central-1',
        'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'sa-east-1',
        'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
      ];
      const expected: { [region: string]: { [key: string]: string } } = {};
      for (const region of regions) {
        const layerVersion = region === 'us-east-1' ? 10 : 9;
        expected[region] = {
          JAVAxSDKx1x32x0x2xarm64: `arn:aws:lambda:${region}:901920570463:layer:aws-otel-java-wrapper-arm64-ver-1-32-0:${layerVersion}`,
        };
      }
      expect(template.toJSON().Mappings.AdotlambdalayerMap).toEqual(expected);
    });
  });

  describe('ADOT Collector v0.49.0 layer versions', () => {
    test.each([
      ['Java SDK', lambda.AdotLambdaLayerJavaSdkVersion.V1_32_0_2, 'us-west-2', lambda.Architecture.X86_64, 'aws-otel-java-wrapper-amd64-ver-1-32-0:9'],
      ['Java SDK', lambda.AdotLambdaLayerJavaSdkVersion.V1_32_0_2, 'us-east-1', lambda.Architecture.ARM_64, 'aws-otel-java-wrapper-arm64-ver-1-32-0:10'],
      ['Java auto-instrumentation', lambda.AdotLambdaLayerJavaAutoInstrumentationVersion.V1_32_0_2, 'eu-west-1', lambda.Architecture.ARM_64, 'aws-otel-java-agent-arm64-ver-1-32-0:9'],
      ['JavaScript SDK', lambda.AdotLambdaLayerJavaScriptSdkVersion.V1_30_2, 'ap-southeast-2', lambda.Architecture.X86_64, 'aws-otel-nodejs-amd64-ver-1-30-2:6'],
      ['Python SDK', lambda.AdotLambdaLayerPythonSdkVersion.V1_32_0, 'sa-east-1', lambda.Architecture.ARM_64, 'aws-otel-python-arm64-ver-1-32-0:7'],
      ['Generic', lambda.AdotLambdaLayerGenericVersion.V0_156_0, 'ca-central-1', lambda.Architecture.X86_64, 'aws-otel-collector-amd64-ver-0-156-0:4'],
    ])('%s layer resolves to the published ARN in %s', (_name, version, region, architecture, layer) => {
      const stack = new cdk.Stack(new cdk.App(), 'stack', { env: { region } });

      expect(version.layerArn(stack, architecture)).toEqual(`arn:aws:lambda:${region}:901920570463:layer:${layer}`);
    });

    test.each([
      ['Java SDK', 'x86_64', lambda.AdotLambdaLayerJavaSdkVersion.V1_32_0_2, 'aws-otel-java-wrapper-amd64-ver-1-32-0:9'],
      ['Java auto-instrumentation', 'x86_64', lambda.AdotLambdaLayerJavaAutoInstrumentationVersion.V1_32_0_2, 'aws-otel-java-agent-amd64-ver-1-32-0:9'],
      ['Java auto-instrumentation', 'arm64', lambda.AdotLambdaLayerJavaAutoInstrumentationVersion.V1_32_0_2, 'aws-otel-java-agent-arm64-ver-1-32-0:9'],
      ['JavaScript SDK', 'x86_64', lambda.AdotLambdaLayerJavaScriptSdkVersion.V1_30_2, 'aws-otel-nodejs-amd64-ver-1-30-2:6'],
      ['JavaScript SDK', 'arm64', lambda.AdotLambdaLayerJavaScriptSdkVersion.V1_30_2, 'aws-otel-nodejs-arm64-ver-1-30-2:6'],
      ['Python SDK', 'x86_64', lambda.AdotLambdaLayerPythonSdkVersion.V1_32_0, 'aws-otel-python-amd64-ver-1-32-0:7'],
      ['Python SDK', 'arm64', lambda.AdotLambdaLayerPythonSdkVersion.V1_32_0, 'aws-otel-python-arm64-ver-1-32-0:7'],
      ['Generic', 'x86_64', lambda.AdotLambdaLayerGenericVersion.V0_156_0, 'aws-otel-collector-amd64-ver-0-156-0:4'],
      ['Generic', 'arm64', lambda.AdotLambdaLayerGenericVersion.V0_156_0, 'aws-otel-collector-arm64-ver-0-156-0:4'],
    ])('%s %s layer has the same ARN in every region', (_name, arch, version, layer) => {
      // A single Fn::Join on AWS::Region (instead of a mapping) means all 16 regional ARNs match the pattern.
      const stack = new cdk.Stack(new cdk.App(), 'agnostic');
      const architecture = arch === 'arm64' ? lambda.Architecture.ARM_64 : lambda.Architecture.X86_64;

      expect(stack.resolve(version.layerArn(stack, architecture))).toEqual({
        'Fn::Join': ['', ['arn:aws:lambda:', { Ref: 'AWS::Region' }, `:901920570463:layer:${layer}`]],
      });
    });

    test.each([
      ['Java SDK', lambda.AdotLambdaLayerJavaSdkVersion.LATEST, lambda.AdotLambdaLayerJavaSdkVersion.V1_32_0_2],
      ['Java auto-instrumentation', lambda.AdotLambdaLayerJavaAutoInstrumentationVersion.LATEST, lambda.AdotLambdaLayerJavaAutoInstrumentationVersion.V1_32_0_2],
      ['JavaScript SDK', lambda.AdotLambdaLayerJavaScriptSdkVersion.LATEST, lambda.AdotLambdaLayerJavaScriptSdkVersion.V1_30_2],
      ['Python SDK', lambda.AdotLambdaLayerPythonSdkVersion.LATEST, lambda.AdotLambdaLayerPythonSdkVersion.V1_32_0],
      ['Generic', lambda.AdotLambdaLayerGenericVersion.LATEST, lambda.AdotLambdaLayerGenericVersion.V0_156_0],
    ])('%s LATEST points to the v0.49.0 collector layer', (_name, latest, expected) => {
      expect(latest).toBe(expected);
    });
  });
});
