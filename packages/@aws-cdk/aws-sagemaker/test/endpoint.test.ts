import * as cdk from '@aws-cdk/core';
import * as sagemaker from '../lib';

describe('When searching an Endpoint for a production variant', () => {
  test('that exists, the variant is returned', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

    // WHEN
    const variant = endpoint.findInstanceProductionVariant('variant');

    // THEN
    expect(variant.variantName).toEqual('variant');
  });

  test('that does not exist, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

    // WHEN
    const when = () => endpoint.findInstanceProductionVariant('missing-variant');

    // THEN
    expect(when).toThrow(/No variant with name: 'missing-variant'/);
  });

  test('from an imported IEndpointConfig, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const endpointConfig = sagemaker.EndpointConfig.fromEndpointConfigName(stack, 'EndpointConfig', 'MyEndpointConfig');
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

    // WHEN
    const when = () => endpoint.findInstanceProductionVariant('variant');

    // THEN
    expect(when).toThrow(/Production variant lookup is not supported for an imported IEndpointConfig/);
  });
});

describe('When fetching production variants from an Endpoint', () => {
  test('with one production variant, the variant is returned', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

    // WHEN
    const variants: sagemaker.IEndpointInstanceProductionVariant[] = endpoint.instanceProductionVariants;

    // THEN
    expect(variants.length).toEqual(1);
    expect(variants[0].variantName).toEqual('variant');
  });

  test('with an imported IEndpointConfig, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const endpointConfig = sagemaker.EndpointConfig.fromEndpointConfigName(stack, 'EndpointConfig', 'MyEndpointConfig');
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });

    // WHEN
    const when = () => endpoint.instanceProductionVariants;

    // THEN
    expect(when).toThrow(/Production variant lookup is not supported for an imported IEndpointConfig/);
  });
});

describe('When importing an endpoint by ARN, the name is determined correctly', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const endpoint = sagemaker.Endpoint.fromEndpointArn(stack, 'Endpoint', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint/my-name');

  // THEN
  expect(endpoint.endpointName).toEqual('my-name');
});

describe('When importing an endpoint by name, the ARN is constructed correctly', () => {
  // GIVEN
  const stack = new cdk.Stack(undefined, undefined, {
    env:
      {
        region: 'us-west-2',
        account: '123456789012',
      },
  });

  // WHEN
  const endpoint = sagemaker.Endpoint.fromEndpointName(stack, 'Endpoint', 'my-name');

  // THEN
  expect(endpoint.endpointArn).toMatch(/arn:.+:sagemaker:us-west-2:123456789012:endpoint\/my-name/);
});

