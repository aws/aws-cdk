import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';
import { embeddedAsmPath } from '../../private/construct-internals';
import { enumerate, flatten, maybeSuffix } from '../_util';
import { Backend, RenderBackendOptions } from '../frontend';
import { WorkflowAction, Workflow, WorkflowNode, commonAncestor, ancestorPath, WorkflowShellAction, CreateChangeSetAction, ExecuteChangeSetAction, ManualApprovalAction, RolloutWorkflow, WorkflowRole } from '../workflow';
import { ArtifactMap } from './artifact-map';
import { mergeBuildEnvironments, CodeBuildShellAction } from './codebuild-shell-action';
import { CodePipelineActionFactory } from './codepipeline-action';

export interface CodePipelineBackendProps {
  // Legacy and tweaking props
  readonly pipelineName?: string;
  readonly crossAccountKeys?: boolean;
  readonly cdkCliVersion?: string;
  readonly selfMutating?: boolean;

  /**
   * Set if the pipeline uses assets
   *
   * Configures privileged mode for the 'synth' CodeBuild action.
   *
   * @default false
   */
  readonly pipelineUsesAssets?: boolean;

  // The following 2 should probably go on the asset/synth/selfmutating strategies
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


export class CodePipelineBackend extends Backend {
  private _pipeline?: cp.Pipeline;
  private artifacts = new ArtifactMap();
  private readonly defaultCodeBuildEnv: cb.BuildEnvironment;
  private _buildAction?: CodeBuildShellAction;

  constructor(private readonly props: CodePipelineBackendProps = {}) {
    super();

    this.defaultCodeBuildEnv = {
      buildImage: props.defaultCodeBuildImage ?? cb.LinuxBuildImage.STANDARD_5_0,
      computeType: cb.ComputeType.SMALL,
    };
  }

  public renderBackend(options: RenderBackendOptions): void {
    if (this._pipeline) {
      throw new Error('Pipeline already created');
    }

    this._pipeline = new cp.Pipeline(options.scope, 'Resource', {
      pipelineName: this.props.pipelineName,
      crossAccountKeys: this.props.crossAccountKeys ?? false,
      restartExecutionOnUpdate: true,
    });

    const selfMutating = this.props.selfMutating ?? true;

    this.addStageFromGraphNode(options.workflow.sourceStage, selfMutating);
    this.addStageFromGraphNode(options.workflow.buildStage, selfMutating);

    if (selfMutating) {
      this.addSelfMutateStage(options.workflow);
    }

    for (const node of options.workflow.sortedAdditionalStages) {
      if (!(node instanceof Workflow)) {
        throw new Error('For CodePipeline, top-level children of execution graph must be subgraphs');
      }
      this.addStageFromGraphNode(node, false);
    }
  }

  public get buildProject(): cb.IProject {
    if (!this._buildAction) {
      throw new Error('Call pipeline.build() before reading this property');
    }
    return this._buildAction.project;
  }

  public get pipeline(): cp.Pipeline {
    if (!this._pipeline) {
      throw new Error('Pipeline not created yet');
    }
    return this._pipeline;
  }

