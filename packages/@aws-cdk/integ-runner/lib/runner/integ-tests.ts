import * as path from 'path';
import * as fs from 'fs-extra';

export interface IntegTestConfig {
  readonly directory: string;
  readonly fileName: string;
}

export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

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

  public async discover(): Promise<IntegTestConfig[]> {
    const files = await this.readTree();
    const integs = files.filter(fileName => path.basename(fileName).startsWith('integ.') && path.basename(fileName).endsWith('.js'));
    return this.request(integs);
  }

  public request(files: string[]): IntegTestConfig[] {
    return files.map(fileName => { return { directory: this.directory, fileName }; });
  }

  private async readTree(): Promise<string[]> {
    const ret = new Array<string>();

    // const rootDir = this.directory;

    async function recurse(dir: string) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const statf = await fs.stat(fullPath);
        if (statf.isFile()) { ret.push(fullPath/* .substr(rootDir.length + 1) */); }
        if (statf.isDirectory()) { await recurse(path.join(fullPath)); }
      }
    }

    await recurse(this.directory);
    return ret;
  }
}
