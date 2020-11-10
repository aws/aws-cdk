// Helper functions for integration tests
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY } from '../../../packages/@aws-cdk/cx-api/lib';

const CDK_OUTDIR = 'cdk-integ.out';

const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';

export class IntegrationTests {
  constructor(private readonly directory: string) {
  }

  public async fromCliArgs(tests?: string[]): Promise<IntegrationTest[]> {
    let allTests = await this.discover();
    const all = allTests.map(x => x.name);
    let foundAll = true;

    if (tests && tests.length > 0) {
      // Pare down found tests to filter
      allTests = allTests.filter(t => tests.includes(t.name));

      const selectedNames = allTests.map(t => t.name);
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
      const files = await fs.readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const statf = await fs.stat(fullPath);
        if (statf.isFile()) { ret.push(fullPath.substr(rootDir.length + 1)); }
        if (statf.isDirectory()) { await recurse(path.join(fullPath)); }
      }
    }

    await recurse(this.directory);
    return ret;
  }
}

export interface SynthOptions {
  readonly context?: Record<string, any>;
  readonly env?: Record<string, string>;
}

export class IntegrationTest {
  public readonly expectedFileName: string;
  private readonly expectedFilePath: string;
  private readonly cdkContextPath: string;
  private readonly sourceFilePath: string;

  constructor(private readonly directory: string, public readonly name: string) {
    const baseName = this.name.endsWith('.js') ? this.name.substr(0, this.name.length - 3) : this.name;
    this.expectedFileName = baseName + '.expected.json';
    this.expectedFilePath = path.join(this.directory, this.expectedFileName);
    this.sourceFilePath = path.join(this.directory, this.name);
    this.cdkContextPath = path.join(this.directory, 'cdk.context.json');
  }

  /**
   * Do a CDK synth, mimicking the CLI (without actually using it)
   *
   * The CLI has a pretty slow startup time because of all the modules it needs to load,
   * and we are running this in a tight loop. Bypass it to be quicker!
   *
   * Return the "main" template or a concatenation of all listed templates in the pragma
   */
  public async cdkSynthFast(options: SynthOptions = {}): Promise<any> {
    const context = {
      ...options.context,
    };

    try {
      await exec(['node', `${this.name}`], {
        cwd: this.directory,
        env: {
          ...options.env,
          CDK_CONTEXT_JSON: JSON.stringify(context),
          CDK_DEFAULT_ACCOUNT: '12345678',
          CDK_DEFAULT_REGION: 'test-region',
          CDK_OUTDIR,
          CDK_CLI_ASM_VERSION: '5.0.0',
        },
      });

      // Interpret the cloud assembly directly here. Not great, but I'm wary
      // adding dependencies on the libraries that model it.
      //
      // FIXME: Refactor later if it doesn't introduce dependency cycles
      const cloudManifest = await fs.readJSON(path.resolve(this.directory, CDK_OUTDIR, 'manifest.json'));
      const stacks: Record<string, any> = {};
      for (const [artifactId, artifact] of Object.entries(cloudManifest.artifacts ?? {}) as Array<[string, any]>) {
        if (artifact.type !== 'aws:cloudformation:stack') { continue; }

        const template = await fs.readJSON(path.resolve(this.directory, CDK_OUTDIR, artifact.properties.templateFile));
        stacks[artifactId] = template;
      }

      const stacksToDiff = await this.readStackPragma();

      if (stacksToDiff.length > 0) {
        // This is a monster. I'm sorry. :(
        const templates = stacksToDiff.length === 1 && stacksToDiff[0] === '*'
          ? Object.values(stacks)
          : stacksToDiff.map(templateForStackName);

        // We're supposed to just return *a* template (which is an object), but there's a crazy
        // case in which we diff multiple templates at once and then they're an array. And it works somehow.
        return templates.length === 1 ? templates[0] : templates;
      } else {
        const names = Object.keys(stacks);
        if (names.length !== 1) {
          throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
            '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
            `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
            `  Available stacks: ${names.join(' ')} (wildcards are also supported)\n`);
        }
        return stacks[names[0]];
      }

      function templateForStackName(name: string) {
        if (!stacks[name]) {
          throw new Error(`No such stack in output: ${name}`);
        }
        return stacks[name];
      }
    } finally {
      this.cleanupTemporaryFiles();
    }
  }

  /**
   * Invoke the CDK CLI with some options
   */
  public async invokeCli(args: string[], options: { json?: boolean, context?: any, verbose?: boolean, env?: any } = { }): Promise<any> {
    // Write context to cdk.json, afterwards delete. We need to do this because there is no way
    // to pass structured context data from the command-line, currently.
    if (options.context) {
      await this.writeCdkContext(options.context);
    } else {
      this.cleanupTemporaryFiles();
    }

    const cliSwitches = [
      // This would otherwise trip on every version update
      '--no-version-reporting',
      // don't inject cloudformation metadata into template
      '--no-path-metadata',
      '--no-asset-metadata',
      // save a copy step by not staging assets
      '--no-staging',
      // Different output directory
      '-o', CDK_OUTDIR,
    ];

    try {
      const cdk = require.resolve('aws-cdk/bin/cdk');
      return exec([cdk, '-a', `node ${this.name}`, ...cliSwitches, ...args], {
        cwd: this.directory,
        json: options.json,
        verbose: options.verbose,
        env: options.env,
      });
    } finally {
      this.cleanupTemporaryFiles();
    }
  }

  public hasExpected(): boolean {
    return fs.existsSync(this.expectedFilePath);
  }

  /**
   * Returns the single test stack to use.
   *
   * If the test has a single stack, it will be chosen. Otherwise a pragma is expected within the
   * test file the name of the stack:
   *
   * @example
   *
   *    /// !cdk-integ <stack-name>
   *
   */
  public async determineTestStack(): Promise<string[]> {
    const pragma = (await this.readStackPragma());
    if (pragma.length > 0) {
      return pragma;
    }

    const stacks = (await this.invokeCli(['ls'], { ...DEFAULT_SYNTH_OPTIONS })).split('\n');
    if (stacks.length !== 1) {
      throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
        '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
        `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
        `  Available stacks: ${stacks.join(' ')} (wildcards are also supported)\n`);
    }

    return stacks;
  }

  public async readExpected(): Promise<any> {
    return JSON.parse(await fs.readFile(this.expectedFilePath, { encoding: 'utf-8' }));
  }

  public async writeExpected(actual: any) {
    await fs.writeFile(this.expectedFilePath, JSON.stringify(actual, undefined, 2), { encoding: 'utf-8' });
  }

  /**
   * Return the non-stack pragmas
   *
   * These are all pragmas that start with "pragma:".
   *
   * For backwards compatibility reasons, all pragmas that DON'T start with this
   * string are considered to be stack names.
   */
  public async pragmas(): Promise<string[]> {
    return (await this.readIntegPragma()).filter(p => p.startsWith(PRAGMA_PREFIX));
  }

  private async writeCdkContext(config: any) {
    await fs.writeFile(this.cdkContextPath, JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });
  }

