"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsBoundary = exports.PERMISSIONS_BOUNDARY_CONTEXT_KEY = void 0;
exports.PERMISSIONS_BOUNDARY_CONTEXT_KEY = '@aws-cdk/core:permissionsBoundary';
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
class PermissionsBoundary {
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
    static fromName(name) {
        return new PermissionsBoundary(name);
    }
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
    static fromArn(arn) {
        return new PermissionsBoundary(undefined, arn);
    }
    constructor(policyName, policyArn) {
        this.policyName = policyName;
        this.policyArn = policyArn;
    }
    /**
     * Apply the permissions boundary to the given scope
     *
     * Different permissions boundaries can be applied to different scopes
     * and the most specific will be applied.
     *
     * @internal
     */
    _bind(scope, _options = {}) {
        scope.node.setContext(exports.PERMISSIONS_BOUNDARY_CONTEXT_KEY, {
            name: this.policyName,
            arn: this.policyArn,
        });
    }
}
exports.PermissionsBoundary = PermissionsBoundary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy1ib3VuZGFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLGdDQUFnQyxHQUFHLG1DQUFtQyxDQUFDO0FBTXBGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQUNILE1BQWEsbUJBQW1CO0lBQzlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQkc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVk7UUFDakMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELFlBQXFDLFVBQW1CLEVBQW1CLFNBQWtCO1FBQXhELGVBQVUsR0FBVixVQUFVLENBQVM7UUFBbUIsY0FBUyxHQUFULFNBQVMsQ0FBUztJQUM3RixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEtBQUssQ0FBQyxLQUFnQixFQUFFLFdBQTJDLEVBQUU7UUFDMUUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsd0NBQWdDLEVBQUU7WUFDdEQsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQ3JCLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUztTQUNwQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF0RUQsa0RBc0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBjb25zdCBQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSA9ICdAYXdzLWNkay9jb3JlOnBlcm1pc3Npb25zQm91bmRhcnknO1xuLyoqXG4gKiBPcHRpb25zIGZvciBiaW5kaW5nIGEgUGVybWlzc2lvbnMgQm91bmRhcnkgdG8gYSBjb25zdHJ1Y3Qgc2NvcGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQZXJtaXNzaW9uc0JvdW5kYXJ5QmluZE9wdGlvbnMge31cblxuLyoqXG4gKiBBcHBseSBhIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHRvIGFsbCBJQU0gUm9sZXMgYW5kIFVzZXJzXG4gKiB3aXRoaW4gYSBzcGVjaWZpYyBzY29wZVxuICpcbiAqIEEgcGVybWlzc2lvbnMgYm91bmRhcnkgaXMgdHlwaWNhbGx5IGFwcGxpZWQgYXQgdGhlIGBTdGFnZWAgc2NvcGUuXG4gKiBUaGlzIGFsbG93cyBzZXR0aW5nIGRpZmZlcmVudCBwZXJtaXNzaW9ucyBib3VuZGFyaWVzIHBlciBTdGFnZS4gRm9yXG4gKiBleGFtcGxlLCB5b3UgbWF5IF9ub3RfIGFwcGx5IGEgYm91bmRhcnkgdG8gdGhlIGBEZXZgIHN0YWdlIHdoaWNoIGRlcGxveXNcbiAqIHRvIGEgcGVyc29uYWwgZGV2IGFjY291bnQsIGJ1dCB5b3UgX2RvXyBhcHBseSB0aGUgZGVmYXVsdCBib3VuZGFyeSB0byB0aGVcbiAqIGBQcm9kYCBzdGFnZS5cbiAqXG4gKiBJdCBpcyBwb3NzaWJsZSB0byBhcHBseSBkaWZmZXJlbnQgcGVybWlzc2lvbnMgYm91bmRhcmllcyB0byBkaWZmZXJlbnQgc2NvcGVzXG4gKiB3aXRoaW4geW91ciBhcHAuIEluIHRoaXMgY2FzZSB0aGUgbW9zdCBzcGVjaWZpY2FsbHkgYXBwbGllZCBvbmUgd2luc1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBubyBwZXJtaXNzaW9ucyBib3VuZGFyeSBmb3IgZGV2IHN0YWdlXG4gKiBuZXcgU3RhZ2UoYXBwLCAnRGV2U3RhZ2UnKTtcbiAqXG4gKiAvLyBkZWZhdWx0IGJvdW5kYXJ5IGZvciBwcm9kIHN0YWdlXG4gKiBjb25zdCBwcm9kU3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnUHJvZFN0YWdlJywge1xuICogICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21OYW1lKCdwcm9kLXBiJyksXG4gKiB9KTtcbiAqXG4gKiAvLyBvdmVycmlkaW5nIHRoZSBwYiBhcHBsaWVkIGZvciB0aGlzIHN0YWNrXG4gKiBuZXcgU3RhY2socHJvZFN0YWdlLCAnUHJvZFN0YWNrMScsIHtcbiAqICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnc3RhY2stcGInKSxcbiAqIH0pO1xuICpcbiAqIC8vIHdpbGwgaW5oZXJpdCB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgZnJvbSB0aGUgc3RhZ2VcbiAqIG5ldyBTdGFjayhwcm9kU3RhZ2UsICdQcm9kU3RhY2syJyk7XG4gKi9cbmV4cG9ydCBjbGFzcyBQZXJtaXNzaW9uc0JvdW5kYXJ5IHtcbiAgLyoqXG4gICAqIEFwcGx5IGEgcGVybWlzc2lvbnMgYm91bmRhcnkgd2l0aCB0aGUgZ2l2ZW4gbmFtZSB0byBhbGwgSUFNIFJvbGVzXG4gICAqIGFuZCBVc2VycyBjcmVhdGVkIHdpdGhpbiBhIHNjb3BlLlxuICAgKlxuICAgKiBUaGUgbmFtZSBjYW4gaW5jbHVkZSBwbGFjZWhvbGRlcnMgZm9yIHRoZSBwYXJ0aXRpb24sIHJlZ2lvbiwgcXVhbGlmaWVyLCBhbmQgYWNjb3VudFxuICAgKiBUaGVzZSBwbGFjZWhvbGRlcnMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSBhY3R1YWwgdmFsdWVzIGlmIGF2YWlsYWJsZS4gVGhpcyByZXF1aXJlc1xuICAgKiB0aGF0IHRoZSBTdGFjayBoYXMgdGhlIGVudmlyb25tZW50IHNwZWNpZmllZCwgaXQgZG9lcyBub3Qgd29yayB3aXRoIGVudmlyb25tZW50XG4gICAqIGFnbm9zdGljIHN0YWNrcy5cbiAgICpcbiAgICogLSAnJHtBV1M6OlBhcnRpdGlvbn0nXG4gICAqIC0gJyR7QVdTOjpSZWdpb259J1xuICAgKiAtICcke0FXUzo6QWNjb3VudElkfSdcbiAgICogLSAnJHtRdWFsaWZpZXJ9J1xuICAgKlxuICAgKiBAcGFyYW0gbmFtZSB0aGUgbmFtZSBvZiB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgcG9saWN5XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3QgYXBwOiBBcHA7XG4gICAqIG5ldyBTdGFnZShhcHAsICdQcm9kU3RhZ2UnLCB7XG4gICAqICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnbXktY3VzdG9tLXBlcm1pc3Npb25zLWJvdW5kYXJ5JyksXG4gICAqIH0pO1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBQZXJtaXNzaW9uc0JvdW5kYXJ5IHtcbiAgICByZXR1cm4gbmV3IFBlcm1pc3Npb25zQm91bmRhcnkobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYSBwZXJtaXNzaW9ucyBib3VuZGFyeSB3aXRoIHRoZSBnaXZlbiBBUk4gdG8gYWxsIElBTSBSb2xlc1xuICAgKiBhbmQgVXNlcnMgY3JlYXRlZCB3aXRoaW4gYSBzY29wZS5cbiAgICpcbiAgICogVGhlIGFybiBjYW4gaW5jbHVkZSBwbGFjZWhvbGRlcnMgZm9yIHRoZSBwYXJ0aXRpb24sIHJlZ2lvbiwgcXVhbGlmaWVyLCBhbmQgYWNjb3VudFxuICAgKiBUaGVzZSBwbGFjZWhvbGRlcnMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoZSBhY3R1YWwgdmFsdWVzIGlmIGF2YWlsYWJsZS4gVGhpcyByZXF1aXJlc1xuICAgKiB0aGF0IHRoZSBTdGFjayBoYXMgdGhlIGVudmlyb25tZW50IHNwZWNpZmllZCwgaXQgZG9lcyBub3Qgd29yayB3aXRoIGVudmlyb25tZW50XG4gICAqIGFnbm9zdGljIHN0YWNrcy5cbiAgICpcbiAgICogLSAnJHtBV1M6OlBhcnRpdGlvbn0nXG4gICAqIC0gJyR7QVdTOjpSZWdpb259J1xuICAgKiAtICcke0FXUzo6QWNjb3VudElkfSdcbiAgICogLSAnJHtRdWFsaWZpZXJ9J1xuICAgKlxuICAgKiBAcGFyYW0gYXJuIHRoZSBBUk4gb2YgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHBvbGljeVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IGFwcDogQXBwO1xuICAgKiBuZXcgU3RhZ2UoYXBwLCAnUHJvZFN0YWdlJywge1xuICAgKiAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbUFybignYXJuOmF3czppYW06OiR7QVdTOjpBY2NvdW50SWR9OnBvbGljeS9teS1jdXN0b20tcGVybWlzc2lvbnMtYm91bmRhcnknKSxcbiAgICogfSk7XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bcm4oYXJuOiBzdHJpbmcpOiBQZXJtaXNzaW9uc0JvdW5kYXJ5IHtcbiAgICByZXR1cm4gbmV3IFBlcm1pc3Npb25zQm91bmRhcnkodW5kZWZpbmVkLCBhcm4pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBvbGljeU5hbWU/OiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcG9saWN5QXJuPzogc3RyaW5nKSB7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHRvIHRoZSBnaXZlbiBzY29wZVxuICAgKlxuICAgKiBEaWZmZXJlbnQgcGVybWlzc2lvbnMgYm91bmRhcmllcyBjYW4gYmUgYXBwbGllZCB0byBkaWZmZXJlbnQgc2NvcGVzXG4gICAqIGFuZCB0aGUgbW9zdCBzcGVjaWZpYyB3aWxsIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9iaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIF9vcHRpb25zOiBQZXJtaXNzaW9uc0JvdW5kYXJ5QmluZE9wdGlvbnMgPSB7fSk6IHZvaWQge1xuICAgIHNjb3BlLm5vZGUuc2V0Q29udGV4dChQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSwge1xuICAgICAgbmFtZTogdGhpcy5wb2xpY3lOYW1lLFxuICAgICAgYXJuOiB0aGlzLnBvbGljeUFybixcbiAgICB9KTtcbiAgfVxufVxuIl19