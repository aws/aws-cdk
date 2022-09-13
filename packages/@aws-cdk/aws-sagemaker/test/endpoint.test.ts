import * as ec2 from '@aws-cdk/aws-ec2';
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
    const variant = endpoint.findProductionVariant('variant');

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
    const when = () => endpoint.findProductionVariant('missing-variant');

    // THEN
    expect(when).toThrow(/No variant with name: 'missing-variant'/);
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
    const variants: sagemaker.IEndpointProductionVariant[] = endpoint.productionVariants;

    // THEN
    expect(variants.length).toEqual(1);
    expect(variants[0].variantName).toEqual('variant');
  });
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

describe('When auto-scaling a production variant\'s instance count', () => {
  test('with minimum capacity greater than initial instance count, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', { instanceProductionVariants: [{ variantName: 'variant', model }] });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findProductionVariant('variant');

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
    const variant = endpoint.findProductionVariant('variant');

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
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MEDIUM),
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findProductionVariant('variant');

    // WHEN
    const when = () => variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // THEN
    expect(when).toThrow(/AutoScaling not supported for burstable instance types like t2.medium/);
  });

  test('which already has auto-scaling enabled, an exception is thrown', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const model = sagemaker.Model.fromModelName(stack, 'Model', 'model');
    const endpointConfig = new sagemaker.EndpointConfig(stack, 'EndpointConfig', {
      instanceProductionVariants: [{
        variantName: 'variant',
        model,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      }],
    });
    const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', { endpointConfig });
    const variant = endpoint.findProductionVariant('variant');
    variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // WHEN
    const when = () => variant.autoScaleInstanceCount({ maxCapacity: 3 });

    // THEN
    expect(when).toThrow(/AutoScaling of task count already enabled for this service/);
  });
});
