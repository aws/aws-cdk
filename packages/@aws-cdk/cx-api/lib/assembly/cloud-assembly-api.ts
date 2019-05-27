import { AppRuntime, MetadataEntry, MissingContext } from '../cxapi';
import { AssetMetadataEntry } from '../metadata/assets';

export interface ICloudAssembly {
  readonly directory: string;
  readonly version: string;
  readonly missing?: { [key: string]: MissingContext };
  readonly runtime: AppRuntime;
  readonly artifacts: ICloudArtifact[];
  readonly stacks: ICloudFormationStackArtifact[];
}

export interface ICloudArtifact {
  readonly assembly?: ICloudAssembly;
  readonly id: string;
  readonly environment: Environment;
  readonly metadata: { [path: string]: MetadataEntry[] };
  readonly missing: { [key: string]: MissingContext };
  readonly autoDeploy: boolean;
  readonly depends: ICloudArtifact[];
  readonly messages: SynthesisMessage[];
}

export interface SynthesisMessage {
  readonly level: SynthesisMessageLevel;
  readonly id: string;
  readonly entry: MetadataEntry;
}

export enum SynthesisMessageLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface ICloudFormationStackArtifact extends ICloudArtifact {
  name: string;
  readonly originalName: string;
  readonly template: any;
  readonly assets: AssetMetadataEntry[];
  readonly logicalIdToPathMap: { [logicalId: string]: string };
}

/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
  /** The arbitrary name of this environment (user-set, or at least user-meaningful) */
  readonly name: string;

  /** The 12-digit AWS account ID for the account this environment deploys into */
  readonly account: string;

  /** The AWS region name where this environment deploys into */
  readonly region: string;
}
