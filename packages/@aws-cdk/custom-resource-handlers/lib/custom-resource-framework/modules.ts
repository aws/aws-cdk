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
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public constructor() {
    super('../../../core');
  }
}

class Stack extends ExternalModule {
  public constructor() {
    super('../../lib/stack');
  }
}

class CustomResourceProviderBase extends ExternalModule {
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');

  public constructor() {
    super('../../lib/custom-resource-provider/custom-resource-provider-base');
  }
}

class CustomResourceProviderOptions extends ExternalModule {
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public constructor() {
    super('../../lib/custom-resource-provider/shared');
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

export const PATH_MODULE = new PathModule();
export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CORE_MODULE = new CoreModule();
export const LAMBDA_MODULE = new LambdaModule();

export const STACK = new Stack();
export const CUSTOM_RESOURCE_PROVIDER_BASE = new CustomResourceProviderBase();
export const CUSTOM_RESOURCE_PROVIDER_OPTIONS = new CustomResourceProviderOptions();
