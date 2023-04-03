import { IConstruct } from 'constructs';
import { BucketAttributes } from './bucket';
export declare function parseBucketArn(construct: IConstruct, props: BucketAttributes): string;
export declare function parseBucketName(construct: IConstruct, props: BucketAttributes): string | undefined;
