"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.jenkinsArtifactsBounds = exports.JenkinsProvider = exports.BaseJenkinsProvider = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const constructs_1 = require("constructs");
class BaseJenkinsProvider extends constructs_1.Construct {
    constructor(scope, id, version) {
        super(scope, id);
        this.version = version || '1';
    }
}
exports.BaseJenkinsProvider = BaseJenkinsProvider;
_a = JSII_RTTI_SYMBOL_1;
BaseJenkinsProvider[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.BaseJenkinsProvider", version: "0.0.0" };
/**
 * A class representing Jenkins providers.
 *
 * @see #import
 */
class JenkinsProvider extends BaseJenkinsProvider {
    constructor(scope, id, props) {
        super(scope, id, props.version);
        this.buildIncluded = false;
        this.testIncluded = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_JenkinsProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, JenkinsProvider);
            }
            throw error;
        }
        this.providerName = props.providerName;
        this.serverUrl = props.serverUrl;
        if (props.forBuild === true) {
            this._registerBuildProvider();
        }
        if (props.forTest === true) {
            this._registerTestProvider();
        }
    }
    /**
     * Import a Jenkins provider registered either outside the CDK,
     * or in a different CDK Stack.
     *
     * @param scope the parent Construct for the new provider
     * @param id the identifier of the new provider Construct
     * @param attrs the properties used to identify the existing provider
     * @returns a new Construct representing a reference to an existing Jenkins provider
     */
    static fromJenkinsProviderAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_JenkinsProviderAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromJenkinsProviderAttributes);
            }
            throw error;
        }
        return new ImportedJenkinsProvider(scope, id, attrs);
    }
    /**
     * @internal
     */
    _registerBuildProvider() {
        if (this.buildIncluded) {
            return;
        }
        this.buildIncluded = true;
        this.registerJenkinsCustomAction('JenkinsBuildProviderResource', codepipeline.ActionCategory.BUILD);
    }
    /**
     * @internal
     */
    _registerTestProvider() {
        if (this.testIncluded) {
            return;
        }
        this.testIncluded = true;
        this.registerJenkinsCustomAction('JenkinsTestProviderResource', codepipeline.ActionCategory.TEST);
    }
    registerJenkinsCustomAction(id, category) {
        new codepipeline.CustomActionRegistration(this, id, {
            category,
            artifactBounds: exports.jenkinsArtifactsBounds,
            provider: this.providerName,
            version: this.version,
            entityUrl: appendToUrl(this.serverUrl, 'job/{Config:ProjectName}'),
            executionUrl: appendToUrl(this.serverUrl, 'job/{Config:ProjectName}/{ExternalExecutionId}'),
            actionProperties: [
                {
                    name: 'ProjectName',
                    required: true,
                    key: true,
                    queryable: true,
                },
            ],
        });
    }
}
exports.JenkinsProvider = JenkinsProvider;
_b = JSII_RTTI_SYMBOL_1;
JenkinsProvider[_b] = { fqn: "@aws-cdk/aws-codepipeline-actions.JenkinsProvider", version: "0.0.0" };
class ImportedJenkinsProvider extends BaseJenkinsProvider {
    constructor(scope, id, props) {
        super(scope, id, props.version);
        this.providerName = props.providerName;
        this.serverUrl = props.serverUrl;
    }
    _registerBuildProvider() {
    }
    _registerTestProvider() {
    }
}
function appendToUrl(baseUrl, path) {
    return baseUrl.endsWith('/') ? baseUrl + path : `${baseUrl}/${path}`;
}
exports.jenkinsArtifactsBounds = {
    minInputs: 0,
    maxInputs: 5,
    minOutputs: 0,
    maxOutputs: 5,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVua2lucy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImplbmtpbnMtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELDJDQUFtRDtBQXNHbkQsTUFBc0IsbUJBQW9CLFNBQVEsc0JBQVM7SUFLekQsWUFBc0IsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsT0FBZ0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxHQUFHLENBQUM7S0FDL0I7O0FBVEgsa0RBb0JDOzs7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSxlQUFnQixTQUFRLG1CQUFtQjtJQW1CdEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEyQjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFKMUIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIsaUJBQVksR0FBRyxLQUFLLENBQUM7Ozs7OzsrQ0FqQmxCLGVBQWU7Ozs7UUFzQnhCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFFakMsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztTQUMvQjtRQUNELElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDMUIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7U0FDOUI7S0FDRjtJQTlCRDs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFnQzs7Ozs7Ozs7OztRQUN4RyxPQUFPLElBQUksdUJBQXVCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN0RDtJQXFCRDs7T0FFRztJQUNJLHNCQUFzQjtRQUMzQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLDhCQUE4QixFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckc7SUFFRDs7T0FFRztJQUNJLHFCQUFxQjtRQUMxQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLDZCQUE2QixFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkc7SUFFTywyQkFBMkIsQ0FBQyxFQUFVLEVBQUUsUUFBcUM7UUFDbkYsSUFBSSxZQUFZLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUNsRCxRQUFRO1lBQ1IsY0FBYyxFQUFFLDhCQUFzQjtZQUN0QyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDM0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFNBQVMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQztZQUNsRSxZQUFZLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0RBQWdELENBQUM7WUFDM0YsZ0JBQWdCLEVBQUU7Z0JBQ2hCO29CQUNFLElBQUksRUFBRSxhQUFhO29CQUNuQixRQUFRLEVBQUUsSUFBSTtvQkFDZCxHQUFHLEVBQUUsSUFBSTtvQkFDVCxTQUFTLEVBQUUsSUFBSTtpQkFDaEI7YUFDRjtTQUNGLENBQUMsQ0FBQztLQUNKOztBQXhFSCwwQ0F5RUM7OztBQUVELE1BQU0sdUJBQXdCLFNBQVEsbUJBQW1CO0lBSXZELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBZ0M7UUFDeEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7S0FDbEM7SUFFTSxzQkFBc0I7S0FFNUI7SUFFTSxxQkFBcUI7S0FFM0I7Q0FDRjtBQUVELFNBQVMsV0FBVyxDQUFDLE9BQWUsRUFBRSxJQUFZO0lBQ2hELE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkUsQ0FBQztBQUVZLFFBQUEsc0JBQXNCLEdBQXNDO0lBQ3ZFLFNBQVMsRUFBRSxDQUFDO0lBQ1osU0FBUyxFQUFFLENBQUM7SUFDWixVQUFVLEVBQUUsQ0FBQztJQUNiLFVBQVUsRUFBRSxDQUFDO0NBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIEEgSmVua2lucyBwcm92aWRlci5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBjcmVhdGUgYSBuZXcgSmVua2lucyBwcm92aWRlciBtYW5hZ2VkIGFsb25nc2lkZSB5b3VyIENESyBjb2RlLFxuICogaW5zdGFudGlhdGUgdGhlIGBKZW5raW5zUHJvdmlkZXJgIGNsYXNzIGRpcmVjdGx5LlxuICpcbiAqIElmIHlvdSB3YW50IHRvIHJlZmVyZW5jZSBhbiBhbHJlYWR5IHJlZ2lzdGVyZWQgcHJvdmlkZXIsXG4gKiB1c2UgdGhlIGBKZW5raW5zUHJvdmlkZXIjZnJvbUplbmtpbnNQcm92aWRlckF0dHJpYnV0ZXNgIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJSmVua2luc1Byb3ZpZGVyIGV4dGVuZHMgSUNvbnN0cnVjdCB7XG4gIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBzZXJ2ZXJVcmw6IHN0cmluZztcbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBKZW5raW5zIFByb3ZpZGVyIGZvciB0aGUgYnVpbGQgY2F0ZWdvcnkuXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgYXV0b21hdGljYWxseSBjYWxsZWQgd2hlbiBjcmVhdGluZ1xuICAgKiBhIGBKZW5raW5zQWN0aW9uYCxcbiAgICogc28geW91IHNob3VsZCBuZXZlciBuZWVkIHRvIGNhbGwgaXQgZXhwbGljaXRseS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfcmVnaXN0ZXJCdWlsZFByb3ZpZGVyKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIEplbmtpbnMgUHJvdmlkZXIgZm9yIHRoZSB0ZXN0IGNhdGVnb3J5LlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgY2FsbGVkIHdoZW4gY3JlYXRpbmdcbiAgICogYSBgSmVua2luc1Rlc3RBY3Rpb25gLFxuICAgKiBzbyB5b3Ugc2hvdWxkIG5ldmVyIG5lZWQgdG8gY2FsbCBpdCBleHBsaWNpdGx5LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9yZWdpc3RlclRlc3RQcm92aWRlcigpOiB2b2lkO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGltcG9ydGluZyBhbiBleGlzdGluZyBKZW5raW5zIHByb3ZpZGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEplbmtpbnNQcm92aWRlckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIEplbmtpbnMgcHJvdmlkZXIgdGhhdCB5b3Ugc2V0IGluIHRoZSBBV1MgQ29kZVBpcGVsaW5lIHBsdWdpbiBjb25maWd1cmF0aW9uIG9mIHlvdXIgSmVua2lucyBwcm9qZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZSAnTXlKZW5raW5zUHJvdmlkZXInXG4gICAqL1xuICByZWFkb25seSBwcm92aWRlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGJhc2UgVVJMIG9mIHlvdXIgSmVua2lucyBzZXJ2ZXIuXG4gICAqXG4gICAqIEBleGFtcGxlICdodHRwOi8vbXlqZW5raW5zLmNvbTo4MDgwJ1xuICAgKi9cbiAgcmVhZG9ubHkgc2VydmVyVXJsOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIHlvdXIgcHJvdmlkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0ICcxJ1xuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKZW5raW5zUHJvdmlkZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSmVua2lucyBwcm92aWRlciB0aGF0IHlvdSBzZXQgaW4gdGhlIEFXUyBDb2RlUGlwZWxpbmUgcGx1Z2luIGNvbmZpZ3VyYXRpb24gb2YgeW91ciBKZW5raW5zIHByb2plY3QuXG4gICAqXG4gICAqIEBleGFtcGxlICdNeUplbmtpbnNQcm92aWRlcidcbiAgICovXG4gIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBVUkwgb2YgeW91ciBKZW5raW5zIHNlcnZlci5cbiAgICpcbiAgICogQGV4YW1wbGUgJ2h0dHA6Ly9teWplbmtpbnMuY29tOjgwODAnXG4gICAqL1xuICByZWFkb25seSBzZXJ2ZXJVcmw6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gb2YgeW91ciBwcm92aWRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgJzEnXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGltbWVkaWF0ZWx5IHJlZ2lzdGVyIGEgSmVua2lucyBQcm92aWRlciBmb3IgdGhlIGJ1aWxkIGNhdGVnb3J5LlxuICAgKiBUaGUgUHJvdmlkZXIgd2lsbCBhbHdheXMgYmUgcmVnaXN0ZXJlZCBpZiB5b3UgY3JlYXRlIGEgYEplbmtpbnNBY3Rpb25gLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZm9yQnVpbGQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGltbWVkaWF0ZWx5IHJlZ2lzdGVyIGEgSmVua2lucyBQcm92aWRlciBmb3IgdGhlIHRlc3QgY2F0ZWdvcnkuXG4gICAqIFRoZSBQcm92aWRlciB3aWxsIGFsd2F5cyBiZSByZWdpc3RlcmVkIGlmIHlvdSBjcmVhdGUgYSBgSmVua2luc1Rlc3RBY3Rpb25gLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZm9yVGVzdD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlSmVua2luc1Byb3ZpZGVyIGV4dGVuZHMgQ29uc3RydWN0IGltcGxlbWVudHMgSUplbmtpbnNQcm92aWRlciB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcm92aWRlck5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHNlcnZlclVybDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCB2ZXJzaW9uPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb24gfHwgJzEnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9yZWdpc3RlckJ1aWxkUHJvdmlkZXIoKTogdm9pZDtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX3JlZ2lzdGVyVGVzdFByb3ZpZGVyKCk6IHZvaWQ7XG59XG5cbi8qKlxuICogQSBjbGFzcyByZXByZXNlbnRpbmcgSmVua2lucyBwcm92aWRlcnMuXG4gKlxuICogQHNlZSAjaW1wb3J0XG4gKi9cbmV4cG9ydCBjbGFzcyBKZW5raW5zUHJvdmlkZXIgZXh0ZW5kcyBCYXNlSmVua2luc1Byb3ZpZGVyIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhIEplbmtpbnMgcHJvdmlkZXIgcmVnaXN0ZXJlZCBlaXRoZXIgb3V0c2lkZSB0aGUgQ0RLLFxuICAgKiBvciBpbiBhIGRpZmZlcmVudCBDREsgU3RhY2suXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgcGFyZW50IENvbnN0cnVjdCBmb3IgdGhlIG5ldyBwcm92aWRlclxuICAgKiBAcGFyYW0gaWQgdGhlIGlkZW50aWZpZXIgb2YgdGhlIG5ldyBwcm92aWRlciBDb25zdHJ1Y3RcbiAgICogQHBhcmFtIGF0dHJzIHRoZSBwcm9wZXJ0aWVzIHVzZWQgdG8gaWRlbnRpZnkgdGhlIGV4aXN0aW5nIHByb3ZpZGVyXG4gICAqIEByZXR1cm5zIGEgbmV3IENvbnN0cnVjdCByZXByZXNlbnRpbmcgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgSmVua2lucyBwcm92aWRlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSmVua2luc1Byb3ZpZGVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogSmVua2luc1Byb3ZpZGVyQXR0cmlidXRlcyk6IElKZW5raW5zUHJvdmlkZXIge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRKZW5raW5zUHJvdmlkZXIoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzZXJ2ZXJVcmw6IHN0cmluZztcbiAgcHJpdmF0ZSBidWlsZEluY2x1ZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgdGVzdEluY2x1ZGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEplbmtpbnNQcm92aWRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcy52ZXJzaW9uKTtcblxuICAgIHRoaXMucHJvdmlkZXJOYW1lID0gcHJvcHMucHJvdmlkZXJOYW1lO1xuICAgIHRoaXMuc2VydmVyVXJsID0gcHJvcHMuc2VydmVyVXJsO1xuXG4gICAgaWYgKHByb3BzLmZvckJ1aWxkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9yZWdpc3RlckJ1aWxkUHJvdmlkZXIoKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmZvclRlc3QgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyVGVzdFByb3ZpZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9yZWdpc3RlckJ1aWxkUHJvdmlkZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYnVpbGRJbmNsdWRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmJ1aWxkSW5jbHVkZWQgPSB0cnVlO1xuICAgIHRoaXMucmVnaXN0ZXJKZW5raW5zQ3VzdG9tQWN0aW9uKCdKZW5raW5zQnVpbGRQcm92aWRlclJlc291cmNlJywgY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LkJVSUxEKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfcmVnaXN0ZXJUZXN0UHJvdmlkZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGVzdEluY2x1ZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudGVzdEluY2x1ZGVkID0gdHJ1ZTtcbiAgICB0aGlzLnJlZ2lzdGVySmVua2luc0N1c3RvbUFjdGlvbignSmVua2luc1Rlc3RQcm92aWRlclJlc291cmNlJywgY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LlRFU1QpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckplbmtpbnNDdXN0b21BY3Rpb24oaWQ6IHN0cmluZywgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeSkge1xuICAgIG5ldyBjb2RlcGlwZWxpbmUuQ3VzdG9tQWN0aW9uUmVnaXN0cmF0aW9uKHRoaXMsIGlkLCB7XG4gICAgICBjYXRlZ29yeSxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiBqZW5raW5zQXJ0aWZhY3RzQm91bmRzLFxuICAgICAgcHJvdmlkZXI6IHRoaXMucHJvdmlkZXJOYW1lLFxuICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgZW50aXR5VXJsOiBhcHBlbmRUb1VybCh0aGlzLnNlcnZlclVybCwgJ2pvYi97Q29uZmlnOlByb2plY3ROYW1lfScpLFxuICAgICAgZXhlY3V0aW9uVXJsOiBhcHBlbmRUb1VybCh0aGlzLnNlcnZlclVybCwgJ2pvYi97Q29uZmlnOlByb2plY3ROYW1lfS97RXh0ZXJuYWxFeGVjdXRpb25JZH0nKSxcbiAgICAgIGFjdGlvblByb3BlcnRpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQcm9qZWN0TmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAga2V5OiB0cnVlLFxuICAgICAgICAgIHF1ZXJ5YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgSW1wb3J0ZWRKZW5raW5zUHJvdmlkZXIgZXh0ZW5kcyBCYXNlSmVua2luc1Byb3ZpZGVyIHtcbiAgcHVibGljIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmVyVXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEplbmtpbnNQcm92aWRlckF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzLnZlcnNpb24pO1xuXG4gICAgdGhpcy5wcm92aWRlck5hbWUgPSBwcm9wcy5wcm92aWRlck5hbWU7XG4gICAgdGhpcy5zZXJ2ZXJVcmwgPSBwcm9wcy5zZXJ2ZXJVcmw7XG4gIH1cblxuICBwdWJsaWMgX3JlZ2lzdGVyQnVpbGRQcm92aWRlcigpOiB2b2lkIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICBwdWJsaWMgX3JlZ2lzdGVyVGVzdFByb3ZpZGVyKCk6IHZvaWQge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmRUb1VybChiYXNlVXJsOiBzdHJpbmcsIHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBiYXNlVXJsLmVuZHNXaXRoKCcvJykgPyBiYXNlVXJsICsgcGF0aCA6IGAke2Jhc2VVcmx9LyR7cGF0aH1gO1xufVxuXG5leHBvcnQgY29uc3QgamVua2luc0FydGlmYWN0c0JvdW5kczogY29kZXBpcGVsaW5lLkFjdGlvbkFydGlmYWN0Qm91bmRzID0ge1xuICBtaW5JbnB1dHM6IDAsXG4gIG1heElucHV0czogNSxcbiAgbWluT3V0cHV0czogMCxcbiAgbWF4T3V0cHV0czogNSxcbn07XG4iXX0=