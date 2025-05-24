import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as ecs from '../lib';

describe('amis', () => {
  test.each([
    [
      ecs.BottlerocketEcsVariant.AWS_ECS_1,
      'SsmParameterValueawsservicebottlerocketawsecs1x8664',
    ],
    [
      ecs.BottlerocketEcsVariant.AWS_ECS_1_NVIDIA,
      'SsmParameterValueawsservicebottlerocketawsecs1nvidiax8664',
    ],
    [
      ecs.BottlerocketEcsVariant.AWS_ECS_2,
      'SsmParameterValueawsservicebottlerocketawsecs2x8664',
    ],
    [
      ecs.BottlerocketEcsVariant.AWS_ECS_2_NVIDIA,
      'SsmParameterValueawsservicebottlerocketawsecs2nvidiax8664',
    ],
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
    [ecs.WindowsOptimizedVersion.SERVER_2022, '2022', 'Full'],
    [ecs.WindowsOptimizedVersion.SERVER_2019, '2019', 'Full'],
    [ecs.WindowsOptimizedVersion.SERVER_2016, '2016', 'Full'],
  ])(
    'Windows Server variants with %s',
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

  test.each([
    [ecs.WindowsOptimizedCoreVersion.SERVER_2022_CORE, '2022', 'Core'],
    [ecs.WindowsOptimizedCoreVersion.SERVER_2019_CORE, '2019', 'Core'],
  ])(
    'Windows Server Core variants with %s',
    (coreVersion, baseVersion, editionType) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);

      // WHEN
      ecs.EcsOptimizedImage.windowsCore(coreVersion).getImage(stack);

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

  // Testing incompatible combinations using the deprecated EcsOptimizedAmi class
  // since we can't access the private constructor of EcsOptimizedImage directly
  test('Error when specifying both windowsVersion and windowsCoreVersion', () => {
    // WHEN/THEN - using the deprecated class for testing validation
    expect(() => {
      new ecs.EcsOptimizedAmi({
        windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
        windowsCoreVersion: ecs.WindowsOptimizedCoreVersion.SERVER_2019_CORE,
      });
    }).toThrow(/Cannot specify both windowsVersion and windowsCoreVersion/);
  });

  test('Error when specifying Windows with special hardware types', () => {
    // WHEN/THEN - using the deprecated class for testing validation
    expect(() => {
      new ecs.EcsOptimizedAmi({
        windowsVersion: ecs.WindowsOptimizedVersion.SERVER_2019,
        hardwareType: ecs.AmiHardwareType.GPU,
      });
    }).toThrow(/does not support special hardware type/);
  });

  test('Error when specifying Windows Core with special hardware types', () => {
    // WHEN/THEN - using the deprecated class for testing validation
    expect(() => {
      new ecs.EcsOptimizedAmi({
        windowsCoreVersion: ecs.WindowsOptimizedCoreVersion.SERVER_2019_CORE,
        hardwareType: ecs.AmiHardwareType.ARM,
      });
    }).toThrow(/does not support special hardware type/);
  });
});
