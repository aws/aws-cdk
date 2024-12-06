import { Aws } from '../../lib';
import { translateAssetTokenToCfnToken, translateCfnTokenToAssetToken } from '../../lib/helpers-internal';

describe('translations between token kinds', () => {
  const CfnTokenArn = `arn:${Aws.PARTITION}:resource:${Aws.REGION}:${Aws.ACCOUNT_ID}:name`;
  const AssetTokenArn = 'arn:${AWS::Partition}:resource:${AWS::Region}:${AWS::AccountId}:name';

  test('translateAssetTokenToCfnToken', () => {
    expect(translateAssetTokenToCfnToken(AssetTokenArn)).toEqual(CfnTokenArn);
  });

  test('translateCfnTokenToAssetToken', () => {
    expect(translateCfnTokenToAssetToken(CfnTokenArn)).toEqual(AssetTokenArn);
  });
});
