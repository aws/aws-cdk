/* eslint-disable no-console */
import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as yargs from 'yargs';
import { shell } from '../lib';
import { TestRepository } from '../lib/staging/codeartifact';
import { uploadJavaPackages, mavenLogin } from '../lib/staging/maven';
import { uploadNpmPackages, npmLogin } from '../lib/staging/npm';
import { uploadDotnetPackages, nugetLogin } from '../lib/staging/nuget';
import { uploadPythonPackages, pypiLogin } from '../lib/staging/pypi';
import { UsageDir } from '../lib/staging/usage-dir';

async function main() {
  await yargs
    .usage('$0 <command>')
    .option('npm', {
      description: 'Upload NPM packages only',
      type: 'boolean',
      requiresArg: false,
    })
    .option('python', {
      description: 'Upload Python packages only',
      type: 'boolean',
      requiresArg: false,
    })
    .option('java', {
      description: 'Upload Java packages only',
      type: 'boolean',
      requiresArg: false,
    })
    .option('dotnet', {
      description: 'Upload Dotnet packages only',
      type: 'boolean',
      requiresArg: false,
    })
    .option('regression', {
      description: 'Enable access to previous versions of the staged packages (this is expensive for CodeArtifact so we only do it when necessary)',
      type: 'boolean',
      requiresArg: false,
      default: false,
    })
    .command('publish <DIRECTORY>', 'Publish a given directory', cmd => cmd
      .positional('DIRECTORY', {
        descripton: 'Directory distribution',
        type: 'string',
        demandOption: true,
      })
      .option('name', {
        alias: 'n',
        description: 'Name of the repository to create (default: generate unique name)',
        type: 'string',
        requiresArg: true,
      }), async (args) => {

      await validateDirectory(args);
      const repo = await (args.name ? TestRepository.newWithName(args.name) : TestRepository.newRandom());
      const usageDir = UsageDir.default();

      await doLogin(repo, usageDir, args);
      await publish(repo, usageDir, args);

      header('Done');
      usageDir.advertise();
    })
    .command('login', 'Login to a given repository', cmd => cmd
      .option('name', {
        alias: 'n',
        description: 'Name of the repository to log in to',
        type: 'string',
        requiresArg: true,
        demandOption: true,
      }), async (args) => {

      const repo = TestRepository.existing(args.name);
      const usageDir = UsageDir.default();

      await doLogin(repo, usageDir, args);

      usageDir.advertise();
    })
    .command('run <DIRECTORY> <COMMAND..>', 'Publish and run a command', cmd => cmd
      .positional('DIRECTORY', {
        descripton: 'Directory distribution',
        type: 'string',
        demandOption: true,
      })
      .positional('COMMAND', {
        alias: 'c',
        description: 'Run the given command with the packages staged',
        type: 'string',
        array: true,
        demandOption: true,
      })
      .option('cleanup', {
        alias: 'C',
        description: 'Cleanup the repository afterwards',
        type: 'boolean',
        default: true,
        requiresArg: false,
      }), async (args) => {

      await validateDirectory(args);
      const repo = await TestRepository.newRandom();
      const usageDir = UsageDir.default();

      await doLogin(repo, usageDir, args);
      await publish(repo, usageDir, args);

      try {
        await usageDir.activateInCurrentProcess();

        await shell(args.COMMAND ?? [], {
          shell: true,
          show: 'always',
        });

      } finally {
        if (args.cleanup) {
          await repo.delete();
        }
      }
    })
    .command('cleanup', 'Clean up testing repository', cmd => cmd
      .option('name', {
        alias: 'n',
        description: 'Name of the repository to cleanup (default: most recent)',
        type: 'string',
        requiresArg: true,
      }), async (args) => {

      const usageDir = UsageDir.default();

      let repositoryName = args.name;
      if (!repositoryName) {
        repositoryName = (await usageDir.currentEnv()).CODEARTIFACT_REPO;
      }

      if (!repositoryName) {
        console.log(`No --name given and no $CODEARTIFACT_REPO found in ${usageDir.directory}, nothing cleaned up`);
        return;
      }

      const repo = TestRepository.existing(repositoryName);
      await repo.delete();
    })
    .command('gc', 'Clean up day-old testing repositories', cmd => cmd, async () => {
      await TestRepository.gc();
    })
    .demandCommand(1, 'You must supply a command')
    .help()
    .showHelpOnFail(false)
    .parse();
}

async function validateDirectory(args: {
  DIRECTORY: string,
}) {
  if (!await fs.pathExists(path.join(args.DIRECTORY, 'build.json'))) {
    throw new Error(`${args.DIRECTORY} does not look like a CDK dist directory (build.json missing)`);
  }
}

async function doLogin(repo: TestRepository, usageDir: UsageDir, args: {
  npm?: boolean;
  python?: boolean;
  java?: boolean;
  dotnet?: boolean;
}) {
  const login = await repo.loginInformation();

  const oldEnv = await usageDir.currentEnv();

  await usageDir.clean();
  await usageDir.addToEnv({
    CODEARTIFACT_REPO: login.repositoryName,
  });

  if (oldEnv.BUILD_VERSION) {
    await usageDir.addToEnv({
      BUILD_VERSION: oldEnv.BUILD_VERSION,
    });
  }

  const doRepo = whichRepos(args);

  await doRepo.npm(() => npmLogin(login, usageDir));
  await doRepo.python(() => pypiLogin(login, usageDir));
  await doRepo.java(() => mavenLogin(login, usageDir));
  await doRepo.dotnet(() => nugetLogin(login, usageDir));
}

async function publish(repo: TestRepository, usageDir: UsageDir, args: {
  DIRECTORY: string,
  npm?: boolean;
  python?: boolean;
  java?: boolean;
  dotnet?: boolean;
  regression?: boolean;
}) {
  const directory = `${args.DIRECTORY}`;
  const login = await repo.loginInformation();

  const doRepo = whichRepos(args);

  const buildJson = await fs.readJson(path.join(directory, 'build.json'));
  await usageDir.addToEnv({
    BUILD_VERSION: buildJson.version,
  });

  await doRepo.npm(async () => {
    header('NPM');
    await uploadNpmPackages(glob.sync(path.join(directory, 'js', '*.tgz')), login, usageDir);
  });

  await doRepo.python(async () => {
    header('Python');
    await uploadPythonPackages(glob.sync(path.join(directory, 'python', '*')), login);
  });

  await doRepo.java(async () => {
    header('Java');
    await uploadJavaPackages(glob.sync(path.join(directory, 'java', '**', '*.pom')), login, usageDir);
  });

  await doRepo.dotnet(async () => {
    header('.NET');
    await uploadDotnetPackages(glob.sync(path.join(directory, 'dotnet', '**', '*.nupkg')), usageDir);
  });

  if (args.regression) {
    console.log('🛍 Configuring packages for upstream versions');
    await repo.markAllUpstreamAllow();
  }
}

function whichRepos(args: {
  npm?: boolean;
  python?: boolean;
  java?: boolean;
  dotnet?: boolean;
}) {
  const all = args.npm === undefined && args.python === undefined && args.java === undefined && args.dotnet === undefined;

  const invoke = (block: () => Promise<void>) => block();
  const skip = () => { };

  return {
    npm: args.npm || all ? invoke : skip,
    python: args.python || all ? invoke : skip,
    java: args.java || all ? invoke : skip,
    dotnet: args.dotnet || all ? invoke : skip,
  };
}

function header(caption: string) {
  console.log('');
  console.log('/'.repeat(70));
  console.log(`//  ${caption}`);
  console.log('');
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
