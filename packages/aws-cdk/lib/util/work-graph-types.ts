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

export type WorkNode = StackNode | AssetBuildNode | AssetPublishNode;

export interface WorkNodeCommon {
  readonly id: string;
  readonly dependencies: Set<string>;
  deploymentState: DeploymentState;
  /** Some readable information to attach to the id, which may be unreadable */
  readonly note?: string;
}

export interface StackNode extends WorkNodeCommon {
  readonly type: 'stack';
  readonly stack: cxapi.CloudFormationStackArtifact;
  /** Sort by priority when picking up work, higher is earlier */
  readonly priority?: number;
}

export interface AssetBuildNode extends WorkNodeCommon {
  readonly type: 'asset-build';
  /** The asset manifest this asset resides in (artifact) */
  readonly assetManifestArtifact: cxapi.AssetManifestArtifact;
  /** The asset manifest this asset resides in */
  readonly assetManifest: AssetManifest;
  /** The stack this asset was defined in (used for environment settings) */
  readonly parentStack: cxapi.CloudFormationStackArtifact;
  /** The asset that needs to be built */
  readonly asset: IManifestEntry;
  /** Sort by priority when picking up work, higher is earlier */
  readonly priority?: number;
}

export interface AssetPublishNode extends WorkNodeCommon {
  readonly type: 'asset-publish';
  /** The asset manifest this asset resides in (artifact) */
  readonly assetManifestArtifact: cxapi.AssetManifestArtifact;
  /** The asset manifest this asset resides in */
  readonly assetManifest: AssetManifest;
  /** The stack this asset was defined in (used for environment settings) */
  readonly parentStack: cxapi.CloudFormationStackArtifact;
  /** The asset that needs to be published */
  readonly asset: IManifestEntry;
  /** Sort by priority when picking up work, higher is earlier */
  readonly priority?: number;
}
