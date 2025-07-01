import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as ecs from '../lib';

describe('amis', () => {
  test.each([
    [ecs.BottlerocketEcsVariant.AWS_ECS_1, 'SsmParameterValueawsservicebottlerocketawsecs1x8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_1_NVIDIA, 'SsmParameterValueawsservicebottlerocketawsecs1nvidiax8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_2, 'SsmParameterValueawsservicebottlerocketawsecs2x8664'],
    [ecs.BottlerocketEcsVariant.AWS_ECS_2_NVIDIA, 'SsmParameterValueawsservicebottlerocketawsecs2nvidiax8664'],
  ])('BottleRocketImage with %s variant', (variant, ssmKey) => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    new ecs.BottleRocketImage({
      variant,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith(ssmKey) && (v as any).Default.includes(`/bottlerocket/${variant}/x86_64/`),
    )).toEqual(true);
  });
  test.each([
    [ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.NEURON), '/aws/service/ecs/optimized-ami/amazon-linux-2/inf/recommended/image_id'],
    [ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.NEURON), '/aws/service/ecs/optimized-ami/amazon-linux-2023/neuron/recommended/image_id'],
  ])('Neuron AMI SSM param', (func, path) => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    // WHEN
    const image = func.getImage(stack);
    const template = Template.fromStack(stack);
    const paramters = template.findParameters(stack.resolve(image.imageId).Ref);
    const imageParameter = Object.entries(paramters)[0][1];
    expect(imageParameter.Default).toBe(path);
  });
});
