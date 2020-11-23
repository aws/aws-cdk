import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { actionsFromStackArtifact } from './actions/_action_maker';
import { topologicalSort } from './private/toposort';

export interface IPipelineBuilder {
  scope: Construct;
  cloudAssemblyArtifact: codepipeline.Artifact;
  addAction(action: codepipeline.IAction): void;
  addArtifactsFor(stackArtifact: cxapi.CloudFormationStackArtifact): void;
}

export interface IPipelineable {
  addToPipeline(builder: IPipelineBuilder): void;
}

export interface AppContext {
}

export interface ChangeSetsContext {
}
export interface IAppApprover {
  approveApp(appContext: AppContext, builder: IPipelineBuilder): void;
}

export interface IChangeSetApprover {
  approveChangeSets(changeSetsContext: ChangeSetsContext, builder: IPipelineBuilder): void;
}
export interface DeployStageProps {
  readonly appStage: Stage;
  readonly changeSetApprover?: IChangeSetApprover;
  readonly approvalSteps?: IAppApprover[];
}

export class DeployStage implements IPipelineable {
  private readonly asm: cxapi.CloudAssembly;

  constructor(private readonly props: DeployStageProps) {
    this.asm = props.appStage.synth();

    if (this.asm.stacks.length === 0) {
      // If we don't check here, a more puzzling "stage contains no actions"
      // error will be thrown come deployment time.
      throw new Error(`The given Stage construct ('${props.appStage.node.path}') should contain at least one Stack`);
    }
  }

  public addToPipeline(builder: IPipelineBuilder): void {
    const sortedTranches = topologicalSort(this.asm.stacks,
      stack => stack.id,
      stack => stack.dependencies.map(d => d.id));

    for (const stacks of sortedTranches) {
      // These don't have a dependency on each other, so can all be added in parallel

      // Get all assets manifests and add the assets in 'em to the asset publishing stage.
      for (const stackArtifact of stacks) {
        builder.addArtifactsFor(stackArtifact);
      }

      const actionSets = stacks.map(artifact => actionsFromStackArtifact(builder.scope, artifact, {
        cloudAssemblyInput: builder.cloudAssemblyArtifact,
      }));

      for (const actionSet of actionSets) {
        builder.addAction(actionSet.prepareAction);
      }

      this.props.changeSetApprover?.approveChangeSets({
      }, builder);

      for (const actionSet of actionSets) {
        builder.addAction(actionSet.executeAction);
      }
    }

    for (const approval of this.props.approvalSteps ?? []) {
      approval.approveApp({
      }, builder);
    }
  }
}