import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';
import { Blueprint, ManualApproval, RunScript, StackAsset, StackDeployment, Step } from '../blueprint';
import { IDeploymentEngine } from '../bp-main/engine';
import { embeddedAsmPath } from '../private/construct-internals';
import { GraphNode, GraphNodeCollection, isGraph } from '../private/graph';
import { enumerate, flatten, maybeSuffix } from '../private/javascript';
import { writeTemplateConfiguration } from '../private/template-configuration';
import { AGraphNode, GraphFromBlueprint } from './_graph-from-blueprint';
import { ArtifactMap } from './artifact-map';
import { CodeBuildStep, mergeBuildEnvironments } from './codebuild-step';
import { ICodePipelineActionFactory } from './codepipeline-action-factory';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';
import { AssetType } from '../types/asset-type';
import { toPosixPath } from '../private/fs';

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
   * CodeBuild environment for the build job
   *
   * @default - non-privileged build, SMALL instance
   */
  readonly buildEnvironment?: cb.BuildEnvironment;

  /**
   * Default image for CodeBuild projects
   *
   * @default LinuxBuildImage.STANDARD_5_0
   */
  readonly defaultCodeBuildImage?: cb.IBuildImage;
}

export class CodePipelineEngine extends CoreConstruct implements IDeploymentEngine {
  private _pipeline?: cp.Pipeline;
  private artifacts = new ArtifactMap();
  private readonly defaultCodeBuildEnv: cb.BuildEnvironment;
  private _buildStep?: CodeBuildStep;
  private readonly selfMutation: boolean;

  constructor(scope: Construct, id: string, private readonly props: CodePipelineEngineProps={}) {
    super(scope, id);

    this.selfMutation = this.props.selfMutation ?? true;
    this.defaultCodeBuildEnv = {
      buildImage: props.defaultCodeBuildImage ?? cb.LinuxBuildImage.STANDARD_5_0,
      computeType: cb.ComputeType.SMALL,
    };
  }

  public buildDeployment(blueprint: Blueprint): void {
    if (this._pipeline) {
      throw new Error('Pipeline already created');
    }

    this._pipeline = new cp.Pipeline(this, 'Pipeline', {
      pipelineName: this.props.pipelineName,
      crossAccountKeys: this.props.crossAccountKeys ?? false,
      restartExecutionOnUpdate: true,
    });

    const graphFromBp = new GraphFromBlueprint(blueprint, {
      selfMutation: this.props.selfMutation,
    });

    this.pipelineStagesAndActionsFromGraph(graphFromBp);
  }

