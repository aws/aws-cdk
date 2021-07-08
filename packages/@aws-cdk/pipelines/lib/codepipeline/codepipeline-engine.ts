import * as path from 'path';
import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, Fn, IDependable, Lazy, PhysicalName, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';
import { AssetType, BlueprintQueries, ManualApprovalStep, ScriptStep, StackAsset, StackDeployment, Step } from '../blueprint';
import { GraphNode, GraphNodeCollection, isGraph, AGraphNode, PipelineGraph } from '../helpers-internal';
import { BuildDeploymentOptions, IDeploymentEngine } from '../main/engine';
import { appOf, assemblyBuilderOf, embeddedAsmPath } from '../private/construct-internals';
import { toPosixPath } from '../private/fs';
import { enumerate, flatten, maybeSuffix } from '../private/javascript';
import { writeTemplateConfiguration } from '../private/template-configuration';
import { CodeBuildFactory, mergeCodeBuildOptions, stackVariableNamespace } from './_codebuild-factory';
import { ArtifactMap } from './artifact-map';
import { CodeBuildStep } from './codebuild-step';
import { CodePipelineActionFactoryResult, ICodePipelineActionFactory } from './codepipeline-action-factory';

// eslint-disable-next-line no-duplicate-imports,import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

export interface CodePipelineEngineProps {
  // Legacy and tweaking props
  readonly pipelineName?: string;
  readonly crossAccountKeys?: boolean;
  readonly cdkCliVersion?: string;
  readonly selfMutation?: boolean;

  /**
   * Set if the pipeline uses assets
   *
   * Configures privileged mode for the 'synth' CodeBuild action.
   *
   * @default false
   */
  readonly pipelineUsesAssets?: boolean;

  readonly vpc?: ec2.IVpc;
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Customize the CodeBuild projects created for this pipeline
   *
   * @default - All projects run non-privileged build, SMALL instance, LinuxBuildImage.STANDARD_5_0
   */
  readonly codeBuild?: CodeBuildOptions;

  /**
   * Whether this pipeline creates one asset upload action per asset type or one asset upload per asset
   *
   * @default false
   */
  readonly singlePublisherPerAssetType?: boolean;
}

/**
 * Options for customizing CodeBuild projects created by this engine
 */
export interface CodeBuildOptions {
  /**
   * Settings to apply to all CodeBuild projects
   *
   * @default - Default settings
   */
  readonly defaults?: CodeBuildProjectOptions;

  /**
   * Settings to apply to the Synth project
   *
   * @default - Default settings
   */
  readonly synth?: CodeBuildProjectOptions;

  /**
   * Settings to apply to the asset publishing projects
   *
   * @default - Default settings
   */
  readonly assetPublishing?: CodeBuildProjectOptions;

  /**
   * Settings to apply to the selfmutation project
   *
   * @default - Default settings
   */
  readonly selfMutation?: CodeBuildProjectOptions;
}

/**
 * Options for customizing a single CodeBuild project
 */
export interface CodeBuildProjectOptions {
  /**
   * Partial build environment, will be combined with other build environments that apply
   *
   * @default - Non-privileged build, SMALL instance, LinuxBuildImage.STANDARD_5_0
   */
  readonly buildEnvironment?: cb.BuildEnvironment;

  /**
   * Policy statements to add to role
   *
   * @default - No policy statements added to CodeBuild Project Role
   */
  readonly rolePolicyStatements?: iam.PolicyStatement[];

  /**
   * Partial buildspec, will be combined with other buildspecs that apply
   *
   * The BuildSpec must be available inline--it cannot reference a file
   * on disk.
   *
   * @default - No initial BuildSpec
   */
  readonly partialBuildSpec?: cb.BuildSpec;

  /**
   * Which security group(s) to associate with the project network interfaces.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - Security group will be automatically created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

export class CodePipelineEngine implements IDeploymentEngine {
  private _pipeline?: cp.Pipeline;
  private artifacts = new ArtifactMap();
  private _buildProject?: cb.IProject;
  private readonly selfMutation: boolean;
  private _myCxAsmRoot?: string;
  private _scope?: Construct;

  /**
   * Asset roles shared for publishing
   */
  private readonly assetCodeBuildRoles: Record<string, iam.IRole> = {};

  /**
   * Policies created for the build projects that they have to depend on
   */
  private readonly assetAttachedPolicies: Record<string, iam.Policy> = {};

