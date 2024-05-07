/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, Type } from '@cdklabs/typewriter';

class PathModule extends ExternalModule {
  public constructor() {
    super('path');
  }
}

class ConstructsModule extends ExternalModule {
  public readonly Construct = Type.fromName(this, 'Construct');

  public constructor() {
    super('constructs');
  }
}

class CoreModule extends ExternalModule {
  public readonly Stack = Type.fromName(this, 'Stack');
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');
  public readonly FeatureFlags = Type.fromName(this, 'FeatureFlags');

  public constructor() {
    super('../../../core');
  }
}

class CoreInternalStack extends ExternalModule {
  public readonly Stack = Type.fromName(this, 'Stack');

  public constructor() {
    super('../../stack');
  }
}

class CoreInternalCustomResourceProvider extends ExternalModule {
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public constructor() {
    super('../../custom-resource-provider');
  }
}

class CoreInternalFeatureFlags extends ExternalModule {
  public readonly FeatureFlags = Type.fromName(this, 'FeatureFlags');

  public constructor() {
    super('../../feature-flags');
  }
}

class LambdaModule extends ExternalModule {
  public readonly Function = Type.fromName(this, 'Function');
  public readonly SingletonFunction = Type.fromName(this, 'SingletonFunction');
  public readonly FunctionOptions = Type.fromName(this, 'FunctionOptions');

  public constructor() {
    super('../../../aws-lambda');
  }
}

class CxApiModule extends ExternalModule {
  public readonly CustomResourceUseLatestNodeRuntime = Type.fromName(this, 'CustomResourceUseLatestNodeRuntime');

  public constructor() {
    super('../../../cx-api');
  }
}

class CoreInternalCxApiModule extends ExternalModule {
  public readonly CustomResourceUseLatestNodeRuntime = Type.fromName(this, 'CustomResourceUseLatestNodeRuntime');

  public constructor() {
    super('../../../../cx-api');
  }
}

export const PATH_MODULE = new PathModule();
export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CORE_MODULE = new CoreModule();
export const CORE_INTERNAL_STACK = new CoreInternalStack();
export const CORE_INTERNAL_CR_PROVIDER = new CoreInternalCustomResourceProvider();
export const CORE_INTERNAL_FEATURE_FLAGS = new CoreInternalFeatureFlags();
export const LAMBDA_MODULE = new LambdaModule();
export const CXAPI_MODULE = new CxApiModule();
export const CORE_INTERNAL_CXAPI_MODULE = new CoreInternalCxApiModule();
