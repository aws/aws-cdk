"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsBoundary = exports.PERMISSIONS_BOUNDARY_CONTEXT_KEY = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
_a = JSII_RTTI_SYMBOL_1;
PermissionsBoundary[_a] = { fqn: "@aws-cdk/core.PermissionsBoundary", version: "0.0.0" };
exports.PermissionsBoundary = PermissionsBoundary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy1ib3VuZGFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVhLFFBQUEsZ0NBQWdDLEdBQUcsbUNBQW1DLENBQUM7QUFNcEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJHO0FBQ0gsTUFBYSxtQkFBbUI7SUFDOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWTtRQUNqQyxPQUFPLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDaEQ7SUFFRCxZQUFxQyxVQUFtQixFQUFtQixTQUFrQjtRQUF4RCxlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQW1CLGNBQVMsR0FBVCxTQUFTLENBQVM7S0FDNUY7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksS0FBSyxDQUFDLEtBQWdCLEVBQUUsV0FBMkMsRUFBRTtRQUMxRSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx3Q0FBZ0MsRUFBRTtZQUN0RCxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDckIsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQ3BCLENBQUMsQ0FBQztLQUNKOzs7O0FBckVVLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgY29uc3QgUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVkgPSAnQGF3cy1jZGsvY29yZTpwZXJtaXNzaW9uc0JvdW5kYXJ5Jztcbi8qKlxuICogT3B0aW9ucyBmb3IgYmluZGluZyBhIFBlcm1pc3Npb25zIEJvdW5kYXJ5IHRvIGEgY29uc3RydWN0IHNjb3BlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGVybWlzc2lvbnNCb3VuZGFyeUJpbmRPcHRpb25zIHt9XG5cbi8qKlxuICogQXBwbHkgYSBwZXJtaXNzaW9ucyBib3VuZGFyeSB0byBhbGwgSUFNIFJvbGVzIGFuZCBVc2Vyc1xuICogd2l0aGluIGEgc3BlY2lmaWMgc2NvcGVcbiAqXG4gKiBBIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGlzIHR5cGljYWxseSBhcHBsaWVkIGF0IHRoZSBgU3RhZ2VgIHNjb3BlLlxuICogVGhpcyBhbGxvd3Mgc2V0dGluZyBkaWZmZXJlbnQgcGVybWlzc2lvbnMgYm91bmRhcmllcyBwZXIgU3RhZ2UuIEZvclxuICogZXhhbXBsZSwgeW91IG1heSBfbm90XyBhcHBseSBhIGJvdW5kYXJ5IHRvIHRoZSBgRGV2YCBzdGFnZSB3aGljaCBkZXBsb3lzXG4gKiB0byBhIHBlcnNvbmFsIGRldiBhY2NvdW50LCBidXQgeW91IF9kb18gYXBwbHkgdGhlIGRlZmF1bHQgYm91bmRhcnkgdG8gdGhlXG4gKiBgUHJvZGAgc3RhZ2UuXG4gKlxuICogSXQgaXMgcG9zc2libGUgdG8gYXBwbHkgZGlmZmVyZW50IHBlcm1pc3Npb25zIGJvdW5kYXJpZXMgdG8gZGlmZmVyZW50IHNjb3Blc1xuICogd2l0aGluIHlvdXIgYXBwLiBJbiB0aGlzIGNhc2UgdGhlIG1vc3Qgc3BlY2lmaWNhbGx5IGFwcGxpZWQgb25lIHdpbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gbm8gcGVybWlzc2lvbnMgYm91bmRhcnkgZm9yIGRldiBzdGFnZVxuICogbmV3IFN0YWdlKGFwcCwgJ0RldlN0YWdlJyk7XG4gKlxuICogLy8gZGVmYXVsdCBib3VuZGFyeSBmb3IgcHJvZCBzdGFnZVxuICogY29uc3QgcHJvZFN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1Byb2RTdGFnZScsIHtcbiAqICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgncHJvZC1wYicpLFxuICogfSk7XG4gKlxuICogLy8gb3ZlcnJpZGluZyB0aGUgcGIgYXBwbGllZCBmb3IgdGhpcyBzdGFja1xuICogbmV3IFN0YWNrKHByb2RTdGFnZSwgJ1Byb2RTdGFjazEnLCB7XG4gKiAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ3N0YWNrLXBiJyksXG4gKiB9KTtcbiAqXG4gKiAvLyB3aWxsIGluaGVyaXQgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGZyb20gdGhlIHN0YWdlXG4gKiBuZXcgU3RhY2socHJvZFN0YWdlLCAnUHJvZFN0YWNrMicpO1xuICovXG5leHBvcnQgY2xhc3MgUGVybWlzc2lvbnNCb3VuZGFyeSB7XG4gIC8qKlxuICAgKiBBcHBseSBhIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHdpdGggdGhlIGdpdmVuIG5hbWUgdG8gYWxsIElBTSBSb2xlc1xuICAgKiBhbmQgVXNlcnMgY3JlYXRlZCB3aXRoaW4gYSBzY29wZS5cbiAgICpcbiAgICogVGhlIG5hbWUgY2FuIGluY2x1ZGUgcGxhY2Vob2xkZXJzIGZvciB0aGUgcGFydGl0aW9uLCByZWdpb24sIHF1YWxpZmllciwgYW5kIGFjY291bnRcbiAgICogVGhlc2UgcGxhY2Vob2xkZXJzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgYWN0dWFsIHZhbHVlcyBpZiBhdmFpbGFibGUuIFRoaXMgcmVxdWlyZXNcbiAgICogdGhhdCB0aGUgU3RhY2sgaGFzIHRoZSBlbnZpcm9ubWVudCBzcGVjaWZpZWQsIGl0IGRvZXMgbm90IHdvcmsgd2l0aCBlbnZpcm9ubWVudFxuICAgKiBhZ25vc3RpYyBzdGFja3MuXG4gICAqXG4gICAqIC0gJyR7QVdTOjpQYXJ0aXRpb259J1xuICAgKiAtICcke0FXUzo6UmVnaW9ufSdcbiAgICogLSAnJHtBV1M6OkFjY291bnRJZH0nXG4gICAqIC0gJyR7UXVhbGlmaWVyfSdcbiAgICpcbiAgICogQHBhcmFtIG5hbWUgdGhlIG5hbWUgb2YgdGhlIHBlcm1pc3Npb25zIGJvdW5kYXJ5IHBvbGljeVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IGFwcDogQXBwO1xuICAgKiBuZXcgU3RhZ2UoYXBwLCAnUHJvZFN0YWdlJywge1xuICAgKiAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ215LWN1c3RvbS1wZXJtaXNzaW9ucy1ib3VuZGFyeScpLFxuICAgKiB9KTtcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5hbWUobmFtZTogc3RyaW5nKTogUGVybWlzc2lvbnNCb3VuZGFyeSB7XG4gICAgcmV0dXJuIG5ldyBQZXJtaXNzaW9uc0JvdW5kYXJ5KG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgcGVybWlzc2lvbnMgYm91bmRhcnkgd2l0aCB0aGUgZ2l2ZW4gQVJOIHRvIGFsbCBJQU0gUm9sZXNcbiAgICogYW5kIFVzZXJzIGNyZWF0ZWQgd2l0aGluIGEgc2NvcGUuXG4gICAqXG4gICAqIFRoZSBhcm4gY2FuIGluY2x1ZGUgcGxhY2Vob2xkZXJzIGZvciB0aGUgcGFydGl0aW9uLCByZWdpb24sIHF1YWxpZmllciwgYW5kIGFjY291bnRcbiAgICogVGhlc2UgcGxhY2Vob2xkZXJzIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgYWN0dWFsIHZhbHVlcyBpZiBhdmFpbGFibGUuIFRoaXMgcmVxdWlyZXNcbiAgICogdGhhdCB0aGUgU3RhY2sgaGFzIHRoZSBlbnZpcm9ubWVudCBzcGVjaWZpZWQsIGl0IGRvZXMgbm90IHdvcmsgd2l0aCBlbnZpcm9ubWVudFxuICAgKiBhZ25vc3RpYyBzdGFja3MuXG4gICAqXG4gICAqIC0gJyR7QVdTOjpQYXJ0aXRpb259J1xuICAgKiAtICcke0FXUzo6UmVnaW9ufSdcbiAgICogLSAnJHtBV1M6OkFjY291bnRJZH0nXG4gICAqIC0gJyR7UXVhbGlmaWVyfSdcbiAgICpcbiAgICogQHBhcmFtIGFybiB0aGUgQVJOIG9mIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBwb2xpY3lcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZGVjbGFyZSBjb25zdCBhcHA6IEFwcDtcbiAgICogbmV3IFN0YWdlKGFwcCwgJ1Byb2RTdGFnZScsIHtcbiAgICogICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21Bcm4oJ2Fybjphd3M6aWFtOjoke0FXUzo6QWNjb3VudElkfTpwb2xpY3kvbXktY3VzdG9tLXBlcm1pc3Npb25zLWJvdW5kYXJ5JyksXG4gICAqIH0pO1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQXJuKGFybjogc3RyaW5nKTogUGVybWlzc2lvbnNCb3VuZGFyeSB7XG4gICAgcmV0dXJuIG5ldyBQZXJtaXNzaW9uc0JvdW5kYXJ5KHVuZGVmaW5lZCwgYXJuKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwb2xpY3lOYW1lPzogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHBvbGljeUFybj86IHN0cmluZykge1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSB0byB0aGUgZ2l2ZW4gc2NvcGVcbiAgICpcbiAgICogRGlmZmVyZW50IHBlcm1pc3Npb25zIGJvdW5kYXJpZXMgY2FuIGJlIGFwcGxpZWQgdG8gZGlmZmVyZW50IHNjb3Blc1xuICAgKiBhbmQgdGhlIG1vc3Qgc3BlY2lmaWMgd2lsbCBiZSBhcHBsaWVkLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYmluZChzY29wZTogQ29uc3RydWN0LCBfb3B0aW9uczogUGVybWlzc2lvbnNCb3VuZGFyeUJpbmRPcHRpb25zID0ge30pOiB2b2lkIHtcbiAgICBzY29wZS5ub2RlLnNldENvbnRleHQoUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVksIHtcbiAgICAgIG5hbWU6IHRoaXMucG9saWN5TmFtZSxcbiAgICAgIGFybjogdGhpcy5wb2xpY3lBcm4sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==