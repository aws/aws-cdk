"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const index_1 = require("./index");
/**
 * Create a vpcLattice Service
 */
class Service extends core.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_LatticeServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Service);
            }
            throw error;
        }
        this.name = props.name;
        this.authPolicy = new aws_cdk_lib_1.aws_iam.PolicyDocument();
        if (props.name !== undefined) {
            if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
                throw new Error('The service  name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
            }
        }
        const service = new aws_cdk_lib_1.aws_vpclattice.CfnService(this, 'Resource', {
            authType: props.authType ?? 'AWS_IAM',
            certificateArn: this.certificate?.certificateArn,
            customDomainName: this.customDomain,
            dnsEntry: this.dnsEntry,
            name: this.name,
        });
        this.serviceId = service.attrId;
        this.serviceArn = service.attrArn;
        if ((props.allowExternalPrincipals ?? false) === false) {
            this.authPolicy.addStatements(new aws_cdk_lib_1.aws_iam.PolicyStatement({
                effect: aws_cdk_lib_1.aws_iam.Effect.DENY,
                actions: ['vpc-lattice-svcs:Invoke'],
                resources: ['*'],
                conditions: [{
                        StringNotEquals: {
                            'aws:PrincipalOrgID': [
                                'o-123456example',
                            ],
                        },
                    }],
            }));
        }
        ;
        if ((props.rejectAnonymousAccess ?? false) === true) {
            this.authPolicy.addStatements(new aws_cdk_lib_1.aws_iam.PolicyStatement({
                effect: aws_cdk_lib_1.aws_iam.Effect.DENY,
                actions: ['vpc-lattice-svcs:Invoke'],
                resources: ['*'],
                conditions: [{
                        StringEqualsIgnoreCase: {
                            'aws:PrincipalType': 'anonymous',
                        },
                    }],
            }));
        }
        ;
    }
    ;
    /**
     * .grantAccess on a lattice service, will permit the principals to
     * access all of the service. Consider using more granual permissions
     * at the rule level.
     *
     * @param principals
     */
    grantAccess(principals) {
        let policyStatement = new aws_cdk_lib_1.aws_iam.PolicyStatement();
        principals.forEach((principal) => {
            policyStatement.addPrincipals(principal);
        });
        policyStatement.addActions('vpc-lattice-svcs:Invoke');
        policyStatement.addResources('*');
        policyStatement.effect = aws_cdk_lib_1.aws_iam.Effect.ALLOW;
        this.authPolicy.addStatements(policyStatement);
    }
    applyAuthPolicy() {
        if (this.authType === 'NONE') {
            throw new Error('Can not apply a policy when authType is NONE');
        }
        if (this.authPolicy.validateForResourcePolicy().length > 0) {
            throw new Error('policyDocument.validateForResourcePolicy() failed');
        }
        new aws_cdk_lib_1.aws_vpclattice.CfnAuthPolicy(this, 'ServiceAuthPolicy', {
            policy: this.authPolicy.toJSON(),
            resourceIdentifier: this.serviceId,
        });
        return this.authPolicy;
    }
    addPolicyStatement(statement) {
        this.authPolicy.addStatements(statement);
    }
    /**
     * Provide an ACM certificate to the service
     * @param certificate
     */
    addCertificate(certificate) {
        this.certificate = certificate;
    }
    /**
     * Add a name to the Service
     * @param name
     */
    addName(name) {
        // TODO:validate the name is ok
        this.name = name;
    }
    /**
     * Add a custom domain to the service
     * @param domain the domain
     */
    addCustomDomain(domain) {
        // TODO:validate the domain is ok
        this.customDomain = domain;
    }
    /**
     * Add a DNS entry for the service
     * @param dnsEntry
     */
    addDNSEntry(dnsEntry) {
        this.dnsEntry = dnsEntry;
    }
    /**
     * Adds a listener to the service.
     * @param props AddListenerProps
     * @returns Listener
     */
    addListener(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_AddListenerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addListener);
            }
            throw error;
        }
        // check the the port is in range if it is specificed
        if (props.port) {
            if (props.port < 0 || props.port > 65535) {
                throw new Error('Port out of range');
            }
        }
        // default to using HTTPS
        let protocol = props.protocol ?? index_1.Protocol.HTTPS;
        // if its not specified, set it to the default port based on the protcol
        let port;
        switch (protocol) {
            case index_1.Protocol.HTTP:
                port = props.port ?? 80;
                break;
            case index_1.Protocol.HTTPS:
                port = props.port ?? 443;
                break;
            default:
                throw new Error('Protocol not supported');
        }
        let defaultAction = {};
        // the default action is a not found
        if (props.defaultAction === undefined) {
            defaultAction = {
                fixedResponse: {
                    statusCode: index_1.FixedResponse.NOT_FOUND,
                },
            };
        }
        ;
        if (props.name !== undefined) {
            if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
                throw new Error('The listener name must be between 3 and 63 characters long. The name can only contain  lower case alphanumeric characters and hyphens. The name must be unique to the account.');
            }
        }
        const listener = new index_1.Listener(this, `Listener-${props.name}`, {
            defaultAction: defaultAction,
            protocol: protocol,
            port: port,
            serviceId: this.serviceId,
            serviceAuthPolicy: this.authPolicy,
            name: props.name,
        });
        return listener;
    }
    /**
     * Share the service to other accounts via RAM
     * @param props SharedServiceProps
     */
    share(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_ShareServiceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.share);
            }
            throw error;
        }
        new aws_cdk_lib_1.aws_ram.CfnResourceShare(this, 'ServiceNetworkShare', {
            name: props.name,
            resourceArns: [this.serviceArn],
            allowExternalPrincipals: props.allowExternalPrincipals,
            principals: props.principals,
        });
    }
}
_a = JSII_RTTI_SYMBOL_1;
Service[_a] = { fqn: "@aws-cdk/aws-vpclattice-alpha.Service", version: "0.0.0" };
exports.Service = Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0NBQW9DO0FBQ3BDLDZDQU1xQjtBQUVyQixtQ0FPaUI7QUEySWpCOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsSUFBSSxDQUFDLFFBQVE7SUFtQ3hDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDN0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXBDUixPQUFPOzs7O1FBc0NoQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHFCQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFM0MsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUM1QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNuRCxNQUFNLElBQUksS0FBSyxDQUFDLG9LQUFvSyxDQUFDLENBQUM7YUFDdkw7U0FDRjtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM5RCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxTQUFTO1lBQ3JDLGNBQWMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWM7WUFDaEQsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDbkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FB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QyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0xBQWdMLENBQUMsQ0FBQzthQUNuTTtTQUNGO1FBR0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxnQkFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1RCxhQUFhLEVBQUUsYUFBYTtZQUM1QixRQUFRLEVBQUUsUUFBUTtZQUNsQixJQUFJLEVBQUUsSUFBSTtZQUNWLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUNsQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFDRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBd0I7Ozs7Ozs7Ozs7UUFFbkMsSUFBSSxxQkFBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNwRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMvQix1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCO1lBQ3RELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtTQUM3QixDQUFDLENBQUM7S0FDSDs7OztBQW5QUywwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHtcbiAgYXdzX3ZwY2xhdHRpY2UsXG4gIGF3c19pYW0gYXMgaWFtLFxuICBhd3NfY2VydGlmaWNhdGVtYW5hZ2VyIGFzIGNlcnRpZmljYXRlbWFuYWdlcixcbiAgYXdzX3JhbSBhcyByYW0sXG59XG4gIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQge1xuICBBZGRMaXN0ZW5lclByb3BzLFxuICBJTGlzdGVuZXIsXG4gIExpc3RlbmVyLFxuICBGaXhlZFJlc3BvbnNlLFxuICBQcm90b2NvbCxcbn1cbiAgZnJvbSAnLi9pbmRleCc7XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBTaGFyZSB0aGUgU2VydmljZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNoYXJlU2VydmljZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbGxvdyBFeHRlcm5hbCBQcmluY2lwYWxzXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhbGxvd0V4dGVybmFsUHJpbmNpcGFscz86IGJvb2xlYW4gfCB1bmRlZmluZWRcbiAgLyoqXG4gICAqIFByaW5jaXBhbHMgdG8gc2hhcmUgdGhlIHNlcnZpY2Ugd2l0aC5cbiAgICogVE8gRE8sIHRoaXMgbmVlZHMgc29tZSB3b3JrXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHByaW5jaXBhbHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgdnBjTGF0dGljZSBzZXJ2aWNlIG5ldHdvcmsuXG4gKiBJbXBsZW1lbnRlZCBieSBgU2VydmljZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNlcnZpY2UgZXh0ZW5kcyBjb3JlLklSZXNvdXJjZSB7XG4gIC8qKlxuICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgc2VydmljZS5cbiAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUFybjogc3RyaW5nO1xuICAvKipcbiAgKiBUaGUgSWQgb2YgdGhlIFNlcnZpY2UgTmV0d29ya1xuICAqL1xuICByZWFkb25seSBzZXJ2aWNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkIEEgdnBjIGxpc3RlbmVyIHRvIHRoZSBTZXJ2aWNlLlxuICAgKiBAcGFyYW0gcHJvcHNcbiAgICovXG4gIGFkZExpc3RlbmVyKHByb3BzOiBBZGRMaXN0ZW5lclByb3BzICk6IExpc3RlbmVyO1xuICAvKipcbiAgICogU2hhcmUgdGhlIHNlcnZpY2UgdG8gb3RoZXIgYWNjb3VudHMgdmlhIFJBTVxuICAgKiBAcGFyYW0gcHJvcHNcbiAgICovXG4gIHNoYXJlKHByb3BzOiBTaGFyZVNlcnZpY2VQcm9wcyk6IHZvaWQ7XG5cbiAgLyoqXG4gICogQ3JlYXRlIGEgRE5TIGVudHJ5IGluIFI1MyBmb3IgdGhlIHNlcnZpY2UuXG4gICovXG4gIGFkZEROU0VudHJ5KHByb3BzOiBhd3NfdnBjbGF0dGljZS5DZm5TZXJ2aWNlLkRuc0VudHJ5UHJvcGVydHkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBjZXJ0aWZpY2F0ZSB0byB0aGUgc2VydmljZVxuICAgKiBAcGFyYW0gY2VydGlmaWNhdGVcbiAgICovXG4gIGFkZENlcnRpZmljYXRlKGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZW1hbmFnZXIuQ2VydGlmaWNhdGUpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBhZGQgYSBjdXN0b20gZG9tYWluIHRvIHRoZSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBkb21haW5cbiAgICovXG4gIGFkZEN1c3RvbURvbWFpbihkb21haW46IHN0cmluZyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIGFkZCBhIG5hbWUgZm9yIHRoZSBzZXJ2aWNlXG4gICAqIEBkZWZhdWx0IGNsb3VkZm9ybWF0aW9uIHdpbGwgcHJvdmlkZSBhIG5hbWVcbiAgICovXG4gIGFkZE5hbWUobmFtZTogc3RyaW5nKTogdm9pZDtcbiAgLyoqXG4gICAqIGdyYW50IGFjY2VzcyB0byB0aGUgc2VydmljZVxuICAgKlxuICAgKi9cbiAgZ3JhbnRBY2Nlc3MocHJpbmNpcGFsczogaWFtLklQcmluY2lwYWxbXSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBBcHBseSB0aGUgYXV0aEF1dGhQb2xpY3kgdG8gdGhlIFNlcnZpY2VcbiAgICovXG4gIGFwcGx5QXV0aFBvbGljeSgpOiBpYW0uUG9saWN5RG9jdW1lbnQ7XG4gIC8qKlxuICAgKiBBZGQgQSBwb2xpY3lTdGF0ZW1lbnQgdG8gdGhlIEF1dGggUG9saWN5XG4gICAqL1xuICBhZGRQb2xpY3lTdGF0ZW1lbnQoc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogdm9pZDtcbn1cblxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTGF0dGljZSBTZXJ2aWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF0dGljZVNlcnZpY2VQcm9wcyB7XG5cbiAgLyoqXG4gICAqIE5hbWUgZm9yIHRoZSBzZXJ2aWNlXG4gICAqIEBkZWZhdWx0IGNsb3VkZm9ybWF0aW9uIHdpbGwgcHJvdmlkZSBhIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRoVHlwZSBvZiB0aGUgU2VydmljZVxuICAgKiBAZGVmYXVsdCAnQVdTX0lBTSdcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhUeXBlPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lcnMgdGhhdCB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBzZXJ2aWNlXG4gICovXG4gIHJlYWRvbmx5IGxpc3RlbmVycz86IElMaXN0ZW5lcltdIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBIGNlcnRpZmljYXRlIHRoYXQgbWF5IGJlIHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlPzogY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogQSBjdXN0b21Eb21haW4gdXNlZCBieSB0aGUgc2VydmljZVxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tRG9tYWluPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogQSBjdXN0b21Eb21haW5cbiAgICovXG4gIHJlYWRvbmx5IGRuc0VudHJ5PzogYXdzX3ZwY2xhdHRpY2UuQ2ZuU2VydmljZS5EbnNFbnRyeVByb3BlcnR5IHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IHNoYXJlcz86IFNoYXJlU2VydmljZVByb3BzW10gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIGFsbG93IHByaW5jaXBhbHMgb3V0c2lkZSBvZiB0aGlzIG9yZ2FuaXNhdGlvblxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dFeHRlcm5hbFByaW5jaXBhbHM/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBSZWplY3QgQW5vbnltb3VzIEFjY2VzcyB0byB0aGUgU2VydmljZVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVqZWN0QW5vbnltb3VzQWNjZXNzPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxufVxuXG4vKipcbiAqIENyZWF0ZSBhIHZwY0xhdHRpY2UgU2VydmljZVxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZSBleHRlbmRzIGNvcmUuUmVzb3VyY2UgaW1wbGVtZW50cyBJU2VydmljZSB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIFNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VJZDogc3RyaW5nXG4gIC8qKlxuICAgKiBUaGUgQXJuIG9mIHRoZSBTZXJ2aWNlXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlQXJuOiBzdHJpbmdcbiAgLyoqXG4gICAqIFRoZSBhdXRoVHlwZSBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIGF1dGhUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBBIGNlcnRpZmljYXRlIHRoYXQgbWF5IGJlIHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICovXG4gIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZW1hbmFnZXIuQ2VydGlmaWNhdGUgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBBIGN1c3RvbSBEb21haW4gdXNlZCBieSB0aGUgc2VydmljZVxuICAgKi9cbiAgY3VzdG9tRG9tYWluOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBBIEROUyBFbnRyeSBmb3IgdGhlIHNlcnZpY2VcbiAgICovXG4gIGRuc0VudHJ5OiBhd3NfdnBjbGF0dGljZS5DZm5TZXJ2aWNlLkRuc0VudHJ5UHJvcGVydHkgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAqIEEgbmFtZSBmb3IgdGhlIHNlcnZpY2VcbiAgKi9cbiAgbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogVGhlIGF1dGggUG9saWN5IGZvciB0aGUgc2VydmljZS5cbiAgICovXG4gIGF1dGhQb2xpY3k6IGlhbS5Qb2xpY3lEb2N1bWVudDtcblxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExhdHRpY2VTZXJ2aWNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5uYW1lID0gcHJvcHMubmFtZTtcbiAgICB0aGlzLmF1dGhQb2xpY3kgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KCk7XG5cbiAgICBpZiAocHJvcHMubmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAocHJvcHMubmFtZS5tYXRjaCgvXlthLXowLTlcXC1dezMsNjN9JC8pID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNlcnZpY2UgIG5hbWUgbXVzdCBiZSBiZXR3ZWVuIDMgYW5kIDYzIGNoYXJhY3RlcnMgbG9uZy4gVGhlIG5hbWUgY2FuIG9ubHkgY29udGFpbiBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQgaHlwaGVucy4gVGhlIG5hbWUgbXVzdCBiZSB1bmlxdWUgdG8gdGhlIGFjY291bnQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBhd3NfdnBjbGF0dGljZS5DZm5TZXJ2aWNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGF1dGhUeXBlOiBwcm9wcy5hdXRoVHlwZSA/PyAnQVdTX0lBTScsXG4gICAgICBjZXJ0aWZpY2F0ZUFybjogdGhpcy5jZXJ0aWZpY2F0ZT8uY2VydGlmaWNhdGVBcm4sXG4gICAgICBjdXN0b21Eb21haW5OYW1lOiB0aGlzLmN1c3RvbURvbWFpbixcbiAgICAgIGRuc0VudHJ5OiB0aGlzLmRuc0VudHJ5LFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXJ2aWNlSWQgPSBzZXJ2aWNlLmF0dHJJZDtcbiAgICB0aGlzLnNlcnZpY2VBcm4gPSBzZXJ2aWNlLmF0dHJBcm47XG5cbiAgICBpZiAoKHByb3BzLmFsbG93RXh0ZXJuYWxQcmluY2lwYWxzID8/IGZhbHNlKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYXV0aFBvbGljeS5hZGRTdGF0ZW1lbnRzKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsndnBjLWxhdHRpY2Utc3ZjczpJbnZva2UnXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgICBjb25kaXRpb25zOiBbe1xuICAgICAgICAgICAgICBTdHJpbmdOb3RFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzOlByaW5jaXBhbE9yZ0lEJzogW1xuICAgICAgICAgICAgICAgICAgJ28tMTIzNDU2ZXhhbXBsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH07XG5cbiAgICBpZiAoKHByb3BzLnJlamVjdEFub255bW91c0FjY2VzcyA/PyBmYWxzZSkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYXV0aFBvbGljeS5hZGRTdGF0ZW1lbnRzKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsndnBjLWxhdHRpY2Utc3ZjczpJbnZva2UnXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgICBjb25kaXRpb25zOiBbe1xuICAgICAgICAgICAgICBTdHJpbmdFcXVhbHNJZ25vcmVDYXNlOiB7XG4gICAgICAgICAgICAgICAgJ2F3czpQcmluY2lwYWxUeXBlJzogJ2Fub255bW91cycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiAuZ3JhbnRBY2Nlc3Mgb24gYSBsYXR0aWNlIHNlcnZpY2UsIHdpbGwgcGVybWl0IHRoZSBwcmluY2lwYWxzIHRvXG4gICAqIGFjY2VzcyBhbGwgb2YgdGhlIHNlcnZpY2UuIENvbnNpZGVyIHVzaW5nIG1vcmUgZ3JhbnVhbCBwZXJtaXNzaW9uc1xuICAgKiBhdCB0aGUgcnVsZSBsZXZlbC5cbiAgICpcbiAgICogQHBhcmFtIHByaW5jaXBhbHNcbiAgICovXG4gIHB1YmxpYyBncmFudEFjY2VzcyhwcmluY2lwYWxzOiBpYW0uSVByaW5jaXBhbFtdKTogdm9pZCB7XG5cbiAgICBsZXQgcG9saWN5U3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoKTtcblxuICAgIHByaW5jaXBhbHMuZm9yRWFjaCgocHJpbmNpcGFsKSA9PiB7XG4gICAgICBwb2xpY3lTdGF0ZW1lbnQuYWRkUHJpbmNpcGFscyhwcmluY2lwYWwpO1xuICAgIH0pO1xuICAgIHBvbGljeVN0YXRlbWVudC5hZGRBY3Rpb25zKCd2cGMtbGF0dGljZS1zdmNzOkludm9rZScpO1xuICAgIHBvbGljeVN0YXRlbWVudC5hZGRSZXNvdXJjZXMoJyonKTtcbiAgICBwb2xpY3lTdGF0ZW1lbnQuZWZmZWN0ID0gaWFtLkVmZmVjdC5BTExPVztcblxuXG4gICAgdGhpcy5hdXRoUG9saWN5LmFkZFN0YXRlbWVudHMocG9saWN5U3RhdGVtZW50KTtcblxuICB9XG4gIHB1YmxpYyBhcHBseUF1dGhQb2xpY3koKTogaWFtLlBvbGljeURvY3VtZW50IHtcblxuICAgIGlmICh0aGlzLmF1dGhUeXBlID09PSAnTk9ORScpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBhcHBseSBhIHBvbGljeSB3aGVuIGF1dGhUeXBlIGlzIE5PTkUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRoUG9saWN5LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbGljeURvY3VtZW50LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKSBmYWlsZWQnKTtcbiAgICB9XG5cbiAgICBuZXcgYXdzX3ZwY2xhdHRpY2UuQ2ZuQXV0aFBvbGljeSh0aGlzLCAnU2VydmljZUF1dGhQb2xpY3knLCB7XG4gICAgICBwb2xpY3k6IHRoaXMuYXV0aFBvbGljeS50b0pTT04oKSxcbiAgICAgIHJlc291cmNlSWRlbnRpZmllcjogdGhpcy5zZXJ2aWNlSWQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5hdXRoUG9saWN5O1xuICB9XG5cbiAgcHVibGljIGFkZFBvbGljeVN0YXRlbWVudChzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmF1dGhQb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGUgYW4gQUNNIGNlcnRpZmljYXRlIHRvIHRoZSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBjZXJ0aWZpY2F0ZVxuICAgKi9cbiAgcHVibGljIGFkZENlcnRpZmljYXRlKGNlcnRpZmljYXRlOiBjb3JlLmF3c19jZXJ0aWZpY2F0ZW1hbmFnZXIuQ2VydGlmaWNhdGUpOiB2b2lkIHtcbiAgICB0aGlzLmNlcnRpZmljYXRlID0gY2VydGlmaWNhdGU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmFtZSB0byB0aGUgU2VydmljZVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKi9cbiAgcHVibGljIGFkZE5hbWUobmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAvLyBUT0RPOnZhbGlkYXRlIHRoZSBuYW1lIGlzIG9rXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgY3VzdG9tIGRvbWFpbiB0byB0aGUgc2VydmljZVxuICAgKiBAcGFyYW0gZG9tYWluIHRoZSBkb21haW5cbiAgICovXG4gIHB1YmxpYyBhZGRDdXN0b21Eb21haW4oZG9tYWluOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIC8vIFRPRE86dmFsaWRhdGUgdGhlIGRvbWFpbiBpcyBva1xuICAgIHRoaXMuY3VzdG9tRG9tYWluID0gZG9tYWluO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBETlMgZW50cnkgZm9yIHRoZSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBkbnNFbnRyeVxuICAgKi9cbiAgcHVibGljIGFkZEROU0VudHJ5KGRuc0VudHJ5OiBhd3NfdnBjbGF0dGljZS5DZm5TZXJ2aWNlLkRuc0VudHJ5UHJvcGVydHkpOiB2b2lkIHtcblxuICAgIHRoaXMuZG5zRW50cnkgPSBkbnNFbnRyeTtcbiAgfVxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0gcHJvcHMgQWRkTGlzdGVuZXJQcm9wc1xuICAgKiBAcmV0dXJucyBMaXN0ZW5lclxuICAgKi9cbiAgcHVibGljIGFkZExpc3RlbmVyKHByb3BzOiBBZGRMaXN0ZW5lclByb3BzKTogTGlzdGVuZXIge1xuXG4gICAgLy8gY2hlY2sgdGhlIHRoZSBwb3J0IGlzIGluIHJhbmdlIGlmIGl0IGlzIHNwZWNpZmljZWRcbiAgICBpZiAocHJvcHMucG9ydCkge1xuICAgICAgaWYgKHByb3BzLnBvcnQgPCAwIHx8IHByb3BzLnBvcnQgPiA2NTUzNSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvcnQgb3V0IG9mIHJhbmdlJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCB0byB1c2luZyBIVFRQU1xuICAgIGxldCBwcm90b2NvbCA9IHByb3BzLnByb3RvY29sID8/IFByb3RvY29sLkhUVFBTO1xuXG4gICAgLy8gaWYgaXRzIG5vdCBzcGVjaWZpZWQsIHNldCBpdCB0byB0aGUgZGVmYXVsdCBwb3J0IGJhc2VkIG9uIHRoZSBwcm90Y29sXG4gICAgbGV0IHBvcnQ6IG51bWJlcjtcbiAgICBzd2l0Y2ggKHByb3RvY29sKSB7XG4gICAgICBjYXNlIFByb3RvY29sLkhUVFA6XG4gICAgICAgIHBvcnQgPSBwcm9wcy5wb3J0ID8/IDgwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJvdG9jb2wuSFRUUFM6XG4gICAgICAgIHBvcnQgPSBwcm9wcy5wb3J0ID8/IDQ0MztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3RvY29sIG5vdCBzdXBwb3J0ZWQnKTtcbiAgICB9XG5cbiAgICBsZXQgZGVmYXVsdEFjdGlvbjogYXdzX3ZwY2xhdHRpY2UuQ2ZuTGlzdGVuZXIuRGVmYXVsdEFjdGlvblByb3BlcnR5ID0ge307XG4gICAgLy8gdGhlIGRlZmF1bHQgYWN0aW9uIGlzIGEgbm90IGZvdW5kXG4gICAgaWYgKHByb3BzLmRlZmF1bHRBY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmYXVsdEFjdGlvbiA9IHtcbiAgICAgICAgZml4ZWRSZXNwb25zZToge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IEZpeGVkUmVzcG9uc2UuTk9UX0ZPVU5ELFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgaWYgKHByb3BzLm5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHByb3BzLm5hbWUubWF0Y2goL15bYS16MC05XFwtXXszLDYzfSQvKSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBsaXN0ZW5lciBuYW1lIG11c3QgYmUgYmV0d2VlbiAzIGFuZCA2MyBjaGFyYWN0ZXJzIGxvbmcuIFRoZSBuYW1lIGNhbiBvbmx5IGNvbnRhaW4gIGxvd2VyIGNhc2UgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgYW5kIGh5cGhlbnMuIFRoZSBuYW1lIG11c3QgYmUgdW5pcXVlIHRvIHRoZSBhY2NvdW50LicpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgY29uc3QgbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIodGhpcywgYExpc3RlbmVyLSR7cHJvcHMubmFtZX1gLCB7XG4gICAgICBkZWZhdWx0QWN0aW9uOiBkZWZhdWx0QWN0aW9uLFxuICAgICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgICAgcG9ydDogcG9ydCxcbiAgICAgIHNlcnZpY2VJZDogdGhpcy5zZXJ2aWNlSWQsXG4gICAgICBzZXJ2aWNlQXV0aFBvbGljeTogdGhpcy5hdXRoUG9saWN5LFxuICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICB9KTtcblxuICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgfVxuICAvKipcbiAgICogU2hhcmUgdGhlIHNlcnZpY2UgdG8gb3RoZXIgYWNjb3VudHMgdmlhIFJBTVxuICAgKiBAcGFyYW0gcHJvcHMgU2hhcmVkU2VydmljZVByb3BzXG4gICAqL1xuICBwdWJsaWMgc2hhcmUocHJvcHM6IFNoYXJlU2VydmljZVByb3BzKTogdm9pZCB7XG5cbiAgICBuZXcgcmFtLkNmblJlc291cmNlU2hhcmUodGhpcywgJ1NlcnZpY2VOZXR3b3JrU2hhcmUnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5zZXJ2aWNlQXJuXSxcbiAgICAgIGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzOiBwcm9wcy5hbGxvd0V4dGVybmFsUHJpbmNpcGFscyxcbiAgICAgIHByaW5jaXBhbHM6IHByb3BzLnByaW5jaXBhbHMsXG4gICAgfSk7XG5cdCAgfVxufVxuXG5cbiJdfQ==