import * as path from 'path';
import { format } from 'util';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as promptly from 'promptly';
import { DeploymentMethod } from './api';
import { SdkProvider } from './api/aws-auth';
import { Bootstrapper, BootstrapEnvironmentOptions } from './api/bootstrap';
import { CloudFormationDeployments } from './api/cloudformation-deployments';
import { CloudAssembly, DefaultSelection, ExtendedStackSelection, StackCollection, StackSelector } from './api/cxapp/cloud-assembly';
import { CloudExecutable } from './api/cxapp/cloud-executable';
import { HotswapMode } from './api/hotswap/common';
import { findCloudWatchLogGroups } from './api/logs/find-cloudwatch-logs';
import { CloudWatchLogEventMonitor } from './api/logs/logs-monitor';
import { StackActivityProgress } from './api/util/cloudformation/stack-activity-monitor';
import { buildAllStackAssets } from './build';
import { deployStacks } from './deploy';
import { printSecurityDiff, printStackDiff, RequireApproval } from './diff';
import { ResourceImporter } from './import';
import { data, debug, error, highlight, print, success, warning } from './logging';
import { deserializeStructure, serializeStructure } from './serialize';
import { Configuration, PROJECT_CONFIG } from './settings';
import { numberFromBool, partition } from './util';
import { validateSnsTopicArn } from './util/validate-notification-arn';
import { environmentsFromDescriptors, globEnvironmentsFromStacks, looksLikeGlob } from '../lib/api/cxapp/environments';

export interface CdkToolkitProps {

  /**
   * The Cloud Executable
   */
  cloudExecutable: CloudExecutable;

  /**
   * The provisioning engine used to apply changes to the cloud
   */
  cloudFormation: CloudFormationDeployments;

  /**
   * Whether to be verbose
   *
   * @default false
   */
  verbose?: boolean;

  /**
   * Don't stop on error metadata
   *
   * @default false
   */
  ignoreErrors?: boolean;

  /**
   * Treat warnings in metadata as errors
   *
   * @default false
   */
  strict?: boolean;

  /**
   * Application configuration (settings and context)
   */
  configuration: Configuration;

  /**
   * AWS object (used by synthesizer and contextprovider)
   */
  sdkProvider: SdkProvider;
}

/**
 * When to build assets
 */
export enum AssetBuildTime {
  /**
   * Build all assets before deploying the first stack
   *
   * This is intended for expensive Docker image builds; so that if the Docker image build
   * fails, no stacks are unnecessarily deployed (with the attendant wait time).
   */
  ALL_BEFORE_DEPLOY,

  /**
   * Build assets just-in-time, before publishing
   */
  JUST_IN_TIME,
}

/**
 * Toolkit logic
 *
 * The toolkit runs the `cloudExecutable` to obtain a cloud assembly and
 * deploys applies them to `cloudFormation`.
 */
export class CdkToolkit {
  constructor(private readonly props: CdkToolkitProps) {
  }

  public async metadata(stackName: string, json: boolean) {
    const stacks = await this.selectSingleStackByName(stackName);
    data(serializeStructure(stacks.firstStack.manifest.metadata ?? {}, json));
  }

  public async acknowledge(noticeId: string) {
    const acks = this.props.configuration.context.get('acknowledged-issue-numbers') ?? [];
    acks.push(Number(noticeId));
    this.props.configuration.context.set('acknowledged-issue-numbers', acks);
    await this.props.configuration.saveContext();
  }

  public async diff(options: DiffOptions): Promise<number> {
    const stacks = await this.selectStacksForDiff(options.stackNames, options.exclusively);

    const strict = !!options.strict;
    const contextLines = options.contextLines || 3;
    const stream = options.stream || process.stderr;

    let diffs = 0;
    if (options.templatePath !== undefined) {
      // Compare single stack against fixed template
      if (stacks.stackCount !== 1) {
        throw new Error('Can only select one stack when comparing to fixed template. Use --exclusively to avoid selecting multiple stacks.');
      }

      if (!await fs.pathExists(options.templatePath)) {
        throw new Error(`There is no file at ${options.templatePath}`);
      }
      const template = deserializeStructure(await fs.readFile(options.templatePath, { encoding: 'UTF-8' }));
      diffs = options.securityOnly
        ? numberFromBool(printSecurityDiff(template, stacks.firstStack, RequireApproval.Broadening))
        : printStackDiff(template, stacks.firstStack, strict, contextLines, stream);
    } else {
      // Compare N stacks against deployed templates
      for (const stack of stacks.stackArtifacts) {
        stream.write(format('Stack %s\n', chalk.bold(stack.displayName)));
        const currentTemplate = await this.props.cloudFormation.readCurrentTemplateWithNestedStacks(stack, options.compareAgainstProcessedTemplate);
        diffs += options.securityOnly
          ? numberFromBool(printSecurityDiff(currentTemplate, stack, RequireApproval.Broadening))
          : printStackDiff(currentTemplate, stack, strict, contextLines, stream);
      }
    }

    return diffs && options.fail ? 1 : 0;
  }

