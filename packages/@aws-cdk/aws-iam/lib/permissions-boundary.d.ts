import { IConstruct } from 'constructs';
import { IManagedPolicy } from './managed-policy';
/**
 * Modify the Permissions Boundaries of Users and Roles in a construct tree
 *
 * ```ts
 * const policy = iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');
 * iam.PermissionsBoundary.of(this).apply(policy);
 * ```
 */
export declare class PermissionsBoundary {
    private readonly scope;
    /**
     * Access the Permissions Boundaries of a construct tree
     */
    static of(scope: IConstruct): PermissionsBoundary;
    private constructor();
    /**
     * Apply the given policy as Permissions Boundary to all Roles and Users in
     * the scope.
     *
     * Will override any Permissions Boundaries configured previously; in case
     * a Permission Boundary is applied in multiple scopes, the Boundary applied
     * closest to the Role wins.
     */
    apply(boundaryPolicy: IManagedPolicy): void;
    /**
     * Remove previously applied Permissions Boundaries
     */
    clear(): void;
}
