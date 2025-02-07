import * as os from 'os';
import * as path from 'path';
import { ClassSpec, ClassType, IScope, Module, TypeScriptRenderer, expr } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import { CallableExpr } from '../../lib/custom-resources-framework/callable-expr';
import { HandlerFrameworkModule } from '../../lib/custom-resources-framework/framework';
import { ModuleImporter } from '../../lib/custom-resources-framework/module-importer';
import { ImportableModule } from '../../lib/custom-resources-framework/modules';

describe('callable expression', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
  });

  test('callable expression toString return expression name', () => {
    // GIVEN
    const expressionName = 'determineRuntime';
    const module = new HandlerFrameworkModule('cdk-testing');
    const callable = CallableExpr.fromName(module, expressionName);

    // WHEN / THEN
    expect(callable.toString()).toEqual(expressionName);
  });

  test('one expression proxy', () => {
    // GIVEN
    const module = new HandlerFrameworkTestModule('test');
    HandlerFrameworkTestClass.buildTestFunctionWithOneCall(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as fqn from "fqn";\n\nclass testFunction {\n  public testMethod(): void {\n    fqn.firstCallableExpr(scope);\n  }\n}';
    expect(result).toEqual(expected);
  });

  test('two expression proxies', () => {
    // GIVEN
    const module = new HandlerFrameworkTestModule('test');
    HandlerFrameworkTestClass.buildTestFunctionWithTwoCalls(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as fqn from "fqn";\n\nclass testFunction {\n  public testMethod(): void {\n    fqn.firstCallableExpr(scope);\n    fqn.secondCallableExpr(scope);\n  }\n}';
    expect(result).toEqual(expected);
  });

  test('expression proxy with multiple arguments', () => {
    // GIVEN
    const module = new HandlerFrameworkTestModule('test');
    HandlerFrameworkTestClass.buildTestFunctionWithMultipleArgsInExpr(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as fqn from "fqn";\n\nclass testFunction {\n  public testMethod(): void {\n    fqn.firstCallableExpr(scope, arg2);\n  }\n}';
    expect(result).toEqual(expected);
  });
});

class TestModule extends ImportableModule {
  public readonly callableExpr1 = CallableExpr.fromName(this, 'firstCallableExpr');
  public readonly callableExpr2 = CallableExpr.fromName(this, 'secondCallableExpr');

  public readonly importAs = 'fqn';

  constructor() {
    super('fqn');
  }
}

class HandlerFrameworkTestModule extends Module {
  private readonly importer = new ModuleImporter();
  private readonly renderer = new TypeScriptRenderer();

  public constructor(fqn: string) {
    super(fqn);
  }

  public renderTo(file: string) {
    this.importer.importModulesInto(this);
    fs.outputFileSync(file, this.renderer.render(this));
  }

  public registerImport(module: ImportableModule) {
    this.importer.registerImport(module);
  }
}

abstract class HandlerFrameworkTestClass extends ClassType {
  public static buildTestFunctionWithOneCall(scope: HandlerFrameworkTestModule) {
    new (class extends HandlerFrameworkTestClass {
      public constructor() {
        super(scope, { name: 'testFunction' });

        const testModule = new TestModule();
        scope.registerImport(testModule);

        const _method = this.addMethod({
          name: 'testMethod',
        });
        _method.addBody(
          testModule.callableExpr1.call(expr.ident('scope')),
        );
      }
    })();
  }

  public static buildTestFunctionWithTwoCalls(scope: HandlerFrameworkTestModule) {
    new (class extends HandlerFrameworkTestClass {
      public constructor() {
        super(scope, { name: 'testFunction' });

        const testModule = new TestModule();
        scope.registerImport(testModule);

        const _method = this.addMethod({
          name: 'testMethod',
        });
        _method.addBody(
          testModule.callableExpr1.call(expr.ident('scope')),
          testModule.callableExpr2.call(expr.ident('scope')),
        );
      }
    })();
  }

  public static buildTestFunctionWithMultipleArgsInExpr(scope: HandlerFrameworkTestModule) {
    new (class extends HandlerFrameworkTestClass {
      public constructor() {
        super(scope, { name: 'testFunction' });

        const testModule = new TestModule();
        scope.registerImport(testModule);

        const _method = this.addMethod({
          name: 'testMethod',
        });
        _method.addBody(
          testModule.callableExpr1.call(expr.ident('scope'), expr.ident('arg2')),
        );
      }
    })();
  }

  public constructor(scope: IScope, spec: ClassSpec) {
    super(scope, spec);
  }
}