  public async deploy(options: DeployOptions) {
    if (options.watch) {
      return this.watch(options);
    }

    if (options.notificationArns) {
      options.notificationArns.map( arn => {
        if (!validateSnsTopicArn(arn)) {
          throw new Error(`Notification arn ${arn} is not a valid arn for an SNS topic`);
        }
      });
    }

    const startSynthTime = new Date().getTime();
    const stackCollection = await this.selectStacksForDeploy(options.selector, options.exclusively, options.cacheCloudAssembly);
    const elapsedSynthTime = new Date().getTime() - startSynthTime;
    print('\n✨  Synthesis time: %ss\n', formatTime(elapsedSynthTime));

    const requireApproval = options.requireApproval ?? RequireApproval.Broadening;

    const parameterMap: { [name: string]: { [name: string]: string | undefined } } = { '*': {} };
    for (const key in options.parameters) {
      if (options.parameters.hasOwnProperty(key)) {
        const [stack, parameter] = key.split(':', 2);
        if (!parameter) {
          parameterMap['*'][stack] = options.parameters[key];
        } else {
          if (!parameterMap[stack]) {
            parameterMap[stack] = {};
          }
          parameterMap[stack][parameter] = options.parameters[key];
        }
      }
    }

    if (options.hotswap !== HotswapMode.FULL_DEPLOYMENT) {
      warning('⚠️ The --hotswap and --hotswap-fallback flags deliberately introduce CloudFormation drift to speed up deployments');
      warning('⚠️ They should only be used for development - never use them for your production Stacks!\n');
    }

    const stacks = stackCollection.stackArtifacts;
    const assetBuildTime = options.assetBuildTime ?? AssetBuildTime.ALL_BEFORE_DEPLOY;

    const stackOutputs: { [key: string]: any } = { };
    const outputsFile = options.outputsFile;

    if (assetBuildTime === AssetBuildTime.ALL_BEFORE_DEPLOY) {
      // Prebuild all assets
      try {
        await buildAllStackAssets(stackCollection.stackArtifacts, {
          buildStackAssets: (a) => this.buildAllAssetsForSingleStack(a, options),
        });
      } catch (e) {
        error('\n ❌ Building assets failed: %s', e);
        throw e;
      }
    }

    const deployStack = async (stack: cxapi.CloudFormationStackArtifact) => {
      if (stackCollection.stackCount !== 1) { highlight(stack.displayName); }

      if (!stack.environment) {
        // eslint-disable-next-line max-len
        throw new Error(`Stack ${stack.displayName} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`);
      }

      if (Object.keys(stack.template.Resources || {}).length === 0) { // The generated stack has no resources
        if (!await this.props.cloudFormation.stackExists({ stack })) {
          warning('%s: stack has no resources, skipping deployment.', chalk.bold(stack.displayName));
        } else {
          warning('%s: stack has no resources, deleting existing stack.', chalk.bold(stack.displayName));
          await this.destroy({
            selector: { patterns: [stack.hierarchicalId] },
            exclusively: true,
            force: true,
            roleArn: options.roleArn,
            fromDeploy: true,
            ci: options.ci,
          });
        }
        return;
      }

      if (requireApproval !== RequireApproval.Never) {
        const currentTemplate = await this.props.cloudFormation.readCurrentTemplate(stack);
        if (printSecurityDiff(currentTemplate, stack, requireApproval)) {

          // only talk to user if STDIN is a terminal (otherwise, fail)
          if (!process.stdin.isTTY) {
            throw new Error(
              '"--require-approval" is enabled and stack includes security-sensitive updates, ' +
              'but terminal (TTY) is not attached so we are unable to get a confirmation from the user');
          }

          // only talk to user if concurreny is 1 (otherwise, fail)
          if (concurrency > 1) {
            throw new Error(
              '"--require-approval" is enabled and stack includes security-sensitive updates, ' +
              'but concurrency is greater than 1 so we are unable to get a confirmation from the user');
          }

          const confirmed = await promptly.confirm('Do you wish to deploy these changes (y/n)?');
          if (!confirmed) { throw new Error('Aborted by user'); }
        }
      }

      const stackIndex = stacks.indexOf(stack)+1;
      print('%s: deploying... [%s/%s]', chalk.bold(stack.displayName), stackIndex, stackCollection.stackCount);
      const startDeployTime = new Date().getTime();

      let tags = options.tags;
      if (!tags || tags.length === 0) {
        tags = tagsForStack(stack);
      }

      let elapsedDeployTime = 0;
      try {
        const result = await this.props.cloudFormation.deployStack({
          stack,
          deployName: stack.stackName,
          roleArn: options.roleArn,
          toolkitStackName: options.toolkitStackName,
          reuseAssets: options.reuseAssets,
          notificationArns: options.notificationArns,
          tags,
          execute: options.execute,
          changeSetName: options.changeSetName,
          deploymentMethod: options.deploymentMethod,
          force: options.force,
          parameters: Object.assign({}, parameterMap['*'], parameterMap[stack.stackName]),
          usePreviousParameters: options.usePreviousParameters,
          progress,
          ci: options.ci,
          rollback: options.rollback,
          hotswap: options.hotswap,
          extraUserAgent: options.extraUserAgent,
          buildAssets: assetBuildTime !== AssetBuildTime.ALL_BEFORE_DEPLOY,
          assetParallelism: options.assetParallelism,
        });

        const message = result.noOp
          ? ' ✅  %s (no changes)'
          : ' ✅  %s';

        success('\n' + message, stack.displayName);
        elapsedDeployTime = new Date().getTime() - startDeployTime;
        print('\n✨  Deployment time: %ss\n', formatTime(elapsedDeployTime));

        if (Object.keys(result.outputs).length > 0) {
          print('Outputs:');

          stackOutputs[stack.stackName] = result.outputs;
        }

        for (const name of Object.keys(result.outputs).sort()) {
          const value = result.outputs[name];
          print('%s.%s = %s', chalk.cyan(stack.id), chalk.cyan(name), chalk.underline(chalk.cyan(value)));
        }

        print('Stack ARN:');

        data(result.stackArn);
      } catch (e) {
        error('\n ❌  %s failed: %s', chalk.bold(stack.displayName), e);
        throw e;
      } finally {
        if (options.cloudWatchLogMonitor) {
          const foundLogGroupsResult = await findCloudWatchLogGroups(this.props.sdkProvider, stack);
          options.cloudWatchLogMonitor.addLogGroups(foundLogGroupsResult.env, foundLogGroupsResult.sdk, foundLogGroupsResult.logGroupNames);
        }
        // If an outputs file has been specified, create the file path and write stack outputs to it once.
        // Outputs are written after all stacks have been deployed. If a stack deployment fails,
        // all of the outputs from successfully deployed stacks before the failure will still be written.
        if (outputsFile) {
          fs.ensureFileSync(outputsFile);
          await fs.writeJson(outputsFile, stackOutputs, {
            spaces: 2,
            encoding: 'utf8',
          });
        }
      }
      print('\n✨  Total time: %ss\n', formatTime(elapsedSynthTime + elapsedDeployTime));
    };

    const concurrency = options.concurrency || 1;
    const progress = concurrency > 1 ? StackActivityProgress.EVENTS : options.progress;
    if (concurrency > 1 && options.progress && options.progress != StackActivityProgress.EVENTS) {
      warning('⚠️ The --concurrency flag only supports --progress "events". Switching to "events".');
    }

    try {
      await deployStacks(stacks, { concurrency, deployStack });
    } catch (e) {
      error('\n ❌ Deployment failed: %s', e);
      throw e;
    }
  }

