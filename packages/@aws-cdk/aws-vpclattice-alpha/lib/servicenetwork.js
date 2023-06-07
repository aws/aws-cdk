"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNetwork = exports.AuthType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const core = require("aws-cdk-lib");
var AuthType;
(function (AuthType) {
    AuthType["NONE"] = "NONE";
    AuthType["AWS_IAM"] = "AWS_IAM";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
/**
 * Create a vpcLattice Service Network.
 */
class ServiceNetwork extends core.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_ServiceNetworkProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServiceNetwork);
            }
            throw error;
        }
        if (props.name !== undefined) {
            if (props.name.match(/^[a-z0-9\-]{3,63}$/) === null) {
                throw new Error('Theservice network name must be between 3 and 63 characters long. The name can only contain alphanumeric characters and hyphens. The name must be unique to the account.');
            }
        }
        // the opinionated default for the servicenetwork is to use AWS_IAM as the
        // authentication method. Provide 'NONE' to props.authType to disable.
        const serviceNetwork = new aws_cdk_lib_1.aws_vpclattice.CfnServiceNetwork(this, 'Resource', {
            name: props.name,
            authType: props.authType ?? 'AWS_IAM',
        });
        // log to s3
        if (props.s3LogDestination !== undefined) {
            props.s3LogDestination.forEach((bucket) => {
                this.logToS3(bucket);
            });
        }
        ;
        // log to cloudwatch
        if (props.cloudwatchLogs !== undefined) {
            props.cloudwatchLogs.forEach((log) => {
                this.sendToCloudWatch(log);
            });
        }
        ;
        // log to kinesis
        if (props.kinesisStreams !== undefined) {
            props.kinesisStreams.forEach((stream) => {
                this.streamToKinesis(stream);
            });
        }
        ;
        // associate vpcs
        if (props.vpcs !== undefined) {
            props.vpcs.forEach((vpc) => {
                this.associateVPC({ vpc: vpc });
            });
        }
        ;
        //associate services
        if (props.services !== undefined) {
            props.services.forEach((service) => {
                this.addService(service);
            });
        }
        ;
        // create a managedPolicy for the lattice Service.
        this.authPolicy = new aws_cdk_lib_1.aws_iam.PolicyDocument();
        const allowExternalPrincipals = props.allowExternalPrincipals ?? false;
        // An AWS account ID
        // An Amazon Resource Name (ARN) of an organization in AWS Organizations
        // An ARN of an organizational unit (OU) in AWS Organizations
        //
        // share the service network, and permit the account principals to use it
        if (props.accounts !== undefined) {
            props.accounts.forEach((account) => {
                this.grantAccessToServiceNetwork([account]);
                this.share({
                    name: 'Share',
                    principals: [account.accountId],
                    allowExternalPrincipals: allowExternalPrincipals,
                });
            });
        }
        // share the service network and permit this to be used;
        if (props.arnToShareServiceWith !== undefined) {
            props.arnToShareServiceWith.forEach((resource) => {
                //check if resource is a valid arn;
                this.grantAccessToServiceNetwork([new aws_cdk_lib_1.aws_iam.ArnPrincipal(resource)]);
                this.share({
                    name: 'Share',
                    principals: [resource],
                    allowExternalPrincipals: allowExternalPrincipals,
                });
            });
        }
        this.serviceNetworkId = serviceNetwork.attrId;
        this.serviceNetworkArn = serviceNetwork.attrArn;
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
     * This will give the principals access to all resources that are on this
     * service network. This is a broad permission.
     * Consider granting Access at the Service
     * addToResourcePolicy()
     *
     */
    grantAccessToServiceNetwork(principals) {
        let policyStatement = new aws_cdk_lib_1.aws_iam.PolicyStatement();
        policyStatement.addActions('vpc-lattice-svcs:Invoke');
        policyStatement.addResources(this.serviceNetworkArn);
        policyStatement.effect = aws_cdk_lib_1.aws_iam.Effect.ALLOW;
        principals.forEach((principal) => {
            policyStatement.addPrincipals(principal);
        });
        this.authPolicy.addStatements(policyStatement);
    }
    // addToResourcePolicy(permission)
    applyAuthPolicyToServiceNetwork() {
        // check to see if there are any errors with the auth policy
        if (this.authPolicy.validateForResourcePolicy().length > 0) {
            throw new Error(`Auth Policy for granting access on  Service Network is invalid\n, ${this.authPolicy}`);
        }
        // check to see if the AuthType is AWS_IAM
        if (this.authType !== AuthType.AWS_IAM) {
            throw new Error(`AuthType must be ${AuthType.AWS_IAM} to add an Auth Policy`);
        }
        // attach the AuthPolicy to the Service Network
        new aws_cdk_lib_1.aws_vpclattice.CfnAuthPolicy(this, 'AuthPolicy', {
            policy: this.authPolicy.toJSON(),
            resourceIdentifier: this.serviceNetworkArn,
        });
    }
    /**
     * Add A lattice service to a lattice network
     * @param service
     */
    addService(service) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_Service(service);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addService);
            }
            throw error;
        }
        new aws_cdk_lib_1.aws_vpclattice.CfnServiceNetworkServiceAssociation(this, `LatticeService$${service.serviceId}`, {
            serviceIdentifier: service.serviceId,
            serviceNetworkIdentifier: this.serviceNetworkId,
        });
    }
    /**
     * Associate a VPC with the Service Network
     * This provides an opinionated default of adding a security group to allow inbound 443
     */
    associateVPC(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_AssociateVPCProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.associateVPC);
            }
            throw error;
        }
        const securityGroupIds = [];
        if (props.securityGroups === undefined) {
            const securityGroup = new aws_cdk_lib_1.aws_ec2.SecurityGroup(this, `ServiceNetworkSecurityGroup${props.vpc.vpcId}`, {
                vpc: props.vpc,
                allowAllOutbound: true,
                description: 'ServiceNetworkSecurityGroup',
            });
            securityGroup.addIngressRule(aws_cdk_lib_1.aws_ec2.Peer.ipv4(props.vpc.vpcCidrBlock), aws_cdk_lib_1.aws_ec2.Port.tcp(443));
            securityGroupIds.push(securityGroup.securityGroupId);
        }
        new aws_cdk_lib_1.aws_vpclattice.CfnServiceNetworkVpcAssociation(this, `${props.vpc.vpcId}VpcAssociation`, /* all optional props */ {
            securityGroupIds: securityGroupIds,
            serviceNetworkIdentifier: this.serviceNetworkId,
            vpcIdentifier: props.vpc.vpcId,
        });
    }
    /**
     * Send logs to a S3 bucket.
     * @param bucket
     */
    logToS3(bucket) {
        new aws_cdk_lib_1.aws_vpclattice.CfnAccessLogSubscription(this, `LoggingtoS3${bucket.bucketName}`, {
            destinationArn: bucket.bucketArn,
            resourceIdentifier: this.serviceNetworkArn,
        });
    }
    /**
     * Send event to Cloudwatch
     * @param log
     */
    sendToCloudWatch(log) {
        new aws_cdk_lib_1.aws_vpclattice.CfnAccessLogSubscription(this, `LattiCloudwatch${log.logGroupName}`, {
            destinationArn: log.logGroupArn,
            resourceIdentifier: this.serviceNetworkArn,
        });
    }
    /**
     * Stream Events to Kinesis
     * @param stream
     */
    streamToKinesis(stream) {
        new aws_cdk_lib_1.aws_vpclattice.CfnAccessLogSubscription(this, `LatticeKinesis${stream.streamName}`, {
            destinationArn: stream.streamArn,
            resourceIdentifier: this.serviceNetworkArn,
        });
    }
    /**
     * Share the The Service network using RAM
     * @param props ShareServiceNetwork
     */
    share(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_ShareServiceNetworkProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.share);
            }
            throw error;
        }
        new aws_cdk_lib_1.aws_ram.CfnResourceShare(this, 'ServiceNetworkShare', {
            name: props.name,
            resourceArns: [this.serviceNetworkArn],
            allowExternalPrincipals: props.allowExternalPrincipals,
            principals: props.principals,
        });
    }
}
_a = JSII_RTTI_SYMBOL_1;
ServiceNetwork[_a] = { fqn: "@aws-cdk/aws-vpclattice-alpha.ServiceNetwork", version: "0.0.0" };
exports.ServiceNetwork = ServiceNetwork;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZW5ldHdvcmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2aWNlbmV0d29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2Q0FTcUI7QUFDckIsb0NBQW9DO0FBTXBDLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNsQix5QkFBYSxDQUFBO0lBQ2IsK0JBQW1CLENBQUE7QUFDckIsQ0FBQyxFQUhXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBR25CO0FBNkpEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsSUFBSSxDQUFDLFFBQVE7SUF1Qi9DLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDN0UsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXhCUixjQUFjOzs7O1FBMEJ2QixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsMEtBQTBLLENBQUMsQ0FBQzthQUM3TDtTQUNGO1FBQ0QsMEVBQTBFO1FBQzFFLHNFQUFzRTtRQUN0RSxNQUFNLGNBQWMsR0FBRyxJQUFJLDRCQUFjLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM1RSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksU0FBUztTQUN0QyxDQUFDLENBQUM7UUFFSCxZQUFZO1FBQ1osSUFBSSxLQUFLLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1lBQ3hDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FB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SjtJQUNEOzs7T0FHRztJQUNJLGdCQUFnQixDQUFDLEdBQW1DO1FBQ3pELElBQUksNEJBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN0RixjQUFjLEVBQUUsR0FBRyxDQUFDLFdBQVc7WUFDL0Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtTQUMzQyxDQUFDLENBQUM7S0FDSjtJQUVEOzs7T0FHRztJQUNJLGVBQWUsQ0FBQyxNQUF3QztRQUM3RCxJQUFJLDRCQUFjLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLGlCQUFpQixNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDdEYsY0FBYyxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQ2hDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7U0FDM0MsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBK0I7Ozs7Ozs7Ozs7UUFDMUMsSUFBSSxxQkFBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNwRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3RDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyx1QkFBdUI7WUFDdEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1NBQzdCLENBQUMsQ0FBQztLQUNKOzs7O0FBNVFVLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgYXdzX3ZwY2xhdHRpY2UsXG4gIGF3c19pYW0gYXMgaWFtLFxuICBhd3NfZWMyIGFzIGVjMixcbiAgYXdzX3MzIGFzIHMzLFxuICBhd3NfbG9ncyBhcyBsb2dzLFxuICBhd3Nfa2luZXNpcyBhcyBraW5lc2lzLFxuICBhd3NfcmFtIGFzIHJhbSxcbn1cbiAgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHtcbiAgU2VydmljZSxcbn0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBlbnVtIEF1dGhUeXBlIHtcbiAgTk9ORSA9ICdOT05FJyxcbiAgQVdTX0lBTSA9ICdBV1NfSUFNJ1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gc2hhcmUgYSBTZXJ2aWNlIE5ldHdvcmtcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTaGFyZVNlcnZpY2VOZXR3b3JrUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNoYXJlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogQXJlIGV4dGVybmFsIFByaW5jaXBhbHMgYWxsb3dlZFxuICAgKiBAZGVmYXVsdCBmYWxzZTtcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzPzogYm9vbGVhbiB8IHVuZGVmaW5lZFxuICAvKipcbiAgICogUHJpbmNpcGFscyB0byBzaGFyZSB0aGUgU2VydmljZSBOZXR3b3JrIHdpdGhcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJpbmNpcGFscz86IHN0cmluZ1tdIHwgdW5kZWZpbmVkXG59XG4vKipcbiAqIFByb3BlcnRpZXMgdG8gYXNzb2NpYXRlIGEgVlBDIHdpdGggYSBTZXJ2aWNlIE5ldHdvcmtcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NvY2lhdGVWUENQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBTZXJ2aWNlIE5ldHdvcmtcbiAgICovXG4gIHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBTZXJ2aWNlIE5ldHdvcmtcbiAgICogQGRlZmF1bHQgYSBzZWN1cml0eSBncm91cCB0aGF0IGFsbG93cyBpbmJvdW5kIDQ0MyB3aWxsIGJlIHBlcm1pdHRlZC5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBzPzogZWMyLlNlY3VyaXR5R3JvdXBbXSB8IHVuZGVmaW5lZFxuXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgdnBjIGxhdHRpY2Ugc2VydmljZSBuZXR3b3JrLlxuICogSW1wbGVtZW50ZWQgYnkgYFNlcnZpY2VOZXR3b3JrYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2VydmljZU5ldHdvcmsgZXh0ZW5kcyBjb3JlLklSZXNvdXJjZSB7XG5cbiAgLyoqXG4gICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBzZXJ2aWNlIG5ldHdvcmsuXG4gICovXG4gIHJlYWRvbmx5IHNlcnZpY2VOZXR3b3JrQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgU2VydmljZSBOZXR3b3JrXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlTmV0d29ya0lkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBHcmFudCBQcmluY29wYWxzIGFjY2VzcyB0byB0aGUgU2VydmljZSBOZXR3b3JrXG4gICAqL1xuICBncmFudEFjY2Vzc1RvU2VydmljZU5ldHdvcmsocHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbFtdKTogdm9pZDtcbiAgLyoqXG4gICAqIEFkZCBMYXR0aWNlIFNlcnZpY2UgUG9saWN5XG4gICAqL1xuICBhZGRTZXJ2aWNlKHNlcnZpY2U6IFNlcnZpY2UpOiB2b2lkO1xuICAvKipcbiAgICogQXNzb2NpYXRlIGEgVlBDIHdpdGggdGhlIFNlcnZpY2UgTmV0d29ya1xuICAgKi9cbiAgYXNzb2NpYXRlVlBDKHByb3BzOiBBc3NvY2lhdGVWUENQcm9wcyk6IHZvaWQ7XG4gIC8qKlxuICAgKiBMb2cgVG8gUzNcbiAgICovXG4gIGxvZ1RvUzMoYnVja2V0OiBzMy5CdWNrZXQgfCBzMy5JQnVja2V0ICk6IHZvaWQ7XG4gIC8qKlxuICAgKiBTZW5kIEV2ZW50cyB0byBDbG91ZCBXYXRjaFxuICAgKi9cbiAgc2VuZFRvQ2xvdWRXYXRjaChsb2c6IGxvZ3MuTG9nR3JvdXAgfCBsb2dzLklMb2dHcm91cCApOiB2b2lkO1xuICAvKipcbiAgICogU3RyZWFtIHRvIEtpbmVzaXNcbiAgICovXG4gIHN0cmVhbVRvS2luZXNpcyhzdHJlYW06IGtpbmVzaXMuU3RyZWFtIHwga2luZXNpcy5JU3RyZWFtICk6IHZvaWQ7XG4gIC8qKlxuICAgKiBTaGFyZSB0aGUgU2VydmljZU5ldHdvcmtcbiAgICovXG4gIHNoYXJlKHByb3BzOiBTaGFyZVNlcnZpY2VOZXR3b3JrUHJvcHMpOiB2b2lkO1xuICAvKipcbiAgICogQ3JlYXRlIGFuZCBBZGQgYW4gYXV0aCBwb2xpY3kgdG8gdGhlIFNlcnZpY2UgTmV0d29ya1xuICAgKi9cbiAgYXBwbHlBdXRoUG9saWN5VG9TZXJ2aWNlTmV0d29yaygpOiB2b2lkO1xufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGZvciB0aGUgU2VydmljZU5ldHdvcmsuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZU5ldHdvcmtQcm9wcyB7XG5cbiAgLyoqIFRoZSBuYW1lIG9mIHRoZSBTZXJ2aWNlIE5ldHdvcmsuIElmIG5vdCBwcm92aWRlZCBDbG91ZGZvcm1hdGlvbiB3aWxsIHByb3ZpZGVcbiAgICogYSBuYW1lXG4gICAqIEBkZWZhdWx0IGNsb3VkZm9ybWF0aW9uIGdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nXG5cbiAgLyoqIFRoZSB0eXBlIG9mICBhdXRoZW50aWNhdGlvbiB0byB1c2Ugd2l0aCB0aGUgU2VydmljZSBOZXR3b3JrLlxuICAgKiBAZGVmYXVsdCAnQVdTX0lBTSdcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhUeXBlPzogQXV0aFR5cGUgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFMzIGJ1Y2tldHMgZm9yIGFjY2VzcyBsb2dzXG4gICAqIEBkZWZhdWx0IG5vIHMzIGxvZ2dpbmdcbiAgICovXG5cbiAgcmVhZG9ubHkgczNMb2dEZXN0aW5hdGlvbj86IHMzLklCdWNrZXRbXSB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIENsb3Vkd2F0Y2ggTG9nc1xuICAgKiBAZGVmYXVsdCBubyBsb2dnaW5nIHRvIGNsb3Vkd2F0Y2hcbiAgICovXG4gIHJlYWRvbmx5IGNsb3Vkd2F0Y2hMb2dzPzogbG9ncy5JTG9nR3JvdXBbXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICoga2luZXNpcyBzdHJlYW1zXG4gICAqIEBkZWZhdWx0IG5vIHN0cmVhbWluZyB0byBLaW5lc2lzXG4gICAqL1xuICByZWFkb25seSBraW5lc2lzU3RyZWFtcz86IGtpbmVzaXMuSVN0cmVhbVtdO1xuXG4gIC8qKlxuICAgKiBMYXR0aWNlIFNlcnZpY2VzIHRoYXQgYXJlIGFzc29jYWl0ZWQgd2l0aCB0aGlzIFNlcnZpY2UgTmV0d29ya1xuICAgKiBAZGVmYXVsdCBubyBzZXJ2aWNlcyBhcmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzZXJ2aWNlIG5ldHdvcmtcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VzPzogU2VydmljZVtdIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBWcGNzIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFNlcnZpY2UgTmV0d29ya1xuICAgKiBAZGVmYXVsdCBubyB2cGNzIGFyZSBhc3NvY2lhdGVkXG4gICAqL1xuICByZWFkb25seSB2cGNzPzogZWMyLklWcGNbXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQWNjb3VudCBwcmluY2lwYWxzIHRoYXQgYXJlIHBlcm1pdHRlZCB0byB1c2UgdGhpcyBzZXJ2aWNlXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGFjY291bnRzPzogaWFtLkFjY291bnRQcmluY2lwYWxbXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogYXJuVG9TaGFyZVdpdGgsIHVzZSB0aGlzIGZvciBzcGVjaWZ5aW5nIE9yZ3MgYW5kIE9VJ3NcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFyblRvU2hhcmVTZXJ2aWNlV2l0aD86IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBBbGxvdyBleHRlcm5hbCBwcmluY2lwYWxzXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhbGxvd0V4dGVybmFsUHJpbmNpcGFscz86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIFJlamVjdCBBbm9ueW1vdXMgQWNjZXNzIHRvIHRoZSBTZXJ2aWNlXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSByZWplY3RBbm9ueW1vdXNBY2Nlc3M/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHZwY0xhdHRpY2UgU2VydmljZSBOZXR3b3JrLlxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZU5ldHdvcmsgZXh0ZW5kcyBjb3JlLlJlc291cmNlIGltcGxlbWVudHMgSVNlcnZpY2VOZXR3b3JrIHtcbiAgLyoqXG4gICAqIFRoZSBBcm4gb2YgdGhlIHNlcnZpY2UgbmV0d29ya1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VOZXR3b3JrQXJuOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIFNlcnZpY2UgTmV0d29ya1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VOZXR3b3JrSWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIHRoZSBhdXRoVHlwZSBvZiB0aGUgc2VydmljZSBuZXR3b3JrXG4gICAqL1xuICBhdXRoVHlwZTogQXV0aFR5cGUgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBwb2xpY3kgZG9jdW1lbnQgdG8gYmUgdXNlZC5cbiAgICovXG4gIC8vYXV0aFBvbGljeTogaWFtLlBvbGljeURvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuICAvKipcbiAgICogQSBtYW5hZ2VkIFBvbGljeSB0aGF0IGlzIHRoZSBhdXRoIHBvbGljeVxuICAgKi9cbiAgYXV0aFBvbGljeTogaWFtLlBvbGljeURvY3VtZW50XG5cblxuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTZXJ2aWNlTmV0d29ya1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChwcm9wcy5uYW1lLm1hdGNoKC9eW2EtejAtOVxcLV17Myw2M30kLykgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGVzZXJ2aWNlIG5ldHdvcmsgbmFtZSBtdXN0IGJlIGJldHdlZW4gMyBhbmQgNjMgY2hhcmFjdGVycyBsb25nLiBUaGUgbmFtZSBjYW4gb25seSBjb250YWluIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGFuZCBoeXBoZW5zLiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB0byB0aGUgYWNjb3VudC4nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdGhlIG9waW5pb25hdGVkIGRlZmF1bHQgZm9yIHRoZSBzZXJ2aWNlbmV0d29yayBpcyB0byB1c2UgQVdTX0lBTSBhcyB0aGVcbiAgICAvLyBhdXRoZW50aWNhdGlvbiBtZXRob2QuIFByb3ZpZGUgJ05PTkUnIHRvIHByb3BzLmF1dGhUeXBlIHRvIGRpc2FibGUuXG4gICAgY29uc3Qgc2VydmljZU5ldHdvcmsgPSBuZXcgYXdzX3ZwY2xhdHRpY2UuQ2ZuU2VydmljZU5ldHdvcmsodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICAgIGF1dGhUeXBlOiBwcm9wcy5hdXRoVHlwZSA/PyAnQVdTX0lBTScsXG4gICAgfSk7XG5cbiAgICAvLyBsb2cgdG8gczNcbiAgICBpZiAocHJvcHMuczNMb2dEZXN0aW5hdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9wcy5zM0xvZ0Rlc3RpbmF0aW9uLmZvckVhY2goKGJ1Y2tldCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ1RvUzMoYnVja2V0KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBsb2cgdG8gY2xvdWR3YXRjaFxuICAgIGlmIChwcm9wcy5jbG91ZHdhdGNoTG9ncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9wcy5jbG91ZHdhdGNoTG9ncy5mb3JFYWNoKChsb2cpID0+IHtcbiAgICAgICAgdGhpcy5zZW5kVG9DbG91ZFdhdGNoKGxvZyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gbG9nIHRvIGtpbmVzaXNcbiAgICBpZiAocHJvcHMua2luZXNpc1N0cmVhbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcHJvcHMua2luZXNpc1N0cmVhbXMuZm9yRWFjaCgoc3RyZWFtKSA9PiB7XG4gICAgICAgIHRoaXMuc3RyZWFtVG9LaW5lc2lzKHN0cmVhbSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gYXNzb2NpYXRlIHZwY3NcbiAgICBpZiAocHJvcHMudnBjcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9wcy52cGNzLmZvckVhY2goKHZwYykgPT4ge1xuICAgICAgICB0aGlzLmFzc29jaWF0ZVZQQyh7IHZwYzogdnBjIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vYXNzb2NpYXRlIHNlcnZpY2VzXG4gICAgaWYgKHByb3BzLnNlcnZpY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHByb3BzLnNlcnZpY2VzLmZvckVhY2goKHNlcnZpY2UpID0+IHtcbiAgICAgICAgdGhpcy5hZGRTZXJ2aWNlKHNlcnZpY2UpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBhIG1hbmFnZWRQb2xpY3kgZm9yIHRoZSBsYXR0aWNlIFNlcnZpY2UuXG4gICAgdGhpcy5hdXRoUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCgpO1xuXG4gICAgY29uc3QgYWxsb3dFeHRlcm5hbFByaW5jaXBhbHMgPSBwcm9wcy5hbGxvd0V4dGVybmFsUHJpbmNpcGFscyA/PyBmYWxzZTtcblxuICAgIC8vIEFuIEFXUyBhY2NvdW50IElEXG4gICAgLy8gQW4gQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgYW4gb3JnYW5pemF0aW9uIGluIEFXUyBPcmdhbml6YXRpb25zXG4gICAgLy8gQW4gQVJOIG9mIGFuIG9yZ2FuaXphdGlvbmFsIHVuaXQgKE9VKSBpbiBBV1MgT3JnYW5pemF0aW9uc1xuICAgIC8vXG5cbiAgICAvLyBzaGFyZSB0aGUgc2VydmljZSBuZXR3b3JrLCBhbmQgcGVybWl0IHRoZSBhY2NvdW50IHByaW5jaXBhbHMgdG8gdXNlIGl0XG4gICAgaWYgKHByb3BzLmFjY291bnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHByb3BzLmFjY291bnRzLmZvckVhY2goKGFjY291bnQpID0+IHtcbiAgICAgICAgdGhpcy5ncmFudEFjY2Vzc1RvU2VydmljZU5ldHdvcmsoW2FjY291bnRdKTtcbiAgICAgICAgdGhpcy5zaGFyZSh7XG4gICAgICAgICAgbmFtZTogJ1NoYXJlJyxcbiAgICAgICAgICBwcmluY2lwYWxzOiBbYWNjb3VudC5hY2NvdW50SWRdLFxuICAgICAgICAgIGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzOiBhbGxvd0V4dGVybmFsUHJpbmNpcGFscyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gc2hhcmUgdGhlIHNlcnZpY2UgbmV0d29yayBhbmQgcGVybWl0IHRoaXMgdG8gYmUgdXNlZDtcbiAgICBpZiAocHJvcHMuYXJuVG9TaGFyZVNlcnZpY2VXaXRoIT09IHVuZGVmaW5lZCkge1xuICAgICAgcHJvcHMuYXJuVG9TaGFyZVNlcnZpY2VXaXRoLmZvckVhY2goKHJlc291cmNlKSA9PiB7XG4gICAgICAgIC8vY2hlY2sgaWYgcmVzb3VyY2UgaXMgYSB2YWxpZCBhcm47XG4gICAgICAgIHRoaXMuZ3JhbnRBY2Nlc3NUb1NlcnZpY2VOZXR3b3JrKFtuZXcgaWFtLkFyblByaW5jaXBhbChyZXNvdXJjZSldKTtcbiAgICAgICAgdGhpcy5zaGFyZSh7XG4gICAgICAgICAgbmFtZTogJ1NoYXJlJyxcbiAgICAgICAgICBwcmluY2lwYWxzOiBbcmVzb3VyY2VdLFxuICAgICAgICAgIGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzOiBhbGxvd0V4dGVybmFsUHJpbmNpcGFscyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZpY2VOZXR3b3JrSWQgPSBzZXJ2aWNlTmV0d29yay5hdHRySWQ7XG4gICAgdGhpcy5zZXJ2aWNlTmV0d29ya0FybiA9IHNlcnZpY2VOZXR3b3JrLmF0dHJBcm47XG5cbiAgICBpZiAoKHByb3BzLmFsbG93RXh0ZXJuYWxQcmluY2lwYWxzID8/IGZhbHNlKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuYXV0aFBvbGljeS5hZGRTdGF0ZW1lbnRzKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsndnBjLWxhdHRpY2Utc3ZjczpJbnZva2UnXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgICBjb25kaXRpb25zOiBbe1xuICAgICAgICAgICAgICBTdHJpbmdOb3RFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAnYXdzOlByaW5jaXBhbE9yZ0lEJzogW1xuICAgICAgICAgICAgICAgICAgJ28tMTIzNDU2ZXhhbXBsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH07XG5cbiAgICBpZiAoKHByb3BzLnJlamVjdEFub255bW91c0FjY2VzcyA/PyBmYWxzZSkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYXV0aFBvbGljeS5hZGRTdGF0ZW1lbnRzKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsndnBjLWxhdHRpY2Utc3ZjczpJbnZva2UnXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgICBjb25kaXRpb25zOiBbe1xuICAgICAgICAgICAgICBTdHJpbmdFcXVhbHNJZ25vcmVDYXNlOiB7XG4gICAgICAgICAgICAgICAgJ2F3czpQcmluY2lwYWxUeXBlJzogJ2Fub255bW91cycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIHdpbGwgZ2l2ZSB0aGUgcHJpbmNpcGFscyBhY2Nlc3MgdG8gYWxsIHJlc291cmNlcyB0aGF0IGFyZSBvbiB0aGlzXG4gICAqIHNlcnZpY2UgbmV0d29yay4gVGhpcyBpcyBhIGJyb2FkIHBlcm1pc3Npb24uXG4gICAqIENvbnNpZGVyIGdyYW50aW5nIEFjY2VzcyBhdCB0aGUgU2VydmljZVxuICAgKiBhZGRUb1Jlc291cmNlUG9saWN5KClcbiAgICpcbiAgICovXG4gIHB1YmxpYyBncmFudEFjY2Vzc1RvU2VydmljZU5ldHdvcmsocHJpbmNpcGFsczogaWFtLklQcmluY2lwYWxbXSk6IHZvaWQge1xuXG4gICAgbGV0IHBvbGljeVN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcG9saWN5U3RhdGVtZW50LmFkZEFjdGlvbnMoJ3ZwYy1sYXR0aWNlLXN2Y3M6SW52b2tlJyk7XG4gICAgcG9saWN5U3RhdGVtZW50LmFkZFJlc291cmNlcyh0aGlzLnNlcnZpY2VOZXR3b3JrQXJuKTtcbiAgICBwb2xpY3lTdGF0ZW1lbnQuZWZmZWN0ID0gaWFtLkVmZmVjdC5BTExPVztcblxuICAgIHByaW5jaXBhbHMuZm9yRWFjaCgocHJpbmNpcGFsKSA9PiB7XG4gICAgICBwb2xpY3lTdGF0ZW1lbnQuYWRkUHJpbmNpcGFscyhwcmluY2lwYWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hdXRoUG9saWN5LmFkZFN0YXRlbWVudHMocG9saWN5U3RhdGVtZW50KTtcbiAgfVxuICAvLyBhZGRUb1Jlc291cmNlUG9saWN5KHBlcm1pc3Npb24pXG4gIHB1YmxpYyBhcHBseUF1dGhQb2xpY3lUb1NlcnZpY2VOZXR3b3JrKCk6IHZvaWQge1xuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSBhbnkgZXJyb3JzIHdpdGggdGhlIGF1dGggcG9saWN5XG4gICAgaWYgKHRoaXMuYXV0aFBvbGljeS52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdXRoIFBvbGljeSBmb3IgZ3JhbnRpbmcgYWNjZXNzIG9uICBTZXJ2aWNlIE5ldHdvcmsgaXMgaW52YWxpZFxcbiwgJHt0aGlzLmF1dGhQb2xpY3l9YCk7XG4gICAgfVxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGUgQXV0aFR5cGUgaXMgQVdTX0lBTVxuICAgIGlmICh0aGlzLmF1dGhUeXBlICE9PSBBdXRoVHlwZS5BV1NfSUFNICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdXRoVHlwZSBtdXN0IGJlICR7QXV0aFR5cGUuQVdTX0lBTX0gdG8gYWRkIGFuIEF1dGggUG9saWN5YCk7XG4gICAgfVxuICAgIC8vIGF0dGFjaCB0aGUgQXV0aFBvbGljeSB0byB0aGUgU2VydmljZSBOZXR3b3JrXG4gICAgbmV3IGF3c192cGNsYXR0aWNlLkNmbkF1dGhQb2xpY3kodGhpcywgJ0F1dGhQb2xpY3knLCB7XG4gICAgICBwb2xpY3k6IHRoaXMuYXV0aFBvbGljeS50b0pTT04oKSxcbiAgICAgIHJlc291cmNlSWRlbnRpZmllcjogdGhpcy5zZXJ2aWNlTmV0d29ya0FybixcbiAgICB9KTtcblxuICB9XG4gIC8qKlxuICAgKiBBZGQgQSBsYXR0aWNlIHNlcnZpY2UgdG8gYSBsYXR0aWNlIG5ldHdvcmtcbiAgICogQHBhcmFtIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyBhZGRTZXJ2aWNlKHNlcnZpY2U6IFNlcnZpY2UpOiB2b2lkIHtcbiAgICBuZXcgYXdzX3ZwY2xhdHRpY2UuQ2ZuU2VydmljZU5ldHdvcmtTZXJ2aWNlQXNzb2NpYXRpb24odGhpcywgYExhdHRpY2VTZXJ2aWNlJCR7c2VydmljZS5zZXJ2aWNlSWR9YCwge1xuICAgICAgc2VydmljZUlkZW50aWZpZXI6IHNlcnZpY2Uuc2VydmljZUlkLFxuICAgICAgc2VydmljZU5ldHdvcmtJZGVudGlmaWVyOiB0aGlzLnNlcnZpY2VOZXR3b3JrSWQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXNzb2NpYXRlIGEgVlBDIHdpdGggdGhlIFNlcnZpY2UgTmV0d29ya1xuICAgKiBUaGlzIHByb3ZpZGVzIGFuIG9waW5pb25hdGVkIGRlZmF1bHQgb2YgYWRkaW5nIGEgc2VjdXJpdHkgZ3JvdXAgdG8gYWxsb3cgaW5ib3VuZCA0NDNcbiAgICovXG4gIHB1YmxpYyBhc3NvY2lhdGVWUEMocHJvcHM6IEFzc29jaWF0ZVZQQ1Byb3BzKTogdm9pZCB7XG5cbiAgICBjb25zdCBzZWN1cml0eUdyb3VwSWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgaWYgKHByb3BzLnNlY3VyaXR5R3JvdXBzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgYFNlcnZpY2VOZXR3b3JrU2VjdXJpdHlHcm91cCR7cHJvcHMudnBjLnZwY0lkfWAsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2VydmljZU5ldHdvcmtTZWN1cml0eUdyb3VwJyxcbiAgICAgIH0pO1xuXG4gICAgICBzZWN1cml0eUdyb3VwLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgICBlYzIuUGVlci5pcHY0KHByb3BzLnZwYy52cGNDaWRyQmxvY2spLFxuICAgICAgICBlYzIuUG9ydC50Y3AoNDQzKSxcbiAgICAgICk7XG4gICAgICBzZWN1cml0eUdyb3VwSWRzLnB1c2goc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQpO1xuICAgIH1cblxuICAgIG5ldyBhd3NfdnBjbGF0dGljZS5DZm5TZXJ2aWNlTmV0d29ya1ZwY0Fzc29jaWF0aW9uKHRoaXMsIGAke3Byb3BzLnZwYy52cGNJZH1WcGNBc3NvY2lhdGlvbmAsIC8qIGFsbCBvcHRpb25hbCBwcm9wcyAqLyB7XG4gICAgICBzZWN1cml0eUdyb3VwSWRzOiBzZWN1cml0eUdyb3VwSWRzLFxuICAgICAgc2VydmljZU5ldHdvcmtJZGVudGlmaWVyOiB0aGlzLnNlcnZpY2VOZXR3b3JrSWQsXG4gICAgICB2cGNJZGVudGlmaWVyOiBwcm9wcy52cGMudnBjSWQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBsb2dzIHRvIGEgUzMgYnVja2V0LlxuICAgKiBAcGFyYW0gYnVja2V0XG4gICAqL1xuICBwdWJsaWMgbG9nVG9TMyhidWNrZXQ6IHMzLkJ1Y2tldCB8IHMzLklCdWNrZXQpOiB2b2lkIHtcbiAgICBuZXcgYXdzX3ZwY2xhdHRpY2UuQ2ZuQWNjZXNzTG9nU3Vic2NyaXB0aW9uKHRoaXMsIGBMb2dnaW5ndG9TMyR7YnVja2V0LmJ1Y2tldE5hbWV9YCwge1xuICAgICAgZGVzdGluYXRpb25Bcm46IGJ1Y2tldC5idWNrZXRBcm4sXG4gICAgICByZXNvdXJjZUlkZW50aWZpZXI6IHRoaXMuc2VydmljZU5ldHdvcmtBcm4sXG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFNlbmQgZXZlbnQgdG8gQ2xvdWR3YXRjaFxuICAgKiBAcGFyYW0gbG9nXG4gICAqL1xuICBwdWJsaWMgc2VuZFRvQ2xvdWRXYXRjaChsb2c6IGxvZ3MuTG9nR3JvdXAgfCBsb2dzLklMb2dHcm91cCk6IHZvaWQge1xuICAgIG5ldyBhd3NfdnBjbGF0dGljZS5DZm5BY2Nlc3NMb2dTdWJzY3JpcHRpb24odGhpcywgYExhdHRpQ2xvdWR3YXRjaCR7bG9nLmxvZ0dyb3VwTmFtZX1gLCB7XG4gICAgICBkZXN0aW5hdGlvbkFybjogbG9nLmxvZ0dyb3VwQXJuLFxuICAgICAgcmVzb3VyY2VJZGVudGlmaWVyOiB0aGlzLnNlcnZpY2VOZXR3b3JrQXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmVhbSBFdmVudHMgdG8gS2luZXNpc1xuICAgKiBAcGFyYW0gc3RyZWFtXG4gICAqL1xuICBwdWJsaWMgc3RyZWFtVG9LaW5lc2lzKHN0cmVhbToga2luZXNpcy5TdHJlYW0gfCBraW5lc2lzLklTdHJlYW0pOiB2b2lkIHtcbiAgICBuZXcgYXdzX3ZwY2xhdHRpY2UuQ2ZuQWNjZXNzTG9nU3Vic2NyaXB0aW9uKHRoaXMsIGBMYXR0aWNlS2luZXNpcyR7c3RyZWFtLnN0cmVhbU5hbWV9YCwge1xuICAgICAgZGVzdGluYXRpb25Bcm46IHN0cmVhbS5zdHJlYW1Bcm4sXG4gICAgICByZXNvdXJjZUlkZW50aWZpZXI6IHRoaXMuc2VydmljZU5ldHdvcmtBcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIFRoZSBTZXJ2aWNlIG5ldHdvcmsgdXNpbmcgUkFNXG4gICAqIEBwYXJhbSBwcm9wcyBTaGFyZVNlcnZpY2VOZXR3b3JrXG4gICAqL1xuICBwdWJsaWMgc2hhcmUocHJvcHM6IFNoYXJlU2VydmljZU5ldHdvcmtQcm9wcyk6IHZvaWQge1xuICAgIG5ldyByYW0uQ2ZuUmVzb3VyY2VTaGFyZSh0aGlzLCAnU2VydmljZU5ldHdvcmtTaGFyZScsIHtcbiAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnNlcnZpY2VOZXR3b3JrQXJuXSxcbiAgICAgIGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzOiBwcm9wcy5hbGxvd0V4dGVybmFsUHJpbmNpcGFscyxcbiAgICAgIHByaW5jaXBhbHM6IHByb3BzLnByaW5jaXBhbHMsXG4gICAgfSk7XG4gIH1cblxufVxuXG4iXX0=