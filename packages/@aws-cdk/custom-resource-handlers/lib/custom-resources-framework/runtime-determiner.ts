/* eslint-disable import/no-extraneous-dependencies */
import {
  Module,
  TypeScriptRenderer,
  stmt,
  expr,
  ExternalModule,
  FreeFunction,
  Type,
} from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { DEFAULT_NODE_RUNTIME } from './config';
import {
  CONSTRUCTS_MODULE,
  CORE_INTERNAL_REGION_INFO,
  CORE_INTERNAL_STACK,
} from './modules';
import { LAMBDA_INTERNAL_RUNTIME, CORE_RUNTIME_DETERMINER } from './runtime-determiner-modules';

export class RuntimeDeterminerModule extends Module {
  public static buildForCore() {
    return new RuntimeDeterminerModule('runtime-determiner-core');
  }

  public static buildForLambda() {
    return new RuntimeDeterminerModule('runtime-determiner-lambda');
  }

  private readonly renderer = new TypeScriptRenderer();
  private readonly externalModules: ExternalModule[] = [CONSTRUCTS_MODULE];

  private constructor(fqn: string) {
    super(fqn);
    fqn.includes('core') ? this.buildDetermineLatestNodeRuntimeName() : this.buildDetermineLatestNodeRuntime();
    this.importExternalModules();
  }

  /**
   * Renders this module into a specified file.
   */
  public renderTo(file: string) {
    fs.outputFileSync(file, this.renderer.render(this));
  }

  private buildDetermineLatestNodeRuntimeName() {
    this.externalModules.push(...[CORE_INTERNAL_STACK, CORE_INTERNAL_REGION_INFO]);
    const fn = new FreeFunction(this, {
      name: 'determineLatestNodeRuntimeName',
      export: true,
      returnType: Type.STRING,
    });
    fn.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    fn.addBody(
      stmt.ret(
        expr.directCode(`${CORE_INTERNAL_STACK.Stack}.of(scope).regionalFact(${CORE_INTERNAL_REGION_INFO.FactName}.DEFAULT_CR_NODE_VERSION, '${DEFAULT_NODE_RUNTIME}')`),
      ),
    );
  }

  private buildDetermineLatestNodeRuntime() {
    this.externalModules.push(...[LAMBDA_INTERNAL_RUNTIME, CORE_RUNTIME_DETERMINER]);
    const fn = new FreeFunction(this, {
      name: 'determineLatestNodeRuntime',
      export: true,
      returnType: LAMBDA_INTERNAL_RUNTIME.Runtime,
    });
    fn.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    fn.addBody(
      stmt.constVar(
        expr.ident('runtimeName'),
        expr.directCode('determineLatestNodeRuntimeName(scope)'),
      ),
      stmt.ret(
        expr.directCode(`new ${LAMBDA_INTERNAL_RUNTIME.Runtime}(runtimeName, ${LAMBDA_INTERNAL_RUNTIME.RuntimeFamily}.NODEJS, { supportsInlineCode: true })`),
      ),
    );
  }

  private importExternalModules() {
    for (const module of this.externalModules) {
      this.importExternalModule(module);
    }
  }

  private importExternalModule(module: ExternalModule) {
    switch (module.fqn) {
      case CONSTRUCTS_MODULE.fqn: {
        module.importSelective(this, [CONSTRUCTS_MODULE.Construct.toString()]);
        return;
      }
      case LAMBDA_INTERNAL_RUNTIME.fqn: {
        module.importSelective(this, [
          LAMBDA_INTERNAL_RUNTIME.Runtime.toString(),
          LAMBDA_INTERNAL_RUNTIME.RuntimeFamily.toString(),
        ]);
        return;
      }
      case CORE_INTERNAL_REGION_INFO.fqn: {
        module.importSelective(this, [CORE_INTERNAL_REGION_INFO.FactName.toString()]);
        return;
      }
      case CORE_INTERNAL_STACK.fqn: {
        module.importSelective(this, [CORE_INTERNAL_STACK.Stack.toString()]);
        return;
      }
      case CORE_RUNTIME_DETERMINER.fqn: {
        module.importSelective(this, [CORE_RUNTIME_DETERMINER.determineLatestNodeRuntimeName]);
        return;
      }
    }
  }
}