  public async watch(options: WatchOptions) {
    const rootDir = path.dirname(path.resolve(PROJECT_CONFIG));
    debug("root directory used for 'watch' is: %s", rootDir);

    const watchSettings: { include?: string | string[], exclude: string | string [] } | undefined =
        this.props.configuration.settings.get(['watch']);
    if (!watchSettings) {
      throw new Error("Cannot use the 'watch' command without specifying at least one directory to monitor. " +
        'Make sure to add a "watch" key to your cdk.json');
    }

    // For the "include" subkey under the "watch" key, the behavior is:
    // 1. No "watch" setting? We error out.
    // 2. "watch" setting without an "include" key? We default to observing "./**".
    // 3. "watch" setting with an empty "include" key? We default to observing "./**".
    // 4. Non-empty "include" key? Just use the "include" key.
    const watchIncludes = this.patternsArrayForWatch(watchSettings.include, { rootDir, returnRootDirIfEmpty: true });
    debug("'include' patterns for 'watch': %s", watchIncludes);

    // For the "exclude" subkey under the "watch" key,
    // the behavior is to add some default excludes in addition to the ones specified by the user:
    // 1. The CDK output directory.
    // 2. Any file whose name starts with a dot.
    // 3. Any directory's content whose name starts with a dot.
    // 4. Any node_modules and its content (even if it's not a JS/TS project, you might be using a local aws-cli package)
    const outputDir = this.props.configuration.settings.get(['output']);
    const watchExcludes = this.patternsArrayForWatch(watchSettings.exclude, { rootDir, returnRootDirIfEmpty: false }).concat(
      `${outputDir}/**`,
      '**/.*',
      '**/.*/**',
      '**/node_modules/**',
    );
    debug("'exclude' patterns for 'watch': %s", watchExcludes);

    // Since 'cdk deploy' is a relatively slow operation for a 'watch' process,
    // introduce a concurrency latch that tracks the state.
    // This way, if file change events arrive when a 'cdk deploy' is still executing,
    // we will batch them, and trigger another 'cdk deploy' after the current one finishes,
    // making sure 'cdk deploy's  always execute one at a time.
    // Here's a diagram showing the state transitions:
    // --------------                --------    file changed     --------------    file changed     --------------  file changed
    // |            |  ready event   |      | ------------------> |            | ------------------> |            | --------------|
    // | pre-ready  | -------------> | open |                     | deploying  |                     |   queued   |               |
    // |            |                |      | <------------------ |            | <------------------ |            | <-------------|
    // --------------                --------  'cdk deploy' done  --------------  'cdk deploy' done  --------------
    let latch: 'pre-ready' | 'open' | 'deploying' | 'queued' = 'pre-ready';

    const cloudWatchLogMonitor = options.traceLogs ? new CloudWatchLogEventMonitor() : undefined;
    const deployAndWatch = async () => {
      latch = 'deploying';
      cloudWatchLogMonitor?.deactivate();

      await this.invokeDeployFromWatch(options, cloudWatchLogMonitor);

      // If latch is still 'deploying' after the 'await', that's fine,
      // but if it's 'queued', that means we need to deploy again
      while ((latch as 'deploying' | 'queued') === 'queued') {
        // TypeScript doesn't realize latch can change between 'awaits',
        // and thinks the above 'while' condition is always 'false' without the cast
        latch = 'deploying';
        print("Detected file changes during deployment. Invoking 'cdk deploy' again");
        await this.invokeDeployFromWatch(options, cloudWatchLogMonitor);
      }
      latch = 'open';
      cloudWatchLogMonitor?.activate();
    };

    chokidar.watch(watchIncludes, {
      ignored: watchExcludes,
      cwd: rootDir,
      // ignoreInitial: true,
    }).on('ready', async () => {
      latch = 'open';
      debug("'watch' received the 'ready' event. From now on, all file changes will trigger a deployment");
      print("Triggering initial 'cdk deploy'");
      await deployAndWatch();
    }).on('all', async (event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', filePath?: string) => {
      if (latch === 'pre-ready') {
        print(`'watch' is observing ${event === 'addDir' ? 'directory' : 'the file'} '%s' for changes`, filePath);
      } else if (latch === 'open') {
        print("Detected change to '%s' (type: %s). Triggering 'cdk deploy'", filePath, event);
        await deployAndWatch();
      } else { // this means latch is either 'deploying' or 'queued'
        latch = 'queued';
        print("Detected change to '%s' (type: %s) while 'cdk deploy' is still running. " +
            'Will queue for another deployment after this one finishes', filePath, event);
      }
    });
  }

