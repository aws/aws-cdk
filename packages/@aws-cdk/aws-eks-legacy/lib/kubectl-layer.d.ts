import * as lambda from '@aws-cdk/aws-lambda';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
export interface KubectlLayerProps {
    /**
     * The semantic version of the kubectl AWS Lambda Layer SAR app to use.
     *
     * @default '1.13.7'
     */
    readonly version?: string;
}
/**
 * An AWS Lambda layer that includes kubectl and the AWS CLI.
 *
 * @see https://github.com/aws-samples/aws-lambda-layer-kubectl
 */
export declare class KubectlLayer extends Resource implements lambda.ILayerVersion {
    /**
     * Gets or create a singleton instance of this construct.
     */
    static getOrCreate(scope: Construct, props?: KubectlLayerProps): KubectlLayer;
    /**
     * The ARN of the AWS Lambda layer version.
     */
    readonly layerVersionArn: string;
    /**
     * All runtimes are compatible.
     */
    readonly compatibleRuntimes?: lambda.Runtime[];
    constructor(scope: Construct, id: string, props?: KubectlLayerProps);
    addPermission(_id: string, _permission: lambda.LayerVersionPermission): void;
}
