import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
interface S3FileProps {
    /**
     * The bucket in which the file will be created.
     */
    readonly bucket: s3.IBucket;
    /**
     * The object key.
     *
     * @default - automatically-generated
     */
    readonly objectKey?: string;
    /**
     * The contents of the file.
     */
    readonly contents: string;
    /**
     * Indicates if this file should have public-read permissions.
     *
     * @default false
     */
    readonly public?: boolean;
}
export declare class S3File extends Construct {
    readonly objectKey: string;
    readonly url: string;
    readonly etag: string;
    constructor(scope: Construct, id: string, props: S3FileProps);
}
export {};
