// tslint:disable: max-line-length

// #!/usr/bin/env node
// import 'source-map-support/register';

// // tslint:disable: max-line-length

// import colors = require('colors/safe');
// import util = require('util');
// import yargs = require('yargs');

// import { data, debug, error, highlight, PluginHost, print, serializeStructure, setVerbose, success } from '@aws-cdk/toolchain-common';
// import { RequireApproval } from '../lib/diff';
// import { Configuration, Settings } from '@aws-cdk/toolchain-common';
// import { VERSION } from '../lib/version';
// import { CloudFormationDeploymentTarget, DEFAULT_TOOLKIT_STACK_NAME } from '../lib/api/deployment-target';

// // tslint:disable-next-line:no-var-requires
// const promptly = require('promptly');
// const confirm = util.promisify(promptly.confirm);

// // tslint:disable:no-shadowed-variable max-line-length
// async function parseCommandLineArguments() {
//   return yargs
//     .env('CDK')
//     .usage('Usage: cdk-deploy -a <cdk-outdir> COMMAND')
//     .option('app', { type: 'string', alias: 'a', desc: 'REQUIRED: Path of synthesized application (cdk outdir)', requiresArg: true })
//     .option('plugin', { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times', nargs: 1 })
//     .option('rename', { type: 'string', desc: 'Rename stack name if different from the one defined in the cloud executable ([ORIGINAL:]RENAMED)', requiresArg: true })
//     .option('trace', { type: 'boolean', desc: 'Print trace for stack warnings' })
//     .option('strict', { type: 'boolean', desc: 'Do not construct stacks with warnings' })
//     .option('ignore-errors', { type: 'boolean', default: false, desc: 'Ignores synthesis errors, which will likely produce an invalid output' })
//     .option('verbose', { type: 'boolean', alias: 'v', desc: 'Show debug logs', default: false })
//     .option('profile', { type: 'string', desc: 'Use the indicated AWS profile as the default environment', requiresArg: true })
//     .option('proxy', { type: 'string', desc: 'Use the indicated proxy. Will read from HTTPS_PROXY environment variable if not specified.', requiresArg: true })
//     .option('ec2creds', { type: 'boolean', alias: 'i', default: undefined, desc: 'Force trying to fetch EC2 instance credentials. Default: guess EC2 instance status.' })
//     .option('role-arn', { type: 'string', alias: 'r', desc: 'ARN of Role to use when invoking CloudFormation', default: undefined, requiresArg: true })
//     .option('toolkit-stack-name', { type: 'string', desc: 'The name of the CDK toolkit stack', requiresArg: true })
//     .option('staging', { type: 'string', desc: 'directory name for staging assets (use --no-asset-staging to disable)', default: '.cdk.staging' })
//     .command([ 'list', 'ls' ], 'Lists all stacks in the app', yargs => yargs
//       .option('long', { type: 'boolean', default: false, alias: 'l', desc: 'display environment information for each stack' }))
//     .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment')
//     .command('deploy [STACKS..]', 'Deploys the stack(s) named STACKS into your AWS account', yargs => yargs
//       .option('build-exclude', { type: 'array', alias: 'E', nargs: 1, desc: 'do not rebuild asset with the given ID. Can be specified multiple times.', default: [] })
//       .option('exclusively', { type: 'boolean', alias: 'e', desc: 'only deploy requested stacks, don\'t include dependencies' })
//       .option('require-approval', { type: 'string', choices: [RequireApproval.Never, RequireApproval.AnyChange, RequireApproval.Broadening], desc: 'what security-sensitive changes need manual approval' }))
//       .option('ci', { type: 'boolean', desc: 'Force CI detection. Use --no-ci to disable CI autodetection.', default: process.env.CI !== undefined })
//     .command('destroy [STACKS..]', 'Destroy the stack(s) named STACKS', yargs => yargs
//       .option('exclusively', { type: 'boolean', alias: 'x', desc: 'only deploy requested stacks, don\'t include dependees' })
//       .option('force', { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' }))
//     .command('diff [STACKS..]', 'Compares the specified stack with the deployed stack or a local template file, and returns with status 1 if any difference is found', yargs => yargs
//       .option('exclusively', { type: 'boolean', alias: 'e', desc: 'only diff requested stacks, don\'t include dependencies' })
//       .option('context-lines', { type: 'number', desc: 'number of context lines to include in arbitrary JSON diff rendering', default: 3, requiresArg: true })
//       .option('template', { type: 'string', desc: 'the path to the CloudFormation template to compare with', requiresArg: true })
//       .option('strict', { type: 'boolean', desc: 'do not filter out AWS::CDK::Metadata resources', default: false }))
//     .version(VERSION)
//     .demandCommand(1, '') // just print help
//     .help()
//     .alias('h', 'help')
//     .epilogue([
//       'If your app has a single stack, there is no need to specify the stack name',
//       'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
//     ].join('\n\n'))
//     .argv;
// }

// if (!process.stdout.isTTY) {
//   colors.disable();
// }

// async function initCommandLine() {
//   const argv = await parseCommandLineArguments();
//   if (argv.verbose) {
//     setVerbose();
//   }

//   debug('CDK toolkit version:', VERSION);
//   debug('Command line arguments:', argv);

//   const aws = new SDK({
//     profile: argv.profile,
//     proxyAddress: argv.proxy,
//     ec2creds: argv.ec2creds,
//   });

//   const configuration = new Configuration(argv);
//   await configuration.load();

//   /** Function to load plug-ins, using configurations additively. */
//   function loadPlugins(...settings: Settings[]) {
//     const loaded = new Set<string>();
//     for (const source of settings) {
//       const plugins: string[] = source.get(['plugin']) || [];
//       for (const plugin of plugins) {
//         const resolved = tryResolve(plugin);
//         if (loaded.has(resolved)) { continue; }
//         debug(`Loading plug-in: ${colors.green(plugin)} from ${colors.blue(resolved)}`);
//         PluginHost.instance.load(plugin);
//         loaded.add(resolved);
//       }
//     }

