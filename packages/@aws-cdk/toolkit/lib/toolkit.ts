
import * as path from 'node:path';
import * as cxapi from '@aws-cdk/cx-api';
import { DEFAULT_TOOLKIT_STACK_NAME, SdkProvider, SuccessfulDeployStackResult } from 'aws-cdk/lib/api';
import { StackCollection } from 'aws-cdk/lib/api/cxapp/cloud-assembly';
import { Deployments } from 'aws-cdk/lib/api/deployments';
import { HotswapMode } from 'aws-cdk/lib/api/hotswap/common';
import { StackActivityProgress } from 'aws-cdk/lib/api/util/cloudformation/stack-activity-monitor';
import { ResourceMigrator } from 'aws-cdk/lib/migrator';
import { obscureTemplate, serializeStructure } from 'aws-cdk/lib/serialize';
import { tagsForStack } from 'aws-cdk/lib/tags';
import { CliIoHost } from 'aws-cdk/lib/toolkit/cli-io-host';
import { validateSnsTopicArn } from 'aws-cdk/lib/util/validate-notification-arn';
import { Concurrency } from 'aws-cdk/lib/util/work-graph';
import { WorkGraphBuilder } from 'aws-cdk/lib/util/work-graph-builder';
import { AssetBuildNode, AssetPublishNode, StackNode } from 'aws-cdk/lib/util/work-graph-types';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { AssetBuildTime, buildParameterMap, DeployOptions, removePublishedAssets, RequireApproval } from './actions/deploy';
import { DestroyOptions } from './actions/destroy';
import { DiffOptions } from './actions/diff';
import { ListOptions } from './actions/list';
import { RollbackOptions } from './actions/rollback';
import { SynthOptions } from './actions/synth';
import { WatchOptions } from './actions/watch';
import { SdkOptions } from './api/aws-auth';
import { CachedCloudAssemblySource, IdentityCloudAssemblySource, StackAssembly, ICloudAssemblySource } from './api/cloud-assembly';
import { StackSelectionStrategy } from './api/cloud-assembly/stack-selector';
import { ToolkitError } from './api/errors';
import { IIoHost, IoMessageCode, IoMessageLevel } from './api/io';
import { asSdkLogger, withAction, ActionAwareIoHost, Timer, confirm, data, error, highlight, info, success, warn } from './api/io/private';

/**
 * The current action being performed by the CLI. 'none' represents the absence of an action.
 */
export type ToolkitAction =
| 'bootstrap'
| 'synth'
| 'list'
| 'diff'
| 'deploy'
| 'rollback'
| 'watch'
| 'destroy';

export interface ToolkitOptions {
  /**
   * The IoHost implementation, handling the inline interactions between the Toolkit and an integration.
   */
  // ioHost: IIoHost;

  /**
   * Configuration options for the SDK.
   */
  sdkOptions?: SdkOptions;

  /**
   * Name of the toolkit stack to be used.
   *
   * @default "CDKToolkit"
   */
  toolkitStackName?: string;

  /**
   * Fail Cloud Assemblies
   *
   * @default "error"
   */
  assemblyFailureAt?: 'error' | 'warn' | 'none';
}

/**
 * The AWS CDK Programmatic Toolkit
 */
export class Toolkit {
  private readonly ioHost: IIoHost;
  private _sdkProvider?: SdkProvider;
  private toolkitStackName: string;

  public constructor(private readonly props: ToolkitOptions) {
    this.ioHost = CliIoHost.getIoHost();
    // this.ioHost = options.ioHost;
    // @todo open this up
    this.toolkitStackName = props.toolkitStackName ?? DEFAULT_TOOLKIT_STACK_NAME;
  }

  private async sdkProvider(action: ToolkitAction): Promise<SdkProvider> {
    // @todo this needs to be different per action
    if (!this._sdkProvider) {
      this._sdkProvider = await SdkProvider.withAwsCliCompatibleDefaults({
        ...this.props.sdkOptions,
        logger: asSdkLogger(this.ioHost, action),
      });
    }

    return this._sdkProvider;
  }

