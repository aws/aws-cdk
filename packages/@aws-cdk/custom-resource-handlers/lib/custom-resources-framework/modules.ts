/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, Type } from '@cdklabs/typewriter';
import { CallableExpr } from './callable-expr';

/**
 * A class representing an external module that can be imported into a target module.
 */
export abstract class ImportableModule extends ExternalModule {
  /**
   * The name to import all targets in the module as.
   */
  public abstract importAs: string;
}

class PathModule extends ImportableModule {
  public readonly join = CallableExpr.fromName(this, 'join');

  public readonly importAs = 'path';

  public constructor() {
    super('path');
  }
}

class ConstructsModule extends ImportableModule {
  public readonly Construct = Type.fromName(this, 'Construct');

  public readonly importAs = 'constructs';

  public constructor() {
    super('constructs');
  }
}

class CoreModule extends ImportableModule {
  public readonly Stack = Type.fromName(this, 'Stack');
  public readonly CustomResourceProviderBase = Type.fromName(this, 'CustomResourceProviderBase');
  public readonly CustomResourceProviderOptions = Type.fromName(this, 'CustomResourceProviderOptions');

  public readonly determineLatestNodeRuntimeName = CallableExpr.fromName(this, 'determineLatestNodeRuntimeName');

  public readonly importAs = 'cdk';

  public constructor() {
    super('../../../core');
  }
}

class LambdaModule extends ImportableModule {
  public readonly Function = Type.fromName(this, 'Function');
  public readonly SingletonFunction = Type.fromName(this, 'SingletonFunction');
  public readonly FunctionOptions = Type.fromName(this, 'FunctionOptions');
  public readonly Runtime = Type.fromName(this, 'Runtime');
  public readonly RuntimeFamily = Type.fromName(this, 'RuntimeFamily');
  public readonly Code = Type.fromName(this, 'Code');

  public readonly determineLatestNodeRuntime = CallableExpr.fromName(this, 'determineLatestNodeRuntime');

  public readonly importAs = 'lambda';

  public constructor() {
    super('../../../aws-lambda');
  }
}

class RegionInfoModule extends ImportableModule {
  public readonly FactName = Type.fromName(this, 'FactName');

  public readonly importAs = 'region';

  public constructor() {
    super('../../../region-info');
  }
}

export const PATH_MODULE = new PathModule();
export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CORE_MODULE = new CoreModule();
export const LAMBDA_MODULE = new LambdaModule();
export const REGION_INFO_MODULE = new RegionInfoModule();
