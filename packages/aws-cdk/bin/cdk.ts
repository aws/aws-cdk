#!/usr/bin/env node
import 'source-map-support/register';

import cxapi = require('@aws-cdk/cx-api');
import colors = require('colors/safe');
import fs = require('fs-extra');
import minimatch = require('minimatch');
import util = require('util');
import yargs = require('yargs');
import cdkUtil = require('../lib/util');

import { bootstrapEnvironment, deployStack, destroyStack, loadToolkitInfo, Mode, SDK } from '../lib';
import contextplugins = require('../lib/contextplugins');
import { printStackDiff } from '../lib/diff';
import { execProgram } from '../lib/exec';
import { availableInitLanguages, cliInit, printAvailableTemplates } from '../lib/init';
import { interactive } from '../lib/interactive';
import { data, debug, error, highlight, print, setVerbose, success, warning } from '../lib/logging';
import { PluginHost } from '../lib/plugin';
import { parseRenames } from '../lib/renames';
import { deserializeStructure, serializeStructure } from '../lib/serialize';
import { DEFAULTS, PER_USER_DEFAULTS, Settings } from '../lib/settings';
import { VERSION } from '../lib/version';

// tslint:disable-next-line:no-var-requires
const promptly = require('promptly');

const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

/**
 * Since app execution basically always synthesizes all the stacks,
 * we can invoke it once and cache the response for subsequent calls.
 */
let cachedResponse: cxapi.SynthesizeResponse;

