import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ComponentType, ConfigProps } from '../../lib/custom-resources-framework/config';
import { CdkHandlerFrameworkModule } from '../../lib/custom-resources-framework/framework';
import { Runtime } from '../../lib/custom-resources-framework/runtime';
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
    const module = new CdkHandlerFrameworkModule('cdk-testing/test-provider');
    const component: ConfigProps = {
      type: ComponentType.CDK_FUNCTION,
      sourceCode,
      compatibleRuntimes: [Runtime.NODEJS_18_X],
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.render(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'cdk-function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk singleton function', () => {
    // GIVEN
    const module = new CdkHandlerFrameworkModule('cdk-testing/test-provider');
    const component: ConfigProps = {
      type: ComponentType.CDK_SINGLETON_FUNCTION,
      sourceCode,
      compatibleRuntimes: [Runtime.NODEJS_18_X],
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.render(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'cdk-singleton-function.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider for core internal', () => {
    // GIVEN
    const module = new CdkHandlerFrameworkModule('cdk-testing/test-provider');
    const component: ConfigProps = {
      type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
      sourceCode,
      compatibleRuntimes: [Runtime.NODEJS_18_X],
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.render(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'cdk-custom-resource-provider.ts'), 'utf-8');
    expect(result).toContain(expected);
  });

  test('can codegen cdk custom resource provider for core internal', () => {
    // GIVEN
    const module = new CdkHandlerFrameworkModule('core/test-provider');
    const component: ConfigProps = {
      type: ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER,
      sourceCode,
      compatibleRuntimes: [Runtime.NODEJS_18_X],
    };
    const outfile = calculateOutfile(sourceCode);
    module.build(component, path.dirname(outfile).split('/').pop() ?? 'dist');

    // WHEN
    module.render(`${tmpDir}/result.ts`);

    // THEN
    const result = fs.readFileSync(path.resolve(tmpDir, 'result.ts'), 'utf-8');
    const expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'cdk-custom-resource-provider-core.ts'), 'utf-8');
    expect(result).toContain(expected);
  });
});
