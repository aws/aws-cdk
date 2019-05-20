// Helper functions for integration tests
import { DEFAULT_ACCOUNT_CONTEXT_KEY, DEFAULT_REGION_CONTEXT_KEY } from '@aws-cdk/cx-api';
import { spawnSync } from 'child_process';
import fs = require('fs');
import path = require('path');
import util = require('util');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

  public async fromCliArgs(tests?: string[]): Promise<IntegrationTest[]> {
    let allTests = await this.discover();

    if (tests && tests.length > 0) {
      // Pare down found tests to filter
      allTests = allTests.filter(t => tests.includes(t.name));

      const selectedNames = allTests.map(t => t.name);
      for (const unmatched of tests.filter(t => !selectedNames.includes(t))) {
        process.stderr.write(`No such integ test: ${unmatched}\n`);
      }
    }

    return allTests;
  }

  public async discover(): Promise<IntegrationTest[]> {
    const files = await this.readTree();
    const integs = files.filter(fileName => path.basename(fileName).startsWith('integ.') && path.basename(fileName).endsWith('.js'));
    return await this.request(integs);
  }

  public async request(files: string[]): Promise<IntegrationTest[]> {
    return files.map(fileName => new IntegrationTest(this.directory, fileName));
  }

  private async readTree(): Promise<string[]> {
    const ret = new Array<string>();

    const rootDir = this.directory;

    async function recurse(dir: string) {
      const files = await readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const statf = await stat(fullPath);
        if (statf.isFile()) { ret.push(fullPath.substr(rootDir.length + 1)); }
        if (statf.isDirectory()) { await recurse(path.join(fullPath)); }
      }
    }

    await recurse(this.directory);
    return ret;
  }
}

export class IntegrationTest {
  public readonly expectedFileName: string;
  private readonly expectedFilePath: string;
  private readonly cdkContextPath: string;

  constructor(private readonly directory: string, public readonly name: string) {
    const baseName = this.name.endsWith('.js') ? this.name.substr(0, this.name.length - 3) : this.name;
    this.expectedFileName = baseName + '.expected.json';
    this.expectedFilePath = path.join(this.directory, this.expectedFileName);
    this.cdkContextPath = path.join(this.directory, 'cdk.context.json');
  }

  public async invoke(args: string[], options: { json?: boolean, context?: any, verbose?: boolean } = { }): Promise<any> {
    // Write context to cdk.json, afterwards delete. We need to do this because there is no way
    // to pass structured context data from the command-line, currently.
    if (options.context) {
      await this.writeCdkContext(options.context);
    } else {
      this.deleteCdkContext();
    }

    try {
      const cdk = require.resolve('aws-cdk/bin/cdk');
      return exec([cdk, '-a', `node ${this.name}`, '--no-version-reporting'].concat(args), {
        cwd: this.directory,
        json: options.json,
        verbose: options.verbose,
      });
    } finally {
      this.deleteCdkContext();
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

  private async writeCdkContext(config: any) {
    await util.promisify(fs.writeFile)(this.cdkContextPath, JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });
  }

  private deleteCdkContext() {
    if (fs.existsSync(this.cdkContextPath)) {
      fs.unlinkSync(this.cdkContextPath);
    }
  }
}

// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
export const STATIC_TEST_CONTEXT = {
  [DEFAULT_ACCOUNT_CONTEXT_KEY]: "12345678",
  [DEFAULT_REGION_CONTEXT_KEY]: "test-region",
  "availability-zones:account=12345678:region=test-region": [ "test-region-1a", "test-region-1b", "test-region-1c" ],
  "ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region": "ami-1234",
  "ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region": "ami-1234",
  "ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region": "{\"image_id\": \"ami-1234\"}",
  "vpc-provider:account=12345678:filter.isDefault=true:region=test-region": {
    vpcId: "vpc-60900905",
    availabilityZones: [ "us-east-1a", "us-east-1b", "us-east-1c" ],
    publicSubnetIds: [ "subnet-e19455ca", "subnet-e0c24797", "subnet-ccd77395", ],
    publicSubnetNames: [ "Public" ]
  }
};

/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine: string[], options: { cwd?: string, json?: boolean, verbose?: boolean} = { }): any {
  const proc = spawnSync(commandLine[0], commandLine.slice(1), {
    stdio: [ 'ignore', 'pipe', options.verbose ? 'inherit' : 'pipe' ], // inherit STDERR in verbose mode
    env: {
      ...process.env,
      CDK_INTEG_MODE: '1'
    },
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
