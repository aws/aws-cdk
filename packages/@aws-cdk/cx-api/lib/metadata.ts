
/**
 * Metadata key used to print INFO-level messages by the toolkit when an app is syntheized.
 */
export const INFO_METADATA_KEY = 'aws:cdk:info';

/**
 * Metadata key used to print WARNING-level messages by the toolkit when an app is syntheized.
 */
export const WARNING_METADATA_KEY = 'aws:cdk:warning';

/**
 * Metadata key used to print ERROR-level messages by the toolkit when an app is syntheized.
 */
export const ERROR_METADATA_KEY = 'aws:cdk:error';

/**
 * The key used when CDK path is embedded in **CloudFormation template** metadata (not cdk metadata).
 */
export const PATH_METADATA_KEY = 'aws:cdk:path';

/**
 * Represents the CloudFormation logical ID of a resource at a certain path.
 */
export const LOGICAL_ID_METADATA_KEY = 'aws:cdk:logicalId';

/**
 * Tag metadata key.
 */
export const STACK_TAGS_METADATA_KEY = 'aws:cdk:stack-tags';

export enum SynthesisMessageLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}
/**
 * An metadata entry in the construct.
 */
export interface MetadataEntry {
  /**
   * The type of the metadata entry.
   */
  readonly type: string;

  /**
   * The data.
   */
  readonly data?: any;

  /**
   * A stack trace for when the entry was created.
   */
  readonly trace?: string[];
}

export interface MetadataEntryResult extends MetadataEntry {
  /**
   * The path in which this entry was defined.
   */
  readonly path: string;
}

/**
 * Metadata associated with the objects in the stack's Construct tree
 */
export type StackMetadata = { [path: string]: MetadataEntry[] };

export interface SynthesisMessage {
  readonly level: SynthesisMessageLevel;
  readonly id: string;
  readonly entry: MetadataEntry;
}