  /**
   * Per asset type, the target role ARNs that need to be assumed
   */
  private readonly assetPublishingRoles: Record<string, Set<string>> = {};

  /**
   * This is set to the very first artifact produced in the pipeline
   */
  private _fallbackArtifact?: cp.Artifact;

  constructor(private readonly props: CodePipelineEngineProps={}) {
    this.selfMutation = this.props.selfMutation ?? true;
  }

  public buildDeployment(options: BuildDeploymentOptions): void {
    if (this._pipeline) {
      throw new Error('Pipeline already created');
    }

    this._scope = options.scope;
    this._myCxAsmRoot = path.resolve(assemblyBuilderOf(appOf(this.scope)).outdir);

    this._pipeline = new cp.Pipeline(this._scope, 'Pipeline', {
      pipelineName: this.props.pipelineName,
      crossAccountKeys: this.props.crossAccountKeys ?? false,
      restartExecutionOnUpdate: true,
    });

    const graphFromBp = new PipelineGraph(options.blueprint, {
      selfMutation: this.selfMutation,
      singlePublisherPerAssetType: this.props.singlePublisherPerAssetType,
    });

    this.pipelineStagesAndActionsFromGraph(graphFromBp);
  }

  public get buildProject(): cb.IProject {
    if (!this._buildProject) {
      throw new Error('Call pipeline.build() before reading this property');
    }
    return this._buildProject;
  }

  public get pipeline(): cp.Pipeline {
    if (!this._pipeline) {
      throw new Error('Pipeline not created yet');
    }
    return this._pipeline;
  }

  private get myCxAsmRoot(): string {
    if (!this._myCxAsmRoot) {
      throw new Error('Can\'t read \'myCxAsmRoot\' if build deployment not called yet');
    }
    return this._myCxAsmRoot;
  }

  private get scope(): Construct {
    if (!this._scope) {
      throw new Error('Can\'t read \'scope\' if build deployment not called yet');
    }
    return this._scope;
  }

  /**
   * Scope for Assets-related resources.
   *
   * Purely exists for construct tree backwards compatibility with legacy pipelines
   */
  private get assetsScope(): Construct {
    return makeScope(this.scope, 'Assets');
  }

  private pipelineStagesAndActionsFromGraph(structure: PipelineGraph) {
    // Translate graph into Pipeline Stages and Actions
    let beforeSelfMutation = this.selfMutation;
    for (const stageNode of flatten(structure.graph.sortedChildren())) {
      if (!isGraph(stageNode)) {
        throw new Error(`Top-level children must be graphs, got '${stageNode}'`);
      }

      // Group our ordered tranches into blocks of 50.
      // We can map these onto stages without exceeding the capacity of a Stage.
      const chunks = chunkTranches(50, stageNode.sortedLeaves());
      const actionsOverflowStage = chunks.length > 1;
      for (const [i, tranches] of enumerate(chunks)) {
        const pipelineStage = this.pipeline.addStage({
          stageName: actionsOverflowStage ? `${stageNode.id}.${i + 1}` : stageNode.id,
        });

        const sharedParent = new GraphNodeCollection(flatten(tranches)).commonAncestor();

        for (const [runOrder, tranche] of enumerate(tranches)) {
          for (const node of tranche) {
            if (node.data?.type === 'self-update') {
              beforeSelfMutation = false;
            }

            pipelineStage.addAction(this.actionFromNode({
              graphFromBp: structure,
              runOrder: runOrder + 1,
              node,
              sharedParent,
              beforeSelfUpdate: beforeSelfMutation,
              queries: structure.queries,
            }));
          }
        }
      }
    }
  }

  /**
   * Make an action from the given node and/or step
   */
  private actionFromNode(options: MakeActionOptions): cp.IAction {
    switch (options.node.data?.type) {
      // Nothing for these, they are groupings (shouldn't even have popped up here)
      case 'group':
      case 'stack-group':
      case undefined:
        throw new Error(`makeAction: did not expect to get group nodes: ${options.node.data?.type}`);

      case 'self-update':
        return this.selfMutateAction(options);

      case 'publish-assets':
        return this.publishAssetsAction(options.node.data.assets, options);

      case 'prepare':
        return this.createChangeSetAction(options.node.data.stack, options);

      case 'execute':
        return this.executeChangeSetAction(options.node.data.stack, options.node.data.captureOutputs, options);

      case 'step':
        const result = this.actionFromStep(options.node.data.step, options);

        if (options.graphFromBp.isSynthNode(options.node) && result.project) {
          this._buildProject = result.project;
        }

        if (options.node.data.step.primaryOutput?.primaryOutput && !this._fallbackArtifact) {
          this._fallbackArtifact = this.artifacts.toCodePipeline(options.node.data.step.primaryOutput?.primaryOutput);
        }

        return result.action;
    }
  }

