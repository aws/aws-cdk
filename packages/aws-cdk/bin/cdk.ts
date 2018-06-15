#!/usr/bin/env node
import 'source-map-support/register';

import * as cxapi from '@aws-cdk/cx-api';
import { deepMerge, isEmpty, partition } from '@aws-cdk/util';
import { exec, spawn } from 'child_process';
import { blue, green } from 'colors/safe';
import * as fs from 'fs-extra';
import * as minimatch from 'minimatch';
import { promisify } from 'util';
import * as YAML from 'yamljs';
import * as yargs from 'yargs';

import { bootstrapEnvironment, deployStack, destroyStack, loadToolkitInfo, Mode, SDK } from '../lib';
import * as contextplugins from '../lib/contextplugins';
import { printStackDiff } from '../lib/diff';
import { availableInitLanguages, cliInit, printAvailableTemplates } from '../lib/init';
import { interactive } from '../lib/interactive';
import { data, debug, error, highlight, print, setVerbose, success, warning } from '../lib/logging';
import { PluginHost } from '../lib/plugin';
import { parseRenames } from '../lib/renames';
import { Settings } from '../lib/settings';

// tslint:disable-next-line:no-var-requires
const promptly = require('promptly');

const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

const DEFAULTS = 'cdk.json';
const PER_USER_DEFAULTS = '~/.cdk.json';

// tslint:disable:no-shadowed-variable
async function parseCommandLineArguments() {
    const initTemplateLanuages = await availableInitLanguages;
    return yargs
        .usage('Usage: cdk -a <cloud-executable> COMMAND')
        .option('app', { type: 'string', alias: 'a', desc: 'REQUIRED: Command-line of cloud executable (e.g. "node bin/my-app.js")' })
        .option('context', { type: 'array', alias: 'c', desc: 'Add contextual string parameter.', nargs: 1, requiresArg: 'KEY=VALUE' })
        // tslint:disable-next-line:max-line-length
        .option('plugin', { type: 'array', alias: 'p', desc: 'Name or path of a node package that extend the CDK features. Can be specified multiple times', nargs: 1 })
        // tslint:disable-next-line:max-line-length
        .option('rename', { type: 'string', desc: 'Rename stack name if different then the one defined in the cloud executable', requiresArg: '[ORIGINAL:]RENAMED' })
        .option('trace', { type: 'boolean', desc: 'Print trace for stack warnings' })
        .option('strict', { type: 'boolean', desc: 'Do not construct stacks with warnings' })
        .option('json', { type: 'boolean', alias: 'j', desc: 'Use JSON output instead of YAML' })
        .option('verbose', { type: 'boolean', alias: 'v', desc: 'Show debug logs' })
        .demandCommand(1)
        .command('docs', 'Opens the documentation in a browser', yargs => yargs
            // tslint:disable-next-line:max-line-length
            .option('browser', { type: 'string', alias: 'b', desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
                                default: process.platform === 'win32' ? 'start %u' : 'open %u' }))
        .command('list', 'Lists all stacks in the cloud executable (alias: ls)')
        // tslint:disable-next-line:max-line-length
        .command('synth [STACKS..]', 'Synthesizes and prints the cloud formation template for this stack (alias: synthesize, construct, cons)', yargs => yargs
            .option('interactive', { type: 'boolean', alias: 'i', desc: 'interactively watch and show template updates' })
            .option('output', { type: 'string', alias: 'o', desc: 'write CloudFormation template for requested stacks to the given directory' }))
        .command('bootstrap [ENVIRONMENTS..]', 'Deploys the CDK toolkit stack into an AWS environment', yargs => yargs
            .option('toolkit-stack-name', { type: 'string', desc: 'the name of the CDK toolkit stack' }))
        .command('deploy [STACKS...]', 'Deploys the stack(s) named STACKS into your AWS account', yargs => yargs
            .option('toolkit-stack-name', { type: 'string', desc: 'the name of the CDK toolkit stack' }))
        .command('destroy [STACKS...]', 'Destroy the stack(s) named STACKS', yargs => yargs
            .option('force', { type: 'boolean', alias: 'f', desc: 'Do not ask for confirmation before destroying the stacks' }))
        .command('diff [STACK]', 'Compares the specified stack with the deployed stack or a local template file', yargs => yargs
            .option('template', { type: 'string', desc: 'the path to the CloudFormation template to compare with' }))
        .command('metadata [STACK]', 'Returns all metadata associated with this stack')
        // tslint:disable-next-line:max-line-length
        .command('init [TEMPLATE]', 'Create a new, empty CDK project from a template. Invoked without TEMPLATE, the app template will be used.', yargs => yargs
            // tslint:disable-next-line:max-line-length
            .option('language', { type: 'string', alias: 'l', desc: 'the language to be used for the new project (default can be configured in ~/.cdk.json)', choices: initTemplateLanuages })
            .option('list', { type: 'boolean', desc: 'list the available templates' }))
        .epilogue([
            'If your app has a single stack, there is no need to specify the stack name',
            'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.'
        ].join('\n\n'))
        .argv;
}
// tslint:enable:no-shadowed-variable

