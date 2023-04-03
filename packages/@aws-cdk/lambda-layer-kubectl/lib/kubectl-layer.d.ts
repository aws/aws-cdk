import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
export declare class KubectlLayer extends lambda.LayerVersion {
    constructor(scope: Construct, id: string);
}
