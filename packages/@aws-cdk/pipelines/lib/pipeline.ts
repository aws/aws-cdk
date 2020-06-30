import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { App, CfnOutput, Construct, Stack, Stage } from '@aws-cdk/core';
import * as path from 'path';
import { AssetType, DeployCdkStackAction, PublishAssetsAction, UpdatePipelineAction } from './actions';
import { appOf, assemblyBuilderOf } from './private/construct-internals';
import { AddStageOptions, AssetPublishingCommand, CdkStage, StackOutput } from './stage';

/**
 * Properties for a CdkPipeline
 */
export interface CdkPipelineProps {
  /**
   * The CodePipeline action used to retrieve the CDK app's source
   */
  readonly sourceAction: codepipeline.IAction;

  /**
   * The CodePipeline action build and synthesis step of the CDK app
   */
  readonly synthAction: codepipeline.IAction;

  /**
   * The artifact you have defined to be the artifact to hold the cloudAssemblyArtifact for the synth action
   */
  readonly cloudAssemblyArtifact: codepipeline.Artifact;

  /**
   * Name of the pipeline
   *
   * @default - A name is automatically generated
   */
  readonly pipelineName?: string;

  /**
   * CDK CLI version to use in pipeline
   *
   * Some Actions in the pipeline will download and run a version of the CDK
   * CLI. Specify the version here.
   *
   * @default - Latest version
   */
  readonly cdkCliVersion?: string;
}

/**
 * A Pipeline to deploy CDK apps
 *
 * Defines an AWS CodePipeline-based Pipeline to deploy CDK applications.
 *
 * Automatically manages the following:
 *
 * - Stack dependency order.
 * - Asset publishing.
 * - Keeping the pipeline up-to-date as the CDK apps change.
 * - Using stack outputs later on in the pipeline.
 */
export class CdkPipeline extends Construct {
  private readonly _pipeline: codepipeline.Pipeline;
  private readonly _assets: AssetPublishing;
  private readonly _stages: CdkStage[] = [];
  private readonly _outputArtifacts: Record<string, codepipeline.Artifact> = {};
  private readonly _cloudAssemblyArtifact: codepipeline.Artifact;

  constructor(scope: Construct, id: string, props: CdkPipelineProps) {
    super(scope, id);

    if (!App.isApp(this.node.root)) {
      throw new Error('CdkPipeline must be created under an App');
    }

    this._cloudAssemblyArtifact = props.cloudAssemblyArtifact;
    const pipelineStack = Stack.of(this);

    this._pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      ...props,
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: 'Source',
          actions: [props.sourceAction],
        },
        {
          stageName: 'Build',
          actions: [props.synthAction],
        },
        {
          stageName: 'UpdatePipeline',
          actions: [new UpdatePipelineAction(this, 'UpdatePipeline', {
            cloudAssemblyInput: this._cloudAssemblyArtifact,
            pipelineStackName: pipelineStack.stackName,
            cdkCliVersion: props.cdkCliVersion,
            projectName: maybeSuffix(props.pipelineName, '-selfupdate'),
          })],
        },
      ],
    });

    this._assets = new AssetPublishing(this, 'Assets', {
      cloudAssemblyInput: this._cloudAssemblyArtifact,
      cdkCliVersion: props.cdkCliVersion,
      pipeline: this._pipeline,
      projectName: maybeSuffix(props.pipelineName, '-publish'),
    });
  }

  /**
   * Add pipeline stage that will deploy the given application stage
   *
   * The application construct should subclass `Stage` and can contain any
   * number of `Stacks` inside it that may have dependency relationships
   * on one another.
   *
   * All stacks in the application will be deployed in the appropriate order,
   * and all assets found in the application will be added to the asset
   * publishing stage.
   */
  public addApplicationStage(appStage: Stage, options: AddStageOptions = {}): CdkStage {
    const stage = this.addStage(appStage.stageName);
    stage.addApplication(appStage, options);
    return stage;
  }

  /**
   * Add a new, empty stage to the pipeline
   *
   * Prefer to use `addApplicationStage` if you are intended to deploy a CDK
   * application, but you can use this method if you want to add other kinds of
   * Actions to a pipeline.
   */
  public addStage(stageName: string) {
    const pipelineStage = this._pipeline.addStage({
      stageName,
    });

    const stage = new CdkStage(this, stageName, {
      cloudAssemblyArtifact: this._cloudAssemblyArtifact,
      pipelineStage,
      stageName,
      host: {
        publishAsset: this._assets.addPublishAssetAction.bind(this._assets),
        stackOutputArtifact: (artifactId) => this._outputArtifacts[artifactId],
      },
    });
    this._stages.push(stage);
    return stage;
  }

  /**
   * Get the StackOutput object that holds this CfnOutput's value in this pipeline
   *
   * `StackOutput` can be used in validation actions later in the pipeline.
   */
  public stackOutput(cfnOutput: CfnOutput): StackOutput {
    const stack = Stack.of(cfnOutput);

    if (!this._outputArtifacts[stack.artifactId]) {
      // We should have stored the ArtifactPath in the map, but its Artifact
      // property isn't publicly readable...
      this._outputArtifacts[stack.artifactId] = new codepipeline.Artifact(`Artifact_${stack.artifactId}_Outputs`);
    }

    return new StackOutput(this._outputArtifacts[stack.artifactId].atPath('outputs.json'), cfnOutput.logicalId);
  }

  /**
   * Validate that we don't have any stacks violating dependency order in the pipeline
   *
   * Our own convenience methods will never generate a pipeline that does that (although
   * this is a nice verification), but a user can also add the stacks by hand.
   */
  protected validate(): string[] {
    const ret = new Array<string>();

    ret.push(...this.validateDeployOrder());
    ret.push(...this.validateRequestedOutputs());

    return ret;
  }

  protected onPrepare() {
    super.onPrepare();

    // TODO: Support this in a proper way in the upstream library. For now, we
    // "un-add" the Assets stage if it turns out to be empty.
    this._assets.removeAssetsStageIfEmpty();
  }

  /**
   * Return all StackDeployActions in an ordered list
   */
  private get stackActions(): DeployCdkStackAction[] {
    return flatMap(this._pipeline.stages, s => s.actions.filter(isDeployAction));
  }

  private* validateDeployOrder(): IterableIterator<string> {
    const stackActions = this.stackActions;
    for (const stackAction of stackActions) {
      // For every dependency, it must be executed in an action before this one is prepared.
      for (const depId of stackAction.dependencyStackArtifactIds) {
        const depAction = stackActions.find(s => s.stackArtifactId === depId);

        if (depAction === undefined) {
          this.node.addWarning(`Stack '${stackAction.stackName}' depends on stack ` +
              `'${depId}', but that dependency is not deployed through the pipeline!`);
        } else if (!(depAction.executeRunOrder < stackAction.prepareRunOrder)) {
          yield `Stack '${stackAction.stackName}' depends on stack ` +
              `'${depAction.stackName}', but is deployed before it in the pipeline!`;
        }
      }
    }
  }

  private* validateRequestedOutputs(): IterableIterator<string> {
    const artifactIds = this.stackActions.map(s => s.stackArtifactId);

    for (const artifactId of Object.keys(this._outputArtifacts)) {
      if (!artifactIds.includes(artifactId)) {
        yield `Trying to use outputs for Stack '${artifactId}', but Stack is not deployed in this pipeline. Add it to the pipeline.`;
      }
    }
  }
}