  public async import(options: ImportOptions) {
    print(chalk.grey("The 'cdk import' feature is currently in preview."));
    const stacks = await this.selectStacksForDeploy(options.selector, true, true);

    if (stacks.stackCount > 1) {
      throw new Error(`Stack selection is ambiguous, please choose a specific stack for import [${stacks.stackArtifacts.map(x => x.id).join(', ')}]`);
    }

    if (!process.stdout.isTTY && !options.resourceMappingFile) {
      throw new Error('--resource-mapping is required when input is not a terminal');
    }

    const stack = stacks.stackArtifacts[0];

    highlight(stack.displayName);

    const resourceImporter = new ResourceImporter(stack, this.props.cloudFormation, {
      toolkitStackName: options.toolkitStackName,
    });
    const { additions, hasNonAdditions } = await resourceImporter.discoverImportableResources(options.force);
    if (additions.length === 0) {
      warning('%s: no new resources compared to the currently deployed stack, skipping import.', chalk.bold(stack.displayName));
      return;
    }

    // Prepare a mapping of physical resources to CDK constructs
    const actualImport = !options.resourceMappingFile
      ? await resourceImporter.askForResourceIdentifiers(additions)
      : await resourceImporter.loadResourceIdentifiers(additions, options.resourceMappingFile);

    if (actualImport.importResources.length === 0) {
      warning('No resources selected for import.');
      return;
    }

    // If "--create-resource-mapping" option was passed, write the resource mapping to the given file and exit
    if (options.recordResourceMapping) {
      const outputFile = options.recordResourceMapping;
      fs.ensureFileSync(outputFile);
      await fs.writeJson(outputFile, actualImport.resourceMap, {
        spaces: 2,
        encoding: 'utf8',
      });
      print('%s: mapping file written.', outputFile);
      return;
    }

    // Import the resources according to the given mapping
    print('%s: importing resources into stack...', chalk.bold(stack.displayName));
    const tags = tagsForStack(stack);
    await resourceImporter.importResources(actualImport, {
      stack,
      deployName: stack.stackName,
      roleArn: options.roleArn,
      toolkitStackName: options.toolkitStackName,
      tags,
      deploymentMethod: options.deploymentMethod,
      usePreviousParameters: true,
      progress: options.progress,
      rollback: options.rollback,
    });

    // Notify user of next steps
    print(
      `Import operation complete. We recommend you run a ${chalk.blueBright('drift detection')} operation `
      + 'to confirm your CDK app resource definitions are up-to-date. Read more here: '
      + chalk.underline.blueBright('https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html'));
    if (actualImport.importResources.length < additions.length) {
      print('');
      warning(`Some resources were skipped. Run another ${chalk.blueBright('cdk import')} or a ${chalk.blueBright('cdk deploy')} to bring the stack up-to-date with your CDK app definition.`);
    } else if (hasNonAdditions) {
      print('');
      warning(`Your app has pending updates or deletes excluded from this import operation. Run a ${chalk.blueBright('cdk deploy')} to bring the stack up-to-date with your CDK app definition.`);
    }
  }