  /**
   * Take a Step and turn it into a CodePipeline Action
   *
   * There are only 3 types of Steps we need to support:
   *
   * - RunScript (generic)
   * - ManualApproval (generic)
   * - CodePipelineActionFactory (CodePipeline-specific)
   *
   * The rest is expressed in terms of these 3, or in terms of graph nodes
   * which are handled elsewhere.
   */
  private actionFromStep(step: Step, options: MakeActionOptions): CodePipelineActionFactoryResult {
    // CodePipeline-specific steps first -- this includes Sources
    if (isCodePipelineActionFactory(step)) {
      return step.produce({
        scope: this.scope,
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        artifacts: this.artifacts,
        fallbackArtifact: this._fallbackArtifact,
        queries: options.queries,
        codeBuildProjectOptions: this.codeBuildOptionsFor(this.nodeTypeFromNode(options.node)),
      });
    }

    // Now built-in steps
    if (step instanceof ScriptStep) {
      return new CodeBuildFactory(step.id, step, {
        vpc: this.props.vpc,
        subnetSelection: this.props.subnetSelection,

        // If this CodeBuild job is before the self-update stage, we need to include a hash of
        // its definition in the pipeline (to force the pipeline to restart if the definition changes)
        includeBuildHashInPipeline: options.beforeSelfUpdate,
      }).produce({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        artifacts: this.artifacts,
        scope: this.scope,
        fallbackArtifact: this._fallbackArtifact,
        queries: options.queries,
        codeBuildProjectOptions: this.codeBuildOptionsFor(this.nodeTypeFromNode(options.node)),
      });
    }

    if (step instanceof ManualApprovalStep) {
      return {
        action: new cpa.ManualApprovalAction({
          actionName: actionName(options.node, options.sharedParent),
          runOrder: options.runOrder,
          additionalInformation: step.comment,
        }),
      };
    }

    throw new Error(`Deployment step '${step}' is not supported for CodePipeline-backed pipelines`);
  }

  private createChangeSetAction(stack: StackDeployment, options: MakeActionOptions) {
    const changeSetName = 'PipelineChange';

    const templateArtifact = this.artifacts.toCodePipeline(stack.customCloudAssembly ?? options.graphFromBp.cloudAssemblyFileSet);
    const templateConfigurationPath = this.writeTemplateConfiguration(stack);

    const region = stack.region !== Stack.of(this.scope).region ? stack.region : undefined;
    const account = stack.account !== Stack.of(this.scope).account ? stack.account : undefined;

    return new cpa.CloudFormationCreateReplaceChangeSetAction({
      actionName: actionName(options.node, options.sharedParent),
      runOrder: options.runOrder,
      changeSetName,
      stackName: stack.stackName,
      templatePath: templateArtifact.atPath(toPosixPath(stack.relativeTemplatePath(this.myCxAsmRoot))),
      adminPermissions: true,
      role: this.roleFromPlaceholderArn(this.pipeline, region, account, stack.assumeRoleArn),
      deploymentRole: this.roleFromPlaceholderArn(this.pipeline, region, account, stack.executionRoleArn),
      region: region,
      templateConfiguration: templateConfigurationPath
        ? templateArtifact.atPath(toPosixPath(templateConfigurationPath))
        : undefined,
    });
  }

  private executeChangeSetAction(stack: StackDeployment, captureOutputs: boolean, options: MakeActionOptions) {
    const changeSetName = 'PipelineChange';

    const region = stack.region !== Stack.of(this.scope).region ? stack.region : undefined;
    const account = stack.account !== Stack.of(this.scope).account ? stack.account : undefined;

    return new cpa.CloudFormationExecuteChangeSetAction({
      actionName: actionName(options.node, options.sharedParent),
      runOrder: options.runOrder,
      changeSetName,
      stackName: stack.stackName,
      role: this.roleFromPlaceholderArn(this.pipeline, region, account, stack.assumeRoleArn),
      region: region,
      variablesNamespace: captureOutputs ? stackVariableNamespace(stack) : undefined,
    });
  }

