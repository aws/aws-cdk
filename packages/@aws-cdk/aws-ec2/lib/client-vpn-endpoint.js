"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientVpnEndpoint = exports.ClientVpnUserBasedAuthentication = exports.ClientVpnSessionTimeout = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const logs = require("@aws-cdk/aws-logs");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const client_vpn_authorization_rule_1 = require("./client-vpn-authorization-rule");
const client_vpn_route_1 = require("./client-vpn-route");
const connections_1 = require("./connections");
const ec2_generated_1 = require("./ec2.generated");
const network_util_1 = require("./network-util");
const security_group_1 = require("./security-group");
/**
 * Maximum VPN session duration time
 */
var ClientVpnSessionTimeout;
(function (ClientVpnSessionTimeout) {
    /** 8 hours */
    ClientVpnSessionTimeout[ClientVpnSessionTimeout["EIGHT_HOURS"] = 8] = "EIGHT_HOURS";
    /** 10 hours */
    ClientVpnSessionTimeout[ClientVpnSessionTimeout["TEN_HOURS"] = 10] = "TEN_HOURS";
    /** 12 hours */
    ClientVpnSessionTimeout[ClientVpnSessionTimeout["TWELVE_HOURS"] = 12] = "TWELVE_HOURS";
    /** 24 hours */
    ClientVpnSessionTimeout[ClientVpnSessionTimeout["TWENTY_FOUR_HOURS"] = 24] = "TWENTY_FOUR_HOURS";
})(ClientVpnSessionTimeout = exports.ClientVpnSessionTimeout || (exports.ClientVpnSessionTimeout = {}));
/**
 * User-based authentication for a client VPN endpoint
 */
class ClientVpnUserBasedAuthentication {
    /**
     * Active Directory authentication
     */
    static activeDirectory(directoryId) {
        return new ActiveDirectoryAuthentication(directoryId);
    }
    /** Federated authentication */
    static federated(samlProvider, selfServiceSamlProvider) {
        return new FederatedAuthentication(samlProvider, selfServiceSamlProvider);
    }
}
_a = JSII_RTTI_SYMBOL_1;
ClientVpnUserBasedAuthentication[_a] = { fqn: "@aws-cdk/aws-ec2.ClientVpnUserBasedAuthentication", version: "0.0.0" };
exports.ClientVpnUserBasedAuthentication = ClientVpnUserBasedAuthentication;
/**
 * Active Directory authentication
 */
class ActiveDirectoryAuthentication extends ClientVpnUserBasedAuthentication {
    constructor(directoryId) {
        super();
        this.directoryId = directoryId;
    }
    render() {
        return {
            type: 'directory-service-authentication',
            activeDirectory: { directoryId: this.directoryId },
        };
    }
}
/**
 * Federated authentication
 */
class FederatedAuthentication extends ClientVpnUserBasedAuthentication {
    constructor(samlProvider, selfServiceSamlProvider) {
        super();
        this.samlProvider = samlProvider;
        this.selfServiceSamlProvider = selfServiceSamlProvider;
    }
    render() {
        return {
            type: 'federated-authentication',
            federatedAuthentication: {
                samlProviderArn: this.samlProvider.samlProviderArn,
                selfServiceSamlProviderArn: this.selfServiceSamlProvider?.samlProviderArn,
            },
        };
    }
}
/**
 * A client VPN connnection
 */
