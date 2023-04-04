import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import axios from 'axios';
import { TestContext } from './integ-test';
import { RESOURCES_DIR } from './resources';
import { ShellOptions, rimraf } from './shell';
import { AwsContext, withAws } from './with-aws';
import { cloneDirectory, installNpmPackages, TestFixture, DEFAULT_TEST_TIMEOUT_S } from './with-cdk-app';
import { withTimeout } from './with-timeout';


export interface ActionOutput {
  actionSucceeded?: boolean;
  actionOutput?: any;
  shellOutput?: string;
}

/**
 * Higher order function to execute a block with a SAM Integration CDK app fixture
 */
export function withSamIntegrationCdkApp<A extends TestContext & AwsContext>(block: (context: SamIntegrationTestFixture) => Promise<void>) {
  return async (context: A) => {
    const randy = context.randomString;
    const stackNamePrefix = `cdktest-${randy}`;
    const integTestDir = path.join(os.tmpdir(), `cdk-integ-${randy}`);

    context.log(` Stack prefix:   ${stackNamePrefix}\n`);
    context.log(` Test directory: ${integTestDir}\n`);
    context.log(` Region:         ${context.aws.region}\n`);

    await cloneDirectory(path.join(RESOURCES_DIR, 'cdk-apps', 'sam_cdk_integ_app'), integTestDir, context.output);
    const fixture = new SamIntegrationTestFixture(
      integTestDir,
      stackNamePrefix,
      context.output,
      context.aws,
      context.randomString);

    let success = true;
    try {
      const installationVersion = fixture.packages.requestedFrameworkVersion();

      if (fixture.packages.majorVersion() === '1') {
        await installNpmPackages(fixture, {
          '@aws-cdk/aws-iam': installationVersion,
          '@aws-cdk/aws-apigateway': installationVersion,
          '@aws-cdk/aws-lambda': installationVersion,
          '@aws-cdk/aws-lambda-go': installationVersion,
          '@aws-cdk/aws-lambda-nodejs': installationVersion,
          '@aws-cdk/aws-lambda-python': installationVersion,
          '@aws-cdk/aws-logs': installationVersion,
          '@aws-cdk/core': installationVersion,
          'constructs': '^3',
        });
      } else {
        const alphaInstallationVersion = fixture.packages.requestedAlphaVersion();
        await installNpmPackages(fixture, {
          'aws-cdk-lib': installationVersion,
          '@aws-cdk/aws-lambda-go-alpha': alphaInstallationVersion,
          '@aws-cdk/aws-lambda-python-alpha': alphaInstallationVersion,
          'constructs': '^10',
        });
      }
      await block(fixture);
    } catch (e: any) {
      // We survive certain cases involving gopkg.in
      if (errorCausedByGoPkg(e.message)) {
        return;
      }
      success = false;
      throw e;
    } finally {
      if (process.env.INTEG_NO_CLEAN) {
        context.log(`Left test directory in '${integTestDir}' ($INTEG_NO_CLEAN)\n`);
      } else {
        await fixture.dispose(success);
      }
    }
  };
}

/**
 * Return whether or not the error is being caused by gopkg.in being down
 *
 * Our Go build depends on https://gopkg.in/, which has errors pretty often
 * (every couple of days). It is run by a single volunteer.
 */
function errorCausedByGoPkg(error: string) {
  // The error is different depending on what request fails. Messages recognized:
  ////////////////////////////////////////////////////////////////////
  //    go: github.com/aws/aws-lambda-go@v1.28.0 requires
  //        gopkg.in/yaml.v3@v3.0.0-20200615113413-eeeca48fe776: invalid version: git ls-remote -q origin in /go/pkg/mod/cache/vcs/0901dc1ef67fcce1c9b3ae51078740de4a0e2dc673e720584ac302973af82f36: exit status 128:
  //        remote: Cannot obtain refs from GitHub: cannot talk to GitHub: Get https://github.com/go-yaml/yaml.git/info/refs?service=git-upload-pack: net/http: request canceled (Client.Timeout exceeded while awaiting headers)
  //        fatal: unable to access 'https://gopkg.in/yaml.v3/': The requested URL returned error: 502
  ////////////////////////////////////////////////////////////////////
  //    go: downloading github.com/aws/aws-lambda-go v1.28.0
  //    go: github.com/aws/aws-lambda-go@v1.28.0 requires
  //        gopkg.in/yaml.v3@v3.0.0-20200615113413-eeeca48fe776: unrecognized import path "gopkg.in/yaml.v3": reading https://gopkg.in/yaml.v3?go-get=1: 502 Bad Gateway
  //        server response: Cannot obtain refs from GitHub: cannot talk to GitHub: Get https://github.com/go-yaml/yaml.git/info/refs?service=git-upload-pack: net/http: request canceled (Client.Timeout exceeded while awaiting headers)
  ////////////////////////////////////////////////////////////////////
  //    go: github.com/aws/aws-lambda-go@v1.28.0 requires
  //        gopkg.in/yaml.v3@v3.0.0-20200615113413-eeeca48fe776: invalid version: git fetch -f origin refs/heads/*:refs/heads/* refs/tags/*:refs/tags/* in /go/pkg/mod/cache/vcs/0901dc1ef67fcce1c9b3ae51078740de4a0e2dc673e720584ac302973af82f36: exit status 128:
  //        error: RPC failed; HTTP 502 curl 22 The requested URL returned error: 502
  //        fatal: the remote end hung up unexpectedly
  ////////////////////////////////////////////////////////////////////

  return (error.includes('gopkg\.in.*invalid version.*exit status 128')
    || error.match(/unrecognized import path[^\n]gopkg\.in/));
}

