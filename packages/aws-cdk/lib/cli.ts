import * as cxapi from '@aws-cdk/cx-api';
import '@jsii/check-node/run';
import * as chalk from 'chalk';
import { install as enableSourceMapSupport } from 'source-map-support';

import type { Argv } from 'yargs';
import { DeploymentMethod } from './api';
import { HotswapMode } from './api/hotswap/common';
import { ILock } from './api/util/rwlock';
import { checkForPlatformWarnings } from './platform-warnings';
import { enableTracing } from './util/tracing';
import { SdkProvider } from '../lib/api/aws-auth';
import { BootstrapSource, Bootstrapper } from '../lib/api/bootstrap';
import { CloudFormationDeployments } from '../lib/api/cloudformation-deployments';
import { StackSelector } from '../lib/api/cxapp/cloud-assembly';
import { CloudExecutable, Synthesizer } from '../lib/api/cxapp/cloud-executable';
import { execProgram } from '../lib/api/cxapp/exec';
import { PluginHost } from '../lib/api/plugin';
import { ToolkitInfo } from '../lib/api/toolkit-info';
import { StackActivityProgress } from '../lib/api/util/cloudformation/stack-activity-monitor';
import { CdkToolkit, AssetBuildTime } from '../lib/cdk-toolkit';
import { realHandler as context } from '../lib/commands/context';
import { realHandler as docs } from '../lib/commands/docs';
import { realHandler as doctor } from '../lib/commands/doctor';
import { RequireApproval } from '../lib/diff';
import { availableInitLanguages, cliInit, printAvailableTemplates } from '../lib/init';
import { data, debug, error, print, setLogLevel, setCI } from '../lib/logging';
import { displayNotices, refreshNotices } from '../lib/notices';
import { Command, Configuration, Settings } from '../lib/settings';
import * as version from '../lib/version';

// https://github.com/yargs/yargs/issues/1929
// https://github.com/evanw/esbuild/issues/1492
// eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */ // yargs

