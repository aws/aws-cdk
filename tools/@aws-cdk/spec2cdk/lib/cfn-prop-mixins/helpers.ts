import { Type, ExternalModule } from '@cdklabs/typewriter';

class MixinsCommon extends ExternalModule {
  public readonly CfnPropertyMixinOptions = Type.fromName(this, 'CfnPropertyMixinOptions');
}

export const MIXINS_COMMON = new MixinsCommon('@aws-cdk/mixins-preview/mixins');
