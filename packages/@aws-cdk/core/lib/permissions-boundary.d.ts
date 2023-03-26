import { Construct } from 'constructs';
export declare const PERMISSIONS_BOUNDARY_CONTEXT_KEY = "@aws-cdk/core:permissionsBoundary";
/**
 * Options for binding a Permissions Boundary to a construct scope
 */
export interface PermissionsBoundaryBindOptions {
}
/**
 * Apply a permissions boundary to all IAM Roles and Users
 * within a specific scope
 *
 * A permissions boundary is typically applied at the `Stage` scope.
 * This allows setting different permissions boundaries per Stage. For
 * example, you may _not_ apply a boundary to the `Dev` stage which deploys
 * to a personal dev account, but you _do_ apply the default boundary to the
 * `Prod` stage.
 *
 * It is possible to apply different permissions boundaries to different scopes
 * within your app. In this case the most specifically applied one wins
 *
 * @example
 * // no permissions boundary for dev stage
 * new Stage(app, 'DevStage');
 *
 * // default boundary for prod stage
 * const prodStage = new Stage(app, 'ProdStage', {
 *   permissionsBoundary: PermissionsBoundary.fromName('prod-pb'),
 * });
 *
 * // overriding the pb applied for this stack
 * new Stack(prodStage, 'ProdStack1', {
 *   permissionsBoundary: PermissionsBoundary.fromName('stack-pb'),
 * });
 *
 * // will inherit the permissions boundary from the stage
 * new Stack(prodStage, 'ProdStack2');
 */
export declare class PermissionsBoundary {
    private readonly policyName?;
    private readonly policyArn?;
    /**
     * Apply a permissions boundary with the given name to all IAM Roles
     * and Users created within a scope.
     *
     * The name can include placeholders for the partition, region, qualifier, and account
     * These placeholders will be replaced with the actual values if available. This requires
     * that the Stack has the environment specified, it does not work with environment
     * agnostic stacks.
     *
     * - '${AWS::Partition}'
     * - '${AWS::Region}'
     * - '${AWS::AccountId}'
     * - '${Qualifier}'
     *
     * @param name the name of the permissions boundary policy
     *
     * @example
     * declare const app: App;
     * new Stage(app, 'ProdStage', {
     *   permissionsBoundary: PermissionsBoundary.fromName('my-custom-permissions-boundary'),
     * });
     */
    static fromName(name: string): PermissionsBoundary;
    /**
     * Apply a permissions boundary with the given ARN to all IAM Roles
     * and Users created within a scope.
     *
     * The arn can include placeholders for the partition, region, qualifier, and account
     * These placeholders will be replaced with the actual values if available. This requires
     * that the Stack has the environment specified, it does not work with environment
     * agnostic stacks.
     *
     * - '${AWS::Partition}'
     * - '${AWS::Region}'
     * - '${AWS::AccountId}'
     * - '${Qualifier}'
     *
     * @param arn the ARN of the permissions boundary policy
     *
     * @example
     * declare const app: App;
     * new Stage(app, 'ProdStage', {
     *   permissionsBoundary: PermissionsBoundary.fromArn('arn:aws:iam::${AWS::AccountId}:policy/my-custom-permissions-boundary'),
     * });
     */
    static fromArn(arn: string): PermissionsBoundary;
    private constructor();
    /**
     * Apply the permissions boundary to the given scope
     *
     * Different permissions boundaries can be applied to different scopes
     * and the most specific will be applied.
     *
     * @internal
     */
    _bind(scope: Construct, _options?: PermissionsBoundaryBindOptions): void;
}
