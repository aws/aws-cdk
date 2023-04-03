"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * A Public Key Configuration
 *
 * @resource AWS::CloudFront::PublicKey
 */
class PublicKey extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_PublicKeyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PublicKey);
            }
            throw error;
        }
        if (!core_1.Token.isUnresolved(props.encodedKey) && !/^-----BEGIN PUBLIC KEY-----/.test(props.encodedKey)) {
            throw new Error(`Public key must be in PEM format (with the BEGIN/END PUBLIC KEY lines); got ${props.encodedKey}`);
        }
        const resource = new cloudfront_generated_1.CfnPublicKey(this, 'Resource', {
            publicKeyConfig: {
                name: props.publicKeyName ?? this.generateName(),
                callerReference: this.node.addr,
                encodedKey: props.encodedKey,
                comment: props.comment,
            },
        });
        this.publicKeyId = resource.ref;
    }
    /** Imports a Public Key from its id. */
    static fromPublicKeyId(scope, id, publicKeyId) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.publicKeyId = publicKeyId;
            }
        }(scope, id);
    }
    generateName() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 80) {
            return name.substring(0, 40) + name.substring(name.length - 40);
        }
        return name;
    }
}
exports.PublicKey = PublicKey;
_a = JSII_RTTI_SYMBOL_1;
PublicKey[_a] = { fqn: "@aws-cdk/aws-cloudfront.PublicKey", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWtleS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInB1YmxpYy1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQWtFO0FBRWxFLGlFQUFzRDtBQXNDdEQ7Ozs7R0FJRztBQUNILE1BQWEsU0FBVSxTQUFRLGVBQVE7SUFXckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBWlIsU0FBUzs7OztRQWNsQixJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2xHLE1BQU0sSUFBSSxLQUFLLENBQUMsK0VBQStFLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQ3BIO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbEQsZUFBZSxFQUFFO2dCQUNmLElBQUksRUFBRSxLQUFLLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2hELGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQy9CLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtnQkFDNUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0tBQ2pDO0lBMUJELHdDQUF3QztJQUNqQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFdBQW1CO1FBQzdFLE9BQU8sSUFBSSxLQUFNLFNBQVEsZUFBUTtZQUF0Qjs7Z0JBQ08sZ0JBQVcsR0FBRyxXQUFXLENBQUM7WUFDNUMsQ0FBQztTQUFBLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ2Q7SUF1Qk8sWUFBWTtRQUNsQixNQUFNLElBQUksR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDakU7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNiOztBQXBDSCw4QkFxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIE5hbWVzLCBSZXNvdXJjZSwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUHVibGljS2V5IH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIFB1YmxpYyBLZXlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUHVibGljS2V5IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUga2V5IGdyb3VwLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNLZXlJZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIGEgUHVibGljIEtleVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFB1YmxpY0tleVByb3BzIHtcbiAgLyoqXG4gICAqIEEgbmFtZSB0byBpZGVudGlmeSB0aGUgcHVibGljIGtleS5cbiAgICogQGRlZmF1bHQgLSBnZW5lcmF0ZWQgZnJvbSB0aGUgYGlkYFxuICAgKi9cbiAgcmVhZG9ubHkgcHVibGljS2V5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb21tZW50IHRvIGRlc2NyaWJlIHRoZSBwdWJsaWMga2V5LlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwdWJsaWMga2V5IHRoYXQgeW91IGNhbiB1c2Ugd2l0aCBzaWduZWQgVVJMcyBhbmQgc2lnbmVkIGNvb2tpZXMsIG9yIHdpdGggZmllbGQtbGV2ZWwgZW5jcnlwdGlvbi5cbiAgICogVGhlIGBlbmNvZGVkS2V5YCBwYXJhbWV0ZXIgbXVzdCBpbmNsdWRlIGAtLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLWAgYW5kIGAtLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1gIGxpbmVzLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9Qcml2YXRlQ29udGVudC5odG1sXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkRnJvbnQvbGF0ZXN0L0RldmVsb3Blckd1aWRlL2ZpZWxkLWxldmVsLWVuY3J5cHRpb24uaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgZW5jb2RlZEtleTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgUHVibGljIEtleSBDb25maWd1cmF0aW9uXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2xvdWRGcm9udDo6UHVibGljS2V5XG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNLZXkgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQdWJsaWNLZXkge1xuXG4gIC8qKiBJbXBvcnRzIGEgUHVibGljIEtleSBmcm9tIGl0cyBpZC4gKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUHVibGljS2V5SWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHVibGljS2V5SWQ6IHN0cmluZyk6IElQdWJsaWNLZXkge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQdWJsaWNLZXkge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHB1YmxpY0tleUlkID0gcHVibGljS2V5SWQ7XG4gICAgfShzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHB1YmxpY0tleUlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFB1YmxpY0tleVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmVuY29kZWRLZXkpICYmICEvXi0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tLy50ZXN0KHByb3BzLmVuY29kZWRLZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFB1YmxpYyBrZXkgbXVzdCBiZSBpbiBQRU0gZm9ybWF0ICh3aXRoIHRoZSBCRUdJTi9FTkQgUFVCTElDIEtFWSBsaW5lcyk7IGdvdCAke3Byb3BzLmVuY29kZWRLZXl9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUHVibGljS2V5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHB1YmxpY0tleUNvbmZpZzoge1xuICAgICAgICBuYW1lOiBwcm9wcy5wdWJsaWNLZXlOYW1lID8/IHRoaXMuZ2VuZXJhdGVOYW1lKCksXG4gICAgICAgIGNhbGxlclJlZmVyZW5jZTogdGhpcy5ub2RlLmFkZHIsXG4gICAgICAgIGVuY29kZWRLZXk6IHByb3BzLmVuY29kZWRLZXksXG4gICAgICAgIGNvbW1lbnQ6IHByb3BzLmNvbW1lbnQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5wdWJsaWNLZXlJZCA9IHJlc291cmNlLnJlZjtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVOYW1lKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbmFtZSA9IE5hbWVzLnVuaXF1ZUlkKHRoaXMpO1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDgwKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwgNDApICsgbmFtZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggLSA0MCk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lO1xuICB9XG59Il19