import { Type, ExternalModule, $T } from '@cdklabs/typewriter';

class MixinsCommon extends ExternalModule {
  public readonly PropertyMergeStrategy = $T(Type.fromName(this, 'PropertyMergeStrategy'));
  public readonly IMergeStrategy = Type.fromName(this, 'IMergeStrategy');
  public readonly CfnPropertyMixinOptions = Type.fromName(this, 'CfnPropertyMixinOptions');
}

export const MIXINS_COMMON = new MixinsCommon('@aws-cdk/mixins-preview/mixins');
