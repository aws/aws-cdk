"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceAccount = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const k8s_manifest_1 = require("./k8s-manifest");
/**
 * Service Account
 */
class ServiceAccount extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_ServiceAccountProps(props);
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
        /* Add conditions to the role to improve security. This prevents other pods in the same namespace to assume the role.
        * See documentation: https://docs.aws.amazon.com/eks/latest/userguide/create-service-account-iam-policy-and-role.html
        */
        const conditions = new core_1.CfnJson(this, 'ConditionJson', {
            value: {
                [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
                [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: `system:serviceaccount:${this.serviceAccountNamespace}:${this.serviceAccountName}`,
            },
        });
        const principal = new aws_iam_1.OpenIdConnectPrincipal(cluster.openIdConnectProvider).withConditions({
            StringEquals: conditions,
        });
        this.role = new aws_iam_1.Role(this, 'Role', { assumedBy: principal });
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks.ServiceAccount#addToPolicy", "use `addToPrincipalPolicy()`");
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
_a = JSII_RTTI_SYMBOL_1;
ServiceAccount[_a] = { fqn: "@aws-cdk/aws-eks.ServiceAccount", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1hY2NvdW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmljZS1hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUF5SjtBQUN6Six3Q0FBK0M7QUFDL0MsMkNBQXVDO0FBRXZDLGlEQUFvRDtBQWlEcEQ7O0dBRUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxzQkFBUztJQW9CM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBckJSLGNBQWM7Ozs7UUF1QnZCLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzRSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUM7UUFFNUQscUdBQXFHO1FBQ3JHLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDMUQsTUFBTSxVQUFVLENBQUMseUVBQXlFLENBQUMsQ0FBQztTQUM3RjtRQUVELGtIQUFrSDtRQUNsSCxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO1lBQzNELE1BQU0sVUFBVSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7U0FDNUU7UUFFRDs7VUFFRTtRQUNGLE1BQU0sVUFBVSxHQUFHLElBQUksY0FBTyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDcEQsS0FBSyxFQUFFO2dCQUNMLENBQUMsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLE1BQU0sQ0FBQyxFQUFFLG1CQUFtQjtnQkFDekYsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsTUFBTSxDQUFDLEVBQUUseUJBQXlCLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7YUFDeko7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLGdDQUFzQixDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLGNBQWMsQ0FBQztZQUN6RixZQUFZLEVBQUUsVUFBVTtTQUN6QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFL0MsNEZBQTRGO1FBQzVGLDhGQUE4RjtRQUM5RixvRkFBb0Y7UUFDcEYscUdBQXFHO1FBQ3JHLElBQUksaUNBQWtCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSx3QkFBd0IsRUFBRTtZQUNuRSxPQUFPO1lBQ1AsUUFBUSxFQUFFLENBQUM7b0JBQ1QsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLFFBQVEsRUFBRTt3QkFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjt3QkFDN0IsU0FBUyxFQUFFLElBQUksQ0FBQyx1QkFBdUI7d0JBQ3ZDLE1BQU0sRUFBRTs0QkFDTix3QkFBd0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCOzRCQUNqRCxHQUFHLEtBQUssQ0FBQyxNQUFNO3lCQUNoQjt3QkFDRCxXQUFXLEVBQUU7NEJBQ1gsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPOzRCQUMvQyxHQUFHLEtBQUssQ0FBQyxXQUFXO3lCQUNyQjtxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBRUo7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDNUQ7SUFFTSxvQkFBb0IsQ0FBQyxTQUEwQjtRQUNwRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDbEQ7SUFFRDs7OztPQUlHO0lBQ0ssdUJBQXVCLENBQUMsS0FBYTtRQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3RTtJQUVEOzs7O09BSUc7SUFDSyxtQkFBbUIsQ0FBQyxLQUFhO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLElBQUksZ0NBQWdDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNFOztBQTVHSCx3Q0E2R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCwgSVByaW5jaXBhbCwgSVJvbGUsIE9wZW5JZENvbm5lY3RQcmluY2lwYWwsIFBvbGljeVN0YXRlbWVudCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQsIFJvbGUgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IENmbkpzb24sIE5hbWVzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElDbHVzdGVyIH0gZnJvbSAnLi9jbHVzdGVyJztcbmltcG9ydCB7IEt1YmVybmV0ZXNNYW5pZmVzdCB9IGZyb20gJy4vazhzLW1hbmlmZXN0JztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBgU2VydmljZUFjY291bnRgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZUFjY291bnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqXG4gICAqIFRoZSBuYW1lIG9mIGEgU2VydmljZUFjY291bnQgb2JqZWN0IG11c3QgYmUgYSB2YWxpZCBETlMgc3ViZG9tYWluIG5hbWUuXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3Rhc2tzL2NvbmZpZ3VyZS1wb2QtY29udGFpbmVyL2NvbmZpZ3VyZS1zZXJ2aWNlLWFjY291bnQvXG4gICAqIEBkZWZhdWx0IC0gSWYgbm8gbmFtZSBpcyBnaXZlbiwgaXQgd2lsbCB1c2UgdGhlIGlkIG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICogQWxsIG5hbWVzcGFjZSBuYW1lcyBtdXN0IGJlIHZhbGlkIFJGQyAxMTIzIEROUyBsYWJlbHMuXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzcGFjZXMvI25hbWVzcGFjZXMtYW5kLWRuc1xuICAgKiBAZGVmYXVsdCBcImRlZmF1bHRcIlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGFubm90YXRpb25zIG9mIHRoZSBzZXJ2aWNlIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBhbm5vdGF0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgYW5ub3RhdGlvbnM/OiB7W2tleTpzdHJpbmddOiBzdHJpbmd9O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGxhYmVscyBvZiB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgbGFiZWxzXG4gICAqL1xuICByZWFkb25seSBsYWJlbHM/OiB7W2tleTpzdHJpbmddOiBzdHJpbmd9O1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIHNlcnZpY2UgYWNjb3VudHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlQWNjb3VudFByb3BzIGV4dGVuZHMgU2VydmljZUFjY291bnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRvIGFwcGx5IHRoZSBwYXRjaCB0by5cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xufVxuXG4vKipcbiAqIFNlcnZpY2UgQWNjb3VudFxuICovXG5leHBvcnQgY2xhc3MgU2VydmljZUFjY291bnQgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJUHJpbmNpcGFsIHtcbiAgLyoqXG4gICAqIFRoZSByb2xlIHdoaWNoIGlzIGxpbmtlZCB0byB0aGUgc2VydmljZSBhY2NvdW50LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU6IElSb2xlO1xuXG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcbiAgcHVibGljIHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudDtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlQWNjb3VudE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSB3aGVyZSB0aGUgc2VydmljZSBhY2NvdW50IGlzIGxvY2F0ZWQgaW4uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZUFjY291bnROYW1lc3BhY2U6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2VydmljZUFjY291bnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCB7IGNsdXN0ZXIgfSA9IHByb3BzO1xuICAgIHRoaXMuc2VydmljZUFjY291bnROYW1lID0gcHJvcHMubmFtZSA/PyBOYW1lcy51bmlxdWVJZCh0aGlzKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2UgPSBwcm9wcy5uYW1lc3BhY2UgPz8gJ2RlZmF1bHQnO1xuXG4gICAgLy8gRnJvbSBLOHMgZG9jczogaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvdGFza3MvY29uZmlndXJlLXBvZC1jb250YWluZXIvY29uZmlndXJlLXNlcnZpY2UtYWNjb3VudC9cbiAgICBpZiAoIXRoaXMuaXNWYWxpZERuc1N1YmRvbWFpbk5hbWUodGhpcy5zZXJ2aWNlQWNjb3VudE5hbWUpKSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCdUaGUgbmFtZSBvZiBhIFNlcnZpY2VBY2NvdW50IG9iamVjdCBtdXN0IGJlIGEgdmFsaWQgRE5TIHN1YmRvbWFpbiBuYW1lLicpO1xuICAgIH1cblxuICAgIC8vIEZyb20gSzhzIGRvY3M6IGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzcGFjZXMvI25hbWVzcGFjZXMtYW5kLWRuc1xuICAgIGlmICghdGhpcy5pc1ZhbGlkRG5zTGFiZWxOYW1lKHRoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2UpKSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCdBbGwgbmFtZXNwYWNlIG5hbWVzIG11c3QgYmUgdmFsaWQgUkZDIDExMjMgRE5TIGxhYmVscy4nKTtcbiAgICB9XG5cbiAgICAvKiBBZGQgY29uZGl0aW9ucyB0byB0aGUgcm9sZSB0byBpbXByb3ZlIHNlY3VyaXR5LiBUaGlzIHByZXZlbnRzIG90aGVyIHBvZHMgaW4gdGhlIHNhbWUgbmFtZXNwYWNlIHRvIGFzc3VtZSB0aGUgcm9sZS5cbiAgICAqIFNlZSBkb2N1bWVudGF0aW9uOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRlLXNlcnZpY2UtYWNjb3VudC1pYW0tcG9saWN5LWFuZC1yb2xlLmh0bWxcbiAgICAqL1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBuZXcgQ2ZuSnNvbih0aGlzLCAnQ29uZGl0aW9uSnNvbicsIHtcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIFtgJHtjbHVzdGVyLm9wZW5JZENvbm5lY3RQcm92aWRlci5vcGVuSWRDb25uZWN0UHJvdmlkZXJJc3N1ZXJ9OmF1ZGBdOiAnc3RzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICBbYCR7Y2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyfTpzdWJgXTogYHN5c3RlbTpzZXJ2aWNlYWNjb3VudDoke3RoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2V9OiR7dGhpcy5zZXJ2aWNlQWNjb3VudE5hbWV9YCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gbmV3IE9wZW5JZENvbm5lY3RQcmluY2lwYWwoY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIpLndpdGhDb25kaXRpb25zKHtcbiAgICAgIFN0cmluZ0VxdWFsczogY29uZGl0aW9ucyxcbiAgICB9KTtcbiAgICB0aGlzLnJvbGUgPSBuZXcgUm9sZSh0aGlzLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBwcmluY2lwYWwgfSk7XG5cbiAgICB0aGlzLmFzc3VtZVJvbGVBY3Rpb24gPSB0aGlzLnJvbGUuYXNzdW1lUm9sZUFjdGlvbjtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcy5yb2xlLmdyYW50UHJpbmNpcGFsO1xuICAgIHRoaXMucG9saWN5RnJhZ21lbnQgPSB0aGlzLnJvbGUucG9saWN5RnJhZ21lbnQ7XG5cbiAgICAvLyBOb3RlIHRoYXQgd2UgY2Fubm90IHVzZSBgY2x1c3Rlci5hZGRNYW5pZmVzdGAgaGVyZSBiZWNhdXNlIHRoYXQgd291bGQgY3JlYXRlIHRoZSBtYW5pZmVzdFxuICAgIC8vIGNvbnN0cmN0IGluIHRoZSBzY29wZSBvZiB0aGUgY2x1c3RlciBzdGFjaywgd2hpY2ggbWlnaHQgYmUgYSBkaWZmZXJlbnQgc3RhY2sgdGhhbiB0aGlzIG9uZS5cbiAgICAvLyBUaGlzIG1lYW5zIHRoYXQgdGhlIGNsdXN0ZXIgc3RhY2sgd291bGQgZGVwZW5kIG9uIHRoaXMgc3RhY2sgYmVjYXVzZSBvZiB0aGUgcm9sZSxcbiAgICAvLyBhbmQgc2luY2UgdGhpcyBzdGFjayBpbmhlcmludGVseSBkZXBlbmRzIG9uIHRoZSBjbHVzdGVyIHN0YWNrLCB3ZSB3aWxsIGhhdmUgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgYG1hbmlmZXN0LSR7aWR9U2VydmljZUFjY291bnRSZXNvdXJjZWAsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdDogW3tcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1NlcnZpY2VBY2NvdW50JyxcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnNlcnZpY2VBY2NvdW50TmFtZSxcbiAgICAgICAgICBuYW1lc3BhY2U6IHRoaXMuc2VydmljZUFjY291bnROYW1lc3BhY2UsXG4gICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAnYXBwLmt1YmVybmV0ZXMuaW8vbmFtZSc6IHRoaXMuc2VydmljZUFjY291bnROYW1lLFxuICAgICAgICAgICAgLi4ucHJvcHMubGFiZWxzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFybic6IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgICAgICAgLi4ucHJvcHMuYW5ub3RhdGlvbnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBhZGRUb1ByaW5jaXBhbFBvbGljeSgpYFxuICAgKi9cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICByZXR1cm4gdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHZhbHVlIGlzIGEgRE5TIHN1YmRvbWFpbiBuYW1lIGFzIGRlZmluZWQgaW4gUkZDIDExMjMsIGZyb20gSzhzIGRvY3MuXG4gICAqXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzLyNkbnMtc3ViZG9tYWluLW5hbWVzXG4gICAqL1xuICBwcml2YXRlIGlzVmFsaWREbnNTdWJkb21haW5OYW1lKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoIDw9IDI1MyAmJiAvXlthLXowLTldK1thLXowLTktLl0qW2EtejAtOV0rJC8udGVzdCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHZhbHVlIGZvbGxvd3MgRE5TIGxhYmVsIHN0YW5kYXJkIGFzIGRlZmluZWQgaW4gUkZDIDExMjMsIGZyb20gSzhzIGRvY3MuXG4gICAqXG4gICAqIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL2NvbmNlcHRzL292ZXJ2aWV3L3dvcmtpbmctd2l0aC1vYmplY3RzL25hbWVzLyNkbnMtbGFiZWwtbmFtZXNcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZERuc0xhYmVsTmFtZSh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA8PSA2MyAmJiAvXlthLXowLTldK1thLXowLTktXSpbYS16MC05XSskLy50ZXN0KHZhbHVlKTtcbiAgfVxufVxuIl19