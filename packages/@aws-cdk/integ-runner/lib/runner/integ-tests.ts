import * as path from 'path';
import * as fs from 'fs-extra';

/**
 * Represents a single integration test
 */
export interface IntegTestConfig {
  readonly directory: string;
  readonly fileName: string;
}

/**
 * Discover integration tests
 */
export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

  /**
   * Takes an optional list of tests to look for, otherwise
   * it will look for all tests from the directory
   */
  public async fromCliArgs(tests?: string[]): Promise<IntegTestConfig[]> {
    let allTests = await this.discover();
    const all = allTests.map(x => x.fileName);
    let foundAll = true;

    if (tests && tests.length > 0) {
      // Pare down found tests to filter
      allTests = allTests.filter(t => {
        const parts = path.parse(t.fileName);
        return (tests.includes(t.fileName) || tests.includes(parts.base));
      });

      const selectedNames = allTests.map(t => path.parse(t.fileName).base);
      for (const unmatched of tests.filter(t => !selectedNames.includes(t))) {
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
