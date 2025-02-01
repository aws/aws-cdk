import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { HandlerFrameworkModule } from '../../lib/custom-resources-framework/framework';
import { ModuleImporter } from '../../lib/custom-resources-framework/module-importer';
import { CORE_MODULE, LAMBDA_MODULE } from '../../lib/custom-resources-framework/modules';

describe('module importer', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
  });

  test('aliased import', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE);
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as lambda from "../../../aws-lambda";';
    expect(result).toEqual(expected);
  });

  test('targeted import', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE, {
      targets: [LAMBDA_MODULE.Code, LAMBDA_MODULE.Function],
    });
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport { Code, Function } from "../../../aws-lambda";';
    expect(result).toEqual(expected);
  });

  test('from location', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE, {
      fromLocation: '../import/from/here',
    });
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as lambda from "../import/from/here";';
    expect(result).toEqual(expected);
  });

  test('ignores duplicate imports', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE);
    moduleImporter.registerImport(LAMBDA_MODULE);
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as lambda from "../../../aws-lambda";';
    expect(result).toEqual(expected);
  });

  test('import multiple modules', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE);
    moduleImporter.registerImport(CORE_MODULE, {
      targets: [CORE_MODULE.Stack, CORE_MODULE.CustomResourceProviderBase],
    });
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as lambda from "../../../aws-lambda";\nimport { Stack, CustomResourceProviderBase } from "../../../core";';
    expect(result).toEqual(expected);
  });

  test('converts targeted import and aliased import from same module to aliased import', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing');
    const moduleImporter = new ModuleImporter();
    moduleImporter.registerImport(LAMBDA_MODULE, {
      targets: [LAMBDA_MODULE.Code],
    });
    moduleImporter.registerImport(LAMBDA_MODULE);
    moduleImporter.importModulesInto(module);

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = '/* eslint-disable prettier/prettier, @stylistic/max-len */\nimport * as lambda from "../../../aws-lambda";';
    expect(result).toEqual(expected);
  });
});
