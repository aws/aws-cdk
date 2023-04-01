import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface BucketPingerProps {
    readonly bucketName: string;
    readonly timeout?: Duration;
}
export declare class BucketPinger extends Construct {
    private _resource;
    constructor(scope: Construct, id: string, props: BucketPingerProps);
    get response(): string;
}
