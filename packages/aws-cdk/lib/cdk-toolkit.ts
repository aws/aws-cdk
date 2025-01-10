import * as path from 'path';
import { format } from 'util';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as promptly from 'promptly';
import * as uuid from 'uuid';
import { DeploymentMethod, SuccessfulDeployStackResult } from './api';
import { SdkProvider } from './api/aws-auth';
import { Bootstrapper, BootstrapEnvironmentOptions } from './api/bootstrap';
import {
  CloudAssembly,
  DefaultSelection,
  ExtendedStackSelection,
  StackCollection,
  StackSelector,
} from './api/cxapp/cloud-assembly';
import { CloudExecutable } from './api/cxapp/cloud-executable';
import { Deployments } from './api/deployments';
import { GarbageCollector } from './api/garbage-collection/garbage-collector';
import { HotswapMode, HotswapPropertyOverrides, EcsHotswapProperties } from './api/hotswap/common';
import { findCloudWatchLogGroups } from './api/logs/find-cloudwatch-logs';
import { CloudWatchLogEventMonitor } from './api/logs/logs-monitor';
import { createDiffChangeSet, ResourcesToImport } from './api/util/cloudformation';
import { StackActivityProgress } from './api/util/cloudformation/stack-activity-monitor';
import {
  generateCdkApp,
  generateStack,
  readFromPath,
  readFromStack,
  setEnvironment,
  parseSourceOptions,
  generateTemplate,
  FromScan,
  TemplateSourceOptions,
  GenerateTemplateOutput,
  CfnTemplateGeneratorProvider,
  writeMigrateJsonFile,
  buildGenertedTemplateOutput,
  appendWarningsToReadme,
  isThereAWarning,
  buildCfnClient,
} from './commands/migrate';
import { printSecurityDiff, printStackDiff, RequireApproval } from './diff';
import { ResourceImporter, removeNonImportResources } from './import';
import { listStacks } from './list-stacks';
import { data, debug, error, highlight, print, success, warning, withCorkedLogging } from './logging';
import { deserializeStructure, serializeStructure } from './serialize';
import { Configuration, PROJECT_CONFIG } from './settings';
import { ToolkitError } from './toolkit/error';
import { numberFromBool, partition } from './util';
import { validateSnsTopicArn } from './util/validate-notification-arn';
import { Concurrency, WorkGraph } from './util/work-graph';
import { WorkGraphBuilder } from './util/work-graph-builder';
import { AssetBuildNode, AssetPublishNode, StackNode } from './util/work-graph-types';
import { environmentsFromDescriptors, globEnvironmentsFromStacks, looksLikeGlob } from '../lib/api/cxapp/environments';

// Must use a require() otherwise esbuild complains about calling a namespace
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pLimit: typeof import('p-limit') = require('p-limit');

let TESTING = false;

export function markTesting() {
  TESTING = true;
}

export interface CdkToolkitProps {
  /**
   * The Cloud Executable
   */
  cloudExecutable: CloudExecutable;

  /**
   * The provisioning engine used to apply changes to the cloud
   */
  deployments: Deployments;

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
  constructor(private readonly props: CdkToolkitProps) {}

  public async metadata(stackName: string, json: boolean) {
    const stacks = await this.selectSingleStackByName(stackName);
    printSerializedObject(stacks.firstStack.manifest.metadata ?? {}, json);
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
    const quiet = options.quiet || false;

    let diffs = 0;
    const parameterMap = buildParameterMap(options.parameters);

    if (options.templatePath !== undefined) {
      // Compare single stack against fixed template
      if (stacks.stackCount !== 1) {
        throw new ToolkitError(
          'Can only select one stack when comparing to fixed template. Use --exclusively to avoid selecting multiple stacks.',
        );
      }

      if (!(await fs.pathExists(options.templatePath))) {
        throw new ToolkitError(`There is no file at ${options.templatePath}`);
      }

      const template = deserializeStructure(await fs.readFile(options.templatePath, { encoding: 'UTF-8' }));
      diffs = options.securityOnly
        ? numberFromBool(printSecurityDiff(template, stacks.firstStack, RequireApproval.Broadening, quiet))
        : printStackDiff(template, stacks.firstStack, strict, contextLines, quiet, undefined, undefined, false, stream);
    } else {
      // Compare N stacks against deployed templates
      for (const stack of stacks.stackArtifacts) {
        const templateWithNestedStacks = await this.props.deployments.readCurrentTemplateWithNestedStacks(
          stack,
          options.compareAgainstProcessedTemplate,
        );
        const currentTemplate = templateWithNestedStacks.deployedRootTemplate;
        const nestedStacks = templateWithNestedStacks.nestedStacks;

        const resourcesToImport = await this.tryGetResources(await this.props.deployments.resolveEnvironment(stack));
        if (resourcesToImport) {
          removeNonImportResources(stack);
        }

        let changeSet = undefined;

        if (options.changeSet) {
          let stackExists = false;
          try {
            stackExists = await this.props.deployments.stackExists({
              stack,
              deployName: stack.stackName,
              tryLookupRole: true,
            });
          } catch (e: any) {
            debug(e.message);
            if (!quiet) {
              stream.write(
                `Checking if the stack ${stack.stackName} exists before creating the changeset has failed, will base the diff on template differences (run again with -v to see the reason)\n`,
              );
            }
            stackExists = false;
          }

          if (stackExists) {
            changeSet = await createDiffChangeSet({
              stack,
              uuid: uuid.v4(),
              deployments: this.props.deployments,
              willExecute: false,
              sdkProvider: this.props.sdkProvider,
              parameters: Object.assign({}, parameterMap['*'], parameterMap[stack.stackName]),
              resourcesToImport,
              stream,
            });
          } else {
            debug(
              `the stack '${stack.stackName}' has not been deployed to CloudFormation or describeStacks call failed, skipping changeset creation.`,
            );
          }
        }

        const stackCount = options.securityOnly
          ? numberFromBool(
            printSecurityDiff(
              currentTemplate,
              stack,
              RequireApproval.Broadening,
              quiet,
              stack.displayName,
              changeSet,
            ),
          )
          : printStackDiff(
            currentTemplate,
            stack,
            strict,
            contextLines,
            quiet,
            stack.displayName,
            changeSet,
            !!resourcesToImport,
            stream,
            nestedStacks,
          );

        diffs += stackCount;
      }
    }

    stream.write(format('\n✨  Number of stacks with differences: %s\n', diffs));

    return diffs && options.fail ? 1 : 0;
  }