async function parseCommandLineArguments(args: string[]) {
  // Use the following configuration for array arguments:
  //
  //     { type: 'array', default: [], nargs: 1, requiresArg: true }
  //
  // The default behavior of yargs is to eat all strings following an array argument:
  //
  //   ./prog --arg one two positional  => will parse to { arg: ['one', 'two', 'positional'], _: [] } (so no positional arguments)
  //   ./prog --arg one two -- positional  => does not help, for reasons that I can't understand. Still gets parsed incorrectly.
  //
  // By using the config above, every --arg will only consume one argument, so you can do the following:
  //
  //   ./prog --arg one --arg two position  =>  will parse to  { arg: ['one', 'two'], _: ['positional'] }.

  const defaultBrowserCommand: { [key in NodeJS.Platform]?: string } = {
    darwin: 'open %u',
    win32: 'start %u',
  };

  const initTemplateLanguages = await availableInitLanguages();
  return yargs
    .env('CDK')
    .usage('Usage: cdk -a <cdk-app> COMMAND')
    .option('app', { type: 'string', alias: 'a', desc: 'REQUIRED WHEN RUNNING APP: command-line for executing your app or a cloud assembly directory (e.g. "node bin/my-app.js"). Can also be specified in cdk.json or ~/.cdk.json', requiresArg: true })
    .option('build', { type: 'string', desc: 'Command-line for a pre-synth build' })
    .option('context', { type: 'array', alias: 'c', desc: 'Add contextual string parameter (KEY=VALUE)', nargs: 1, requiresArg: true })
    .option('plugin', { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times', nargs: 1 })
    .option('trace', { type: 'boolean', desc: 'Print trace for stack warnings' })
    .option('strict', { type: 'boolean', desc: 'Do not construct stacks with warnings' })
    .option('lookups', { type: 'boolean', desc: 'Perform context lookups (synthesis fails if this is disabled and context lookups need to be performed)', default: true })
    .option('ignore-errors', { type: 'boolean', default: false, desc: 'Ignores synthesis errors, which will likely produce an invalid output' })
    .option('json', { type: 'boolean', alias: 'j', desc: 'Use JSON output instead of YAML when templates are printed to STDOUT', default: false })
    .option('verbose', { type: 'boolean', alias: 'v', desc: 'Show debug logs (specify multiple times to increase verbosity)', default: false })
    .count('verbose')
    .option('debug', { type: 'boolean', desc: 'Enable emission of additional debugging information, such as creation stack traces of tokens', default: false })
    .option('profile', { type: 'string', desc: 'Use the indicated AWS profile as the default environment', requiresArg: true })
    .option('proxy', { type: 'string', desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified', requiresArg: true })
    .option('ca-bundle-path', { type: 'string', desc: 'Path to CA certificate to use when validating HTTPS requests. Will read from AWS_CA_BUNDLE environment variable if not specified', requiresArg: true })
    .option('ec2creds', { type: 'boolean', alias: 'i', default: undefined, desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status' })
    .option('version-reporting', { type: 'boolean', desc: 'Include the "AWS::CDK::Metadata" resource in synthesized templates (enabled by default)', default: undefined })
    .option('path-metadata', { type: 'boolean', desc: 'Include "aws:cdk:path" CloudFormation metadata for each resource (enabled by default)', default: undefined })
    .option('asset-metadata', { type: 'boolean', desc: 'Include "aws:asset:*" CloudFormation metadata for resources that uses assets (enabled by default)', default: undefined })
    .option('role-arn', { type: 'string', alias: 'r', desc: 'ARN of Role to use when invoking CloudFormation', default: undefined, requiresArg: true })
    .option('staging', { type: 'boolean', desc: 'Copy assets to the output directory (use --no-staging to disable the copy of assets which allows local debugging via the SAM CLI to reference the original source files)', default: true })
    .option('output', { type: 'string', alias: 'o', desc: 'Emits the synthesized cloud assembly into a directory (default: cdk.out)', requiresArg: true })
    .option('notices', { type: 'boolean', desc: 'Show relevant notices' })
    .option('no-color', { type: 'boolean', desc: 'Removes colors and other style from console output', default: false })
    .option('ci', { type: 'boolean', desc: 'Force CI detection. If CI=true then logs will be sent to stdout instead of stderr', default: process.env.CI !== undefined })
    .command(['list [STACKS..]', 'ls [STACKS..]'], 'Lists all stacks in the app', (yargs: Argv) => yargs
      .option('long', { type: 'boolean', default: false, alias: 'l', desc: 'Display environment information for each stack' }),
    )
    .command(['synthesize [STACKS..]', 'synth [STACKS..]'], 'Synthesizes and prints the CloudFormation template for this stack', (yargs: Argv) => yargs
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only synthesize requested stacks, don\'t include dependencies' })
      .option('validation', { type: 'boolean', desc: 'After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)', default: true })
      .option('quiet', { type: 'boolean', alias: 'q', desc: 'Do not output CloudFormation Template to stdout', default: false }))
    .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', (yargs: Argv) => yargs
      .option('bootstrap-bucket-name', { type: 'string', alias: ['b', 'toolkit-bucket-name'], desc: 'The name of the CDK toolkit bucket; bucket will be created and must not exist', default: undefined })
      .option('bootstrap-kms-key-id', { type: 'string', desc: 'AWS KMS master key ID used for the SSE-KMS encryption', default: undefined, conflicts: 'bootstrap-customer-key' })
      .option('example-permissions-boundary', { type: 'boolean', alias: ['epb', 'example-permissions-boundary'], desc: 'Use the example permissions boundary.', default: undefined, conflicts: 'custom-permissions-boundary' })
      .option('custom-permissions-boundary', { type: 'string', alias: ['cpb', 'custom-permissions-boundary'], desc: 'Use the permissions boundary specified by name.', default: undefined, conflicts: 'example-permissions-boundary' })
      .option('bootstrap-customer-key', { type: 'boolean', desc: 'Create a Customer Master Key (CMK) for the bootstrap bucket (you will be charged but can customize permissions, modern bootstrapping only)', default: undefined, conflicts: 'bootstrap-kms-key-id' })
      .option('qualifier', { type: 'string', desc: 'String which must be unique for each bootstrap stack. You must configure it on your CDK app if you change this from the default.', default: undefined })
      .option('public-access-block-configuration', { type: 'boolean', desc: 'Block public access configuration on CDK toolkit bucket (enabled by default) ', default: undefined })
      .option('tags', { type: 'array', alias: 't', desc: 'Tags to add for the stack (KEY=VALUE)', nargs: 1, requiresArg: true, default: [] })
      .option('execute', { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true })
      .option('trust', { type: 'array', desc: 'The AWS account IDs that should be trusted to perform deployments into this environment (may be repeated, modern bootstrapping only)', default: [], nargs: 1, requiresArg: true })
      .option('trust-for-lookup', { type: 'array', desc: 'The AWS account IDs that should be trusted to look up values in this environment (may be repeated, modern bootstrapping only)', default: [], nargs: 1, requiresArg: true })
      .option('cloudformation-execution-policies', { type: 'array', desc: 'The Managed Policy ARNs that should be attached to the role performing deployments into this environment (may be repeated, modern bootstrapping only)', default: [], nargs: 1, requiresArg: true })
      .option('force', { alias: 'f', type: 'boolean', desc: 'Always bootstrap even if it would downgrade template version', default: false })
      .option('termination-protection', { type: 'boolean', default: undefined, desc: 'Toggle CloudFormation termination protection on the bootstrap stacks' })
      .option('show-template', { type: 'boolean', desc: 'Instead of actual bootstrapping, print the current CLI\'s bootstrapping template to stdout for customization', default: false })
      .option('toolkit-stack-name', { type: 'string', desc: 'The name of the CDK toolkit stack to create', requiresArg: true })
      .option('template', { type: 'string', requiresArg: true, desc: 'Use the template from the given file instead of the built-in one (use --show-template to obtain an example)' }),
    )
    .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', (yargs: Argv) => yargs
      .option('all', { type: 'boolean', default: false, desc: 'Deploy all available stacks' })
      .option('build-exclude', { type: 'array', alias: 'E', nargs: 1, desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] })
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' })
      .option('require-approval', { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' })
      .option('notification-arns', { type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events', nargs: 1, requiresArg: true })
      // @deprecated(v2) -- tags are part of the Cloud Assembly and tags specified here will be overwritten on the next deployment
      .option('tags', { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)', nargs: 1, requiresArg: true })
      .option('execute', { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet) (deprecated)', deprecated: true })
      .option('change-set-name', { type: 'string', desc: 'Name of the CloudFormation change set to create (only if method is not direct)' })
      .options('method', {
        alias: 'm',
        type: 'string',
        choices: ['direct', 'change-set', 'prepare-change-set'],
        requiresArg: true,
        desc: 'How to perform the deployment. Direct is a bit faster but lacks progress information',
      })
      .option('force', { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false })
      .option('parameters', { type: 'array', desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)', nargs: 1, requiresArg: true, default: {} })
      .option('outputs-file', { type: 'string', alias: 'O', desc: 'Path to file where stack outputs will be written as JSON', requiresArg: true })
      .option('previous-parameters', { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' })
      .option('toolkit-stack-name', { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true })
      .option('progress', { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' })
      .option('rollback', {
        type: 'boolean',
        desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
          'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
      })
      // Hack to get '-R' as an alias for '--no-rollback', suggested by: https://github.com/yargs/yargs/issues/1729
      .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
      .option('hotswap', {
        type: 'boolean',
        desc: "Attempts to perform a 'hotswap' deployment, " +
          'but does not fall back to a full deployment if that is not possible. ' +
          'Instead, changes to any non-hotswappable properties are ignored.' +
          'Do not use this in production environments',
      })
      .option('hotswap-fallback', {
        type: 'boolean',
        desc: "Attempts to perform a 'hotswap' deployment, " +
          'which skips CloudFormation and updates the resources directly, ' +
          'and falls back to a full deployment if that is not possible. ' +
          'Do not use this in production environments',
      })
      .option('watch', {
        type: 'boolean',
        desc: 'Continuously observe the project files, ' +
          'and deploy the given stack(s) automatically when changes are detected. ' +
          'Implies --hotswap by default',
      })
      .options('logs', {
        type: 'boolean',
        default: true,
        desc: 'Show CloudWatch log events from all resources in the selected Stacks in the terminal. ' +
          "'true' by default, use --no-logs to turn off. " +
          "Only in effect if specified alongside the '--watch' option",
      })
      .option('concurrency', { type: 'number', desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.', default: 1, requiresArg: true })
      .option('asset-parallelism', { type: 'boolean', desc: 'Whether to build/publish assets in parallel' })
      .option('asset-prebuild', { type: 'boolean', desc: 'Whether to build all assets before deploying the first stack (useful for failing Docker builds)', default: true }),
    )
    .command('import [STACK]', 'Import existing resource(s) into the given STACK', (yargs: Argv) => yargs
      .option('execute', { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true })
      .option('change-set-name', { type: 'string', desc: 'Name of the CloudFormation change set to create' })
      .option('toolkit-stack-name', { type: 'string', desc: 'The name of the CDK toolkit stack to create', requiresArg: true })
      .option('rollback', {
        type: 'boolean',
        desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
          'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
      })
      .option('force', {
        alias: 'f',
        type: 'boolean',
        desc: 'Do not abort if the template diff includes updates or deletes. This is probably safe but we\'re not sure, let us know how it goes.',
      })
      .option('record-resource-mapping', {
        type: 'string',
        alias: 'r',
        requiresArg: true,
        desc: 'If specified, CDK will generate a mapping of existing physical resources to CDK resources to be imported as. The mapping ' +
          'will be written in the given file path. No actual import operation will be performed',
      })
      .option('resource-mapping', {
        type: 'string',
        alias: 'm',
        requiresArg: true,
        desc: 'If specified, CDK will use the given file to map physical resources to CDK resources for import, instead of interactively ' +
          'asking the user. Can be run from scripts',
      }),
    )
    .command('watch [STACKS..]', "Shortcut for 'deploy --watch'", (yargs: Argv) => yargs
      // I'm fairly certain none of these options, present for 'deploy', make sense for 'watch':
      // .option('all', { type: 'boolean', default: false, desc: 'Deploy all available stacks' })
      // .option('ci', { type: 'boolean', desc: 'Force CI detection', default: process.env.CI !== undefined })
      // @deprecated(v2) -- tags are part of the Cloud Assembly and tags specified here will be overwritten on the next deployment
      // .option('tags', { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE), overrides tags from Cloud Assembly (deprecated)', nargs: 1, requiresArg: true })
      // .option('execute', { type: 'boolean', desc: 'Whether to execute ChangeSet (--no-execute will NOT execute the ChangeSet)', default: true })
      // These options, however, are more subtle - I could be convinced some of these should also be available for 'watch':
      // .option('require-approval', { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' })
      // .option('parameters', { type: 'array', desc: 'Additional parameters passed to CloudFormation at deploy time (STACK:KEY=VALUE)', nargs: 1, requiresArg: true, default: {} })
      // .option('previous-parameters', { type: 'boolean', default: true, desc: 'Use previous values for existing parameters (you must specify all parameters on every deployment if this is disabled)' })
      // .option('outputs-file', { type: 'string', alias: 'O', desc: 'Path to file where stack outputs will be written as JSON', requiresArg: true })
      // .option('notification-arns', { type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events', nargs: 1, requiresArg: true })
      .option('build-exclude', { type: 'array', alias: 'E', nargs: 1, desc: 'Do not rebuild asset with the given ID. Can be specified multiple times', default: [] })
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' })
      .option('change-set-name', { type: 'string', desc: 'Name of the CloudFormation change set to create' })
      .option('force', { alias: 'f', type: 'boolean', desc: 'Always deploy stack even if templates are identical', default: false })
      .option('toolkit-stack-name', { type: 'string', desc: 'The name of the existing CDK toolkit stack (only used for app using legacy synthesis)', requiresArg: true })
      .option('progress', { type: 'string', choices: [StackActivityProgress.BAR, StackActivityProgress.EVENTS], desc: 'Display mode for stack activity events' })
      .option('rollback', {
        type: 'boolean',
        desc: "Rollback stack to stable state on failure. Defaults to 'true', iterate more rapidly with --no-rollback or -R. " +
          'Note: do **not** disable this flag for deployments with resource replacements, as that will always fail',
      })
      // same hack for -R as above in 'deploy'
      .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
      .option('hotswap', {
        type: 'boolean',
        desc: "Attempts to perform a 'hotswap' deployment, " +
          'but does not fall back to a full deployment if that is not possible. ' +
          'Instead, changes to any non-hotswappable properties are ignored.' +
          "'true' by default, use --no-hotswap to turn off",
      })
      .option('hotswap-fallback', {
        type: 'boolean',
        desc: "Attempts to perform a 'hotswap' deployment, " +
          'which skips CloudFormation and updates the resources directly, ' +
          'and falls back to a full deployment if that is not possible.',
      })
      .options('logs', {
        type: 'boolean',
        default: true,
        desc: 'Show CloudWatch log events from all resources in the selected Stacks in the terminal. ' +
          "'true' by default, use --no-logs to turn off",
      })
      .option('concurrency', { type: 'number', desc: 'Maximum number of simultaneous deployments (dependency permitting) to execute.', default: 1, requiresArg: true }),
    )
    .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', (yargs: Argv) => yargs
      .option('all', { type: 'boolean', default: false, desc: 'Destroy all available stacks' })
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only destroy requested stacks, don\'t include dependees' })
      .option('force', { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' }))
    .command('diff [STACKS..]', 'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found', (yargs: Argv) => yargs
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only diff requested stacks, don\'t include dependencies' })
      .option('context-lines', { type: 'number', desc: 'Number of context lines to include in arbitrary JSON diff rendering', default: 3, requiresArg: true })
      .option('template', { type: 'string', desc: 'The path to the CloudFormation template to compare with', requiresArg: true })
      .option('strict', { type: 'boolean', desc: 'Do not filter out AWS::CDK::Metadata resources', default: false })
      .option('security-only', { type: 'boolean', desc: 'Only diff for broadened security changes', default: false })
      .option('fail', { type: 'boolean', desc: 'Fail with exit code 1 in case of diff' })
      .option('processed', { type: 'boolean', desc: 'Whether to compare against the template with Transforms already processed', default: false }))
    .command('metadata [STACK]', 'Returns all metadata associated with this stack')
    .command(['acknowledge [ID]', 'ack [ID]'], 'Acknowledge a notice so that it does not show up anymore')
    .command('notices', 'Returns a list of relevant notices')
    .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template.', (yargs: Argv) => yargs
      .option('language', { type: 'string', alias: 'l', desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)', choices: initTemplateLanguages })
      .option('list', { type: 'boolean', desc: 'List the available templates' })
      .option('generate-only', { type: 'boolean', default: false, desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project' }),
    )
    .command('context', 'Manage cached context values', (yargs: Argv) => yargs
      .option('reset', { alias: 'e', desc: 'The context key (or its index) to reset', type: 'string', requiresArg: true })
      .option('force', { alias: 'f', desc: 'Ignore missing key error', type: 'boolean', default: false })
      .option('clear', { desc: 'Clear all context', type: 'boolean' }))
    .command(['docs', 'doc'], 'Opens the reference documentation in a browser', (yargs: Argv) => yargs
      .option('browser', {
        alias: 'b',
        desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
        type: 'string',
        default: process.platform in defaultBrowserCommand ? defaultBrowserCommand[process.platform] : 'xdg-open %u',
      }))
    .command('doctor', 'Check your set-up for potential problems')
    .version(version.DISPLAY_VERSION)
    .demandCommand(1, '') // just print help
    .recommendCommands()
    .help()
    .alias('h', 'help')
    .epilogue([
      'If your app has a single stack, there is no need to specify the stack name',
      'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
    ].join('\n\n'))
    .parse(args);
}

if (!process.stdout.isTTY) {
  // Disable chalk color highlighting
  process.env.FORCE_COLOR = '0';
}

export async function exec(args: string[], synthesizer?: Synthesizer): Promise<number | void> {
  const argv = await parseCommandLineArguments(args);

  if (argv.debug) {
    enableSourceMapSupport();
  }

  if (argv.verbose) {
    setLogLevel(argv.verbose);

    if (argv.verbose > 2) {
      enableTracing(true);
    }
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

  if (shouldDisplayNotices()) {
    void refreshNotices()
      .catch(e => debug(`Could not refresh notices: ${e}`));
  }

  const sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
    profile: configuration.settings.get(['profile']),
    ec2creds: argv.ec2creds,
    httpOptions: {
      proxyAddress: argv.proxy,
      caBundlePath: argv['ca-bundle-path'],
    },
  });

  const cloudFormation = new CloudFormationDeployments({ sdkProvider });

  let outDirLock: ILock | undefined;
  const cloudExecutable = new CloudExecutable({
    configuration,
    sdkProvider,
    synthesizer: synthesizer ?? (async (aws, config) => {
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
        if (loaded.has(resolved)) { continue; }
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
        throw new Error(`Unable to resolve plug-in: ${plugin}`);
      }
    }
  }

  loadPlugins(configuration.settings);

  const cmd = argv._[0];

  if (typeof(cmd) !== 'string') {
    throw new Error(`First argument should be a string. Got: ${cmd} (${typeof(cmd)})`);
  }

  // Bundle up global objects so the commands have access to them
  const commandOptions = { args: argv, configuration, aws: sdkProvider };

  try {
    return await main(cmd, argv);
  } finally {
    // If we locked the 'cdk.out' directory, release it here.
    await outDirLock?.release();

    // Do PSAs here
    await version.displayVersionMessage();

    if (shouldDisplayNotices()) {
      if (cmd === 'notices') {
        await displayNotices({
          outdir: configuration.settings.get(['output']) ?? 'cdk.out',
          acknowledgedIssueNumbers: [],
          ignoreCache: true,
        });
      } else if (cmd !== 'version') {
        await displayNotices({
          outdir: configuration.settings.get(['output']) ?? 'cdk.out',
          acknowledgedIssueNumbers: configuration.context.get('acknowledged-issue-numbers') ?? [],
          ignoreCache: false,
        });
      }
    }
  }

  function shouldDisplayNotices(): boolean {
    return configuration.settings.get(['notices']) ?? true;
  }

  async function main(command: string, args: any): Promise<number | void> {
    const toolkitStackName: string = ToolkitInfo.determineName(configuration.settings.get(['toolkitStackName']));
    debug(`Toolkit stack: ${chalk.bold(toolkitStackName)}`);

    if (args.all && args.STACKS) {
      throw new Error('You must either specify a list of Stacks or the `--all` argument');
    }

    args.STACKS = args.STACKS ?? (args.STACK ? [args.STACK] : []);
    args.ENVIRONMENTS = args.ENVIRONMENTS ?? [];

    const selector: StackSelector = {
      allTopLevel: args.all,
      patterns: args.STACKS,
    };

    const cli = new CdkToolkit({
      cloudExecutable,
      cloudFormation,
      verbose: argv.trace || argv.verbose > 0,
      ignoreErrors: argv['ignore-errors'],
      strict: argv.strict,
      configuration,
      sdkProvider,
    });

    switch (command) {
      case 'context':
        return context(commandOptions);

      case 'docs':
        return docs(commandOptions);

      case 'doctor':
        return doctor(commandOptions);

      case 'ls':
      case 'list':
        return cli.list(args.STACKS, { long: args.long, json: argv.json });

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
        });

      case 'bootstrap':
        const source: BootstrapSource = determineBootsrapVersion(args, configuration);

        const bootstrapper = new Bootstrapper(source);

        if (args.showTemplate) {
          return bootstrapper.showTemplate(args.json);
        }

        return cli.bootstrap(args.ENVIRONMENTS, bootstrapper, {
          roleArn: args.roleArn,
          force: argv.force,
          toolkitStackName: toolkitStackName,
          execute: args.execute,
          tags: configuration.settings.get(['tags']),
          terminationProtection: args.terminationProtection,
          parameters: {
            bucketName: configuration.settings.get(['toolkitBucket', 'bucketName']),
            kmsKeyId: configuration.settings.get(['toolkitBucket', 'kmsKeyId']),
            createCustomerMasterKey: args.bootstrapCustomerKey,
            qualifier: args.qualifier,
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
          throw new Error('Can not supply both --[no-]execute and --method at the same time');
        }

        let deploymentMethod: DeploymentMethod | undefined;
        switch (args.method) {
          case 'direct':
            if (args.changeSetName) {
              throw new Error('--change-set-name cannot be used with method=direct');
            }
            deploymentMethod = { method: 'direct' };
            break;
          case 'change-set':
            deploymentMethod = { method: 'change-set', execute: true, changeSetName: args.changeSetName };
            break;
          case 'prepare-change-set':
            deploymentMethod = { method: 'change-set', execute: false, changeSetName: args.changeSetName };
            break;
          case undefined:
            deploymentMethod = { method: 'change-set', execute: args.execute ?? true, changeSetName: args.changeSetName };
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
          assetBuildTime: configuration.settings.get(['assetPrebuild']) ? AssetBuildTime.ALL_BEFORE_DEPLOY : AssetBuildTime.JUST_IN_TIME,
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
          // parameters: parameterMap,
          // usePreviousParameters: args['previous-parameters'],
          // outputsFile: configuration.settings.get(['outputsFile']),
          // requireApproval: configuration.settings.get(['requireApproval']),
          // notificationArns: args.notificationArns,
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

      case 'synthesize':
      case 'synth':
        if (args.exclusively) {
          return cli.synth(args.STACKS, args.exclusively, args.quiet, args.validation, argv.json);
        } else {
          return cli.synth(args.STACKS, true, args.quiet, args.validation, argv.json);
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
          return cliInit(args.TEMPLATE, language, undefined, args.generateOnly);
        }
      case 'version':
        return data(version.DISPLAY_VERSION);

      default:
        throw new Error('Unknown command: ' + command);
    }
  }

}

/**
 * Determine which version of bootstrapping
 * (legacy, or "new") should be used.
 */
function determineBootsrapVersion(args: { template?: string }, configuration: Configuration): BootstrapSource {
  const isV1 = version.DISPLAY_VERSION.startsWith('1.');
  return isV1 ? determineV1BootstrapSource(args, configuration) : determineV2BootstrapSource(args);
}

function determineV1BootstrapSource(args: { template?: string }, configuration: Configuration): BootstrapSource {
  let source: BootstrapSource;
  if (args.template) {
    print(`Using bootstrapping template from ${args.template}`);
    source = { source: 'custom', templateFile: args.template };
  } else if (process.env.CDK_NEW_BOOTSTRAP) {
    print('CDK_NEW_BOOTSTRAP set, using new-style bootstrapping');
    source = { source: 'default' };
  } else if (isFeatureEnabled(configuration, cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT)) {
    print(`'${cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT}' context set, using new-style bootstrapping`);
    source = { source: 'default' };
  } else {
    // in V1, the "legacy" bootstrapping is the default
    source = { source: 'legacy' };
  }
  return source;
}

function determineV2BootstrapSource(args: { template?: string }): BootstrapSource {
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
  if (xs.length === 0) { return undefined; }
  return xs.filter(x => x !== '');
}

function yargsNegativeAlias<T extends { [x in S | L ]: boolean | undefined }, S extends string, L extends string>(shortName: S, longName: L) {
  return (argv: T) => {
    if (shortName in argv && argv[shortName]) {
      (argv as any)[longName] = false;
    }
    return argv;
  };
}

function determineHotswapMode(hotswap?: boolean, hotswapFallback?: boolean, watch?: boolean): HotswapMode {
  if (hotswap && hotswapFallback) {
    throw new Error('Can not supply both --hotswap and --hotswap-fallback at the same time');
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
  } else /*if (hotswapFallback)*/ {
    hotswapMode = HotswapMode.FALL_BACK;
  }

  return hotswapMode;
}

export function cli(args: string[] = process.argv.slice(2)) {
  exec(args)
    .then(async (value) => {
      if (typeof value === 'number') {
        process.exitCode = value;
      }
    })
    .catch(err => {
      error(err.message);
      if (err.stack) {
        debug(err.stack);
      }
      process.exitCode = 1;
    });

}