describe('When sharing an endpoint config from an origin stack with a destination stack', () => {
  describe('which represents an owned EndpointConfig instance', () => {
    test('across stack account boundaries, synthesis fails', () => {
      // GIVEN
      const app = new cdk.App();
      const originStack = new cdk.Stack(app, 'OriginStack', {
        env:
          {
            region: 'us-west-2',
            account: '123456789012',
          },
      });
      const originStackEndpointConfig = new sagemaker.EndpointConfig(originStack, 'MyEndpointConfig', {
        endpointConfigName: 'explicit-name',
        instanceProductionVariants: [{
          variantName: 'my-variant',
          model: sagemaker.Model.fromModelName(originStack, 'MyModel', 'my-model'),
        }],
      });
      const destinationStack = new cdk.Stack(app, 'DestinationStack', {
        env:
          {
            region: 'us-west-2',
            account: '234567890123',
          },
      });

      // WHEN
      const when = () =>
        new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
          endpointConfig: originStackEndpointConfig,
        });

      // THEN
      expect(when).toThrow(/Cannot use endpoint configuration in account 123456789012 for endpoint in account 234567890123/);
    });

    test('across stack region boundaries, synthesis fails', () => {
      // GIVEN
      const app = new cdk.App();
      const originStack = new cdk.Stack(app, 'OriginStack', {
        env:
          {
            region: 'us-west-2',
            account: '123456789012',
          },
      });
      const originStackEndpointConfig = new sagemaker.EndpointConfig(originStack, 'MyEndpointConfig', {
        endpointConfigName: 'explicit-name',
        instanceProductionVariants: [{
          variantName: 'my-variant',
          model: sagemaker.Model.fromModelName(originStack, 'MyModel', 'my-model'),
        }],
      });
      const destinationStack = new cdk.Stack(app, 'DestinationStack', {
        env:
          {
            region: 'us-east-1',
            account: '123456789012',
          },
      });

      // WHEN
      const when = () =>
        new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
          endpointConfig: originStackEndpointConfig,
        });

      // THEN
      expect(when).toThrow(/Cannot use endpoint configuration in region us-west-2 for endpoint in region us-east-1/);
    });
  });

  describe('which represents an unowned IEndpointConfig instance', () => {
    describe('imported by name', () => {
      test('across stack account boundaries, synthesis fails', () => {
        // GIVEN
        const app = new cdk.App();
        const originStack = new cdk.Stack(app, 'OriginStack', {
          env:
            {
              region: 'us-west-2',
              account: '123456789012',
            },
        });
        const originStackEndpointConfig = sagemaker.EndpointConfig.fromEndpointConfigName(originStack, 'MyEndpointConfig', 'explicit-name');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-west-2',
              account: '234567890123',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
            endpointConfig: originStackEndpointConfig,
          });

        // THEN
        expect(when).toThrow(/Cannot use endpoint configuration in account 123456789012 for endpoint in account 234567890123/);
      });

      test('across stack region boundaries, synthesis fails', () => {
        // GIVEN
        const app = new cdk.App();
        const originStack = new cdk.Stack(app, 'OriginStack', {
          env:
            {
              region: 'us-west-2',
              account: '123456789012',
            },
        });
        const originStackEndpointConfig = sagemaker.EndpointConfig.fromEndpointConfigName(originStack, 'MyEndpointConfig', 'explicit-name');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-east-1',
              account: '123456789012',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
            endpointConfig: originStackEndpointConfig,
          });

        // THEN
        expect(when).toThrow(/Cannot use endpoint configuration in region us-west-2 for endpoint in region us-east-1/);
      });
    });

    describe('imported by ARN', () => {
      test('in a different account than both stacks, synthesis fails', () => {
        // GIVEN
        const app = new cdk.App();
        const originStack = new cdk.Stack(app, 'OriginStack', {
          env:
            {
              region: 'us-west-2',
              account: '234567890123',
            },
        });
        const originStackEndpointConfig = sagemaker.EndpointConfig.fromEndpointConfigArn(originStack, 'MyEndpointConfig', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint/explicit-name');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-west-2',
              account: '234567890123',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
            endpointConfig: originStackEndpointConfig,
          });

        // THEN
        expect(when).toThrow(/Cannot use endpoint configuration in account 123456789012 for endpoint in account 234567890123/);
      });

      test('in a different region than both stacks, synthesis fails', () => {
        // GIVEN
        const app = new cdk.App();
        const originStack = new cdk.Stack(app, 'OriginStack', {
          env:
            {
              region: 'us-east-1',
              account: '123456789012',
            },
        });
        const originStackEndpointConfig = sagemaker.EndpointConfig.fromEndpointConfigArn(originStack, 'MyEndpointConfig', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint/explicit-name');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-east-1',
              account: '123456789012',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.Endpoint(destinationStack, 'MyEndpoint', {
            endpointConfig: originStackEndpointConfig,
          });

        // THEN
        expect(when).toThrow(/Cannot use endpoint configuration in region us-west-2 for endpoint in region us-east-1/);
      });
    });
  });
});

describe('When auto-scaling a production variant\'s instance count', () => {
  test('with minimum capacity greater than initial instance count, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');

    // WHEN
    const when = () => variant.autoScaleInstanceCount({
      minCapacity: 2,
      maxCapacity: 3,
    });

    // THEN
    expect(when).toThrow(/minCapacity cannot be greater than initial instance count: 1/);
  });

  test('with maximum capacity less than initial instance count, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model, initialInstanceCount: 2 }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');

    // WHEN
    const when = () => variant.autoScaleInstanceCount({ maxCapacity: 1 });

    // THEN
    expect(when).toThrow(/maxCapacity cannot be less than initial instance count: 2/);
  });

  test('with burstable instance type, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
        instanceType: sagemaker.InstanceType.T2_MEDIUM,
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');

    // WHEN
    const when = () => variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // THEN
    expect(when).toThrow(/AutoScaling not supported for burstable instance types like ml.t2.medium/);
  });

  test('which already has auto-scaling enabled, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
        instanceType: sagemaker.InstanceType.M5_LARGE,
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');
    variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // WHEN
    const when = () => variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // THEN
    expect(when).toThrow(/AutoScaling of task count already enabled for this service/);
  });

  test('with a safety factor of zero, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
        initialInstanceCount: 2,
        instanceType: sagemaker.InstanceType.M5_LARGE,
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');
    const instanceCount = variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // WHEN
    const when = () =>
      instanceCount.scaleOnInvocations('LimitRPS', {
        maxRequestsPerSecond: 30,
        safetyFactor: 0,
      });

    // THEN
    expect(when).toThrow(/Safety factor \(0\) must be greater than 0.0 and less than or equal 1\.0/);
  });

  test('with a safety factor greater than one, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
        initialInstanceCount: 2,
        instanceType: sagemaker.InstanceType.M5_LARGE,
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findInstanceProductionVariant('variant');
    const instanceCount = variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // WHEN
    const when = () =>
      instanceCount.scaleOnInvocations('LimitRPS', {
        maxRequestsPerSecond: 30,
        safetyFactor: 1.1,
      });

    // THEN
    expect(when).toThrow(/Safety factor \(1\.1\) must be greater than 0.0 and less than or equal 1\.0/);
  });
});