/**
 * SAM Integration test fixture for CDK - SAM integration test cases
 */
export function withSamIntegrationFixture(block: (context: SamIntegrationTestFixture) => Promise<void>) {
  return withAws(withTimeout(DEFAULT_TEST_TIMEOUT_S, withSamIntegrationCdkApp(block)));
}

export class SamIntegrationTestFixture extends TestFixture {
  public async samShell(command: string[], filter?: string, action?: () => any, options: Omit<ShellOptions, 'cwd' | 'output'> = {}): Promise<ActionOutput> {
    return shellWithAction(command, filter, action, {
      output: this.output,
      cwd: path.join(this.integTestDir, 'cdk.out').toString(),
      ...options,
    });
  }

  public async samBuild(stackName: string) {
    const fullStackName = this.fullStackName(stackName);
    const templatePath = path.join(this.integTestDir, 'cdk.out', `${fullStackName}.template.json`);
    const args = ['--template', templatePath.toString()];
    return this.samShell(['sam', 'build', ...args]);
  }

  public async samLocalStartApi(stackName: string, isBuilt: boolean, port: number, apiPath: string): Promise<ActionOutput> {
    const fullStackName = this.fullStackName(stackName);
    const templatePath = path.join(this.integTestDir, 'cdk.out', `${fullStackName}.template.json`);
    const args = isBuilt? [] : ['--template', templatePath.toString()];
    args.push('--port');
    args.push(port.toString());

    return this.samShell(['sam', 'local', 'start-api', ...args], 'Press CTRL+C to quit', ()=>{
      return new Promise<ActionOutput>((resolve, reject) => {
        axios.get(`http://127.0.0.1:${port}${apiPath}`).then( resp => {
          resolve(resp.data);
        }).catch( error => {
          reject(new Error(`Failed to invoke api path ${apiPath} on port ${port} with error ${error}`));
        });
      });
    });
  }

  /**
   * Cleanup leftover stacks and buckets
   */
  public async dispose(success: boolean) {
    // If the tests completed successfully, happily delete the fixture
    // (otherwise leave it for humans to inspect)
    if (success) {
      rimraf(this.integTestDir);
    }
  }
}

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
export async function shellWithAction(
  command: string[],
  filter?: string,
  action?: () => Promise<any>,
  options: ShellOptions = {},
  actionTimeoutSeconds: number = 600,
): Promise<ActionOutput> {
  if (options.modEnv && options.env) {
    throw new Error('Use either env or modEnv but not both');
  }

  options.output?.write(`💻 ${command.join(' ')}\n`);

  const env = options.env ?? (options.modEnv ? { ...process.env, ...options.modEnv } : undefined);

  const child = child_process.spawn(command[0], command.slice(1), {
    ...options,
    env,
    // Need this for Windows where we want .cmd and .bat to be found as well.
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise<ActionOutput>((resolve, reject) => {
    const out = new Array<Buffer>();
    const stdout = new Array<Buffer>();
    const stderr = new Array<Buffer>();
    let actionSucceeded = false;
    let actionOutput: any;
    let actionExecuted = false;

    function executeAction(chunk: any) {
      out.push(Buffer.from(chunk));
      if (!actionExecuted && typeof filter === 'string' && Buffer.concat(out).toString('utf-8').includes(filter) && typeof action === 'function') {
        actionExecuted = true;
        options.output?.write('before executing action');
        action().then((output) => {
          options.output?.write(`action output is ${output}`);
          actionOutput = output;
          actionSucceeded = true;
        }).catch((error) => {
          options.output?.write(`action error is ${error}`);
          actionSucceeded = false;
          actionOutput = error;
        }).finally(() => {
          options.output?.write('terminate sam sub process');
          killSubProcess(child, command.join(' '));
        });
      }
    }

    if (typeof filter === 'string' && typeof action === 'function') {
      // Reject with an error if an action is configured, but the filter failed
      // to show up in the output before the timeout occurred.
      setTimeout(
        () => {
          if (!actionExecuted) {
            reject(new Error(`Timed out waiting for filter ${JSON.stringify(filter)} to appear in command output after ${actionTimeoutSeconds} seconds\nOutput so far:\n${Buffer.concat(out).toString('utf-8')}`));
          }
        }, actionTimeoutSeconds * 1_000,
      ).unref();
    }

    child.stdout!.on('data', chunk => {
      options.output?.write(chunk);
      stdout.push(chunk);
      executeAction(chunk);
    });

    child.stderr!.on('data', chunk => {
      options.output?.write(chunk);
      if (options.captureStderr ?? true) {
        stderr.push(chunk);
      }
      executeAction(chunk);
    });

    child.once('error', reject);

    child.once('close', code => {
      const output = (Buffer.concat(stdout).toString('utf-8') + Buffer.concat(stderr).toString('utf-8')).trim();
      if (code == null || code === 0 || options.allowErrExit) {
        let result = new Array<string>();
        result.push(actionOutput);
        result.push(output);
        resolve({
          actionSucceeded: actionSucceeded,
          actionOutput: actionOutput,
          shellOutput: output,
        });
      } else {
        reject(new Error(`'${command.join(' ')}' exited with error code ${code}. Output: \n${output}`));
      }
    });

  });
}

function killSubProcess(child: child_process.ChildProcess, command: string) {
  /**
   * Check if the sub process is running in container, so child_process.spawn will
   * create multiple processes, and to kill all of them we need to run different logic
   */
  if (fs.existsSync('/.dockerenv')) {
    child_process.exec(`for pid in $(ps -ef | grep "${command}" | awk '{print $2}'); do kill -2 $pid; done`);
  } else {
    child.kill('SIGINT');
  }

}