class ClientVpnEndpoint extends core_1.Resource {
    /**
     * Import an existing client VPN endpoint
     */
    static fromEndpointAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ClientVpnEndpointAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEndpointAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.endpointId = attrs.endpointId;
                this.connections = new connections_1.Connections({ securityGroups: attrs.securityGroups });
                this.targetNetworksAssociated = new constructs_1.DependencyGroup();
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id);
        this._targetNetworksAssociated = new constructs_1.DependencyGroup();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ClientVpnEndpointProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ClientVpnEndpoint);
            }
            throw error;
        }
        if (!core_1.Token.isUnresolved(props.vpc.vpcCidrBlock)) {
            const clientCidr = new network_util_1.CidrBlock(props.cidr);
            const vpcCidr = new network_util_1.CidrBlock(props.vpc.vpcCidrBlock);
            if (vpcCidr.containsCidr(clientCidr)) {
                throw new Error('The client CIDR cannot overlap with the local CIDR of the VPC');
            }
        }
        if (props.dnsServers && props.dnsServers.length > 2) {
            throw new Error('A client VPN endpoint can have up to two DNS servers');
        }
        if (props.logging == false && (props.logGroup || props.logStream)) {
            throw new Error('Cannot specify `logGroup` or `logStream` when logging is disabled');
        }
        if (props.clientConnectionHandler
            && !core_1.Token.isUnresolved(props.clientConnectionHandler.functionName)
            && !props.clientConnectionHandler.functionName.startsWith('AWSClientVPN-')) {
            throw new Error('The name of the Lambda function must begin with the `AWSClientVPN-` prefix');
        }
        if (props.clientLoginBanner
            && !core_1.Token.isUnresolved(props.clientLoginBanner)
            && props.clientLoginBanner.length > 1400) {
            throw new Error(`The maximum length for the client login banner is 1400, got ${props.clientLoginBanner.length}`);
        }
        const logging = props.logging ?? true;
        const logGroup = logging
            ? props.logGroup ?? new logs.LogGroup(this, 'LogGroup')
            : undefined;
        const securityGroups = props.securityGroups ?? [new security_group_1.SecurityGroup(this, 'SecurityGroup', {
                vpc: props.vpc,
            })];
        this.connections = new connections_1.Connections({ securityGroups });
        const endpoint = new ec2_generated_1.CfnClientVpnEndpoint(this, 'Resource', {
            authenticationOptions: renderAuthenticationOptions(props.clientCertificateArn, props.userBasedAuthentication),
            clientCidrBlock: props.cidr,
            clientConnectOptions: props.clientConnectionHandler
                ? {
                    enabled: true,
                    lambdaFunctionArn: props.clientConnectionHandler.functionArn,
                }
                : undefined,
            connectionLogOptions: {
                enabled: logging,
                cloudwatchLogGroup: logGroup?.logGroupName,
                cloudwatchLogStream: props.logStream?.logStreamName,
            },
            description: props.description,
            dnsServers: props.dnsServers,
            securityGroupIds: securityGroups.map(s => s.securityGroupId),
            selfServicePortal: booleanToEnabledDisabled(props.selfServicePortal),
            serverCertificateArn: props.serverCertificateArn,
            splitTunnel: props.splitTunnel,
            transportProtocol: props.transportProtocol,
            vpcId: props.vpc.vpcId,
            vpnPort: props.port,
            sessionTimeoutHours: props.sessionTimeout,
            clientLoginBannerOptions: props.clientLoginBanner
                ? {
                    enabled: true,
                    bannerText: props.clientLoginBanner,
                }
                : undefined,
        });
        this.endpointId = endpoint.ref;
        if (props.userBasedAuthentication && (props.selfServicePortal ?? true)) {
            // Output self-service portal URL
            new core_1.CfnOutput(this, 'SelfServicePortalUrl', {
                value: `https://self-service.clientvpn.amazonaws.com/endpoints/${this.endpointId}`,
            });
        }
        // Associate subnets
        const subnetIds = props.vpc.selectSubnets(props.vpcSubnets).subnetIds;
        if (core_1.Token.isUnresolved(subnetIds)) {
            throw new Error('Cannot associate subnets when VPC are imported from parameters or exports containing lists of subnet IDs.');
        }
        for (const [idx, subnetId] of Object.entries(subnetIds)) {
            this._targetNetworksAssociated.add(new ec2_generated_1.CfnClientVpnTargetNetworkAssociation(this, `Association${idx}`, {
                clientVpnEndpointId: this.endpointId,
                subnetId,
            }));
        }
        this.targetNetworksAssociated = this._targetNetworksAssociated;
        if (props.authorizeAllUsersToVpcCidr ?? true) {
            this.addAuthorizationRule('AuthorizeAll', {
                cidr: props.vpc.vpcCidrBlock,
            });
        }
    }
    /**
     * Adds an authorization rule to this endpoint
     */
    addAuthorizationRule(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ClientVpnAuthorizationRuleOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAuthorizationRule);
            }
            throw error;
        }
        return new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(this, id, {
            ...props,
            clientVpnEndpoint: this,
        });
    }
    /**
     * Adds a route to this endpoint
     */
    addRoute(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ClientVpnRouteOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRoute);
            }
            throw error;
        }
        return new client_vpn_route_1.ClientVpnRoute(this, id, {
            ...props,
            clientVpnEndpoint: this,
        });
    }
}
_b = JSII_RTTI_SYMBOL_1;
ClientVpnEndpoint[_b] = { fqn: "@aws-cdk/aws-ec2.ClientVpnEndpoint", version: "0.0.0" };
exports.ClientVpnEndpoint = ClientVpnEndpoint;
function renderAuthenticationOptions(clientCertificateArn, userBasedAuthentication) {
    const authenticationOptions = [];
    if (clientCertificateArn) {
        authenticationOptions.push({
            type: 'certificate-authentication',
            mutualAuthentication: {
                clientRootCertificateChainArn: clientCertificateArn,
            },
        });
    }
    if (userBasedAuthentication) {
        authenticationOptions.push(userBasedAuthentication.render());
    }
    if (authenticationOptions.length === 0) {
        throw new Error('A client VPN endpoint must use at least one authentication option');
    }
    return authenticationOptions;
}
function booleanToEnabledDisabled(val) {
    switch (val) {
        case undefined:
            return undefined;
        case true:
            return 'enabled';
        case false:
            return 'disabled';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaWVudC12cG4tZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsMENBQTBDO0FBQzFDLHdDQUEyRDtBQUMzRCwyQ0FBcUU7QUFDckUsbUZBQWdIO0FBRWhILHlEQUEyRTtBQUMzRSwrQ0FBNEM7QUFDNUMsbURBQTZGO0FBQzdGLGlEQUEyQztBQUMzQyxxREFBaUU7QUFpS2pFOztHQUVHO0FBQ0gsSUFBWSx1QkFTWDtBQVRELFdBQVksdUJBQXVCO0lBQ2pDLGNBQWM7SUFDZCxtRkFBZSxDQUFBO0lBQ2YsZUFBZTtJQUNmLGdGQUFjLENBQUE7SUFDZCxlQUFlO0lBQ2Ysc0ZBQWlCLENBQUE7SUFDakIsZUFBZTtJQUNmLGdHQUFzQixDQUFBO0FBQ3hCLENBQUMsRUFUVyx1QkFBdUIsR0FBdkIsK0JBQXVCLEtBQXZCLCtCQUF1QixRQVNsQztBQUVEOztHQUVHO0FBQ0gsTUFBc0IsZ0NBQWdDO0lBQ3BEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFtQjtRQUMvQyxPQUFPLElBQUksNkJBQTZCLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDdkQ7SUFFRCwrQkFBK0I7SUFDeEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUEyQixFQUFFLHVCQUF1QztRQUMxRixPQUFPLElBQUksdUJBQXVCLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7S0FDM0U7Ozs7QUFYbUIsNEVBQWdDO0FBaUJ0RDs7R0FFRztBQUNILE1BQU0sNkJBQThCLFNBQVEsZ0NBQWdDO0lBQzFFLFlBQTZCLFdBQW1CO1FBQzlDLEtBQUssRUFBRSxDQUFDO1FBRG1CLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0tBRS9DO0lBRUQsTUFBTTtRQUNKLE9BQU87WUFDTCxJQUFJLEVBQUUsa0NBQWtDO1lBQ3hDLGVBQWUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLENB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QztJQUU3RixJQUFJLG9CQUFvQixFQUFFO1FBQ3hCLHFCQUFxQixDQUFDLElBQUksQ0FBQztZQUN6QixJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLG9CQUFvQixFQUFFO2dCQUNwQiw2QkFBNkIsRUFBRSxvQkFBb0I7YUFDcEQ7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVELElBQUksdUJBQXVCLEVBQUU7UUFDM0IscUJBQXFCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUFFRCxJQUFJLHFCQUFxQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO0tBQ3RGO0lBQ0QsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDO0FBRUQsU0FBUyx3QkFBd0IsQ0FBQyxHQUFhO0lBQzdDLFFBQVEsR0FBRyxFQUFFO1FBQ1gsS0FBSyxTQUFTO1lBQ1osT0FBTyxTQUFTLENBQUM7UUFDbkIsS0FBSyxJQUFJO1lBQ1AsT0FBTyxTQUFTLENBQUM7UUFDbkIsS0FBSyxLQUFLO1lBQ1IsT0FBTyxVQUFVLENBQUM7S0FDckI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVNhbWxQcm92aWRlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgeyBDZm5PdXRwdXQsIFJlc291cmNlLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBEZXBlbmRlbmN5R3JvdXAsIElEZXBlbmRhYmxlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZSwgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGVPcHRpb25zIH0gZnJvbSAnLi9jbGllbnQtdnBuLWF1dGhvcml6YXRpb24tcnVsZSc7XG5pbXBvcnQgeyBJQ2xpZW50VnBuQ29ubmVjdGlvbkhhbmRsZXIsIElDbGllbnRWcG5FbmRwb2ludCwgVHJhbnNwb3J0UHJvdG9jb2wsIFZwblBvcnQgfSBmcm9tICcuL2NsaWVudC12cG4tZW5kcG9pbnQtdHlwZXMnO1xuaW1wb3J0IHsgQ2xpZW50VnBuUm91dGUsIENsaWVudFZwblJvdXRlT3B0aW9ucyB9IGZyb20gJy4vY2xpZW50LXZwbi1yb3V0ZSc7XG5pbXBvcnQgeyBDb25uZWN0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbnMnO1xuaW1wb3J0IHsgQ2ZuQ2xpZW50VnBuRW5kcG9pbnQsIENmbkNsaWVudFZwblRhcmdldE5ldHdvcmtBc3NvY2lhdGlvbiB9IGZyb20gJy4vZWMyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBDaWRyQmxvY2sgfSBmcm9tICcuL25ldHdvcmstdXRpbCc7XG5pbXBvcnQgeyBJU2VjdXJpdHlHcm91cCwgU2VjdXJpdHlHcm91cCB9IGZyb20gJy4vc2VjdXJpdHktZ3JvdXAnO1xuaW1wb3J0IHsgSVZwYywgU3VibmV0U2VsZWN0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGEgY2xpZW50IFZQTiBlbmRwb2ludFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFZwbkVuZHBvaW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgSVB2NCBhZGRyZXNzIHJhbmdlLCBpbiBDSURSIG5vdGF0aW9uLCBmcm9tIHdoaWNoIHRvIGFzc2lnbiBjbGllbnQgSVBcbiAgICogYWRkcmVzc2VzLiBUaGUgYWRkcmVzcyByYW5nZSBjYW5ub3Qgb3ZlcmxhcCB3aXRoIHRoZSBsb2NhbCBDSURSIG9mIHRoZSBWUENcbiAgICogaW4gd2hpY2ggdGhlIGFzc29jaWF0ZWQgc3VibmV0IGlzIGxvY2F0ZWQsIG9yIHRoZSByb3V0ZXMgdGhhdCB5b3UgYWRkIG1hbnVhbGx5LlxuICAgKlxuICAgKiBDaGFuZ2luZyB0aGUgYWRkcmVzcyByYW5nZSB3aWxsIHJlcGxhY2UgdGhlIENsaWVudCBWUE4gZW5kcG9pbnQuXG4gICAqXG4gICAqIFRoZSBDSURSIGJsb2NrIHNob3VsZCBiZSAvMjIgb3IgZ3JlYXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGNpZHI6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgY2xpZW50IGNlcnRpZmljYXRlIGZvciBtdXR1YWwgYXV0aGVudGljYXRpb24uXG4gICAqXG4gICAqIFRoZSBjZXJ0aWZpY2F0ZSBtdXN0IGJlIHNpZ25lZCBieSBhIGNlcnRpZmljYXRlIGF1dGhvcml0eSAoQ0EpIGFuZCBpdCBtdXN0XG4gICAqIGJlIHByb3Zpc2lvbmVkIGluIEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyIChBQ00pLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVzZSB1c2VyLWJhc2VkIGF1dGhlbnRpY2F0aW9uXG4gICAqL1xuICByZWFkb25seSBjbGllbnRDZXJ0aWZpY2F0ZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdXNlci1iYXNlZCBhdXRoZW50aWNhdGlvbiB0byB1c2UuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Zwbi9sYXRlc3QvY2xpZW50dnBuLWFkbWluL2NsaWVudC1hdXRoZW50aWNhdGlvbi5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdXNlIG11dHVhbCBhdXRoZW50aWNhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckJhc2VkQXV0aGVudGljYXRpb24/OiBDbGllbnRWcG5Vc2VyQmFzZWRBdXRoZW50aWNhdGlvbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbmFibGUgY29ubmVjdGlvbnMgbG9nZ2luZ1xuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBsb2dnaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBDbG91ZFdhdGNoIExvZ3MgbG9nIGdyb3VwIGZvciBjb25uZWN0aW9uIGxvZ2dpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyBncm91cCBpcyBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cD86IGxvZ3MuSUxvZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBBIENsb3VkV2F0Y2ggTG9ncyBsb2cgc3RyZWFtIGZvciBjb25uZWN0aW9uIGxvZ2dpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyBzdHJlYW0gaXMgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgbG9nU3RyZWFtPzogbG9ncy5JTG9nU3RyZWFtO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIExhbWJkYSBmdW5jdGlvbiB1c2VkIGZvciBjb25uZWN0aW9uIGF1dGhvcml6YXRpb25cbiAgICpcbiAgICogVGhlIG5hbWUgb2YgdGhlIExhbWJkYSBmdW5jdGlvbiBtdXN0IGJlZ2luIHdpdGggdGhlIGBBV1NDbGllbnRWUE4tYCBwcmVmaXhcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjb25uZWN0aW9uIGhhbmRsZXJcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudENvbm5lY3Rpb25IYW5kbGVyPzogSUNsaWVudFZwbkNvbm5lY3Rpb25IYW5kbGVyO1xuXG4gIC8qKlxuICAgKiBBIGJyaWVmIGRlc2NyaXB0aW9uIG9mIHRoZSBDbGllbnQgVlBOIGVuZHBvaW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGRlc2NyaXB0aW9uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwcyB0byBhcHBseSB0byB0aGUgdGFyZ2V0IG5ldHdvcmsuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgc2VjdXJpdHkgZ3JvdXAgaXMgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBJU2VjdXJpdHlHcm91cFtdO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHdoZXRoZXIgdG8gZW5hYmxlIHRoZSBzZWxmLXNlcnZpY2UgcG9ydGFsIGZvciB0aGUgQ2xpZW50IFZQTiBlbmRwb2ludC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VsZlNlcnZpY2VQb3J0YWw/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBzZXJ2ZXIgY2VydGlmaWNhdGVcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZlckNlcnRpZmljYXRlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHNwbGl0LXR1bm5lbCBpcyBlbmFibGVkIG9uIHRoZSBBV1MgQ2xpZW50IFZQTiBlbmRwb2ludC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vdnBuL2xhdGVzdC9jbGllbnR2cG4tYWRtaW4vc3BsaXQtdHVubmVsLXZwbi5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzcGxpdFR1bm5lbD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB0cmFuc3BvcnQgcHJvdG9jb2wgdG8gYmUgdXNlZCBieSB0aGUgVlBOIHNlc3Npb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFRyYW5zcG9ydFByb3RvY29sLlVEUFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNwb3J0UHJvdG9jb2w/OiBUcmFuc3BvcnRQcm90b2NvbDtcblxuICAvKipcbiAgICogVGhlIHBvcnQgbnVtYmVyIHRvIGFzc2lnbiB0byB0aGUgQ2xpZW50IFZQTiBlbmRwb2ludCBmb3IgVENQIGFuZCBVRFBcbiAgICogdHJhZmZpYy5cbiAgICpcbiAgICogQGRlZmF1bHQgVnBuUG9ydC5IVFRQU1xuICAgKi9cbiAgcmVhZG9ubHkgcG9ydD86IFZwblBvcnQ7XG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBETlMgc2VydmVycyB0byBiZSB1c2VkIGZvciBETlMgcmVzb2x1dGlvbi5cbiAgICpcbiAgICogQSBDbGllbnQgVlBOIGVuZHBvaW50IGNhbiBoYXZlIHVwIHRvIHR3byBETlMgc2VydmVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1c2UgdGhlIEROUyBhZGRyZXNzIGNvbmZpZ3VyZWQgb24gdGhlIGRldmljZVxuICAgKi9cbiAgcmVhZG9ubHkgZG5zU2VydmVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBTdWJuZXRzIHRvIGFzc29jaWF0ZSB0byB0aGUgY2xpZW50IFZQTiBlbmRwb2ludC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgVlBDIGRlZmF1bHQgc3RyYXRlZ3lcbiAgICovXG4gIHJlYWRvbmx5IHZwY1N1Ym5ldHM/OiBTdWJuZXRTZWxlY3Rpb247XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXV0aG9yaXplIGFsbCB1c2VycyB0byB0aGUgVlBDIENJRFJcbiAgICpcbiAgICogVGhpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZXMgYW4gYXV0aG9yaXphdGlvbiBydWxlLiBTZXQgdGhpcyB0byBgZmFsc2VgIGFuZFxuICAgKiB1c2UgYGFkZEF1dGhvcml6YXRpb25SdWxlKClgIHRvIGNyZWF0ZSB5b3VyIG93biBydWxlcyBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVBbGxVc2Vyc1RvVnBjQ2lkcj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIFZQTiBzZXNzaW9uIGR1cmF0aW9uIHRpbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsaWVudFZwblNlc3Npb25UaW1lb3V0LlRXRU5UWV9GT1VSX0hPVVJTXG4gICAqL1xuICByZWFkb25seSBzZXNzaW9uVGltZW91dD86IENsaWVudFZwblNlc3Npb25UaW1lb3V0O1xuXG4gIC8qKlxuICAgKiBDdXN0b21pemFibGUgdGV4dCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIGluIGEgYmFubmVyIG9uIEFXUyBwcm92aWRlZCBjbGllbnRzXG4gICAqIHdoZW4gYSBWUE4gc2Vzc2lvbiBpcyBlc3RhYmxpc2hlZC5cbiAgICpcbiAgICogVVRGLTggZW5jb2RlZCBjaGFyYWN0ZXJzIG9ubHkuIE1heGltdW0gb2YgMTQwMCBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGJhbm5lciBpcyBwcmVzZW50ZWQgdG8gdGhlIGNsaWVudFxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50TG9naW5CYW5uZXI/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogTWF4aW11bSBWUE4gc2Vzc2lvbiBkdXJhdGlvbiB0aW1lXG4gKi9cbmV4cG9ydCBlbnVtIENsaWVudFZwblNlc3Npb25UaW1lb3V0IHtcbiAgLyoqIDggaG91cnMgKi9cbiAgRUlHSFRfSE9VUlMgPSA4LFxuICAvKiogMTAgaG91cnMgKi9cbiAgVEVOX0hPVVJTID0gMTAsXG4gIC8qKiAxMiBob3VycyAqL1xuICBUV0VMVkVfSE9VUlMgPSAxMixcbiAgLyoqIDI0IGhvdXJzICovXG4gIFRXRU5UWV9GT1VSX0hPVVJTID0gMjQsXG59XG5cbi8qKlxuICogVXNlci1iYXNlZCBhdXRoZW50aWNhdGlvbiBmb3IgYSBjbGllbnQgVlBOIGVuZHBvaW50XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDbGllbnRWcG5Vc2VyQmFzZWRBdXRoZW50aWNhdGlvbiB7XG4gIC8qKlxuICAgKiBBY3RpdmUgRGlyZWN0b3J5IGF1dGhlbnRpY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFjdGl2ZURpcmVjdG9yeShkaXJlY3RvcnlJZDogc3RyaW5nKTogQ2xpZW50VnBuVXNlckJhc2VkQXV0aGVudGljYXRpb24ge1xuICAgIHJldHVybiBuZXcgQWN0aXZlRGlyZWN0b3J5QXV0aGVudGljYXRpb24oZGlyZWN0b3J5SWQpO1xuICB9XG5cbiAgLyoqIEZlZGVyYXRlZCBhdXRoZW50aWNhdGlvbiAqL1xuICBwdWJsaWMgc3RhdGljIGZlZGVyYXRlZChzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIHNlbGZTZXJ2aWNlU2FtbFByb3ZpZGVyPzogSVNhbWxQcm92aWRlcik6IENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uIHtcbiAgICByZXR1cm4gbmV3IEZlZGVyYXRlZEF1dGhlbnRpY2F0aW9uKHNhbWxQcm92aWRlciwgc2VsZlNlcnZpY2VTYW1sUHJvdmlkZXIpO1xuICB9XG5cbiAgLyoqIFJlbmRlcnMgdGhlIHVzZXIgYmFzZWQgYXV0aGVudGljYXRpb24gKi9cbiAgcHVibGljIGFic3RyYWN0IHJlbmRlcigpOiBhbnk7XG59XG5cbi8qKlxuICogQWN0aXZlIERpcmVjdG9yeSBhdXRoZW50aWNhdGlvblxuICovXG5jbGFzcyBBY3RpdmVEaXJlY3RvcnlBdXRoZW50aWNhdGlvbiBleHRlbmRzIENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBkaXJlY3RvcnlJZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZGlyZWN0b3J5LXNlcnZpY2UtYXV0aGVudGljYXRpb24nLFxuICAgICAgYWN0aXZlRGlyZWN0b3J5OiB7IGRpcmVjdG9yeUlkOiB0aGlzLmRpcmVjdG9yeUlkIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEZlZGVyYXRlZCBhdXRoZW50aWNhdGlvblxuICovXG5jbGFzcyBGZWRlcmF0ZWRBdXRoZW50aWNhdGlvbiBleHRlbmRzIENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzYW1sUHJvdmlkZXI6IElTYW1sUHJvdmlkZXIsIHByaXZhdGUgcmVhZG9ubHkgc2VsZlNlcnZpY2VTYW1sUHJvdmlkZXI/OiBJU2FtbFByb3ZpZGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZmVkZXJhdGVkLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgIGZlZGVyYXRlZEF1dGhlbnRpY2F0aW9uOiB7XG4gICAgICAgIHNhbWxQcm92aWRlckFybjogdGhpcy5zYW1sUHJvdmlkZXIuc2FtbFByb3ZpZGVyQXJuLFxuICAgICAgICBzZWxmU2VydmljZVNhbWxQcm92aWRlckFybjogdGhpcy5zZWxmU2VydmljZVNhbWxQcm92aWRlcj8uc2FtbFByb3ZpZGVyQXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBjbGllbnQgVlBOIGVuZHBvaW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50VnBuRW5kcG9pbnRQcm9wcyBleHRlbmRzIENsaWVudFZwbkVuZHBvaW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIHRvIGNvbm5lY3QgdG8uXG4gICAqL1xuICByZWFkb25seSB2cGM6IElWcGM7XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyB3aGVuIGltcG9ydGluZyBhbiBleGlzdGluZyBjbGllbnQgVlBOIGVuZHBvaW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50VnBuRW5kcG9pbnRBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBlbmRwb2ludCBJRFxuICAgKi9cbiAgcmVhZG9ubHkgZW5kcG9pbnRJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIGFzc29jaWF0ZWQgd2l0aCB0aGUgZW5kcG9pbnRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzOiBJU2VjdXJpdHlHcm91cFtdO1xufVxuXG4vKipcbiAqIEEgY2xpZW50IFZQTiBjb25ubmVjdGlvblxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50VnBuRW5kcG9pbnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDbGllbnRWcG5FbmRwb2ludCB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgY2xpZW50IFZQTiBlbmRwb2ludFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRW5kcG9pbnRBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBDbGllbnRWcG5FbmRwb2ludEF0dHJpYnV0ZXMpOiBJQ2xpZW50VnBuRW5kcG9pbnQge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUNsaWVudFZwbkVuZHBvaW50IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmRwb2ludElkID0gYXR0cnMuZW5kcG9pbnRJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9ucyA9IG5ldyBDb25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzOiBhdHRycy5zZWN1cml0eUdyb3VwcyB9KTtcbiAgICAgIHB1YmxpYyByZWFkb25seSB0YXJnZXROZXR3b3Jrc0Fzc29jaWF0ZWQ6IElEZXBlbmRhYmxlID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGVuZHBvaW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWxsb3dzIHNwZWNpZnkgc2VjdXJpdHkgZ3JvdXAgY29ubmVjdGlvbnMgZm9yIHRoZSBlbmRwb2ludC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogQ29ubmVjdGlvbnM7XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldE5ldHdvcmtzQXNzb2NpYXRlZDogSURlcGVuZGFibGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfdGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDbGllbnRWcG5FbmRwb2ludFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLnZwYy52cGNDaWRyQmxvY2spKSB7XG4gICAgICBjb25zdCBjbGllbnRDaWRyID0gbmV3IENpZHJCbG9jayhwcm9wcy5jaWRyKTtcbiAgICAgIGNvbnN0IHZwY0NpZHIgPSBuZXcgQ2lkckJsb2NrKHByb3BzLnZwYy52cGNDaWRyQmxvY2spO1xuICAgICAgaWYgKHZwY0NpZHIuY29udGFpbnNDaWRyKGNsaWVudENpZHIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNsaWVudCBDSURSIGNhbm5vdCBvdmVybGFwIHdpdGggdGhlIGxvY2FsIENJRFIgb2YgdGhlIFZQQycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5kbnNTZXJ2ZXJzICYmIHByb3BzLmRuc1NlcnZlcnMubGVuZ3RoID4gMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGNsaWVudCBWUE4gZW5kcG9pbnQgY2FuIGhhdmUgdXAgdG8gdHdvIEROUyBzZXJ2ZXJzJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmxvZ2dpbmcgPT0gZmFsc2UgJiYgKHByb3BzLmxvZ0dyb3VwIHx8IHByb3BzLmxvZ1N0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgYGxvZ0dyb3VwYCBvciBgbG9nU3RyZWFtYCB3aGVuIGxvZ2dpbmcgaXMgZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuY2xpZW50Q29ubmVjdGlvbkhhbmRsZXJcbiAgICAgICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuY2xpZW50Q29ubmVjdGlvbkhhbmRsZXIuZnVuY3Rpb25OYW1lKVxuICAgICAgJiYgIXByb3BzLmNsaWVudENvbm5lY3Rpb25IYW5kbGVyLmZ1bmN0aW9uTmFtZS5zdGFydHNXaXRoKCdBV1NDbGllbnRWUE4tJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIG5hbWUgb2YgdGhlIExhbWJkYSBmdW5jdGlvbiBtdXN0IGJlZ2luIHdpdGggdGhlIGBBV1NDbGllbnRWUE4tYCBwcmVmaXgnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuY2xpZW50TG9naW5CYW5uZXJcbiAgICAgICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuY2xpZW50TG9naW5CYW5uZXIpXG4gICAgICAmJiBwcm9wcy5jbGllbnRMb2dpbkJhbm5lci5sZW5ndGggPiAxNDAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBtYXhpbXVtIGxlbmd0aCBmb3IgdGhlIGNsaWVudCBsb2dpbiBiYW5uZXIgaXMgMTQwMCwgZ290ICR7cHJvcHMuY2xpZW50TG9naW5CYW5uZXIubGVuZ3RofWApO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ2dpbmcgPSBwcm9wcy5sb2dnaW5nID8/IHRydWU7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBsb2dnaW5nXG4gICAgICA/IHByb3BzLmxvZ0dyb3VwID8/IG5ldyBsb2dzLkxvZ0dyb3VwKHRoaXMsICdMb2dHcm91cCcpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXBzID0gcHJvcHMuc2VjdXJpdHlHcm91cHMgPz8gW25ldyBTZWN1cml0eUdyb3VwKHRoaXMsICdTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgfSldO1xuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwcyB9KTtcblxuICAgIGNvbnN0IGVuZHBvaW50ID0gbmV3IENmbkNsaWVudFZwbkVuZHBvaW50KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGF1dGhlbnRpY2F0aW9uT3B0aW9uczogcmVuZGVyQXV0aGVudGljYXRpb25PcHRpb25zKHByb3BzLmNsaWVudENlcnRpZmljYXRlQXJuLCBwcm9wcy51c2VyQmFzZWRBdXRoZW50aWNhdGlvbiksXG4gICAgICBjbGllbnRDaWRyQmxvY2s6IHByb3BzLmNpZHIsXG4gICAgICBjbGllbnRDb25uZWN0T3B0aW9uczogcHJvcHMuY2xpZW50Q29ubmVjdGlvbkhhbmRsZXJcbiAgICAgICAgPyB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBsYW1iZGFGdW5jdGlvbkFybjogcHJvcHMuY2xpZW50Q29ubmVjdGlvbkhhbmRsZXIuZnVuY3Rpb25Bcm4sXG4gICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICBjb25uZWN0aW9uTG9nT3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiBsb2dnaW5nLFxuICAgICAgICBjbG91ZHdhdGNoTG9nR3JvdXA6IGxvZ0dyb3VwPy5sb2dHcm91cE5hbWUsXG4gICAgICAgIGNsb3Vkd2F0Y2hMb2dTdHJlYW06IHByb3BzLmxvZ1N0cmVhbT8ubG9nU3RyZWFtTmFtZSxcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBkbnNTZXJ2ZXJzOiBwcm9wcy5kbnNTZXJ2ZXJzLFxuICAgICAgc2VjdXJpdHlHcm91cElkczogc2VjdXJpdHlHcm91cHMubWFwKHMgPT4gcy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgc2VsZlNlcnZpY2VQb3J0YWw6IGJvb2xlYW5Ub0VuYWJsZWREaXNhYmxlZChwcm9wcy5zZWxmU2VydmljZVBvcnRhbCksXG4gICAgICBzZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogcHJvcHMuc2VydmVyQ2VydGlmaWNhdGVBcm4sXG4gICAgICBzcGxpdFR1bm5lbDogcHJvcHMuc3BsaXRUdW5uZWwsXG4gICAgICB0cmFuc3BvcnRQcm90b2NvbDogcHJvcHMudHJhbnNwb3J0UHJvdG9jb2wsXG4gICAgICB2cGNJZDogcHJvcHMudnBjLnZwY0lkLFxuICAgICAgdnBuUG9ydDogcHJvcHMucG9ydCxcbiAgICAgIHNlc3Npb25UaW1lb3V0SG91cnM6IHByb3BzLnNlc3Npb25UaW1lb3V0LFxuICAgICAgY2xpZW50TG9naW5CYW5uZXJPcHRpb25zOiBwcm9wcy5jbGllbnRMb2dpbkJhbm5lclxuICAgICAgICA/IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGJhbm5lclRleHQ6IHByb3BzLmNsaWVudExvZ2luQmFubmVyLFxuICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgdGhpcy5lbmRwb2ludElkID0gZW5kcG9pbnQucmVmO1xuXG4gICAgaWYgKHByb3BzLnVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uICYmIChwcm9wcy5zZWxmU2VydmljZVBvcnRhbCA/PyB0cnVlKSkge1xuICAgICAgLy8gT3V0cHV0IHNlbGYtc2VydmljZSBwb3J0YWwgVVJMXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdTZWxmU2VydmljZVBvcnRhbFVybCcsIHtcbiAgICAgICAgdmFsdWU6IGBodHRwczovL3NlbGYtc2VydmljZS5jbGllbnR2cG4uYW1hem9uYXdzLmNvbS9lbmRwb2ludHMvJHt0aGlzLmVuZHBvaW50SWR9YCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFzc29jaWF0ZSBzdWJuZXRzXG4gICAgY29uc3Qgc3VibmV0SWRzID0gcHJvcHMudnBjLnNlbGVjdFN1Ym5ldHMocHJvcHMudnBjU3VibmV0cykuc3VibmV0SWRzO1xuXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzdWJuZXRJZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhc3NvY2lhdGUgc3VibmV0cyB3aGVuIFZQQyBhcmUgaW1wb3J0ZWQgZnJvbSBwYXJhbWV0ZXJzIG9yIGV4cG9ydHMgY29udGFpbmluZyBsaXN0cyBvZiBzdWJuZXQgSURzLicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2lkeCwgc3VibmV0SWRdIG9mIE9iamVjdC5lbnRyaWVzKHN1Ym5ldElkcykpIHtcbiAgICAgIHRoaXMuX3RhcmdldE5ldHdvcmtzQXNzb2NpYXRlZC5hZGQobmV3IENmbkNsaWVudFZwblRhcmdldE5ldHdvcmtBc3NvY2lhdGlvbih0aGlzLCBgQXNzb2NpYXRpb24ke2lkeH1gLCB7XG4gICAgICAgIGNsaWVudFZwbkVuZHBvaW50SWQ6IHRoaXMuZW5kcG9pbnRJZCxcbiAgICAgICAgc3VibmV0SWQsXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHRoaXMudGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkID0gdGhpcy5fdGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkO1xuXG4gICAgaWYgKHByb3BzLmF1dGhvcml6ZUFsbFVzZXJzVG9WcGNDaWRyID8/IHRydWUpIHtcbiAgICAgIHRoaXMuYWRkQXV0aG9yaXphdGlvblJ1bGUoJ0F1dGhvcml6ZUFsbCcsIHtcbiAgICAgICAgY2lkcjogcHJvcHMudnBjLnZwY0NpZHJCbG9jayxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGF1dGhvcml6YXRpb24gcnVsZSB0byB0aGlzIGVuZHBvaW50XG4gICAqL1xuICBwdWJsaWMgYWRkQXV0aG9yaXphdGlvblJ1bGUoaWQ6IHN0cmluZywgcHJvcHM6IENsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlT3B0aW9ucyk6IENsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlIHtcbiAgICByZXR1cm4gbmV3IENsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlKHRoaXMsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNsaWVudFZwbkVuZHBvaW50OiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSByb3V0ZSB0byB0aGlzIGVuZHBvaW50XG4gICAqL1xuICBwdWJsaWMgYWRkUm91dGUoaWQ6IHN0cmluZywgcHJvcHM6IENsaWVudFZwblJvdXRlT3B0aW9ucyk6IENsaWVudFZwblJvdXRlIHtcbiAgICByZXR1cm4gbmV3IENsaWVudFZwblJvdXRlKHRoaXMsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNsaWVudFZwbkVuZHBvaW50OiB0aGlzLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckF1dGhlbnRpY2F0aW9uT3B0aW9ucyhcbiAgY2xpZW50Q2VydGlmaWNhdGVBcm4/OiBzdHJpbmcsXG4gIHVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uPzogQ2xpZW50VnBuVXNlckJhc2VkQXV0aGVudGljYXRpb24pOiBDZm5DbGllbnRWcG5FbmRwb2ludC5DbGllbnRBdXRoZW50aWNhdGlvblJlcXVlc3RQcm9wZXJ0eVtdIHtcbiAgY29uc3QgYXV0aGVudGljYXRpb25PcHRpb25zOiBDZm5DbGllbnRWcG5FbmRwb2ludC5DbGllbnRBdXRoZW50aWNhdGlvblJlcXVlc3RQcm9wZXJ0eVtdID0gW107XG5cbiAgaWYgKGNsaWVudENlcnRpZmljYXRlQXJuKSB7XG4gICAgYXV0aGVudGljYXRpb25PcHRpb25zLnB1c2goe1xuICAgICAgdHlwZTogJ2NlcnRpZmljYXRlLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgIG11dHVhbEF1dGhlbnRpY2F0aW9uOiB7XG4gICAgICAgIGNsaWVudFJvb3RDZXJ0aWZpY2F0ZUNoYWluQXJuOiBjbGllbnRDZXJ0aWZpY2F0ZUFybixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpZiAodXNlckJhc2VkQXV0aGVudGljYXRpb24pIHtcbiAgICBhdXRoZW50aWNhdGlvbk9wdGlvbnMucHVzaCh1c2VyQmFzZWRBdXRoZW50aWNhdGlvbi5yZW5kZXIoKSk7XG4gIH1cblxuICBpZiAoYXV0aGVudGljYXRpb25PcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQSBjbGllbnQgVlBOIGVuZHBvaW50IG11c3QgdXNlIGF0IGxlYXN0IG9uZSBhdXRoZW50aWNhdGlvbiBvcHRpb24nKTtcbiAgfVxuICByZXR1cm4gYXV0aGVudGljYXRpb25PcHRpb25zO1xufVxuXG5mdW5jdGlvbiBib29sZWFuVG9FbmFibGVkRGlzYWJsZWQodmFsPzogYm9vbGVhbik6ICdlbmFibGVkJyB8ICdkaXNhYmxlZCcgfCB1bmRlZmluZWQge1xuICBzd2l0Y2ggKHZhbCkge1xuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjYXNlIHRydWU6XG4gICAgICByZXR1cm4gJ2VuYWJsZWQnO1xuICAgIGNhc2UgZmFsc2U6XG4gICAgICByZXR1cm4gJ2Rpc2FibGVkJztcbiAgfVxufVxuIl19