  private cleanupTemporaryFiles() {
    if (fs.existsSync(this.cdkContextPath)) {
      fs.unlinkSync(this.cdkContextPath);
    }

    const cdkOutPath = path.join(this.directory, CDK_OUTDIR);
    if (fs.existsSync(cdkOutPath)) {
      fs.removeSync(cdkOutPath);
    }
  }

  /**
   * Reads stack names from the "!cdk-integ" pragma.
   *
   * Every word that's NOT prefixed by "pragma:" is considered a stack name.
   *
   * @example
   *
   *    /// !cdk-integ <stack-name>
   */
  private async readStackPragma(): Promise<string[]> {
    return (await this.readIntegPragma()).filter(p => !p.startsWith(PRAGMA_PREFIX));
  }

  /**
   * Read arbitrary cdk-integ pragma directives
   *
   * Reads the test source file and looks for the "!cdk-integ" pragma. If it exists, returns it's
   * contents. This allows integ tests to supply custom command line arguments to "cdk deploy" and "cdk synth".
   *
   * @example
   *
   *    /// !cdk-integ [...]
   */
  private async readIntegPragma(): Promise<string[]> {
    const source = await fs.readFile(this.sourceFilePath, { encoding: 'utf-8' });
    const pragmaLine = source.split('\n').find(x => x.startsWith(CDK_INTEG_STACK_PRAGMA + ' '));
    if (!pragmaLine) {
      return [];
    }

    const args = pragmaLine.substring(CDK_INTEG_STACK_PRAGMA.length).trim().split(' ');
    if (args.length === 0) {
      throw new Error(`Invalid syntax for cdk-integ pragma. Usage: "${CDK_INTEG_STACK_PRAGMA} [STACK] [pragma:PRAGMA] [...]"`);
    }
    return args;
  }
}

// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
export const DEFAULT_SYNTH_OPTIONS = {
  context: {
    [AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY]: ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'availability-zones:account=12345678:region=test-region': ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region': '{"image_id": "ami-1234"}',
    // eslint-disable-next-line max-len
    'ami:account=12345678:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=test-region': 'ami-1234',
    'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': {
      vpcId: 'vpc-60900905',
      subnetGroups: [
        {
          type: 'Public',
          name: 'Public',
          subnets: [
            {
              subnetId: 'subnet-e19455ca',
              availabilityZone: 'us-east-1a',
              routeTableId: 'rtb-e19455ca',
            },
            {
              subnetId: 'subnet-e0c24797',
              availabilityZone: 'us-east-1b',
              routeTableId: 'rtb-e0c24797',
            },
            {
              subnetId: 'subnet-ccd77395',
              availabilityZone: 'us-east-1c',
              routeTableId: 'rtb-ccd77395',
            },
          ],
        },
      ],
    },
    '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport': true,
  },
  env: {
    CDK_INTEG_ACCOUNT: '12345678',
    CDK_INTEG_REGION: 'test-region',
  },
};

/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine: string[], options: { cwd?: string, json?: boolean, verbose?: boolean, env?: any } = { }): any {
  const proc = spawnSync(commandLine[0], commandLine.slice(1), {
    stdio: ['ignore', 'pipe', options.verbose ? 'inherit' : 'pipe'], // inherit STDERR in verbose mode
    env: {
      ...process.env,
      CDK_INTEG_MODE: '1',
      ...options.env,
    },
    cwd: options.cwd,
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
    // eslint-disable-next-line no-console
    console.error('Not JSON: ' + output);
    throw new Error('Command output is not JSON');
  }
}
