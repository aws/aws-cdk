import * as path from 'path';
import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import { Size } from '../../core';
import * as lambda from '../lib';

const dockerLambdaHandlerPath = path.join(__dirname, 'docker-lambda-handler');

describe('accelerator config', () => {
  describe('synthesis', () => {
    test('produces correct CFN output when configured with capacity provider', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });
      capacityProvider.addFunction(fn);

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        AcceleratorConfig: {
          AcceleratorMemorySize: 16,
        },
      });
    });
  });

  describe('eager validation', () => {
    test.each([
      [
        'memorySize below minimum (1024)',
        { memorySize: 1024 },
        /acceleratorConfig requires memorySize >= 2048 MiB, got 1024/,
      ],
      [
        'memorySize undefined (default 128 MiB)',
        { memorySize: undefined },
        /acceleratorConfig requires explicit memorySize >= 2048 MiB, but memorySize is not set/,
      ],
      [
        'non-Image runtime (Zip package type)',
        { runtime: lambda.Runtime.NODEJS_LATEST, code: new lambda.InlineCode('foo'), handler: 'index.handler' },
        /acceleratorConfig is not supported for non-container image functions/,
      ],
      [
        'ARM_64 architecture',
        { architecture: lambda.Architecture.ARM_64 },
        /acceleratorConfig is only supported for x86_64 functions/,
      ],
      [
        'custom arm64 architecture (guard compares on name, not identity)',
        { architecture: lambda.Architecture.custom('arm64', 'linux/arm64') },
        /acceleratorConfig is only supported for x86_64 functions/,
      ],
    ])('throws for %s', (_, overrides, expectedError) => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');

      expect(() => new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
        ...overrides,
      })).toThrow(expectedError);
    });

    test('passes token values through to the template without validating them', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });
      const tokenMemSize = cdk.Token.asNumber(cdk.Fn.ref('AccelMemParam'));
      const tokenMemorySize = cdk.Token.asNumber(cdk.Fn.ref('MemSizeParam'));

      // Token accelerator memory size via .of()
      const fn1 = new lambda.Function(stack, 'Fn1', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.of(tokenMemSize) },
      });
      capacityProvider.addFunction(fn1);

      // Token memorySize — skips the 2048 check
      const fn2 = new lambda.Function(stack, 'Fn2', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: tokenMemorySize,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });
      capacityProvider.addFunction(fn2);

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Lambda::Function', {
        AcceleratorConfig: { AcceleratorMemorySize: { Ref: 'AccelMemParam' } },
      });
      template.hasResourceProperties('AWS::Lambda::Function', {
        MemorySize: { Ref: 'MemSizeParam' },
        AcceleratorConfig: { AcceleratorMemorySize: 16 },
      });
    });

    test('accepts an accelerator memory size supplied via .of()', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      // .of() is an escape hatch for service-supported values; it synthesizes and the service
      // enforces the value at deploy time. Use a supported size so the synthesized value is valid.
      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.of(24) },
      });
      capacityProvider.addFunction(fn);

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        AcceleratorConfig: { AcceleratorMemorySize: 24 },
      });
    });

    test.each([
      ['zero', 0],
      ['negative', -8],
      ['non-integer', 12.5],
    ])('AcceleratorMemorySize.of() rejects a %s value', (_, value) => {
      expect(() => lambda.AcceleratorMemorySize.of(value))
        .toThrow(/acceleratorMemorySize must be a positive integer number of GiB/);
    });

    test('AcceleratorMemorySize.of() accepts an unresolved token', () => {
      const tokenSize = cdk.Token.asNumber(cdk.Fn.ref('AccelMemParam'));
      expect(() => lambda.AcceleratorMemorySize.of(tokenSize)).not.toThrow();
    });

    test.each([
      [3, lambda.AcceleratorMemorySize.GIB_3],
      [6, lambda.AcceleratorMemorySize.GIB_6],
      [12, lambda.AcceleratorMemorySize.GIB_12],
      [16, lambda.AcceleratorMemorySize.GIB_16],
      [24, lambda.AcceleratorMemorySize.GIB_24],
      [48, lambda.AcceleratorMemorySize.GIB_48],
    ])('the %d GiB AcceleratorMemorySize constant renders the matching number', (expected, acceleratorMemorySize) => {
      expect(acceleratorMemorySize.gibibytes).toBe(expected);
    });
  });

  describe('ephemeral storage', () => {
    test('allows up to 32768 MB when acceleratorConfig is set', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
        ephemeralStorageSize: Size.mebibytes(32768),
      });
      capacityProvider.addFunction(fn);

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        EphemeralStorage: { Size: 32768 },
      });
    });

    test.each([
      [
        'exceeds 32768 MB with acceleratorConfig',
        { acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 }, ephemeralStorageSize: Size.mebibytes(32769) },
        /Ephemeral storage size must be between 512 and 32768 MB/,
      ],
      [
        'exceeds 10240 MB without acceleratorConfig',
        { runtime: lambda.Runtime.NODEJS_LATEST, code: new lambda.InlineCode('foo'), handler: 'index.handler', acceleratorConfig: undefined, ephemeralStorageSize: Size.mebibytes(10241) },
        /Ephemeral storage size must be between 512 and 10240 MB/,
      ],
    ])('throws when ephemeralStorageSize %s', (_, overrides, expectedError) => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');

      expect(() => new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        ...overrides,
      })).toThrow(expectedError);
    });

    test('reports the accelerator disqualifier, not the elevated ceiling, when the config does not qualify', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');

      // ARM_64 disqualifies the function from an accelerator, so it never gets the 32 GiB ceiling.
      // The first error must therefore be the architecture, not an ephemeral-storage message quoting
      // a 32768 limit this function is not entitled to.
      expect(() => new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        architecture: lambda.Architecture.ARM_64,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
        ephemeralStorageSize: Size.mebibytes(40000),
      })).toThrow(/acceleratorConfig is only supported for x86_64 functions/);
    });
  });

  describe('deferred validation', () => {
    test('fails when no capacity provider is attached', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });

      const errors = fn.node.validate();
      expect(errors).toEqual([
        expect.stringContaining('acceleratorConfig requires a CapacityProvider'),
      ]);
      // The message must name both supported typed attachment paths
      expect(errors[0]).toContain('capacityProvider.addFunction(fn)');
      expect(errors[0]).toContain('cfnFunction.capacityProviderConfig');
    });

    test('passes when a capacity provider is attached via the L1 capacityProviderConfig escape hatch', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });

      // Wire the capacity provider by assigning the typed L1 property directly, rather than
      // CapacityProvider.addFunction(). The deferred validation must accept this path.
      // (An addPropertyOverride('CapacityProviderConfig', ...) is NOT accepted -- raw overrides are
      // merged at resolve time, after node validation runs, so they are invisible here.)
      (fn.node.defaultChild as lambda.CfnFunction).capacityProviderConfig = {
        lambdaManagedInstancesCapacityProviderConfig: {
          capacityProviderArn: 'arn:aws:lambda:us-east-1:123456789012:capacity-provider/cp',
        },
      };

      expect(fn.node.validate()).toEqual([]);
    });

    test('passes when a capacity provider is attached via capacityProvider.addFunction()', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });

      // Attachment is only via the provider's addFunction() entry point.
      capacityProvider.addFunction(fn);

      expect(fn.node.validate()).toEqual([]);

      // addFunction() renders the L1 capacityProviderConfig from the provider's ARN.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        AcceleratorConfig: { AcceleratorMemorySize: 16 },
        CapacityProviderConfig: {
          LambdaManagedInstancesCapacityProviderConfig: {
            CapacityProviderArn: stack.resolve(capacityProvider.capacityProviderArn),
          },
        },
      });
    });

    test('last write wins when a second, different capacity provider attaches the function', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider1 = new lambda.CapacityProvider(stack, 'CP1', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });
      const capacityProvider2 = new lambda.CapacityProvider(stack, 'CP2', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });

      capacityProvider1.addFunction(fn);

      // Attaching a second, different provider does not throw. addFunction() overwrites the L1
      // capacityProviderConfig on every call, so the last provider to attach is the one that
      // renders and the one validation sees.
      expect(() => capacityProvider2.addFunction(fn)).not.toThrow();
      expect(fn.node.validate()).toEqual([]);

      // The second attachment is the one that renders.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        AcceleratorConfig: { AcceleratorMemorySize: 16 },
        CapacityProviderConfig: {
          LambdaManagedInstancesCapacityProviderConfig: {
            CapacityProviderArn: stack.resolve(capacityProvider2.capacityProviderArn),
          },
        },
      });
    });

    test('is idempotent when the same capacity provider is attached twice via addFunction()', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack');
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const securityGroup = new ec2.SecurityGroup(stack, 'SG', { vpc });
      const capacityProvider = new lambda.CapacityProvider(stack, 'CP', {
        subnets: vpc.privateSubnets,
        securityGroups: [securityGroup],
      });

      const fn = new lambda.Function(stack, 'Lambda', {
        code: lambda.Code.fromAssetImage(dockerLambdaHandlerPath),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        memorySize: 2048,
        acceleratorConfig: { acceleratorMemorySize: lambda.AcceleratorMemorySize.GIB_16 },
      });

      capacityProvider.addFunction(fn);

      // Re-attaching the SAME provider (e.g. to pass per-function options) must not throw.
      expect(() => capacityProvider.addFunction(fn)).not.toThrow();
      expect(fn.node.validate()).toEqual([]);
    });
  });
});
