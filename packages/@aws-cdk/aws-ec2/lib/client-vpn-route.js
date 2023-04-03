"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientVpnRoute = exports.ClientVpnRouteTarget = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const ec2_generated_1 = require("./ec2.generated");
/**
 * Target for a client VPN route
 */
class ClientVpnRouteTarget {
    /**
     * Subnet
     *
     * The specified subnet must be an existing target network of the client VPN
     * endpoint.
     */
    static subnet(subnet) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ISubnet(subnet);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.subnet);
            }
            throw error;
        }
        return { subnetId: subnet.subnetId };
    }
    /**
     * Local network
     */
    static local() {
        return { subnetId: 'local' };
    }
}
_a = JSII_RTTI_SYMBOL_1;
ClientVpnRouteTarget[_a] = { fqn: "@aws-cdk/aws-ec2.ClientVpnRouteTarget", version: "0.0.0" };
exports.ClientVpnRouteTarget = ClientVpnRouteTarget;
/**
 * A client VPN route
 */
class ClientVpnRoute extends core_1.Resource {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ClientVpnRouteProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ClientVpnRoute);
            }
            throw error;
        }
        if (!props.clientVpnEndoint && !props.clientVpnEndpoint) {
            throw new Error('ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified');
        }
        if (props.clientVpnEndoint && props.clientVpnEndpoint) {
            throw new Error('ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
                ', but not both');
        }
        const clientVpnEndpoint = props.clientVpnEndoint || props.clientVpnEndpoint;
        super(scope, id);
        const route = new ec2_generated_1.CfnClientVpnRoute(this, 'Resource', {
            clientVpnEndpointId: clientVpnEndpoint.endpointId,
            description: props.description,
            destinationCidrBlock: props.cidr,
            targetVpcSubnetId: props.target.subnetId,
        });
        // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-clientvpnroute.html
        route.node.addDependency(clientVpnEndpoint.targetNetworksAssociated);
    }
}
_b = JSII_RTTI_SYMBOL_1;
ClientVpnRoute[_b] = { fqn: "@aws-cdk/aws-ec2.ClientVpnRoute", version: "0.0.0" };
exports.ClientVpnRoute = ClientVpnRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1yb3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaWVudC12cG4tcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXlDO0FBR3pDLG1EQUFvRDtBQWdDcEQ7O0dBRUc7QUFDSCxNQUFzQixvQkFBb0I7SUFDeEM7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQWU7Ozs7Ozs7Ozs7UUFDbEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdEM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUM7S0FDOUI7Ozs7QUFoQm1CLG9EQUFvQjtBQXlDMUM7O0dBRUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxlQUFRO0lBQzFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7Ozs7OzsrQ0FEekQsY0FBYzs7OztRQUV2QixJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFO1lBQ3ZELE1BQU0sSUFBSSxLQUFLLENBQ2IsNkZBQTZGLENBQzlGLENBQUM7U0FDSDtRQUNELElBQUksS0FBSyxDQUFDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUNyRCxNQUFNLElBQUksS0FBSyxDQUNiLDZGQUE2RjtnQkFDM0YsZ0JBQWdCLENBQ25CLENBQUM7U0FDSDtRQUNELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUM1RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksaUNBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxtQkFBbUIsRUFBRSxpQkFBa0IsQ0FBQyxVQUFVO1lBQ2xELFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixvQkFBb0IsRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVE7U0FDekMsQ0FBQyxDQUFDO1FBRUgsMEdBQTBHO1FBQzFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFrQixDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDdkU7Ozs7QUF4QlUsd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQ2xpZW50VnBuRW5kcG9pbnQgfSBmcm9tICcuL2NsaWVudC12cG4tZW5kcG9pbnQtdHlwZXMnO1xuaW1wb3J0IHsgQ2ZuQ2xpZW50VnBuUm91dGUgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVN1Ym5ldCB9IGZyb20gJy4vdnBjJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBhIENsaWVudFZwblJvdXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50VnBuUm91dGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBJUHY0IGFkZHJlc3MgcmFuZ2UsIGluIENJRFIgbm90YXRpb24sIG9mIHRoZSByb3V0ZSBkZXN0aW5hdGlvbi5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqICAgLSBUbyBhZGQgYSByb3V0ZSBmb3IgSW50ZXJuZXQgYWNjZXNzLCBlbnRlciAwLjAuMC4wLzBcbiAgICogICAtIFRvIGFkZCBhIHJvdXRlIGZvciBhIHBlZXJlZCBWUEMsIGVudGVyIHRoZSBwZWVyZWQgVlBDJ3MgSVB2NCBDSURSIHJhbmdlXG4gICAqICAgLSBUbyBhZGQgYSByb3V0ZSBmb3IgYW4gb24tcHJlbWlzZXMgbmV0d29yaywgZW50ZXIgdGhlIEFXUyBTaXRlLXRvLVNpdGUgVlBOXG4gICAqICAgICBjb25uZWN0aW9uJ3MgSVB2NCBDSURSIHJhbmdlXG4gICAqICAgLSBUbyBhZGQgYSByb3V0ZSBmb3IgdGhlIGxvY2FsIG5ldHdvcmssIGVudGVyIHRoZSBjbGllbnQgQ0lEUiByYW5nZVxuICAgKi9cbiAgcmVhZG9ubHkgY2lkcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGJyaWVmIGRlc2NyaXB0aW9uIG9mIHRoZSBhdXRob3JpemF0aW9uIHJ1bGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZGVzY3JpcHRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IGZvciB0aGUgcm91dGVcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldDogQ2xpZW50VnBuUm91dGVUYXJnZXQ7XG59XG5cbi8qKlxuICogVGFyZ2V0IGZvciBhIGNsaWVudCBWUE4gcm91dGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENsaWVudFZwblJvdXRlVGFyZ2V0IHtcbiAgLyoqXG4gICAqIFN1Ym5ldFxuICAgKlxuICAgKiBUaGUgc3BlY2lmaWVkIHN1Ym5ldCBtdXN0IGJlIGFuIGV4aXN0aW5nIHRhcmdldCBuZXR3b3JrIG9mIHRoZSBjbGllbnQgVlBOXG4gICAqIGVuZHBvaW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdWJuZXQoc3VibmV0OiBJU3VibmV0KTogQ2xpZW50VnBuUm91dGVUYXJnZXQge1xuICAgIHJldHVybiB7IHN1Ym5ldElkOiBzdWJuZXQuc3VibmV0SWQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbCBuZXR3b3JrXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxvY2FsKCk6IENsaWVudFZwblJvdXRlVGFyZ2V0IHtcbiAgICByZXR1cm4geyBzdWJuZXRJZDogJ2xvY2FsJyB9O1xuICB9XG5cbiAgLyoqIFRoZSBzdWJuZXQgSUQgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHN1Ym5ldElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBDbGllbnRWcG5Sb3V0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFZwblJvdXRlUHJvcHMgZXh0ZW5kcyBDbGllbnRWcG5Sb3V0ZU9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IFZQTiBlbmRwb2ludCB0byB3aGljaCB0byBhZGQgdGhlIHJvdXRlLlxuICAgKiBAZGVmYXVsdCBjbGllbnRWcG5FbmRwb2ludCBpcyByZXF1aXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50VnBuRW5kcG9pbnQ/OiBJQ2xpZW50VnBuRW5kcG9pbnQ7XG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IFZQTiBlbmRwb2ludCB0byB3aGljaCB0byBhZGQgdGhlIHJvdXRlLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGNsaWVudFZwbkVuZHBvaW50YCBpbnN0ZWFkXG4gICAqIEBkZWZhdWx0IGNsaWVudFZwbkVuZHBvaW50IGlzIHJlcXVpcmVkXG5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudFZwbkVuZG9pbnQ/OiBJQ2xpZW50VnBuRW5kcG9pbnQ7XG59XG5cbi8qKlxuICogQSBjbGllbnQgVlBOIHJvdXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGllbnRWcG5Sb3V0ZSBleHRlbmRzIFJlc291cmNlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENsaWVudFZwblJvdXRlUHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLmNsaWVudFZwbkVuZG9pbnQgJiYgIXByb3BzLmNsaWVudFZwbkVuZHBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDbGllbnRWcG5Sb3V0ZTogZWl0aGVyIGNsaWVudFZwbkVuZHBvaW50IG9yIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQpIG11c3QgYmUgc3BlY2lmaWVkJyxcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5jbGllbnRWcG5FbmRvaW50ICYmIHByb3BzLmNsaWVudFZwbkVuZHBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDbGllbnRWcG5Sb3V0ZTogZWl0aGVyIGNsaWVudFZwbkVuZHBvaW50IG9yIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQpIG11c3QgYmUgc3BlY2lmaWVkJyArXG4gICAgICAgICAgJywgYnV0IG5vdCBib3RoJyxcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IGNsaWVudFZwbkVuZHBvaW50ID0gcHJvcHMuY2xpZW50VnBuRW5kb2ludCB8fCBwcm9wcy5jbGllbnRWcG5FbmRwb2ludDtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IENmbkNsaWVudFZwblJvdXRlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGNsaWVudFZwbkVuZHBvaW50SWQ6IGNsaWVudFZwbkVuZHBvaW50IS5lbmRwb2ludElkLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgZGVzdGluYXRpb25DaWRyQmxvY2s6IHByb3BzLmNpZHIsXG4gICAgICB0YXJnZXRWcGNTdWJuZXRJZDogcHJvcHMudGFyZ2V0LnN1Ym5ldElkLFxuICAgIH0pO1xuXG4gICAgLy8gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lYzItY2xpZW50dnBucm91dGUuaHRtbFxuICAgIHJvdXRlLm5vZGUuYWRkRGVwZW5kZW5jeShjbGllbnRWcG5FbmRwb2ludCEudGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkKTtcbiAgfVxufVxuIl19