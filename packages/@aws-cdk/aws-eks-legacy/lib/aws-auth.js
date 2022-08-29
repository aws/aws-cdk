"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsAuth = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const k8s_resource_1 = require("./k8s-resource");
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.AwsAuth", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_AwsAuthProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsAuth);
            }
            throw error;
        }
        this.stack = core_1.Stack.of(this);
        new k8s_resource_1.KubernetesResource(this, 'manifest', {
            cluster: props.cluster,
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
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.AwsAuth#addMastersRole", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMastersRole);
            }
            throw error;
        }
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.AwsAuth#addRoleMapping", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_Mapping(mapping);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRoleMapping);
            }
            throw error;
        }
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
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.AwsAuth#addUserMapping", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_Mapping(mapping);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUserMapping);
            }
            throw error;
        }
        this.userMappings.push({ user, mapping });
    }
    /**
     * Additional AWS account to add to the aws-auth configmap.
     * @param accountId account number
     */
    addAccount(accountId) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.AwsAuth#addAccount", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAccount);
            }
            throw error;
        }
        this.accounts.push(accountId);
    }
    synthesizeMapRoles() {
        return core_1.Lazy.any({
            produce: () => this.stack.toJsonString(this.roleMappings.map(m => ({
                rolearn: m.role.roleArn,
                username: m.mapping.username,
                groups: m.mapping.groups,
            }))),
        });
    }
    synthesizeMapUsers() {
        return core_1.Lazy.any({
            produce: () => this.stack.toJsonString(this.userMappings.map(m => ({
                userarn: m.user.userArn,
                username: m.mapping.username,
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
AwsAuth[_a] = { fqn: "@aws-cdk/aws-eks-legacy.AwsAuth", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBNEM7QUFDNUMsMkNBQXVDO0FBR3ZDLGlEQUFvRDtBQVdwRDs7OztHQUlHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsc0JBQVM7SUFNcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBTEYsaUJBQVksR0FBRyxJQUFJLEtBQUssRUFBeUMsQ0FBQztRQUNsRSxpQkFBWSxHQUFHLElBQUksS0FBSyxFQUF5QyxDQUFDO1FBQ2xFLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDOzs7Ozs7OytDQUpyQyxPQUFPOzs7O1FBU2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixJQUFJLGlDQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdkMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLFFBQVEsRUFBRTtnQkFDUjtvQkFDRSxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRTt3QkFDUixJQUFJLEVBQUUsVUFBVTt3QkFDaEIsU0FBUyxFQUFFLGFBQWE7cUJBQ3pCO29CQUNELElBQUksRUFBRTt3QkFDSixRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFO3dCQUNuQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFO3dCQUNuQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFO3FCQUMxQztpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7O09BTUc7SUFDSSxjQUFjLENBQUMsSUFBZSxFQUFFLFFBQWlCOzs7Ozs7Ozs7O1FBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFO1lBQ3hCLFFBQVE7WUFDUixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUMzQixDQUFDLENBQUM7S0FDSjtJQUVEOzs7OztPQUtHO0lBQ0ksY0FBYyxDQUFDLElBQWUsRUFBRSxPQUFnQjs7Ozs7Ozs7Ozs7UUFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMzQztJQUVEOzs7OztPQUtHO0lBQ0ksY0FBYyxDQUFDLElBQWUsRUFBRSxPQUFnQjs7Ozs7Ozs7Ozs7UUFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMzQztJQUVEOzs7T0FHRztJQUNJLFVBQVUsQ0FBQyxTQUFpQjs7Ozs7Ozs7OztRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvQjtJQUVPLGtCQUFrQjtRQUN4QixPQUFPLFdBQUksQ0FBQyxHQUFHLENBQUM7WUFDZCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUN2QixRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUM1QixNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2FBQ3pCLENBQUMsQ0FBQyxDQUFDO1NBQ0wsQ0FBQyxDQUFDO0tBQ0o7SUFFTyxrQkFBa0I7UUFDeEIsT0FBTyxXQUFJLENBQUMsR0FBRyxDQUFDO1lBQ2QsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakUsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFDdkIsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFDNUIsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTTthQUN6QixDQUFDLENBQUMsQ0FBQztTQUNMLENBQUMsQ0FBQztLQUNKO0lBRU8scUJBQXFCO1FBQzNCLE9BQU8sV0FBSSxDQUFDLEdBQUcsQ0FBQztZQUNkLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RELENBQUMsQ0FBQztLQUNKOztBQWpHSCwwQkFrR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBMYXp5LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBNYXBwaW5nIH0gZnJvbSAnLi9hd3MtYXV0aC1tYXBwaW5nJztcbmltcG9ydCB7IENsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgS3ViZXJuZXRlc1Jlc291cmNlIH0gZnJvbSAnLi9rOHMtcmVzb3VyY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF3c0F1dGhQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgRUtTIGNsdXN0ZXIgdG8gYXBwbHkgdGhpcyBjb25maWd1cmF0aW9uIHRvLlxuICAgKlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIG1hcHBpbmcgYmV0d2VlbiBJQU0gdXNlcnMgYW5kIHJvbGVzIHRvIEt1YmVybmV0ZXMgUkJBQyBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VuX3VzL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2FkZC11c2VyLXJvbGUuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQXdzQXV0aCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhY2s6IFN0YWNrO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvbGVNYXBwaW5ncyA9IG5ldyBBcnJheTx7IHJvbGU6IGlhbS5JUm9sZSwgbWFwcGluZzogTWFwcGluZyB9PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHVzZXJNYXBwaW5ncyA9IG5ldyBBcnJheTx7IHVzZXI6IGlhbS5JVXNlciwgbWFwcGluZzogTWFwcGluZyB9PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGFjY291bnRzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXdzQXV0aFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIG5ldyBLdWJlcm5ldGVzUmVzb3VyY2UodGhpcywgJ21hbmlmZXN0Jywge1xuICAgICAgY2x1c3RlcjogcHJvcHMuY2x1c3RlcixcbiAgICAgIG1hbmlmZXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnYXdzLWF1dGgnLFxuICAgICAgICAgICAgbmFtZXNwYWNlOiAna3ViZS1zeXN0ZW0nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbWFwUm9sZXM6IHRoaXMuc3ludGhlc2l6ZU1hcFJvbGVzKCksXG4gICAgICAgICAgICBtYXBVc2VyczogdGhpcy5zeW50aGVzaXplTWFwVXNlcnMoKSxcbiAgICAgICAgICAgIG1hcEFjY291bnRzOiB0aGlzLnN5bnRoZXNpemVNYXBBY2NvdW50cygpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCBJQU0gcm9sZSB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBSQkFDIGdyb3VwLCB3aGljaCBtZWFuc1xuICAgKiB0aGF0IGFueW9uZSB0aGF0IGNhbiBhc3N1bWUgaXQgd2lsbCBiZSBhYmxlIHRvIGFkbWluaXN0ZXIgdGhpcyBLdWJlcm5ldGVzIHN5c3RlbS5cbiAgICpcbiAgICogQHBhcmFtIHJvbGUgVGhlIElBTSByb2xlIHRvIGFkZFxuICAgKiBAcGFyYW0gdXNlcm5hbWUgT3B0aW9uYWwgdXNlciAoZGVmYXVsdHMgdG8gdGhlIHJvbGUgQVJOKVxuICAgKi9cbiAgcHVibGljIGFkZE1hc3RlcnNSb2xlKHJvbGU6IGlhbS5JUm9sZSwgdXNlcm5hbWU/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFkZFJvbGVNYXBwaW5nKHJvbGUsIHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZ3JvdXBzOiBbJ3N5c3RlbTptYXN0ZXJzJ10sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG1hcHBpbmcgYmV0d2VlbiBhbiBJQU0gcm9sZSB0byBhIEt1YmVybmV0ZXMgdXNlciBhbmQgZ3JvdXBzLlxuICAgKlxuICAgKiBAcGFyYW0gcm9sZSBUaGUgSUFNIHJvbGUgdG8gbWFwXG4gICAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgdG8gazhzIHVzZXIgbmFtZSBhbmQgZ3JvdXBzXG4gICAqL1xuICBwdWJsaWMgYWRkUm9sZU1hcHBpbmcocm9sZTogaWFtLklSb2xlLCBtYXBwaW5nOiBNYXBwaW5nKSB7XG4gICAgdGhpcy5yb2xlTWFwcGluZ3MucHVzaCh7IHJvbGUsIG1hcHBpbmcgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG1hcHBpbmcgYmV0d2VlbiBhbiBJQU0gdXNlciB0byBhIEt1YmVybmV0ZXMgdXNlciBhbmQgZ3JvdXBzLlxuICAgKlxuICAgKiBAcGFyYW0gdXNlciBUaGUgSUFNIHVzZXIgdG8gbWFwXG4gICAqIEBwYXJhbSBtYXBwaW5nIE1hcHBpbmcgdG8gazhzIHVzZXIgbmFtZSBhbmQgZ3JvdXBzXG4gICAqL1xuICBwdWJsaWMgYWRkVXNlck1hcHBpbmcodXNlcjogaWFtLklVc2VyLCBtYXBwaW5nOiBNYXBwaW5nKSB7XG4gICAgdGhpcy51c2VyTWFwcGluZ3MucHVzaCh7IHVzZXIsIG1hcHBpbmcgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkaXRpb25hbCBBV1MgYWNjb3VudCB0byBhZGQgdG8gdGhlIGF3cy1hdXRoIGNvbmZpZ21hcC5cbiAgICogQHBhcmFtIGFjY291bnRJZCBhY2NvdW50IG51bWJlclxuICAgKi9cbiAgcHVibGljIGFkZEFjY291bnQoYWNjb3VudElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmFjY291bnRzLnB1c2goYWNjb3VudElkKTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcFJvbGVzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLnJvbGVNYXBwaW5ncy5tYXAobSA9PiAoe1xuICAgICAgICByb2xlYXJuOiBtLnJvbGUucm9sZUFybixcbiAgICAgICAgdXNlcm5hbWU6IG0ubWFwcGluZy51c2VybmFtZSxcbiAgICAgICAgZ3JvdXBzOiBtLm1hcHBpbmcuZ3JvdXBzLFxuICAgICAgfSkpKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcFVzZXJzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLnVzZXJNYXBwaW5ncy5tYXAobSA9PiAoe1xuICAgICAgICB1c2VyYXJuOiBtLnVzZXIudXNlckFybixcbiAgICAgICAgdXNlcm5hbWU6IG0ubWFwcGluZy51c2VybmFtZSxcbiAgICAgICAgZ3JvdXBzOiBtLm1hcHBpbmcuZ3JvdXBzLFxuICAgICAgfSkpKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhlc2l6ZU1hcEFjY291bnRzKCkge1xuICAgIHJldHVybiBMYXp5LmFueSh7XG4gICAgICBwcm9kdWNlOiAoKSA9PiB0aGlzLnN0YWNrLnRvSnNvblN0cmluZyh0aGlzLmFjY291bnRzKSxcbiAgICB9KTtcbiAgfVxufVxuIl19