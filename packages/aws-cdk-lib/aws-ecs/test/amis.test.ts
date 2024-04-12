import * as ec2 from '../../aws-ec2';
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

  describe('Amazon Linux 2', () => {

    test('Amazon Linux 2 with kernel', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);

      // WHEN
      ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, { kernel: ec2.AmazonLinux2Kernel.KERNEL_5_10 }).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceecsoptimizedamiamazonlinux2kernel510') && (v as any).Default.includes('/aws/service/ecs/optimized-ami/amazon-linux-2/kernel-5.10/recommended/image_id'),
      )).toEqual(true);

      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceecsoptimizedamiamazonlinux2kernel510') && (v as any).Default.includes(
          ec2.AmazonLinux2Kernel.KERNEL_5_10.toString(),
        ),
      )).toEqual(true);
    });

    test('Amazon Linux 2 without kernel', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);

      // WHEN
      ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceecsoptimizedamiamazonlinux2') && (v as any).Default.includes('/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id'),
      )).toEqual(true);
    });
  });

  describe('Amazon Linux', () => {
    test('Amazon Linux with kernel', () => {
      // GIVEN
      const app = new cdk.App();
      new cdk.Stack(app);

      // THEN
      expect(() =>
        ecs.EcsOptimizedImage.amazonLinux({
          kernel: ec2.AmazonLinux2Kernel.KERNEL_5_10,
        }),
      ).toThrow(/Kernel version can only be specified for Amazon Linux 2/);
    });
  });

  describe('Amazon Linux 2023', () => {
    test('Amazon Linux 2023 with kernel', () => {
      // GIVEN
      const app = new cdk.App();
      new cdk.Stack(app);

      // THEN
      expect(() =>
        ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD, {
          kernel: ec2.AmazonLinux2Kernel.KERNEL_5_10,
        }),
      ).toThrow(/Kernel version can only be specified for Amazon Linux 2/);
    });
  });
});
