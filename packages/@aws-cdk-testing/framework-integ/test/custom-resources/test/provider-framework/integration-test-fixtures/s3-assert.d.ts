import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface S3AssertProps {
    /**
     * The s3 bucket to query.
     */
    readonly bucket: s3.IBucket;
    /**
     * The object key.
     */
    readonly objectKey: string;
    /**
     * The expected contents.
     */
    readonly expectedContent: string;
}
/**
 * A custom resource that asserts that a file on s3 has the specified contents.
 * This resource will wait 10 minutes before, allowing for eventual consistency
 * to stabilize (and also exercises the idea of asynchronous custom resources).
 *
 * Code is written in Python because why not.
 */
export declare class S3Assert extends Construct {
    constructor(scope: Construct, id: string, props: S3AssertProps);
}
