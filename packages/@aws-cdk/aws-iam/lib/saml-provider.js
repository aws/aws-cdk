"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamlProvider = exports.SamlMetadataDocument = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
/**
 * A SAML metadata document
 */
class SamlMetadataDocument {
    /**
     * Create a SAML metadata document from a XML string
     */
    static fromXml(xml) {
        return { xml };
    }
    /**
     * Create a SAML metadata document from a XML file
     */
    static fromFile(path) {
        return { xml: fs.readFileSync(path, 'utf-8') };
    }
}
exports.SamlMetadataDocument = SamlMetadataDocument;
_a = JSII_RTTI_SYMBOL_1;
SamlMetadataDocument[_a] = { fqn: "@aws-cdk/aws-iam.SamlMetadataDocument", version: "0.0.0" };
/**
 * A SAML provider
 */
class SamlProvider extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_SamlProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SamlProvider);
            }
            throw error;
        }
        if (props.name && !core_1.Token.isUnresolved(props.name) && !/^[\w+=,.@-]{1,128}$/.test(props.name)) {
            throw new Error('Invalid SAML provider name. The name must be a string of characters consisting of upper and lowercase alphanumeric characters with no spaces. You can also include any of the following characters: _+=,.@-. Length must be between 1 and 128 characters.');
        }
        const samlProvider = new iam_generated_1.CfnSAMLProvider(this, 'Resource', {
            name: props.name,
            samlMetadataDocument: props.metadataDocument.xml,
        });
        this.samlProviderArn = samlProvider.ref;
    }
    /**
     * Import an existing provider
     */
    static fromSamlProviderArn(scope, id, samlProviderArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.samlProviderArn = samlProviderArn;
            }
        }
        return new Import(scope, id);
    }
}
exports.SamlProvider = SamlProvider;
_b = JSII_RTTI_SYMBOL_1;
SamlProvider[_b] = { fqn: "@aws-cdk/aws-iam.SamlProvider", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNhbWwtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLHdDQUEyRDtBQUUzRCxtREFBa0Q7QUEwQ2xEOztHQUVHO0FBQ0gsTUFBc0Isb0JBQW9CO0lBQ3hDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUNoQjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQztLQUNoRDs7QUFiSCxvREFtQkM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsZUFBUTtJQWF4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FkUixZQUFZOzs7O1FBZ0JyQixJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUYsTUFBTSxJQUFJLEtBQUssQ0FBQywyUEFBMlAsQ0FBQyxDQUFDO1NBQzlRO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSwrQkFBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDekQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHO1NBQ2pELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQztLQUN6QztJQXpCRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxlQUF1QjtRQUNyRixNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0Isb0JBQWUsR0FBRyxlQUFlLENBQUM7WUFDcEQsQ0FBQztTQUFBO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBVEgsb0NBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuU0FNTFByb3ZpZGVyIH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBBIFNBTUwgcHJvdmlkZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2FtbFByb3ZpZGVyIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcHJvdmlkZXJcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2FtbFByb3ZpZGVyQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBTQU1MIHByb3ZpZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FtbFByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVyIHRvIGNyZWF0ZS5cbiAgICpcbiAgICogVGhpcyBwYXJhbWV0ZXIgYWxsb3dzIGEgc3RyaW5nIG9mIGNoYXJhY3RlcnMgY29uc2lzdGluZyBvZiB1cHBlciBhbmRcbiAgICogbG93ZXJjYXNlIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIHdpdGggbm8gc3BhY2VzLiBZb3UgY2FuIGFsc28gaW5jbHVkZVxuICAgKiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBfKz0sLkAtXG4gICAqXG4gICAqIExlbmd0aCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTI4IGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQW4gWE1MIGRvY3VtZW50IGdlbmVyYXRlZCBieSBhbiBpZGVudGl0eSBwcm92aWRlciAoSWRQKSB0aGF0IHN1cHBvcnRzXG4gICAqIFNBTUwgMi4wLiBUaGUgZG9jdW1lbnQgaW5jbHVkZXMgdGhlIGlzc3VlcidzIG5hbWUsIGV4cGlyYXRpb24gaW5mb3JtYXRpb24sXG4gICAqIGFuZCBrZXlzIHRoYXQgY2FuIGJlIHVzZWQgdG8gdmFsaWRhdGUgdGhlIFNBTUwgYXV0aGVudGljYXRpb24gcmVzcG9uc2VcbiAgICogKGFzc2VydGlvbnMpIHRoYXQgYXJlIHJlY2VpdmVkIGZyb20gdGhlIElkUC4gWW91IG11c3QgZ2VuZXJhdGUgdGhlIG1ldGFkYXRhXG4gICAqIGRvY3VtZW50IHVzaW5nIHRoZSBpZGVudGl0eSBtYW5hZ2VtZW50IHNvZnR3YXJlIHRoYXQgaXMgdXNlZCBhcyB5b3VyXG4gICAqIG9yZ2FuaXphdGlvbidzIElkUC5cbiAgICovXG4gIHJlYWRvbmx5IG1ldGFkYXRhRG9jdW1lbnQ6IFNhbWxNZXRhZGF0YURvY3VtZW50O1xufVxuXG4vKipcbiAqIEEgU0FNTCBtZXRhZGF0YSBkb2N1bWVudFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2FtbE1ldGFkYXRhRG9jdW1lbnQge1xuICAvKipcbiAgICogQ3JlYXRlIGEgU0FNTCBtZXRhZGF0YSBkb2N1bWVudCBmcm9tIGEgWE1MIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tWG1sKHhtbDogc3RyaW5nKTogU2FtbE1ldGFkYXRhRG9jdW1lbnQge1xuICAgIHJldHVybiB7IHhtbCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNBTUwgbWV0YWRhdGEgZG9jdW1lbnQgZnJvbSBhIFhNTCBmaWxlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GaWxlKHBhdGg6IHN0cmluZyk6IFNhbWxNZXRhZGF0YURvY3VtZW50IHtcbiAgICByZXR1cm4geyB4bWw6IGZzLnJlYWRGaWxlU3luYyhwYXRoLCAndXRmLTgnKSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBYTUwgY29udGVudCBvZiB0aGUgbWV0YWRhdGEgZG9jdW1lbnRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB4bWw6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIFNBTUwgcHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFNhbWxQcm92aWRlciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVNhbWxQcm92aWRlciB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgcHJvdmlkZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNhbWxQcm92aWRlckFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzYW1sUHJvdmlkZXJBcm46IHN0cmluZyk6IElTYW1sUHJvdmlkZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVNhbWxQcm92aWRlciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc2FtbFByb3ZpZGVyQXJuID0gc2FtbFByb3ZpZGVyQXJuO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHNhbWxQcm92aWRlckFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTYW1sUHJvdmlkZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMubmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLm5hbWUpICYmICEvXltcXHcrPSwuQC1dezEsMTI4fSQvLnRlc3QocHJvcHMubmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBTQU1MIHByb3ZpZGVyIG5hbWUuIFRoZSBuYW1lIG11c3QgYmUgYSBzdHJpbmcgb2YgY2hhcmFjdGVycyBjb25zaXN0aW5nIG9mIHVwcGVyIGFuZCBsb3dlcmNhc2UgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgd2l0aCBubyBzcGFjZXMuIFlvdSBjYW4gYWxzbyBpbmNsdWRlIGFueSBvZiB0aGUgZm9sbG93aW5nIGNoYXJhY3RlcnM6IF8rPSwuQC0uIExlbmd0aCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMTI4IGNoYXJhY3RlcnMuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2FtbFByb3ZpZGVyID0gbmV3IENmblNBTUxQcm92aWRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgc2FtbE1ldGFkYXRhRG9jdW1lbnQ6IHByb3BzLm1ldGFkYXRhRG9jdW1lbnQueG1sLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zYW1sUHJvdmlkZXJBcm4gPSBzYW1sUHJvdmlkZXIucmVmO1xuICB9XG59XG4iXX0=