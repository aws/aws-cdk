"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_TUNNEL_INSIDE_CIDR = exports.VpnConnection = exports.VpnConnectionBase = exports.VpnGateway = exports.VpnConnectionType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const net = require("net");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const ec2_generated_1 = require("./ec2.generated");
/**
 * The VPN connection type.
 */
var VpnConnectionType;
(function (VpnConnectionType) {
    /**
     * The IPsec 1 VPN connection type.
     */
    VpnConnectionType["IPSEC_1"] = "ipsec.1";
    /**
     * Dummy member
     * TODO: remove once https://github.com/aws/jsii/issues/231 is fixed
     */
    VpnConnectionType["DUMMY"] = "dummy";
})(VpnConnectionType = exports.VpnConnectionType || (exports.VpnConnectionType = {}));
/**
 * The VPN Gateway that shall be added to the VPC
 *
 * @resource AWS::EC2::VPNGateway
 */
class VpnGateway extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpnGatewayProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, VpnGateway);
            }
            throw error;
        }
        // This is 'Default' instead of 'Resource', because using 'Default' will generate
        // a logical ID for a VpnGateway which is exactly the same as the logical ID that used
        // to be created for the CfnVPNGateway (and 'Resource' would not do that).
        const vpnGW = new ec2_generated_1.CfnVPNGateway(this, 'Default', props);
        this.gatewayId = vpnGW.ref;
    }
}
_a = JSII_RTTI_SYMBOL_1;
VpnGateway[_a] = { fqn: "@aws-cdk/aws-ec2.VpnGateway", version: "0.0.0" };
exports.VpnGateway = VpnGateway;
/**
 * Base class for Vpn connections.
 */
class VpnConnectionBase extends core_1.Resource {
}
_b = JSII_RTTI_SYMBOL_1;
VpnConnectionBase[_b] = { fqn: "@aws-cdk/aws-ec2.VpnConnectionBase", version: "0.0.0" };
exports.VpnConnectionBase = VpnConnectionBase;
/**
 * Define a VPN Connection
 *
 * @resource AWS::EC2::VPNConnection
 */
