// Helper functions for integration tests
import { DEFAULT_ACCOUNT_CONTEXT_KEY, DEFAULT_REGION_CONTEXT_KEY } from '@aws-cdk/cx-api';
import { spawnSync } from 'child_process';
import fs = require('fs');
import path = require('path');
import util = require('util');

export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

  public fromCliArgs(tests?: string[]): Promise<IntegrationTest[]> {
    if (tests && tests.length > 0) {
      return this.request(tests);
    } else {
      return this.discover();
    }
  }

  public async discover(): Promise<IntegrationTest[]> {
    const files = await util.promisify(fs.readdir)(this.directory);
    const integs = files.filter(fileName => fileName.startsWith('integ.') && fileName.endsWith('.js'));
    return await this.request(integs);
  }

  public async request(files: string[]): Promise<IntegrationTest[]> {
    return files.map(fileName => new IntegrationTest(this.directory, fileName));
  }
}

export class IntegrationTest {
  public readonly expectedFileName: string;
  private readonly expectedFilePath: string;
  private readonly cdkConfigPath: string;

  constructor(private readonly directory: string, public readonly name: string) {
    this.expectedFileName = path.basename(this.name, '.js') + '.expected.json';
    this.expectedFilePath = path.join(this.directory, this.expectedFileName);
    this.cdkConfigPath = path.join(this.directory, 'cdk.json');
  }

  public async invoke(args: string[], options: { json?: boolean, context?: any, verbose?: boolean } = { }): Promise<any> {
    // Write context to cdk.json, afterwards delete. We need to do this because there is no way
    // to pass structured context data from the command-line, currently.
    if (options.context) {
      await this.writeCdkConfig({ context: options.context, versionReporting: false });
    } else {
      this.deleteCdkConfig();
    }

    try {
      const cdk = require.resolve('aws-cdk/bin/cdk');
      return exec([cdk, '-a', `node ${this.name}`].concat(args), {
        cwd: this.directory,
        json: options.json,
        verbose: options.verbose
      });
    } finally {
      this.deleteCdkConfig();
    }
  }

  public hasExpected(): boolean {
    return fs.existsSync(this.expectedFilePath);
  }

  public async readExpected(): Promise<any> {
    return JSON.parse((await util.promisify(fs.readFile)(this.expectedFilePath, { encoding: 'utf-8' })));
  }

  public async writeExpected(actual: any) {
    await util.promisify(fs.writeFile)(this.expectedFilePath, JSON.stringify(actual, undefined, 2), { encoding: 'utf-8' });
  }

  private async writeCdkConfig(config: any) {
    await util.promisify(fs.writeFile)(this.cdkConfigPath, JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });
  }

  private deleteCdkConfig() {
    if (fs.existsSync(this.cdkConfigPath)) {
      fs.unlinkSync(this.cdkConfigPath);
    }
  }
}

// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
export const STATIC_TEST_CONTEXT = {
  [DEFAULT_ACCOUNT_CONTEXT_KEY]: "12345678",
  [DEFAULT_REGION_CONTEXT_KEY]: "test-region",
  "availability-zones:12345678:test-region": [ "test-region-1a", "test-region-1b", "test-region-1c" ],
  "ssm:12345678:test-region:/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2": "ami-1234",
};

/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine: string[], options: { cwd?: string, json?: boolean, verbose?: boolean} = { }): any {
  const proc = spawnSync(commandLine[0], commandLine.slice(1), {
    stdio: [ 'ignore', 'pipe', options.verbose ? 'inherit' : 'pipe' ], // inherit STDERR in verbose mode
    cwd: options.cwd
  });

  if (proc.error) { throw proc.error; }
  if (proc.status !== 0) {
    if (process.stderr) { // will be 'null' in verbose mode
      process.stderr.write(proc.stderr);
    }
    throw new Error(`Command exited with ${proc.status ? `status ${proc.status}` : `signal ${proc.signal}`}`);
  }

  const output = proc.stdout.toString('utf-8').trim();

  try {
    if (options.json) {
      if (output.length === 0) { return {}; }

      return JSON.parse(output);
    }
    return output;
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error("Not JSON: " + output);
    throw new Error('Command output is not JSON');
  }
}