  private selfMutateAction(options: MakeActionOptions): cp.IAction {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';

    const pipelineStack = Stack.of(this.pipeline);
    const pipelineStackIdentifier = pipelineStack.node.path ?? pipelineStack.stackName;

    return new CodeBuildStep('SelfMutate', {
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,
      projectName: maybeSuffix(this.props.pipelineName, '-selfupdate'),

      buildEnvironment: {
        privileged: this.props.pipelineUsesAssets ? true : undefined,
      },

      // In case the CLI version changes
      includeBuildHashInPipeline: true,

      input: options.graphFromBp.cloudAssemblyFileSet,
      installCommands: [
        `npm install -g aws-cdk${installSuffix}`,
      ],
      commands: [
        `cdk -a ${toPosixPath(embeddedAsmPath(this.pipeline))} deploy ${pipelineStackIdentifier} --require-approval=never --verbose`,
      ],
      rolePolicyStatements: [
        // allow the self-mutating project permissions to assume the bootstrap Action role
        new iam.PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: [`arn:*:iam::${Stack.of(this.pipeline).account}:role/*`],
          conditions: {
            'ForAnyValue:StringEquals': {
              'iam:ResourceTag/aws-cdk:bootstrap-role': ['image-publishing', 'file-publishing', 'deploy'],
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['cloudformation:DescribeStacks'],
          resources: ['*'], // this is needed to check the status of the bootstrap stack when doing `cdk deploy`
        }),
        // S3 checks for the presence of the ListBucket permission
        new iam.PolicyStatement({
          actions: ['s3:ListBucket'],
          resources: ['*'],
        }),
      ],
    }).produce({
      actionName: 'SelfMutate',
      runOrder: options.runOrder,
      artifacts: this.artifacts,
      scope: this.scope,
      fallbackArtifact: this._fallbackArtifact,
      queries: options.queries,
      codeBuildProjectOptions: this.codeBuildOptionsFor(CodeBuildProjectType.SELF_MUTATE),
    }).action;
  }

  private publishAssetsAction(assets: StackAsset[], options: MakeActionOptions): cp.IAction {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';

    const commands = assets.map(asset => {
      const relativeAssetManifestPath = path.relative(this.myCxAsmRoot, asset.assetManifestPath);
      return `cdk-assets --path "${toPosixPath(relativeAssetManifestPath)}" --verbose publish "${asset.assetSelector}"`;
    });

    const assetType = assets[0].assetType;
    if (assets.some(a => a.assetType !== assetType)) {
      throw new Error('All assets in a single publishing step must be of the same type');
    }

    const publishingRoles = this.assetPublishingRoles[assetType] = (this.assetPublishingRoles[assetType] ?? new Set());
    for (const asset of assets) {
      if (asset.assetPublishingRoleArn) {
        publishingRoles.add(asset.assetPublishingRoleArn);
      }
    }

    const assetBuildConfig = this.obtainAssetCodeBuildConfig(assets[0].assetType);

    const result = new CodeBuildStep(options.node.id, {
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,

      buildEnvironment: {
        privileged: assets.some(asset => asset.assetType === AssetType.DOCKER_IMAGE),
      },

      // In case the CLI version changes
      includeBuildHashInPipeline: true,

      input: options.graphFromBp.cloudAssemblyFileSet,
      installCommands: [
        `npm install -g cdk-assets${installSuffix}`,
      ],
      commands,
      role: assetBuildConfig.role,
    }).produce({
      actionName: actionName(options.node, options.sharedParent),
      runOrder: options.runOrder,
      artifacts: this.artifacts,
      scope: this.assetsScope, // For backwards logicalID compatibility
      fallbackArtifact: this._fallbackArtifact,
      queries: options.queries,
      codeBuildProjectOptions: this.codeBuildOptionsFor(CodeBuildProjectType.ASSETS),
    });

    if (result.project && assetBuildConfig.dependable) {
      result.project.node.addDependency(assetBuildConfig.dependable);
    }

    return result.action;
  }

  private nodeTypeFromNode(node: AGraphNode) {
    const isSynthStep = node.data?.type === 'step' && !!node.data?.isBuildStep;
    return isSynthStep ? CodeBuildProjectType.SYNTH : CodeBuildProjectType.STEP;
  }