  /**
   * Synth Action
   */
  public async synth(cx: ICloudAssemblySource, options: SynthOptions): Promise<ICloudAssemblySource> {
    const ioHost = withAction(this.ioHost, 'synth');
    const assembly = await this.assemblyFromSource(cx);
    const stacks = assembly.selectStacksV2(options.stacks);
    const autoValidateStacks = options.validateStacks ? [assembly.selectStacksForValidation()] : [];
    await this.validateStacksMetadata(stacks.concat(...autoValidateStacks), ioHost);

    // if we have a single stack, print it to STDOUT
    if (stacks.stackCount === 1) {
      const template = stacks.firstStack?.template;
      const obscuredTemplate = obscureTemplate(template);
      await ioHost.notify(info('', 'CDK_TOOLKIT_I0001', {
        raw: template,
        json: serializeStructure(obscuredTemplate, true),
        yaml: serializeStructure(obscuredTemplate, false),
      },
      ));
    } else {
      // not outputting template to stdout, let's explain things to the user a little bit...
      await ioHost.notify(success(`Successfully synthesized to ${chalk.blue(path.resolve(stacks.assembly.directory))}`));
      await ioHost.notify(info(`Supply a stack id (${stacks.stackArtifacts.map((s) => chalk.green(s.hierarchicalId)).join(', ')}) to display its template.`));
    }

    return new IdentityCloudAssemblySource(assembly.assembly);
  }

  /**
   * List Action
   *
   * List out selected stacks
   */
  public async list(cx: ICloudAssemblySource, _options: ListOptions): Promise<void> {
    const ioHost = withAction(this.ioHost, 'list');
    const assembly = await this.assemblyFromSource(cx);
    throw new Error('Not implemented yet');
  }

  /**
   * Compares the specified stack with the deployed stack or a local template file and returns a structured diff.
   */
  public async diff(cx: ICloudAssemblySource, options: DiffOptions): Promise<boolean> {
    const ioHost = withAction(this.ioHost, 'diff');
    const assembly = await this.assemblyFromSource(cx);
    const stacks = await assembly.selectStacksV2(options.stacks);
    await this.validateStacksMetadata(stacks, ioHost);
    throw new Error('Not implemented yet');
  }

