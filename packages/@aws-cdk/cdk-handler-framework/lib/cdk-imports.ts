import { ExternalModule, Type } from '@cdklabs/typewriter';

class ConstructsModule extends ExternalModule {
  public readonly Construct = Type.fromName(this, 'Construct');
  public readonly IConstruct = Type.fromName(this, 'IConstruct');

  public constructor() {
    super('constructs');
  }
}

class CdkHandlerModule extends ExternalModule {
  public readonly CdkHandler = Type.fromName(this, 'CdkHandler');

  public constructor() {
    super('../../handler-framework/lib/cdk-handler');
  }
}

class CdkFunctionModule extends ExternalModule {
  public readonly CdkFunction = Type.fromName(this, 'CdkFunction');

  public constructor() {
    super('../../handler-framework/lib/cdk-function');
  }
}

class CdkSingletonFunctionModule extends ExternalModule {
  public readonly CdkSingletonFunction = Type.fromName(this, 'CdkSingletonFunction');

  public constructor() {
    super('../../handler-framework/lib/cdk-singleton-function');
  }
}

export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CDK_HANDLER_MODULE = new CdkHandlerModule();
export const CDK_FUNCTION_MODULE = new CdkFunctionModule();
export const CDK_SINGLETON_FUNCTION_MODULE = new CdkSingletonFunctionModule();
