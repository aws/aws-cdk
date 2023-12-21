import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ComponentProps, ComponentType, Runtime } from '../../lib/custom-resources-framework/config';
import { HandlerFrameworkModule } from '../../lib/custom-resources-framework/framework';
import { calculateOutfile } from '../../scripts/generate';

/* eslint-disable no-console */

const sourceCode = path.resolve(__dirname, 'my-handler', 'index.ts');

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
      sourceCode,
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk singleton function', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.SINGLETON_FUNCTION,
      sourceCode,
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'singleton-function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider for core internal', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('cdk-testing/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode,
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'custom-resource-provider.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider for core internal', () => {
    // GIVEN
    const module = new HandlerFrameworkModule('core/test-provider');
    const component: ComponentProps = {
      type: ComponentType.CUSTOM_RESOURCE_PROVIDER,
      sourceCode,
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.renderTo(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'custom-resource-provider-core.ts'), 'utf-8');
    expect(result).toContain(expected);
  });
});