  public async destroy(options: DestroyOptions) {
    let stacks = await this.selectStacksForDestroy(options.selector, options.exclusively);

    // The stacks will have been ordered for deployment, so reverse them for deletion.
    stacks = stacks.reversed();

    if (!options.force) {
      // eslint-disable-next-line max-len
      const confirmed = await promptly.confirm(`Are you sure you want to delete: ${chalk.blue(stacks.stackArtifacts.map(s => s.hierarchicalId).join(', '))} (y/n)?`);
      if (!confirmed) {
        return;
      }
    }

    const action = options.fromDeploy ? 'deploy' : 'destroy';
    for (const [index, stack] of stacks.stackArtifacts.entries()) {
      success('%s: destroying... [%s/%s]', chalk.blue(stack.displayName), index+1, stacks.stackCount);
      try {
        await this.props.cloudFormation.destroyStack({
          stack,
          deployName: stack.stackName,
          roleArn: options.roleArn,
          ci: options.ci,
        });
        success(`\n ✅  %s: ${action}ed`, chalk.blue(stack.displayName));
      } catch (e) {
        error(`\n ❌  %s: ${action} failed`, chalk.blue(stack.displayName), e);
        throw e;
      }
    }
  }

  public async list(selectors: string[], options: { long?: boolean, json?: boolean } = { }): Promise<number> {
    const stacks = await this.selectStacksForList(selectors);

    // if we are in "long" mode, emit the array as-is (JSON/YAML)
    if (options.long) {
      const long = [];
      for (const stack of stacks.stackArtifacts) {
        long.push({
          id: stack.hierarchicalId,
          name: stack.stackName,
          environment: stack.environment,
        });
      }
      data(serializeStructure(long, options.json ?? false));
      return 0;
    }

    // just print stack IDs
    for (const stack of stacks.stackArtifacts) {
      data(stack.hierarchicalId);
    }

    return 0; // exit-code
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
  public async synth(stackNames: string[], exclusively: boolean, quiet: boolean, autoValidate?: boolean, json?: boolean): Promise<any> {
    const stacks = await this.selectStacksForDiff(stackNames, exclusively, autoValidate);

    // if we have a single stack, print it to STDOUT
    if (stacks.stackCount === 1) {
      if (!quiet) {
        data(serializeStructure(stacks.firstStack.template, json ?? false));
      }
      return undefined;
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
      data(serializeStructure(stacks.stackArtifacts.map(s => s.template), json ?? false));
    }

    // not outputting template to stdout, let's explain things to the user a little bit...
    success(`Successfully synthesized to ${chalk.blue(path.resolve(stacks.assembly.directory))}`);
    print(`Supply a stack id (${stacks.stackArtifacts.map(s => chalk.green(s.hierarchicalId)).join(', ')}) to display its template.`);

    return undefined;
  }

  /**
   * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
   *
   * @param userEnvironmentSpecs environment names that need to have toolkit support
   *             provisioned, as a glob filter. If none is provided, all stacks are implicitly selected.
   * @param bootstrapper Legacy or modern.
   * @param options The name, role ARN, bootstrapping parameters, etc. to be used for the CDK Toolkit stack.
   */
  public async bootstrap(userEnvironmentSpecs: string[], bootstrapper: Bootstrapper, options: BootstrapEnvironmentOptions): Promise<void> {
    // If there is an '--app' argument and an environment looks like a glob, we
    // select the environments from the app. Otherwise, use what the user said.

    // By default, glob for everything
    const environmentSpecs = userEnvironmentSpecs.length > 0 ? [...userEnvironmentSpecs] : ['**'];

    // Partition into globs and non-globs (this will mutate environmentSpecs).
    const globSpecs = partition(environmentSpecs, looksLikeGlob);
    if (globSpecs.length > 0 && !this.props.cloudExecutable.hasApp) {
      if (userEnvironmentSpecs.length > 0) {
        // User did request this glob
        throw new Error(`'${globSpecs}' is not an environment name. Specify an environment name like 'aws://123456789012/us-east-1', or run in a directory with 'cdk.json' to use wildcards.`);
      } else {
        // User did not request anything
        throw new Error('Specify an environment name like \'aws://123456789012/us-east-1\', or run in a directory with \'cdk.json\'.');
      }
    }

    const environments: cxapi.Environment[] = [
      ...environmentsFromDescriptors(environmentSpecs),
    ];

    // If there is an '--app' argument, select the environments from the app.
    if (this.props.cloudExecutable.hasApp) {
      environments.push(...await globEnvironmentsFromStacks(await this.selectStacksForList([]), globSpecs, this.props.sdkProvider));
    }

    await Promise.all(environments.map(async (environment) => {
      success(' ⏳  Bootstrapping environment %s...', chalk.blue(environment.name));
      try {
        const result = await bootstrapper.bootstrapEnvironment(environment, this.props.sdkProvider, options);
        const message = result.noOp
          ? ' ✅  Environment %s bootstrapped (no changes).'
          : ' ✅  Environment %s bootstrapped.';
        success(message, chalk.blue(environment.name));
      } catch (e) {
        error(' ❌  Environment %s failed bootstrapping: %s', chalk.blue(environment.name), e);
        throw e;
      }
    }));
  }

  private async selectStacksForList(patterns: string[]) {
    const assembly = await this.assembly();
    const stacks = await assembly.selectStacks({ patterns }, { defaultBehavior: DefaultSelection.AllStacks });

    // No validation

    return stacks;
  }

  private async selectStacksForDeploy(selector: StackSelector, exclusively?: boolean, cacheCloudAssembly?: boolean): Promise<StackCollection> {
    const assembly = await this.assembly(cacheCloudAssembly);
    const stacks = await assembly.selectStacks(selector, {
      extend: exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
      defaultBehavior: DefaultSelection.OnlySingle,
    });

    this.validateStacksSelected(stacks, selector.patterns);
    this.validateStacks(stacks);

    return stacks;
  }

  private async selectStacksForDiff(stackNames: string[], exclusively?: boolean, autoValidate?: boolean): Promise<StackCollection> {
    const assembly = await this.assembly();

    const selectedForDiff = await assembly.selectStacks({ patterns: stackNames }, {
      extend: exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
      defaultBehavior: DefaultSelection.MainAssembly,
    });

    const allStacks = await this.selectStacksForList([]);
    const autoValidateStacks = autoValidate
      ? allStacks.filter(art => art.validateOnSynth ?? false)
      : new StackCollection(assembly, []);

    this.validateStacksSelected(selectedForDiff.concat(autoValidateStacks), stackNames);
    this.validateStacks(selectedForDiff.concat(autoValidateStacks));

    return selectedForDiff;
  }

  private async selectStacksForDestroy(selector: StackSelector, exclusively?: boolean) {
    const assembly = await this.assembly();
    const stacks = await assembly.selectStacks(selector, {
      extend: exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Downstream,
      defaultBehavior: DefaultSelection.OnlySingle,
    });

    // No validation

    return stacks;
  }

  /**
   * Validate the stacks for errors and warnings according to the CLI's current settings
   */
  private validateStacks(stacks: StackCollection) {
    stacks.processMetadataMessages({
      ignoreErrors: this.props.ignoreErrors,
      strict: this.props.strict,
      verbose: this.props.verbose,
    });
  }

  /**
   * Validate that if a user specified a stack name there exists at least 1 stack selected
   */
  private validateStacksSelected(stacks: StackCollection, stackNames: string[]) {
    if (stackNames.length != 0 && stacks.stackCount == 0) {
      throw new Error(`No stacks match the name(s) ${stackNames}`);
    }
  }

  /**
   * Select a single stack by its name
   */
  private async selectSingleStackByName(stackName: string) {
    const assembly = await this.assembly();

    const stacks = await assembly.selectStacks({ patterns: [stackName] }, {
      extend: ExtendedStackSelection.None,
      defaultBehavior: DefaultSelection.None,
    });

    // Could have been a glob so check that we evaluated to exactly one
    if (stacks.stackCount > 1) {
      throw new Error(`This command requires exactly one stack and we matched more than one: ${stacks.stackIds}`);
    }

    return assembly.stackById(stacks.firstStack.id);
  }

  private assembly(cacheCloudAssembly?: boolean): Promise<CloudAssembly> {
    return this.props.cloudExecutable.synthesize(cacheCloudAssembly);
  }

  private patternsArrayForWatch(patterns: string | string[] | undefined, options: { rootDir: string, returnRootDirIfEmpty: boolean }): string[] {
    const patternsArray: string[] = patterns !== undefined
      ? (Array.isArray(patterns) ? patterns : [patterns])
      : [];
    return patternsArray.length > 0
      ? patternsArray
      : (options.returnRootDirIfEmpty ? [options.rootDir] : []);
  }

  private async invokeDeployFromWatch(options: WatchOptions, cloudWatchLogMonitor?: CloudWatchLogEventMonitor): Promise<void> {
    const deployOptions: DeployOptions = {
      ...options,
      requireApproval: RequireApproval.Never,
      // if 'watch' is called by invoking 'cdk deploy --watch',
      // we need to make sure to not call 'deploy' with 'watch' again,
      // as that would lead to a cycle
      watch: false,
      cloudWatchLogMonitor,
      cacheCloudAssembly: false,
      hotswap: options.hotswap,
      extraUserAgent: `cdk-watch/hotswap-${options.hotswap !== HotswapMode.FALL_BACK ? 'on' : 'off'}`,
      concurrency: options.concurrency,
    };

    try {
      await this.deploy(deployOptions);
    } catch {
      // just continue - deploy will show the error
    }
  }

  private async buildAllAssetsForSingleStack(stack: cxapi.CloudFormationStackArtifact, options: Pick<DeployOptions, 'roleArn' | 'toolkitStackName' | 'assetParallelism'>): Promise<void> {
    // Check whether the stack has an asset manifest before trying to build and publish.
    if (!stack.dependencies.some(cxapi.AssetManifestArtifact.isAssetManifestArtifact)) {
      return;
    }

    print('%s: building assets...\n', chalk.bold(stack.displayName));
    await this.props.cloudFormation.buildStackAssets({
      stack,
      roleArn: options.roleArn,
      toolkitStackName: options.toolkitStackName,
      buildOptions: {
        parallel: options.assetParallelism,
      },
    });
    print('\n%s: assets built\n', chalk.bold(stack.displayName));
  }
}

export interface DiffOptions {
  /**
   * Stack names to diff
   */
  stackNames: string[];

