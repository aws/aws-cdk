import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { RuntimeIntegrationTestUpdater } from '../lib/runtime-updater';

describe('RuntimeIntegrationTestUpdater', () => {
  let tempDir: string;

  beforeEach(() => {
    // Create a temporary directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test'));
  });

  afterEach(() => {
    // Clean up: remove temporary directory and all files inside it
    fs.readdirSync(tempDir).forEach((file) => {
      const filePath = path.join(tempDir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir, {});
    }
  });


  describe('execute', () => {
    it('should process runtime family and update the integration test', async () => {
      // Create temporary files
      const OneNonDeprecatedRuntimeFilePath = path.join(tempDir, 'one-runtime.ts');
      const OneNoneDeprecatedIntegTestFilePath = path.join(tempDir, 'one-integ.test.ts');

      fs.writeFileSync(OneNonDeprecatedRuntimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime (nodejs)
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(OneNoneDeprecatedIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'NODEJS': OneNoneDeprecatedIntegTestFilePath
      }, OneNonDeprecatedRuntimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(OneNoneDeprecatedIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [
  Runtime.NODEJS_XYZ,
];`
      );
    });

    it('should process multiple runtime families and update the integration tests', async () => {
      // Create temporary files
      const runtimeFilePath = path.join(tempDir, 'one-runtime.ts');
      const nodeIntegTestFilePath = path.join(tempDir, 'node-integ.test.ts');
      const pythonIntegTestFilePath = path.join(tempDir, 'python-integ.test.ts');

      fs.writeFileSync(runtimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });

  /**
   * The PYTHON runtime
   */
  public static readonly PYTHON_ABC = new Runtime('python27', RuntimeFamily.PYTHON, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(nodeIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      fs.writeFileSync(pythonIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'NODEJS': nodeIntegTestFilePath,
        'PYTHON': pythonIntegTestFilePath
      }, runtimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(nodeIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [
  Runtime.NODEJS_XYZ,
];`
      );

      expect(
          fs.readFileSync(pythonIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [
  Runtime.PYTHON_ABC,
];`
      );
    });

    it('should process only non deprecated runtimes and update the integration test', async () => {
      // Create temporary files
      const OneNonDeprecatedRuntimeFilePath = path.join(tempDir, 'one-runtime.ts');
      const OneNoneDeprecatedIntegTestFilePath = path.join(tempDir, 'one-integ.test.ts');

      fs.writeFileSync(OneNonDeprecatedRuntimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime (nodejs)
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });
  
  /**
   * The NodeJS runtime (nodejs2)
   * @deprecated
   */
  public static readonly NODEJS_ABC = new Runtime('nodejs2', RuntimeFamily.NODEJS, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(OneNoneDeprecatedIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'NODEJS': OneNoneDeprecatedIntegTestFilePath
      }, OneNonDeprecatedRuntimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(OneNoneDeprecatedIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [
  Runtime.NODEJS_XYZ,
];`
      );
    });

    it('should not fail even if all runtimes are deprecated and runtimes list will be empty', async () => {
      // Create temporary files
      const allDeprecatedRuntimeFilePath = path.join(tempDir, 'all-deprecated-runtime.ts');
      const allDeprecatedIntegTestFilePath = path.join(tempDir, 'all-deprecated-integ.test.ts');

      fs.writeFileSync(allDeprecatedRuntimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime (nodejs)
   * @deprecated
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });
  
  /**
   * The NodeJS runtime (nodejs2)
   * @deprecated
   */
  public static readonly NODEJS_ABC = new Runtime('nodejs2', RuntimeFamily.NODEJS, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(allDeprecatedIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'NODEJS': allDeprecatedIntegTestFilePath
      }, allDeprecatedRuntimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(allDeprecatedIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [];`
      );
    });

    it('should not fail even if there is no runtime for given runtime family and runtimes list will be empty', async () => {
      // Create temporary files
      const onlyNodeRuntimeFilePath = path.join(tempDir, 'node-runtime.ts');
      const pythonIntegTestFilePath = path.join(tempDir, 'python-integ.test.ts');

      fs.writeFileSync(onlyNodeRuntimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime (nodejs)
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });
  
  /**
   * The NodeJS runtime (nodejs2)
   * @deprecated
   */
  public static readonly NODEJS_ABC = new Runtime('nodejs2', RuntimeFamily.NODEJS, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(pythonIntegTestFilePath, `
const runtimes: Runtime[]= [];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'PYTHON': pythonIntegTestFilePath
      }, onlyNodeRuntimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(pythonIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [];`
      );
    });

    it('should process multiple non deprecated runtimes and make sure no duplicate runtimes in the integration test', async () => {
      // Create temporary files
      const multipleNonDeprecatedRuntimeFilePath = path.join(tempDir, 'multiple-runtime.ts');
      const uniqueIntegTestFilePath = path.join(tempDir, 'unique-integ.test.ts');

      fs.writeFileSync(multipleNonDeprecatedRuntimeFilePath, `
export class Runtime {
  /**
   * The NodeJS runtime (nodejs)
   */
  public static readonly NODEJS_XYZ = new Runtime('nodejs', RuntimeFamily.NODEJS, { supportsInlineCode: true });
  
  /**
   * The NodeJS runtime (nodejs2)
   * @deprecated
   */
  public static readonly NODEJS_ABC = new Runtime('nodejs2', RuntimeFamily.NODEJS, { supportsInlineCode: true });
  
  /**
   * The NodeJS runtime (nodejs3)
   */
  public static readonly NODEJS_DEF = new Runtime('nodejs3', RuntimeFamily.NODEJS, { supportsInlineCode: true });
}
    `);

      fs.writeFileSync(uniqueIntegTestFilePath, `
const runtimes: Runtime[]= [Runtime.NODEJS_XYZ,];
    `);

      let updater = new RuntimeIntegrationTestUpdater({
        'NODEJS': uniqueIntegTestFilePath
      }, multipleNonDeprecatedRuntimeFilePath);
      await updater.execute();

      expect(
          fs.readFileSync(uniqueIntegTestFilePath, 'utf8')
      ).toContain(
          `const runtimes: Runtime[]= [
  Runtime.NODEJS_XYZ, Runtime.NODEJS_DEF,
];`
      );
    });
  });
});

