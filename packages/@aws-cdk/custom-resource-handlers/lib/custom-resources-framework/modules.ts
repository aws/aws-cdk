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

class LambdaModule extends ExternalModule {
  public readonly Function = Type.fromName(this, 'Function');
  public readonly SingletonFunction = Type.fromName(this, 'SingletonFunction');
  public readonly FunctionOptions = Type.fromName(this, 'FunctionOptions');
  public readonly Runtime = Type.fromName(this, 'Runtime');
  public readonly RuntimeFamily = Type.fromName(this, 'RuntimeFamily');

  public constructor() {
    super('../../../aws-lambda');
  }
}

class RegionInfo extends ExternalModule {
  public readonly FactName = Type.fromName(this, 'FactName');

  public constructor() {
    super('../../../region-info');
  }
}

class CoreInternalRegionInfo extends ExternalModule {
  public readonly FactName = Type.fromName(this, 'FactName');

  public constructor() {
    super('../../../../region-info');
  }
}

export const PATH_MODULE = new PathModule();
export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CORE_MODULE = new CoreModule();
export const CORE_INTERNAL_STACK = new CoreInternalStack();
export const CORE_INTERNAL_CR_PROVIDER = new CoreInternalCustomResourceProvider();
export const LAMBDA_MODULE = new LambdaModule();
export const REGION_INFO = new RegionInfo();
export const CORE_INTERNAL_REGION_INFO = new CoreInternalRegionInfo();