  /**
   * Only select the given stack
   *
   * @default false
   */
  exclusively?: boolean;

  /**
   * Used a template from disk instead of from the server
   *
   * @default Use from the server
   */
  templatePath?: string;

  /**
   * Strict diff mode
   *
   * @default false
   */
  strict?: boolean;

  /**
   * How many lines of context to show in the diff
   *
   * @default 3
   */
  contextLines?: number;

  /**
   * Where to write the default
   *
   * @default stderr
   */
  stream?: NodeJS.WritableStream;

  /**
   * Whether to fail with exit code 1 in case of diff
   *
   * @default false
   */
  fail?: boolean;

  /**
   * Only run diff on broadened security changes
   *
   * @default false
   */
  securityOnly?: boolean;

  /**
   * Whether to run the diff against the template after the CloudFormation Transforms inside it have been executed
   * (as opposed to the original template, the default, which contains the unprocessed Transforms).
   *
   * @default false
   */
  compareAgainstProcessedTemplate?: boolean;
}

interface CfnDeployOptions {
  /**
   * Criteria for selecting stacks to deploy
   */
  selector: StackSelector;

  /**
   * Name of the toolkit stack to use/deploy
   *
   * @default CDKToolkit
   */
  toolkitStackName?: string;

  /**
   * Role to pass to CloudFormation for deployment
   */
  roleArn?: string;

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   *
   * @deprecated Use 'deploymentMethod' instead
   */
  changeSetName?: string;

