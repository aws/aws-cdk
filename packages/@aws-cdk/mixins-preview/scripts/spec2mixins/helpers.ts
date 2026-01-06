import { Type, ExternalModule, $T, $E, expr, ThingSymbol } from '@cdklabs/typewriter';

class MixinsCore extends ExternalModule {
  public readonly IMixin = Type.fromName(this, 'IMixin');
  public readonly Mixin = Type.fromName(this, 'Mixin');
}

class MixinsCommon extends ExternalModule {
  public readonly PropertyMergeStrategy = $T(Type.fromName(this, 'PropertyMergeStrategy'));
  public readonly CfnPropertyMixinOptions = Type.fromName(this, 'CfnPropertyMixinOptions');
}

class MixinsUtils extends ExternalModule {
  public readonly deepMerge = $E(expr.sym(new ThingSymbol('deepMerge', this)));
  public readonly shallowAssign = $E(expr.sym(new ThingSymbol('shallowAssign', this)));
}

export const MIXINS_CORE = new MixinsCore('@aws-cdk/mixins-preview/core');
export const MIXINS_COMMON = new MixinsCommon('@aws-cdk/mixins-preview/mixins');
export const MIXINS_UTILS = new MixinsUtils('@aws-cdk/mixins-preview/util/property-mixins');
