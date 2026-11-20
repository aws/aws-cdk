import { Annotations, Match, Template } from '../../assertions';
import * as ecr from '../../aws-ecr';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as lambda from '../lib';
import { FunctionRuntimeConfig } from '../lib/mixins';

const RUNTIME_ARN = 'arn:aws:lambda:us-east-1:123456789012:runtime/my-custom-python';
const CUSTOM = new lambda.Runtime('custom', lambda.RuntimeFamily.OTHER);

describe('Lambda Mixins', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let bucket: s3.IBucket;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
    bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'code-bucket');
  });

  function customFunction(id: string, runtime: lambda.Runtime = CUSTOM) {
    return new lambda.Function(stack, id, {
      code: lambda.Code.fromBucket(bucket, 'code.zip'),
      handler: 'index.handler',
      runtime,
    });
  }

  function cfnFunction(id: string, props: Partial<lambda.CfnFunctionProps> = {}) {
    return new lambda.CfnFunction(stack, id, {
      code: { s3Bucket: 'code-bucket', s3Key: 'code.zip' },
      role: 'arn:aws:iam::123456789012:role/fn',
      handler: 'index.handler',
      runtime: 'custom',
      ...props,
    });
  }

  describe('FunctionRuntimeConfig', () => {
    test('sets RuntimeConfig on a CfnFunction', () => {
      cfnFunction('Fn').with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'custom',
        RuntimeConfig: { RuntimeArn: RUNTIME_ARN, RuntimeAlias: 'stable' },
      });
    });

    test('can be applied retrospectively to a Function', () => {
      customFunction('Fn').with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'custom',
        RuntimeConfig: { RuntimeArn: RUNTIME_ARN, RuntimeAlias: 'stable' },
      });
    });

    test('does not apply to unrelated constructs', () => {
      new s3.CfnBucket(stack, 'OtherBucket')
        .with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        RuntimeConfig: Match.absent(),
      });
    });

    test('replaces an existing runtimeConfig', () => {
      cfnFunction('Fn', {
        runtimeConfig: { runtimeArn: 'arn:aws:lambda:us-east-1:123456789012:runtime/old', runtimeAlias: 'old' },
      }).with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        RuntimeConfig: Match.objectEquals({ RuntimeArn: RUNTIME_ARN, RuntimeAlias: 'stable' }),
      });
    });

    test('passes token values through', () => {
      const arn = new cdk.CfnParameter(stack, 'RuntimeArn').valueAsString;
      const alias = new cdk.CfnParameter(stack, 'RuntimeAlias').valueAsString;
      customFunction('Fn').with(new FunctionRuntimeConfig({ runtimeArn: arn, runtimeAlias: alias }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        RuntimeConfig: { RuntimeArn: { Ref: 'RuntimeArn' }, RuntimeAlias: { Ref: 'RuntimeAlias' } },
      });
    });

    test('fails when the function uses a Lambda-managed runtime', () => {
      customFunction('Fn', lambda.Runtime.PYTHON_3_12)
        .with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      expect(() => Template.fromStack(stack)).toThrow(/runtime must be 'custom' when runtimeConfig is set, got "python3.12"/);
    });

    test('fails on a container image function', () => {
      const repo = ecr.Repository.fromRepositoryName(stack, 'Repo', 'my-image');
      new lambda.DockerImageFunction(stack, 'Fn', { code: lambda.DockerImageCode.fromEcr(repo) })
        .with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      expect(() => Template.fromStack(stack)).toThrow(/runtimeConfig cannot be used with a container image function/);
    });

    test('fails when a runtime set after the mixin is applied is not custom', () => {
      const fn = cfnFunction('Fn');
      fn.with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));
      fn.runtime = 'nodejs22.x';

      expect(() => Template.fromStack(stack)).toThrow(/got "nodejs22.x"/);
    });

    test('fails on a CfnFunction with no runtime', () => {
      cfnFunction('Fn', { runtime: undefined })
        .with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      expect(() => Template.fromStack(stack)).toThrow(/runtime must be 'custom' when runtimeConfig is set/);
    });

    test('fails when the package type set after the mixin is applied is Image', () => {
      const fn = cfnFunction('Fn');
      fn.with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));
      fn.packageType = 'Image';

      expect(() => Template.fromStack(stack)).toThrow(/runtimeConfig cannot be used with a container image function/);
    });

    test('accepts a runtime that is only known at deployment', () => {
      const runtime = new cdk.CfnParameter(stack, 'Runtime').valueAsString;
      cfnFunction('Fn', { runtime }).with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Runtime: { Ref: 'Runtime' },
        RuntimeConfig: { RuntimeArn: RUNTIME_ARN, RuntimeAlias: 'stable' },
      });
    });

    test('publishes a new version when the runtime alias changes', () => {
      const versionLogicalId = (alias: string) => {
        const versionApp = new cdk.App();
        const versionStack = new cdk.Stack(versionApp, 'VersionStack');
        const fn = new lambda.Function(versionStack, 'Fn', {
          code: lambda.Code.fromBucket(s3.Bucket.fromBucketName(versionStack, 'Bucket', 'code-bucket'), 'code.zip'),
          handler: 'index.handler',
          runtime: CUSTOM,
        });
        fn.with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: alias }));
        fn.currentVersion;
        const resources = Template.fromStack(versionStack).findResources('AWS::Lambda::Version');
        return Object.keys(resources)[0];
      };

      expect(versionLogicalId('stable')).not.toEqual(versionLogicalId('latest'));
      expect(versionLogicalId('stable')).toEqual(versionLogicalId('stable'));
    });
  });

  // These checks come from Function and the custom runtime's defaults, not from the mixin.
  describe('custom runtime', () => {
    const MISSING_RUNTIME_CONFIG = Match.stringLikeRegexp('FunctionRuntimeConfig mixin.*customRuntimeRequiresRuntimeConfig');

    test('a Function without the mixin synthesizes with an info annotation pointing to the mixin', () => {
      // The service rejects this at deployment.
      customFunction('Fn');

      Annotations.fromStack(stack).hasInfo('/TestStack/Fn/Resource', MISSING_RUNTIME_CONFIG);
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Runtime: 'custom',
        RuntimeConfig: Match.absent(),
      });
    });

    test('no info annotation when the mixin is applied', () => {
      customFunction('Fn').with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Annotations.fromStack(stack).hasNoInfo('*', MISSING_RUNTIME_CONFIG);
    });

    test('the mixin only clears the info on the function it is applied to', () => {
      // The function without the mixin is created first, so its info already exists when the mixin is applied.
      customFunction('WithoutConfig');
      customFunction('WithConfig').with(new FunctionRuntimeConfig({ runtimeArn: RUNTIME_ARN, runtimeAlias: 'stable' }));

      Annotations.fromStack(stack).hasNoInfo('/TestStack/WithConfig/Resource', MISSING_RUNTIME_CONFIG);
      Annotations.fromStack(stack).hasInfo('/TestStack/WithoutConfig/Resource', MISSING_RUNTIME_CONFIG);
    });

    test('no info annotation for a Lambda-managed runtime', () => {
      customFunction('Fn', lambda.Runtime.PYTHON_3_12);

      Annotations.fromStack(stack).hasNoInfo('*', MISSING_RUNTIME_CONFIG);
    });

    test('the info annotation can be acknowledged', () => {
      const fn = customFunction('Fn');
      cdk.Annotations.of(fn).acknowledgeInfo('@aws-cdk/aws-lambda:customRuntimeRequiresRuntimeConfig');

      Annotations.fromStack(stack).hasNoInfo('*', MISSING_RUNTIME_CONFIG);
    });

    test('fails with inline code', () => {
      expect(() => new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromInline('exports.handler = () => {}'),
        handler: 'index.handler',
        runtime: CUSTOM,
      })).toThrow(/Inline source not allowed for custom/);
    });

    test('fails with SnapStart', () => {
      expect(() => new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromBucket(bucket, 'code.zip'),
        handler: 'index.handler',
        runtime: CUSTOM,
        snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
      })).toThrow(/SnapStart currently not supported by runtime custom/);
    });

    test('accepts a layer only if its compatibleRuntimes includes the custom runtime', () => {
      const fn = customFunction('Fn');
      const pythonLayer = new lambda.LayerVersion(stack, 'PythonLayer', {
        code: lambda.Code.fromBucket(bucket, 'python-layer.zip'),
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
      });
      const customLayer = new lambda.LayerVersion(stack, 'CustomLayer', {
        code: lambda.Code.fromBucket(bucket, 'custom-layer.zip'),
        compatibleRuntimes: [new lambda.Runtime('custom', lambda.RuntimeFamily.OTHER)],
      });

      expect(() => fn.addLayers(pythonLayer)).toThrow(/custom is not in \[python3\.12\]/);
      expect(() => fn.addLayers(customLayer)).not.toThrow();
    });
  });
});
