"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceAccount = exports.IdentityType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const constructs_1 = require("constructs");
// import { FargateCluster } from './index';
const k8s_manifest_1 = require("./k8s-manifest");
/**
 * Enum representing the different identity types that can be used for a Kubernetes service account.
 */
var IdentityType;
(function (IdentityType) {
    /**
     * Use the IAM Roles for Service Accounts (IRSA) identity type.
     * IRSA allows you to associate an IAM role with a Kubernetes service account.
     * This provides a way to grant permissions to Kubernetes pods by associating an IAM role with a Kubernetes service account.
     * The IAM role can then be used to provide AWS credentials to the pods, allowing them to access other AWS resources.
     *
     * When enabled, the openIdConnectProvider of the cluster would be created when you create the ServiceAccount.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
     */
    IdentityType["IRSA"] = "IRSA";
    /**
     * Use the EKS Pod Identities identity type.
     * EKS Pod Identities provide the ability to manage credentials for your applications, similar to the way that Amazon EC2 instance profiles
     * provide credentials to Amazon EC2 instances. Instead of creating and distributing your AWS credentials to the containers or using the
     * Amazon EC2 instance's role, you associate an IAM role with a Kubernetes service account and configure your Pods to use the service account.
     *
     * When enabled, the Pod Identity Agent AddOn of the cluster would be created when you create the ServiceAccount.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html
     */
    IdentityType["POD_IDENTITY"] = "POD_IDENTITY";
})(IdentityType || (exports.IdentityType = IdentityType = {}));
/**
 * Service Account
 */
