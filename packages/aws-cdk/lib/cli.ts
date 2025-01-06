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
import { CdkToolkit, AssetBuildTime, ActionType, TypeType } from '../lib/cdk-toolkit';
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
import { convertToCliArgs } from './convert-to-cli-args';
import { CliArguments } from './cli-arguments';
import { StringWithoutPlaceholders } from './api/util/placeholders';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */ // yargs

if (!process.stdout.isTTY) {
  // Disable chalk color highlighting
  process.env.FORCE_COLOR = '0';
}

export async function exec(args: string[], synthesizer?: Synthesizer): Promise<number | void> {
  const argv: CliArguments = convertToCliArgs(await parseCommandLineArguments(args));

  // if one -v, log at a DEBUG level
  // if 2 -v, log at a TRACE level
  if (argv.globalOptions?.verbose) {
    let logLevel: LogLevel;
    switch (argv.globalOptions.verbose) {
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
  if (argv.globalOptions?.debug || (argv.globalOptions?.verbose ?? 0) > 2) {
    enableTracing(true);
  }

  if (argv.globalOptions?.ci) {
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
    commandLineArguments: argv,
  });
  await configuration.load();

  const cmd = argv._[0];

  const notices = Notices.create({
    context: configuration.context,
    output: configuration.settings.get(['outdir']),
    shouldDisplay: configuration.settings.get(['notices']),
    includeAcknowledged: cmd === 'notices' ? !argv.notices?.unacknowledged : false,
    httpOptions: {
      proxyAddress: configuration.settings.get(['proxy']),
      caBundlePath: configuration.settings.get(['caBundlePath']),
    },
  });
  await notices.refresh();

  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: configuration.settings.get(['profile']),
    httpOptions: {
      proxyAddress: argv.globalOptions?.proxy,
      caBundlePath: argv.globalOptions?.caBundlePath,
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
      notices.display({ showTotal: argv.notices?.unacknowledged });

    } else if (cmd !== 'version') {
      await notices.refresh();
      notices.display();
    }
  }

  async function main(command: string, argv: CliArguments): Promise<number | void> {
    const toolkitStackName: string = ToolkitInfo.determineName(configuration.settings.get(['toolkitStackName']));
    debug(`Toolkit stack: ${chalk.bold(toolkitStackName)}`);

    const globalOptions = argv.globalOptions ?? {};

    const cloudFormation = new Deployments({ sdkProvider, toolkitStackName });

    const cli = new CdkToolkit({
      cloudExecutable,
      deployments: cloudFormation,
      verbose: globalOptions.trace || (globalOptions.verbose ?? 0) > 0,
      ignoreErrors: globalOptions.ignoreErrors,
      strict: globalOptions.strict,
      configuration,
      sdkProvider,
    });

    switch (command) {
      case 'context':
        const contextOptions = argv.context ?? {};
        return context({
          context: configuration.context,
          clear: contextOptions.clear,
          json: globalOptions.json,
          force: contextOptions.force,
          reset: contextOptions.reset,
        });

      case 'docs':
        return docs({ browser: configuration.settings.get(['browser']) });

      case 'doctor':
        return doctor();

      case 'ls':
      case 'list':
        const listOptions = argv.list ?? {};
        return cli.list(listOptions.STACKS ?? [], {
          long: listOptions.long,
          json: globalOptions.json,
          showDeps: listOptions.showDependencies,
        });

      case 'diff':
        const enableDiffNoFail = isFeatureEnabled(configuration, cxapi.ENABLE_DIFF_NO_FAIL_CONTEXT);
        const diffOptions = argv.diff ?? {};
        return cli.diff({
          stackNames: diffOptions.STACKS ?? [],
          exclusively: diffOptions.exclusively,
          templatePath: diffOptions.template,
          strict: diffOptions.strict,
          contextLines: diffOptions.contextLines,
          securityOnly: diffOptions.securityOnly,
          fail: diffOptions.fail != null ? diffOptions.fail : !enableDiffNoFail,
          stream: globalOptions.ci ? process.stdout : undefined,
          compareAgainstProcessedTemplate: diffOptions.processed,
          quiet: diffOptions.quiet,
          changeSet: diffOptions.changeSet,
          toolkitStackName: toolkitStackName,
        });

      case 'bootstrap':
        const bootstrapOptions = argv.bootstrap ?? {};
        const source: BootstrapSource = determineBootstrapVersion(bootstrapOptions.template);

        if (bootstrapOptions.showTemplate) {
          const bootstrapper = new Bootstrapper(source);
          return bootstrapper.showTemplate(globalOptions.json ?? false);
        }

        return cli.bootstrap(bootstrapOptions.ENVIRONMENTS ?? [], {
          source,
          roleArn: globalOptions.roleArn as StringWithoutPlaceholders,
          force: bootstrapOptions.force,
          toolkitStackName: toolkitStackName,
          execute: bootstrapOptions.execute,
          tags: configuration.settings.get(['tags']),
          terminationProtection: bootstrapOptions.terminationProtection,
          usePreviousParameters: bootstrapOptions.previousParameters,
          parameters: {
            bucketName: configuration.settings.get(['toolkitBucket', 'bucketName']),
            kmsKeyId: configuration.settings.get(['toolkitBucket', 'kmsKeyId']),
            createCustomerMasterKey: bootstrapOptions.bootstrapCustomerKey,
            qualifier: bootstrapOptions.qualifier ?? configuration.context.get('@aws-cdk/core:bootstrapQualifier'),
            publicAccessBlockConfiguration: bootstrapOptions.publicAccessBlockConfiguration,
            examplePermissionsBoundary: bootstrapOptions.examplePermissionsBoundary,
            customPermissionsBoundary: bootstrapOptions.customPermissionsBoundary,
            trustedAccounts: arrayFromYargs(bootstrapOptions.trust ?? []),
            trustedAccountsForLookup: arrayFromYargs(bootstrapOptions.trustForLookup ?? []),
            cloudFormationExecutionPolicies: arrayFromYargs(bootstrapOptions.cloudformationExecutionPolicies ?? []),
          },
        });

      case 'deploy':
        const deployOptions = argv.deploy ?? {};
        const parameterMap: { [name: string]: string | undefined } = {};
        for (const parameter of deployOptions.parameters ?? []) {
          if (typeof parameter === 'string') {
            const keyValue = (parameter as string).split('=');
            parameterMap[keyValue[0]] = keyValue.slice(1).join('=');
          }
        }

        if (deployOptions.all && deployOptions.STACKS) {
          throw new ToolkitError('You must either specify a list of Stacks or the `--all` argument');
        }

        if (deployOptions.execute !== undefined && deployOptions.method !== undefined) {
          throw new ToolkitError('Can not supply both --[no-]execute and --method at the same time');
        }

        let deploymentMethod: DeploymentMethod | undefined;
        switch (deployOptions.method) {
          case 'direct':
            if (deployOptions.changeSetName) {
              throw new ToolkitError('--change-set-name cannot be used with method=direct');
            }
            if (deployOptions.importExistingResources) {
              throw new Error('--import-existing-resources cannot be enabled with method=direct');
            }
            deploymentMethod = { method: 'direct' };
            break;
          case 'change-set':
            deploymentMethod = {
              method: 'change-set',
              execute: true,
              changeSetName: deployOptions.changeSetName,
              importExistingResources: deployOptions.importExistingResources,
            };
            break;
          case 'prepare-change-set':
            deploymentMethod = {
              method: 'change-set',
              execute: false,
              changeSetName: deployOptions.changeSetName,
              importExistingResources: deployOptions.importExistingResources,
            };
            break;
          case undefined:
            deploymentMethod = {
              method: 'change-set',
              execute: deployOptions.execute ?? true,
              changeSetName: deployOptions.changeSetName,
              importExistingResources: deployOptions.importExistingResources,
            };
            break;
        }

        return cli.deploy({
          selector: createSelector(deployOptions.STACKS, deployOptions.all),
          exclusively: deployOptions.exclusively,
          toolkitStackName,
          roleArn: globalOptions.roleArn,
          notificationArns: deployOptions.notificationArns,
          requireApproval: configuration.settings.get(['requireApproval']),
          reuseAssets: deployOptions.buildExclude,
          tags: configuration.settings.get(['tags']),
          deploymentMethod,
          force: deployOptions.force,
          parameters: parameterMap,
          usePreviousParameters: deployOptions.previousParameters,
          outputsFile: configuration.settings.get(['outputsFile']),
          progress: configuration.settings.get(['progress']),
          ci: globalOptions.ci,
          rollback: configuration.settings.get(['rollback']),
          hotswap: determineHotswapMode(deployOptions.hotswap, deployOptions.hotswapFallback),
          watch: deployOptions.watch,
          traceLogs: deployOptions.logs,
          concurrency: deployOptions.concurrency,
          assetParallelism: configuration.settings.get(['assetParallelism']),
          assetBuildTime: configuration.settings.get(['assetPrebuild'])
            ? AssetBuildTime.ALL_BEFORE_DEPLOY
            : AssetBuildTime.JUST_IN_TIME,
          ignoreNoStacks: deployOptions.ignoreNoStacks,
        });

      case 'rollback':
        const rollbackOptions = argv.rollback ?? {};
        return cli.rollback({
          selector: createSelector(rollbackOptions.STACKS, rollbackOptions.all),
          toolkitStackName,
          roleArn: globalOptions.roleArn,
          force: rollbackOptions.force,
          validateBootstrapStackVersion: rollbackOptions.validateBootstrapVersion,
          orphanLogicalIds: rollbackOptions.orphan,
        });

      case 'import':
        const importOptions = argv.import ?? {};
        return cli.import({
          selector: createSelector(importOptions.STACK ? [importOptions.STACK] : []),
          toolkitStackName,
          roleArn: globalOptions.roleArn,
          deploymentMethod: {
            method: 'change-set',
            execute: importOptions.execute,
            changeSetName: importOptions.changeSetName,
          },
          progress: configuration.settings.get(['progress']),
          rollback: configuration.settings.get(['rollback']),
          recordResourceMapping: importOptions.recordResourceMapping,
          resourceMappingFile: importOptions.resourceMapping,
          force: importOptions.force,
        });

      case 'watch':
        const watchOptions = argv.watch ?? {};
        return cli.watch({
          selector: createSelector(watchOptions.STACKS),
          exclusively: watchOptions.exclusively,
          toolkitStackName,
          roleArn: globalOptions.roleArn,
          reuseAssets: watchOptions.buildExclude,
          deploymentMethod: {
            method: 'change-set',
            changeSetName: watchOptions.changeSetName,
          },
          force: watchOptions.force,
          progress: configuration.settings.get(['progress']),
          rollback: configuration.settings.get(['rollback']),
          hotswap: determineHotswapMode(watchOptions.hotswap, watchOptions.hotswapFallback, true),
          traceLogs: watchOptions.logs,
          concurrency: watchOptions.concurrency,
        });

      case 'destroy':
        const destroyOptions = argv.destroy ?? {};
        return cli.destroy({
          selector: createSelector(destroyOptions.STACKS, destroyOptions.all),
          exclusively: destroyOptions.exclusively ?? false,
          force: destroyOptions.force ?? false,
          roleArn: globalOptions.roleArn,
          ci: globalOptions.ci,
        });

      case 'gc':
        if (!configuration.settings.get(['unstable']).includes('gc')) {
          throw new ToolkitError('Unstable feature use: \'gc\' is unstable. It must be opted in via \'--unstable\', e.g. \'cdk gc --unstable=gc\'');
        }

        const gcOptions = argv.gc ?? {};

        if (gcOptions.action && ['full', 'tag', 'delete-tagged', 'print'].includes(gcOptions.action)) {
          throw new ToolkitError(`Invalid action ${gcOptions.action} for cdk gc. Valid actions are 'full', 'tag', 'delete-tagged', 'print'`);
        }

        if (gcOptions.type && ['ecr', 's3', 'all'].includes(gcOptions.type)) {
          throw new ToolkitError(`Invalid action ${gcOptions.action} for cdk gc. Valid actions are 'ecr', 's3', 'all'`);
        }

        return cli.garbageCollect(gcOptions.ENVIRONMENTS ?? [], {
          action: gcOptions.action as ActionType,
          type: gcOptions.type as TypeType,
          rollbackBufferDays: gcOptions.rollbackBufferDays ?? 0,
          createdBufferDays: gcOptions.createdBufferDays ?? 1,
          bootstrapStackName: gcOptions.bootstrapStackName,
          confirm: gcOptions.confirm,
        });

      case 'synthesize':
      case 'synth':
        const synthOptions = argv.synthesize ?? {};
        const quiet = configuration.settings.get(['quiet']) ?? synthOptions.quiet;
        if (synthOptions.exclusively) {
          return cli.synth(synthOptions.STACKS ?? [], synthOptions.exclusively, quiet, synthOptions.validation, globalOptions.json);
        } else {
          return cli.synth(synthOptions.STACKS ?? [], true, quiet, synthOptions.validation, globalOptions.json);
        }

      case 'notices':
        // This is a valid command, but we're postponing its execution
        return;

      case 'metadata':
        return cli.metadata(argv.metadata?.STACK!, globalOptions.json ?? false);

      case 'acknowledge':
      case 'ack':
        return cli.acknowledge(argv.acknowledge?.ID!);

      case 'init':
        const language = configuration.settings.get(['language']);
        if (argv.list) {
          return printAvailableTemplates(language);
        } else {
          return cliInit({
            type: argv.init?.TEMPLATE,
            language,
            canUseNetwork: undefined,
            generateOnly: argv.init?.generateOnly,
          });
        }
      case 'migrate':
        const migrateOptions = argv.migrate ?? {};
        return cli.migrate({
          stackName: migrateOptions.stackName!,
          fromPath: migrateOptions.fromPath,
          fromStack: migrateOptions.fromStack,
          language: migrateOptions.language,
          outputPath: migrateOptions.outputPath,
          fromScan: migrateOptions.fromScan ? getMigrateScanType(migrateOptions.fromScan) : undefined,
          filter: migrateOptions.filter,
          account: migrateOptions.account,
          region: migrateOptions.region,
          compress: migrateOptions.compress,
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
function determineBootstrapVersion(template?: string): BootstrapSource {
  let source: BootstrapSource;
  if (template) {
    print(`Using bootstrapping template from ${template}`);
    source = { source: 'custom', templateFile: template };
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

function createSelector(stacks?: string[], all?: boolean): StackSelector {
  return {
    allTopLevel: all ?? false,
    patterns: stacks ?? [],
  };
}