  /**
   * Whether to execute the ChangeSet
   * Not providing `execute` parameter will result in execution of ChangeSet
   *
   * @default true
   * @deprecated Use 'deploymentMethod' instead
   */
  execute?: boolean;

  /**
   * Deployment method
   */
  readonly deploymentMethod?: DeploymentMethod;

  /**
   * Display mode for stack deployment progress.
   *
   * @default - StackActivityProgress.Bar - stack events will be displayed for
   *   the resource currently being deployed.
   */
  progress?: StackActivityProgress;

  /**
   * Rollback failed deployments
   *
   * @default true
   */
  readonly rollback?: boolean;
}

interface WatchOptions extends Omit<CfnDeployOptions, 'execute'> {
  /**
   * Only select the given stack
   *
   * @default false
   */
  exclusively?: boolean;

  /**
   * Reuse the assets with the given asset IDs
   */
  reuseAssets?: string[];

  /**
   * Always deploy, even if templates are identical.
   * @default false
   */
  force?: boolean;

  /**
   * Whether to perform a 'hotswap' deployment.
   * A 'hotswap' deployment will attempt to short-circuit CloudFormation
   * and update the affected resources like Lambda functions directly.
   *
   * @default - `HotswapMode.FALL_BACK` for regular deployments, `HotswapMode.HOTSWAP_ONLY` for 'watch' deployments
   */
  readonly hotswap: HotswapMode;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;

