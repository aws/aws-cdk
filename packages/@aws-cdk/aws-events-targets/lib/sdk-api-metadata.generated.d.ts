export interface AwsSdkMetadata {
    readonly [service: string]: {
        readonly name: string;
        readonly cors?: boolean;
        readonly dualstackAvailable?: boolean;
        readonly prefix?: string;
        readonly versions?: readonly string[];
        readonly xmlNoDefaultLists?: boolean;
        readonly [key: string]: unknown;
    };
}
/**
 * Extracted from aws-sdk version 2.1329.0 (Apache-2.0).
 */
export declare const metadata: AwsSdkMetadata;
