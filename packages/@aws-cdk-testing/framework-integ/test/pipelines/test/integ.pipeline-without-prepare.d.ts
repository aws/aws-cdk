import * as s3 from 'aws-cdk-lib/aws-s3';
import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * A test stack
 *
 * It contains a single Bucket. Such robust. Much uptime.
 */
export declare class BucketStack extends Stack {
    readonly bucket: s3.IBucket;
    constructor(scope: Construct, id: string, props?: StackProps);
}
export declare class PlainStackApp extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps);
}