class ServiceAccount extends constructs_1.Construct {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.ServiceAccount", version: "0.0.0" };
    /**
     * The role which is linked to the service account.
     */
    role;
    assumeRoleAction;
    grantPrincipal;
    policyFragment;
    /**
     * The name of the service account.
     */
    serviceAccountName;
    /**
     * The namespace where the service account is located in.
     */
    serviceAccountNamespace;
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_ServiceAccountProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServiceAccount);
            }
            throw error;
        }
        const { cluster } = props;
        this.serviceAccountName = props.name ?? core_1.Names.uniqueId(this).toLowerCase();
        this.serviceAccountNamespace = props.namespace ?? 'default';
        // From K8s docs: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
        if (!this.isValidDnsSubdomainName(this.serviceAccountName)) {
            throw RangeError('The name of a ServiceAccount object must be a valid DNS subdomain name.');
        }
        // From K8s docs: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/#namespaces-and-dns
        if (!this.isValidDnsLabelName(this.serviceAccountNamespace)) {
            throw RangeError('All namespace names must be valid RFC 1123 DNS labels.');
        }
        let principal;
        if (props.identityType !== IdentityType.POD_IDENTITY) {
            /* Add conditions to the role to improve security. This prevents other pods in the same namespace to assume the role.
            * See documentation: https://docs.aws.amazon.com/eks/latest/userguide/create-service-account-iam-policy-and-role.html
            */
            const conditions = new core_1.CfnJson(this, 'ConditionJson', {
                value: {
                    [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
                    [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: `system:serviceaccount:${this.serviceAccountNamespace}:${this.serviceAccountName}`,
                },
            });
            principal = new aws_iam_1.OpenIdConnectPrincipal(cluster.openIdConnectProvider).withConditions({
                StringEquals: conditions,
            });
        }
        else {
            /**
             * Identity type is POD_IDENTITY.
             * Create a service principal with "Service": "pods.eks.amazonaws.com"
             * See https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html
             */
            // EKS Pod Identity does not support Fargate
            // TODO: raise an error when using Fargate
            principal = new aws_iam_1.ServicePrincipal('pods.eks.amazonaws.com');
        }
        const role = new aws_iam_1.Role(this, 'Role', { assumedBy: principal });
        // pod identities requires 'sts:TagSession' in its principal actions
        if (props.identityType === IdentityType.POD_IDENTITY) {
            /**
             * EKS Pod Identities requires both assumed role actions otherwise it would fail.
             */
            role.assumeRolePolicy.addStatements(new aws_iam_1.PolicyStatement({
                actions: ['sts:AssumeRole', 'sts:TagSession'],
                principals: [new aws_iam_1.ServicePrincipal('pods.eks.amazonaws.com')],
            }));
            // ensure the pod identity agent
            cluster.eksPodIdentityAgent;
            // associate this service account with the pod role we just created for the cluster
            new aws_eks_1.CfnPodIdentityAssociation(this, 'Association', {
                clusterName: cluster.clusterName,
                namespace: props.namespace ?? 'default',
                roleArn: role.roleArn,
                serviceAccount: this.serviceAccountName,
            });
        }
        this.role = role;
        this.assumeRoleAction = this.role.assumeRoleAction;
        this.grantPrincipal = this.role.grantPrincipal;
        this.policyFragment = this.role.policyFragment;
        // Note that we cannot use `cluster.addManifest` here because that would create the manifest
        // constrct in the scope of the cluster stack, which might be a different stack than this one.
        // This means that the cluster stack would depend on this stack because of the role,
        // and since this stack inherintely depends on the cluster stack, we will have a circular dependency.
        new k8s_manifest_1.KubernetesManifest(this, `manifest-${id}ServiceAccountResource`, {
            cluster,
            manifest: [{
                    apiVersion: 'v1',
                    kind: 'ServiceAccount',
                    metadata: {
                        name: this.serviceAccountName,
                        namespace: this.serviceAccountNamespace,
                        labels: {
                            'app.kubernetes.io/name': this.serviceAccountName,
                            ...props.labels,
                        },
                        annotations: {
                            'eks.amazonaws.com/role-arn': this.role.roleArn,
                            ...props.annotations,
                        },
                    },
                }],
        });
    }
    /**
     * @deprecated use `addToPrincipalPolicy()`
     */
    addToPolicy(statement) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-v2-alpha.ServiceAccount#addToPolicy", "use `addToPrincipalPolicy()`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPolicy);
            }
            throw error;
        }
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
    addToPrincipalPolicy(statement) {
        return this.role.addToPrincipalPolicy(statement);
    }
    /**
     * If the value is a DNS subdomain name as defined in RFC 1123, from K8s docs.
     *
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
     */
    isValidDnsSubdomainName(value) {
        return value.length <= 253 && /^[a-z0-9]+[a-z0-9-.]*[a-z0-9]+$/.test(value);
    }
    /**
     * If the value follows DNS label standard as defined in RFC 1123, from K8s docs.
     *
     * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
     */
    isValidDnsLabelName(value) {
        return value.length <= 63 && /^[a-z0-9]+[a-z0-9-]*[a-z0-9]+$/.test(value);
    }
}
exports.ServiceAccount = ServiceAccount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1hY2NvdW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmljZS1hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaURBQWdFO0FBQ2hFLGlEQUc2QjtBQUM3QiwyQ0FBa0Q7QUFDbEQsMkNBQXVDO0FBRXZDLDRDQUE0QztBQUM1QyxpREFBb0Q7QUFFcEQ7O0dBRUc7QUFDSCxJQUFZLFlBd0JYO0FBeEJELFdBQVksWUFBWTtJQUN0Qjs7Ozs7Ozs7O09BU0c7SUFDSCw2QkFBYSxDQUFBO0lBRWI7Ozs7Ozs7OztPQVNHO0lBQ0gsNkNBQTZCLENBQUE7QUFDL0IsQ0FBQyxFQXhCVyxZQUFZLDRCQUFaLFlBQVksUUF3QnZCO0FBd0ZEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsc0JBQVM7O0lBQzNDOztPQUVHO0lBQ2EsSUFBSSxDQUFRO0lBRVosZ0JBQWdCLENBQVM7SUFDekIsY0FBYyxDQUFhO0lBQzNCLGNBQWMsQ0FBMEI7SUFFeEQ7O09BRUc7SUFDYSxrQkFBa0IsQ0FBUztJQUUzQzs7T0FFRztJQUNhLHVCQUF1QixDQUFTO0lBRWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXJCUixjQUFjOzs7O1FBdUJ2QixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO1FBRTVELHFHQUFxRztRQUNyRyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENB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QUUsSUFBSSxDQUFDLGtCQUFrQjt3QkFDN0IsU0FBUyxFQUFFLElBQUksQ0FBQyx1QkFBdUI7d0JBQ3ZDLE1BQU0sRUFBRTs0QkFDTix3QkFBd0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCOzRCQUNqRCxHQUFHLEtBQUssQ0FBQyxNQUFNO3lCQUNoQjt3QkFDRCxXQUFXLEVBQUU7NEJBQ1gsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPOzRCQUMvQyxHQUFHLEtBQUssQ0FBQyxXQUFXO3lCQUNyQjtxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDNUQ7SUFFTSxvQkFBb0IsQ0FBQyxTQUEwQjtRQUNwRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDbEQ7SUFFRDs7OztPQUlHO0lBQ0ssdUJBQXVCLENBQUMsS0FBYTtRQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3RTtJQUVEOzs7O09BSUc7SUFDSyxtQkFBbUIsQ0FBQyxLQUFhO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUksZ0NBQWdDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNFOztBQWpKSCx3Q0FrSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5Qb2RJZGVudGl0eUFzc29jaWF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5pbXBvcnQge1xuICBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCwgSVByaW5jaXBhbCwgSVJvbGUsIE9wZW5JZENvbm5lY3RQcmluY2lwYWwsIFBvbGljeVN0YXRlbWVudCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQsIFJvbGUsXG4gIFNlcnZpY2VQcmluY2lwYWwsXG59IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ2ZuSnNvbiwgTmFtZXMgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuLy8gaW1wb3J0IHsgRmFyZ2F0ZUNsdXN0ZXIgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IEt1YmVybmV0ZXNNYW5pZmVzdCB9IGZyb20gJy4vazhzLW1hbmlmZXN0JztcblxuLyoqXG4gKiBFbnVtIHJlcHJlc2VudGluZyB0aGUgZGlmZmVyZW50IGlkZW50aXR5IHR5cGVzIHRoYXQgY2FuIGJlIHVzZWQgZm9yIGEgS3ViZXJuZXRlcyBzZXJ2aWNlIGFjY291bnQuXG4gKi9cbmV4cG9ydCBlbnVtIElkZW50aXR5VHlwZSB7XG4gIC8qKlxuICAgKiBVc2UgdGhlIElBTSBSb2xlcyBmb3IgU2VydmljZSBBY2NvdW50cyAoSVJTQSkgaWRlbnRpdHkgdHlwZS5cbiAgICogSVJTQSBhbGxvd3MgeW91IHRvIGFzc29jaWF0ZSBhbiBJQU0gcm9sZSB3aXRoIGEgS3ViZXJuZXRlcyBzZXJ2aWNlIGFjY291bnQuXG4gICAqIFRoaXMgcHJvdmlkZXMgYSB3YXkgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG8gS3ViZXJuZXRlcyBwb2RzIGJ5IGFzc29jaWF0aW5nIGFuIElBTSByb2xlIHdpdGggYSBLdWJlcm5ldGVzIHNlcnZpY2UgYWNjb3VudC5cbiAgICogVGhlIElBTSByb2xlIGNhbiB0aGVuIGJlIHVzZWQgdG8gcHJvdmlkZSBBV1MgY3JlZGVudGlhbHMgdG8gdGhlIHBvZHMsIGFsbG93aW5nIHRoZW0gdG8gYWNjZXNzIG90aGVyIEFXUyByZXNvdXJjZXMuXG4gICAqXG4gICAqIFdoZW4gZW5hYmxlZCwgdGhlIG9wZW5JZENvbm5lY3RQcm92aWRlciBvZiB0aGUgY2x1c3RlciB3b3VsZCBiZSBjcmVhdGVkIHdoZW4geW91IGNyZWF0ZSB0aGUgU2VydmljZUFjY291bnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2lhbS1yb2xlcy1mb3Itc2VydmljZS1hY2NvdW50cy5odG1sXG4gICAqL1xuICBJUlNBID0gJ0lSU0EnLFxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIEVLUyBQb2QgSWRlbnRpdGllcyBpZGVudGl0eSB0eXBlLlxuICAgKiBFS1MgUG9kIElkZW50aXRpZXMgcHJvdmlkZSB0aGUgYWJpbGl0eSB0byBtYW5hZ2UgY3JlZGVudGlhbHMgZm9yIHlvdXIgYXBwbGljYXRpb25zLCBzaW1pbGFyIHRvIHRoZSB3YXkgdGhhdCBBbWF6b24gRUMyIGluc3RhbmNlIHByb2ZpbGVzXG4gICAqIHByb3ZpZGUgY3JlZGVudGlhbHMgdG8gQW1hem9uIEVDMiBpbnN0YW5jZXMuIEluc3RlYWQgb2YgY3JlYXRpbmcgYW5kIGRpc3RyaWJ1dGluZyB5b3VyIEFXUyBjcmVkZW50aWFscyB0byB0aGUgY29udGFpbmVycyBvciB1c2luZyB0aGVcbiAgICogQW1hem9uIEVDMiBpbnN0YW5jZSdzIHJvbGUsIHlvdSBhc3NvY2lhdGUgYW4gSUFNIHJvbGUgd2l0aCBhIEt1YmVybmV0ZXMgc2VydmljZSBhY2NvdW50IGFuZCBjb25maWd1cmUgeW91ciBQb2RzIHRvIHVzZSB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBXaGVuIGVuYWJsZWQsIHRoZSBQb2QgSWRlbnRpdHkgQWdlbnQgQWRkT24gb2YgdGhlIGNsdXN0ZXIgd291bGQgYmUgY3JlYXRlZCB3aGVuIHlvdSBjcmVhdGUgdGhlIFNlcnZpY2VBY2NvdW50LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9wb2QtaWRlbnRpdGllcy5odG1sXG4gICAqL1xuICBQT0RfSURFTlRJVFkgPSAnUE9EX0lERU5USVRZJyxcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBgU2VydmljZUFjY291bnRgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZUFjY291bnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqXG4gICAqIFRoZSBuYW1lIG9mIGEgU2VydmljZUFjY291bnQgb2JqZWN0IG11c3QgYmUgYSB2YWxpZCBETlMgc3ViZG9tYWluIG5hbWUuXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL2NvbmZpZ3VyZS1wb2QtY29udGFpbmVyL2NvbmZpZ3VyZS1zZXJ2aWNlLWFjY291bnQvXG4gICAqIEBkZWZhdWx0IC0gSWYgbm8gbmFtZSBpcyBnaXZlbiwgaXQgd2lsbCB1c2UgdGhlIGlkIG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICogQWxsIG5hbWVzcGFjZSBuYW1lcyBtdXN0IGJlIHZhbGlkIFJGQyAxMTIzIEROUyBsYWJlbHMuXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzcGFjZXMvI25hbWVzcGFjZXMtYW5kLWRuc1xuICAgKiBAZGVmYXVsdCBcImRlZmF1bHRcIlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGFubm90YXRpb25zIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBhbm5vdGF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgYW5ub3RhdGlvbnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGxhYmVscyBvZiB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgbGFiZWxzXG4gICAqL1xuICByZWFkb25seSBsYWJlbHM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBUaGUgaWRlbnRpdHkgdHlwZSB0byB1c2UgZm9yIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqIEBkZWZhdWx0IElkZW50aXR5VHlwZS5JUlNBXG4gICAqL1xuICByZWFkb25seSBpZGVudGl0eVR5cGU/OiBJZGVudGl0eVR5cGU7XG59XG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VBY2NvdW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBUaGUgbmFtZSBvZiBhIFNlcnZpY2VBY2NvdW50IG9iamVjdCBtdXN0IGJlIGEgdmFsaWQgRE5TIHN1YmRvbWFpbiBuYW1lLlxuICAgKiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy90YXNrcy9jb25maWd1cmUtcG9kLWNvbnRhaW5lci9jb25maWd1cmUtc2VydmljZS1hY2NvdW50L1xuICAgKiBAZGVmYXVsdCAtIElmIG5vIG5hbWUgaXMgZ2l2ZW4sIGl0IHdpbGwgdXNlIHRoZSBpZCBvZiB0aGUgcmVzb3VyY2UuXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZXNwYWNlIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqXG4gICAqIEFsbCBuYW1lc3BhY2UgbmFtZXMgbXVzdCBiZSB2YWxpZCBSRkMgMTEyMyBETlMgbGFiZWxzLlxuICAgKiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lc3BhY2VzLyNuYW1lc3BhY2VzLWFuZC1kbnNcbiAgICogQGRlZmF1bHQgXCJkZWZhdWx0XCJcbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzcGFjZT86IHN0cmluZztcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBhbm5vdGF0aW9ucyBvZiB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgYW5ub3RhdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGFubm90YXRpb25zPzoge1trZXk6c3RyaW5nXTogc3RyaW5nfTtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBsYWJlbHMgb2YgdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIGxhYmVsc1xuICAgKi9cbiAgcmVhZG9ubHkgbGFiZWxzPzoge1trZXk6c3RyaW5nXTogc3RyaW5nfTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBzZXJ2aWNlIGFjY291bnRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZUFjY291bnRQcm9wcyBleHRlbmRzIFNlcnZpY2VBY2NvdW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciB0byBhcHBseSB0aGUgcGF0Y2ggdG8uXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBTZXJ2aWNlIEFjY291bnRcbiAqL1xuZXhwb3J0IGNsYXNzIFNlcnZpY2VBY2NvdW50IGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSVByaW5jaXBhbCB7XG4gIC8qKlxuICAgKiBUaGUgcm9sZSB3aGljaCBpcyBsaW5rZWQgdG8gdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlOiBJUm9sZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZUFjdGlvbjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG4gIHB1YmxpYyByZWFkb25seSBwb2xpY3lGcmFnbWVudDogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZUFjY291bnROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lc3BhY2Ugd2hlcmUgdGhlIHNlcnZpY2UgYWNjb3VudCBpcyBsb2NhdGVkIGluLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VBY2NvdW50TmFtZXNwYWNlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlcnZpY2VBY2NvdW50UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgeyBjbHVzdGVyIH0gPSBwcm9wcztcbiAgICB0aGlzLnNlcnZpY2VBY2NvdW50TmFtZSA9IHByb3BzLm5hbWUgPz8gTmFtZXMudW5pcXVlSWQodGhpcykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnNlcnZpY2VBY2NvdW50TmFtZXNwYWNlID0gcHJvcHMubmFtZXNwYWNlID8/ICdkZWZhdWx0JztcblxuICAgIC8vIEZyb20gSzhzIGRvY3M6IGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL2NvbmZpZ3VyZS1wb2QtY29udGFpbmVyL2NvbmZpZ3VyZS1zZXJ2aWNlLWFjY291bnQvXG4gICAgaWYgKCF0aGlzLmlzVmFsaWREbnNTdWJkb21haW5OYW1lKHRoaXMuc2VydmljZUFjY291bnROYW1lKSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcignVGhlIG5hbWUgb2YgYSBTZXJ2aWNlQWNjb3VudCBvYmplY3QgbXVzdCBiZSBhIHZhbGlkIEROUyBzdWJkb21haW4gbmFtZS4nKTtcbiAgICB9XG5cbiAgICAvLyBGcm9tIEs4cyBkb2NzOiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lc3BhY2VzLyNuYW1lc3BhY2VzLWFuZC1kbnNcbiAgICBpZiAoIXRoaXMuaXNWYWxpZERuc0xhYmVsTmFtZSh0aGlzLnNlcnZpY2VBY2NvdW50TmFtZXNwYWNlKSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcignQWxsIG5hbWVzcGFjZSBuYW1lcyBtdXN0IGJlIHZhbGlkIFJGQyAxMTIzIEROUyBsYWJlbHMuJyk7XG4gICAgfVxuXG4gICAgbGV0IHByaW5jaXBhbDogSVByaW5jaXBhbDtcbiAgICBpZiAocHJvcHMuaWRlbnRpdHlUeXBlICE9PSBJZGVudGl0eVR5cGUuUE9EX0lERU5USVRZKSB7XG4gICAgICAvKiBBZGQgY29uZGl0aW9ucyB0byB0aGUgcm9sZSB0byBpbXByb3ZlIHNlY3VyaXR5LiBUaGlzIHByZXZlbnRzIG90aGVyIHBvZHMgaW4gdGhlIHNhbWUgbmFtZXNwYWNlIHRvIGFzc3VtZSB0aGUgcm9sZS5cbiAgICAgICogU2VlIGRvY3VtZW50YXRpb246IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9jcmVhdGUtc2VydmljZS1hY2NvdW50LWlhbS1wb2xpY3ktYW5kLXJvbGUuaHRtbFxuICAgICAgKi9cbiAgICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBuZXcgQ2ZuSnNvbih0aGlzLCAnQ29uZGl0aW9uSnNvbicsIHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBbYCR7Y2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyfTphdWRgXTogJ3N0cy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICBbYCR7Y2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyfTpzdWJgXTogYHN5c3RlbTpzZXJ2aWNlYWNjb3VudDoke3RoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2V9OiR7dGhpcy5zZXJ2aWNlQWNjb3VudE5hbWV9YCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgcHJpbmNpcGFsID0gbmV3IE9wZW5JZENvbm5lY3RQcmluY2lwYWwoY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIpLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiBjb25kaXRpb25zLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKlxuICAgICAgICogSWRlbnRpdHkgdHlwZSBpcyBQT0RfSURFTlRJVFkuXG4gICAgICAgKiBDcmVhdGUgYSBzZXJ2aWNlIHByaW5jaXBhbCB3aXRoIFwiU2VydmljZVwiOiBcInBvZHMuZWtzLmFtYXpvbmF3cy5jb21cIlxuICAgICAgICogU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9wb2QtaWRlbnRpdGllcy5odG1sXG4gICAgICAgKi9cblxuICAgICAgLy8gRUtTIFBvZCBJZGVudGl0eSBkb2VzIG5vdCBzdXBwb3J0IEZhcmdhdGVcbiAgICAgIC8vIFRPRE86IHJhaXNlIGFuIGVycm9yIHdoZW4gdXNpbmcgRmFyZ2F0ZVxuICAgICAgcHJpbmNpcGFsID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3BvZHMuZWtzLmFtYXpvbmF3cy5jb20nKTtcbiAgICB9XG5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUodGhpcywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogcHJpbmNpcGFsIH0pO1xuXG4gICAgLy8gcG9kIGlkZW50aXRpZXMgcmVxdWlyZXMgJ3N0czpUYWdTZXNzaW9uJyBpbiBpdHMgcHJpbmNpcGFsIGFjdGlvbnNcbiAgICBpZiAocHJvcHMuaWRlbnRpdHlUeXBlID09PSBJZGVudGl0eVR5cGUuUE9EX0lERU5USVRZKSB7XG4gICAgICAvKipcbiAgICAgICAqIEVLUyBQb2QgSWRlbnRpdGllcyByZXF1aXJlcyBib3RoIGFzc3VtZWQgcm9sZSBhY3Rpb25zIG90aGVyd2lzZSBpdCB3b3VsZCBmYWlsLlxuICAgICAgICovXG4gICAgICByb2xlLmFzc3VtZVJvbGVQb2xpY3khLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnc3RzOkFzc3VtZVJvbGUnLCAnc3RzOlRhZ1Nlc3Npb24nXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdwb2RzLmVrcy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyBlbnN1cmUgdGhlIHBvZCBpZGVudGl0eSBhZ2VudFxuICAgICAgY2x1c3Rlci5la3NQb2RJZGVudGl0eUFnZW50O1xuXG4gICAgICAvLyBhc3NvY2lhdGUgdGhpcyBzZXJ2aWNlIGFjY291bnQgd2l0aCB0aGUgcG9kIHJvbGUgd2UganVzdCBjcmVhdGVkIGZvciB0aGUgY2x1c3RlclxuICAgICAgbmV3IENmblBvZElkZW50aXR5QXNzb2NpYXRpb24odGhpcywgJ0Fzc29jaWF0aW9uJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgICAgbmFtZXNwYWNlOiBwcm9wcy5uYW1lc3BhY2UgPz8gJ2RlZmF1bHQnLFxuICAgICAgICByb2xlQXJuOiByb2xlLnJvbGVBcm4sXG4gICAgICAgIHNlcnZpY2VBY2NvdW50OiB0aGlzLnNlcnZpY2VBY2NvdW50TmFtZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucm9sZSA9IHJvbGU7XG5cbiAgICB0aGlzLmFzc3VtZVJvbGVBY3Rpb24gPSB0aGlzLnJvbGUuYXNzdW1lUm9sZUFjdGlvbjtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcy5yb2xlLmdyYW50UHJpbmNpcGFsO1xuICAgIHRoaXMucG9saWN5RnJhZ21lbnQgPSB0aGlzLnJvbGUucG9saWN5RnJhZ21lbnQ7XG5cbiAgICAvLyBOb3RlIHRoYXQgd2UgY2Fubm90IHVzZSBgY2x1c3Rlci5hZGRNYW5pZmVzdGAgaGVyZSBiZWNhdXNlIHRoYXQgd291bGQgY3JlYXRlIHRoZSBtYW5pZmVzdFxuICAgIC8vIGNvbnN0cmN0IGluIHRoZSBzY29wZSBvZiB0aGUgY2x1c3RlciBzdGFjaywgd2hpY2ggbWlnaHQgYmUgYSBkaWZmZXJlbnQgc3RhY2sgdGhhbiB0aGlzIG9uZS5cbiAgICAvLyBUaGlzIG1lYW5zIHRoYXQgdGhlIGNsdXN0ZXIgc3RhY2sgd291bGQgZGVwZW5kIG9uIHRoaXMgc3RhY2sgYmVjYXVzZSBvZiB0aGUgcm9sZSxcbiAgICAvLyBhbmQgc2luY2UgdGhpcyBzdGFjayBpbmhlcmludGVseSBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrLCB3ZSB3aWxsIGhhdmUgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgYG1hbmlmZXN0LSR7aWR9U2VydmljZUFjY291bnRSZXNvdXJjZWAsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdDogW3tcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1NlcnZpY2VBY2NvdW50JyxcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnNlcnZpY2VBY2NvdW50TmFtZSxcbiAgICAgICAgICBuYW1lc3BhY2U6IHRoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2UsXG4gICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAnYXBwLmt1YmVybmV0ZXMuaW8vbmFtZSc6IHRoaXMuc2VydmljZUFjY291bnROYW1lLFxuICAgICAgICAgICAgLi4ucHJvcHMubGFiZWxzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFybic6IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgICAgICAgLi4ucHJvcHMuYW5ub3RhdGlvbnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYWRkVG9QcmluY2lwYWxQb2xpY3koKWBcbiAgICovXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgcmV0dXJuIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSB2YWx1ZSBpcyBhIEROUyBzdWJkb21haW4gbmFtZSBhcyBkZWZpbmVkIGluIFJGQyAxMTIzLCBmcm9tIEs4cyBkb2NzLlxuICAgKlxuICAgKiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lcy8jZG5zLXN1YmRvbWFpbi1uYW1lc1xuICAgKi9cbiAgcHJpdmF0ZSBpc1ZhbGlkRG5zU3ViZG9tYWluTmFtZSh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSAyNTMgJiYgL15bYS16MC05XStbYS16MC05LS5dKlthLXowLTldKyQvLnRlc3QodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSB2YWx1ZSBmb2xsb3dzIEROUyBsYWJlbCBzdGFuZGFyZCBhcyBkZWZpbmVkIGluIFJGQyAxMTIzLCBmcm9tIEs4cyBkb2NzLlxuICAgKlxuICAgKiBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9jb25jZXB0cy9vdmVydmlldy93b3JraW5nLXdpdGgtb2JqZWN0cy9uYW1lcy8jZG5zLWxhYmVsLW5hbWVzXG4gICAqL1xuICBwcml2YXRlIGlzVmFsaWREbnNMYWJlbE5hbWUodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPD0gNjMgJiYgL15bYS16MC05XStbYS16MC05LV0qW2EtejAtOV0rJC8udGVzdCh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==