"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningProfile = exports.Platform = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const signer_generated_1 = require("./signer.generated");
/**
 * Platforms that are allowed with signing config.
 * @see https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html
 */
class Platform {
    constructor(platformId) {
        this.platformId = platformId;
    }
}
exports.Platform = Platform;
_a = JSII_RTTI_SYMBOL_1;
Platform[_a] = { fqn: "@aws-cdk/aws-signer.Platform", version: "0.0.0" };
/**
 * Specification of signature format and signing algorithms for AWS IoT Device.
 */
Platform.AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA = new Platform('AWSIoTDeviceManagement-SHA256-ECDSA');
/**
 * Specification of signature format and signing algorithms for AWS Lambda.
 */
Platform.AWS_LAMBDA_SHA384_ECDSA = new Platform('AWSLambda-SHA384-ECDSA');
/**
 * Specification of signature format and signing algorithms with
 * SHA1 hash and RSA encryption for Amazon FreeRTOS.
 */
Platform.AMAZON_FREE_RTOS_TI_CC3220SF = new Platform('AmazonFreeRTOS-TI-CC3220SF');
/**
 * Specification of signature format and signing algorithms with
 * SHA256 hash and ECDSA encryption for Amazon FreeRTOS.
 */
Platform.AMAZON_FREE_RTOS_DEFAULT = new Platform('AmazonFreeRTOS-Default');
/**
 * Defines a Signing Profile.
 *
 * @resource AWS::Signer::SigningProfile
 */
