/* eslint-disable import/no-extraneous-dependencies */
import { ExternalModule, Type } from '@cdklabs/typewriter';
import { makeCallableExpr } from './utils/framework-utils';

class LambdaInternalRuntime extends ExternalModule {
  public readonly Runtime = Type.fromName(this, 'Runtime');
  public readonly RuntimeFamily = Type.fromName(this, 'RuntimeFamily');

  public constructor() {
    super('./runtime');
  }
}

class CoreRuntimeDeterminer extends ExternalModule {
  public readonly determineLatestNodeRuntimeName = makeCallableExpr(this, 'determineLatestNodeRuntimeName');

  public constructor() {
    super('../../core/lib/dist/core/runtime-determiner-core.generated');
  }
}

export const LAMBDA_INTERNAL_RUNTIME = new LambdaInternalRuntime();
export const CORE_RUNTIME_DETERMINER = new CoreRuntimeDeterminer();
