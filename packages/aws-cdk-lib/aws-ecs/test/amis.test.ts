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
    ['amazonLinux2023', (opts: any) => ecs.EcsOptimizedImage.amazonLinux2023(ecs.AmiHardwareType.STANDARD, opts)],
    ['amazonLinux2', (opts: any) => ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, opts)],
    ['amazonLinux', (opts: any) => ecs.EcsOptimizedImage.amazonLinux(opts)],
    ['windows', (opts: any) => ecs.EcsOptimizedImage.windows(ecs.WindowsOptimizedVersion.SERVER_2022, opts)],
  ])('EcsOptimizedImage %s accepts additionalCacheKey', (_, imageFactory) => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' }
    });
    
    // WHEN
    const image = imageFactory({ 
      cachedInContext: true, 
      additionalCacheKey: 'test-key' 
    });

    //THEN
    expect(() => image.getImage(stack)).not.toThrow();
  });
});
