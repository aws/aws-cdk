#!/usr/bin/env node
import 'source-map-support/register';

import colors = require('colors/safe');
import path = require('path');
import yargs = require('yargs');

import { bootstrapEnvironment, BootstrapEnvironmentProps, SDK } from '../lib';
import { environmentsFromDescriptors, globEnvironmentsFromStacks } from '../lib/api/cxapp/environments';
import { execProgram } from '../lib/api/cxapp/exec';
import { AppStacks, DefaultSelection, ExtendedStackSelection } from '../lib/api/cxapp/stacks';
import { CloudFormationDeploymentTarget, DEFAULT_TOOLKIT_STACK_NAME } from '../lib/api/deployment-target';
import { CdkToolkit } from '../lib/cdk-toolkit';
import { RequireApproval } from '../lib/diff';
import { availableInitLanguages, cliInit, printAvailableTemplates } from '../lib/init';
import { data, debug, error, print, setVerbose, success } from '../lib/logging';
import { PluginHost } from '../lib/plugin';
import { serializeStructure } from '../lib/serialize';
import { Configuration, Settings } from '../lib/settings';
import version = require('../lib/version');

// tslint:disable:no-shadowed-variable max-line-length
async function parseCommandLineArguments() {
  const initTemplateLanuages = await availableInitLanguages;
  return yargs
    .env('CDK')
    .usage('Usage: cdk -a <cdk-app> COMMAND')
    .option('app', { type: 'string', alias: 'a', desc: 'REQUIRED: command-line for executing your app or a cloud assembly directory (e.g. "node bin/my-app.js")', requiresArg: true })
    .option('context', { type: 'array', alias: 'c', desc: 'Add contextual string parameter (KEY=VALUE)', nargs: 1, requiresArg: true })
    .option('plugin', { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times', nargs: 1 })
    .option('trace', { type: 'boolean', desc: 'Print trace for stack warnings' })
    .option('strict', { type: 'boolean', desc: 'Do not construct stacks with warnings' })
    .option('ignore-errors', { type: 'boolean', default: false, desc: 'Ignores synthesis errors, which will likely produce an invalid output' })
    .option('json', { type: 'boolean', alias: 'j', desc: 'Use JSON output instead of YAML when templates are printed to STDOUT', default: false })
    .option('verbose', { type: 'boolean', alias: 'v', desc: 'Show debug logs', default: false })
    .option('profile', { type: 'string', desc: 'Use the indicated AWS profile as the default environment', requiresArg: true })
    .option('proxy', { type: 'string', desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified.', requiresArg: true })
    .option('ec2creds', { type: 'boolean', alias: 'i', default: undefined, desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status.' })
    .option('version-reporting', { type: 'boolean', desc: 'Include the "AWS::CDK::Metadata" resource in synthesized templates (enabled by default)', default: undefined })
    .option('path-metadata', { type: 'boolean', desc: 'Include "aws:cdk:path" CloudFormation metadata for each resource (enabled by default)', default: true })
    .option('asset-metadata', { type: 'boolean', desc: 'Include "aws:asset:*" CloudFormation metadata for resources that user assets (enabled by default)', default: true })
    .option('role-arn', { type: 'string', alias: 'r', desc: 'ARN of Role to use when invoking CloudFormation', default: undefined, requiresArg: true })
    .option('toolkit-stack-name', { type: 'string', desc: 'The name of the CDK toolkit stack', requiresArg: true })
    .option('staging', { type: 'boolean', desc: 'Copy assets to the output directory (use --no-staging to disable, needed for local debugging the source files with SAM CLI)', default: true })
    .option('output', { type: 'string', alias: 'o', desc: 'Emits the synthesized cloud assembly into a directory (default: cdk.out)', requiresArg: true })
    .option('no-color', { type: 'boolean', desc: 'Removes colors and other style from console output', default: false })
    .command([ 'list [STACKS..]', 'ls [STACKS..]' ], 'Lists all stacks in the app', yargs => yargs
      .option('long', { type: 'boolean', default: false, alias: 'l', desc: 'Display environment information for each stack' }))
    .command([ 'synthesize [STACKS..]', 'synth [STACKS..]' ], 'Synthesizes and prints the CloudFormation template for this stack', yargs => yargs
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' }))
    .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', yargs => yargs
      .option('bootstrap-bucket-name', { type: 'string', alias: ['b', 'toolkit-bucket-name'], desc: 'The name of the CDK toolkit bucket', default: undefined })
      .option('bootstrap-kms-key-id', { type: 'string', desc: 'AWS KMS master key ID used for the SSE-KMS encryption', default: undefined })
      .option('tags', { type: 'array', alias: 't', desc: 'Tags to add for the stack (KEY=VALUE)', nargs: 1, requiresArg: true, default: [] }))
    .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', yargs => yargs
      .option('build-exclude', { type: 'array', alias: 'E', nargs: 1, desc: 'Do not rebuild asset with the given ID. Can be specified multiple times.', default: [] })
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependencies' })
      .option('require-approval', { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'What security-sensitive changes need manual approval' })
      .option('ci', { type: 'boolean', desc: 'Force CI detection. Use --no-ci to disable CI autodetection.', default: process.env.CI !== undefined })
      .option('notification-arns', {type: 'array', desc: 'ARNs of SNS topics that CloudFormation will notify with stack related events', nargs: 1, requiresArg: true})
      .option('tags', { type: 'array', alias: 't', desc: 'Tags to add to the stack (KEY=VALUE)', nargs: 1, requiresArg: true }))
    .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', yargs => yargs
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only deploy requested stacks, don\'t include dependees' })
      .option('force', { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' }))
    .command('diff [STACKS..]', 'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found', yargs => yargs
      .option('exclusively', { type: 'boolean', alias: 'e', desc: 'Only diff requested stacks, don\'t include dependencies' })
      .option('context-lines', { type: 'number', desc: 'Number of context lines to include in arbitrary JSON diff rendering', default: 3, requiresArg: true })
      .option('template', { type: 'string', desc: 'The path to the CloudFormation template to compare with', requiresArg: true })
      .option('strict', { type: 'boolean', desc: 'Do not filter out AWS::CDK::Metadata resources', default: false }))
    .command('metadata [STACK]', 'Returns all metadata associated with this stack')
    .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template. Invoked without TEMPLATE, the app template will be used.', yargs => yargs
      .option('language', { type: 'string', alias: 'l', desc: 'The language to be used for the new project (default can be configured in ~/.cdk.json)', choices: initTemplateLanuages })
      .option('list', { type: 'boolean', desc: 'List the available templates' })
      .option('generate-only', { type: 'boolean', default: false, desc: 'If true, only generates project files, without executing additional operations such as setting up a git repo, installing dependencies or compiling the project'}))
    .commandDir('../lib/commands', { exclude: /^_.*/ })
    .version(version.DISPLAY_VERSION)
    .demandCommand(1, '') // just print help
    .help()
    .alias('h', 'help')
    .epilogue([
      'If your app has a single stack, there is no need to specify the stack name',
      'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
    ].join('\n\n'))
    .argv;
}

if (!process.stdout.isTTY) {
  colors.disable();
}

async function initCommandLine() {
  const argv = await parseCommandLineArguments();
  if (argv.verbose) {
    setVerbose();
  }
  debug('CDK toolkit version:', version.DISPLAY_VERSION);
  debug('Command line arguments:', argv);

  const aws = new SDK({
    profile: argv.profile,
    proxyAddress: argv.proxy,
    ec2creds: argv.ec2creds,
  });

  const configuration = new Configuration(argv);
  await configuration.load();

  const provisioner = new CloudFormationDeploymentTarget({ aws });

  const appStacks = new AppStacks({
    verbose: argv.trace || argv.verbose,
    ignoreErrors: argv['ignore-errors'],
    strict: argv.strict,
    configuration,
    aws,
    synthesizer: execProgram,
  });

  /** Function to load plug-ins, using configurations additively. */
  function loadPlugins(...settings: Settings[]) {
    const loaded = new Set<string>();
    for (const source of settings) {
      const plugins: string[] = source.get(['plugin']) || [];
      for (const plugin of plugins) {
        const resolved = tryResolve(plugin);
        if (loaded.has(resolved)) { continue; }
        debug(`Loading plug-in: ${colors.green(plugin)} from ${colors.blue(resolved)}`);
        PluginHost.instance.load(plugin);
        loaded.add(resolved);
      }
    }

    function tryResolve(plugin: string): string {
      try {
        return require.resolve(plugin);
      } catch (e) {
        error(`Unable to resolve plugin ${colors.green(plugin)}: ${e.stack}`);
        throw new Error(`Unable to resolve plug-in: ${plugin}`);
      }
    }
  }

  loadPlugins(configuration.settings);

  const cmd = argv._[0];

  // Bundle up global objects so the commands have access to them
  const commandOptions = { args: argv, appStacks, configuration, aws };

  try {
    const returnValue = argv.commandHandler
      ? await (argv.commandHandler as (opts: typeof commandOptions) => any)(commandOptions)
      : await main(cmd, argv);
    if (typeof returnValue === 'object') {
      return toJsonOrYaml(returnValue);
    } else if (typeof returnValue === 'string') {
      return returnValue;
    } else {
      return returnValue;
    }
  } finally {
    await version.displayVersionMessage();
  }

  async function main(command: string, args: any): Promise<number | string | {} | void> {
    const toolkitStackName: string = configuration.settings.get(['toolkitStackName']) || DEFAULT_TOOLKIT_STACK_NAME;

    if (toolkitStackName !== DEFAULT_TOOLKIT_STACK_NAME) {
      print(`Toolkit stack: ${colors.bold(toolkitStackName)}`);
    }

    args.STACKS = args.STACKS || [];
    args.ENVIRONMENTS = args.ENVIRONMENTS || [];

    const cli = new CdkToolkit({ appStacks, provisioner });

    switch (command) {
      case 'ls':
      case 'list':
        return await cliList(args.STACKS, { long: args.long });

      case 'diff':
        return await cli.diff({
          stackNames: args.STACKS,
          exclusively: args.exclusively,
          templatePath: args.template,
          strict: args.strict,
          contextLines: args.contextLines
        });

      case 'bootstrap':
        return await cliBootstrap(args.ENVIRONMENTS, toolkitStackName, args.roleArn, {
          bucketName: configuration.settings.get(['toolkitBucket', 'bucketName']),
          kmsKeyId: configuration.settings.get(['toolkitBucket', 'kmsKeyId']),
          tags: configuration.settings.get(['tags'])
        });

      case 'deploy':
        return await cli.deploy({
          stackNames: args.STACKS,
          exclusively: args.exclusively,
          toolkitStackName,
          roleArn: args.roleArn,
          notificationArns: args.notificationArns,
          requireApproval: configuration.settings.get(['requireApproval']),
          ci: args.ci,
          reuseAssets: args['build-exclude'],
          tags: configuration.settings.get(['tags']),
          sdk: aws,
        });

      case 'destroy':
        return await cli.destroy({
          stackNames: args.STACKS,
          exclusively: args.exclusively,
          force: args.force,
          roleArn: args.roleArn,
          sdk: aws,
        });

      case 'synthesize':
      case 'synth':
        return await cliSynthesize(args.STACKS, args.exclusively);

      case 'metadata':
        return await cliMetadata(await findStack(args.STACK));

      case 'init':
        const language = configuration.settings.get(['language']);
        const generateOnly = configuration.settings.get(['generate-only']);
        if (args.list) {
          return await printAvailableTemplates(language);
        } else {
          return await cliInit(args.TEMPLATE, language, undefined, generateOnly);
        }
      case 'version':
        return print(version.DISPLAY_VERSION);

      default:
        throw new Error('Unknown command: ' + command);
    }
  }

  async function cliMetadata(stackName: string) {
    const s = await appStacks.synthesizeStack(stackName);
    return s.manifest.metadata || {};
  }

  /**
   * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
   *
   * @param environmentGlobs environment names that need to have toolkit support
   *             provisioned, as a glob filter. If none is provided,
   *             all stacks are implicitly selected.
   * @param toolkitStackName the name to be used for the CDK Toolkit stack.
   */
  async function cliBootstrap(environmentGlobs: string[], toolkitStackName: string, roleArn: string | undefined, props: BootstrapEnvironmentProps): Promise<void> {
    // Two modes of operation.
    //
    // If there is an '--app' argument, we select the environments from the app. Otherwise we just take the user
    // at their word that they know the name of the environment.

    const app = configuration.settings.get(['app']);

    const environments = app ? await globEnvironmentsFromStacks(appStacks, environmentGlobs, aws) : environmentsFromDescriptors(environmentGlobs);

    await Promise.all(environments.map(async (environment) => {
      success(' ⏳  Bootstrapping environment %s...', colors.blue(environment.name));
      try {
        const result = await bootstrapEnvironment(environment, aws, toolkitStackName, roleArn, props);
        const message = result.noOp ? ' ✅  Environment %s bootstrapped (no changes).'
                      : ' ✅  Environment %s bootstrapped.';
        success(message, colors.blue(environment.name));
      } catch (e) {
        error(' ❌  Environment %s failed bootstrapping: %s', colors.blue(environment.name), e);
        throw e;
      }
    }));
  }

  /**
   * Synthesize the given set of stacks (called when the user runs 'cdk synth')
   *
   * INPUT: Stack names can be supplied using a glob filter. If no stacks are
   * given, all stacks from the application are implictly selected.
   *
   * OUTPUT: If more than one stack ends up being selected, an output directory
   * should be supplied, where the templates will be written.
   */
  async function cliSynthesize(stackIds: string[],
                               exclusively: boolean): Promise<any> {
    // Only autoselect dependencies if it doesn't interfere with user request or output options
    const autoSelectDependencies = !exclusively;

    const stacks = await appStacks.selectStacks(stackIds, {
      extend: autoSelectDependencies ? ExtendedStackSelection.Upstream : ExtendedStackSelection.None,
      defaultBehavior: DefaultSelection.AllStacks
    });

    appStacks.processMetadata(stacks);

    // if we have a single stack, print it to STDOUT
    if (stacks.length === 1) {
      return stacks[0].template;
    }

    // This is a slight hack; in integ mode we allow multiple stacks to be synthesized to stdout sequentially.
    // This is to make it so that we can support multi-stack integ test expectations, without so drastically
    // having to change the synthesis format that we have to rerun all integ tests.
    //
    // Because this feature is not useful to consumers (the output is missing
    // the stack names), it's not exposed as a CLI flag. Instead, it's hidden
    // behind an environment variable.
    const isIntegMode = process.env.CDK_INTEG_MODE === '1';
    if (isIntegMode) {
      return stacks.map(s => s.template);
    }

    // not outputting template to stdout, let's explain things to the user a little bit...
    success(`Successfully synthesized to ${colors.blue(path.resolve(appStacks.assembly!.directory))}`);
    print(`Supply a stack id (${stacks.map(s => colors.green(s.id)).join(', ')}) to display its template.`);

    return undefined;
  }

  async function cliList(selectors: string[], options: { long?: boolean } = { }) {
    const stacks = await appStacks.selectStacks(selectors, { defaultBehavior: DefaultSelection.AllStacks });

    // if we are in "long" mode, emit the array as-is (JSON/YAML)
    if (options.long) {
      const long = [];
      for (const stack of stacks) {
        long.push({
          id: stack.id,
          name: stack.stackName,
          environment: stack.environment
        });
      }
      return long; // will be YAML formatted output
    }

    // just print stack IDs
    for (const stack of stacks) {
      data(stack.id);
    }

    return 0; // exit-code
  }

  /**
   * Match a single stack from the list of available stacks
   */
  async function findStack(artifactId: string): Promise<string> {
    const stacks = await appStacks.selectStacks([artifactId], {
      extend: ExtendedStackSelection.None,
      defaultBehavior: DefaultSelection.None
    });

    // Could have been a glob so check that we evaluated to exactly one
    if (stacks.length > 1) {
      throw new Error(`This command requires exactly one stack and we matched more than one: ${stacks.map(x => x.id)}`);
    }

    return stacks[0].id;
  }

  function toJsonOrYaml(object: any): string {
    return serializeStructure(object, argv.json);
  }
}

initCommandLine()
  .then(value => {
    if (value == null) { return; }
    if (typeof value === 'string') {
      data(value);
    } else if (typeof value === 'number') {
      process.exit(value);
    }
  })
  .catch(err => {
    error(err.message);
    debug(err.stack);
    process.exit(1);
  });
