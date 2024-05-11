/* eslint-disable import/no-extraneous-dependencies */
import { $E, ExternalModule, IScope, ThingSymbol, Type, expr } from '@cdklabs/typewriter';

export abstract class ImportableModule extends ExternalModule {
  public abstract importAs: string;
}

class PathModule extends ImportableModule {
  public readonly join = makeCallableExpr(this, 'join');

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

  public readonly determineLatestNodeRuntimeName = makeCallableExpr(this, 'determineLatestNodeRuntimeName');

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

  public readonly determineLatestNodeRuntime = makeCallableExpr(this, 'determineLatestNodeRuntime');

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

function makeCallableExpr(scope: IScope, name: string) {
  return {
    name,
    expr: $E(expr.sym(new ThingSymbol(name, scope))),
  };
}

export const PATH_MODULE = new PathModule();
export const CONSTRUCTS_MODULE = new ConstructsModule();
export const CORE_MODULE = new CoreModule();
export const LAMBDA_MODULE = new LambdaModule();
export const REGION_INFO_MODULE = new RegionInfoModule();
