"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheBehavior = void 0;
const iam = require("@aws-cdk/aws-iam");
const cache_policy_1 = require("../cache-policy");
const distribution_1 = require("../distribution");
/**
 * Allows configuring a variety of CloudFront functionality for a given URL path pattern.
 *
 * Note: This really should simply by called 'Behavior', but this name is already taken by the legacy
 * CloudFrontWebDistribution implementation.
 */
class CacheBehavior {
    constructor(originId, props) {
        this.props = props;
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
    _renderBehavior() {
        return {
            pathPattern: this.props.pathPattern,
            targetOriginId: this.originId,
            allowedMethods: this.props.allowedMethods?.methods,
            cachedMethods: this.props.cachedMethods?.methods,
            cachePolicyId: (this.props.cachePolicy ?? cache_policy_1.CachePolicy.CACHING_OPTIMIZED).cachePolicyId,
            compress: this.props.compress ?? true,
            originRequestPolicyId: this.props.originRequestPolicy?.originRequestPolicyId,
            responseHeadersPolicyId: this.props.responseHeadersPolicy?.responseHeadersPolicyId,
            smoothStreaming: this.props.smoothStreaming,
            viewerProtocolPolicy: this.props.viewerProtocolPolicy ?? distribution_1.ViewerProtocolPolicy.ALLOW_ALL,
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
    validateEdgeLambdas(edgeLambdas) {
        const includeBodyEventTypes = [distribution_1.LambdaEdgeEventType.ORIGIN_REQUEST, distribution_1.LambdaEdgeEventType.VIEWER_REQUEST];
        if (edgeLambdas && edgeLambdas.some(lambda => lambda.includeBody && !includeBodyEventTypes.includes(lambda.eventType))) {
            throw new Error('\'includeBody\' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types.');
        }
    }
    grantEdgeLambdaFunctionExecutionRole(edgeLambdas) {
        if (!edgeLambdas || edgeLambdas.length === 0) {
            return;
        }
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
exports.CacheBehavior = CacheBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtYmVoYXZpb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWNoZS1iZWhhdmlvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBd0M7QUFDeEMsa0RBQThDO0FBRTlDLGtEQUE0RztBQWM1Rzs7Ozs7R0FLRztBQUNILE1BQWEsYUFBYTtJQUd4QixZQUFZLFFBQWdCLEVBQW1CLEtBQXlCO1FBQXpCLFVBQUssR0FBTCxLQUFLLENBQW9CO1FBQ3RFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM5RDtJQUVEOzs7Ozs7O09BT0c7SUFDSSxlQUFlO1FBQ3BCLE9BQU87WUFDTCxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO1lBQ25DLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUM3QixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsT0FBTztZQUNsRCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsT0FBTztZQUNoRCxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSwwQkFBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsYUFBYTtZQUN0RixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksSUFBSTtZQUNyQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLHFCQUFxQjtZQUM1RSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLHVCQUF1QjtZQUNsRixlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO1lBQzNDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLElBQUksbUNBQW9CLENBQUMsU0FBUztZQUN2RixvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pFLFdBQVcsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVc7Z0JBQzdDLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTthQUM1QyxDQUFDLENBQUM7WUFDSCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRSxpQkFBaUIsRUFBRSxVQUFVLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQ3JELFNBQVMsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtnQkFDMUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO2FBQ3BDLENBQUMsQ0FBQztZQUNILGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztTQUNwRixDQUFDO0tBQ0g7SUFFTyxtQkFBbUIsQ0FBQyxXQUEwQjtRQUNwRCxNQUFNLHFCQUFxQixHQUFHLENBQUMsa0NBQW1CLENBQUMsY0FBYyxFQUFFLGtDQUFtQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZHLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO1lBQ3RILE1BQU0sSUFBSSxLQUFLLENBQUMsb0ZBQW9GLENBQUMsQ0FBQztTQUN2RztLQUNGO0lBRU8sb0NBQW9DLENBQUMsV0FBMEI7UUFDckUsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUN6RCxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDakMsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDN0MsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUMxRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztvQkFDMUQsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7aUJBQ25FLENBQUMsQ0FBQyxDQUFDO2FBQ0w7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUE5REQsc0NBOERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ2FjaGVQb2xpY3kgfSBmcm9tICcuLi9jYWNoZS1wb2xpY3knO1xuaW1wb3J0IHsgQ2ZuRGlzdHJpYnV0aW9uIH0gZnJvbSAnLi4vY2xvdWRmcm9udC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQWRkQmVoYXZpb3JPcHRpb25zLCBFZGdlTGFtYmRhLCBMYW1iZGFFZGdlRXZlbnRUeXBlLCBWaWV3ZXJQcm90b2NvbFBvbGljeSB9IGZyb20gJy4uL2Rpc3RyaWJ1dGlvbic7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3Igc3BlY2lmeWluZyBjdXN0b20gYmVoYXZpb3JzIGZvciBvcmlnaW5zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhY2hlQmVoYXZpb3JQcm9wcyBleHRlbmRzIEFkZEJlaGF2aW9yT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0dGVybiAoZS5nLiwgYGltYWdlcy8qLmpwZ2ApIHRoYXQgc3BlY2lmaWVzIHdoaWNoIHJlcXVlc3RzIHRvIGFwcGx5IHRoZSBiZWhhdmlvciB0by5cbiAgICogVGhlcmUgbXVzdCBiZSBleGFjdGx5IG9uZSBiZWhhdmlvciBhc3NvY2lhdGVkIHdpdGggZWFjaCBgRGlzdHJpYnV0aW9uYCB0aGF0IGhhcyBhIHBhdGggcGF0dGVyblxuICAgKiBvZiAnKicsIHdoaWNoIGFjdHMgYXMgdGhlIGNhdGNoLWFsbCBkZWZhdWx0IGJlaGF2aW9yLlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aFBhdHRlcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbGxvd3MgY29uZmlndXJpbmcgYSB2YXJpZXR5IG9mIENsb3VkRnJvbnQgZnVuY3Rpb25hbGl0eSBmb3IgYSBnaXZlbiBVUkwgcGF0aCBwYXR0ZXJuLlxuICpcbiAqIE5vdGU6IFRoaXMgcmVhbGx5IHNob3VsZCBzaW1wbHkgYnkgY2FsbGVkICdCZWhhdmlvcicsIGJ1dCB0aGlzIG5hbWUgaXMgYWxyZWFkeSB0YWtlbiBieSB0aGUgbGVnYWN5XG4gKiBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uIGltcGxlbWVudGF0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVCZWhhdmlvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgb3JpZ2luSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihvcmlnaW5JZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBDYWNoZUJlaGF2aW9yUHJvcHMpIHtcbiAgICB0aGlzLm9yaWdpbklkID0gb3JpZ2luSWQ7XG5cbiAgICB0aGlzLnZhbGlkYXRlRWRnZUxhbWJkYXMocHJvcHMuZWRnZUxhbWJkYXMpO1xuICAgIHRoaXMuZ3JhbnRFZGdlTGFtYmRhRnVuY3Rpb25FeGVjdXRpb25Sb2xlKHByb3BzLmVkZ2VMYW1iZGFzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIHRoZSBDbG91ZEZvcm1hdGlvbiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIGJlaGF2aW9yLlxuICAgKiBUaGlzIHJlbmRlcnMgYXMgYSBcIkNhY2hlQmVoYXZpb3JQcm9wZXJ0eVwiIHJlZ2FyZGxlc3Mgb2YgaWYgdGhpcyBpcyBhIGRlZmF1bHRcbiAgICogY2FjaGUgYmVoYXZpb3Igb3Igbm90LCBhcyB0aGUgdHdvIGFyZSBpZGVudGljYWwgZXhjZXB0IHRoYXQgdGhlIHBhdGhQYXR0ZXJuXG4gICAqIGlzIG9taXR0ZWQgZm9yIHRoZSBkZWZhdWx0IGNhY2hlIGJlaGF2aW9yLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfcmVuZGVyQmVoYXZpb3IoKTogQ2ZuRGlzdHJpYnV0aW9uLkNhY2hlQmVoYXZpb3JQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhQYXR0ZXJuOiB0aGlzLnByb3BzLnBhdGhQYXR0ZXJuLFxuICAgICAgdGFyZ2V0T3JpZ2luSWQ6IHRoaXMub3JpZ2luSWQsXG4gICAgICBhbGxvd2VkTWV0aG9kczogdGhpcy5wcm9wcy5hbGxvd2VkTWV0aG9kcz8ubWV0aG9kcyxcbiAgICAgIGNhY2hlZE1ldGhvZHM6IHRoaXMucHJvcHMuY2FjaGVkTWV0aG9kcz8ubWV0aG9kcyxcbiAgICAgIGNhY2hlUG9saWN5SWQ6ICh0aGlzLnByb3BzLmNhY2hlUG9saWN5ID8/IENhY2hlUG9saWN5LkNBQ0hJTkdfT1BUSU1JWkVEKS5jYWNoZVBvbGljeUlkLFxuICAgICAgY29tcHJlc3M6IHRoaXMucHJvcHMuY29tcHJlc3MgPz8gdHJ1ZSxcbiAgICAgIG9yaWdpblJlcXVlc3RQb2xpY3lJZDogdGhpcy5wcm9wcy5vcmlnaW5SZXF1ZXN0UG9saWN5Py5vcmlnaW5SZXF1ZXN0UG9saWN5SWQsXG4gICAgICByZXNwb25zZUhlYWRlcnNQb2xpY3lJZDogdGhpcy5wcm9wcy5yZXNwb25zZUhlYWRlcnNQb2xpY3k/LnJlc3BvbnNlSGVhZGVyc1BvbGljeUlkLFxuICAgICAgc21vb3RoU3RyZWFtaW5nOiB0aGlzLnByb3BzLnNtb290aFN0cmVhbWluZyxcbiAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiB0aGlzLnByb3BzLnZpZXdlclByb3RvY29sUG9saWN5ID8/IFZpZXdlclByb3RvY29sUG9saWN5LkFMTE9XX0FMTCxcbiAgICAgIGZ1bmN0aW9uQXNzb2NpYXRpb25zOiB0aGlzLnByb3BzLmZ1bmN0aW9uQXNzb2NpYXRpb25zPy5tYXAoYXNzb2NpYXRpb24gPT4gKHtcbiAgICAgICAgZnVuY3Rpb25Bcm46IGFzc29jaWF0aW9uLmZ1bmN0aW9uLmZ1bmN0aW9uQXJuLFxuICAgICAgICBldmVudFR5cGU6IGFzc29jaWF0aW9uLmV2ZW50VHlwZS50b1N0cmluZygpLFxuICAgICAgfSkpLFxuICAgICAgbGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnM6IHRoaXMucHJvcHMuZWRnZUxhbWJkYXM/Lm1hcChlZGdlTGFtYmRhID0+ICh7XG4gICAgICAgIGxhbWJkYUZ1bmN0aW9uQXJuOiBlZGdlTGFtYmRhLmZ1bmN0aW9uVmVyc2lvbi5lZGdlQXJuLFxuICAgICAgICBldmVudFR5cGU6IGVkZ2VMYW1iZGEuZXZlbnRUeXBlLnRvU3RyaW5nKCksXG4gICAgICAgIGluY2x1ZGVCb2R5OiBlZGdlTGFtYmRhLmluY2x1ZGVCb2R5LFxuICAgICAgfSkpLFxuICAgICAgdHJ1c3RlZEtleUdyb3VwczogdGhpcy5wcm9wcy50cnVzdGVkS2V5R3JvdXBzPy5tYXAoa2V5R3JvdXAgPT4ga2V5R3JvdXAua2V5R3JvdXBJZCksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVFZGdlTGFtYmRhcyhlZGdlTGFtYmRhcz86IEVkZ2VMYW1iZGFbXSkge1xuICAgIGNvbnN0IGluY2x1ZGVCb2R5RXZlbnRUeXBlcyA9IFtMYW1iZGFFZGdlRXZlbnRUeXBlLk9SSUdJTl9SRVFVRVNULCBMYW1iZGFFZGdlRXZlbnRUeXBlLlZJRVdFUl9SRVFVRVNUXTtcbiAgICBpZiAoZWRnZUxhbWJkYXMgJiYgZWRnZUxhbWJkYXMuc29tZShsYW1iZGEgPT4gbGFtYmRhLmluY2x1ZGVCb2R5ICYmICFpbmNsdWRlQm9keUV2ZW50VHlwZXMuaW5jbHVkZXMobGFtYmRhLmV2ZW50VHlwZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1xcJ2luY2x1ZGVCb2R5XFwnIGNhbiBvbmx5IGJlIHRydWUgZm9yIE9SSUdJTl9SRVFVRVNUIG9yIFZJRVdFUl9SRVFVRVNUIGV2ZW50IHR5cGVzLicpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ3JhbnRFZGdlTGFtYmRhRnVuY3Rpb25FeGVjdXRpb25Sb2xlKGVkZ2VMYW1iZGFzPzogRWRnZUxhbWJkYVtdKSB7XG4gICAgaWYgKCFlZGdlTGFtYmRhcyB8fCBlZGdlTGFtYmRhcy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgZWRnZUxhbWJkYXMuZm9yRWFjaCgoZWRnZUxhbWJkYSkgPT4ge1xuICAgICAgY29uc3Qgcm9sZSA9IGVkZ2VMYW1iZGEuZnVuY3Rpb25WZXJzaW9uLnJvbGU7XG4gICAgICBpZiAocm9sZSAmJiBpYW0uUm9sZS5pc1JvbGUocm9sZSkgJiYgcm9sZS5hc3N1bWVSb2xlUG9saWN5KSB7XG4gICAgICAgIHJvbGUuYXNzdW1lUm9sZVBvbGljeS5hZGRTdGF0ZW1lbnRzKG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbJ3N0czpBc3N1bWVSb2xlJ10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWRnZWxhbWJkYS5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==