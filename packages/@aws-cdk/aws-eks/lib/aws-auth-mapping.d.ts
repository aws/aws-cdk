/**
 * AwsAuth mapping.
 */
export interface AwsAuthMapping {
    /**
     * The user name within Kubernetes to map to the IAM role.
     *
     * @default - By default, the user name is the ARN of the IAM role.
     */
    readonly username?: string;
    /**
     * A list of groups within Kubernetes to which the role is mapped.
     *
     * @see https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings
     */
    readonly groups: string[];
}
