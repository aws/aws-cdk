import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export declare class AwsCliLayer extends lambda.LayerVersion {
    constructor(scope: Construct, id: string);
}
