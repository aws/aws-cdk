import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as sagemaker from '../lib';

describe('When validating stack containing an EndpointConfig', () => {
  test('with more than 10 production variants, an error is recorded', () => {
    // GIVEN
    const stack = new cdk.Stack();
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
    const errors = cdk.ConstructNode.validate(stack.node);

    // THEN
    expect(errors.map(e => e.message)).toEqual(["Can\'t have more than 10 Production Variants"]);
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

  test('with an unsupported instance type, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () =>
      endpointConfig.addInstanceProductionVariant({
        variantName: 'new-variant',
        model,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.ARM1, ec2.InstanceSize.XLARGE),
      });

    // THEN
    expect(when).toThrow(/Invalid Production Variant Props: Invalid instance type for a SageMaker Endpoint Production Variant: a1.xlarge/);
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
    const variant = endpointConfig.findInstanceProductionVariant('variant');

    // THEN
    expect(variant.variantName).toEqual('variant');
  });

  test('that does not exist, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });

    // WHEN
    const when = () => endpointConfig.findInstanceProductionVariant('missing-variant');

    // THEN
    expect(when).toThrow(/No variant with name: 'missing-variant'/);
  });
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
