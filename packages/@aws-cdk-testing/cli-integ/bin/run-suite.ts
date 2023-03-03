/* eslint-disable no-console */
import * as path from 'path';
// eslint-disable-next-line jest/no-jest-import
import * as jest from 'jest';
import * as yargs from 'yargs';
import { ReleasePackageSourceSetup } from '../lib/package-sources/release-source';
import { RepoPackageSourceSetup, autoFindRoot } from '../lib/package-sources/repo-source';
import { IPackageSourceSetup } from '../lib/package-sources/source';
import { serializeForSubprocess } from '../lib/package-sources/subprocess';

async function main() {
  const args = await yargs
    .usage('$0 <SUITENAME>')
    .positional('SUITENAME', {
      descripton: 'Name of the test suite to run',
      type: 'string',
      demandOption: true,
    })
    .option('test', {
      descripton: 'Test pattern to selectively run tests',
      alias: 't',
      type: 'string',
      requiresArg: true,
    })
    .option('test-file', {
      description: 'The specific test file to run',
      type: 'string',
      requiresArg: true,
    })
    .option('use-source', {
      descripton: 'Use TypeScript packages from the given source repository (or "auto")',
      alias: 's',
      type: 'string',
      requiresArg: true,
    })
    .option('use-cli-release', {
      descripton: 'Run the current tests against the CLI at the given version',
      alias: 'u',
      type: 'string',
      requiresArg: true,
    })
    .option('auto-source', {
      alias: 'a',
      description: 'Automatically find the source tree from the current working directory',
      type: 'boolean',
      requiresArg: false,
    })
    .option('runInBand', {
      descripton: 'Run all tests in one Node process',
      alias: 'i',
      type: 'boolean',
    })
    .options('framework-version', {
      description: 'Framework version to use, if different than the CLI version (not all suites respect this)',
      alias: 'f',
      type: 'string',
    })
    .options('verbose', {
      alias: 'v',
      description: 'Run in verbose mode',
      type: 'boolean',
      requiresArg: false,
    })
    .options('passWithNoTests', {
      description: 'Allow passing if the test suite is not found (default true when IS_CANARY mode, false otherwise)',
      type: 'boolean',
      requiresArg: false,
    })
    .help()
    .showHelpOnFail(false)
    .argv;

  const suiteName = args._[0] as string;
  if (!suiteName) {
    throw new Error('Usage: run-suite <SUITENAME>');
  }

  let packageSource: undefined | IPackageSourceSetup;
  function usePackageSource(s: IPackageSourceSetup) {
    if (packageSource) {
      throw new Error('Cannot specify two package sources');
    }
    packageSource = s;
  }

  if (args['use-source'] || args['auto-source']) {
    if (args['framework-version']) {
      throw new Error('Cannot use --framework-version with --use-source');
    }

    const root = args['use-source'] && args['use-source'] !== 'auto'
      ? args['use-source']
      : await autoFindRoot();

    usePackageSource(new RepoPackageSourceSetup(root));
  } else if (args['use-cli-release']) {
    usePackageSource(new ReleasePackageSourceSetup(args['use-cli-release'], args['framework-version']));
  }
  if (!packageSource) {
    throw new Error('Specify either --use-source or --use-cli-release');
  }

  console.log(`Package source: ${packageSource.description}`);
  console.log(`Test suite:     ${suiteName}`);

  await packageSource.prepare();
  serializeForSubprocess(packageSource);

  if (args.verbose) {
    process.env.VERBOSE = '1';
  }

  // Motivation behind this behavior: when adding a new test suite to the pipeline, because of the way our
  // Pipeline package works, the suite would be added to the pipeline AND as a canary immediately. The canary
  // would fail until the package was actually released, so for canaries we make an exception so that the initial
  // canary would succeed even if the suite wasn't yet available. The fact that the suite is not optional in
  // the pipeline protects us from typos.
  const passWithNoTests = args.passWithNoTests ?? !!process.env.IS_CANARY;

  // Communicate with the config file (integ.jest.config.js)
  process.env.TEST_SUITE_NAME = suiteName;

  try {
    await jest.run([
      ...args.runInBand ? ['-i'] : [],
      ...args.test ? ['-t', args.test] : [],
      ...args.verbose ? ['--verbose'] : [],
      ...passWithNoTests ? ['--passWithNoTests'] : [],
      ...args['test-file'] ? [args['test-file']] : [],
    ], path.resolve(__dirname, '..', 'resources', 'integ.jest.config.js'));

  } finally {
    await packageSource.cleanup();
  }
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
