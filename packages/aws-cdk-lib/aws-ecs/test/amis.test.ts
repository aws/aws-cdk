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
    const parameters = assembly.getStackByName(stack.stackName).template
      .Parameters;
    expect(
      Object.entries(parameters).some(
        ([k, v]) =>
          k.startsWith(ssmKey) &&
          (v as any).Default.includes(`/bottlerocket/${variant}/x86_64/`),
      ),
    ).toEqual(true);
  });

  test.each([
    [ecs.WindowsOptimizedVersion.SERVER_2022_CORE, '2022', 'Core'],
    [ecs.WindowsOptimizedVersion.SERVER_2019_CORE, '2019', 'Core'],
  ])(
    'Windows Server Core variants with %s',
    (windowsVersion, baseVersion, editionType) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);

      // WHEN
      ecs.EcsOptimizedImage.windows(windowsVersion).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template
        .Parameters;
      expect(
        Object.entries(parameters).some(
          ([k, v]) =>
            k.startsWith('SsmParameterValue') &&
            (v as any).Default.includes(
              `/ami-windows-latest/Windows_Server-${baseVersion}-English-${editionType}-ECS_Optimized/`,
            ),
        ),
      ).toEqual(true);
    },
  );

  test('Amazon Linux 2 with kernel 5.10', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, {
      kernel: ecs.AmiLinuxKernelVersion.KERNEL_5_10,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template
      .Parameters;
    expect(
      Object.entries(parameters).some(
        ([k, v]) =>
          k.startsWith('SsmParameterValue') &&
          (v as any).Default.includes(
            '/ecs/optimized-ami/amazon-linux-2/kernel-5.10/',
          ),
      ),
    ).toEqual(true);
  });

  test('Amazon Linux 2 ARM with kernel 5.10', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM, {
      kernel: ecs.AmiLinuxKernelVersion.KERNEL_5_10,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template
      .Parameters;
    expect(
      Object.entries(parameters).some(
        ([k, v]) =>
          k.startsWith('SsmParameterValue') &&
          (v as any).Default.includes(
            '/ecs/optimized-ami/amazon-linux-2/kernel-5.10/arm64/',
          ),
      ),
    ).toEqual(true);
  });

  test('Amazon Linux 2 GPU with kernel 5.10', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.GPU, {
      kernel: ecs.AmiLinuxKernelVersion.KERNEL_5_10,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template
      .Parameters;
    expect(
      Object.entries(parameters).some(
        ([k, v]) =>
          k.startsWith('SsmParameterValue') &&
          (v as any).Default.includes(
            '/ecs/optimized-ami/amazon-linux-2/kernel-5.10/gpu/',
          ),
      ),
    ).toEqual(true);
  });

  test('Amazon Linux 2 Neuron with kernel 5.10', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.NEURON, {
      kernel: ecs.AmiLinuxKernelVersion.KERNEL_5_10,
    }).getImage(stack);

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template
      .Parameters;
    expect(
      Object.entries(parameters).some(
        ([k, v]) =>
          k.startsWith('SsmParameterValue') &&
          (v as any).Default.includes(
            '/ecs/optimized-ami/amazon-linux-2/kernel-5.10/inf/',
          ),
      ),
    ).toEqual(true);
  });
});
