import * as cxapi from '@aws-cdk/cx-api';
import '@jsii/check-node/run';
import * as chalk from 'chalk';

import { DeploymentMethod } from './api';
import { HotswapMode } from './api/hotswap/common';
import { ILock } from './api/util/rwlock';
import { parseCommandLineArguments } from './parse-command-line-arguments';
import { checkForPlatformWarnings } from './platform-warnings';
import { enableTracing } from './util/tracing';
import { SdkProvider } from '../lib/api/aws-auth';
import { BootstrapSource, Bootstrapper } from '../lib/api/bootstrap';
import { StackSelector } from '../lib/api/cxapp/cloud-assembly';
import { CloudExecutable, Synthesizer } from '../lib/api/cxapp/cloud-executable';
import { execProgram } from '../lib/api/cxapp/exec';
import { Deployments } from '../lib/api/deployments';
import { PluginHost } from '../lib/api/plugin';
import { ToolkitInfo } from '../lib/api/toolkit-info';
import { CdkToolkit, AssetBuildTime } from '../lib/cdk-toolkit';
import { contextHandler as context } from '../lib/commands/context';
import { docs } from '../lib/commands/docs';
import { doctor } from '../lib/commands/doctor';
import { getMigrateScanType } from '../lib/commands/migrate';
import { cliInit, printAvailableTemplates } from '../lib/init';
import { data, debug, error, print, setCI, setLogLevel, LogLevel } from '../lib/logging';
import { Notices } from '../lib/notices';
import { Command, Configuration, Settings } from '../lib/settings';
import * as version from '../lib/version';
import { SdkToCliLogger } from './api/aws-auth/sdk-logger';
import { ToolkitError } from './toolkit/error';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */ // yargs

if (!process.stdout.isTTY) {
  // Disable chalk color highlighting
  process.env.FORCE_COLOR = '0';
}