  /**
   * Deploys the selected stacks into an AWS account
   */
  public async deploy(cx: ICloudAssemblySource, options: DeployOptions): Promise<void> {
    const ioHost = withAction(this.ioHost, 'deploy');
    const timer = Timer.start();
    const assembly = await this.assemblyFromSource(cx);
    const stackCollection = assembly.selectStacksV2(options.stacks);
    await this.validateStacksMetadata(stackCollection, ioHost);

    const synthTime = timer.end();
    await ioHost.notify(info(`\n✨  Synthesis time: ${synthTime.asSec}s\n`, 'CDK_TOOLKIT_I5001', {
      time: synthTime.asMs,
    }));

    if (stackCollection.stackCount === 0) {
      await ioHost.notify(error('This app contains no stacks'));
      return;
    }

    const deployments = await this.deploymentsForAction('deploy');

    const migrator = new ResourceMigrator({
      deployments,
    });
    await migrator.tryMigrateResources(stackCollection, options);

    const requireApproval = options.requireApproval ?? RequireApproval.BROADENING;

    const parameterMap = buildParameterMap(options.parameters?.parameters);

    if (options.hotswap !== HotswapMode.FULL_DEPLOYMENT) {
      await ioHost.notify(warn(
        '⚠️ The --hotswap and --hotswap-fallback flags deliberately introduce CloudFormation drift to speed up deployments',
      ));
      await ioHost.notify(warn('⚠️ They should only be used for development - never use them for your production Stacks!\n'));
    }

    // @TODO
    // let hotswapPropertiesFromSettings = this.props.configuration.settings.get(['hotswap']) || {};

    // let hotswapPropertyOverrides = new HotswapPropertyOverrides();
    // hotswapPropertyOverrides.ecsHotswapProperties = new EcsHotswapProperties(
    //   hotswapPropertiesFromSettings.ecs?.minimumHealthyPercent,
    //   hotswapPropertiesFromSettings.ecs?.maximumHealthyPercent,
    // );

    const stacks = stackCollection.stackArtifacts;

    const stackOutputs: { [key: string]: any } = {};
    const outputsFile = options.outputsFile;

    const buildAsset = async (assetNode: AssetBuildNode) => {
      await deployments.buildSingleAsset(
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
      await deployments.publishSingleAsset(assetNode.assetManifest, assetNode.asset, {
        stack: assetNode.parentStack,
        roleArn: options.roleArn,
        stackName: assetNode.parentStack.stackName,
      });
    };

    const deployStack = async (stackNode: StackNode) => {
      const stack = stackNode.stack;
      if (stackCollection.stackCount !== 1) {
        await ioHost.notify(highlight(stack.displayName));
      }

      if (!stack.environment) {
        // eslint-disable-next-line max-len
        throw new ToolkitError(
          `Stack ${stack.displayName} does not define an environment, and AWS credentials could not be obtained from standard locations or no region was configured.`,
        );
      }

      if (Object.keys(stack.template.Resources || {}).length === 0) {
        // The generated stack has no resources
        if (!(await deployments.stackExists({ stack }))) {
          await ioHost.notify(warn(`${chalk.bold(stack.displayName)}: stack has no resources, skipping deployment.`));
        } else {
          await ioHost.notify(warn(`${chalk.bold(stack.displayName)}: stack has no resources, deleting existing stack.`));
          await this._destroy(assembly, 'deploy', {
            stacks: { patterns: [stack.hierarchicalId], strategy: StackSelectionStrategy.PATTERN_MUST_MATCH_SINGLE },
            roleArn: options.roleArn,
            ci: options.ci,
          });
        }
        return;
      }

      // @TODO
      // if (requireApproval !== RequireApproval.NEVER) {
      //   const currentTemplate = await deployments.readCurrentTemplate(stack);
      //   if (printSecurityDiff(currentTemplate, stack, requireApproval)) {
      //     await askUserConfirmation(
      //       concurrency,
      //       '"--require-approval" is enabled and stack includes security-sensitive updates',
      //       'Do you wish to deploy these changes',
      //     );
      //   }
      // }

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
      await ioHost.notify(
        info(`${chalk.bold(stack.displayName)}: deploying... [${stackIndex}/${stackCollection.stackCount}]`),
      );
      const startDeployTime = Timer.start();

      let tags = options.tags;
      if (!tags || tags.length === 0) {
        tags = tagsForStack(stack);
      }

      let elapsedDeployTime;
      try {
        let deployResult: SuccessfulDeployStackResult | undefined;

        let rollback = options.rollback;
        let iteration = 0;
        while (!deployResult) {
          if (++iteration > 2) {
            throw new ToolkitError('This loop should have stabilized in 2 iterations, but didn\'t. If you are seeing this error, please report it at https://github.com/aws/aws-cdk/issues/new/choose');
          }

          const r = await deployments.deployStack({
            stack,
            deployName: stack.stackName,
            roleArn: options.roleArn,
            toolkitStackName: options.toolkitStackName,
            reuseAssets: options.reuseAssets,
            notificationArns,
            tags,
            deploymentMethod: options.deploymentMethod,
            force: options.force,
            parameters: Object.assign({}, parameterMap['*'], parameterMap[stack.stackName]),
            usePreviousParameters: options.parameters?.keepExistingParameters,
            progress,
            ci: options.ci,
            rollback,
            hotswap: options.hotswap,
            // hotswapPropertyOverrides: hotswapPropertyOverrides,

            assetParallelism: options.assetParallelism,
          });

          switch (r.type) {
            case 'did-deploy-stack':
              deployResult = r;
              break;

            case 'failpaused-need-rollback-first': {
              const motivation = r.reason === 'replacement'
                ? `Stack is in a paused fail state (${r.status}) and change includes a replacement which cannot be deployed with "--no-rollback"`
                : `Stack is in a paused fail state (${r.status}) and command line arguments do not include "--no-rollback"`;
              const question = `${motivation}. Perform a regular deployment`;

              if (options.force) {
                await ioHost.notify(warn(`${motivation}. Rolling back first (--force).`));
              } else {
                // @todo reintroduce concurrency and corked logging in CliHost
                const confirmed = await ioHost.requestResponse(confirm('CDK_TOOLKIT_I5050', question, motivation, true, concurrency));
                if (!confirmed) { throw new ToolkitError('Aborted by user'); }
              }

              // Perform a rollback
              await this.rollback(cx, {
                stacks: { patterns: [stack.hierarchicalId], strategy: StackSelectionStrategy.PATTERN_MUST_MATCH_SINGLE },
                orphanFailedResources: options.force,
              });

              // Go around through the 'while' loop again but switch rollback to true.
              rollback = true;
              break;
            }

            case 'replacement-requires-rollback': {
              const motivation = 'Change includes a replacement which cannot be deployed with "--no-rollback"';
              const question = `${motivation}. Perform a regular deployment`;

              // @todo no force here
              if (options.force) {
                await ioHost.notify(warn(`${motivation}. Proceeding with regular deployment (--force).`));
              } else {
                // @todo reintroduce concurrency and corked logging in CliHost
                const confirmed = await ioHost.requestResponse(confirm('CDK_TOOLKIT_I5050', question, motivation, true, concurrency));
                if (!confirmed) { throw new ToolkitError('Aborted by user'); }
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
          ? ` ✅  ${stack.displayName} (no changes)`
          : ` ✅  ${stack.displayName}`;

        await ioHost.notify(success('\n' + message));
        elapsedDeployTime = startDeployTime.end();
        await ioHost.notify(info(`\n✨  Deployment time: ${elapsedDeployTime.asSec}s\n`));

        if (Object.keys(deployResult.outputs).length > 0) {
          await ioHost.notify(info('Outputs:'));

          stackOutputs[stack.stackName] = deployResult.outputs;
        }

        for (const name of Object.keys(deployResult.outputs).sort()) {
          const value = deployResult.outputs[name];
          await ioHost.notify(info(`${chalk.cyan(stack.id)}.${chalk.cyan(name)} = ${chalk.underline(chalk.cyan(value))}`));
        }

        await ioHost.notify(info('Stack ARN:'));

        await ioHost.notify(data(deployResult.stackArn));
      } catch (e: any) {
        // It has to be exactly this string because an integration test tests for
        // "bold(stackname) failed: ResourceNotReady: <error>"
        throw new ToolkitError(
          [`❌  ${chalk.bold(stack.stackName)} failed:`, ...(e.name ? [`${e.name}:`] : []), e.message].join(' '),
        );
      } finally {
        // @todo
        // if (options.cloudWatchLogMonitor) {
        //   const foundLogGroupsResult = await findCloudWatchLogGroups(await this.sdkProvider('deploy'), stack);
        //   options.cloudWatchLogMonitor.addLogGroups(
        //     foundLogGroupsResult.env,
        //     foundLogGroupsResult.sdk,
        //     foundLogGroupsResult.logGroupNames,
        //   );
        // }

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
      await ioHost.notify(info(`\n✨  Total time: ${synthTime.asSec + elapsedDeployTime.asSec}s\n`));
    };

    const assetBuildTime = options.assetBuildTime ?? AssetBuildTime.ALL_BEFORE_DEPLOY;
    const prebuildAssets = assetBuildTime === AssetBuildTime.ALL_BEFORE_DEPLOY;
    const concurrency = options.concurrency || 1;
    const progress = concurrency > 1 ? StackActivityProgress.EVENTS : options.progress;
    if (concurrency > 1 && options.progress && options.progress != StackActivityProgress.EVENTS) {
      await ioHost.notify(warn('⚠️ The --concurrency flag only supports --progress "events". Switching to "events".'));
    }

    const stacksAndTheirAssetManifests = stacks.flatMap((stack) => [
      stack,
      ...stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact),
    ]);
    const workGraph = new WorkGraphBuilder(prebuildAssets).build(stacksAndTheirAssetManifests);

    // Unless we are running with '--force', skip already published assets
    if (!options.force) {
      await removePublishedAssets(workGraph, deployments, options);
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
   * Watch Action
   *
   * Continuously observe project files and deploy the selected stacks automatically when changes are detected.
   * Implies hotswap deployments.
   */
  public async watch(_cx: ICloudAssemblySource, _options: WatchOptions): Promise<void> {
    const ioHost = withAction(this.ioHost, 'watch');
    throw new Error('Not implemented yet');
  }

  /**
   * Rollback Action
   *
   * Rolls back the selected stacks.
   */
  public async rollback(cx: ICloudAssemblySource, options: RollbackOptions): Promise<void> {
    const ioHost = withAction(this.ioHost, 'rollback');
    const timer = Timer.start();
    const assembly = await this.assemblyFromSource(cx);
    const stacks = await assembly.selectStacksV2(options.stacks);
    await this.validateStacksMetadata(stacks, ioHost);
    const synthTime = timer.end();
    await ioHost.notify(info(`\n✨  Synthesis time: ${synthTime.asSec}s\n`, 'CDK_TOOLKIT_I5001', {
      time: synthTime.asMs,
    }));

    throw new Error('Not implemented yet');
  }

  /**
   * Destroy Action
   *
   * Destroys the selected Stacks.
   */
  public async destroy(cx: ICloudAssemblySource, options: DestroyOptions): Promise<void> {
    const assembly = await this.assemblyFromSource(cx);
    return this._destroy(assembly, 'destroy', options);
  }

  /**
   * Helper to allow destroy being called as part of the deploy action.
   */
  private async _destroy(assembly: StackAssembly, action: 'deploy' | 'destroy', options: DestroyOptions): Promise<void> {
    const ioHost = withAction(this.ioHost, action);
    // The stacks will have been ordered for deployment, so reverse them for deletion.
    const stacks = await assembly.selectStacksV2(options.stacks).reversed();

    const motivation = 'Destroying stacks is an irreversible action';
    const question = `Are you sure you want to delete: ${chalk.red(stacks.hierarchicalIds.join(', '))}`;
    const confirmed = await ioHost.requestResponse(confirm('CDK_TOOLKIT_I7010', question, motivation, true));
    if (!confirmed) {
      return ioHost.notify(error('Aborted by user'));
    }

    for (const [index, stack] of stacks.stackArtifacts.entries()) {
      await ioHost.notify(success(`${chalk.blue(stack.displayName)}: destroying... [${index + 1}/${stacks.stackCount}]`));
      try {
        const deployments = await this.deploymentsForAction(action);
        await deployments.destroyStack({
          stack,
          deployName: stack.stackName,
          roleArn: options.roleArn,
          ci: options.ci,
        });
        await ioHost.notify(success(`\n ✅  ${chalk.blue(stack.displayName)}: ${action}ed`));
      } catch (e) {
        await ioHost.notify(error(`\n ❌  ${chalk.blue(stack.displayName)}: ${action} failed ${e}`));
        throw e;
      }
    }
  }

  /**
   * Validate the stacks for errors and warnings according to the CLI's current settings
   */
  private async validateStacksMetadata(stacks: StackCollection, ioHost: ActionAwareIoHost) {
    // @TODO define these somewhere central
    const code = (level: IoMessageLevel): IoMessageCode => {
      switch (level) {
        case 'error': return 'CDK_ASSEMBLY_E9999';
        case 'warn': return 'CDK_ASSEMBLY_W9999';
        default: return 'CDK_ASSEMBLY_I9999';
      }
    };
    await stacks.validateMetadata(this.props.assemblyFailureAt, async (level, msg) => ioHost.notify({
      time: new Date(),
      level,
      code: code(level),
      message: `[${level} at ${msg.id}] ${msg.entry.data}`,
      data: msg,
    }));
  }

  /**
   * Creates a Toolkit internal CloudAssembly from a CloudAssemblySource.
   * @param assemblySource the source for the cloud assembly
   * @param cache if the assembly should be cached, default: `true`
   * @returns the CloudAssembly object
   */
  private async assemblyFromSource(assemblySource: ICloudAssemblySource, cache: boolean = true): Promise<StackAssembly> {
    if (assemblySource instanceof StackAssembly) {
      return assemblySource;
    }

    if (cache) {
      return new StackAssembly(await new CachedCloudAssemblySource(assemblySource).produce());
    }

    return new StackAssembly(await assemblySource.produce());
  }

  /**
   * Create a deployments class
   */
  private async deploymentsForAction(action: ToolkitAction): Promise<Deployments> {
    return new Deployments({
      sdkProvider: await this.sdkProvider(action),
      toolkitStackName: this.toolkitStackName,
    });
  }
}
