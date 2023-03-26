import { CrossRegionExports } from '../types';
export declare function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<{
    Data: CrossRegionExports;
} | undefined>;
