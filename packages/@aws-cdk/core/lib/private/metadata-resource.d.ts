import { Construct } from 'constructs';
import { ConstructInfo } from './runtime-info';
import { Stack } from '../stack';
/**
 * Construct that will render the metadata resource
 */
export declare class MetadataResource extends Construct {
    constructor(scope: Stack, id: string);
}
/**
 * Formats a list of construct fully-qualified names (FQNs) and versions into a (possibly compressed) prefix-encoded string.
 *
 * The list of ConstructInfos is logically formatted into:
 * ${version}!${fqn} (e.g., "1.90.0!aws-cdk-lib.Stack")
 * and then all of the construct-versions are grouped with common prefixes together, grouping common parts in '{}' and separating items with ','.
 *
 * Example:
 * [1.90.0!aws-cdk-lib.Stack, 1.90.0!aws-cdk-lib.Construct, 1.90.0!aws-cdk-lib.service.Resource, 0.42.1!aws-cdk-lib-experiments.NewStuff]
 * Becomes:
 * 1.90.0!aws-cdk-lib.{Stack,Construct,service.Resource},0.42.1!aws-cdk-lib-experiments.NewStuff
 *
 * The whole thing is then either included directly as plaintext as:
 * v2:plaintext:{prefixEncodedList}
 * Or is compressed and base64-encoded, and then formatted as:
 * v2:deflate64:{prefixEncodedListCompressedAndEncoded}
 *
 * Exported/visible for ease of testing.
 */
export declare function formatAnalytics(infos: ConstructInfo[]): string;