  private codeBuildOptionsFor(nodeType: CodeBuildProjectType): CodeBuildProjectOptions | undefined {
    const defaultOptions: CodeBuildProjectOptions = {
      buildEnvironment: {
        buildImage: cb.LinuxBuildImage.STANDARD_5_0,
        computeType: cb.ComputeType.SMALL,
      },
    };

    const optionsForType = {
      [CodeBuildProjectType.SYNTH]: this.props.codeBuild?.synth,
      [CodeBuildProjectType.ASSETS]: this.props.codeBuild?.assetPublishing,
      [CodeBuildProjectType.SELF_MUTATE]: this.props.codeBuild?.selfMutation,
      [CodeBuildProjectType.STEP]: {},
    };

    return mergeCodeBuildOptions(
      defaultOptions,
      this.props.codeBuild?.defaults,
      optionsForType[nodeType],
    );
  }

  private roleFromPlaceholderArn(scope: Construct, region: string | undefined,
    account: string | undefined, arn: string): iam.IRole;
  private roleFromPlaceholderArn(scope: Construct, region: string | undefined,
    account: string | undefined, arn: string | undefined): iam.IRole | undefined;
  private roleFromPlaceholderArn(scope: Construct, region: string | undefined,
    account: string | undefined, arn: string | undefined): iam.IRole | undefined {

    if (!arn) { return undefined; }

    // Use placeholdered arn as construct ID.
    const id = arn;

    // https://github.com/aws/aws-cdk/issues/7255
    let existingRole = Node.of(scope).tryFindChild(`ImmutableRole${id}`) as iam.IRole;
    if (existingRole) { return existingRole; }
    // For when #7255 is fixed.
    existingRole = Node.of(scope).tryFindChild(id) as iam.IRole;
    if (existingRole) { return existingRole; }

    const arnToImport = cxapi.EnvironmentPlaceholders.replace(arn, {
      region: region ?? Aws.REGION,
      accountId: account ?? Aws.ACCOUNT_ID,
      partition: Aws.PARTITION,
    });
    return iam.Role.fromRoleArn(scope, id, arnToImport, { mutable: false, addGrantsToResources: true });
  }

  /**
   * Non-template config files for CodePipeline actions
   *
   * Currently only supports tags.
   */
  private writeTemplateConfiguration(stack: StackDeployment): string | undefined {
    if (Object.keys(stack.tags).length === 0) { return undefined; }

    const absConfigPath = `${stack.absoluteTemplatePath}.config.json`;
    const relativeConfigPath = path.relative(this.myCxAsmRoot, absConfigPath);

    // Write the template configuration file (for parameters into CreateChangeSet call that
    // cannot be configured any other way). They must come from a file, and there's unfortunately
    // no better hook to write this file (`construct.onSynthesize()` would have been the prime candidate
    // but that is being deprecated--and DeployCdkStackAction isn't even a construct).
    writeTemplateConfiguration(absConfigPath, {
      Tags: stack.tags,
    });

    return relativeConfigPath;
  }

  /**
   * This role is used by both the CodePipeline build action and related CodeBuild project. Consolidating these two
   * roles into one, and re-using across all assets, saves significant size of the final synthesized output.
   * Modeled after the CodePipeline role and 'CodePipelineActionRole' roles.
   * Generates one role per asset type to separate file and Docker/image-based permissions.
   */
  private obtainAssetCodeBuildConfig(assetType: AssetType): AssetCodeBuildConfig {
    if (this.assetCodeBuildRoles[assetType]) {
      return {
        role: this.assetCodeBuildRoles[assetType],
        dependable: this.assetAttachedPolicies[assetType],
      };
    }

    const stack = Stack.of(this.scope);

    const rolePrefix = assetType === AssetType.DOCKER_IMAGE ? 'Docker' : 'File';
    const assetRole = new iam.Role(this.assetsScope, `${rolePrefix}Role`, {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('codebuild.amazonaws.com'),
        new iam.AccountPrincipal(stack.account),
      ),
    });

    // Logging permissions
    const logGroupArn = stack.formatArn({
      service: 'logs',
      resource: 'log-group',
      sep: ':',
      resourceName: '/aws/codebuild/*',
    });
    assetRole.addToPolicy(new iam.PolicyStatement({
      resources: [logGroupArn],
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
    }));