export async function exec(args: string[], synthesizer?: Synthesizer): Promise<number | void> {
  const argv = await parseCommandLineArguments(args);

  // if one -v, log at a DEBUG level
  // if 2 -v, log at a TRACE level
  if (argv.verbose) {
    let logLevel: LogLevel;
    switch (argv.verbose) {
      case 1:
        logLevel = LogLevel.DEBUG;
        break;
      case 2:
      default:
        logLevel = LogLevel.TRACE;
        break;
    }
    setLogLevel(logLevel);
  }

  // Debug should always imply tracing
  if (argv.debug || argv.verbose > 2) {
    enableTracing(true);
  }

  if (argv.ci) {
    setCI(true);
  }

  try {
    await checkForPlatformWarnings();
  } catch (e) {
    debug(`Error while checking for platform warnings: ${e}`);
  }

  debug('CDK toolkit version:', version.DISPLAY_VERSION);
  debug('Command line arguments:', argv);

  const configuration = new Configuration({
    commandLineArguments: {
      ...argv,
      _: argv._ as [Command, ...string[]], // TypeScript at its best
    },
  });
  await configuration.load();

  const cmd = argv._[0];

  const notices = Notices.create({
    context: configuration.context,
    output: configuration.settings.get(['outdir']),
    shouldDisplay: configuration.settings.get(['notices']),
    includeAcknowledged: cmd === 'notices' ? !argv.unacknowledged : false,
    httpOptions: {
      proxyAddress: configuration.settings.get(['proxy']),
      caBundlePath: configuration.settings.get(['caBundlePath']),
    },
  });
  await notices.refresh();

  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: configuration.settings.get(['profile']),
    httpOptions: {
      proxyAddress: argv.proxy,
      caBundlePath: argv['ca-bundle-path'],
    },
    logger: new SdkToCliLogger(),
  });

  let outDirLock: ILock | undefined;
  const cloudExecutable = new CloudExecutable({
    configuration,
    sdkProvider,
    synthesizer:
      synthesizer ??
      (async (aws, config) => {
        // Invoke 'execProgram', and copy the lock for the directory in the global
        // variable here. It will be released when the CLI exits. Locks are not re-entrant
        // so release it if we have to synthesize more than once (because of context lookups).
        await outDirLock?.release();
        const { assembly, lock } = await execProgram(aws, config);
        outDirLock = lock;
        return assembly;
      }),
  });

  /** Function to load plug-ins, using configurations additively. */
  function loadPlugins(...settings: Settings[]) {
    const loaded = new Set<string>();
    for (const source of settings) {
      const plugins: string[] = source.get(['plugin']) || [];
      for (const plugin of plugins) {
        const resolved = tryResolve(plugin);
        if (loaded.has(resolved)) {
          continue;
        }
        debug(`Loading plug-in: ${chalk.green(plugin)} from ${chalk.blue(resolved)}`);
        PluginHost.instance.load(plugin);
        loaded.add(resolved);
      }
    }

    function tryResolve(plugin: string): string {
      try {
        return require.resolve(plugin);
      } catch (e: any) {
        error(`Unable to resolve plugin ${chalk.green(plugin)}: ${e.stack}`);
        throw new ToolkitError(`Unable to resolve plug-in: ${plugin}`);
      }
    }
  }

  loadPlugins(configuration.settings);

  if (typeof(cmd) !== 'string') {
    throw new ToolkitError(`First argument should be a string. Got: ${cmd} (${typeof(cmd)})`);
  }

  try {
    return await main(cmd, argv);
  } finally {
    // If we locked the 'cdk.out' directory, release it here.
    await outDirLock?.release();

    // Do PSAs here
    await version.displayVersionMessage();

    if (cmd === 'notices') {
      await notices.refresh({ force: true });
      notices.display({ showTotal: argv.unacknowledged });

    } else if (cmd !== 'version') {
      await notices.refresh();
      notices.display();
    }
  }

  async function main(command: string, args: any): Promise<number | void> {
    const toolkitStackName: string = ToolkitInfo.determineName(configuration.settings.get(['toolkitStackName']));
    debug(`Toolkit stack: ${chalk.bold(toolkitStackName)}`);

    const cloudFormation = new Deployments({ sdkProvider, toolkitStackName });

    if (args.all && args.STACKS) {
      throw new ToolkitError('You must either specify a list of Stacks or the `--all` argument');
    }

    args.STACKS = args.STACKS ?? (args.STACK ? [args.STACK] : []);
    args.ENVIRONMENTS = args.ENVIRONMENTS ?? [];

    const selector: StackSelector = {
      allTopLevel: args.all,
      patterns: args.STACKS,
    };

    const cli = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      verbose: argv.trace || argv.verbose > 0,
      ignoreErrors: argv['ignore-errors'],
      strict: argv.strict,
      configuration,
      sdkProvider,
    });

    switch (command) {
      case 'context':
        return context({
          context: configuration.context,
          clear: argv.clear,
          json: argv.json,
          force: argv.force,
          reset: argv.reset,
        });

      case 'docs':
        return docs({ browser: configuration.settings.get(['browser']) });

      case 'doctor':
        return doctor();

      case 'ls':
      case 'list':
        return cli.list(args.STACKS, {
          long: args.long,
          json: argv.json,
          showDeps: args.showDependencies,
        });

      case 'diff':
        const enableDiffNoFail = isFeatureEnabled(configuration, cxapi.ENABLE_DIFF_NO_FAIL_CONTEXT);
        return cli.diff({
          stackNames: args.STACKS,
          exclusively: args.exclusively,
          templatePath: args.template,
          strict: args.strict,
          contextLines: args.contextLines,
          securityOnly: args.securityOnly,
          fail: args.fail != null ? args.fail : !enableDiffNoFail,
          stream: args.ci ? process.stdout : undefined,
          compareAgainstProcessedTemplate: args.processed,
          quiet: args.quiet,
          changeSet: args['change-set'],
          toolkitStackName: toolkitStackName,
        });

      case 'bootstrap':
        const source: BootstrapSource = determineBootstrapVersion(args);

        if (args.showTemplate) {
          const bootstrapper = new Bootstrapper(source);
          return bootstrapper.showTemplate(args.json);
        }

        return cli.bootstrap(args.ENVIRONMENTS, {
          source,
          roleArn: args.roleArn,
          force: argv.force,
          toolkitStackName: toolkitStackName,
          execute: args.execute,
          tags: configuration.settings.get(['tags']),
          terminationProtection: args.terminationProtection,
          usePreviousParameters: args['previous-parameters'],
          parameters: {
            bucketName: configuration.settings.get(['toolkitBucket', 'bucketName']),
            kmsKeyId: configuration.settings.get(['toolkitBucket', 'kmsKeyId']),
            createCustomerMasterKey: args.bootstrapCustomerKey,
            qualifier: args.qualifier ?? configuration.context.get('@aws-cdk/core:bootstrapQualifier'),
            publicAccessBlockConfiguration: args.publicAccessBlockConfiguration,
            examplePermissionsBoundary: argv.examplePermissionsBoundary,
            customPermissionsBoundary: argv.customPermissionsBoundary,
            trustedAccounts: arrayFromYargs(args.trust),
            trustedAccountsForLookup: arrayFromYargs(args.trustForLookup),
            cloudFormationExecutionPolicies: arrayFromYargs(args.cloudformationExecutionPolicies),
          },
        });

      case 'deploy':
        const parameterMap: { [name: string]: string | undefined } = {};
        for (const parameter of args.parameters) {
          if (typeof parameter === 'string') {
            const keyValue = (parameter as string).split('=');
            parameterMap[keyValue[0]] = keyValue.slice(1).join('=');
          }
        }

        if (args.execute !== undefined && args.method !== undefined) {
          throw new ToolkitError('Can not supply both --[no-]execute and --method at the same time');
        }

        let deploymentMethod: DeploymentMethod | undefined;
        switch (args.method) {
          case 'direct':
            if (args.changeSetName) {
              throw new ToolkitError('--change-set-name cannot be used with method=direct');
            }
            if (args.importExistingResources) {
              throw new Error('--import-existing-resources cannot be enabled with method=direct');
            }
            deploymentMethod = { method: 'direct' };
            break;
          case 'change-set':
            deploymentMethod = {
              method: 'change-set',
              execute: true,
              changeSetName: args.changeSetName,
              importExistingResources: args.importExistingResources,
            };
            break;
          case 'prepare-change-set':
            deploymentMethod = {
              method: 'change-set',
              execute: false,
              changeSetName: args.changeSetName,
              importExistingResources: args.importExistingResources,
            };
            break;
          case undefined:
            deploymentMethod = {
              method: 'change-set',
              execute: args.execute ?? true,
              changeSetName: args.changeSetName,
              importExistingResources: args.importExistingResources,
            };
            break;
        }

        return cli.deploy({
          selector,
          exclusively: args.exclusively,
          toolkitStackName,
          roleArn: args.roleArn,
          notificationArns: args.notificationArns,
          requireApproval: configuration.settings.get(['requireApproval']),
          reuseAssets: args['build-exclude'],
          tags: configuration.settings.get(['tags']),
          deploymentMethod,
          force: args.force,
          parameters: parameterMap,
          usePreviousParameters: args['previous-parameters'],
          outputsFile: configuration.settings.get(['outputsFile']),
          progress: configuration.settings.get(['progress']),
          ci: args.ci,
          rollback: configuration.settings.get(['rollback']),
          hotswap: determineHotswapMode(args.hotswap, args.hotswapFallback),
          watch: args.watch,
          traceLogs: args.logs,
          concurrency: args.concurrency,
          assetParallelism: configuration.settings.get(['assetParallelism']),
          assetBuildTime: configuration.settings.get(['assetPrebuild'])
            ? AssetBuildTime.ALL_BEFORE_DEPLOY
            : AssetBuildTime.JUST_IN_TIME,
          ignoreNoStacks: args.ignoreNoStacks,
        });

      case 'rollback':
        return cli.rollback({
          selector,
          toolkitStackName,
          roleArn: args.roleArn,
          force: args.force,
          validateBootstrapStackVersion: args['validate-bootstrap-version'],
          orphanLogicalIds: args.orphan,
        });

      case 'import':
        return cli.import({
          selector,
          toolkitStackName,
          roleArn: args.roleArn,
          deploymentMethod: {
            method: 'change-set',
            execute: args.execute,
            changeSetName: args.changeSetName,
          },
          progress: configuration.settings.get(['progress']),
          rollback: configuration.settings.get(['rollback']),
          recordResourceMapping: args['record-resource-mapping'],
          resourceMappingFile: args['resource-mapping'],
          force: args.force,
        });

      case 'watch':
        return cli.watch({
          selector,
          exclusively: args.exclusively,
          toolkitStackName,
          roleArn: args.roleArn,
          reuseAssets: args['build-exclude'],
          deploymentMethod: {
            method: 'change-set',
            changeSetName: args.changeSetName,
          },
          force: args.force,
          progress: configuration.settings.get(['progress']),
          rollback: configuration.settings.get(['rollback']),
          hotswap: determineHotswapMode(args.hotswap, args.hotswapFallback, true),
          traceLogs: args.logs,
          concurrency: args.concurrency,
        });

      case 'destroy':
        return cli.destroy({
          selector,
          exclusively: args.exclusively,
          force: args.force,
          roleArn: args.roleArn,
          ci: args.ci,
        });

      case 'gc':
        if (!configuration.settings.get(['unstable']).includes('gc')) {
          throw new ToolkitError('Unstable feature use: \'gc\' is unstable. It must be opted in via \'--unstable\', e.g. \'cdk gc --unstable=gc\'');
        }
        return cli.garbageCollect(args.ENVIRONMENTS, {
          action: args.action,
          type: args.type,
          rollbackBufferDays: args['rollback-buffer-days'],
          createdBufferDays: args['created-buffer-days'],
          bootstrapStackName: args.bootstrapStackName,
          confirm: args.confirm,
        });

      case 'synthesize':
      case 'synth':
        const quiet = configuration.settings.get(['quiet']) ?? args.quiet;
        if (args.exclusively) {
          return cli.synth(args.STACKS, args.exclusively, quiet, args.validation, argv.json);
        } else {
          return cli.synth(args.STACKS, true, quiet, args.validation, argv.json);
        }

      case 'notices':
        // This is a valid command, but we're postponing its execution
        return;

      case 'metadata':
        return cli.metadata(args.STACK, argv.json);

      case 'acknowledge':
      case 'ack':
        return cli.acknowledge(args.ID);

      case 'init':
        const language = configuration.settings.get(['language']);
        if (args.list) {
          return printAvailableTemplates(language);
        } else {
          return cliInit({
            type: args.TEMPLATE,
            language,
            canUseNetwork: undefined,
            generateOnly: args.generateOnly,
          });
        }
      case 'migrate':
        return cli.migrate({
          stackName: args['stack-name'],
          fromPath: args['from-path'],
          fromStack: args['from-stack'],
          language: args.language,
          outputPath: args['output-path'],
          fromScan: getMigrateScanType(args['from-scan']),
          filter: args.filter,
          account: args.account,
          region: args.region,
          compress: args.compress,
        });
      case 'version':
        return data(version.DISPLAY_VERSION);

      default:
        throw new ToolkitError('Unknown command: ' + command);
    }
  }
}

