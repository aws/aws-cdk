import { Template } from '../../assertions';
import { testFixtureNoVpc } from '../../aws-eks/test/util';
import * as cdk from '../../core';
import * as ecs from '../lib';

describe('amis', () => {
  test('BottleRocketImage with NVIDIA variant', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    // WHEN
    new ecs.BottleRocketImage({
      variant: ecs.BottlerocketEcsVariant.AWS_ECS_1_NVIDIA,
    }).getImage(stack);

    /// THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketawsecs1nvidiax8664') &&
          (v as any).Default.includes('/bottlerocket/aws-ecs-1-nvidia/x86_64/'),
    )).toEqual(true);
  });
});
