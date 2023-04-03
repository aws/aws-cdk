"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3DeployAction = exports.CacheControl = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const case_1 = require("case");
const action_1 = require("../action");
const common_1 = require("../common");
// Class copied verbatim from the aws-s3-deployment module.
// Yes, it sucks that we didn't abstract this properly in a common class,
// but having 2 different CacheControl classes that behave differently would be worse I think.
// Something to do when CDK 2.0.0 comes out.
/**
 * Used for HTTP cache-control header, which influences downstream caches.
 * Use the provided static factory methods to construct instances of this class.
 * Used in the `S3DeployActionProps.cacheControl` property.
 *
 * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
 */
class CacheControl {
    /** @param value the actual text value of the created directive */
    constructor(value) {
        this.value = value;
    }
    /** The 'must-revalidate' cache control directive. */
    static mustRevalidate() { return new CacheControl('must-revalidate'); }
    /** The 'no-cache' cache control directive. */
    static noCache() { return new CacheControl('no-cache'); }
    /** The 'no-transform' cache control directive. */
    static noTransform() { return new CacheControl('no-transform'); }
    /** The 'public' cache control directive. */
    static setPublic() { return new CacheControl('public'); }
    /** The 'private' cache control directive. */
    static setPrivate() { return new CacheControl('private'); }
    /** The 'proxy-revalidate' cache control directive. */
    static proxyRevalidate() { return new CacheControl('proxy-revalidate'); }
    /** The 'max-age' cache control directive. */
    static maxAge(t) { return new CacheControl(`max-age=${t.toSeconds()}`); }
    /** The 's-max-age' cache control directive. */
    static sMaxAge(t) { return new CacheControl(`s-maxage=${t.toSeconds()}`); }
    /**
     * Allows you to create an arbitrary cache control directive,
     * in case our support is missing a method for a particular directive.
     */
    static fromString(s) { return new CacheControl(s); }
}
exports.CacheControl = CacheControl;
_a = JSII_RTTI_SYMBOL_1;
CacheControl[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CacheControl", version: "0.0.0" };
/**
 * Deploys the sourceArtifact to Amazon S3.
 */
class S3DeployAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.bucket,
            category: codepipeline.ActionCategory.DEPLOY,
            provider: 'S3',
            artifactBounds: common_1.deployArtifactBounds(),
            inputs: [props.input],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_S3DeployActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, S3DeployAction);
            }
            throw error;
        }
        this.props = props;
    }
    bound(_scope, _stage, options) {
        // pipeline needs permissions to write to the S3 bucket
        this.props.bucket.grantWrite(options.role);
        if (this.props.accessControl !== undefined) {
            // we need to modify the ACL settings of objects within the Bucket,
            // so grant the Action's Role permissions to do that
            this.props.bucket.grantPutAcl(options.role);
        }
        // the Action Role also needs to read from the Pipeline's bucket
        options.bucket.grantRead(options.role);
        const acl = this.props.accessControl;
        return {
            configuration: {
                BucketName: this.props.bucket.bucketName,
                Extract: this.props.extract === false ? 'false' : 'true',
                ObjectKey: this.props.objectKey,
                CannedACL: acl ? case_1.kebab(acl.toString()) : undefined,
                CacheControl: this.props.cacheControl && this.props.cacheControl.map(ac => ac.value).join(', '),
                KMSEncryptionKeyARN: this.props.encryptionKey?.keyArn,
            },
        };
    }
}
exports.S3DeployAction = S3DeployAction;
_b = JSII_RTTI_SYMBOL_1;
S3DeployAction[_b] = { fqn: "@aws-cdk/aws-codepipeline-actions.S3DeployAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBSTFELCtCQUE0QztBQUU1QyxzQ0FBbUM7QUFDbkMsc0NBQWlEO0FBRWpELDJEQUEyRDtBQUMzRCx5RUFBeUU7QUFDekUsOEZBQThGO0FBQzlGLDRDQUE0QztBQUM1Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQVk7SUF1QnZCLGtFQUFrRTtJQUNsRSxZQUEyQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtLQUFJO0lBdkI1QyxxREFBcUQ7SUFDOUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxPQUFPLElBQUksWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtJQUM5RSw4Q0FBOEM7SUFDdkMsTUFBTSxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7SUFDaEUsa0RBQWtEO0lBQzNDLE1BQU0sQ0FBQyxXQUFXLEtBQUssT0FBTyxJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFO0lBQ3hFLDRDQUE0QztJQUNyQyxNQUFNLENBQUMsU0FBUyxLQUFLLE9BQU8sSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtJQUNoRSw2Q0FBNkM7SUFDdEMsTUFBTSxDQUFDLFVBQVUsS0FBSyxPQUFPLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUU7SUFDbEUsc0RBQXNEO0lBQy9DLE1BQU0sQ0FBQyxlQUFlLEtBQUssT0FBTyxJQUFJLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUU7SUFDaEYsNkNBQTZDO0lBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBVyxJQUFJLE9BQU8sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDMUYsK0NBQStDO0lBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBVyxJQUFJLE9BQU8sSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDNUY7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFTLElBQUksT0FBTyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztBQXJCckUsb0NBeUJDOzs7QUFzREQ7O0dBRUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxlQUFNO0lBR3hDLFlBQVksS0FBMEI7UUFDcEMsS0FBSyxDQUFDO1lBQ0osR0FBRyxLQUFLO1lBQ1IsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3RCLFFBQVEsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU07WUFDNUMsUUFBUSxFQUFFLElBQUk7WUFDZCxjQUFjLEVBQUUsNkJBQW9CLEVBQUU7WUFDdEMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztTQUN0QixDQUFDLENBQUM7Ozs7OzsrQ0FYTSxjQUFjOzs7O1FBYXZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCO0lBRVMsS0FBSyxDQUFDLE1BQWlCLEVBQUUsTUFBMkIsRUFBRSxPQUF1QztRQUVyRyx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUMxQyxtRUFBbUU7WUFDbkUsb0RBQW9EO1lBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0M7UUFFRCxnRUFBZ0U7UUFDaEUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3JDLE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVU7Z0JBQ3hDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtnQkFDeEQsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztnQkFDL0IsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUN4RCxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQy9GLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLE1BQU07YUFDdEQ7U0FDRixDQUFDO0tBQ0g7O0FBekNILHdDQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsga2ViYWIgYXMgdG9LZWJhYkNhc2UgfSBmcm9tICdjYXNlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9uJztcbmltcG9ydCB7IGRlcGxveUFydGlmYWN0Qm91bmRzIH0gZnJvbSAnLi4vY29tbW9uJztcblxuLy8gQ2xhc3MgY29waWVkIHZlcmJhdGltIGZyb20gdGhlIGF3cy1zMy1kZXBsb3ltZW50IG1vZHVsZS5cbi8vIFllcywgaXQgc3Vja3MgdGhhdCB3ZSBkaWRuJ3QgYWJzdHJhY3QgdGhpcyBwcm9wZXJseSBpbiBhIGNvbW1vbiBjbGFzcyxcbi8vIGJ1dCBoYXZpbmcgMiBkaWZmZXJlbnQgQ2FjaGVDb250cm9sIGNsYXNzZXMgdGhhdCBiZWhhdmUgZGlmZmVyZW50bHkgd291bGQgYmUgd29yc2UgSSB0aGluay5cbi8vIFNvbWV0aGluZyB0byBkbyB3aGVuIENESyAyLjAuMCBjb21lcyBvdXQuXG4vKipcbiAqIFVzZWQgZm9yIEhUVFAgY2FjaGUtY29udHJvbCBoZWFkZXIsIHdoaWNoIGluZmx1ZW5jZXMgZG93bnN0cmVhbSBjYWNoZXMuXG4gKiBVc2UgdGhlIHByb3ZpZGVkIHN0YXRpYyBmYWN0b3J5IG1ldGhvZHMgdG8gY29uc3RydWN0IGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzLlxuICogVXNlZCBpbiB0aGUgYFMzRGVwbG95QWN0aW9uUHJvcHMuY2FjaGVDb250cm9sYCBwcm9wZXJ0eS5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vd3d3LnczLm9yZy9Qcm90b2NvbHMvcmZjMjYxNi9yZmMyNjE2LXNlYzE0Lmh0bWwjc2VjMTQuOVxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVDb250cm9sIHtcbiAgLyoqIFRoZSAnbXVzdC1yZXZhbGlkYXRlJyBjYWNoZSBjb250cm9sIGRpcmVjdGl2ZS4gKi9cbiAgcHVibGljIHN0YXRpYyBtdXN0UmV2YWxpZGF0ZSgpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2woJ211c3QtcmV2YWxpZGF0ZScpOyB9XG4gIC8qKiBUaGUgJ25vLWNhY2hlJyBjYWNoZSBjb250cm9sIGRpcmVjdGl2ZS4gKi9cbiAgcHVibGljIHN0YXRpYyBub0NhY2hlKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgnbm8tY2FjaGUnKTsgfVxuICAvKiogVGhlICduby10cmFuc2Zvcm0nIGNhY2hlIGNvbnRyb2wgZGlyZWN0aXZlLiAqL1xuICBwdWJsaWMgc3RhdGljIG5vVHJhbnNmb3JtKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgnbm8tdHJhbnNmb3JtJyk7IH1cbiAgLyoqIFRoZSAncHVibGljJyBjYWNoZSBjb250cm9sIGRpcmVjdGl2ZS4gKi9cbiAgcHVibGljIHN0YXRpYyBzZXRQdWJsaWMoKSB7IHJldHVybiBuZXcgQ2FjaGVDb250cm9sKCdwdWJsaWMnKTsgfVxuICAvKiogVGhlICdwcml2YXRlJyBjYWNoZSBjb250cm9sIGRpcmVjdGl2ZS4gKi9cbiAgcHVibGljIHN0YXRpYyBzZXRQcml2YXRlKCkgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbCgncHJpdmF0ZScpOyB9XG4gIC8qKiBUaGUgJ3Byb3h5LXJldmFsaWRhdGUnIGNhY2hlIGNvbnRyb2wgZGlyZWN0aXZlLiAqL1xuICBwdWJsaWMgc3RhdGljIHByb3h5UmV2YWxpZGF0ZSgpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2woJ3Byb3h5LXJldmFsaWRhdGUnKTsgfVxuICAvKiogVGhlICdtYXgtYWdlJyBjYWNoZSBjb250cm9sIGRpcmVjdGl2ZS4gKi9cbiAgcHVibGljIHN0YXRpYyBtYXhBZ2UodDogRHVyYXRpb24pIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2woYG1heC1hZ2U9JHt0LnRvU2Vjb25kcygpfWApOyB9XG4gIC8qKiBUaGUgJ3MtbWF4LWFnZScgY2FjaGUgY29udHJvbCBkaXJlY3RpdmUuICovXG4gIHB1YmxpYyBzdGF0aWMgc01heEFnZSh0OiBEdXJhdGlvbikgeyByZXR1cm4gbmV3IENhY2hlQ29udHJvbChgcy1tYXhhZ2U9JHt0LnRvU2Vjb25kcygpfWApOyB9XG4gIC8qKlxuICAgKiBBbGxvd3MgeW91IHRvIGNyZWF0ZSBhbiBhcmJpdHJhcnkgY2FjaGUgY29udHJvbCBkaXJlY3RpdmUsXG4gICAqIGluIGNhc2Ugb3VyIHN1cHBvcnQgaXMgbWlzc2luZyBhIG1ldGhvZCBmb3IgYSBwYXJ0aWN1bGFyIGRpcmVjdGl2ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmluZyhzOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBDYWNoZUNvbnRyb2wocyk7IH1cblxuICAvKiogQHBhcmFtIHZhbHVlIHRoZSBhY3R1YWwgdGV4dCB2YWx1ZSBvZiB0aGUgY3JlYXRlZCBkaXJlY3RpdmUgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IHN0cmluZykge31cbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiB0aGUgYFMzRGVwbG95QWN0aW9uIFMzIGRlcGxveSBBY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFMzRGVwbG95QWN0aW9uUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQXdzQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogU2hvdWxkIHRoZSBkZXBsb3kgYWN0aW9uIGV4dHJhY3QgdGhlIGFydGlmYWN0IGJlZm9yZSBkZXBsb3lpbmcgdG8gQW1hem9uIFMzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBleHRyYWN0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGtleSBvZiB0aGUgdGFyZ2V0IG9iamVjdC4gVGhpcyBpcyByZXF1aXJlZCBpZiBleHRyYWN0IGlzIGZhbHNlLlxuICAgKi9cbiAgcmVhZG9ubHkgb2JqZWN0S2V5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5wdXQgQXJ0aWZhY3QgdG8gZGVwbG95IHRvIEFtYXpvbiBTMy5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUzMgYnVja2V0IHRoYXQgaXMgdGhlIGRlcGxveSB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBzcGVjaWZpZWQgY2FubmVkIEFDTCB0byBvYmplY3RzIGRlcGxveWVkIHRvIEFtYXpvbiBTMy5cbiAgICogVGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBBQ0wgdGhhdCB3YXMgYXBwbGllZCB0byB0aGUgb2JqZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBvcmlnaW5hbCBvYmplY3QgQUNMXG4gICAqL1xuICByZWFkb25seSBhY2Nlc3NDb250cm9sPzogczMuQnVja2V0QWNjZXNzQ29udHJvbDtcblxuICAvKipcbiAgICogVGhlIGNhY2hpbmcgYmVoYXZpb3IgZm9yIHJlcXVlc3RzL3Jlc3BvbnNlcyBmb3Igb2JqZWN0cyBpbiB0aGUgYnVja2V0LlxuICAgKiBUaGUgZmluYWwgY2FjaGUgY29udHJvbCBwcm9wZXJ0eSB3aWxsIGJlIHRoZSByZXN1bHQgb2Ygam9pbmluZyBhbGwgb2YgdGhlIHByb3ZpZGVkIGFycmF5IGVsZW1lbnRzIHdpdGggYSBjb21tYVxuICAgKiAocGx1cyBhIHNwYWNlIGFmdGVyIHRoZSBjb21tYSkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZSwgZGVjaWRlZCBieSB0aGUgSFRUUCBjbGllbnRcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlQ29udHJvbD86IENhY2hlQ29udHJvbFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIEtNUyBlbmNyeXB0aW9uIGtleSBmb3IgdGhlIGhvc3QgYnVja2V0LlxuICAgKiBUaGUgZW5jcnlwdGlvbktleSBwYXJhbWV0ZXIgZW5jcnlwdHMgdXBsb2FkZWQgYXJ0aWZhY3RzIHdpdGggdGhlIHByb3ZpZGVkIEFXUyBLTVMga2V5LlxuICAgKiBGb3IgYSBLTVMga2V5LCB5b3UgY2FuIHVzZSB0aGUga2V5IElELCB0aGUga2V5IEFSTiwgb3IgdGhlIGFsaWFzIEFSTi5cbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG59XG5cbi8qKlxuICogRGVwbG95cyB0aGUgc291cmNlQXJ0aWZhY3QgdG8gQW1hem9uIFMzLlxuICovXG5leHBvcnQgY2xhc3MgUzNEZXBsb3lBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBTM0RlcGxveUFjdGlvblByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBTM0RlcGxveUFjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZXNvdXJjZTogcHJvcHMuYnVja2V0LFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5ERVBMT1ksXG4gICAgICBwcm92aWRlcjogJ1MzJyxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiBkZXBsb3lBcnRpZmFjdEJvdW5kcygpLFxuICAgICAgaW5wdXRzOiBbcHJvcHMuaW5wdXRdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIC8vIHBpcGVsaW5lIG5lZWRzIHBlcm1pc3Npb25zIHRvIHdyaXRlIHRvIHRoZSBTMyBidWNrZXRcbiAgICB0aGlzLnByb3BzLmJ1Y2tldC5ncmFudFdyaXRlKG9wdGlvbnMucm9sZSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5hY2Nlc3NDb250cm9sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBBQ0wgc2V0dGluZ3Mgb2Ygb2JqZWN0cyB3aXRoaW4gdGhlIEJ1Y2tldCxcbiAgICAgIC8vIHNvIGdyYW50IHRoZSBBY3Rpb24ncyBSb2xlIHBlcm1pc3Npb25zIHRvIGRvIHRoYXRcbiAgICAgIHRoaXMucHJvcHMuYnVja2V0LmdyYW50UHV0QWNsKG9wdGlvbnMucm9sZSk7XG4gICAgfVxuXG4gICAgLy8gdGhlIEFjdGlvbiBSb2xlIGFsc28gbmVlZHMgdG8gcmVhZCBmcm9tIHRoZSBQaXBlbGluZSdzIGJ1Y2tldFxuICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChvcHRpb25zLnJvbGUpO1xuXG4gICAgY29uc3QgYWNsID0gdGhpcy5wcm9wcy5hY2Nlc3NDb250cm9sO1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEJ1Y2tldE5hbWU6IHRoaXMucHJvcHMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIEV4dHJhY3Q6IHRoaXMucHJvcHMuZXh0cmFjdCA9PT0gZmFsc2UgPyAnZmFsc2UnIDogJ3RydWUnLFxuICAgICAgICBPYmplY3RLZXk6IHRoaXMucHJvcHMub2JqZWN0S2V5LFxuICAgICAgICBDYW5uZWRBQ0w6IGFjbCA/IHRvS2ViYWJDYXNlKGFjbC50b1N0cmluZygpKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgQ2FjaGVDb250cm9sOiB0aGlzLnByb3BzLmNhY2hlQ29udHJvbCAmJiB0aGlzLnByb3BzLmNhY2hlQ29udHJvbC5tYXAoYWMgPT4gYWMudmFsdWUpLmpvaW4oJywgJyksXG4gICAgICAgIEtNU0VuY3J5cHRpb25LZXlBUk46IHRoaXMucHJvcHMuZW5jcnlwdGlvbktleT8ua2V5QXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=