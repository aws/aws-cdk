import { Role } from '../../aws-iam';
import { App, Aws, Stack } from '../../core';
import { CrossRegionInferenceProfile } from '../lib';

describe('CrossRegionInferenceProfile', () => {
  const profile = CrossRegionInferenceProfile.EU_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0;

  test('grantInvoke', () => {
    // GIVEN
    const region = 'eu-west-1';
    const stack = new Stack(new App(), 'Stack', { env: { region } });

    // WHEN
    const grant = profile.grantInvoke(
      region,
      Role.fromRoleArn(stack, 'Role', `arn:aws:iam::${Aws.ACCOUNT_ID}:role/TestRole`),
    );

    // THEN
    expect(grant.success).toBe(true);
    const [principalStatement] = grant.principalStatements;
    expect(principalStatement.actions).toEqual(['bedrock:InvokeModel']);
    expect(principalStatement.resources).toEqual(
      expect.arrayContaining([
        `arn:${Aws.PARTITION}:bedrock:${region}:${Aws.ACCOUNT_ID}:inference-profile/eu.anthropic.claude-3-5-sonnet-20240620-v1:0`,
        `arn:${Aws.PARTITION}:bedrock:eu-central-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0`,
        `arn:${Aws.PARTITION}:bedrock:eu-west-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0`,
        `arn:${Aws.PARTITION}:bedrock:eu-west-3::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0`,
      ]),
    );
  });

  test('grantInvoke in unsupported region', () => {
    // GIVEN
    const region = 'unsupported-region';
    const stack = new Stack(new App(), 'Stack', { env: { region } });

    // WHEN
    expect(() =>
      profile.grantInvoke(region, Role.fromRoleArn(stack, 'Role', `arn:aws:iam::${Aws.ACCOUNT_ID}:role/TestRole`)),
    ).toThrow(`Cross region inference profile ${profile.profile.profileId} is only available in ${profile.regions}`);
  });
});

