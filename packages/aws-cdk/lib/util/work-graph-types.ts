import * as cxapi from '@aws-cdk/cx-api';

export enum DeploymentState {
  PENDING = 'pending',
  QUEUED = 'queued',
  DEPLOYING = 'deploying',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
};

interface WorkNodeOptions {
  readonly id: string;
  readonly dependencies: string[];
}

export enum WorkType {
  STACK_DEPLOY = 'stack',
  ASSET_BUILD = 'asset-build',
  ASSET_PUBLISH = 'asset-publish',
}

export abstract class WorkNode {
  public readonly id: string;
  public readonly dependencies: string[];
  public deploymentState: DeploymentState;
  abstract type: WorkType;

  constructor(options: WorkNodeOptions) {
    this.id = options.id;
    this.dependencies = options.dependencies;
    this.deploymentState = DeploymentState.PENDING;
  }
}

export interface StackNodeOptions extends WorkNodeOptions {
  readonly stack: cxapi.CloudFormationStackArtifact;
}

export class StackNode extends WorkNode {
  public readonly stack: cxapi.CloudFormationStackArtifact;
  public readonly type = WorkType.STACK_DEPLOY;

  constructor(options: StackNodeOptions) {
    super(options);
    this.stack = options.stack;
  }
}

interface AssetOptions extends WorkNodeOptions {
  readonly asset: cxapi.AssetManifestArtifact;
  readonly parentStack: cxapi.CloudFormationStackArtifact;
}
export interface AssetBuildNodeOptions extends AssetOptions {}

export class AssetBuildNode extends WorkNode {
  public readonly asset: cxapi.AssetManifestArtifact;
  public readonly parentStack: cxapi.CloudFormationStackArtifact;
  public readonly type = WorkType.ASSET_BUILD;

  constructor(options: AssetBuildNodeOptions) {
    super(options);
    this.asset = options.asset;
    this.parentStack = options.parentStack;
  }
}

export class AssetPublishNode extends WorkNode {
  public readonly asset: cxapi.AssetManifestArtifact;
  public readonly parentStack: cxapi.CloudFormationStackArtifact;
  public readonly type = WorkType.ASSET_PUBLISH;

  constructor(options: AssetBuildNodeOptions) {
    super(options);
    this.asset = options.asset;
    this.parentStack = options.parentStack;
  }
}

export interface PartialAssetNodeOptions extends Omit<AssetOptions, 'parentStack'> {}
