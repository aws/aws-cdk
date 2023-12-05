/* eslint-disable import/no-extraneous-dependencies */
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
  public readonly CdkHandlerProps = Type.fromName(this, 'CdkHandlerProps');

  public constructor() {
    super('../../handler-framework/lib/cdk-handler');
  }
}

class CoreModule extends ExternalModule {
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public constructor() {
    super('../../core');
  }
}

class LambdaModule extends ExternalModule {
  public readonly Function = Type.fromName(this, 'Function');
  public readonly SingletonFunction = Type.fromName(this, 'SingletonFunction');
  public readonly FunctionOptions = Type.fromName(this, 'FunctionOptions');

  public constructor() {
    super('../../aws-lambda');
  }
}

export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CDK_HANDLER_MODULE = new CdkHandlerModule();
export const CORE_MODULE = new CoreModule();
export const LAMBDA_MODULE = new LambdaModule();
