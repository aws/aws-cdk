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

class HandlerFrameworkModule extends ExternalModule {
  public readonly RuntimeDeterminer = Type.fromName(this, 'RuntimeDeterminer');

  public constructor() {
    super('../../../handler-framework/lib/runtime-determiner');
  }
}

class CoreModule extends ExternalModule {
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public constructor() {
    super('../../../core');
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
export const HANDLER_FRAMEWORK_MODULE = new HandlerFrameworkModule();
export const CORE_MODULE = new CoreModule();
export const LAMBDA_MODULE = new LambdaModule();