  public async deploy(options: DeployOptions) {
    if (options.watch) {
      return this.watch(options);
    }

    const startSynthTime = new Date().getTime();
    const stackCollection = await this.selectStacksForDeploy(
      options.selector,
      options.exclusively,
      options.cacheCloudAssembly,
      options.ignoreNoStacks,
    );
    const elapsedSynthTime = new Date().getTime() - startSynthTime;
    print('\n✨  Synthesis time: %ss\n', formatTime(elapsedSynthTime));

    if (stackCollection.stackCount === 0) {
      // eslint-disable-next-line no-console
      console.error('This app contains no stacks');
      return;
    }

    await this.tryMigrateResources(stackCollection, options);

    const requireApproval = options.requireApproval ?? RequireApproval.Broadening;

    const parameterMap = buildParameterMap(options.parameters);

    if (options.hotswap !== HotswapMode.FULL_DEPLOYMENT) {
      warning(
        '⚠️ The --hotswap and --hotswap-fallback flags deliberately introduce CloudFormation drift to speed up deployments',
      );
      warning('⚠️ They should only be used for development - never use them for your production Stacks!\n');
    }

    let hotswapPropertiesFromSettings = this.props.configuration.settings.get(['hotswap']) || {};

    let hotswapPropertyOverrides = new HotswapPropertyOverrides();
    hotswapPropertyOverrides.ecsHotswapProperties = new EcsHotswapProperties(
      hotswapPropertiesFromSettings.ecs?.minimumHealthyPercent,
      hotswapPropertiesFromSettings.ecs?.maximumHealthyPercent,
    );

    const stacks = stackCollection.stackArtifacts;

    const stackOutputs: { [key: string]: any } = {};
    const outputsFile = options.outputsFile;

    const buildAsset = async (assetNode: AssetBuildNode) => {
      await this.props.deployments.buildSingleAsset(
        assetNode.assetManifestArtifact,
        assetNode.assetManifest,
        assetNode.asset,
        {
          stack: assetNode.parentStack,
          roleArn: options.roleArn,
          stackName: assetNode.parentStack.stackName,
        },
      );
    };

    const publishAsset = async (assetNode: AssetPublishNode) => {
      await this.props.deployments.publishSingleAsset(assetNode.assetManifest, assetNode.asset, {
        stack: assetNode.parentStack,
        roleArn: options.roleArn,
        stackName: assetNode.parentStack.stackName,
      });
    };

    const deployStack = async (stackNode: StackNode) => {
      const stack = stackNode.stack;
      if (stackCollection.stackCount !== 1) {
        highlight(stack.displayName);
      }

      if (!stack.environment) {
        // eslint-disable-next-line max-len
        throw new ToolkitError(
          `Stack ${stack.displayName} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`,
        );
      }

      if (Object.keys(stack.template.Resources || {}).length === 0) {
        // The generated stack has no resources
        if (!(await this.props.deployments.stackExists({ stack }))) {
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
        const currentTemplate = await this.props.deployments.readCurrentTemplate(stack);
        if (printSecurityDiff(currentTemplate, stack, requireApproval)) {
          await askUserConfirmation(
            concurrency,
            '"--require-approval" is enabled and stack includes security-sensitive updates',
            'Do you wish to deploy these changes',
          );
        }
      }

      // Following are the same semantics we apply with respect to Notification ARNs (dictated by the SDK)
      //
      //  - undefined  =>  cdk ignores it, as if it wasn't supported (allows external management).
      //  - []:        =>  cdk manages it, and the user wants to wipe it out.
      //  - ['arn-1']  =>  cdk manages it, and the user wants to set it to ['arn-1'].
      const notificationArns = (!!options.notificationArns || !!stack.notificationArns)
        ? (options.notificationArns ?? []).concat(stack.notificationArns ?? [])
        : undefined;

      for (const notificationArn of notificationArns ?? []) {
        if (!validateSnsTopicArn(notificationArn)) {
          throw new ToolkitError(`Notification arn ${notificationArn} is not a valid arn for an SNS topic`);
        }
      }

      const stackIndex = stacks.indexOf(stack) + 1;
      print('%s: deploying... [%s/%s]', chalk.bold(stack.displayName), stackIndex, stackCollection.stackCount);
      const startDeployTime = new Date().getTime();

      let tags = options.tags;
      if (!tags || tags.length === 0) {
        tags = tagsForStack(stack);
      }

      let elapsedDeployTime = 0;
      try {
        let deployResult: SuccessfulDeployStackResult | undefined;

        let rollback = options.rollback;
        let iteration = 0;
        while (!deployResult) {
          if (++iteration > 2) {
            throw new ToolkitError('This loop should have stabilized in 2 iterations, but didn\'t. If you are seeing this error, please report it at https://github.com/aws/aws-cdk/issues/new/choose');
          }

          const r = await this.props.deployments.deployStack({
            stack,
            deployName: stack.stackName,
            roleArn: options.roleArn,
            toolkitStackName: options.toolkitStackName,
            reuseAssets: options.reuseAssets,
            notificationArns,
            tags,
            execute: options.execute,
            changeSetName: options.changeSetName,
            deploymentMethod: options.deploymentMethod,
            force: options.force,
            parameters: Object.assign({}, parameterMap['*'], parameterMap[stack.stackName]),
            usePreviousParameters: options.usePreviousParameters,
            progress,
            ci: options.ci,
            rollback,
            hotswap: options.hotswap,
            hotswapPropertyOverrides: hotswapPropertyOverrides,
            extraUserAgent: options.extraUserAgent,
            assetParallelism: options.assetParallelism,
            ignoreNoStacks: options.ignoreNoStacks,
          });

          switch (r.type) {
            case 'did-deploy-stack':
              deployResult = r;
              break;

            case 'failpaused-need-rollback-first': {
              const motivation = r.reason === 'replacement'
                ? `Stack is in a paused fail state (${r.status}) and change includes a replacement which cannot be deployed with "--no-rollback"`
                : `Stack is in a paused fail state (${r.status}) and command line arguments do not include "--no-rollback"`;

              if (options.force) {
                warning(`${motivation}. Rolling back first (--force).`);
              } else {
                await askUserConfirmation(
                  concurrency,
                  motivation,
                  `${motivation}. Roll back first and then proceed with deployment`,
                );
              }

              // Perform a rollback
              await this.rollback({
                selector: { patterns: [stack.hierarchicalId] },
                toolkitStackName: options.toolkitStackName,
                force: options.force,
              });

              // Go around through the 'while' loop again but switch rollback to true.
              rollback = true;
              break;
            }

            case 'replacement-requires-rollback': {
              const motivation = 'Change includes a replacement which cannot be deployed with "--no-rollback"';

              if (options.force) {
                warning(`${motivation}. Proceeding with regular deployment (--force).`);
              } else {
                await askUserConfirmation(
                  concurrency,
                  motivation,
                  `${motivation}. Perform a regular deployment`,
                );
              }

              // Go around through the 'while' loop again but switch rollback to false.
              rollback = true;
              break;
            }

            default:
              throw new ToolkitError(`Unexpected result type from deployStack: ${JSON.stringify(r)}. If you are seeing this error, please report it at https://github.com/aws/aws-cdk/issues/new/choose`);
          }
        }

        const message = deployResult.noOp
          ? ' ✅  %s (no changes)'
          : ' ✅  %s';

        success('\n' + message, stack.displayName);
        elapsedDeployTime = new Date().getTime() - startDeployTime;
        print('\n✨  Deployment time: %ss\n', formatTime(elapsedDeployTime));

        if (Object.keys(deployResult.outputs).length > 0) {
          print('Outputs:');

          stackOutputs[stack.stackName] = deployResult.outputs;
        }

        for (const name of Object.keys(deployResult.outputs).sort()) {
          const value = deployResult.outputs[name];
          print('%s.%s = %s', chalk.cyan(stack.id), chalk.cyan(name), chalk.underline(chalk.cyan(value)));
        }

        print('Stack ARN:');

        data(deployResult.stackArn);
      } catch (e: any) {
        // It has to be exactly this string because an integration test tests for
        // "bold(stackname) failed: ResourceNotReady: <error>"
        throw new ToolkitError(
          [`❌  ${chalk.bold(stack.stackName)} failed:`, ...(e.name ? [`${e.name}:`] : []), e.message].join(' '),
        );
      } finally {
        if (options.cloudWatchLogMonitor) {
          const foundLogGroupsResult = await findCloudWatchLogGroups(this.props.sdkProvider, stack);
          options.cloudWatchLogMonitor.addLogGroups(
            foundLogGroupsResult.env,
            foundLogGroupsResult.sdk,
            foundLogGroupsResult.logGroupNames,
          );
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

    const assetBuildTime = options.assetBuildTime ?? AssetBuildTime.ALL_BEFORE_DEPLOY;
    const prebuildAssets = assetBuildTime === AssetBuildTime.ALL_BEFORE_DEPLOY;
    const concurrency = options.concurrency || 1;
    const progress = concurrency > 1 ? StackActivityProgress.EVENTS : options.progress;
    if (concurrency > 1 && options.progress && options.progress != StackActivityProgress.EVENTS) {
      warning('⚠️ The --concurrency flag only supports --progress "events". Switching to "events".');
    }

    const stacksAndTheirAssetManifests = stacks.flatMap((stack) => [
      stack,
      ...stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact),
    ]);
    const workGraph = new WorkGraphBuilder(prebuildAssets).build(stacksAndTheirAssetManifests);

    // Unless we are running with '--force', skip already published assets
    if (!options.force) {
      await this.removePublishedAssets(workGraph, options);
    }

    const graphConcurrency: Concurrency = {
      'stack': concurrency,
      'asset-build': 1, // This will be CPU-bound/memory bound, mostly matters for Docker builds
      'asset-publish': (options.assetParallelism ?? true) ? 8 : 1, // This will be I/O-bound, 8 in parallel seems reasonable
    };

    await workGraph.doParallel(graphConcurrency, {
      deployStack,
      buildAsset,
      publishAsset,
    });
  }

  /**
   * Roll back the given stack or stacks.
   */
  public async rollback(options: RollbackOptions) {
    const startSynthTime = new Date().getTime();
    const stackCollection = await this.selectStacksForDeploy(options.selector, true);
    const elapsedSynthTime = new Date().getTime() - startSynthTime;
    print('\n✨  Synthesis time: %ss\n', formatTime(elapsedSynthTime));

    if (stackCollection.stackCount === 0) {
      // eslint-disable-next-line no-console
      console.error('No stacks selected');
      return;
    }

    let anyRollbackable = false;

    for (const stack of stackCollection.stackArtifacts) {
      print('Rolling back %s', chalk.bold(stack.displayName));
      const startRollbackTime = new Date().getTime();
      try {
        const result = await this.props.deployments.rollbackStack({
          stack,
          roleArn: options.roleArn,
          toolkitStackName: options.toolkitStackName,
          force: options.force,
          validateBootstrapStackVersion: options.validateBootstrapStackVersion,
          orphanLogicalIds: options.orphanLogicalIds,
        });
        if (!result.notInRollbackableState) {
          anyRollbackable = true;
        }
        const elapsedRollbackTime = new Date().getTime() - startRollbackTime;
        print('\n✨  Rollback time: %ss\n', formatTime(elapsedRollbackTime));
      } catch (e: any) {
        error('\n ❌  %s failed: %s', chalk.bold(stack.displayName), e.message);
        throw new ToolkitError('Rollback failed (use --force to orphan failing resources)');
      }
    }
    if (!anyRollbackable) {
      throw new ToolkitError('No stacks were in a state that could be rolled back');
    }
  }

  public async watch(options: WatchOptions) {
    const rootDir = path.dirname(path.resolve(PROJECT_CONFIG));
    debug("root directory used for 'watch' is: %s", rootDir);

    const watchSettings: { include?: string | string[]; exclude: string | string[] } | undefined =
      this.props.configuration.settings.get(['watch']);
    if (!watchSettings) {
      throw new ToolkitError(
        "Cannot use the 'watch' command without specifying at least one directory to monitor. " +
          'Make sure to add a "watch" key to your cdk.json',
      );
    }

    // For the "include" subkey under the "watch" key, the behavior is:
    // 1. No "watch" setting? We error out.
    // 2. "watch" setting without an "include" key? We default to observing "./**".
    // 3. "watch" setting with an empty "include" key? We default to observing "./**".
    // 4. Non-empty "include" key? Just use the "include" key.
    const watchIncludes = this.patternsArrayForWatch(watchSettings.include, {
      rootDir,
      returnRootDirIfEmpty: true,
    });
    debug("'include' patterns for 'watch': %s", watchIncludes);

    // For the "exclude" subkey under the "watch" key,
    // the behavior is to add some default excludes in addition to the ones specified by the user:
    // 1. The CDK output directory.
    // 2. Any file whose name starts with a dot.
    // 3. Any directory's content whose name starts with a dot.
    // 4. Any node_modules and its content (even if it's not a JS/TS project, you might be using a local aws-cli package)
    const outputDir = this.props.configuration.settings.get(['output']);
    const watchExcludes = this.patternsArrayForWatch(watchSettings.exclude, {
      rootDir,
      returnRootDirIfEmpty: false,
    }).concat(`${outputDir}/**`, '**/.*', '**/.*/**', '**/node_modules/**');
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

    chokidar
      .watch(watchIncludes, {
        ignored: watchExcludes,
        cwd: rootDir,
        // ignoreInitial: true,
      })
      .on('ready', async () => {
        latch = 'open';
        debug("'watch' received the 'ready' event. From now on, all file changes will trigger a deployment");
        print("Triggering initial 'cdk deploy'");
        await deployAndWatch();
      })
      .on('all', async (event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', filePath?: string) => {
        if (latch === 'pre-ready') {
          print(`'watch' is observing ${event === 'addDir' ? 'directory' : 'the file'} '%s' for changes`, filePath);
        } else if (latch === 'open') {
          print("Detected change to '%s' (type: %s). Triggering 'cdk deploy'", filePath, event);
          await deployAndWatch();
        } else {
          // this means latch is either 'deploying' or 'queued'
          latch = 'queued';
          print(
            "Detected change to '%s' (type: %s) while 'cdk deploy' is still running. " +
              'Will queue for another deployment after this one finishes',
            filePath,
            event,
          );
        }
      });
  }

  public async import(options: ImportOptions) {
    const stacks = await this.selectStacksForDeploy(options.selector, true, true, false);

    if (stacks.stackCount > 1) {
      throw new ToolkitError(
        `Stack selection is ambiguous, please choose a specific stack for import [${stacks.stackArtifacts.map((x) => x.id).join(', ')}]`,
      );
    }

    if (!process.stdout.isTTY && !options.resourceMappingFile) {
      throw new ToolkitError('--resource-mapping is required when input is not a terminal');
    }

    const stack = stacks.stackArtifacts[0];

    highlight(stack.displayName);

    const resourceImporter = new ResourceImporter(stack, this.props.deployments);
    const { additions, hasNonAdditions } = await resourceImporter.discoverImportableResources(options.force);
    if (additions.length === 0) {
      warning(
        '%s: no new resources compared to the currently deployed stack, skipping import.',
        chalk.bold(stack.displayName),
      );
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
    await resourceImporter.importResourcesFromMap(actualImport, {
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
      `Import operation complete. We recommend you run a ${chalk.blueBright('drift detection')} operation ` +
        'to confirm your CDK app resource definitions are up-to-date. Read more here: ' +
        chalk.underline.blueBright(
          'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html',
        ),
    );
    if (actualImport.importResources.length < additions.length) {
      print('');
      warning(
        `Some resources were skipped. Run another ${chalk.blueBright('cdk import')} or a ${chalk.blueBright('cdk deploy')} to bring the stack up-to-date with your CDK app definition.`,
      );
    } else if (hasNonAdditions) {
      print('');
      warning(
        `Your app has pending updates or deletes excluded from this import operation. Run a ${chalk.blueBright('cdk deploy')} to bring the stack up-to-date with your CDK app definition.`,
      );
    }
  }

  public async destroy(options: DestroyOptions) {
    let stacks = await this.selectStacksForDestroy(options.selector, options.exclusively);

    // The stacks will have been ordered for deployment, so reverse them for deletion.
    stacks = stacks.reversed();

    if (!options.force) {
      // eslint-disable-next-line max-len
      const confirmed = await promptly.confirm(
        `Are you sure you want to delete: ${chalk.blue(stacks.stackArtifacts.map((s) => s.hierarchicalId).join(', '))} (y/n)?`,
      );
      if (!confirmed) {
        return;
      }
    }

    const action = options.fromDeploy ? 'deploy' : 'destroy';
    for (const [index, stack] of stacks.stackArtifacts.entries()) {
      success('%s: destroying... [%s/%s]', chalk.blue(stack.displayName), index + 1, stacks.stackCount);
      try {
        await this.props.deployments.destroyStack({
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

  public async list(
    selectors: string[],
    options: { long?: boolean; json?: boolean; showDeps?: boolean } = {},
  ): Promise<number> {
    const stacks = await listStacks(this, {
      selectors: selectors,
    });

    if (options.long && options.showDeps) {
      printSerializedObject(stacks, options.json ?? false);
      return 0;
    }

    if (options.showDeps) {
      const stackDeps = [];

      for (const stack of stacks) {
        stackDeps.push({
          id: stack.id,
          dependencies: stack.dependencies,
        });
      }

      printSerializedObject(stackDeps, options.json ?? false);
      return 0;
    }

    if (options.long) {
      const long = [];

      for (const stack of stacks) {
        long.push({
          id: stack.id,
          name: stack.name,
          environment: stack.environment,
        });
      }
      printSerializedObject(long, options.json ?? false);
      return 0;
    }

    // just print stack IDs
    for (const stack of stacks) {
      data(stack.id);
    }

    return 0; // exit-code
  }

  /**
   * Synthesize the given set of stacks (called when the user runs 'cdk synth')
   *
   * INPUT: Stack names can be supplied using a glob filter. If no stacks are
   * given, all stacks from the application are implicitly selected.
   *
   * OUTPUT: If more than one stack ends up being selected, an output directory
   * should be supplied, where the templates will be written.
   */
  public async synth(
    stackNames: string[],
    exclusively: boolean,
    quiet: boolean,
    autoValidate?: boolean,
    json?: boolean,
  ): Promise<any> {
    const stacks = await this.selectStacksForDiff(stackNames, exclusively, autoValidate);

    // if we have a single stack, print it to STDOUT
    if (stacks.stackCount === 1) {
      if (!quiet) {
        printSerializedObject(obscureTemplate(stacks.firstStack.template), json ?? false);
      }
      return undefined;
    }

    // not outputting template to stdout, let's explain things to the user a little bit...
    success(`Successfully synthesized to ${chalk.blue(path.resolve(stacks.assembly.directory))}`);
    print(
      `Supply a stack id (${stacks.stackArtifacts.map((s) => chalk.green(s.hierarchicalId)).join(', ')}) to display its template.`,
    );

    return undefined;
  }

  /**
   * Bootstrap the CDK Toolkit stack in the accounts used by the specified stack(s).
   *
   * @param userEnvironmentSpecs environment names that need to have toolkit support
   *             provisioned, as a glob filter. If none is provided, all stacks are implicitly selected.
   * @param options The name, role ARN, bootstrapping parameters, etc. to be used for the CDK Toolkit stack.
   */
  public async bootstrap(
    userEnvironmentSpecs: string[],
    options: BootstrapEnvironmentOptions,
  ): Promise<void> {
    const bootstrapper = new Bootstrapper(options.source);
    // If there is an '--app' argument and an environment looks like a glob, we
    // select the environments from the app. Otherwise, use what the user said.

    const environments = await this.defineEnvironments(userEnvironmentSpecs);

    const limit = pLimit(20);

    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    await Promise.all(environments.map((environment) => limit(async () => {
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
    })));
  }

  /**
   * Garbage collects assets from a CDK app's environment
   * @param options Options for Garbage Collection
   */
  public async garbageCollect(userEnvironmentSpecs: string[], options: GarbageCollectionOptions) {
    const environments = await this.defineEnvironments(userEnvironmentSpecs);

    for (const environment of environments) {
      success(' ⏳  Garbage Collecting environment %s...', chalk.blue(environment.name));
      const gc = new GarbageCollector({
        sdkProvider: this.props.sdkProvider,
        resolvedEnvironment: environment,
        bootstrapStackName: options.bootstrapStackName,
        rollbackBufferDays: options.rollbackBufferDays,
        createdBufferDays: options.createdBufferDays,
        action: options.action ?? 'full',
        type: options.type ?? 'all',
        confirm: options.confirm ?? true,
      });
      await gc.garbageCollect();
    };
  }

  private async defineEnvironments(userEnvironmentSpecs: string[]): Promise<cxapi.Environment[]> {
    // By default, glob for everything
    const environmentSpecs = userEnvironmentSpecs.length > 0 ? [...userEnvironmentSpecs] : ['**'];

    // Partition into globs and non-globs (this will mutate environmentSpecs).
    const globSpecs = partition(environmentSpecs, looksLikeGlob);
    if (globSpecs.length > 0 && !this.props.cloudExecutable.hasApp) {
      if (userEnvironmentSpecs.length > 0) {
        // User did request this glob
        throw new ToolkitError(
          `'${globSpecs}' is not an environment name. Specify an environment name like 'aws://123456789012/us-east-1', or run in a directory with 'cdk.json' to use wildcards.`,
        );
      } else {
        // User did not request anything
        throw new ToolkitError(
          "Specify an environment name like 'aws://123456789012/us-east-1', or run in a directory with 'cdk.json'.",
        );
      }
    }

    const environments: cxapi.Environment[] = [...environmentsFromDescriptors(environmentSpecs)];

    // If there is an '--app' argument, select the environments from the app.
    if (this.props.cloudExecutable.hasApp) {
      environments.push(
        ...(await globEnvironmentsFromStacks(await this.selectStacksForList([]), globSpecs, this.props.sdkProvider)),
      );
    }

    return environments;
  }

  /**
   * Migrates a CloudFormation stack/template to a CDK app
   * @param options Options for CDK app creation
   */
  public async migrate(options: MigrateOptions): Promise<void> {
    warning('This command is an experimental feature.');
    const language = options.language?.toLowerCase() ?? 'typescript';
    const environment = setEnvironment(options.account, options.region);
    let generateTemplateOutput: GenerateTemplateOutput | undefined;
    let cfn: CfnTemplateGeneratorProvider | undefined;
    let templateToDelete: string | undefined;

    try {
      // if neither fromPath nor fromStack is provided, generate a template using cloudformation
      const scanType = parseSourceOptions(options.fromPath, options.fromStack, options.stackName).source;
      if (scanType == TemplateSourceOptions.SCAN) {
        generateTemplateOutput = await generateTemplate({
          stackName: options.stackName,
          filters: options.filter,
          fromScan: options.fromScan,
          sdkProvider: this.props.sdkProvider,
          environment: environment,
        });
        templateToDelete = generateTemplateOutput.templateId;
      } else if (scanType == TemplateSourceOptions.PATH) {
        const templateBody = readFromPath(options.fromPath!);

        const parsedTemplate = deserializeStructure(templateBody);
        const templateId = parsedTemplate.Metadata?.TemplateId?.toString();
        if (templateId) {
          // if we have a template id, we can call describe generated template to get the resource identifiers
          // resource metadata, and template source to generate the template
          cfn = new CfnTemplateGeneratorProvider(await buildCfnClient(this.props.sdkProvider, environment));
          const generatedTemplateSummary = await cfn.describeGeneratedTemplate(templateId);
          generateTemplateOutput = buildGenertedTemplateOutput(
            generatedTemplateSummary,
            templateBody,
            generatedTemplateSummary.GeneratedTemplateId!,
          );
        } else {
          generateTemplateOutput = {
            migrateJson: {
              templateBody: templateBody,
              source: 'localfile',
            },
          };
        }
      } else if (scanType == TemplateSourceOptions.STACK) {
        const template = await readFromStack(options.stackName, this.props.sdkProvider, environment);
        if (!template) {
          throw new ToolkitError(`No template found for stack-name: ${options.stackName}`);
        }
        generateTemplateOutput = {
          migrateJson: {
            templateBody: template,
            source: options.stackName,
          },
        };
      } else {
        // We shouldn't ever get here, but just in case.
        throw new ToolkitError(`Invalid source option provided: ${scanType}`);
      }
      const stack = generateStack(generateTemplateOutput.migrateJson.templateBody, options.stackName, language);
      success(' ⏳  Generating CDK app for %s...', chalk.blue(options.stackName));
      await generateCdkApp(options.stackName, stack!, language, options.outputPath, options.compress);
      if (generateTemplateOutput) {
        writeMigrateJsonFile(options.outputPath, options.stackName, generateTemplateOutput.migrateJson);
      }
      if (isThereAWarning(generateTemplateOutput)) {
        warning(
          ' ⚠️  Some resources could not be migrated completely. Please review the README.md file for more information.',
        );
        appendWarningsToReadme(
          `${path.join(options.outputPath ?? process.cwd(), options.stackName)}/README.md`,
          generateTemplateOutput.resources!,
        );
      }
    } catch (e) {
      error(' ❌  Migrate failed for `%s`: %s', options.stackName, (e as Error).message);
      throw e;
    } finally {
      if (templateToDelete) {
        if (!cfn) {
          cfn = new CfnTemplateGeneratorProvider(await buildCfnClient(this.props.sdkProvider, environment));
        }
        if (!process.env.MIGRATE_INTEG_TEST) {
          await cfn.deleteGeneratedTemplate(templateToDelete);
        }
      }
    }
  }

  private async selectStacksForList(patterns: string[]) {
    const assembly = await this.assembly();
    const stacks = await assembly.selectStacks({ patterns }, { defaultBehavior: DefaultSelection.AllStacks });

    // No validation

    return stacks;
  }

  private async selectStacksForDeploy(
    selector: StackSelector,
    exclusively?: boolean,
    cacheCloudAssembly?: boolean,
    ignoreNoStacks?: boolean,
  ): Promise<StackCollection> {
    const assembly = await this.assembly(cacheCloudAssembly);
    const stacks = await assembly.selectStacks(selector, {
      extend: exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
      defaultBehavior: DefaultSelection.OnlySingle,
      ignoreNoStacks,
    });

    this.validateStacksSelected(stacks, selector.patterns);
    this.validateStacks(stacks);

    return stacks;
  }

  private async selectStacksForDiff(
    stackNames: string[],
    exclusively?: boolean,
    autoValidate?: boolean,
  ): Promise<StackCollection> {
    const assembly = await this.assembly();

    const selectedForDiff = await assembly.selectStacks(
      { patterns: stackNames },
      {
        extend: exclusively ? ExtendedStackSelection.None : ExtendedStackSelection.Upstream,
        defaultBehavior: DefaultSelection.MainAssembly,
      },
    );

    const allStacks = await this.selectStacksForList([]);
    const autoValidateStacks = autoValidate
      ? allStacks.filter((art) => art.validateOnSynth ?? false)
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
      throw new ToolkitError(`No stacks match the name(s) ${stackNames}`);
    }
  }

  /**
   * Select a single stack by its name
   */
  private async selectSingleStackByName(stackName: string) {
    const assembly = await this.assembly();

    const stacks = await assembly.selectStacks(
      { patterns: [stackName] },
      {
        extend: ExtendedStackSelection.None,
        defaultBehavior: DefaultSelection.None,
      },
    );

    // Could have been a glob so check that we evaluated to exactly one
    if (stacks.stackCount > 1) {
      throw new ToolkitError(`This command requires exactly one stack and we matched more than one: ${stacks.stackIds}`);
    }

    return assembly.stackById(stacks.firstStack.id);
  }

  public assembly(cacheCloudAssembly?: boolean): Promise<CloudAssembly> {
    return this.props.cloudExecutable.synthesize(cacheCloudAssembly);
  }

  private patternsArrayForWatch(
    patterns: string | string[] | undefined,
    options: { rootDir: string; returnRootDirIfEmpty: boolean },
  ): string[] {
    const patternsArray: string[] = patterns !== undefined ? (Array.isArray(patterns) ? patterns : [patterns]) : [];
    return patternsArray.length > 0 ? patternsArray : options.returnRootDirIfEmpty ? [options.rootDir] : [];
  }

  private async invokeDeployFromWatch(
    options: WatchOptions,
    cloudWatchLogMonitor?: CloudWatchLogEventMonitor,
  ): Promise<void> {
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

  /**
   * Remove the asset publishing and building from the work graph for assets that are already in place
   */
  private async removePublishedAssets(graph: WorkGraph, options: DeployOptions) {
    await graph.removeUnnecessaryAssets(assetNode => this.props.deployments.isSingleAssetPublished(assetNode.assetManifest, assetNode.asset, {
      stack: assetNode.parentStack,
      roleArn: options.roleArn,
      stackName: assetNode.parentStack.stackName,
    }));
  }

  /**
   * Checks to see if a migrate.json file exists. If it does and the source is either `filepath` or
   * is in the same environment as the stack deployment, a new stack is created and the resources are
   * migrated to the stack using an IMPORT changeset. The normal deployment will resume after this is complete
   * to add back in any outputs and the CDKMetadata.
   */
  private async tryMigrateResources(stacks: StackCollection, options: DeployOptions): Promise<void> {
    const stack = stacks.stackArtifacts[0];
    const migrateDeployment = new ResourceImporter(stack, this.props.deployments);
    const resourcesToImport = await this.tryGetResources(await migrateDeployment.resolveEnvironment());

    if (resourcesToImport) {
      print('%s: creating stack for resource migration...', chalk.bold(stack.displayName));
      print('%s: importing resources into stack...', chalk.bold(stack.displayName));

      await this.performResourceMigration(migrateDeployment, resourcesToImport, options);

      fs.rmSync('migrate.json');
      print('%s: applying CDKMetadata and Outputs to stack (if applicable)...', chalk.bold(stack.displayName));
    }
  }

  /**
   * Creates a new stack with just the resources to be migrated
   */
  private async performResourceMigration(
    migrateDeployment: ResourceImporter,
    resourcesToImport: ResourcesToImport,
    options: DeployOptions,
  ) {
    const startDeployTime = new Date().getTime();
    let elapsedDeployTime = 0;

    // Initial Deployment
    await migrateDeployment.importResourcesFromMigrate(resourcesToImport, {
      roleArn: options.roleArn,
      toolkitStackName: options.toolkitStackName,
      deploymentMethod: options.deploymentMethod,
      usePreviousParameters: true,
      progress: options.progress,
      rollback: options.rollback,
    });

    elapsedDeployTime = new Date().getTime() - startDeployTime;
    print('\n✨  Resource migration time: %ss\n', formatTime(elapsedDeployTime));
  }

  private async tryGetResources(environment: cxapi.Environment): Promise<ResourcesToImport | undefined> {
    try {
      const migrateFile = fs.readJsonSync('migrate.json', {
        encoding: 'utf-8',
      });
      const sourceEnv = (migrateFile.Source as string).split(':');
      if (
        sourceEnv[0] === 'localfile' ||
        (sourceEnv[4] === environment.account && sourceEnv[3] === environment.region)
      ) {
        return migrateFile.Resources;
      }
    } catch (e) {
      // Nothing to do
    }

    return undefined;
  }
}

/**
 * Print a serialized object (YAML or JSON) to stdout.
 */
function printSerializedObject(obj: any, json: boolean) {
  data(serializeStructure(obj, json));
}

export interface DiffOptions {
  /**
   * Stack names to diff
   */
  stackNames: string[];

  /**
   * Name of the toolkit stack, if not the default name
   *
   * @default 'CDKToolkit'
   */
  readonly toolkitStackName?: string;

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

  /*
   * Run diff in quiet mode without printing the diff statuses
   *
   * @default false
   */
  quiet?: boolean;

  /**
   * Additional parameters for CloudFormation at diff time, used to create a change set
   * @default {}
   */
  parameters?: { [name: string]: string | undefined };

  /**
   * Whether or not to create, analyze, and subsequently delete a changeset
   *
   * @default true
   */
  changeSet?: boolean;
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

  /**
   * Whether to deploy if the app contains no stacks.
   *
   * @default false
   */
  readonly ignoreNoStacks?: boolean;
}

export interface RollbackOptions {
  /**
   * Criteria for selecting stacks to deploy
   */
  readonly selector: StackSelector;

  /**
   * Name of the toolkit stack to use/deploy
   *
   * @default CDKToolkit
   */
  readonly toolkitStackName?: string;

  /**
   * Role to pass to CloudFormation for deployment
   *
   * @default - Default stack role
   */
  readonly roleArn?: string;

  /**
   * Whether to force the rollback or not
   *
   * @default false
   */
  readonly force?: boolean;

  /**
   * Logical IDs of resources to orphan
   *
   * @default - No orphaning
   */
  readonly orphanLogicalIds?: string[];

  /**
   * Whether to validate the version of the bootstrap stack permissions
   *
   * @default true
   */
  readonly validateBootstrapStackVersion?: boolean;
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
  fromDeploy?: boolean;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;
}

/**
 * Options for the garbage collection
 */
export interface GarbageCollectionOptions {
  /**
   * The action to perform.
   *
   * @default 'full'
   */
  readonly action: 'print' | 'tag' | 'delete-tagged' | 'full';

  /**
   * The type of the assets to be garbage collected.
   *
   * @default 'all'
   */
  readonly type: 's3' | 'ecr' | 'all';

  /**
   * Elapsed time between an asset being marked as isolated and actually deleted.
   *
   * @default 0
   */
  readonly rollbackBufferDays: number;

  /**
   * Refuse deletion of any assets younger than this number of days.
   */
  readonly createdBufferDays: number;

  /**
   * The stack name of the bootstrap stack.
   *
   * @default DEFAULT_TOOLKIT_STACK_NAME
   */
  readonly bootstrapStackName?: string;

  /**
   * Skips the prompt before actual deletion begins
   *
   * @default false
   */
  readonly confirm?: boolean;
}

export interface MigrateOptions {
  /**
   * The name assigned to the generated stack. This is also used to get
   * the stack from the user's account if `--from-stack` is used.
   */
  readonly stackName: string;

  /**
   * The target language for the generated the CDK app.
   *
   * @default typescript
   */
  readonly language?: string;

  /**
   * The local path of the template used to generate the CDK app.
   *
   * @default - Local path is not used for the template source.
   */
  readonly fromPath?: string;

  /**
   * Whether to get the template from an existing CloudFormation stack.
   *
   * @default false
   */
  readonly fromStack?: boolean;

  /**
   * The output path at which to create the CDK app.
   *
   * @default - The current directory
   */
  readonly outputPath?: string;

  /**
   * The account from which to retrieve the template of the CloudFormation stack.
   *
   * @default - Uses the account for the credentials in use by the user.
   */
  readonly account?: string;

  /**
   * The region from which to retrieve the template of the CloudFormation stack.
   *
   * @default - Uses the default region for the credentials in use by the user.
   */
  readonly region?: string;

  /**
   * Filtering criteria used to select the resources to be included in the generated CDK app.
   *
   * @default - Include all resources
   */
  readonly filter?: string[];

  /**
   * Whether to initiate a new account scan for generating the CDK app.
   *
   * @default false
   */
  readonly fromScan?: FromScan;

  /**
   * Whether to zip the generated cdk app folder.
   *
   * @default false
   */
  readonly compress?: boolean;
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
 * Given a time in milliseconds, return an equivalent amount in seconds.
 */
function millisecondsToSeconds(num: number): number {
  return num / 1000;
}

function buildParameterMap(
  parameters:
  | {
    [name: string]: string | undefined;
  }
  | undefined,
): { [name: string]: { [name: string]: string | undefined } } {
  const parameterMap: {
    [name: string]: { [name: string]: string | undefined };
  } = { '*': {} };
  for (const key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      const [stack, parameter] = key.split(':', 2);
      if (!parameter) {
        parameterMap['*'][stack] = parameters[key];
      } else {
        if (!parameterMap[stack]) {
          parameterMap[stack] = {};
        }
        parameterMap[stack][parameter] = parameters[key];
      }
    }
  }

  return parameterMap;
}

/**
 * Remove any template elements that we don't want to show users.
 */
function obscureTemplate(template: any = {}) {
  if (template.Rules) {
    // see https://github.com/aws/aws-cdk/issues/17942
    if (template.Rules.CheckBootstrapVersion) {
      if (Object.keys(template.Rules).length > 1) {
        delete template.Rules.CheckBootstrapVersion;
      } else {
        delete template.Rules;
      }
    }
  }

  return template;
}

/**
 * Ask the user for a yes/no confirmation
 *
 * Automatically fail the confirmation in case we're in a situation where the confirmation
 * cannot be interactively obtained from a human at the keyboard.
 */
async function askUserConfirmation(
  concurrency: number,
  motivation: string,
  question: string,
) {
  await withCorkedLogging(async () => {
    // only talk to user if STDIN is a terminal (otherwise, fail)
    if (!TESTING && !process.stdin.isTTY) {
      throw new ToolkitError(`${motivation}, but terminal (TTY) is not attached so we are unable to get a confirmation from the user`);
    }

    // only talk to user if concurrency is 1 (otherwise, fail)
    if (concurrency > 1) {
      throw new ToolkitError(`${motivation}, but concurrency is greater than 1 so we are unable to get a confirmation from the user`);
    }

    const confirmed = await promptly.confirm(`${chalk.cyan(question)} (y/n)?`);
    if (!confirmed) { throw new ToolkitError('Aborted by user'); }
  });
}
