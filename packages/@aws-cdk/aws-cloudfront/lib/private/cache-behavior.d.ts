import { CfnDistribution } from '../cloudfront.generated';
import { AddBehaviorOptions } from '../distribution';
/**
 * Properties for specifying custom behaviors for origins.
 */
export interface CacheBehaviorProps extends AddBehaviorOptions {
    /**
     * The pattern (e.g., `images/*.jpg`) that specifies which requests to apply the behavior to.
     * There must be exactly one behavior associated with each `Distribution` that has a path pattern
     * of '*', which acts as the catch-all default behavior.
     */
    readonly pathPattern: string;
}
/**
 * Allows configuring a variety of CloudFront functionality for a given URL path pattern.
 *
 * Note: This really should simply by called 'Behavior', but this name is already taken by the legacy
 * CloudFrontWebDistribution implementation.
 */
export declare class CacheBehavior {
    private readonly props;
    private readonly originId;
    constructor(originId: string, props: CacheBehaviorProps);
    /**
     * Creates and returns the CloudFormation representation of this behavior.
     * This renders as a "CacheBehaviorProperty" regardless of if this is a default
     * cache behavior or not, as the two are identical except that the pathPattern
     * is omitted for the default cache behavior.
     *
     * @internal
     */
    _renderBehavior(): CfnDistribution.CacheBehaviorProperty;
    private validateEdgeLambdas;
    private grantEdgeLambdaFunctionExecutionRole;
}