  /**
   * Whether to show CloudWatch logs for hotswapped resources
   * locally in the users terminal
   *
   * @default - false
   */
  readonly traceLogs?: boolean;

  /**
   * Maximum number of simultaneous deployments (dependency permitting) to execute.
   * The default is '1', which executes all deployments serially.
   *
   * @default 1
   */
  readonly concurrency?: number;
}

export interface DeployOptions extends CfnDeployOptions, WatchOptions {
  /**
   * ARNs of SNS topics that CloudFormation will notify with stack related events
   */
  notificationArns?: string[];

  /**
   * What kind of security changes require approval
   *
   * @default RequireApproval.Broadening
   */
  requireApproval?: RequireApproval;

  /**
   * Tags to pass to CloudFormation for deployment
   */
  tags?: Tag[];

  /**
   * Additional parameters for CloudFormation at deploy time
   * @default {}
   */
  parameters?: { [name: string]: string | undefined };

  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   *
   * @default true
   */
  usePreviousParameters?: boolean;

  /**
   * Path to file where stack outputs will be written after a successful deploy as JSON
   * @default - Outputs are not written to any file
   */
  outputsFile?: string;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;

  /**
   * Whether this 'deploy' command should actually delegate to the 'watch' command.
   *
   * @default false
   */
  readonly watch?: boolean;

  /**
   * Whether we should cache the Cloud Assembly after the first time it has been synthesized.
   * The default is 'true', we only don't want to do it in case the deployment is triggered by
   * 'cdk watch'.
   *
   * @default true
   */
  readonly cacheCloudAssembly?: boolean;

  /**
   * Allows adding CloudWatch log groups to the log monitor via
   * cloudWatchLogMonitor.setLogGroups();
   *
   * @default - not monitoring CloudWatch logs
   */
  readonly cloudWatchLogMonitor?: CloudWatchLogEventMonitor;

  /**
   * Maximum number of simultaneous deployments (dependency permitting) to execute.
   * The default is '1', which executes all deployments serially.
   *
   * @default 1
   */
  readonly concurrency?: number;

  /**
   * Build/publish assets for a single stack in parallel
   *
   * Independent of whether stacks are being done in parallel or no.
   *
   * @default true
   */
  readonly assetParallelism?: boolean;

  /**
   * When to build assets
   *
   * The default is the Docker-friendly default.
   *
   * @default AssetBuildTime.ALL_BEFORE_DEPLOY
   */
  readonly assetBuildTime?: AssetBuildTime;
}

export interface ImportOptions extends CfnDeployOptions {
  /**
   * Build a physical resource mapping and write it to the given file, without performing the actual import operation
   *
   * @default - No file
   */

  readonly recordResourceMapping?: string;

  /**
   * Path to a file with the physical resource mapping to CDK constructs in JSON format
   *
   * @default - No mapping file
   */
  readonly resourceMappingFile?: string;

  /**
   * Allow non-addition changes to the template
   *
   * @default false
   */
  readonly force?: boolean;
}

export interface DestroyOptions {
  /**
   * Criteria for selecting stacks to deploy
   */
  selector: StackSelector;

  /**
   * Whether to exclude stacks that depend on the stacks to be deleted
   */
  exclusively: boolean;

  /**
   * Whether to skip prompting for confirmation
   */
  force: boolean;

  /**
   * The arn of the IAM role to use
   */
  roleArn?: string;

  /**
   * Whether the destroy request came from a deploy.
   */
  fromDeploy?: boolean

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;
}

/**
 * @returns an array with the tags available in the stack metadata.
 */
function tagsForStack(stack: cxapi.CloudFormationStackArtifact): Tag[] {
  return Object.entries(stack.tags).map(([Key, Value]) => ({ Key, Value }));
}

export interface Tag {
  readonly Key: string;
  readonly Value: string;
}

/**
 * Formats time in milliseconds (which we get from 'Date.getTime()')
 * to a human-readable time; returns time in seconds rounded to 2
 * decimal places.
 */
function formatTime(num: number): number {
  return roundPercentage(millisecondsToSeconds(num));
}

/**
 * Rounds a decimal number to two decimal points.
 * The function is useful for fractions that need to be outputted as percentages.
 */
function roundPercentage(num: number): number {
  return Math.round(100 * num) / 100;
}

/**
 * Given a time in miliseconds, return an equivalent amount in seconds.
 */
function millisecondsToSeconds(num: number): number {
  return num / 1000;
}
