import { Construct } from 'constructs';
import { Workflow, RolloutWorkflow, WorkflowArtifact } from '../workflow';
import { AssetPublisher } from './asset-publishing';

export interface AddToWorkflowOptions {
  readonly workflow: RolloutWorkflow;
  readonly parent: Workflow;
  readonly scope: Construct;
}

export interface IWorkflowable {
  addToWorkflow(options: AddToWorkflowOptions): void;
}

export interface IArtifactable extends IWorkflowable {
  readonly primaryOutput: WorkflowArtifact;
}

export interface IDeployment {
  addToWorkflow(options: AddDeploymentToWorkflowOptions): void;
}

export interface AddDeploymentToWorkflowOptions extends AddToWorkflowOptions {
  readonly assetPublisher: AssetPublisher;
}

export interface IApprover {
  addToWorkflow(options: AddApproverToWorkflowOptions): void;
}

export interface AddApproverToWorkflowOptions extends AddToWorkflowOptions {
  readonly deploymentWorkflow: Workflow;
}