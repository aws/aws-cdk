/**
 * File with definitions for the interface between the Cloud Executable and the CDK toolkit.
 */

import { Environment } from './environment';

export const VERSION = '1';
export const BASE64_REQ_PREFIX = 'base64:';

export interface ListStacksRequest {
    type: 'list',
    context?: any
}

export interface SynthesizeRequest {
    type: 'synth',
    stacks: string[],
    context?: any,
}

export type CXRequest = ListStacksRequest | SynthesizeRequest;

/**
 * Represents a missing piece of context.
 * (should have been an interface, but jsii still doesn't have support for structs).
 */
export interface MissingContext {
    provider: string;
    scope: string[];
    args: string[];
}

export interface ListStacksResponse {
    stacks: StackInfo[]
}

export interface SynthesizeResponse {
    stacks: SynthesizedStack[]
}

/**
 * Identifies a single stack
 */
export interface StackId {
    name: string;
}

/**
 * Identifies and contains metadata about a stack
 */
export interface StackInfo extends StackId {
    environment?: Environment;
}

/**
 * A complete synthesized stack
 */
export interface SynthesizedStack extends StackInfo {
    missing?: { [key: string]: MissingContext };
    metadata: StackMetadata;
    template: any;
}

/**
 * An metadata entry in the construct.
 */
export interface MetadataEntry {
    /**
     * The type of the metadata entry.
     */
    type: string;

    /**
     * The data.
     */
    data?: any;

    /**
     * A stack trace for when the entry was created.
     */
    trace: string[];
}

/**
 * Metadata associated with the objects in the stack's Construct tree
 */
export type StackMetadata = { [path: string]: MetadataEntry[] };

/**
 * Context parameter for the default AWS account to use if a stack's environment is not set.
 */
export const DEFAULT_ACCOUNT_CONTEXT_KEY = 'aws:cdk:toolkit:default-account';

/**
 * Context parameter for the default AWS region to use if a stack's environment is not set.
 */
export const DEFAULT_REGION_CONTEXT_KEY = 'aws:cdk:toolkit:default-region';

export const ASSET_METADATA = 'aws:cdk:asset';
export interface AssetMetadataEntry {
    path: string;
    packaging: 'zip' | 'file';
    s3BucketParameter: string;
    s3KeyParameter: string;
}

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