  private pipelineStagesAndActionsFromGraph(graphFromBp: GraphFromBlueprint) {
    // Translate graph into Pipeline Stages and Actions
    let beforeSelfMutation = this.selfMutation;
    for (const stageNode of flatten(graphFromBp.graph.sortedChildren())) {
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
              graphFromBp,
              runOrder: runOrder + 1,
              node,
              sharedParent,
              beforeSelfUpdate: beforeSelfMutation,
            }));
          }
        }
      }
    }
  }

  public get buildProject(): cb.IProject {
    if (!this._buildStep) {
      throw new Error('Call pipeline.build() before reading this property');
    }
    return this._buildStep.project;
  }

  public get pipeline(): cp.Pipeline {
    if (!this._pipeline) {
      throw new Error('Pipeline not created yet');
    }
    return this._pipeline;
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
        return this.executeChangeSetAction(options.node.data.stack, options);

      case 'step':
        return this.actionFromStep(options.node.data.step, options);
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
  private actionFromStep(step: Step, options: MakeActionOptions): cp.IAction {
    // CodePipeline-specific steps first -- this includes Sources
    if (isCodePipelineActionFactory(step)) {
      return step.produce({
        scope: this,
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        artifacts: this.artifacts,
      });
    }

    // Now built-in steps
    if (step instanceof RunScript) {
      return new CodeBuildStep(step.id, {
        vpc: this.props.vpc,
        subnetSelection: this.props.subnetSelection,

        // If this CodeBuild job is before the self-update stage, we need to include a hash of
        // its definition in the pipeline (to force the pipeline to restart if the definition changes)
        includeBuildHashInPipeline: options.beforeSelfUpdate,
        ...CodeBuildStep.propsFromStep(step),
        buildEnvironment: this.codeBuildEnvironmentFromNode(options.node),
      }).produce({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        artifacts: this.artifacts,
        scope: this,
      });
    }

    if (step instanceof ManualApproval) {
      return new cpa.ManualApprovalAction({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        additionalInformation: step.comment,
      });
    }

    throw new Error(`Deployment step '${step}' is not supported for CodePipeline-backed pipelines`);
  }

  private createChangeSetAction(stack: StackDeployment, options: MakeActionOptions) {
    const changeSetName = 'PipelineChange';

    const templateArtifact = this.artifacts.toCodePipeline(stack.customCloudAssembly ?? options.graphFromBp.cloudAssemblyFileSet);
    const templateConfigurationPath = this.writeTemplateConfiguration(stack);

    return new cpa.CloudFormationCreateReplaceChangeSetAction({
      actionName: actionName(options.node, options.sharedParent),
      runOrder: options.runOrder,
      changeSetName,
      stackName: stack.stackName,
      templatePath: templateArtifact.atPath(stack.templatePath),
      adminPermissions: true,
      role: this.roleFromPlaceholderArn(this.pipeline, stack.region, stack.account, stack.assumeRoleArn),
      deploymentRole: this.roleFromPlaceholderArn(this.pipeline, stack.region, stack.account, stack.executionRoleArn),
      region: stack.region,
      templateConfiguration: templateConfigurationPath
        ? templateArtifact.atPath(templateConfigurationPath)
        : undefined,
    });
  }

  private executeChangeSetAction(stack: StackDeployment, options: MakeActionOptions) {
    const changeSetName = 'PipelineChange';
    return new cpa.CloudFormationExecuteChangeSetAction({
      actionName: actionName(options.node, options.sharedParent),
      runOrder: options.runOrder,
      changeSetName,
      stackName: stack.stackName,
      role: this.roleFromPlaceholderArn(this.pipeline, stack.region, stack.account, stack.assumeRoleArn),
      region: stack.region,
    });
  }

  private selfMutateAction(options: MakeActionOptions): cp.IAction {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';
    const pipelineStackName = Stack.of(this.pipeline).stackName;

    return new CodeBuildStep('SelfMutate', {
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,
      projectName: maybeSuffix(this.props.pipelineName, '-selfupdate'),

      buildEnvironment: mergeBuildEnvironments(
        this.defaultCodeBuildEnv,
        this.props.pipelineUsesAssets ? { privileged: true } : {},
      ),

      // In case the CLI version changes
      includeBuildHashInPipeline: true,

      input: options.graphFromBp.cloudAssemblyFileSet,
      installCommands: [
        `npm install -g aws-cdk${installSuffix}`,
      ],
      commands: [
        `cdk -a ${embeddedAsmPath(this.pipeline)} deploy ${pipelineStackName} --require-approval=never --verbose`,
      ],
      rolePolicyStatements: [
        // allow the self-mutating project permissions to assume the bootstrap Action role
        new iam.PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: ['arn:*:iam::*:role/*-deploy-role-*', 'arn:*:iam::*:role/*-publishing-role-*'],
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
      scope: this,
    });
  }

  private publishAssetsAction(assets: StackAsset[], options: MakeActionOptions): cp.IAction {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';

    const commands = assets.map(asset => {
      return `cdk-assets --path "${toPosixPath(asset.relativeAssetManifestPath)}" --verbose publish "${asset.assetSelector}"`;
    });

    const relativeAssetManifestPath = path.relative(this.myCxAsmRoot, manifestArtifact.file);
        relativeAssetManifestPath,


    return new CodeBuildStep(options.node.id, {
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,
      projectName: maybeSuffix(this.props.pipelineName, '-selfupdate'),

      buildEnvironment: mergeBuildEnvironments(
        this.defaultCodeBuildEnv,
        { privileged: assets.some(asset => asset.assetType === AssetType.DOCKER_IMAGE) },
      ),

      // In case the CLI version changes
      includeBuildHashInPipeline: true,

      input: options.graphFromBp.cloudAssemblyFileSet,
      installCommands: [
        `npm install -g cdk-assets${installSuffix}`,
      ],
      commands,
      rolePolicyStatements: [
        // allow the self-mutating project permissions to assume the bootstrap Action role
        new iam.PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: ['arn:*:iam::*:role/*-deploy-role-*', 'arn:*:iam::*:role/*-publishing-role-*'],
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
      scope: this,
    });
  }


  private codeBuildEnvironmentFromNode(node: AGraphNode): cb.BuildEnvironment | undefined {
    const isBuildStep = node.data?.type === 'step' && !!node.data?.isBuildStep;
    if (isBuildStep) {
      return mergeBuildEnvironments(this.defaultCodeBuildEnv, this.props.buildEnvironment ?? {});
    }

    return this.defaultCodeBuildEnv;
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
    return iam.Role.fromRoleArn(scope, id, arnToImport, { mutable: false });
  }

  /**
   * Non-template config files for CodePipeline actions
   *
   * Currently only supports tags.
   */
  private writeTemplateConfiguration(stack: StackDeployment): string | undefined {
    let fullConfigPath;
    if (Object.keys(stack.tags).length > 0) {
      fullConfigPath = `${stack.templatePath}.config.json`;

      // Write the template configuration file (for parameters into CreateChangeSet call that
      // cannot be configured any other way). They must come from a file, and there's unfortunately
      // no better hook to write this file (`construct.onSynthesize()` would have been the prime candidate
      // but that is being deprecated--and DeployCdkStackAction isn't even a construct).
      writeTemplateConfiguration(fullConfigPath, {
        Tags: stack.tags,
      });
    }

    return fullConfigPath;
  }
}

interface MakeActionOptions {
  readonly graphFromBp: GraphFromBlueprint;
  readonly runOrder: number;
  readonly node: AGraphNode;
  readonly sharedParent: AGraphNode;
  readonly beforeSelfUpdate: boolean;
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