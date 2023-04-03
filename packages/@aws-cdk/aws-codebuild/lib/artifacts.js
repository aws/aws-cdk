"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifacts = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Artifacts definition for a CodeBuild Project.
 */
class Artifacts {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_ArtifactsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Artifacts);
            }
            throw error;
        }
        this.identifier = props.identifier;
    }
    static s3(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_S3ArtifactsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.s3);
            }
            throw error;
        }
        return new S3Artifacts(props);
    }
    bind(_scope, _project) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_IProject(_project);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return {
            artifactsProperty: {
                artifactIdentifier: this.identifier,
                type: this.type,
            },
        };
    }
}
exports.Artifacts = Artifacts;
_a = JSII_RTTI_SYMBOL_1;
Artifacts[_a] = { fqn: "@aws-cdk/aws-codebuild.Artifacts", version: "0.0.0" };
/**
 * S3 Artifact definition for a CodeBuild Project.
 */
class S3Artifacts extends Artifacts {
    constructor(props) {
        super(props);
        this.props = props;
        this.type = 'S3';
    }
    bind(_scope, project) {
        this.props.bucket.grantReadWrite(project);
        const superConfig = super.bind(_scope, project);
        return {
            artifactsProperty: {
                ...superConfig.artifactsProperty,
                location: this.props.bucket.bucketName,
                path: this.props.path,
                namespaceType: this.props.includeBuildId === false ? 'NONE' : 'BUILD_ID',
                name: this.props.name == null ? undefined : this.props.name,
                packaging: this.props.packageZip === false ? 'NONE' : 'ZIP',
                encryptionDisabled: this.props.encryption === false ? true : undefined,
                overrideArtifactName: this.props.name == null ? true : undefined,
            },
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJ0aWZhY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQW1EQTs7R0FFRztBQUNILE1BQXNCLFNBQVM7SUFRN0IsWUFBc0IsS0FBcUI7Ozs7OzsrQ0FSdkIsU0FBUzs7OztRQVMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7S0FDcEM7SUFUTSxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQXVCOzs7Ozs7Ozs7O1FBQ3RDLE9BQU8sSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0I7SUFTTSxJQUFJLENBQUMsTUFBaUIsRUFBRSxRQUFrQjs7Ozs7Ozs7OztRQUMvQyxPQUFPO1lBQ0wsaUJBQWlCLEVBQUU7Z0JBQ2pCLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUNuQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDaEI7U0FDRixDQUFDO0tBQ0g7O0FBbkJILDhCQW9CQzs7O0FBMEREOztHQUVHO0FBQ0gsTUFBTSxXQUFZLFNBQVEsU0FBUztJQUdqQyxZQUE2QixLQUF1QjtRQUNsRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFEYyxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUZwQyxTQUFJLEdBQUcsSUFBSSxDQUFDO0tBSTNCO0lBRU0sSUFBSSxDQUFDLE1BQWlCLEVBQUUsT0FBaUI7UUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE9BQU87WUFDTCxpQkFBaUIsRUFBRTtnQkFDakIsR0FBRyxXQUFXLENBQUMsaUJBQWlCO2dCQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDdEMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtnQkFDckIsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVO2dCQUN4RSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtnQkFDM0QsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLO2dCQUMzRCxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDdEUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDakU7U0FDRixDQUFDO0tBQ0g7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblByb2plY3QgfSBmcm9tICcuL2NvZGVidWlsZC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVByb2plY3QgfSBmcm9tICcuL3Byb2plY3QnO1xuXG4vKipcbiAqIFRoZSB0eXBlIHJldHVybmVkIGZyb20gYElBcnRpZmFjdHMjYmluZGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXJ0aWZhY3RzQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBsb3ctbGV2ZWwgQ2xvdWRGb3JtYXRpb24gYXJ0aWZhY3RzIHByb3BlcnR5LlxuICAgKi9cbiAgcmVhZG9ubHkgYXJ0aWZhY3RzUHJvcGVydHk6IENmblByb2plY3QuQXJ0aWZhY3RzUHJvcGVydHk7XG59XG5cbi8qKlxuICogVGhlIGFic3RyYWN0IGludGVyZmFjZSBvZiBhIENvZGVCdWlsZCBidWlsZCBvdXRwdXQuXG4gKiBJbXBsZW1lbnRlZCBieSBgQXJ0aWZhY3RzYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQXJ0aWZhY3RzIHtcbiAgLyoqXG4gICAqIFRoZSBhcnRpZmFjdCBpZGVudGlmaWVyLlxuICAgKiBUaGlzIHByb3BlcnR5IGlzIHJlcXVpcmVkIG9uIHNlY29uZGFyeSBhcnRpZmFjdHMuXG4gICAqL1xuICByZWFkb25seSBpZGVudGlmaWVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ29kZUJ1aWxkIHR5cGUgb2YgdGhpcyBhcnRpZmFjdC5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQ2FsbGJhY2sgd2hlbiBhbiBBcnRpZmFjdHMgY2xhc3MgaXMgdXNlZCBpbiBhIENvZGVCdWlsZCBQcm9qZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgYSByb290IENvbnN0cnVjdCB0aGF0IGFsbG93cyBjcmVhdGluZyBuZXcgQ29uc3RydWN0c1xuICAgKiBAcGFyYW0gcHJvamVjdCB0aGUgUHJvamVjdCB0aGlzIEFydGlmYWN0cyBpcyB1c2VkIGluXG4gICAqL1xuICBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIHByb2plY3Q6IElQcm9qZWN0KTogQXJ0aWZhY3RzQ29uZmlnO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgY29tbW9uIHRvIGFsbCBBcnRpZmFjdHMgY2xhc3Nlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBcnRpZmFjdHNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgYXJ0aWZhY3QgaWRlbnRpZmllci5cbiAgICogVGhpcyBwcm9wZXJ0eSBpcyByZXF1aXJlZCBvbiBzZWNvbmRhcnkgYXJ0aWZhY3RzLlxuICAgKi9cbiAgcmVhZG9ubHkgaWRlbnRpZmllcj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBcnRpZmFjdHMgZGVmaW5pdGlvbiBmb3IgYSBDb2RlQnVpbGQgUHJvamVjdC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFydGlmYWN0cyBpbXBsZW1lbnRzIElBcnRpZmFjdHMge1xuICBwdWJsaWMgc3RhdGljIHMzKHByb3BzOiBTM0FydGlmYWN0c1Byb3BzKTogSUFydGlmYWN0cyB7XG4gICAgcmV0dXJuIG5ldyBTM0FydGlmYWN0cyhwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpZmllcj86IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJvcHM6IEFydGlmYWN0c1Byb3BzKSB7XG4gICAgdGhpcy5pZGVudGlmaWVyID0gcHJvcHMuaWRlbnRpZmllcjtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfcHJvamVjdDogSVByb2plY3QpOiBBcnRpZmFjdHNDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBhcnRpZmFjdHNQcm9wZXJ0eToge1xuICAgICAgICBhcnRpZmFjdElkZW50aWZpZXI6IHRoaXMuaWRlbnRpZmllcixcbiAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBTM0FydGlmYWN0c2AuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNBcnRpZmFjdHNQcm9wcyBleHRlbmRzIEFydGlmYWN0c1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBvdXRwdXQgYnVja2V0LlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBpbnNpZGUgb2YgdGhlIGJ1Y2tldCBmb3IgdGhlIGJ1aWxkIG91dHB1dCAuemlwIGZpbGUgb3IgZm9sZGVyLlxuICAgKiBJZiBhIHZhbHVlIGlzIG5vdCBzcGVjaWZpZWQsIHRoZW4gYnVpbGQgb3V0cHV0IHdpbGwgYmUgc3RvcmVkIGF0IHRoZSByb290IG9mIHRoZVxuICAgKiBidWNrZXQgKG9yIHVuZGVyIHRoZSA8YnVpbGQtaWQ+IGRpcmVjdG9yeSBpZiBgaW5jbHVkZUJ1aWxkSWRgIGlzIHNldCB0byB0cnVlKS5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIHJvb3Qgb2YgdGhlIGJ1Y2tldFxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGJ1aWxkIG91dHB1dCBaSVAgZmlsZSBvciBmb2xkZXIgaW5zaWRlIHRoZSBidWNrZXQuXG4gICAqXG4gICAqIFRoZSBmdWxsIFMzIG9iamVjdCBrZXkgd2lsbCBiZSBcIjxwYXRoPi88YnVpbGQtaWQ+LzxuYW1lPlwiIG9yXG4gICAqIFwiPHBhdGg+LzxuYW1lPlwiIGRlcGVuZGluZyBvbiB3aGV0aGVyIGBpbmNsdWRlQnVpbGRJZGAgaXMgc2V0IHRvIHRydWUuXG4gICAqXG4gICAqIElmIG5vdCBzZXQsIGBvdmVycmlkZUFydGlmYWN0TmFtZWAgd2lsbCBiZSBzZXQgYW5kIHRoZSBuYW1lIGZyb20gdGhlXG4gICAqIGJ1aWxkc3BlYyB3aWxsIGJlIHVzZWQgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdW5kZWZpbmVkLCBhbmQgdXNlIHRoZSBuYW1lIGZyb20gdGhlIGJ1aWxkc3BlY1xuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBidWlsZCBJRCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIHBhdGguIElmIHRoaXMgaXMgc2V0IHRvIHRydWUsXG4gICAqIHRoZW4gdGhlIGJ1aWxkIGFydGlmYWN0IHdpbGwgYmUgc3RvcmVkIGluIFwiPHBhdGg+LzxidWlsZC1pZD4vPG5hbWU+XCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGluY2x1ZGVCdWlsZElkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdGhpcyBpcyB0cnVlLCBhbGwgYnVpbGQgb3V0cHV0IHdpbGwgYmUgcGFja2FnZWQgaW50byBhIHNpbmdsZSAuemlwIGZpbGUuXG4gICAqIE90aGVyd2lzZSwgYWxsIGZpbGVzIHdpbGwgYmUgdXBsb2FkZWQgdG8gPHBhdGg+LzxuYW1lPlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlIC0gZmlsZXMgd2lsbCBiZSBhcmNoaXZlZFxuICAgKi9cbiAgcmVhZG9ubHkgcGFja2FnZVppcD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgaXMgZmFsc2UsIGJ1aWxkIG91dHB1dCB3aWxsIG5vdCBiZSBlbmNyeXB0ZWQuXG4gICAqIFRoaXMgaXMgdXNlZnVsIGlmIHRoZSBhcnRpZmFjdCB0byBwdWJsaXNoIGEgc3RhdGljIHdlYnNpdGUgb3Igc2hhcmluZyBjb250ZW50IHdpdGggb3RoZXJzXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWUgLSBvdXRwdXQgd2lsbCBiZSBlbmNyeXB0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb24/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFMzIEFydGlmYWN0IGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIFByb2plY3QuXG4gKi9cbmNsYXNzIFMzQXJ0aWZhY3RzIGV4dGVuZHMgQXJ0aWZhY3RzIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSAnUzMnO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFMzQXJ0aWZhY3RzUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgcHJvamVjdDogSVByb2plY3QpOiBBcnRpZmFjdHNDb25maWcge1xuICAgIHRoaXMucHJvcHMuYnVja2V0LmdyYW50UmVhZFdyaXRlKHByb2plY3QpO1xuICAgIGNvbnN0IHN1cGVyQ29uZmlnID0gc3VwZXIuYmluZChfc2NvcGUsIHByb2plY3QpO1xuICAgIHJldHVybiB7XG4gICAgICBhcnRpZmFjdHNQcm9wZXJ0eToge1xuICAgICAgICAuLi5zdXBlckNvbmZpZy5hcnRpZmFjdHNQcm9wZXJ0eSxcbiAgICAgICAgbG9jYXRpb246IHRoaXMucHJvcHMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIHBhdGg6IHRoaXMucHJvcHMucGF0aCxcbiAgICAgICAgbmFtZXNwYWNlVHlwZTogdGhpcy5wcm9wcy5pbmNsdWRlQnVpbGRJZCA9PT0gZmFsc2UgPyAnTk9ORScgOiAnQlVJTERfSUQnLFxuICAgICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgICAgcGFja2FnaW5nOiB0aGlzLnByb3BzLnBhY2thZ2VaaXAgPT09IGZhbHNlID8gJ05PTkUnIDogJ1pJUCcsXG4gICAgICAgIGVuY3J5cHRpb25EaXNhYmxlZDogdGhpcy5wcm9wcy5lbmNyeXB0aW9uID09PSBmYWxzZSA/IHRydWUgOiB1bmRlZmluZWQsXG4gICAgICAgIG92ZXJyaWRlQXJ0aWZhY3ROYW1lOiB0aGlzLnByb3BzLm5hbWUgPT0gbnVsbCA/IHRydWUgOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==