//     function tryResolve(plugin: string): string {
//       try {
//         return require.resolve(plugin);
//       } catch (e) {
//         error(`Unable to resolve plugin ${colors.green(plugin)}: ${e.stack}`);
//         throw new Error(`Unable to resolve plug-in: ${plugin}`);
//       }
//     }
//   }

//   loadPlugins(configuration.settings);

//   const cmd = argv._[0];

//   // Bundle up global objects so the commands have access to them
//   const commandOptions = { args: argv, appStacks, configuration, aws };

//   const returnValue = argv.commandHandler
//     ? await (argv.commandHandler as (opts: typeof commandOptions) => any)(commandOptions)
//     : await main(cmd, argv);
//   if (typeof returnValue === 'object') {
//     return toJsonOrYaml(returnValue);
//   } else if (typeof returnValue === 'string') {
//     return returnValue;
//   } else {
//     return returnValue;
//   }

//   async function main(command: string, args: any): Promise<number | string | {} | void> {
//     const toolkitStackName: string = configuration.settings.get(['toolkitStackName']) || DEFAULT_TOOLKIT_STACK_NAME;

//     if (toolkitStackName !== DEFAULT_TOOLKIT_STACK_NAME) {
//       print(`Toolkit stack: ${colors.bold(toolkitStackName)}`);
//     }

//     const provisioner = new CloudFormationDeploymentTarget({ aws, toolkitStackName });

//     args.STACKS = args.STACKS || [];
//     args.ENVIRONMENTS = args.ENVIRONMENTS || [];
//     const stackNames = args.STACKS;

//     async function cli() {
//       const stacks = await appStacks.selectStacks(
//         stackNames,
//         args.exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream);
//       return new CDKToolkit({ stacks, provisioner });
//     }

//     switch (command) {
//       case 'diff':
//         return (await cli()).diff({
//           stackNames,
//           exclusively: args.exclusively,
//           templatePath: args.template,
//           strict: args.strict,
//           contextLines: args.contextLines
//         });

//       case 'bootstrap':
//         return await cliBootstrap(args.ENVIRONMENTS, toolkitStackName, args.roleArn);

//       case 'deploy':
//         return (await cli()).deploy({
//           stackNames,
//           exclusively: args.exclusively,
//           toolkitStackName,
//           roleArn: args.roleArn,
//           requireApproval: configuration.settings.get(['requireApproval']),
//           ci: args.ci,
//           reuseAssets: args['build-exclude']
//         });

//       case 'destroy':
//         return await cliDestroy(args.STACKS, args.exclusively, args.force, args.roleArn);

//       default:
//         throw new Error('Unknown command: ' + command);
//     }
//   }

//   /**
//    * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
//    *
//    * @param environmentGlobs environment names that need to have toolkit support
//    *             provisioned, as a glob filter. If none is provided,
//    *             all stacks are implicitly selected.
//    * @param toolkitStackName the name to be used for the CDK Toolkit stack.
//    */
//   async function cliBootstrap(environmentGlobs: string[], toolkitStackName: string, roleArn: string | undefined): Promise<void> {
//     // Two modes of operation.
//     //
//     // If there is an '--app' argument, we select the environments from the app. Otherwise we just take the user
//     // at their word that they know the name of the environment.

//     const app = configuration.settings.get(['app']);

//     const environments = app ? await globEnvironmentsFromStacks(appStacks, environmentGlobs) : environmentsFromDescriptors(environmentGlobs);

//     await Promise.all(environments.map(async (environment) => {
//       success(' ⏳  Bootstrapping environment %s...', colors.blue(environment.name));
//       try {
//         const result = await bootstrapEnvironment(environment, aws, toolkitStackName, roleArn);
//         const message = result.noOp ? ' ✅  Environment %s bootstrapped (no changes).'
//                       : ' ✅  Environment %s bootstrapped.';
//         success(message, colors.blue(environment.name));
//       } catch (e) {
//         error(' ❌  Environment %s failed bootstrapping: %s', colors.blue(environment.name), e);
//         throw e;
//       }
//     }));
//   }

//   async function cliDestroy(stackNames: string[], exclusively: boolean, force: boolean, roleArn: string | undefined) {
//     const stacks = await appStacks.selectStacks(stackNames, exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Downstream);

//     // The stacks will have been ordered for deployment, so reverse them for deletion.
//     stacks.reverse();

//     if (!force) {
//       // tslint:disable-next-line:max-line-length
//       const confirmed = await confirm(`Are you sure you want to delete: ${colors.blue(stacks.map(s => s.name).join(', '))} (y/n)?`);
//       if (!confirmed) {
//         return;
//       }
//     }

//     for (const stack of stacks) {
//       success('%s: destroying...', colors.blue(stack.name));
//       try {
//         await destroyStack({ stack, sdk: aws, deployName: stack.name, roleArn });
//         success('\n ✅  %s: destroyed', colors.blue(stack.name));
//       } catch (e) {
//         error('\n ❌  %s: destroy failed', colors.blue(stack.name), e);
//         throw e;
//       }
//     }
//   }

//   function toJsonOrYaml(object: any): string {
//     return serializeStructure(object, argv.json);
//   }
// }

// initCommandLine()
//   .then(value => {
//     if (value == null) { return; }
//     if (typeof value === 'string') {
//       data(value);
//     } else if (typeof value === 'number') {
//       process.exit(value);
//     }
//   })
//   .catch(err => {
//     error(err.message);
//     debug(err.stack);
//     process.exit(1);
//   });