async function initCommandLine() {
    const argv = await parseCommandLineArguments();
    if (argv.verbose) {
        setVerbose();
    }

    const aws = new SDK();

    const availableContextProviders: contextplugins.ProviderMap = {
        'availability-zones': new contextplugins.AZContextProviderPlugin(aws),
        'ssm': new contextplugins.SSMContextProviderPlugin(aws),
    };

    const userConfig = new Settings().load(PER_USER_DEFAULTS);
    const projectConfig = new Settings().load(DEFAULTS);
    const commandLineArguments = argumentsToSettings();
    const renames = parseRenames(argv.rename);

    logDefaults(); // Ignores command-line arguments

    /** Function to return the complete merged config */
    function completeConfig(): Settings {
        return userConfig.merge(projectConfig).merge(commandLineArguments);
    }

    /** Function to load plug-ins, using configurations additively. */
    function loadPlugins(...settings: Settings[]) {
        const loaded = new Set<string>();
        for (const source of settings) {
            const plugins: string[] = source.get(['plugin']) || [];
            for (const plugin of plugins) {
                const resolved = tryResolve(plugin);
                if (loaded.has(resolved)) { continue; }
                debug(`Loading plug-in: ${green(plugin)} from ${blue(resolved)}`);
                PluginHost.instance.load(plugin);
                loaded.add(resolved);
            }
        }

        function tryResolve(plugin: string): string {
            try {
                return require.resolve(plugin);
            } catch (e) {
                error(`Unable to resolve plugin ${green(plugin)}: ${e.stack}`);
                throw new Error(`Unable to resolve plug-in: ${plugin}`);
            }
        }
    }

    loadPlugins(userConfig, projectConfig, commandLineArguments);

    const cmd = argv._[0];

    const returnValue = await main(cmd, argv);
    if (typeof returnValue === 'object') {
        return toJsonOrYaml(returnValue);
    } else if (typeof returnValue === 'string') {
        return returnValue;
    } else {
        return returnValue;
    }

    async function main(command: string, args: any): Promise<number | string | {} | void> {
        const toolkitStackName = completeConfig().get(['toolkitStackName']) || DEFAULT_TOOLKIT_STACK_NAME;

        switch (command) {
            case 'docs':
                return await openDocsite(completeConfig().get(['browser']));

            case 'ls':
            case 'list':
                return await listStacks();

            case 'diff':
                return await diffStack(await findStack(args.STACK), args.template);

            case 'bootstrap':
                return await cliBootstrap(args.ENVIRONMENTS, toolkitStackName);

            case 'deploy':
                return await cliDeploy(args.STACKS, toolkitStackName);

            case 'destroy':
                return await cliDestroy(args.STACKS, args.force);

            case 'cons':
            case 'construct':
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
                    return await cliInit(args.TEMPLATE || 'default', language);
                }

            default:
                throw new Error('Unknown command: ' + command);
        }
    }

    async function cliMetadata(stack: cxapi.StackId) {
        const s = await synthesizeStack(stack);
        return s.metadata;
    }

    /**
     * Extracts 'warning' metadata entries from the stack synthesis
     */
    function printWarnings(stacks: cxapi.SynthesizeResponse) {
        let found = false;
        for (const stack of stacks.stacks) {
            for (const id of Object.keys(stack.metadata)) {
                const metadata = stack.metadata[id];
                for (const entry of metadata) {
                    if (entry.type === 'warning') {
                        found = true;
                        warning(`Warning: ${entry.data} (at ${stack.name}:${id})`);

                        if (argv.trace) {
                            warning(`  ${entry.trace.join('\n  ')}`);
                        }
                    }
                }
            }
        }
        return found;
    }

    async function openDocsite(commandTemplate: string): Promise<number> {
        let documentationIndexPath: string;
        try {
            // tslint:disable-next-line:no-var-require Taking an un-declared dep on aws-cdk-docs, to avoid a dependency circle
            const docs = require('aws-cdk-docs');
            documentationIndexPath = docs.documentationIndexPath;
        } catch (err) {
            error('Unable to open CDK documentation - the aws-cdk-docs package appears to be missing. Please run `npm install -g aws-cdk-docs`');
            return -1;
        }

        const browserCommand = commandTemplate.replace(/%u/g, documentationIndexPath);
        debug(`Opening documentation ${green(browserCommand)}`);
        return await new Promise<number>((resolve, reject) => {
            exec(browserCommand, (err, stdout, stderr) => {
                if (err) { return reject(err); }
                if (stdout) { debug(stdout); }
                if (stderr) { warning(stderr); }
                resolve(0);
            });
        });
    }

    /**
     * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
     *
     * @param environmentGlobs environment names that need to have toolkit support
     *                         provisioned, as a glob filter. If none is provided,
     *                         all stacks are implicitly selected.
     * @param toolkitStackName the name to be used for the CDK Toolkit stack.
     */
    async function cliBootstrap(environmentGlobs: string[], toolkitStackName: string): Promise<void> {
        if (environmentGlobs.length === 0) {
            environmentGlobs = [ '**' ]; // default to ALL
        }
        const stackInfos = await selectStacks();
        const availableEnvironments = stackInfos.map(stack => stack.environment)
                                                .filter(env => env !== undefined);
        const environments = availableEnvironments.filter(env => environmentGlobs.find(glob => minimatch(env!.name, glob)));
        if (environments.length === 0) {
            const globs = JSON.stringify(environmentGlobs);
            const envList = availableEnvironments.length > 0 ? availableEnvironments.map(env => env!.name).join(', ') : '<none>';
            throw new Error(`No environments were found when selecting across ${globs} (available: ${envList})`);
        }
        await Promise.all(environments.map(async (environment) => {
            success(' ⏳  Bootstrapping environment %s...', blue(environment!.name));
            try {
                const result = await bootstrapEnvironment(environment!, aws, toolkitStackName);
                const message = result.noOp ? ' ✅  Environment %s was already fully bootstrapped!'
                                            : ' ✅  Successfully bootstraped environment %s!';
                success(message, blue(environment!.name));
            } catch (e) {
                error(' ❌  Environment %s failed bootstrapping: %s', blue(environment!.name), e);
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
    async function cliSynthesize(stackNames: string[],
                                 doInteractive: boolean,
                                 outputDir: string|undefined,
                                 json: boolean): Promise<void> {
        const stackIds = await selectStacks(...stackNames);
        renames.validateSelectedStacks(stackIds);

        if (doInteractive) {
            if (stackIds.length !== 1) {
                throw new Error(`When using interactive synthesis, must select exactly one stack. Got: ${listStackNames(stackIds)}`);
            }
            return await interactive(stackIds[0], argv.verbose, synthesizeStack);
        }

        if (stackIds.length > 1 && outputDir == null) {
            // tslint:disable-next-line:max-line-length
            throw new Error(`Multiple stacks selected (${listStackNames(stackIds)}), but output is directed to stdout. Either select one stack, or use --output to send templates to a directory.`);
        }

        const synthesizedStacks = await synthesizeStacks(stackIds);

        if (outputDir == null) {
            return synthesizedStacks[0].template;  // Will be printed in main()
        }

        fs.mkdirpSync(outputDir);

        for (const stack of synthesizedStacks) {
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
    async function synthesizeStack(stack: cxapi.StackId): Promise<cxapi.SynthesizedStack> {
        const resp = await synthesizeStacks([stack]);
        return resp[0];
    }

    /**
     * Synthesize a set of stacks
     */
    async function synthesizeStacks(stacks: cxapi.StackId[]): Promise<cxapi.SynthesizedStack[]> {
        // We may need to run the cloud executable multiple times in order to satisfy all missing context
        while (true) {
            debug(`Synthesizing ${listStackNames(stacks)}`);
            const response: cxapi.SynthesizeResponse = await execProgram({ type: 'synth', stacks: stacks.map(s => s.name) });
            const allMissing = deepMerge(...response.stacks.map(s => s.missing));

            if (!isEmpty(allMissing)) {
                debug(`Some context information is missing. Fetching...`);

                await contextplugins.provideContextValues(allMissing, projectConfig, availableContextProviders);

                // Cache the new context to disk
                projectConfig.save(DEFAULTS);
                continue;
            }

            if (printWarnings(response) && argv.strict) {
                throw new Error('Found warnings (--strict mode)');
            }

            // All good, return
            return response.stacks;
        }
    }

    /**
     * List all stacks in the CX and return the selected ones
     *
     * It's an error if there are no stacks to select, or if one of the requested parameters
     * refers to a nonexistant stack.
     */
    async function selectStacks(...stackNames: string[]): Promise<cxapi.StackInfo[]> {
        stackNames = stackNames.filter(s => s != null); // filter null/undefined

        const stackIds: cxapi.StackInfo[] = await listStacks();
        if (stackIds.length === 0) {
            throw new Error('This app contains no stacks');
        }

        if (stackNames.length === 0) {
            debug('Stack name not specified, so defaulting to all available stacks: ' + listStackNames(stackIds));
            return stackIds;
        }

        // For every selector argument, pick stacks from the list. Remove
        // from the original list to make sure we never select the same stack twice.
        const ret: cxapi.StackId[] = [];
        for (const stackName of stackNames) {
            const matched = partition(stackIds, stackId => minimatch(stackId.name, stackName));
            if (matched.length === 0) {
                throw new Error(`No stack found matching '${stackName}'. Use "list" to print manifest`);
            }
            ret.push(...matched);
        }

        return ret;
    }

    async function listStacks(): Promise<cxapi.StackInfo[]> {
        const response: cxapi.ListStacksResponse = await execProgram({ type: 'list' });
        return response.stacks;
    }

    async function cliDeploy(stackNames: string[], toolkitStackName: string) {
        const stackIds = await selectStacks(...stackNames);
        renames.validateSelectedStacks(stackIds);

        const synthesizedStacks = await synthesizeStacks(stackIds);

        for (const stack of synthesizedStacks) {
            if (stackIds.length !== 1) { highlight(stack.name); }
            if (!stack.environment) {
                throw new Error(`Stack ${stack.name} has no environment`);
            }
            const toolkitInfo = await loadToolkitInfo(stack.environment, aws, toolkitStackName);
            const deployName = renames.finalName(stack.name);

            if (deployName !== stack.name) {
                success(' ⏳  Starting deployment of stack %s as %s...', blue(stack.name), blue(deployName));
            } else {
                success(' ⏳  Starting deployment of stack %s...', blue(stack.name));
            }

            try {
                const result = await deployStack(stack, aws, toolkitInfo, deployName);
                const message = result.noOp ? ' ✅  Stack was already up-to-date!'
                                            : ' ✅  Deployment of stack %s completed successfully!';
                success(message, blue(stack.name));
                for (const name of Object.keys(result.outputs)) {
                    const value = result.outputs[name];
                    print('Output %s = %s', blue(name), green(value));
                }
            } catch (e) {
                error(' ❌  Deployment of stack %s failed: %s', blue(stack.name), e);
                throw e;
            }
        }
    }

    async function cliDestroy(stackNames: string[], force: boolean) {
        const stackIds = await selectStacks(...stackNames);
        renames.validateSelectedStacks(stackIds);

        if (!force) {
            // tslint:disable-next-line:max-line-length
            const confirmed = await promisify(promptly.confirm)(`Are you sure you want to delete: ${blue(stackIds.map(s => s.name).join(', '))} (y/n)?`);
            if (!confirmed) {
                return;
            }
        }

        for (const stack of stackIds) {
            const deployName = renames.finalName(stack.name);

            success(' ⏳  Starting destruction of stack %s...', blue(deployName));
            try {
                await destroyStack(stack, aws, deployName);
                success(' ✅  Stack %s successfully destroyed.', blue(deployName));
            } catch (e) {
                error(' ❌  Destruction failed: %s', blue(deployName), e);
                throw e;
            }
        }
    }

    async function diffStack(stack: cxapi.StackInfo, templatePath?: string): Promise<number> {
        if (!stack.environment) {
            throw new Error(`Stack ${stack.name} has no environment`);
        }
        const s = await synthesizeStack(stack);
        const currentTemplate = await readCurrentTemplate(stack, templatePath);
        if (printStackDiff(currentTemplate, s) === 0) {
            return 0;
        } else {
            return 1;
        }
    }

    async function readCurrentTemplate(stack: cxapi.StackInfo, templatePath?: string): Promise<{ [key: string]: any }> {
        if (templatePath) {
            if (!await fs.pathExists(templatePath)) {
                throw new Error(`There is no file at ${templatePath}`);
            }
            const fileContent = await fs.readFile(templatePath, { encoding: 'UTF-8' });
            return parseTemplate(fileContent);
        } else {
            const cfn = await aws.cloudFormation(stack.environment!, Mode.ForReading);
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
            try {
                return YAML.parse(text);
            } catch (e) {
                return JSON.parse(text);
            }
        }
    }

    /**
     * Match a single stack from the list of available stacks
     */
    async function findStack(name: string): Promise<cxapi.StackId> {
        const stackIds = await selectStacks(name);

        // Could have been a glob so check that we evaluated to exactly one
        if (stackIds.length > 1) {
            throw new Error(`This command requires exactly one stack, '${name}' matches more than one: `);
        }

        return stackIds[0];
    }

    /** Invokes the cloud executable and returns JSON output */
    async function execProgram(request: cxapi.CXRequest): Promise<any> {
        const config = completeConfig();
        request.context = config.get(['context']);

        await populateDefaultEnvironmentIfNeeded(request.context);

        const app = config.get(['app']);
        if (!app) {
            throw new Error(`--app is required either in command-line, in ${DEFAULTS} or in ${PER_USER_DEFAULTS}`);
        }

        const commandLine = appToArray(app);
        commandLine.push(JSON.stringify(request));

        debug(commandArrayToString(commandLine));

        return new Promise<string>((ok, fail) => {
            // We use a slightly lower-level interface to:
            //
            // - Pass arguments in an array instead of a string, to get around a
            //   number of quoting issues introduced by the intermediate shell layer
            //   (which would be different between Linux and Windows).
            //
            // - Inherit stderr from controlling terminal. We don't use the captured value
            //   anway, and if the subprocess is printing to it for debugging purposes the
            //   user gets to see it sooner. Plus, capturing doesn't interact nicely with some
            //   processes like Maven.
            const proc = spawn(commandLine[0], commandLine.slice(1), {
                stdio: ['ignore', 'pipe', 'inherit'],
                detached: false
            });

            const buf: Buffer[] = [];

            proc.stdout.on('data', d => {
                buf.push(d as Buffer);
            });

            proc.on('error', fail);

            proc.on('exit', code => {
                if (code === 0) {
                    const stdout = Buffer.concat(buf).toString();
                    let parsed = null;
                    try {
                        parsed = JSON.parse(stdout);
                    } catch (e) {
                        error("Invalid CDK App output. Make sure you emit the result of app.exec() to STDOUT:");
                        print(stdout);
                        return fail(new Error('Invalid CDK App output.'));
                    }
                    return ok(parsed);
                } else {
                    return fail(new Error('Subprocess exited with error ' + code.toString()));
                }
            });
        });
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
        });
    }

    /**
     * Make sure the 'app' is an array
     *
     * If it's a string, split on spaces as a trivial way of tokenizing the command line.
     */
    function appToArray(app: any) {
        return typeof app === 'string' ? app.split(' ') : app;
    }

    /**
     * Return a properly shell-escaped version of the given command line array
     *
     * This is only used for debugging purposes, to show the user a command that they can
     * pop into the shell to reproduce what we did.
     */
    function commandArrayToString(command: string[]): string {
        return command.map(shellEscape).join(' ');
    }

    /**
     * Escape a shell argument with the least amount of fuss
     */
    function shellEscape(x: string): string {
        // Don't quote if the string only consists of a known safe subset of characters.
        // Blacklisting is actually sufficient for this particular case, but whitelisting feels safer.
        if (x.search(/[^a-z0-9_\/:.-]/i) === -1) { return x; }

        // Quote with single quotes, and do '\'' to reproduce literal single quotes.
        return `'${x.replace(/'/g, "'\\''")}'`;
    }

    /**
     * If we don't have region/account defined in context, we fall back to the default SDK behavior
     * where region is retreived from ~/.aws/config and account is based on default credentials provider
     * chain and then STS is queried.
     *
     * This is done opportunistically: for example, if we can't acccess STS for some reason or the region
     * is not configured, the context value will be 'null' and there could failures down the line. In
     * some cases, synthesis does not require region/account information at all, so that might be perfectly
     * fine in certain scenarios.
     *
     * @param context The context key/value bash.
     */
    async function populateDefaultEnvironmentIfNeeded(context: any) {
        if (!(cxapi.DEFAULT_REGION_CONTEXT_KEY in context)) {
            context[cxapi.DEFAULT_REGION_CONTEXT_KEY] = aws.defaultRegion();
            debug(`Setting "${cxapi.DEFAULT_REGION_CONTEXT_KEY}" context to`, context[cxapi.DEFAULT_REGION_CONTEXT_KEY]);
        }

        if (!(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY in context)) {
            context[cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY] = await aws.defaultAccount();
            debug(`Setting "${cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY}" context to`, context[cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY]);
        }
    }

    /**
     * Combine the names of a set of stacks using a comma
     */
    function listStackNames(stacks: cxapi.StackId[]): string {
        return stacks.map(s => s.name).join(', ');
    }

    function toJsonOrYaml(object: any): string {
        if (argv.json) {
            const noFiltering = undefined;
            const indentWidth = 2;
            return JSON.stringify(object, noFiltering, indentWidth);
        } else {
            const inlineJsonAfterDepth = 16;
            const indentWidth = 4;
            return YAML.stringify(object, inlineJsonAfterDepth, indentWidth);
        }
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