/**
 * Determine which version of bootstrapping
 */
function determineBootstrapVersion(args: { template?: string }): BootstrapSource {
  let source: BootstrapSource;
  if (args.template) {
    print(`Using bootstrapping template from ${args.template}`);
    source = { source: 'custom', templateFile: args.template };
  } else if (process.env.CDK_LEGACY_BOOTSTRAP) {
    print('CDK_LEGACY_BOOTSTRAP set, using legacy-style bootstrapping');
    source = { source: 'legacy' };
  } else {
    // in V2, the "new" bootstrapping is the default
    source = { source: 'default' };
  }
  return source;
}

function isFeatureEnabled(configuration: Configuration, featureFlag: string) {
  return configuration.context.get(featureFlag) ?? cxapi.futureFlagDefault(featureFlag);
}

/**
 * Translate a Yargs input array to something that makes more sense in a programming language
 * model (telling the difference between absence and an empty array)
 *
 * - An empty array is the default case, meaning the user didn't pass any arguments. We return
 *   undefined.
 * - If the user passed a single empty string, they did something like `--array=`, which we'll
 *   take to mean they passed an empty array.
 */
function arrayFromYargs(xs: string[]): string[] | undefined {
  if (xs.length === 0) {
    return undefined;
  }
  return xs.filter((x) => x !== '');
}

