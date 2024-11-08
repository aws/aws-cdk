import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ComponentProps, ComponentType, Runtime } from '../../lib/custom-resources-framework/config';
import { HandlerFrameworkModule } from '../../lib/custom-resources-framework/framework';
import { calculateOutfile } from '../../scripts/generate';

const sourceCodeTs = path.resolve(__dirname, 'my-handler', 'index.ts');
const sourceCodePy = path.resolve(__dirname, 'my-handler', 'index.py');

describe('framework', () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-test'));
  });

  test('can codegen cdk function', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.FUNCTION,
      sourceCode: sourceCodeTs,
    };
    const outfile = calculateOutfile(sourceCodeTs);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'node-runtime', 'function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk singleton function', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.SINGLETON_FUNCTION,
      sourceCode: sourceCodeTs,
    };
    const outfile = calculateOutfile(sourceCodeTs);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'node-runtime', 'singleton-function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode: sourceCodeTs,
    };
    const outfile = calculateOutfile(sourceCodeTs);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'node-runtime', 'custom-resource-provider.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider for core internal', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('core/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode: sourceCodeTs,
    };
    const outfile = calculateOutfile(sourceCodeTs);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'node-runtime', 'custom-resource-provider-core.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk function with python runtime', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.FUNCTION,
      sourceCode: sourceCodePy,
      runtime: Runtime.PYTHON_3_11,
    };
    const outfile = calculateOutfile(sourceCodePy);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'python-runtime', 'function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk singleton function with python runtime', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.SINGLETON_FUNCTION,
      sourceCode: sourceCodePy,
      runtime: Runtime.PYTHON_3_11,
    };
    const outfile = calculateOutfile(sourceCodePy);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'python-runtime', 'singleton-function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider with python runtime', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode: sourceCodePy,
      runtime: Runtime.PYTHON_3_11,
    };
    const outfile = calculateOutfile(sourceCodePy);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'python-runtime', 'custom-resource-provider.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider with python runtime for core internal', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('core/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode: sourceCodePy,
      runtime: Runtime.PYTHON_3_11,
    };
    const outfile = calculateOutfile(sourceCodePy);
    module.build(component, calculateCodeDirectory(path.dirname(outfile)));

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'python-runtime', 'custom-resource-provider-core.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('codegen eval-nodejs-provider with exposed runtime property', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/eval-nodejs-provider');
    const component: ComponentProps = {
      type: ComponentType.SINGLETON_FUNCTION, // eval-nodejs-provider is a singleton function
      sourceCode: sourceCodeTs,
    };
    const outfile = calculateOutfile(sourceCodeTs);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'singleton-function-eval-nodejs.ts'), 'utf-8');
    expect(result).toContain(expected);
  });
});

function calculateCodeDirectory(outpath: string) {
  return outpath.split('/').pop() ?? 'dist';
}
