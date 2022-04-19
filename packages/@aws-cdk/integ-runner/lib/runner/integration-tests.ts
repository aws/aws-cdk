import * as path from 'path';
import * as fs from 'fs-extra';

/**
 * Represents a single integration test
 */
export interface IntegTestConfig {
  /**
   * The name of the file that contains the
   * integration tests. This will be in the format
   * of integ.{test-name}.js
   */
  readonly fileName: string;

  /**
   * The base directory where the tests are
   * discovered from
   */
  readonly directory: string;
}

/**
 * The list of tests to run can be provided in a file
 * instead of as command line arguments.
 */
export interface IntegrationTestFileConfig {
  /**
   * If this is set to true then the list of tests
   * provided will be excluded
   *
   * @default false
   */
  readonly exclude?: boolean;

  /**
   * List of tests to include (or exclude if `exclude=true`)
   */
  readonly tests: string[];
}

/**
 * Discover integration tests
 */
export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

  /**
   * Takes a file name of a file that contains a list of test
   * to either run or exclude and returns a list of Integration Tests to run
   */
  public async fromFile(fileName: string): Promise<IntegTestConfig[]> {
    const file: IntegrationTestFileConfig = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf-8' }));
    const foundTests = await this.discover();

    const allTests = this.filterTests(foundTests, file.tests, file.exclude);

    return allTests;
  }

  /**
   * If the user provides a list of tests, these can either be a list of tests to include or a list of tests to exclude.
   *
   * - If it is a list of tests to include then we discover all available tests and check whether they have provided valid tests.
   *   If they have provided a test name that we don't find, then we write out that error message.
   * - If it is a list of tests to exclude, then we discover all available tests and filter out the tests that were provided by the user.
   */
  private filterTests(discoveredTests: IntegTestConfig[], requestedTests?: string[], exclude?: boolean): IntegTestConfig[] {
    if (!requestedTests || requestedTests.length === 0) {
      return discoveredTests;
    }
    const all = discoveredTests.map(x => {
      return path.relative(x.directory, x.fileName);
    });
    let foundAll = true;
    // Pare down found tests to filter
    const allTests = discoveredTests.filter(t => {
      if (exclude) {
        return (!requestedTests.includes(path.relative(t.directory, t.fileName)));
      }
      return (requestedTests.includes(path.relative(t.directory, t.fileName)));
    });

    if (!exclude) {
      const selectedNames = allTests.map(t => path.relative(t.directory, t.fileName));
      for (const unmatched of requestedTests.filter(t => !selectedNames.includes(t))) {
        process.stderr.write(`No such integ test: ${unmatched}\n`);
        foundAll = false;
      }
    }
    if (!foundAll) {
      process.stderr.write(`Available tests: ${all.join(' ')}\n`);
      return [];
    }

    return allTests;
  }

  /**
   * Takes an optional list of tests to look for, otherwise
   * it will look for all tests from the directory
   */
  public async fromCliArgs(tests?: string[], exclude?: boolean): Promise<IntegTestConfig[]> {
    const discoveredTests = await this.discover();

    const allTests = this.filterTests(discoveredTests, tests, exclude);

    return allTests;
  }

  private async discover(): Promise<IntegTestConfig[]> {
    const files = await this.readTree();
    const integs = files.filter(fileName => path.basename(fileName).startsWith('integ.') && path.basename(fileName).endsWith('.js'));
    return this.request(integs);
  }

  private request(files: string[]): IntegTestConfig[] {
    return files.map(fileName => { return { directory: this.directory, fileName }; });
  }

  private async readTree(): Promise<string[]> {
    const ret = new Array<string>();

    async function recurse(dir: string) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const statf = await fs.stat(fullPath);
        if (statf.isFile()) { ret.push(fullPath); }
        if (statf.isDirectory()) { await recurse(path.join(fullPath)); }
      }
    }

    await recurse(this.directory);
    return ret;
  }
}
