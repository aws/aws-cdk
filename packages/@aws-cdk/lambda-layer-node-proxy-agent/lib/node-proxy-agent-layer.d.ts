import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
/**
 * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
 */
export declare class NodeProxyAgentLayer extends lambda.LayerVersion {
    constructor(scope: Construct, id: string);
}
