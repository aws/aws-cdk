/* eslint-disable import/no-extraneous-dependencies */
import {
  Module,
  TypeScriptRenderer,
  stmt,
  expr,
  FreeFunction,
  Type,
  $T,
} from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { DEFAULT_NODE_RUNTIME } from './config';
import { ModuleImporter } from './module-importer';
import {
  CONSTRUCTS_MODULE,
  LAMBDA_MODULE,
  REGION_INFO_MODULE,
  CORE_MODULE,
} from './modules';

export class RuntimeDeterminerModule extends Module {
  /**
   * Build a runtime determiner that will be airlifted directly into core. Due to circle dependencies with
   * aws-lambda, this generated runtime determiner will only determine the runtime name and not a Lambda
   * Runtime.
   */
  public static buildForCore() {
    return new RuntimeDeterminerModule('runtime-determiner-core');
  }

  /**
   * Build a runtime determiner that will be airlifted directly into aws-lambda.
   */
  public static buildForLambda() {
    return new RuntimeDeterminerModule('runtime-determiner-lambda');
  }

  private readonly renderer = new TypeScriptRenderer();
  private readonly importer = new ModuleImporter();

  private constructor(fqn: string) {
    super(fqn);
    fqn.includes('core')
      ? this.buildDetermineLatestNodeRuntimeName()
      : this.buildDetermineLatestNodeRuntime();
    this.importer.registerImport(CONSTRUCTS_MODULE, {
      targets: [CONSTRUCTS_MODULE.Construct],
    });
    this.importer.importModulesInto(this);
  }

  /**
   * Renders this module into a specified file.
   */
  public renderTo(file: string) {
    fs.outputFileSync(file, this.renderer.render(this));
  }

  private buildDetermineLatestNodeRuntimeName() {
    this.addDetermineLatestNodeRuntimeNameImports();
    const fn = new FreeFunction(this, {
      name: CORE_MODULE.determineLatestNodeRuntimeName.toString(),
      export: true,
      returnType: Type.STRING,
    });
    const scope = fn.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    fn.addBody(
      stmt.ret(
        $T(CORE_MODULE.Stack)
          .of(expr.directCode(scope.spec.name))
          .regionalFact(
            $T(REGION_INFO_MODULE.FactName).LATEST_NODE_RUNTIME,
            expr.directCode(`'${DEFAULT_NODE_RUNTIME}'`),
          ),
      ),
    );
  }

  private buildDetermineLatestNodeRuntime() {
    this.addDetermineLatestNodeRuntimeImports();
    const fn = new FreeFunction(this, {
      name: LAMBDA_MODULE.determineLatestNodeRuntime.toString(),
      export: true,
      returnType: LAMBDA_MODULE.Runtime,
    });
    const scope = fn.addParameter({
      name: 'scope',
      type: CONSTRUCTS_MODULE.Construct,
    });
    const runtimeName = expr.ident('runtimeName');
    fn.addBody(
      stmt.constVar(
        runtimeName,
        CORE_MODULE.determineLatestNodeRuntimeName.call(expr.ident(scope.spec.name)),
      ),
      stmt.ret(
        $T(LAMBDA_MODULE.Runtime).newInstance(
          runtimeName,
          $T(LAMBDA_MODULE.RuntimeFamily).NODEJS,
          expr.directCode('{ supportsInlineCode: true }'),
        ),
      ),
    );
  }

  private addDetermineLatestNodeRuntimeNameImports() {
    this.importer.registerImport(CORE_MODULE, {
      targets: [CORE_MODULE.Stack],
      fromLocation: '../../stack',
    });
    this.importer.registerImport(REGION_INFO_MODULE, {
      targets: [REGION_INFO_MODULE.FactName],
      fromLocation: '../../../../region-info',
    });
  }

  private addDetermineLatestNodeRuntimeImports() {
    this.importer.registerImport(LAMBDA_MODULE, {
      targets: [LAMBDA_MODULE.Runtime, LAMBDA_MODULE.RuntimeFamily],
      fromLocation: './runtime',
    });
    this.importer.registerImport(CORE_MODULE, {
      targets: [CORE_MODULE.determineLatestNodeRuntimeName],
      fromLocation: '../../core/lib/dist/core/runtime-determiner-core.generated',
    });
  }
}
