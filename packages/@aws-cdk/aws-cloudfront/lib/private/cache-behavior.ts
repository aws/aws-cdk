import * as iam from '@aws-cdk/aws-iam';
import { CachePolicy } from '../cache-policy';
import { CfnDistribution } from '../cloudfront.generated';
import { AddBehaviorOptions, EdgeLambda, LambdaEdgeEventType, ViewerProtocolPolicy } from '../distribution';

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
export class CacheBehavior {
  private readonly originId: string;

  constructor(originId: string, private readonly props: CacheBehaviorProps) {
    this.originId = originId;

    this.validateEdgeLambdas(props.edgeLambdas);
    this.grantEdgeLambdaFunctionExecutionRole(props.edgeLambdas);
  }

  /**
   * Creates and returns the CloudFormation representation of this behavior.
   * This renders as a "CacheBehaviorProperty" regardless of if this is a default
   * cache behavior or not, as the two are identical except that the pathPattern
   * is omitted for the default cache behavior.
   *
   * @internal
   */
  public _renderBehavior(): CfnDistribution.CacheBehaviorProperty {
    return {
      pathPattern: this.props.pathPattern,
      targetOriginId: this.originId,
      allowedMethods: this.props.allowedMethods?.methods,
      cachedMethods: this.props.cachedMethods?.methods,
      cachePolicyId: (this.props.cachePolicy ?? CachePolicy.CACHING_OPTIMIZED).cachePolicyId,
      compress: this.props.compress ?? true,
      originRequestPolicyId: this.props.originRequestPolicy?.originRequestPolicyId,
      responseHeadersPolicyId: this.props.responseHeadersPolicy?.responseHeadersPolicyId,
      smoothStreaming: this.props.smoothStreaming,
      viewerProtocolPolicy: this.props.viewerProtocolPolicy ?? ViewerProtocolPolicy.ALLOW_ALL,
      functionAssociations: this.props.functionAssociations?.map(association => ({
        functionArn: association.function.functionArn,
        eventType: association.eventType.toString(),
      })),
      lambdaFunctionAssociations: this.props.edgeLambdas?.map(edgeLambda => ({
        lambdaFunctionArn: edgeLambda.functionVersion.edgeArn,
        eventType: edgeLambda.eventType.toString(),
        includeBody: edgeLambda.includeBody,
      })),
      trustedKeyGroups: this.props.trustedKeyGroups?.map(keyGroup => keyGroup.keyGroupId),
    };
  }

  private validateEdgeLambdas(edgeLambdas?: EdgeLambda[]) {
    const includeBodyEventTypes = [LambdaEdgeEventType.ORIGIN_REQUEST, LambdaEdgeEventType.VIEWER_REQUEST];
    if (edgeLambdas && edgeLambdas.some(lambda => lambda.includeBody && !includeBodyEventTypes.includes(lambda.eventType))) {
      throw new Error('\'includeBody\' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types.');
    }
  }

  private grantEdgeLambdaFunctionExecutionRole(edgeLambdas?: EdgeLambda[]) {
    if (!edgeLambdas || edgeLambdas.length === 0) { return; }
    edgeLambdas.forEach((edgeLambda) => {
      const role = edgeLambda.functionVersion.role;
      if (role && iam.Role.isRole(role) && role.assumeRolePolicy) {
        role.assumeRolePolicy.addStatements(new iam.PolicyStatement({
          actions: ['sts:AssumeRole'],
          principals: [new iam.ServicePrincipal('edgelambda.amazonaws.com')],
        }));
      }
    });
  }
}