  private addSelfMutateStage(executionGraph: RolloutWorkflow) {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';
    const pipelineStackName = Stack.of(this.pipeline).stackName;

    this.pipeline.addStage({
      stageName: 'UpdatePipeline',
      actions: [
        new CodeBuildShellAction({
          runOrder: 1,
          actionName: 'SelfMutate',
          projectName: maybeSuffix(this.props.pipelineName, '-selfupdate'),
          vpc: this.props.vpc,
          subnetSelection: this.props.subnetSelection,
          artifactMap: this.artifacts,
          inputs: [{ directory: '.', artifact: executionGraph.cloudAssemblyArtifact }],
          buildEnvironment: mergeBuildEnvironments(
            this.defaultCodeBuildEnv,
            this.props.pipelineUsesAssets ? { privileged: true } : {},
          ),
          installCommands: [
            `npm install -g aws-cdk${installSuffix}`,
          ],
          buildCommands: [
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
          // In case the CLI version changes
          includeBuildHashInPipeline: true,
        }),
      ],
    });
  }

  private addStageFromGraphNode(graph: Workflow, beforeSelfUpdate: boolean) {
    const tranches = graph.sortedLeaves();
    if (tranches.length === 0) { return; }

    const stage = this.pipeline.addStage({ stageName: graph.name });

    const sharedParent = commonAncestor(flatten(tranches));

    for (const [i, tranche] of enumerate(tranches)) {
      const actions = tranche.filter(isExecutionAction);
      for (const node of actions) {
        stage.addAction(this.makeAction({
          runOrder: i + 1,
          node,
          sharedParent,
          beforeSelfUpdate,
        }));
      }
    }
  }

  private makeAction(options: MakeActionOptions): cp.IAction {
    if (options.node instanceof CodePipelineActionFactory) {
      return options.node.produce({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        artifacts: this.artifacts,
      });
    }

    if (options.node instanceof WorkflowShellAction) {
      const shellAction = new CodeBuildShellAction({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        vpc: this.props.vpc,
        subnetSelection: this.props.subnetSelection,
        artifactMap: this.artifacts,

        // If this CodeBuild job is before the self-update stage, we need to include a hash of
        // its definition in the pipeline (to force the pipeline to restart if the definition changes)
        includeBuildHashInPipeline: options.beforeSelfUpdate,
        ...CodeBuildShellAction.propsFromWorkflowAction(options.node),
        buildEnvironment: this.codeBuildEnvironmentForNode(options.node),
      });

      if (options.node.role === WorkflowRole.BUILD) {
        this._buildAction = shellAction;
      }

      return shellAction;
    }

    const changeSetName = 'PipelineChange';

    if (options.node instanceof CreateChangeSetAction) {
      const changeSetProps = options.node.props;
      return new cpa.CloudFormationCreateReplaceChangeSetAction({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        changeSetName,
        stackName: changeSetProps.stackName,
        templatePath: this.artifacts.toCodePipeline(changeSetProps.templateArtifact).atPath(changeSetProps.templatePath),
        adminPermissions: true,
        role: this.roleFromPlaceholderArn(this.pipeline, changeSetProps.region, changeSetProps.account, changeSetProps.assumeRoleArn),
        deploymentRole: this.roleFromPlaceholderArn(this.pipeline, changeSetProps.region, changeSetProps.account, changeSetProps.executionRoleArn),
        region: changeSetProps.region,
        templateConfiguration: changeSetProps.templateConfigurationPath
          ? this.artifacts.toCodePipeline(changeSetProps.templateArtifact).atPath(changeSetProps.templateConfigurationPath)
          : undefined,
      });
    }

    if (options.node instanceof ExecuteChangeSetAction) {
      const executeProps = options.node.props;
      return new cpa.CloudFormationExecuteChangeSetAction({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        changeSetName,
        stackName: executeProps.stackName,
        role: this.roleFromPlaceholderArn(this.pipeline, executeProps.region, executeProps.account, executeProps.assumeRoleArn),
        region: executeProps.region,
        outputFileName: executeProps.outputFileName,
        output: executeProps.outputArtifact ? this.artifacts.toCodePipeline(executeProps.outputArtifact) : undefined,
      });
    }

    if (options.node instanceof ManualApprovalAction) {
      return new cpa.ManualApprovalAction({
        actionName: actionName(options.node, options.sharedParent),
        runOrder: options.runOrder,
        additionalInformation: options.node.comment,
      });
    }

    throw new Error(`Execution node ${options.node} is not supported for CodePipeline-backed pipelines`);
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

  private codeBuildEnvironmentForNode(node: WorkflowShellAction): cb.BuildEnvironment | undefined {
    switch (node.role) {
      case WorkflowRole.BUILD:
        return mergeBuildEnvironments(this.defaultCodeBuildEnv, this.props.buildEnvironment ?? {});
    }

    return this.defaultCodeBuildEnv;
  }
}

interface MakeActionOptions {
  readonly runOrder: number;
  readonly node: WorkflowAction;
  readonly sharedParent: WorkflowNode;
  readonly beforeSelfUpdate: boolean;
}

function isExecutionAction(node: WorkflowNode): node is WorkflowAction {
  return node instanceof WorkflowAction;
}

function actionName(node: WorkflowNode, parent: WorkflowNode) {
  const names = ancestorPath(node, parent).filter(n => n.role !== WorkflowRole.GROUP).map(n => n.name);
  return names.map(sanitizeName).join('.');
}

function sanitizeName(x: string): string {
  return x.replace(/[^A-Za-z0-9.@\-_]/g, '_');
}
