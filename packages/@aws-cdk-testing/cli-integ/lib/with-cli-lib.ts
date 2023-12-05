import * as os from 'os';
import * as path from 'path';
import { TestContext } from './integ-test';
import { RESOURCES_DIR } from './resources';
import { AwsContext, withAws } from './with-aws';
import { cloneDirectory, installNpmPackages, TestFixture, DEFAULT_TEST_TIMEOUT_S, CdkCliOptions } from './with-cdk-app';
import { withTimeout } from './with-timeout';

/**
 * Higher order function to execute a block with a CliLib Integration CDK app fixture
 */
export function withCliLibIntegrationCdkApp<A extends TestContext & AwsContext>(block: (context: CliLibIntegrationTestFixture) => Promise<void>) {
  return async (context: A) => {
    const randy = context.randomString;
    const stackNamePrefix = `cdktest-${randy}`;
    const integTestDir = path.join(os.tmpdir(), `cdk-integ-${randy}`);

    context.log(` Stack prefix:   ${stackNamePrefix}\n`);
    context.log(` Test directory: ${integTestDir}\n`);
    context.log(` Region:         ${context.aws.region}\n`);

    await cloneDirectory(path.join(RESOURCES_DIR, 'cdk-apps', 'simple-app'), integTestDir, context.output);
    const fixture = new CliLibIntegrationTestFixture(
      integTestDir,
      stackNamePrefix,
      context.output,
      context.aws,
      context.randomString);

    let success = true;
    try {
      const installationVersion = fixture.packages.requestedFrameworkVersion();

      if (fixture.packages.majorVersion() === '1') {
        throw new Error('This test suite is only compatible with AWS CDK v2');
      }

      const alphaInstallationVersion = fixture.packages.requestedAlphaVersion();
      await installNpmPackages(fixture, {
        'aws-cdk-lib': installationVersion,
        '@aws-cdk/cli-lib-alpha': alphaInstallationVersion,
        '@aws-cdk/aws-lambda-go-alpha': alphaInstallationVersion,
        '@aws-cdk/aws-lambda-python-alpha': alphaInstallationVersion,
        'constructs': '^10',
      });

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
export function withCliLibFixture(block: (context: CliLibIntegrationTestFixture) => Promise<void>) {
  return withAws(withTimeout(DEFAULT_TEST_TIMEOUT_S, withCliLibIntegrationCdkApp(block)));
}

export class CliLibIntegrationTestFixture extends TestFixture {
  /**
   *
   */
  public async cdk(args: string[], options: CdkCliOptions = {}) {
    const action = args[0];
    const stackName = args[1];

    const cliOpts: Record<string, any> = {
      stacks: stackName ? [stackName] : undefined,
    };

    if (action === 'deploy') {
      cliOpts.requireApproval = options.neverRequireApproval ? 'never' : 'broadening';
    }

    return this.shell(['node', '--input-type=module', `<<__EOS__
      import { AwsCdkCli } from '@aws-cdk/cli-lib-alpha';
      const cli = AwsCdkCli.fromCdkAppDirectory();

      await cli.${action}(${JSON.stringify(cliOpts)});
__EOS__`], {
      ...options,
      modEnv: {
        AWS_REGION: this.aws.region,
        AWS_DEFAULT_REGION: this.aws.region,
        STACK_NAME_PREFIX: this.stackNamePrefix,
        PACKAGE_LAYOUT_VERSION: this.packages.majorVersion(),
        ...options.modEnv,
      },
    });
  }

}