    // CodeBuild report groups
    const codeBuildArn = stack.formatArn({
      service: 'codebuild',
      resource: 'report-group',
      resourceName: '*',
    });
    assetRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'codebuild:CreateReportGroup',
        'codebuild:CreateReport',
        'codebuild:UpdateReport',
        'codebuild:BatchPutTestCases',
        'codebuild:BatchPutCodeCoverages',
      ],
      resources: [codeBuildArn],
    }));

    // CodeBuild start/stop
    assetRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'codebuild:BatchGetBuilds',
        'codebuild:StartBuild',
        'codebuild:StopBuild',
      ],
    }));

    // Publishing role access
    // The ARNs include raw AWS pseudo parameters (e.g., ${AWS::Partition}), which need to be substituted.
    // Lazy-evaluated so all asset publishing roles are included.
    assetRole.addToPolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: Lazy.list({ produce: () => Array.from(this.assetPublishingRoles[assetType] ?? []).map(arn => Fn.sub(arn)) }),
    }));

    // Grant pull access for any ECR registries and secrets that exist
    if (assetType === AssetType.DOCKER_IMAGE) {
      // this.dockerCredentials.forEach(reg => reg.grantRead(assetRole, DockerCredentialUsage.ASSET_PUBLISHING));
    }

    // Artifact access
    this.pipeline.artifactBucket.grantRead(assetRole);

    // VPC permissions required for CodeBuild
    // Normally CodeBuild itself takes care of this but we're creating a singleton role so now
    // we need to do this.
    if (this.props.vpc) {
      const vpcPolicy = new iam.Policy(assetRole, 'VpcPolicy', {
        statements: [
          new iam.PolicyStatement({
            resources: [`arn:${Aws.PARTITION}:ec2:${Aws.REGION}:${Aws.ACCOUNT_ID}:network-interface/*`],
            actions: ['ec2:CreateNetworkInterfacePermission'],
            conditions: {
              StringEquals: {
                'ec2:Subnet': this.props.vpc
                  .selectSubnets(this.props.subnetSelection).subnetIds
                  .map(si => `arn:${Aws.PARTITION}:ec2:${Aws.REGION}:${Aws.ACCOUNT_ID}:subnet/${si}`),
                'ec2:AuthorizedService': 'codebuild.amazonaws.com',
              },
            },
          }),
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              'ec2:CreateNetworkInterface',
              'ec2:DescribeNetworkInterfaces',
              'ec2:DeleteNetworkInterface',
              'ec2:DescribeSubnets',
              'ec2:DescribeSecurityGroups',
              'ec2:DescribeDhcpOptions',
              'ec2:DescribeVpcs',
            ],
          }),
        ],
      });
      assetRole.attachInlinePolicy(vpcPolicy);
      this.assetAttachedPolicies[assetType] = vpcPolicy;
    }

    this.assetCodeBuildRoles[assetType] = assetRole.withoutPolicyUpdates();
    return {
      role: this.assetCodeBuildRoles[assetType],
      dependable: this.assetAttachedPolicies[assetType],
    };
  }
}

interface AssetCodeBuildConfig {
  readonly role: iam.IRole;
  readonly dependable?: IDependable;
}

enum CodeBuildProjectType {
  SYNTH,
  ASSETS,
  SELF_MUTATE,
  STEP,
}

interface MakeActionOptions {
  readonly graphFromBp: PipelineGraph;
  readonly runOrder: number;
  readonly node: AGraphNode;
  readonly sharedParent: AGraphNode;
  readonly beforeSelfUpdate: boolean;
  readonly queries: BlueprintQueries;
}

function actionName<A>(node: GraphNode<A>, parent: GraphNode<A>) {
  const names = node.ancestorPath(parent).map(n => n.id);
  return names.map(sanitizeName).join('.');
}

function sanitizeName(x: string): string {
  return x.replace(/[^A-Za-z0-9.@\-_]/g, '_');
}

/**
 * Take a set of tranches and split them up into groups so
 * that no set of tranches has more than n items total
 */
function chunkTranches<A>(n: number, xss: A[][]): A[][][] {
  const ret: A[][][] = [];

  while (xss.length > 0) {
    const tranches: A[][] = [];
    let count = 0;

    while (xss.length > 0) {
      const xs = xss[0];
      const spaceRemaining = n - count;
      if (xs.length <= spaceRemaining) {
        tranches.push(xs);
        count += xs.length;
        xss.shift();
      } else {
        tranches.push(xs.splice(0, spaceRemaining));
        count = n;
        break;
      }
    }

    ret.push(tranches);
  }


  return ret;
}

function isCodePipelineActionFactory(x: any): x is ICodePipelineActionFactory {
  return !!x.produce;
}

function makeScope(parent: Construct, id: string): Construct {
  const existing = Node.of(parent).tryFindChild(id);
  if (existing) {
    return existing as Construct;
  }
  return new CoreConstruct(parent, id);
}