class SigningProfile extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.signingProfileName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_signer_SigningProfileProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SigningProfile);
            }
            throw error;
        }
        const resource = new signer_generated_1.CfnSigningProfile(this, 'Resource', {
            platformId: props.platform.platformId,
            signatureValidityPeriod: props.signatureValidity ? {
                type: 'DAYS',
                value: props.signatureValidity?.toDays(),
            } : {
                type: 'MONTHS',
                value: 135,
            },
        });
        this.signingProfileArn = resource.attrArn;
        this.signingProfileName = resource.attrProfileName;
        this.signingProfileVersion = resource.attrProfileVersion;
        this.signingProfileVersionArn = resource.attrProfileVersionArn;
    }
    /**
     * Creates a Signing Profile construct that represents an external Signing Profile.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs A `SigningProfileAttributes` object.
     */
    static fromSigningProfileAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_signer_SigningProfileAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSigningProfileAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor(signingProfileArn, signingProfileProfileVersionArn) {
                super(scope, id);
                this.signingProfileName = attrs.signingProfileName;
                this.signingProfileVersion = attrs.signingProfileVersion;
                this.signingProfileArn = signingProfileArn;
                this.signingProfileVersionArn = signingProfileProfileVersionArn;
            }
        }
        const signingProfileArn = core_1.Stack.of(scope).formatArn({
            service: 'signer',
            resource: '',
            resourceName: `/signing-profiles/${attrs.signingProfileName}`,
        });
        const SigningProfileVersionArn = core_1.Stack.of(scope).formatArn({
            service: 'signer',
            resource: '',
            resourceName: `/signing-profiles/${attrs.signingProfileName}/${attrs.signingProfileVersion}`,
        });
        return new Import(signingProfileArn, SigningProfileVersionArn);
    }
}
exports.SigningProfile = SigningProfile;
_b = JSII_RTTI_SYMBOL_1;
SigningProfile[_b] = { fqn: "@aws-cdk/aws-signer.SigningProfile", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmluZy1wcm9maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2lnbmluZy1wcm9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFxRTtBQUVyRSx5REFBdUQ7QUFFdkQ7OztHQUdHO0FBQ0gsTUFBYSxRQUFRO0lBNkJuQixZQUFvQixVQUFrQjtRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztLQUM5Qjs7QUEvQkgsNEJBZ0NDOzs7QUEvQkM7O0dBRUc7QUFDb0IsK0NBQXNDLEdBQUcsSUFBSSxRQUFRLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUVwSDs7R0FFRztBQUNvQixnQ0FBdUIsR0FBRyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBRXhGOzs7R0FHRztBQUNvQixxQ0FBNEIsR0FBRyxJQUFJLFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRWpHOzs7R0FHRztBQUNvQixpQ0FBd0IsR0FBRyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBbUYzRjs7OztHQUlHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQXVDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsa0JBQWtCO1NBQ3ZDLENBQUMsQ0FBQzs7Ozs7OytDQTFDTSxjQUFjOzs7O1FBNEN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLG9DQUFpQixDQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDeEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVTtZQUNyQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRTthQUN6QyxDQUFDLENBQUMsQ0FBQztnQkFDRixJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsR0FBRzthQUNYO1NBQ0YsQ0FBRSxDQUFDO1FBRUosSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDMUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7UUFDbkQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztRQUN6RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixDQUFDO0tBQ2hFO0lBMUREOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBRSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjs7Ozs7Ozs7OztRQUN2RyxNQUFNLE1BQU8sU0FBUSxlQUFRO1lBTTNCLFlBQVksaUJBQXlCLEVBQUUsK0JBQXVDO2dCQUM1RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUxILHVCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztnQkFDOUMsMEJBQXFCLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDO2dCQUtsRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7Z0JBQzNDLElBQUksQ0FBQyx3QkFBd0IsR0FBRywrQkFBK0IsQ0FBQztZQUNsRSxDQUFDO1NBQ0Y7UUFDRCxNQUFNLGlCQUFpQixHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2xELE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRSxFQUFFO1lBQ1osWUFBWSxFQUFFLHFCQUFxQixLQUFLLENBQUMsa0JBQWtCLEVBQUU7U0FDOUQsQ0FBQyxDQUFDO1FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUN6RCxPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsRUFBRTtZQUNaLFlBQVksRUFBRSxxQkFBcUIsS0FBSyxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTtTQUM3RixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFLHdCQUF3QixDQUFDLENBQUM7S0FDaEU7O0FBaENILHdDQTREQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5TaWduaW5nUHJvZmlsZSB9IGZyb20gJy4vc2lnbmVyLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUGxhdGZvcm1zIHRoYXQgYXJlIGFsbG93ZWQgd2l0aCBzaWduaW5nIGNvbmZpZy5cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3NpZ25lci9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvZ3MtcGxhdGZvcm0uaHRtbFxuICovXG5leHBvcnQgY2xhc3MgUGxhdGZvcm0ge1xuICAvKipcbiAgICogU3BlY2lmaWNhdGlvbiBvZiBzaWduYXR1cmUgZm9ybWF0IGFuZCBzaWduaW5nIGFsZ29yaXRobXMgZm9yIEFXUyBJb1QgRGV2aWNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBV1NfSU9UX0RFVklDRV9NQU5BR0VNRU5UX1NIQTI1Nl9FQ0RTQSA9IG5ldyBQbGF0Zm9ybSgnQVdTSW9URGV2aWNlTWFuYWdlbWVudC1TSEEyNTYtRUNEU0EnKTtcblxuICAvKipcbiAgICogU3BlY2lmaWNhdGlvbiBvZiBzaWduYXR1cmUgZm9ybWF0IGFuZCBzaWduaW5nIGFsZ29yaXRobXMgZm9yIEFXUyBMYW1iZGEuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFXU19MQU1CREFfU0hBMzg0X0VDRFNBID0gbmV3IFBsYXRmb3JtKCdBV1NMYW1iZGEtU0hBMzg0LUVDRFNBJyk7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmljYXRpb24gb2Ygc2lnbmF0dXJlIGZvcm1hdCBhbmQgc2lnbmluZyBhbGdvcml0aG1zIHdpdGhcbiAgICogU0hBMSBoYXNoIGFuZCBSU0EgZW5jcnlwdGlvbiBmb3IgQW1hem9uIEZyZWVSVE9TLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTUFaT05fRlJFRV9SVE9TX1RJX0NDMzIyMFNGID0gbmV3IFBsYXRmb3JtKCdBbWF6b25GcmVlUlRPUy1USS1DQzMyMjBTRicpO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpY2F0aW9uIG9mIHNpZ25hdHVyZSBmb3JtYXQgYW5kIHNpZ25pbmcgYWxnb3JpdGhtcyB3aXRoXG4gICAqIFNIQTI1NiBoYXNoIGFuZCBFQ0RTQSBlbmNyeXB0aW9uIGZvciBBbWF6b24gRnJlZVJUT1MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFNQVpPTl9GUkVFX1JUT1NfREVGQVVMVCA9IG5ldyBQbGF0Zm9ybSgnQW1hem9uRnJlZVJUT1MtRGVmYXVsdCcpO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2Ygc2lnbmluZyBwbGF0Zm9ybS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc2lnbmVyLXNpZ25pbmdwcm9maWxlLmh0bWwjY2ZuLXNpZ25lci1zaWduaW5ncHJvZmlsZS1wbGF0Zm9ybWlkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGxhdGZvcm1JZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocGxhdGZvcm1JZDogc3RyaW5nKSB7XG4gICAgdGhpcy5wbGF0Zm9ybUlkID0gcGxhdGZvcm1JZDtcbiAgfVxufVxuXG4vKipcbiAqIEEgU2lnbmVyIFByb2ZpbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2lnbmluZ1Byb2ZpbGUgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgc2lnbmluZyBwcm9maWxlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzaWduaW5nUHJvZmlsZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBzaWduaW5nIHByb2ZpbGUuXG4gICAqIEBhdHRyaWJ1dGUgUHJvZmlsZU5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmVyc2lvbiBvZiBzaWduaW5nIHByb2ZpbGUuXG4gICAqIEBhdHRyaWJ1dGUgUHJvZmlsZVZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlVmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHNpZ25pbmcgcHJvZmlsZSB2ZXJzaW9uLlxuICAgKiBAYXR0cmlidXRlIFByb2ZpbGVWZXJzaW9uQXJuXG4gICAqL1xuICByZWFkb25seSBzaWduaW5nUHJvZmlsZVZlcnNpb25Bcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBTaWduaW5nIFByb2ZpbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2lnbmluZ1Byb2ZpbGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgU2lnbmluZyBQbGF0Zm9ybSBhdmFpbGFibGUgZm9yIHNpZ25pbmcgcHJvZmlsZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc2lnbmVyL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9ncy1wbGF0Zm9ybS5odG1sXG4gICAqL1xuICByZWFkb25seSBwbGF0Zm9ybTogUGxhdGZvcm07XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGl0eSBwZXJpb2QgZm9yIHNpZ25hdHVyZXMgZ2VuZXJhdGVkIHVzaW5nXG4gICAqIHRoaXMgc2lnbmluZyBwcm9maWxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEzNSBtb250aHNcbiAgICovXG4gIHJlYWRvbmx5IHNpZ25hdHVyZVZhbGlkaXR5PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFBoeXNpY2FsIG5hbWUgb2YgdGhpcyBTaWduaW5nIFByb2ZpbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXNzaWduZWQgYnkgQ2xvdWRGb3JtYXRpb24gKHJlY29tbWVuZGVkKS5cbiAgICovXG4gIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlTmFtZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byBhIFNpZ25pbmcgUHJvZmlsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25pbmdQcm9maWxlQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBzaWduaW5nIHByb2ZpbGUuXG4gICAqL1xuICByZWFkb25seSBzaWduaW5nUHJvZmlsZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZlcnNpb24gb2Ygc2lnbmluZyBwcm9maWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgc2lnbmluZ1Byb2ZpbGVWZXJzaW9uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhIFNpZ25pbmcgUHJvZmlsZS5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpTaWduZXI6OlNpZ25pbmdQcm9maWxlXG4gKi9cbmV4cG9ydCBjbGFzcyBTaWduaW5nUHJvZmlsZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVNpZ25pbmdQcm9maWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBTaWduaW5nIFByb2ZpbGUgY29uc3RydWN0IHRoYXQgcmVwcmVzZW50cyBhbiBleHRlcm5hbCBTaWduaW5nIFByb2ZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdCAodXN1YWxseSBgdGhpc2ApLlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWUuXG4gICAqIEBwYXJhbSBhdHRycyBBIGBTaWduaW5nUHJvZmlsZUF0dHJpYnV0ZXNgIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNpZ25pbmdQcm9maWxlQXR0cmlidXRlcyggc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IFNpZ25pbmdQcm9maWxlQXR0cmlidXRlcyk6IElTaWduaW5nUHJvZmlsZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU2lnbmluZ1Byb2ZpbGUge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlQXJuOiBzdHJpbmc7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2lnbmluZ1Byb2ZpbGVOYW1lID0gYXR0cnMuc2lnbmluZ1Byb2ZpbGVOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlVmVyc2lvbiA9IGF0dHJzLnNpZ25pbmdQcm9maWxlVmVyc2lvbjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBzaWduaW5nUHJvZmlsZVZlcnNpb25Bcm46IHN0cmluZztcblxuICAgICAgY29uc3RydWN0b3Ioc2lnbmluZ1Byb2ZpbGVBcm46IHN0cmluZywgc2lnbmluZ1Byb2ZpbGVQcm9maWxlVmVyc2lvbkFybjogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIHRoaXMuc2lnbmluZ1Byb2ZpbGVBcm4gPSBzaWduaW5nUHJvZmlsZUFybjtcbiAgICAgICAgdGhpcy5zaWduaW5nUHJvZmlsZVZlcnNpb25Bcm4gPSBzaWduaW5nUHJvZmlsZVByb2ZpbGVWZXJzaW9uQXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzaWduaW5nUHJvZmlsZUFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NpZ25lcicsXG4gICAgICByZXNvdXJjZTogJycsXG4gICAgICByZXNvdXJjZU5hbWU6IGAvc2lnbmluZy1wcm9maWxlcy8ke2F0dHJzLnNpZ25pbmdQcm9maWxlTmFtZX1gLFxuICAgIH0pO1xuICAgIGNvbnN0IFNpZ25pbmdQcm9maWxlVmVyc2lvbkFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3NpZ25lcicsXG4gICAgICByZXNvdXJjZTogJycsXG4gICAgICByZXNvdXJjZU5hbWU6IGAvc2lnbmluZy1wcm9maWxlcy8ke2F0dHJzLnNpZ25pbmdQcm9maWxlTmFtZX0vJHthdHRycy5zaWduaW5nUHJvZmlsZVZlcnNpb259YCxcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IEltcG9ydChzaWduaW5nUHJvZmlsZUFybiwgU2lnbmluZ1Byb2ZpbGVWZXJzaW9uQXJuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBzaWduaW5nUHJvZmlsZUFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc2lnbmluZ1Byb2ZpbGVOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBzaWduaW5nUHJvZmlsZVZlcnNpb246IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHNpZ25pbmdQcm9maWxlVmVyc2lvbkFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTaWduaW5nUHJvZmlsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnNpZ25pbmdQcm9maWxlTmFtZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblNpZ25pbmdQcm9maWxlKCB0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBwbGF0Zm9ybUlkOiBwcm9wcy5wbGF0Zm9ybS5wbGF0Zm9ybUlkLFxuICAgICAgc2lnbmF0dXJlVmFsaWRpdHlQZXJpb2Q6IHByb3BzLnNpZ25hdHVyZVZhbGlkaXR5ID8ge1xuICAgICAgICB0eXBlOiAnREFZUycsXG4gICAgICAgIHZhbHVlOiBwcm9wcy5zaWduYXR1cmVWYWxpZGl0eT8udG9EYXlzKCksXG4gICAgICB9IDoge1xuICAgICAgICB0eXBlOiAnTU9OVEhTJyxcbiAgICAgICAgdmFsdWU6IDEzNSxcbiAgICAgIH0sXG4gICAgfSApO1xuXG4gICAgdGhpcy5zaWduaW5nUHJvZmlsZUFybiA9IHJlc291cmNlLmF0dHJBcm47XG4gICAgdGhpcy5zaWduaW5nUHJvZmlsZU5hbWUgPSByZXNvdXJjZS5hdHRyUHJvZmlsZU5hbWU7XG4gICAgdGhpcy5zaWduaW5nUHJvZmlsZVZlcnNpb24gPSByZXNvdXJjZS5hdHRyUHJvZmlsZVZlcnNpb247XG4gICAgdGhpcy5zaWduaW5nUHJvZmlsZVZlcnNpb25Bcm4gPSByZXNvdXJjZS5hdHRyUHJvZmlsZVZlcnNpb25Bcm47XG4gIH1cbn1cbiJdfQ==