function isDeployAction(a: codepipeline.IAction): a is DeployCdkStackAction {
  return a instanceof DeployCdkStackAction;
}

function flatMap<A, B>(xs: A[], f: (x: A) => B[]): B[] {
  return Array.prototype.concat([], ...xs.map(f));
}

interface AssetPublishingProps {
  readonly cloudAssemblyInput: codepipeline.Artifact;
  readonly pipeline: codepipeline.Pipeline;
  readonly cdkCliVersion?: string;
  readonly projectName?: string;
}

/**
 * Add appropriate publishing actions to the asset publishing stage
 */
class AssetPublishing extends Construct {
  private readonly publishers: Record<string, PublishAssetsAction> = {};
  private readonly myCxAsmRoot: string;

  private readonly stage: codepipeline.IStage;
  private _fileAssetCtr = 1;
  private _dockerAssetCtr = 1;

  constructor(scope: Construct, id: string, private readonly props: AssetPublishingProps) {
    super(scope, id);
    this.myCxAsmRoot = path.resolve(assemblyBuilderOf(appOf(this)).outdir);

    // We MUST add the Stage immediately here, otherwise it will be in the wrong place
    // in the pipeline!
    this.stage = this.props.pipeline.addStage({ stageName: 'Assets' });
  }

  /**
   * Make sure there is an action in the stage to publish the given asset
   *
   * Assets are grouped by asset ID (which represent individual assets) so all assets
   * are published in parallel. For each assets, all destinations are published sequentially
   * so that we can reuse expensive operations between them (mostly: building a Docker image).
   */
  public addPublishAssetAction(command: AssetPublishingCommand) {
    // FIXME: this is silly, we need the relative path here but no easy way to get it
    const relativePath = path.relative(this.myCxAsmRoot, command.assetManifestPath);

    let action = this.publishers[command.assetId];
    if (!action) {
      // The asset ID would be a logical candidate for the construct path and project names, but if the asset
      // changes it leads to recreation of a number of Role/Policy/Project resources which is slower than
      // necessary. Number sequentially instead.
      //
      // FIXME: The ultimate best solution is probably to generate a single Project per asset type
      // and reuse that for all assets.

      const id = command.assetType === AssetType.FILE ? `FileAsset${this._fileAssetCtr++}` : `DockerAsset${this._dockerAssetCtr++}`;

      action = this.publishers[command.assetId] = new PublishAssetsAction(this, id, {
        actionName: command.assetId,
        cloudAssemblyInput: this.props.cloudAssemblyInput,
        cdkCliVersion: this.props.cdkCliVersion,
        assetType: command.assetType,
      });
      this.stage.addAction(action);
    }

    action.addPublishCommand(relativePath, command.assetSelector);
  }

  /**
   * Remove the Assets stage if it turns out we didn't add any Assets to publish
   */
  public removeAssetsStageIfEmpty() {
    if (Object.keys(this.publishers).length === 0) {
      // Hacks to get access to innards of Pipeline
      // Modify 'stages' array in-place to remove Assets stage if empty
      const stages: codepipeline.IStage[] = (this.props.pipeline as any)._stages;

      const ix = stages.indexOf(this.stage);
      if (ix > -1) {
        stages.splice(ix, 1);
      }
    }
  }
}

function maybeSuffix(x: string | undefined, suffix: string): string | undefined {
  if (x === undefined) { return undefined; }
  return `${x}${suffix}`;
}