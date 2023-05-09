import * as cxapi from '@aws-cdk/cx-api';
import { AssetManifest, IManifestEntry } from 'cdk-assets';

export enum DeploymentState {
  PENDING = 'pending',
  QUEUED = 'queued',
  DEPLOYING = 'deploying',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
};

export enum WorkType {
  STACK_DEPLOY = 'stack',
  ASSET_BUILD = 'asset-build',
  ASSET_PUBLISH = 'asset-publish',
}

export type WorkNode = StackNode | AssetBuildNode | AssetPublishNode;

export interface WorkNodeCommon {
  readonly id: string;
  readonly dependencies: string[];
  deploymentState: DeploymentState;
}

export interface StackNode extends WorkNodeCommon {
  readonly type: WorkType.STACK_DEPLOY;
  readonly stack: cxapi.CloudFormationStackArtifact;
}

export interface AssetBuildNode extends WorkNodeCommon {
  readonly type: WorkType.ASSET_BUILD;
  /** The asset manifest this asset resides in (artifact) */
  readonly assetManifestArtifact: cxapi.AssetManifestArtifact;
  /** The asset manifest this asset resides in */
  readonly assetManifest: AssetManifest;
  /** The stack this asset was defined in (used for environment settings) */
  readonly parentStack: cxapi.CloudFormationStackArtifact;
  /** The asset that needs to be built */
  readonly asset: IManifestEntry;
}

export interface AssetPublishNode extends WorkNodeCommon {
  readonly type: WorkType.ASSET_PUBLISH;
  /** The asset manifest this asset resides in (artifact) */
  readonly assetManifestArtifact: cxapi.AssetManifestArtifact;
  /** The asset manifest this asset resides in */
  readonly assetManifest: AssetManifest;
  /** The stack this asset was defined in (used for environment settings) */
  readonly parentStack: cxapi.CloudFormationStackArtifact;
  /** The asset that needs to be published */
  readonly asset: IManifestEntry;
}