class VpnConnection extends VpnConnectionBase {
    /**
     * Import a VPN connection by supplying all attributes directly
     */
    static fromVpnConnectionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpnConnectionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromVpnConnectionAttributes);
            }
            throw error;
        }
        class Import extends VpnConnectionBase {
            constructor() {
                super(...arguments);
                this.vpnId = attrs.vpnId;
                this.customerGatewayId = attrs.customerGatewayId;
                this.customerGatewayIp = attrs.customerGatewayIp;
                this.customerGatewayAsn = attrs.customerGatewayAsn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Return the given named metric for all VPN connections in the account/region.
     */
    static metricAll(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/VPN',
            metricName,
            ...props,
        });
    }
    /**
     * Metric for the tunnel state of all VPN connections in the account/region.
     *
     * @default average over 5 minutes
     */
    static metricAllTunnelState(props) {
        return this.metricAll('TunnelState', { statistic: 'avg', ...props });
    }
    /**
     * Metric for the tunnel data in of all VPN connections in the account/region.
     *
     * @default sum over 5 minutes
     */
    static metricAllTunnelDataIn(props) {
        return this.metricAll('TunnelDataIn', { statistic: 'sum', ...props });
    }
    /**
     * Metric for the tunnel data out of all VPN connections.
     *
     * @default sum over 5 minutes
     */
    static metricAllTunnelDataOut(props) {
        return this.metricAll('TunnelDataOut', { statistic: 'sum', ...props });
    }
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VpnConnectionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, VpnConnection);
            }
            throw error;
        }
        if (!props.vpc.vpnGatewayId) {
            props.vpc.enableVpnGateway({
                type: 'ipsec.1',
                amazonSideAsn: props.asn,
            });
        }
        if (!core_1.Token.isUnresolved(props.ip) && !net.isIPv4(props.ip)) {
            throw new Error(`The \`ip\` ${props.ip} is not a valid IPv4 address.`);
        }
        const type = VpnConnectionType.IPSEC_1;
        const bgpAsn = props.asn || 65000;
        const customerGateway = new ec2_generated_1.CfnCustomerGateway(this, 'CustomerGateway', {
            bgpAsn,
            ipAddress: props.ip,
            type,
        });
        this.customerGatewayId = customerGateway.ref;
        this.customerGatewayAsn = bgpAsn;
        this.customerGatewayIp = props.ip;
        // Validate tunnel options
        if (props.tunnelOptions) {
            if (props.tunnelOptions.length > 2) {
                throw new Error('Cannot specify more than two `tunnelOptions`');
            }
            if (props.tunnelOptions.length === 2 && props.tunnelOptions[0].tunnelInsideCidr === props.tunnelOptions[1].tunnelInsideCidr) {
                throw new Error(`Same ${props.tunnelOptions[0].tunnelInsideCidr} \`tunnelInsideCidr\` cannot be used for both tunnels.`);
            }
            props.tunnelOptions.forEach((options, index) => {
                if (options.preSharedKey && options.preSharedKeySecret) {
                    throw new Error("Specify at most one of 'preSharedKey' and 'preSharedKeySecret'.");
                }
                if (options.preSharedKey && !core_1.Token.isUnresolved(options.preSharedKey) && !/^[a-zA-Z1-9._][a-zA-Z\d._]{7,63}$/.test(options.preSharedKey)) {
                    /* eslint-disable max-len */
                    throw new Error(`The \`preSharedKey\` ${options.preSharedKey} for tunnel ${index + 1} is invalid. Allowed characters are alphanumeric characters and ._. Must be between 8 and 64 characters in length and cannot start with zero (0).`);
                    /* eslint-enable max-len */
                }
                if (options.tunnelInsideCidr) {
                    if (exports.RESERVED_TUNNEL_INSIDE_CIDR.includes(options.tunnelInsideCidr)) {
                        throw new Error(`The \`tunnelInsideCidr\` ${options.tunnelInsideCidr} for tunnel ${index + 1} is a reserved inside CIDR.`);
                    }
                    if (!/^169\.254\.\d{1,3}\.\d{1,3}\/30$/.test(options.tunnelInsideCidr)) {
                        /* eslint-disable-next-line max-len */
                        throw new Error(`The \`tunnelInsideCidr\` ${options.tunnelInsideCidr} for tunnel ${index + 1} is not a size /30 CIDR block from the 169.254.0.0/16 range.`);
                    }
                }
            });
        }
        const vpnConnection = new ec2_generated_1.CfnVPNConnection(this, 'Resource', {
            type,
            customerGatewayId: customerGateway.ref,
            staticRoutesOnly: props.staticRoutes ? true : false,
            vpnGatewayId: props.vpc.vpnGatewayId,
            vpnTunnelOptionsSpecifications: props.tunnelOptions?.map(t => ({
                preSharedKey: t.preSharedKeySecret?.unsafeUnwrap() ?? t.preSharedKey,
                tunnelInsideCidr: t.tunnelInsideCidr,
            })),
        });
        this.vpnId = vpnConnection.ref;
        if (props.staticRoutes) {
            props.staticRoutes.forEach(route => {
                new ec2_generated_1.CfnVPNConnectionRoute(this, `Route${route.replace(/[^\d]/g, '')}`, {
                    destinationCidrBlock: route,
                    vpnConnectionId: this.vpnId,
                });
            });
        }
    }
}
_c = JSII_RTTI_SYMBOL_1;
VpnConnection[_c] = { fqn: "@aws-cdk/aws-ec2.VpnConnection", version: "0.0.0" };
exports.VpnConnection = VpnConnection;
exports.RESERVED_TUNNEL_INSIDE_CIDR = [
    '169.254.0.0/30',
    '169.254.1.0/30',
    '169.254.2.0/30',
    '169.254.3.0/30',
    '169.254.4.0/30',
    '169.254.5.0/30',
    '169.254.169.252/30',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUEyQjtBQUMzQixzREFBc0Q7QUFDdEQsd0NBQXdFO0FBRXhFLG1EQUt5QjtBQXFJekI7O0dBRUc7QUFDSCxJQUFZLGlCQVdYO0FBWEQsV0FBWSxpQkFBaUI7SUFDM0I7O09BRUc7SUFDSCx3Q0FBbUIsQ0FBQTtJQUVuQjs7O09BR0c7SUFDSCxvQ0FBZSxDQUFBO0FBQ2pCLENBQUMsRUFYVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQVc1QjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFhLFVBQVcsU0FBUSxlQUFRO0lBT3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVJSLFVBQVU7Ozs7UUFVbkIsaUZBQWlGO1FBQ2pGLHNGQUFzRjtRQUN0RiwwRUFBMEU7UUFDMUUsTUFBTSxLQUFLLEdBQUcsSUFBSSw2QkFBYSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0tBQzVCOzs7O0FBZlUsZ0NBQVU7QUE2Q3ZCOztHQUVHO0FBQ0gsTUFBc0IsaUJBQWtCLFNBQVEsZUFBUTs7OztBQUFsQyw4Q0FBaUI7QUFTdkM7Ozs7R0FJRztBQUNILE1BQWEsYUFBYyxTQUFRLGlCQUFpQjtJQUVsRDs7T0FFRztJQUNJLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4Qjs7Ozs7Ozs7OztRQUVwRyxNQUFNLE1BQU8sU0FBUSxpQkFBaUI7WUFBdEM7O2dCQUVrQixVQUFLLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsc0JBQWlCLEdBQVcsS0FBSyxDQUFDLGlCQUFpQixD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b0JBQW9CO0NBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgU2VjcmV0VmFsdWUsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7XG4gIENmbkN1c3RvbWVyR2F0ZXdheSxcbiAgQ2ZuVlBOQ29ubmVjdGlvbixcbiAgQ2ZuVlBOQ29ubmVjdGlvblJvdXRlLFxuICBDZm5WUE5HYXRld2F5LFxufSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVZwYywgU3VibmV0U2VsZWN0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElWcG5Db25uZWN0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgVlBOIGNvbm5lY3Rpb24uXG4gICAqIEBhdHRyaWJ1dGUgVnBuQ29ubmVjdGlvbklkXG4gICAqL1xuICByZWFkb25seSB2cG5JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIGN1c3RvbWVyIGdhdGV3YXkuXG4gICAqL1xuICByZWFkb25seSBjdXN0b21lckdhdGV3YXlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaXAgYWRkcmVzcyBvZiB0aGUgY3VzdG9tZXIgZ2F0ZXdheS5cbiAgICovXG4gIHJlYWRvbmx5IGN1c3RvbWVyR2F0ZXdheUlwOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBU04gb2YgdGhlIGN1c3RvbWVyIGdhdGV3YXkuXG4gICAqL1xuICByZWFkb25seSBjdXN0b21lckdhdGV3YXlBc246IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgdmlydHVhbCBwcml2YXRlIGdhdGV3YXkgaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVZwbkdhdGV3YXkgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuXG4gIC8qKlxuICAgKiBUaGUgdmlydHVhbCBwcml2YXRlIGdhdGV3YXkgSWRcbiAgICovXG4gIHJlYWRvbmx5IGdhdGV3YXlJZDogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBuVHVubmVsT3B0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBwcmUtc2hhcmVkIGtleSAoUFNLKSB0byBlc3RhYmxpc2ggaW5pdGlhbCBhdXRoZW50aWNhdGlvbiBiZXR3ZWVuIHRoZVxuICAgKiB2aXJ0dWFsIHByaXZhdGUgZ2F0ZXdheSBhbmQgY3VzdG9tZXIgZ2F0ZXdheS4gQWxsb3dlZCBjaGFyYWN0ZXJzIGFyZVxuICAgKiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBwZXJpb2QgYC5gIGFuZCB1bmRlcnNjb3JlcyBgX2AuIE11c3QgYmUgYmV0d2VlbiA4XG4gICAqIGFuZCA2NCBjaGFyYWN0ZXJzIGluIGxlbmd0aCBhbmQgY2Fubm90IHN0YXJ0IHdpdGggemVybyAoMCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IGFuIEFtYXpvbiBnZW5lcmF0ZWQgcHJlLXNoYXJlZCBrZXlcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBwcmVTaGFyZWRLZXlTZWNyZXRgIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHByZVNoYXJlZEtleT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHByZS1zaGFyZWQga2V5IChQU0spIHRvIGVzdGFibGlzaCBpbml0aWFsIGF1dGhlbnRpY2F0aW9uIGJldHdlZW4gdGhlXG4gICAqIHZpcnR1YWwgcHJpdmF0ZSBnYXRld2F5IGFuZCBjdXN0b21lciBnYXRld2F5LiBBbGxvd2VkIGNoYXJhY3RlcnMgYXJlXG4gICAqIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIHBlcmlvZCBgLmAgYW5kIHVuZGVyc2NvcmVzIGBfYC4gTXVzdCBiZSBiZXR3ZWVuIDhcbiAgICogYW5kIDY0IGNoYXJhY3RlcnMgaW4gbGVuZ3RoIGFuZCBjYW5ub3Qgc3RhcnQgd2l0aCB6ZXJvICgwKS5cbiAgICpcbiAgICogQGRlZmF1bHQgYW4gQW1hem9uIGdlbmVyYXRlZCBwcmUtc2hhcmVkIGtleVxuICAgKi9cbiAgcmVhZG9ubHkgcHJlU2hhcmVkS2V5U2VjcmV0PzogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIFRoZSByYW5nZSBvZiBpbnNpZGUgSVAgYWRkcmVzc2VzIGZvciB0aGUgdHVubmVsLiBBbnkgc3BlY2lmaWVkIENJRFIgYmxvY2tzIG11c3QgYmVcbiAgICogdW5pcXVlIGFjcm9zcyBhbGwgVlBOIGNvbm5lY3Rpb25zIHRoYXQgdXNlIHRoZSBzYW1lIHZpcnR1YWwgcHJpdmF0ZSBnYXRld2F5LlxuICAgKiBBIHNpemUgLzMwIENJRFIgYmxvY2sgZnJvbSB0aGUgMTY5LjI1NC4wLjAvMTYgcmFuZ2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IGFuIEFtYXpvbiBnZW5lcmF0ZWQgaW5zaWRlIElQIENJRFJcbiAgICovXG4gIHJlYWRvbmx5IHR1bm5lbEluc2lkZUNpZHI/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBuQ29ubmVjdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGlwIGFkZHJlc3Mgb2YgdGhlIGN1c3RvbWVyIGdhdGV3YXkuXG4gICAqL1xuICByZWFkb25seSBpcDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVNOIG9mIHRoZSBjdXN0b21lciBnYXRld2F5LlxuICAgKlxuICAgKiBAZGVmYXVsdCA2NTAwMFxuICAgKi9cbiAgcmVhZG9ubHkgYXNuPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGljIHJvdXRlcyB0byBiZSByb3V0ZWQgZnJvbSB0aGUgVlBOIGdhdGV3YXkgdG8gdGhlIGN1c3RvbWVyIGdhdGV3YXkuXG4gICAqXG4gICAqIEBkZWZhdWx0IER5bmFtaWMgcm91dGluZyAoQkdQKVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGljUm91dGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSB0dW5uZWwgb3B0aW9ucyBmb3IgdGhlIFZQTiBjb25uZWN0aW9uLiBBdCBtb3N0IHR3byBlbGVtZW50cyAob25lIHBlciB0dW5uZWwpLlxuICAgKiBEdXBsaWNhdGVzIG5vdCBhbGxvd2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBbWF6b24gZ2VuZXJhdGVkIHR1bm5lbCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSB0dW5uZWxPcHRpb25zPzogVnBuVHVubmVsT3B0aW9uW107XG59XG5cbi8qKlxuICogVGhlIFZwbkdhdGV3YXkgUHJvcGVydGllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFZwbkdhdGV3YXlQcm9wcyB7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdHlwZSBpcHNlYy4xXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4cGxpY2l0bHkgc3BlY2lmeSBhbiBBc24gb3IgbGV0IGF3cyBwaWNrIGFuIEFzbiBmb3IgeW91LlxuICAgKiBAZGVmYXVsdCA2NTAwMFxuICAgKi9cbiAgcmVhZG9ubHkgYW1hem9uU2lkZUFzbj86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgVnBjLmVuYWJsZVZwbkdhdGV3YXkoKSBtZXRob2RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbmFibGVWcG5HYXRld2F5T3B0aW9ucyBleHRlbmRzIFZwbkdhdGV3YXlQcm9wcyB7XG4gIC8qKlxuICAgKiBQcm92aWRlIGFuIGFycmF5IG9mIHN1Ym5ldHMgd2hlcmUgdGhlIHJvdXRlIHByb3BhZ2F0aW9uIHNob3VsZCBiZSBhZGRlZC5cbiAgICogQGRlZmF1bHQgbm9Qcm9wYWdhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgdnBuUm91dGVQcm9wYWdhdGlvbj86IFN1Ym5ldFNlbGVjdGlvbltdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBuQ29ubmVjdGlvblByb3BzIGV4dGVuZHMgVnBuQ29ubmVjdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIFZQQyB0byBjb25uZWN0IHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBJVnBjO1xufVxuXG4vKipcbiAqIFRoZSBWUE4gY29ubmVjdGlvbiB0eXBlLlxuICovXG5leHBvcnQgZW51bSBWcG5Db25uZWN0aW9uVHlwZSB7XG4gIC8qKlxuICAgKiBUaGUgSVBzZWMgMSBWUE4gY29ubmVjdGlvbiB0eXBlLlxuICAgKi9cbiAgSVBTRUNfMSA9ICdpcHNlYy4xJyxcblxuICAvKipcbiAgICogRHVtbXkgbWVtYmVyXG4gICAqIFRPRE86IHJlbW92ZSBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMjMxIGlzIGZpeGVkXG4gICAqL1xuICBEVU1NWSA9ICdkdW1teSdcbn1cblxuLyoqXG4gKiBUaGUgVlBOIEdhdGV3YXkgdGhhdCBzaGFsbCBiZSBhZGRlZCB0byB0aGUgVlBDXG4gKlxuICogQHJlc291cmNlIEFXUzo6RUMyOjpWUE5HYXRld2F5XG4gKi9cbmV4cG9ydCBjbGFzcyBWcG5HYXRld2F5IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVnBuR2F0ZXdheSB7XG5cbiAgLyoqXG4gICAqIFRoZSB2aXJ0dWFsIHByaXZhdGUgZ2F0ZXdheSBJZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGdhdGV3YXlJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBWcG5HYXRld2F5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gVGhpcyBpcyAnRGVmYXVsdCcgaW5zdGVhZCBvZiAnUmVzb3VyY2UnLCBiZWNhdXNlIHVzaW5nICdEZWZhdWx0JyB3aWxsIGdlbmVyYXRlXG4gICAgLy8gYSBsb2dpY2FsIElEIGZvciBhIFZwbkdhdGV3YXkgd2hpY2ggaXMgZXhhY3RseSB0aGUgc2FtZSBhcyB0aGUgbG9naWNhbCBJRCB0aGF0IHVzZWRcbiAgICAvLyB0byBiZSBjcmVhdGVkIGZvciB0aGUgQ2ZuVlBOR2F0ZXdheSAoYW5kICdSZXNvdXJjZScgd291bGQgbm90IGRvIHRoYXQpLlxuICAgIGNvbnN0IHZwbkdXID0gbmV3IENmblZQTkdhdGV3YXkodGhpcywgJ0RlZmF1bHQnLCBwcm9wcyk7XG4gICAgdGhpcy5nYXRld2F5SWQgPSB2cG5HVy5yZWY7XG4gIH1cbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIG9mIGFuIGltcG9ydGVkIFZwbkNvbm5lY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVnBuQ29ubmVjdGlvbkF0dHJpYnV0ZXMge1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIFZQTiBjb25uZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBuSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkIG9mIHRoZSBjdXN0b21lciBnYXRld2F5LlxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tZXJHYXRld2F5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlwIGFkZHJlc3Mgb2YgdGhlIGN1c3RvbWVyIGdhdGV3YXkuXG4gICAqL1xuICByZWFkb25seSBjdXN0b21lckdhdGV3YXlJcDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVNOIG9mIHRoZSBjdXN0b21lciBnYXRld2F5LlxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tZXJHYXRld2F5QXNuOiBudW1iZXI7XG5cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBWcG4gY29ubmVjdGlvbnMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWcG5Db25uZWN0aW9uQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVZwbkNvbm5lY3Rpb24ge1xuXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB2cG5JZDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY3VzdG9tZXJHYXRld2F5SWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGN1c3RvbWVyR2F0ZXdheUlwOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjdXN0b21lckdhdGV3YXlBc246IG51bWJlcjtcblxufVxuXG4vKipcbiAqIERlZmluZSBhIFZQTiBDb25uZWN0aW9uXG4gKlxuICogQHJlc291cmNlIEFXUzo6RUMyOjpWUE5Db25uZWN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBWcG5Db25uZWN0aW9uIGV4dGVuZHMgVnBuQ29ubmVjdGlvbkJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBWUE4gY29ubmVjdGlvbiBieSBzdXBwbHlpbmcgYWxsIGF0dHJpYnV0ZXMgZGlyZWN0bHlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVZwbkNvbm5lY3Rpb25BdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBWcG5Db25uZWN0aW9uQXR0cmlidXRlcyk6IElWcG5Db25uZWN0aW9uIHtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFZwbkNvbm5lY3Rpb25CYXNlIHtcblxuICAgICAgcHVibGljIHJlYWRvbmx5IHZwbklkOiBzdHJpbmcgPSBhdHRycy52cG5JZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjdXN0b21lckdhdGV3YXlJZDogc3RyaW5nID0gYXR0cnMuY3VzdG9tZXJHYXRld2F5SWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY3VzdG9tZXJHYXRld2F5SXA6IHN0cmluZyA9IGF0dHJzLmN1c3RvbWVyR2F0ZXdheUlwO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGN1c3RvbWVyR2F0ZXdheUFzbjogbnVtYmVyID0gYXR0cnMuY3VzdG9tZXJHYXRld2F5QXNuO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciBhbGwgVlBOIGNvbm5lY3Rpb25zIGluIHRoZSBhY2NvdW50L3JlZ2lvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvVlBOJyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSB0dW5uZWwgc3RhdGUgb2YgYWxsIFZQTiBjb25uZWN0aW9ucyBpbiB0aGUgYWNjb3VudC9yZWdpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsVHVubmVsU3RhdGUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljQWxsKCdUdW5uZWxTdGF0ZScsIHsgc3RhdGlzdGljOiAnYXZnJywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgdHVubmVsIGRhdGEgaW4gb2YgYWxsIFZQTiBjb25uZWN0aW9ucyBpbiB0aGUgYWNjb3VudC9yZWdpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZXRyaWNBbGxUdW5uZWxEYXRhSW4ocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljQWxsKCdUdW5uZWxEYXRhSW4nLCB7IHN0YXRpc3RpYzogJ3N1bScsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIHR1bm5lbCBkYXRhIG91dCBvZiBhbGwgVlBOIGNvbm5lY3Rpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWV0cmljQWxsVHVubmVsRGF0YU91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNBbGwoJ1R1bm5lbERhdGFPdXQnLCB7IHN0YXRpc3RpYzogJ3N1bScsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHZwbklkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjdXN0b21lckdhdGV3YXlJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgY3VzdG9tZXJHYXRld2F5SXA6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGN1c3RvbWVyR2F0ZXdheUFzbjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBWcG5Db25uZWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKCFwcm9wcy52cGMudnBuR2F0ZXdheUlkKSB7XG4gICAgICBwcm9wcy52cGMuZW5hYmxlVnBuR2F0ZXdheSh7XG4gICAgICAgIHR5cGU6ICdpcHNlYy4xJyxcbiAgICAgICAgYW1hem9uU2lkZUFzbjogcHJvcHMuYXNuLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuaXApICYmICFuZXQuaXNJUHY0KHByb3BzLmlwKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXFxgaXBcXGAgJHtwcm9wcy5pcH0gaXMgbm90IGEgdmFsaWQgSVB2NCBhZGRyZXNzLmApO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSBWcG5Db25uZWN0aW9uVHlwZS5JUFNFQ18xO1xuICAgIGNvbnN0IGJncEFzbiA9IHByb3BzLmFzbiB8fCA2NTAwMDtcblxuICAgIGNvbnN0IGN1c3RvbWVyR2F0ZXdheSA9IG5ldyBDZm5DdXN0b21lckdhdGV3YXkodGhpcywgJ0N1c3RvbWVyR2F0ZXdheScsIHtcbiAgICAgIGJncEFzbixcbiAgICAgIGlwQWRkcmVzczogcHJvcHMuaXAsXG4gICAgICB0eXBlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdXN0b21lckdhdGV3YXlJZCA9IGN1c3RvbWVyR2F0ZXdheS5yZWY7XG4gICAgdGhpcy5jdXN0b21lckdhdGV3YXlBc24gPSBiZ3BBc247XG4gICAgdGhpcy5jdXN0b21lckdhdGV3YXlJcCA9IHByb3BzLmlwO1xuXG4gICAgLy8gVmFsaWRhdGUgdHVubmVsIG9wdGlvbnNcbiAgICBpZiAocHJvcHMudHVubmVsT3B0aW9ucykge1xuICAgICAgaWYgKHByb3BzLnR1bm5lbE9wdGlvbnMubGVuZ3RoID4gMikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IG1vcmUgdGhhbiB0d28gYHR1bm5lbE9wdGlvbnNgJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy50dW5uZWxPcHRpb25zLmxlbmd0aCA9PT0gMiAmJiBwcm9wcy50dW5uZWxPcHRpb25zWzBdLnR1bm5lbEluc2lkZUNpZHIgPT09IHByb3BzLnR1bm5lbE9wdGlvbnNbMV0udHVubmVsSW5zaWRlQ2lkcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNhbWUgJHtwcm9wcy50dW5uZWxPcHRpb25zWzBdLnR1bm5lbEluc2lkZUNpZHJ9IFxcYHR1bm5lbEluc2lkZUNpZHJcXGAgY2Fubm90IGJlIHVzZWQgZm9yIGJvdGggdHVubmVscy5gKTtcbiAgICAgIH1cblxuICAgICAgcHJvcHMudHVubmVsT3B0aW9ucy5mb3JFYWNoKChvcHRpb25zLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAob3B0aW9ucy5wcmVTaGFyZWRLZXkgJiYgb3B0aW9ucy5wcmVTaGFyZWRLZXlTZWNyZXQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTcGVjaWZ5IGF0IG1vc3Qgb25lIG9mICdwcmVTaGFyZWRLZXknIGFuZCAncHJlU2hhcmVkS2V5U2VjcmV0Jy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5wcmVTaGFyZWRLZXkgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChvcHRpb25zLnByZVNoYXJlZEtleSkgJiYgIS9eW2EtekEtWjEtOS5fXVthLXpBLVpcXGQuX117Nyw2M30kLy50ZXN0KG9wdGlvbnMucHJlU2hhcmVkS2V5KSkge1xuICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcXGBwcmVTaGFyZWRLZXlcXGAgJHtvcHRpb25zLnByZVNoYXJlZEtleX0gZm9yIHR1bm5lbCAke2luZGV4ICsgMX0gaXMgaW52YWxpZC4gQWxsb3dlZCBjaGFyYWN0ZXJzIGFyZSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQgLl8uIE11c3QgYmUgYmV0d2VlbiA4IGFuZCA2NCBjaGFyYWN0ZXJzIGluIGxlbmd0aCBhbmQgY2Fubm90IHN0YXJ0IHdpdGggemVybyAoMCkuYCk7XG4gICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy50dW5uZWxJbnNpZGVDaWRyKSB7XG4gICAgICAgICAgaWYgKFJFU0VSVkVEX1RVTk5FTF9JTlNJREVfQ0lEUi5pbmNsdWRlcyhvcHRpb25zLnR1bm5lbEluc2lkZUNpZHIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcXGB0dW5uZWxJbnNpZGVDaWRyXFxgICR7b3B0aW9ucy50dW5uZWxJbnNpZGVDaWRyfSBmb3IgdHVubmVsICR7aW5kZXggKyAxfSBpcyBhIHJlc2VydmVkIGluc2lkZSBDSURSLmApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghL14xNjlcXC4yNTRcXC5cXGR7MSwzfVxcLlxcZHsxLDN9XFwvMzAkLy50ZXN0KG9wdGlvbnMudHVubmVsSW5zaWRlQ2lkcikpIHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuICovXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcXGB0dW5uZWxJbnNpZGVDaWRyXFxgICR7b3B0aW9ucy50dW5uZWxJbnNpZGVDaWRyfSBmb3IgdHVubmVsICR7aW5kZXggKyAxfSBpcyBub3QgYSBzaXplIC8zMCBDSURSIGJsb2NrIGZyb20gdGhlIDE2OS4yNTQuMC4wLzE2IHJhbmdlLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdnBuQ29ubmVjdGlvbiA9IG5ldyBDZm5WUE5Db25uZWN0aW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGUsXG4gICAgICBjdXN0b21lckdhdGV3YXlJZDogY3VzdG9tZXJHYXRld2F5LnJlZixcbiAgICAgIHN0YXRpY1JvdXRlc09ubHk6IHByb3BzLnN0YXRpY1JvdXRlcyA/IHRydWUgOiBmYWxzZSxcbiAgICAgIHZwbkdhdGV3YXlJZDogcHJvcHMudnBjLnZwbkdhdGV3YXlJZCxcbiAgICAgIHZwblR1bm5lbE9wdGlvbnNTcGVjaWZpY2F0aW9uczogcHJvcHMudHVubmVsT3B0aW9ucz8ubWFwKHQgPT4gKHtcbiAgICAgICAgcHJlU2hhcmVkS2V5OiB0LnByZVNoYXJlZEtleVNlY3JldD8udW5zYWZlVW53cmFwKCkgPz8gdC5wcmVTaGFyZWRLZXksXG4gICAgICAgIHR1bm5lbEluc2lkZUNpZHI6IHQudHVubmVsSW5zaWRlQ2lkcixcbiAgICAgIH0pKSxcbiAgICB9KTtcblxuICAgIHRoaXMudnBuSWQgPSB2cG5Db25uZWN0aW9uLnJlZjtcblxuICAgIGlmIChwcm9wcy5zdGF0aWNSb3V0ZXMpIHtcbiAgICAgIHByb3BzLnN0YXRpY1JvdXRlcy5mb3JFYWNoKHJvdXRlID0+IHtcbiAgICAgICAgbmV3IENmblZQTkNvbm5lY3Rpb25Sb3V0ZSh0aGlzLCBgUm91dGUke3JvdXRlLnJlcGxhY2UoL1teXFxkXS9nLCAnJyl9YCwge1xuICAgICAgICAgIGRlc3RpbmF0aW9uQ2lkckJsb2NrOiByb3V0ZSxcbiAgICAgICAgICB2cG5Db25uZWN0aW9uSWQ6IHRoaXMudnBuSWQsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSRVNFUlZFRF9UVU5ORUxfSU5TSURFX0NJRFIgPSBbXG4gICcxNjkuMjU0LjAuMC8zMCcsXG4gICcxNjkuMjU0LjEuMC8zMCcsXG4gICcxNjkuMjU0LjIuMC8zMCcsXG4gICcxNjkuMjU0LjMuMC8zMCcsXG4gICcxNjkuMjU0LjQuMC8zMCcsXG4gICcxNjkuMjU0LjUuMC8zMCcsXG4gICcxNjkuMjU0LjE2OS4yNTIvMzAnLFxuXTtcbiJdfQ==