/* eslint-disable import/no-extraneous-dependencies */
import { ClassType, Module, Type, TypeScriptRenderer, stmt, expr, MemberVisibility, ExternalModule, Method } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { DEFAULT_NODE_RUNTIME } from './config';
import { CONSTRUCTS_MODULE, CORE_INTERNAL_REGION_INFO, CORE_INTERNAL_STACK, CORE_MODULE, LAMBDA_MODULE, REGION_INFO } from './modules';

/**
 *
 */
export class RuntimeDeterminerModule extends Module {
  /**
   *
   */
  public static buildForCore() {
    return RuntimeDeterminerModule.build(RuntimeDeterminerModule.CORE);
  }

  /**
   *
   */
  public static buildForStandardLib() {
    return RuntimeDeterminerModule.build(RuntimeDeterminerModule.STANDARD);
  }

  private static readonly CORE = 'core';
  private static readonly STANDARD = 'standard';

  private static build(fqn: string) {
    const module = new RuntimeDeterminerModule(fqn);
    RuntimeDeterminerClass.buildInto(module);
    return module;
  }

  private readonly renderer = new TypeScriptRenderer();

  /**
   *
   */
  public readonly isCoreInternal: boolean;

  private constructor(fqn: string) {
    super(`runtime-determiner-${fqn}`);
    this.isCoreInternal = fqn.includes(RuntimeDeterminerModule.CORE);
  }

  /**
   *
   */
  public renderTo(file: string) {
    fs.outputFileSync(file, this.renderer.render(this));
  }
}

/**
 *
 */
class RuntimeDeterminerClass extends ClassType {
  /**
   *
   */
  public static buildInto(scope: RuntimeDeterminerModule) {
    new RuntimeDeterminerClass(scope);
  }

  private externalModules: ExternalModule[] = [CONSTRUCTS_MODULE];

  private constructor(scope: RuntimeDeterminerModule) {
    super(scope, {
      name: 'RuntimeDeterminer',
      export: true,
      abstract: true,
    });

    if (scope.isCoreInternal) {
      this.externalModules.push(...[CORE_INTERNAL_STACK, CORE_INTERNAL_REGION_INFO]);
    } else {
      this.externalModules.push(...[CORE_MODULE, REGION_INFO, LAMBDA_MODULE]);
    }

    this.importExternalModulesInto(scope);

    const determineLatestRuntimeName = this.buildDetermineLatestRuntimeName();
    if (!scope.isCoreInternal) {
      this.buildDetermineLatestLambdaRuntime(determineLatestRuntimeName);
    }
  }

  private importExternalModulesInto(scope: RuntimeDeterminerModule) {
    for (const module of this.externalModules) {
      this.importExternalModuleInto(scope, module);
    }
  }

  private importExternalModuleInto(scope: RuntimeDeterminerModule, module: ExternalModule) {
    switch (module.fqn) {
      case CONSTRUCTS_MODULE.fqn: {
        CONSTRUCTS_MODULE.importSelective(scope, ['Construct']);
        return;
      }
      case CORE_MODULE.fqn: {
        CORE_MODULE.importSelective(scope, ['Stack']);
        return;
      }
      case CORE_INTERNAL_STACK.fqn: {
        CORE_INTERNAL_STACK.importSelective(scope, ['Stack']);
        return;
      }
      case REGION_INFO.fqn: {
        REGION_INFO.importSelective(scope, ['FactName']);
        return;
      }
      case CORE_INTERNAL_REGION_INFO.fqn: {
        CORE_INTERNAL_REGION_INFO.importSelective(scope, ['FactName']);
        return;
      }
      case LAMBDA_MODULE.fqn: {
        LAMBDA_MODULE.importSelective(scope, ['Runtime', 'RuntimeFamily']);
        return;
      }
    }
  }

  private buildDetermineLatestRuntimeName() {
    const runtimeDeterminer = this.addMethod({
      static: true,
      name: 'determineLatestRuntimeName',
      returnType: Type.STRING,
      visibility: MemberVisibility.Public,
    });
    runtimeDeterminer.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    runtimeDeterminer.addBody(
      stmt.ret(expr.directCode(`Stack.of(scope).regionalFact(FactName.DEFAULT_CR_NODE_VERSION, '${DEFAULT_NODE_RUNTIME}')`)),
    );
    return runtimeDeterminer;
  }

  private buildDetermineLatestLambdaRuntime(determineLatestRuntimeNameMethod: Method) {
    const runtimeDeterminer = this.addMethod({
      static: true,
      name: 'determineLatestLambdaRuntime',
      returnType: LAMBDA_MODULE.Runtime,
      visibility: MemberVisibility.Public,
    });
    runtimeDeterminer.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    runtimeDeterminer.addBody(
      stmt.constVar(
        expr.ident('runtimeName'),
        expr.directCode(`${this.name}.${determineLatestRuntimeNameMethod.name}(scope)`),
      ),
      stmt.ret(expr.directCode(`${LAMBDA_MODULE.Runtime}(runtimeName, ${LAMBDA_MODULE.RuntimeFamily}.NODE_JS, { supportsInlineCode: true })`)),
    );
  }
}