// tslint:disable:no-shadowed-variable max-line-length
async function parseCommandLineArguments() {
  const initTemplateLanuages = await availableInitLanguages;
  return yargs
    .usage('Usage: cdk -a <cdk-app> COMMAND')
    .option('app', { type: 'string', alias: 'a', desc: 'REQUIRED: Command-line for executing your CDK app (e.g. "node bin/my-app.js")' })
    .option('context', { type: 'array', alias: 'c', desc: 'Add contextual string parameter.', nargs: 1, requiresArg: 'KEY=VALUE' })
    .option('plugin', { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times', nargs: 1 })
    .option('rename', { type: 'string', desc: 'Rename stack name if different then the one defined in the cloud executable', requiresArg: '[ORIGINAL:]RENAMED' })
    .option('trace', { type: 'boolean', desc: 'Print trace for stack warnings' })
    .option('strict', { type: 'boolean', desc: 'Do not construct stacks with warnings' })
    .option('ignore-errors', { type: 'boolean', default: false, desc: 'Ignores synthesis errors, which will likely produce an invalid output' })
    .option('json', { type: 'boolean', alias: 'j', desc: 'Use JSON output instead of YAML' })
    .option('verbose', { type: 'boolean', alias: 'v', desc: 'Show debug logs' })
    .option('profile', { type: 'string', desc: 'Use the indicated AWS profile as the default environment' })
    .option('proxy', { type: 'string', desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified.' })
    .option('ec2creds', { type: 'boolean', alias: 'i', default: undefined, desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status.' })
    .option('version-reporting', { type: 'boolean', desc: 'Disable insersion of the CDKMetadata resource in synthesized templates', default: undefined })
    .option('role-arn', { type: 'string', alias: 'r', desc: 'ARN of Role to use when invoking CloudFormation', default: undefined })
    .command([ 'list', 'ls' ], 'Lists all stacks in the app', yargs => yargs
      .option('long', { type: 'boolean', default: false, alias: 'l', desc: 'display environment information for each stack' }))
    .command([ 'synthesize [STACKS..]', 'synth [STACKS..]' ], 'Synthesizes and prints the CloudFormation template for this stack', yargs => yargs
      .option('interactive', { type: 'boolean', alias: 'i', desc: 'interactively watch and show template updates' })
      .option('output', { type: 'string', alias: 'o', desc: 'write CloudFormation template for requested stacks to the given directory' }))
    .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', yargs => yargs
      .option('toolkit-stack-name', { type: 'string', desc: 'the name of the CDK toolkit stack' }))
    .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', yargs => yargs
      .option('toolkit-stack-name', { type: 'string', desc: 'the name of the CDK toolkit stack' }))
    .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', yargs => yargs
      .option('force', { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' }))
    .command('diff [STACK]', 'Compares the specified stack with the deployed stack or a local template file', yargs => yargs
      .option('template', { type: 'string', desc: 'the path to the CloudFormation template to compare with' }))
    .command('metadata [STACK]', 'Returns all metadata associated with this stack')
    .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template. Invoked without TEMPLATE, the app template will be used.', yargs => yargs
      .option('language', { type: 'string', alias: 'l', desc: 'the language to be used for the new project (default can be configured in ~/.cdk.json)', choices: initTemplateLanuages })
      .option('list', { type: 'boolean', desc: 'list the available templates' }))
    .commandDir('../lib/commands', { exclude: /^_.*/, visit: decorateCommand })
    .version(VERSION)
    .demandCommand(1, '') // just print help
    .help()
    .epilogue([
      'If your app has a single stack, there is no need to specify the stack name',
      'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
    ].join('\n\n'))
    .argv;
}
// tslint:enable:no-shadowed-variable max-line-length

/**
 * Decorates commands discovered by ``yargs.commandDir`` in order to apply global
 * options as appropriate.
 *
 * @param commandObject is the command to be decorated.
 * @returns a decorated ``CommandModule``.
 */
function decorateCommand(commandObject: yargs.CommandModule): yargs.CommandModule {
  return {
    ...commandObject,
    handler(args: yargs.Arguments) {
      if (args.verbose) {
        setVerbose();
      }
      return args.result = commandObject.handler(args);
    }
  };
}

async function initCommandLine() {
  const argv = await parseCommandLineArguments();
  if (argv.verbose) {
    setVerbose();
  }

  debug('CDK toolkit version:', VERSION);
  debug('Command line arguments:', argv);

  const aws = new SDK({
    profile: argv.profile,
    proxyAddress: argv.proxy,
    ec2creds: argv.ec2creds,
  });

  const availableContextProviders: contextplugins.ProviderMap = {
    'availability-zones': new contextplugins.AZContextProviderPlugin(aws),
    'ssm': new contextplugins.SSMContextProviderPlugin(aws),
    'hosted-zone': new contextplugins.HostedZoneContextProviderPlugin(aws),
  };

  const defaultConfig = new Settings({ versionReporting: true });
  const userConfig = await new Settings().load(PER_USER_DEFAULTS);
  const projectConfig = await new Settings().load(DEFAULTS);
  const commandLineArguments = argumentsToSettings();
  const renames = parseRenames(argv.rename);

  logDefaults(); // Ignores command-line arguments

  /** Function to return the complete merged config */
  function completeConfig(): Settings {
    return defaultConfig.merge(userConfig).merge(projectConfig).merge(commandLineArguments);
  }

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

  loadPlugins(userConfig, projectConfig, commandLineArguments);

  const cmd = argv._[0];

  const returnValue = await (argv.result || main(cmd, argv));
  if (typeof returnValue === 'object') {
    return toJsonOrYaml(returnValue);
  } else if (typeof returnValue === 'string') {
    return returnValue;
  } else {
    return returnValue;
  }

  async function main(command: string, args: any): Promise<number | string | {} | void> {
    const toolkitStackName: string = completeConfig().get(['toolkitStackName']) || DEFAULT_TOOLKIT_STACK_NAME;

    args.STACKS = args.STACKS || [];
    args.ENVIRONMENTS = args.ENVIRONMENTS || [];

    switch (command) {
      case 'ls':
      case 'list':
        return await cliList({ long: args.long });

      case 'diff':
        return await diffStack(await findStack(args.STACK), args.template);

      case 'bootstrap':
        return await cliBootstrap(args.ENVIRONMENTS, toolkitStackName, args.roleArn);

      case 'deploy':
        return await cliDeploy(args.STACKS, toolkitStackName, args.roleArn);

      case 'destroy':
        return await cliDestroy(args.STACKS, args.force, args.roleArn);

      case 'synthesize':
      case 'synth':
        return await cliSynthesize(args.STACKS, args.interactive, args.output, args.json);

      case 'metadata':
        return await cliMetadata(await findStack(args.STACK));

      case 'init':
        const language = completeConfig().get(['language']);
        if (args.list) {
          return await printAvailableTemplates(language);
        } else {
          return await cliInit(args.TEMPLATE, language);
        }

      default:
        throw new Error('Unknown command: ' + command);
    }
  }

  async function cliMetadata(stackName: string) {
    const s = await synthesizeStack(stackName);
    return s.metadata;
  }

  /**
   * Extracts 'aws:cdk:warning|info|error' metadata entries from the stack synthesis
   */
  function processMessages(stacks: cxapi.SynthesizeResponse): { errors: boolean, warnings: boolean } {
    let warnings = false;
    let errors = false;
    for (const stack of stacks.stacks) {
      for (const id of Object.keys(stack.metadata)) {
        const metadata = stack.metadata[id];
        for (const entry of metadata) {
          switch (entry.type) {
            case cxapi.WARNING_METADATA_KEY:
              warnings = true;
              printMessage(warning, 'Warning', id, entry);
              break;
            case cxapi.ERROR_METADATA_KEY:
              errors = true;
              printMessage(error, 'Error', id, entry);
              break;
            case cxapi.INFO_METADATA_KEY:
              printMessage(print, 'Info', id, entry);
              break;
          }
        }
      }
    }
    return { warnings, errors };
  }

  function printMessage(logFn: (s: string) => void, prefix: string, id: string, entry: cxapi.MetadataEntry) {
    logFn(`[${prefix} at ${id}] ${entry.data}`);

    if (argv.trace || argv.verbose) {
      logFn(`  ${entry.trace.join('\n  ')}`);
    }
  }

  /**
   * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
   *
   * @param environmentGlobs environment names that need to have toolkit support
   *             provisioned, as a glob filter. If none is provided,
   *             all stacks are implicitly selected.
   * @param toolkitStackName the name to be used for the CDK Toolkit stack.
   */
  async function cliBootstrap(environmentGlobs: string[], toolkitStackName: string, roleArn: string | undefined): Promise<void> {
    if (environmentGlobs.length === 0) {
      environmentGlobs = [ '**' ]; // default to ALL
    }
    const stacks = await selectStacks();
    const availableEnvironments = distinct(stacks.map(stack => stack.environment)
                             .filter(env => env !== undefined) as cxapi.Environment[]);
    const environments = availableEnvironments.filter(env => environmentGlobs.find(glob => minimatch(env!.name, glob)));
    if (environments.length === 0) {
      const globs = JSON.stringify(environmentGlobs);
      const envList = availableEnvironments.length > 0 ? availableEnvironments.map(env => env!.name).join(', ') : '<none>';
      throw new Error(`No environments were found when selecting across ${globs} (available: ${envList})`);
    }
    await Promise.all(environments.map(async (environment) => {
      success(' ⏳  Bootstrapping environment %s...', colors.blue(environment.name));
      try {
        const result = await bootstrapEnvironment(environment, aws, toolkitStackName, roleArn);
        const message = result.noOp ? ' ✅  Environment %s was already fully bootstrapped!'
                      : ' ✅  Successfully bootstrapped environment %s!';
        success(message, colors.blue(environment.name));
      } catch (e) {
        error(' ❌  Environment %s failed bootstrapping: %s', colors.blue(environment.name), e);
        throw e;
      }
    }));

    /**
     * De-duplicates a list of environments, such that a given account and region is only represented exactly once
     * in the result.
     *
     * @param envs the possibly full-of-duplicates list of environments.
     *
     * @return a de-duplicated list of environments.
     */
    function distinct(envs: cxapi.Environment[]): cxapi.Environment[] {
      const unique: { [id: string]: cxapi.Environment } = {};
      for (const env of envs) {
        const id = `${env.account || 'default'}/${env.region || 'default'}`;
        if (id in unique) { continue; }
        unique[id] = env;
      }
      return Object.values(unique);
    }
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
  async function cliSynthesize(stackNames: string[],
                               doInteractive: boolean,
                               outputDir: string|undefined,
                               json: boolean): Promise<void> {
    const stacks = await selectStacks(...stackNames);
    renames.validateSelectedStacks(stacks);

    if (doInteractive) {
      if (stacks.length !== 1) {
        throw new Error(`When using interactive synthesis, must select exactly one stack. Got: ${listStackNames(stacks)}`);
      }
      return await interactive(stacks[0], argv.verbose, (stack) => synthesizeStack(stack));
    }

    if (stacks.length > 1 && outputDir == null) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Multiple stacks selected (${listStackNames(stacks)}), but output is directed to stdout. Either select one stack, or use --output to send templates to a directory.`);
    }

    if (outputDir == null) {
      return stacks[0].template;  // Will be printed in main()
    }

    fs.mkdirpSync(outputDir);

    for (const stack of stacks) {
      const finalName = renames.finalName(stack.name);
      const fileName = `${outputDir}/${finalName}.template.${json ? 'json' : 'yaml'}`;
      highlight(fileName);
      await fs.writeFile(fileName, toJsonOrYaml(stack.template));
    }

    return undefined; // Nothing to print
  }

  /**
   * Synthesize a single stack
   */
  async function synthesizeStack(stackName: string): Promise<cxapi.SynthesizedStack> {
    const resp = await synthesizeStacks();
    const stack = resp.stacks.find(s => s.name === stackName);
    if (!stack) {
      throw new Error(`Stack ${stackName} not found`);
    }
    return stack;
  }

  /**
   * Synthesize a set of stacks
   */
  async function synthesizeStacks(): Promise<cxapi.SynthesizeResponse> {
    if (cachedResponse) {
      return cachedResponse;
    }

    let config = completeConfig();
    const trackVersions: boolean = completeConfig().get(['versionReporting']);

    // We may need to run the cloud executable multiple times in order to satisfy all missing context
    while (true) {
      const response: cxapi.SynthesizeResponse = await execProgram(aws, config);
      const allMissing = cdkUtil.deepMerge(...response.stacks.map(s => s.missing));

      if (!cdkUtil.isEmpty(allMissing)) {
        debug(`Some context information is missing. Fetching...`);

        await contextplugins.provideContextValues(allMissing, projectConfig, availableContextProviders);

        // Cache the new context to disk
        await projectConfig.save(DEFAULTS);
        config = completeConfig();

        continue;
      }

      const { errors, warnings } = processMessages(response);

      if (errors && !argv.ignoreErrors) {
        throw new Error('Found errors');
      }

      if (argv.strict && warnings) {
        throw new Error('Found warnings (--strict mode)');
      }

      if (trackVersions && response.runtime) {
        const modules = formatModules(response.runtime);
        for (const stack of response.stacks) {
          if (!stack.template.Resources) {
            stack.template.Resources = {};
          }
          if (!stack.template.Resources.CDKMetadata) {
            stack.template.Resources.CDKMetadata = {
              Type: 'AWS::CDK::Metadata',
              Properties: {
                Modules: modules
              }
            };
          } else {
            warning(`The stack ${stack.name} already includes a CDKMetadata resource`);
          }
        }
      }

      // All good, return
      cachedResponse = response;
      return response;

      function formatModules(runtime: cxapi.AppRuntime): string {
        const modules = new Array<string>();
        for (const key of Object.keys(runtime.libraries).sort()) {
          modules.push(`${key}=${runtime.libraries[key]}`);
        }
        return modules.join(',');
      }
    }
  }

  /**
   * List all stacks in the CX and return the selected ones
   *
   * It's an error if there are no stacks to select, or if one of the requested parameters
   * refers to a nonexistant stack.
   */
  async function selectStacks(...selectors: string[]): Promise<cxapi.SynthesizedStack[]> {
    selectors = selectors.filter(s => s != null); // filter null/undefined

    const stacks: cxapi.SynthesizedStack[] = await listStacks();
    if (stacks.length === 0) {
      throw new Error('This app contains no stacks');
    }

    if (selectors.length === 0) {
      debug('Stack name not specified, so defaulting to all available stacks: ' + listStackNames(stacks));
      return stacks;
    }

    // For every selector argument, pick stacks from the list.
    const matched = new Set<string>();
    for (const pattern of selectors) {
      let found = false;

      for (const stack of stacks) {
        if (minimatch(stack.name, pattern)) {
          matched.add(stack.name);
          found = true;
        }
      }

      if (!found) {
        throw new Error(`No stack found matching '${pattern}'. Use "list" to print manifest`);
      }
    }

    return stacks.filter(s => matched.has(s.name));
  }

  async function cliList(options: { long?: boolean } = { }) {
    const stacks = await listStacks();

    // if we are in "long" mode, emit the array as-is (JSON/YAML)
    if (options.long) {
      const long = [];
      for (const stack of stacks) {
        long.push({
          name: stack.name,
          environment: stack.environment
        });
      }
      return long; // will be YAML formatted output
    }

    // just print stack names
    for (const stack of stacks) {
      data(stack.name);
    }

    return 0; // exit-code
  }

  async function listStacks(): Promise<cxapi.SynthesizedStack[]> {
    const response = await synthesizeStacks();
    return response.stacks;
  }

  async function cliDeploy(stackNames: string[], toolkitStackName: string, roleArn: string | undefined) {
    const stacks = await selectStacks(...stackNames);
    renames.validateSelectedStacks(stacks);

    for (const stack of stacks) {
      if (stacks.length !== 1) { highlight(stack.name); }
      if (!stack.environment) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Stack ${stack.name} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`);
      }
      const toolkitInfo = await loadToolkitInfo(stack.environment, aws, toolkitStackName);
      const deployName = renames.finalName(stack.name);

      if (deployName !== stack.name) {
        print('%s: deploying... (was %s)', colors.bold(deployName), colors.bold(stack.name));
      } else {
        print('%s: deploying...', colors.bold(stack.name));
      }

      try {
        const result = await deployStack({ stack, sdk: aws, toolkitInfo, deployName, roleArn });
        const message = result.noOp
          ? ` ✅  %s (no changes)`
          : ` ✅  %s`;

        success('\n' + message, stack.name);

        if (Object.keys(result.outputs).length > 0) {
          print('\nOutputs:');
        }

        for (const name of Object.keys(result.outputs)) {
          const value = result.outputs[name];
          print('%s.%s = %s', colors.cyan(deployName), colors.cyan(name), colors.underline(colors.cyan(value)));
        }

        print('\nStack ARN:');

        data(result.stackArn);
      } catch (e) {
        error('\n ❌  %s failed: %s', colors.bold(stack.name), e);
        throw e;
      }
    }
  }

  async function cliDestroy(stackNames: string[], force: boolean, roleArn: string | undefined) {
    const stacks = await selectStacks(...stackNames);
    renames.validateSelectedStacks(stacks);

    if (!force) {
      // tslint:disable-next-line:max-line-length
      const confirmed = await util.promisify(promptly.confirm)(`Are you sure you want to delete: ${colors.blue(stacks.map(s => s.name).join(', '))} (y/n)?`);
      if (!confirmed) {
        return;
      }
    }

    for (const stack of stacks) {
      const deployName = renames.finalName(stack.name);

      success('%s: destroying...', colors.blue(deployName));
      try {
        await destroyStack({ stack, sdk: aws, deployName, roleArn });
        success('\n ✅  %s: destroyed', colors.blue(deployName));
      } catch (e) {
        error('\n ❌  %s: destroy failed', colors.blue(deployName), e);
        throw e;
      }
    }
  }

  async function diffStack(stackName: string, templatePath?: string): Promise<number> {
    const stack = await synthesizeStack(stackName);
    const currentTemplate = await readCurrentTemplate(stack, templatePath);
    if (printStackDiff(currentTemplate, stack) === 0) {
      return 0;
    } else {
      return 1;
    }
  }

  async function readCurrentTemplate(stack: cxapi.SynthesizedStack, templatePath?: string): Promise<{ [key: string]: any }> {
    if (templatePath) {
      if (!await fs.pathExists(templatePath)) {
        throw new Error(`There is no file at ${templatePath}`);
      }
      const fileContent = await fs.readFile(templatePath, { encoding: 'UTF-8' });
      return parseTemplate(fileContent);
    } else {
      const cfn = await aws.cloudFormation(stack.environment, Mode.ForReading);
      const stackName = renames.finalName(stack.name);
      try {
        const response = await cfn.getTemplate({ StackName: stackName }).promise();
        return (response.TemplateBody && parseTemplate(response.TemplateBody)) || {};
      } catch (e) {
        if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
          return {};
        } else {
          throw e;
        }
      }
    }

    /* Attempt to parse YAML, fall back to JSON. */
    function parseTemplate(text: string): any {
      return deserializeStructure(text);
    }
  }

  /**
   * Match a single stack from the list of available stacks
   */
  async function findStack(name: string): Promise<string> {
    const stacks = await selectStacks(name);

    // Could have been a glob so check that we evaluated to exactly one
    if (stacks.length > 1) {
      throw new Error(`This command requires exactly one stack and we matched more than one: ${stacks.map(x => x.name)}`);
    }

    return stacks[0].name;
  }

  function logDefaults() {
    if (!userConfig.empty()) {
      debug('Defaults loaded from ', PER_USER_DEFAULTS, ':', JSON.stringify(userConfig.settings, undefined, 2));
    }

    const combined = userConfig.merge(projectConfig);
    if (!combined.empty()) {
      debug('Defaults:', JSON.stringify(combined.settings, undefined, 2));
    }
  }

  /** Convert the command-line arguments into a Settings object */
  function argumentsToSettings() {
    const context: any = {};

    // Turn list of KEY=VALUE strings into an object
    for (const assignment of (argv.context || [])) {
      const parts = assignment.split('=', 2);
      if (parts.length === 2) {
        debug('CLI argument context: %s=%s', parts[0], parts[1]);
        if (parts[0].match(/^aws:.+/)) {
          throw new Error(`User-provided context cannot use keys prefixed with 'aws:', but ${parts[0]} was provided.`);
        }
        context[parts[0]] = parts[1];
      } else {
        warning('Context argument is not an assignment (key=value): %s', assignment);
      }
    }

    return new Settings({
      app: argv.app,
      browser: argv.browser,
      context,
      language: argv.language,
      plugin: argv.plugin,
      toolkitStackName: argv.toolkitStackName,
      versionReporting: argv.versionReporting,
    });
  }

  /**
   * Combine the names of a set of stacks using a comma
   */
  function listStackNames(stacks: cxapi.SynthesizedStack[]): string {
    return stacks.map(s => s.name).join(', ');
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