function determineHotswapMode(hotswap?: boolean, hotswapFallback?: boolean, watch?: boolean): HotswapMode {
  if (hotswap && hotswapFallback) {
    throw new ToolkitError('Can not supply both --hotswap and --hotswap-fallback at the same time');
  } else if (!hotswap && !hotswapFallback) {
    if (hotswap === undefined && hotswapFallback === undefined) {
      return watch ? HotswapMode.HOTSWAP_ONLY : HotswapMode.FULL_DEPLOYMENT;
    } else if (hotswap === false || hotswapFallback === false) {
      return HotswapMode.FULL_DEPLOYMENT;
    }
  }

  let hotswapMode: HotswapMode;
  if (hotswap) {
    hotswapMode = HotswapMode.HOTSWAP_ONLY;
  /*if (hotswapFallback)*/
  } else {
    hotswapMode = HotswapMode.FALL_BACK;
  }

  return hotswapMode;
}

/* istanbul ignore next: we never call this in unit tests */
export function cli(args: string[] = process.argv.slice(2)) {
  exec(args)
    .then(async (value) => {
      if (typeof value === 'number') {
        process.exitCode = value;
      }
    })
    .catch((err) => {
      error(err.message);

      // Log the stack trace if we're on a developer workstation. Otherwise this will be into a minified
      // file and the printed code line and stack trace are huge and useless.
      if (err.stack && version.isDeveloperBuild()) {
        debug(err.stack);
      }
      process.exitCode = 1;
    });
}
