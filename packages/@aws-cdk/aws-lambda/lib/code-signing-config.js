"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSigningConfig = exports.UntrustedArtifactOnDeployment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const lambda_generated_1 = require("./lambda.generated");
/**
 * Code signing configuration policy for deployment validation failure.
 */
var UntrustedArtifactOnDeployment;
(function (UntrustedArtifactOnDeployment) {
    /**
     * Lambda blocks the deployment request if signature validation checks fail.
     */
    UntrustedArtifactOnDeployment["ENFORCE"] = "Enforce";
    /**
     * Lambda allows the deployment of the code package, but issues a warning.
     * Lambda issues a new Amazon CloudWatch metric, called a signature validation error and also stores the warning in CloudTrail.
     */
    UntrustedArtifactOnDeployment["WARN"] = "Warn";
})(UntrustedArtifactOnDeployment = exports.UntrustedArtifactOnDeployment || (exports.UntrustedArtifactOnDeployment = {}));
/**
 * Defines a Code Signing Config.
 *
 * @resource AWS::Lambda::CodeSigningConfig
 */
class CodeSigningConfig extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_CodeSigningConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodeSigningConfig);
            }
            throw error;
        }
        const signingProfileVersionArns = props.signingProfiles.map(signingProfile => {
            return signingProfile.signingProfileVersionArn;
        });
        const resource = new lambda_generated_1.CfnCodeSigningConfig(this, 'Resource', {
            allowedPublishers: {
                signingProfileVersionArns,
            },
            codeSigningPolicies: {
                untrustedArtifactOnDeployment: props.untrustedArtifactOnDeployment ?? UntrustedArtifactOnDeployment.WARN,
            },
            description: props.description,
        });
        this.codeSigningConfigArn = resource.attrCodeSigningConfigArn;
        this.codeSigningConfigId = resource.attrCodeSigningConfigId;
    }
    /**
     * Creates a Signing Profile construct that represents an external Signing Profile.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param codeSigningConfigArn The ARN of code signing config.
     */
    static fromCodeSigningConfigArn(scope, id, codeSigningConfigArn) {
        const codeSigningProfileId = core_1.Stack.of(scope).splitArn(codeSigningConfigArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        if (!codeSigningProfileId) {
            throw new Error(`Code signing config ARN must be in the format 'arn:aws:lambda:<region>:<account>:code-signing-config:<codeSigningConfigArn>', got: '${codeSigningConfigArn}'`);
        }
        const assertedCodeSigningProfileId = codeSigningProfileId;
        class Import extends core_1.Resource {
            constructor() {
                super(scope, id);
                this.codeSigningConfigArn = codeSigningConfigArn;
                this.codeSigningConfigId = assertedCodeSigningProfileId;
            }
        }
        return new Import();
    }
}
exports.CodeSigningConfig = CodeSigningConfig;
_a = JSII_RTTI_SYMBOL_1;
CodeSigningConfig[_a] = { fqn: "@aws-cdk/aws-lambda.CodeSigningConfig", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1zaWduaW5nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGUtc2lnbmluZy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQXNFO0FBRXRFLHlEQUEwRDtBQUUxRDs7R0FFRztBQUNILElBQVksNkJBV1g7QUFYRCxXQUFZLDZCQUE2QjtJQUN2Qzs7T0FFRztJQUNILG9EQUFtQixDQUFBO0lBRW5COzs7T0FHRztJQUNILDhDQUFhLENBQUE7QUFDZixDQUFDLEVBWFcsNkJBQTZCLEdBQTdCLHFDQUE2QixLQUE3QixxQ0FBNkIsUUFXeEM7QUFnREQ7Ozs7R0FJRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsZUFBUTtJQTRCN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBN0JSLGlCQUFpQjs7OztRQStCMUIsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMzRSxPQUFPLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUF5QixJQUFJLHVDQUFvQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDaEYsaUJBQWlCLEVBQUU7Z0JBQ2pCLHlCQUF5QjthQUMxQjtZQUNELG1CQUFtQixFQUFFO2dCQUNuQiw2QkFBNkIsRUFBRSxLQUFLLENBQUMsNkJBQTZCLElBQUksNkJBQTZCLENBQUMsSUFBSTthQUN6RztZQUNELFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsUUFBUSxDQUFDLHdCQUF3QixDQUFDO1FBQzlELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUM7S0FDN0Q7SUE3Q0Q7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFFLEtBQWdCLEVBQUUsRUFBVSxFQUFFLG9CQUE0QjtRQUNoRyxNQUFNLG9CQUFvQixHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDeEgsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsdUlBQXVJLG9CQUFvQixHQUFHLENBQUMsQ0FBQztTQUNqTDtRQUNELE1BQU0sNEJBQTRCLEdBQUcsb0JBQW9CLENBQUM7UUFDMUQsTUFBTSxNQUFPLFNBQVEsZUFBUTtZQUkzQjtnQkFDRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUpILHlCQUFvQixHQUFHLG9CQUFvQixDQUFDO2dCQUM1Qyx3QkFBbUIsR0FBRyw0QkFBNEIsQ0FBQztZQUluRSxDQUFDO1NBQ0Y7UUFDRCxPQUFPLElBQUksTUFBTSxFQUFFLENBQUM7S0FDckI7O0FBdkJILDhDQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElTaWduaW5nUHJvZmlsZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zaWduZXInO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Db2RlU2lnbmluZ0NvbmZpZyB9IGZyb20gJy4vbGFtYmRhLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogQ29kZSBzaWduaW5nIGNvbmZpZ3VyYXRpb24gcG9saWN5IGZvciBkZXBsb3ltZW50IHZhbGlkYXRpb24gZmFpbHVyZS5cbiAqL1xuZXhwb3J0IGVudW0gVW50cnVzdGVkQXJ0aWZhY3RPbkRlcGxveW1lbnQge1xuICAvKipcbiAgICogTGFtYmRhIGJsb2NrcyB0aGUgZGVwbG95bWVudCByZXF1ZXN0IGlmIHNpZ25hdHVyZSB2YWxpZGF0aW9uIGNoZWNrcyBmYWlsLlxuICAgKi9cbiAgRU5GT1JDRSA9ICdFbmZvcmNlJyxcblxuICAvKipcbiAgICogTGFtYmRhIGFsbG93cyB0aGUgZGVwbG95bWVudCBvZiB0aGUgY29kZSBwYWNrYWdlLCBidXQgaXNzdWVzIGEgd2FybmluZy5cbiAgICogTGFtYmRhIGlzc3VlcyBhIG5ldyBBbWF6b24gQ2xvdWRXYXRjaCBtZXRyaWMsIGNhbGxlZCBhIHNpZ25hdHVyZSB2YWxpZGF0aW9uIGVycm9yIGFuZCBhbHNvIHN0b3JlcyB0aGUgd2FybmluZyBpbiBDbG91ZFRyYWlsLlxuICAgKi9cbiAgV0FSTiA9ICdXYXJuJyxcbn1cblxuLyoqXG4gKiBBIENvZGUgU2lnbmluZyBDb25maWdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29kZVNpZ25pbmdDb25maWcgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiBDb2RlIFNpZ25pbmcgQ29uZmlnXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNvZGVTaWduaW5nQ29uZmlnQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCBvZiBDb2RlIFNpZ25pbmcgQ29uZmlnXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNvZGVTaWduaW5nQ29uZmlnSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBDb2RlIFNpZ25pbmcgQ29uZmlnIG9iamVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvZGVTaWduaW5nQ29uZmlnUHJvcHMge1xuICAvKipcbiAgICogTGlzdCBvZiBzaWduaW5nIHByb2ZpbGVzIHRoYXQgZGVmaW5lcyBhXG4gICAqIHRydXN0ZWQgdXNlciB3aG8gY2FuIHNpZ24gYSBjb2RlIHBhY2thZ2UuXG4gICAqL1xuICByZWFkb25seSBzaWduaW5nUHJvZmlsZXM6IElTaWduaW5nUHJvZmlsZVtdLFxuXG4gIC8qKlxuICAgKiBDb2RlIHNpZ25pbmcgY29uZmlndXJhdGlvbiBwb2xpY3kgZm9yIGRlcGxveW1lbnQgdmFsaWRhdGlvbiBmYWlsdXJlLlxuICAgKiBJZiB5b3Ugc2V0IHRoZSBwb2xpY3kgdG8gRW5mb3JjZSwgTGFtYmRhIGJsb2NrcyB0aGUgZGVwbG95bWVudCByZXF1ZXN0XG4gICAqIGlmIHNpZ25hdHVyZSB2YWxpZGF0aW9uIGNoZWNrcyBmYWlsLlxuICAgKiBJZiB5b3Ugc2V0IHRoZSBwb2xpY3kgdG8gV2FybiwgTGFtYmRhIGFsbG93cyB0aGUgZGVwbG95bWVudCBhbmRcbiAgICogY3JlYXRlcyBhIENsb3VkV2F0Y2ggbG9nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBVbnRydXN0ZWRBcnRpZmFjdE9uRGVwbG95bWVudC5XQVJOXG4gICAqL1xuICByZWFkb25seSB1bnRydXN0ZWRBcnRpZmFjdE9uRGVwbG95bWVudD86IFVudHJ1c3RlZEFydGlmYWN0T25EZXBsb3ltZW50LFxuXG4gIC8qKlxuICAgKiBDb2RlIHNpZ25pbmcgY29uZmlndXJhdGlvbiBkZXNjcmlwdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nLFxufVxuXG4vKipcbiAqIERlZmluZXMgYSBDb2RlIFNpZ25pbmcgQ29uZmlnLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkxhbWJkYTo6Q29kZVNpZ25pbmdDb25maWdcbiAqL1xuZXhwb3J0IGNsYXNzIENvZGVTaWduaW5nQ29uZmlnIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQ29kZVNpZ25pbmdDb25maWcge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFNpZ25pbmcgUHJvZmlsZSBjb25zdHJ1Y3QgdGhhdCByZXByZXNlbnRzIGFuIGV4dGVybmFsIFNpZ25pbmcgUHJvZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY3JlYXRpbmcgY29uc3RydWN0ICh1c3VhbGx5IGB0aGlzYCkuXG4gICAqIEBwYXJhbSBpZCBUaGUgY29uc3RydWN0J3MgbmFtZS5cbiAgICogQHBhcmFtIGNvZGVTaWduaW5nQ29uZmlnQXJuIFRoZSBBUk4gb2YgY29kZSBzaWduaW5nIGNvbmZpZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvZGVTaWduaW5nQ29uZmlnQXJuKCBzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBjb2RlU2lnbmluZ0NvbmZpZ0Fybjogc3RyaW5nKTogSUNvZGVTaWduaW5nQ29uZmlnIHtcbiAgICBjb25zdCBjb2RlU2lnbmluZ1Byb2ZpbGVJZCA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihjb2RlU2lnbmluZ0NvbmZpZ0FybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZTtcbiAgICBpZiAoIWNvZGVTaWduaW5nUHJvZmlsZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvZGUgc2lnbmluZyBjb25maWcgQVJOIG11c3QgYmUgaW4gdGhlIGZvcm1hdCAnYXJuOmF3czpsYW1iZGE6PHJlZ2lvbj46PGFjY291bnQ+OmNvZGUtc2lnbmluZy1jb25maWc6PGNvZGVTaWduaW5nQ29uZmlnQXJuPicsIGdvdDogJyR7Y29kZVNpZ25pbmdDb25maWdBcm59J2ApO1xuICAgIH1cbiAgICBjb25zdCBhc3NlcnRlZENvZGVTaWduaW5nUHJvZmlsZUlkID0gY29kZVNpZ25pbmdQcm9maWxlSWQ7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQ29kZVNpZ25pbmdDb25maWcge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGNvZGVTaWduaW5nQ29uZmlnQXJuID0gY29kZVNpZ25pbmdDb25maWdBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY29kZVNpZ25pbmdDb25maWdJZCA9IGFzc2VydGVkQ29kZVNpZ25pbmdQcm9maWxlSWQ7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydCgpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGNvZGVTaWduaW5nQ29uZmlnQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb2RlU2lnbmluZ0NvbmZpZ0lkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvZGVTaWduaW5nQ29uZmlnUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc2lnbmluZ1Byb2ZpbGVWZXJzaW9uQXJucyA9IHByb3BzLnNpZ25pbmdQcm9maWxlcy5tYXAoc2lnbmluZ1Byb2ZpbGUgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25pbmdQcm9maWxlLnNpZ25pbmdQcm9maWxlVmVyc2lvbkFybjtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlOiBDZm5Db2RlU2lnbmluZ0NvbmZpZyA9IG5ldyBDZm5Db2RlU2lnbmluZ0NvbmZpZyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhbGxvd2VkUHVibGlzaGVyczoge1xuICAgICAgICBzaWduaW5nUHJvZmlsZVZlcnNpb25Bcm5zLFxuICAgICAgfSxcbiAgICAgIGNvZGVTaWduaW5nUG9saWNpZXM6IHtcbiAgICAgICAgdW50cnVzdGVkQXJ0aWZhY3RPbkRlcGxveW1lbnQ6IHByb3BzLnVudHJ1c3RlZEFydGlmYWN0T25EZXBsb3ltZW50ID8/IFVudHJ1c3RlZEFydGlmYWN0T25EZXBsb3ltZW50LldBUk4sXG4gICAgICB9LFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgIH0pO1xuICAgIHRoaXMuY29kZVNpZ25pbmdDb25maWdBcm4gPSByZXNvdXJjZS5hdHRyQ29kZVNpZ25pbmdDb25maWdBcm47XG4gICAgdGhpcy5jb2RlU2lnbmluZ0NvbmZpZ0lkID0gcmVzb3VyY2UuYXR0ckNvZGVTaWduaW5nQ29uZmlnSWQ7XG4gIH1cbn1cbiJdfQ==