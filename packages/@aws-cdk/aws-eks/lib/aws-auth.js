"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsAuth = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const k8s_manifest_1 = require("./k8s-manifest");
/**
 * Manages mapping between IAM users and roles to Kubernetes RBAC configuration.
 *
 * @see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
 */
class AwsAuth extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.roleMappings = new Array();
        this.userMappings = new Array();
        this.accounts = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AwsAuthProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsAuth);
            }
            throw error;
        }
        this.stack = core_1.Stack.of(this);
        new k8s_manifest_1.KubernetesManifest(this, 'manifest', {
            cluster: props.cluster,
            overwrite: true,
            manifest: [
                {
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    metadata: {
                        name: 'aws-auth',
                        namespace: 'kube-system',
                    },
                    data: {
                        mapRoles: this.synthesizeMapRoles(),
                        mapUsers: this.synthesizeMapUsers(),
                        mapAccounts: this.synthesizeMapAccounts(),
                    },
                },
            ],
        });
    }
    /**
     * Adds the specified IAM role to the `system:masters` RBAC group, which means
     * that anyone that can assume it will be able to administer this Kubernetes system.
     *
     * @param role The IAM role to add
     * @param username Optional user (defaults to the role ARN)
     */
    addMastersRole(role, username) {
        this.addRoleMapping(role, {
            username,
            groups: ['system:masters'],
        });
    }
    /**
     * Adds a mapping between an IAM role to a Kubernetes user and groups.
     *
     * @param role The IAM role to map
     * @param mapping Mapping to k8s user name and groups
     */
    addRoleMapping(role, mapping) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AwsAuthMapping(mapping);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRoleMapping);
            }
            throw error;
        }
        this.assertSameStack(role);
        this.roleMappings.push({ role, mapping });
    }
    /**
     * Adds a mapping between an IAM user to a Kubernetes user and groups.
     *
     * @param user The IAM user to map
     * @param mapping Mapping to k8s user name and groups
     */
    addUserMapping(user, mapping) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AwsAuthMapping(mapping);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUserMapping);
            }
            throw error;
        }
        this.assertSameStack(user);
        this.userMappings.push({ user, mapping });
    }
    /**
     * Additional AWS account to add to the aws-auth configmap.
     * @param accountId account number
     */
    addAccount(accountId) {
        this.accounts.push(accountId);
    }
    assertSameStack(construct) {
        const thisStack = core_1.Stack.of(this);
        if (core_1.Stack.of(construct) !== thisStack) {
            // aws-auth is always part of the cluster stack, and since resources commonly take
            // a dependency on the cluster, allowing those resources to be in a different stack,
            // will create a circular dependency. granted, it won't always be the case,
            // but we opted for the more causious and restrictive approach for now.
            throw new Error(`${construct.node.path} should be defined in the scope of the ${thisStack.stackName} stack to prevent circular dependencies`);
        }
    }
    synthesizeMapRoles() {
        return core_1.Lazy.any({
            produce: () => this.stack.toJsonString(this.roleMappings.map(m => ({
                rolearn: m.role.roleArn,
                username: m.mapping.username ?? m.role.roleArn,
                groups: m.mapping.groups,
            }))),
        });
    }
    synthesizeMapUsers() {
        return core_1.Lazy.any({
            produce: () => this.stack.toJsonString(this.userMappings.map(m => ({
                userarn: m.user.userArn,
                username: m.mapping.username ?? m.user.userArn,
                groups: m.mapping.groups,
            }))),
        });
    }
    synthesizeMapAccounts() {
        return core_1.Lazy.any({
            produce: () => this.stack.toJsonString(this.accounts),
        });
    }
}
exports.AwsAuth = AwsAuth;
_a = JSII_RTTI_SYMBOL_1;
AwsAuth[_a] = { fqn: "@aws-cdk/aws-eks.AwsAuth", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBNEM7QUFDNUMsMkNBQW1EO0FBR25ELGlEQUFvRDtBQWNwRDs7OztHQUlHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsc0JBQVM7SUFNcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBTEYsaUJBQVksR0FBRyxJQUFJLEtBQUssRUFBZ0QsQ0FBQztRQUN6RSxpQkFBWSxHQUFHLElBQUksS0FBSyxFQUFnRCxDQUFDO1FBQ3pFLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDOzs7Ozs7K0NBSnJDLE9BQU87Ozs7UUFTaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLElBQUksaUNBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN2QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsU0FBUyxFQUFFLElBQUk7WUFDZixRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRSxXQUFXO29CQUNqQixRQUFRLEVBQUU7d0JBQ1IsSUFBSSxFQUFFLFVBQVU7d0JBQ2hCLFNBQVMsRUFBRSxhQUFhO3FCQUN6QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRTt3QkFDbkMsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRTt3QkFDbkMsV0FBVyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtxQkFDMUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksY0FBYyxDQUFDLElBQWUsRUFBRSxRQUFpQjtRQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRTtZQUN4QixRQUFRO1lBQ1IsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7U0FDM0IsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7T0FLRztJQUNJLGNBQWMsQ0FBQyxJQUFlLEVBQUUsT0FBdUI7Ozs7Ozs7Ozs7UUFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzNDO0lBRUQ7Ozs7O09BS0c7SUFDSSxjQUFjLENBQUMsSUFBZSxFQUFFLE9BQXVCOzs7Ozs7Ozs7O1FBQzVELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMzQztJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxTQUFpQjtRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvQjtJQUVPLGVBQWUsQ0FBQyxTQUFxQjtRQUUzQyxNQUFNLFNBQVMsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLElBQUksWUFBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDckMsa0ZBQWtGO1lBQ2xGLG9GQUFvRjtZQUNwRiwyRUFBMkU7WUFDM0UsdUVBQXVFO1lBQ3ZFLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksMENBQTBDLFNBQVMsQ0FBQyxTQUFTLHlDQUF5QyxDQUFDLENBQUM7U0FDL0k7S0FDRjtJQUVPLGtCQUFrQjtRQUN4QixPQUFPLFdBQUksQ0FBQyxHQUFHLENBQUM7WUFDZCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUN2QixRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUM5QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2FBQ3pCLENBQUMsQ0FBQyxDQUFDO1NBQ0wsQ0FBQyxDQUFDO0tBQ0o7SUFFTyxrQkFBa0I7UUFDeEIsT0FBTyxXQUFJLENBQUMsR0FBRyxDQUFDO1lBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakUsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFDdkIsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFDOUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTTthQUN6QixDQUFDLENBQUMsQ0FBQztTQUNMLENBQUMsQ0FBQztLQUNKO0lBRU8scUJBQXFCO1FBQzNCLE9BQU8sV0FBSSxDQUFDLEdBQUcsQ0FBQztZQUNkLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RELENBQUMsQ0FBQztLQUNKOztBQWpISCwwQkFrSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBMYXp5LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBd3NBdXRoTWFwcGluZyB9IGZyb20gJy4vYXdzLWF1dGgtbWFwcGluZyc7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSAnLi9jbHVzdGVyJztcbmltcG9ydCB7IEt1YmVybmV0ZXNNYW5pZmVzdCB9IGZyb20gJy4vazhzLW1hbmlmZXN0JztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHByb3BzIGZvciB0aGUgQXdzQXV0aCBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzQXV0aFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBFS1MgY2x1c3RlciB0byBhcHBseSB0aGlzIGNvbmZpZ3VyYXRpb24gdG8uXG4gICAqXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBDbHVzdGVyO1xufVxuXG4vKipcbiAqIE1hbmFnZXMgbWFwcGluZyBiZXR3ZWVuIElBTSB1c2VycyBhbmQgcm9sZXMgdG8gS3ViZXJuZXRlcyBSQkFDIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZW5fdXMvZWtzL2xhdGVzdC91c2VyZ3VpZGUvYWRkLXVzZXItcm9sZS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBBd3NBdXRoIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGFjazogU3RhY2s7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm9sZU1hcHBpbmdzID0gbmV3IEFycmF5PHsgcm9sZTogaWFtLklSb2xlLCBtYXBwaW5nOiBBd3NBdXRoTWFwcGluZyB9PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHVzZXJNYXBwaW5ncyA9IG5ldyBBcnJheTx7IHVzZXI6IGlhbS5JVXNlciwgbWFwcGluZzogQXdzQXV0aE1hcHBpbmcgfT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhY2NvdW50cyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEF3c0F1dGhQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICBuZXcgS3ViZXJuZXRlc01hbmlmZXN0KHRoaXMsICdtYW5pZmVzdCcsIHtcbiAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICBvdmVyd3JpdGU6IHRydWUsIC8vIHRoaXMgY29uZmlnIG1hcCBpcyBhdXRvLWNyZWF0ZWQgYnkgdGhlIGNsdXN0ZXJcbiAgICAgIG1hbmlmZXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnYXdzLWF1dGgnLFxuICAgICAgICAgICAgbmFtZXNwYWNlOiAna3ViZS1zeXN0ZW0nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbWFwUm9sZXM6IHRoaXMuc3ludGhlc2l6ZU1hcFJvbGVzKCksXG4gICAgICAgICAgICBtYXBVc2VyczogdGhpcy5zeW50aGVzaXplTWFwVXNlcnMoKSxcbiAgICAgICAgICAgIG1hcEFjY291bnRzOiB0aGlzLnN5bnRoZXNpemVNYXBBY2NvdW50cygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCBJQU0gcm9sZSB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBSQkFDIGdyb3VwLCB3aGljaCBtZWFuc1xuICAgKiB0aGF0IGFueW9uZSB0aGF0IGNhbiBhc3N1bWUgaXQgd2lsbCBiZSBhYmxlIHRvIGFkbWluaXN0ZXIgdGhpcyBLdWJlcm5ldGVzIHN5c3RlbS5cbiAgICpcbiAgICogQHBhcmFtIHJvbGUgVGhlIElBTSByb2xlIHRvIGFkZFxuICAgKiBAcGFyYW0gdXNlcm5hbWUgT3B0aW9uYWwgdXNlciAoZGVmYXVsdHMgdG8gdGhlIHJvbGUgQVJOKVxuICAgKi9cbiAgcHVibGljIGFkZE1hc3RlcnNSb2xlKHJvbGU6IGlhbS5JUm9sZSwgdXNlcm5hbWU/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFkZFJvbGVNYXBwaW5nKHJvbGUsIHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZ3JvdXBzOiBbJ3N5c3RlbTptYXN0ZXJzJ10sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG1hcHBpbmcgYmV0d2VlbiBhbiBJQU0gcm9sZSB0byBhIEt1YmVybmV0ZXMgdXNlciBhbmQgZ3JvdXBzLlxuICAgKlxuICAgKiBAcGFyYW0gcm9sZSBUaGUgSUFNIHJvbGUgdG8gbWFwXG4gICAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgdG8gazhzIHVzZXIgbmFtZSBhbmQgZ3JvdXBzXG4gICAqL1xuICBwdWJsaWMgYWRkUm9sZU1hcHBpbmcocm9sZTogaWFtLklSb2xlLCBtYXBwaW5nOiBBd3NBdXRoTWFwcGluZykge1xuICAgIHRoaXMuYXNzZXJ0U2FtZVN0YWNrKHJvbGUpO1xuICAgIHRoaXMucm9sZU1hcHBpbmdzLnB1c2goeyByb2xlLCBtYXBwaW5nIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBtYXBwaW5nIGJldHdlZW4gYW4gSUFNIHVzZXIgdG8gYSBLdWJlcm5ldGVzIHVzZXIgYW5kIGdyb3Vwcy5cbiAgICpcbiAgICogQHBhcmFtIHVzZXIgVGhlIElBTSB1c2VyIHRvIG1hcFxuICAgKiBAcGFyYW0gbWFwcGluZyBNYXBwaW5nIHRvIGs4cyB1c2VyIG5hbWUgYW5kIGdyb3Vwc1xuICAgKi9cbiAgcHVibGljIGFkZFVzZXJNYXBwaW5nKHVzZXI6IGlhbS5JVXNlciwgbWFwcGluZzogQXdzQXV0aE1hcHBpbmcpIHtcbiAgICB0aGlzLmFzc2VydFNhbWVTdGFjayh1c2VyKTtcbiAgICB0aGlzLnVzZXJNYXBwaW5ncy5wdXNoKHsgdXNlciwgbWFwcGluZyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIEFXUyBhY2NvdW50IHRvIGFkZCB0byB0aGUgYXdzLWF1dGggY29uZmlnbWFwLlxuICAgKiBAcGFyYW0gYWNjb3VudElkIGFjY291bnQgbnVtYmVyXG4gICAqL1xuICBwdWJsaWMgYWRkQWNjb3VudChhY2NvdW50SWQ6IHN0cmluZykge1xuICAgIHRoaXMuYWNjb3VudHMucHVzaChhY2NvdW50SWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTYW1lU3RhY2soY29uc3RydWN0OiBJQ29uc3RydWN0KSB7XG5cbiAgICBjb25zdCB0aGlzU3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIGlmIChTdGFjay5vZihjb25zdHJ1Y3QpICE9PSB0aGlzU3RhY2spIHtcbiAgICAgIC8vIGF3cy1hdXRoIGlzIGFsd2F5cyBwYXJ0IG9mIHRoZSBjbHVzdGVyIHN0YWNrLCBhbmQgc2luY2UgcmVzb3VyY2VzIGNvbW1vbmx5IHRha2VcbiAgICAgIC8vIGEgZGVwZW5kZW5jeSBvbiB0aGUgY2x1c3RlciwgYWxsb3dpbmcgdGhvc2UgcmVzb3VyY2VzIHRvIGJlIGluIGEgZGlmZmVyZW50IHN0YWNrLFxuICAgICAgLy8gd2lsbCBjcmVhdGUgYSBjaXJjdWxhciBkZXBlbmRlbmN5LiBncmFudGVkLCBpdCB3b24ndCBhbHdheXMgYmUgdGhlIGNhc2UsXG4gICAgICAvLyBidXQgd2Ugb3B0ZWQgZm9yIHRoZSBtb3JlIGNhdXNpb3VzIGFuZCByZXN0cmljdGl2ZSBhcHByb2FjaCBmb3Igbm93LlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2NvbnN0cnVjdC5ub2RlLnBhdGh9IHNob3VsZCBiZSBkZWZpbmVkIGluIHRoZSBzY29wZSBvZiB0aGUgJHt0aGlzU3RhY2suc3RhY2tOYW1lfSBzdGFjayB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcGVuZGVuY2llc2ApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcFJvbGVzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLnJvbGVNYXBwaW5ncy5tYXAobSA9PiAoe1xuICAgICAgICByb2xlYXJuOiBtLnJvbGUucm9sZUFybixcbiAgICAgICAgdXNlcm5hbWU6IG0ubWFwcGluZy51c2VybmFtZSA/PyBtLnJvbGUucm9sZUFybixcbiAgICAgICAgZ3JvdXBzOiBtLm1hcHBpbmcuZ3JvdXBzLFxuICAgICAgfSkpKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcFVzZXJzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLnVzZXJNYXBwaW5ncy5tYXAobSA9PiAoe1xuICAgICAgICB1c2VyYXJuOiBtLnVzZXIudXNlckFybixcbiAgICAgICAgdXNlcm5hbWU6IG0ubWFwcGluZy51c2VybmFtZSA/PyBtLnVzZXIudXNlckFybixcbiAgICAgICAgZ3JvdXBzOiBtLm1hcHBpbmcuZ3JvdXBzLFxuICAgICAgfSkpKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcEFjY291bnRzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLmFjY291bnRzKSxcbiAgICB9KTtcbiAgfVxufVxuIl19