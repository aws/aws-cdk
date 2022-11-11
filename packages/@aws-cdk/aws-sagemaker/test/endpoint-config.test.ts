import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as sagemaker from '../lib';

describe('When synthesizing a stack containing an EndpointConfig', () => {
  test('with more than 10 production variants, an exception is thrown', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
      }],
    });
    for (let i = 0; i < 10; i++) {
      endpointConfig.addInstanceProductionVariant({ variantName: `variant-${i}`, model });
    }

    // WHEN
    const when = () => app.synth();

    // THEN
    expect(when).toThrow(/Can\'t have more than 10 production variants/);
  });

  test('with no production variants, an exception is thrown', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    new sagemaker.EndpointConfig(stack, 'EndpointConfig');

    // WHEN
    const when = () => app.synth();

    // THEN
    expect(when).toThrow(/Must configure at least 1 production variant/);
  });
});

describe('When adding a production variant to an EndpointConfig', () => {
  test('with too few instances specified, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () =>
      endpointConfig.addInstanceProductionVariant({
        variantName: 'new-variant',
        model,
        initialInstanceCount: 0,
      });

    // THEN
    expect(when).toThrow(/Invalid Production Variant Props: Must have at least one instance/);
  });

  test('with a negative weight, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () =>
      endpointConfig.addInstanceProductionVariant({
        variantName: 'new-variant',
        model,
        initialVariantWeight: -1,
      });

    // THEN
    expect(when).toThrow(/Invalid Production Variant Props: Cannot have negative variant weight/);
  });

  test('with a duplicate variant name, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () => endpointConfig.addInstanceProductionVariant({ variantName: 'variant', model });

    // THEN
    expect(when).toThrow(/There is already a Production Variant with name 'variant'/);
  });
});

describe('When searching an EndpointConfig for a production variant', () => {
  test('that exists, the variant is returned', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const variant = endpointConfig._findInstanceProductionVariant('variant');

    // THEN
    expect(variant.variantName).toEqual('variant');
  });

  test('that does not exist, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () => endpointConfig._findInstanceProductionVariant('missing-variant');

    // THEN
    expect(when).toThrow(/No variant with name: 'missing-variant'/);
  });
});

test('When importing an endpoint configuration by ARN, the name is determined correctly', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const endpointConfig = sagemaker.EndpointConfig.fromEndpointConfigArn(stack, 'EndpointConfig', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint-config/my-name');

  // THEN
  expect(endpointConfig.endpointConfigName).toEqual('my-name');
});

test('When importing an endpoint configuration by name, the ARN is constructed correctly', () => {
  // GIVEN
  const stack = new cdk.Stack(undefined, undefined, {
    env:
      {
        region: 'us-west-2',
        account: '123456789012',
      },
  });

  // WHEN
  const endpointConfig = sagemaker.EndpointConfig.fromEndpointConfigName(stack, 'EndpointConfig', 'my-name');

  // THEN
  expect(endpointConfig.endpointConfigArn).toMatch(/arn:.+:sagemaker:us-west-2:123456789012:endpoint-config\/my-name/);
});

describe('When sharing a model from an origin stack with a destination stack', () => {
  describe('which represents an owned Model instance', () => {
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
      const originStackModel = new sagemaker.Model(originStack, 'MyModel', {
        modelName: 'explicitly-named-model',
        containers: [{
          image: sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image')),
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
        new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
          instanceProductionVariants: [{
            variantName: 'my-variant',
            model: originStackModel,
          }],
        });

      // THEN
      expect(when).toThrow(/Cannot use model in account 123456789012 for endpoint configuration in account 234567890123/);
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
      const originStackModel = new sagemaker.Model(originStack, 'MyModel', {
        modelName: 'explicitly-named-model',
        containers: [{
          image: sagemaker.ContainerImage.fromAsset(path.join(__dirname, 'test-image')),
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
        new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
          instanceProductionVariants: [{
            variantName: 'my-variant',
            model: originStackModel,
          }],
        });

      // THEN
      expect(when).toThrow(/Cannot use model in region us-west-2 for endpoint configuration in region us-east-1/);
    });
  });

  describe('which represents an unowned IModel instance', () => {
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
        const originStackModel = sagemaker.Model.fromModelName(originStack, 'MyModel', 'explicitly-named-model');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-west-2',
              account: '234567890123',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
            instanceProductionVariants: [{
              variantName: 'my-variant',
              model: originStackModel,
            }],
          });

        // THEN
        expect(when).toThrow(/Cannot use model in account 123456789012 for endpoint configuration in account 234567890123/);
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
        const originStackModel = sagemaker.Model.fromModelName(originStack, 'MyModel', 'explicitly-named-model');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-east-1',
              account: '123456789012',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
            instanceProductionVariants: [{
              variantName: 'my-variant',
              model: originStackModel,
            }],
          });

        // THEN
        expect(when).toThrow(/Cannot use model in region us-west-2 for endpoint configuration in region us-east-1/);
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
        const originStackModel = sagemaker.Model.fromModelArn(originStack, 'MyModel', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint-config/explicitly-named-model');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-west-2',
              account: '234567890123',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
            instanceProductionVariants: [{
              variantName: 'my-variant',
              model: originStackModel,
            }],
          });

        // THEN
        expect(when).toThrow(/Cannot use model in account 123456789012 for endpoint configuration in account 234567890123/);
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
        const originStackModel = sagemaker.Model.fromModelArn(originStack, 'MyModel', 'arn:aws:sagemaker:us-west-2:123456789012:endpoint-config/explicitly-named-model');
        const destinationStack = new cdk.Stack(app, 'DestinationStack', {
          env:
            {
              region: 'us-east-1',
              account: '123456789012',
            },
        });

        // WHEN
        const when = () =>
          new sagemaker.EndpointConfig(destinationStack, 'MyEndpointConfig', {
            instanceProductionVariants: [{
              variantName: 'my-variant',
              model: originStackModel,
            }],
          });

        // THEN
        expect(when).toThrow(/Cannot use model in region us-west-2 for endpoint configuration in region us-east-1/);
      });
    });
  });
});
