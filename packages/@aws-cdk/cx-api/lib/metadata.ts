import * as cxprotocol from '@aws-cdk/cloud-assembly-schema';

/**
 * The key used when CDK path is embedded in **CloudFormation template** metadata (not cdk metadata).
 */
export const PATH_METADATA_KEY = 'aws:cdk:path';

export enum SynthesisMessageLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface MetadataEntryResult extends cxprotocol.MetadataEntry {
  /**
   * The path in which this entry was defined.
   */
  readonly path: string;
}

/**
 * Metadata associated with the objects in the stack's Construct tree
 */
export type StackMetadata = { [path: string]: cxprotocol.MetadataEntry[] };

export interface SynthesisMessage {
  readonly level: SynthesisMessageLevel;
  readonly id: string;
  readonly entry: cxprotocol.MetadataEntry;
}
