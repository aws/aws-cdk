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
_a = JSII_RTTI_SYMBOL_1;
SamlMetadataDocument[_a] = { fqn: "@aws-cdk/aws-iam.SamlMetadataDocument", version: "0.0.0" };
exports.SamlMetadataDocument = SamlMetadataDocument;
/**
 * A SAML provider
 */
class SamlProvider extends core_1.Resource {
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
}
_b = JSII_RTTI_SYMBOL_1;
SamlProvider[_b] = { fqn: "@aws-cdk/aws-iam.SamlProvider", version: "0.0.0" };
exports.SamlProvider = SamlProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtbC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNhbWwtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLHdDQUEyRDtBQUUzRCxtREFBa0Q7QUEwQ2xEOztHQUVHO0FBQ0gsTUFBc0Isb0JBQW9CO0lBQ3hDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUNoQjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQztLQUNoRDs7OztBQWJtQixvREFBb0I7QUFxQjFDOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsZUFBUTtJQUN4Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxlQUF1QjtRQUNyRixNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0Isb0JBQWUsR0FBRyxlQUFlLENBQUM7WUFDcEQsQ0FBQztTQUFBO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFJRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FkUixZQUFZOzs7O1FBZ0JyQixJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUYsTUFBTSxJQUFJLEtBQUssQ0FBQywyUEFBMlAsQ0FBQyxDQUFDO1NBQzlRO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSwrQkFBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDekQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHO1NBQ2pELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQztLQUN6Qzs7OztBQTFCVSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblNBTUxQcm92aWRlciB9IGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogQSBTQU1MIHByb3ZpZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNhbWxQcm92aWRlciBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIHByb3ZpZGVyXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHNhbWxQcm92aWRlckFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgU0FNTCBwcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNhbWxQcm92aWRlclByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwcm92aWRlciB0byBjcmVhdGUuXG4gICAqXG4gICAqIFRoaXMgcGFyYW1ldGVyIGFsbG93cyBhIHN0cmluZyBvZiBjaGFyYWN0ZXJzIGNvbnNpc3Rpbmcgb2YgdXBwZXIgYW5kXG4gICAqIGxvd2VyY2FzZSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyB3aXRoIG5vIHNwYWNlcy4gWW91IGNhbiBhbHNvIGluY2x1ZGVcbiAgICogYW55IG9mIHRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyczogXys9LC5ALVxuICAgKlxuICAgKiBMZW5ndGggbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEyOCBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIFhNTCBkb2N1bWVudCBnZW5lcmF0ZWQgYnkgYW4gaWRlbnRpdHkgcHJvdmlkZXIgKElkUCkgdGhhdCBzdXBwb3J0c1xuICAgKiBTQU1MIDIuMC4gVGhlIGRvY3VtZW50IGluY2x1ZGVzIHRoZSBpc3N1ZXIncyBuYW1lLCBleHBpcmF0aW9uIGluZm9ybWF0aW9uLFxuICAgKiBhbmQga2V5cyB0aGF0IGNhbiBiZSB1c2VkIHRvIHZhbGlkYXRlIHRoZSBTQU1MIGF1dGhlbnRpY2F0aW9uIHJlc3BvbnNlXG4gICAqIChhc3NlcnRpb25zKSB0aGF0IGFyZSByZWNlaXZlZCBmcm9tIHRoZSBJZFAuIFlvdSBtdXN0IGdlbmVyYXRlIHRoZSBtZXRhZGF0YVxuICAgKiBkb2N1bWVudCB1c2luZyB0aGUgaWRlbnRpdHkgbWFuYWdlbWVudCBzb2Z0d2FyZSB0aGF0IGlzIHVzZWQgYXMgeW91clxuICAgKiBvcmdhbml6YXRpb24ncyBJZFAuXG4gICAqL1xuICByZWFkb25seSBtZXRhZGF0YURvY3VtZW50OiBTYW1sTWV0YWRhdGFEb2N1bWVudDtcbn1cblxuLyoqXG4gKiBBIFNBTUwgbWV0YWRhdGEgZG9jdW1lbnRcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNhbWxNZXRhZGF0YURvY3VtZW50IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNBTUwgbWV0YWRhdGEgZG9jdW1lbnQgZnJvbSBhIFhNTCBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVhtbCh4bWw6IHN0cmluZyk6IFNhbWxNZXRhZGF0YURvY3VtZW50IHtcbiAgICByZXR1cm4geyB4bWwgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTQU1MIG1ldGFkYXRhIGRvY3VtZW50IGZyb20gYSBYTUwgZmlsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRmlsZShwYXRoOiBzdHJpbmcpOiBTYW1sTWV0YWRhdGFEb2N1bWVudCB7XG4gICAgcmV0dXJuIHsgeG1sOiBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0Zi04JykgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgWE1MIGNvbnRlbnQgb2YgdGhlIG1ldGFkYXRhIGRvY3VtZW50XG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgeG1sOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBTQU1MIHByb3ZpZGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBTYW1sUHJvdmlkZXIgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTYW1sUHJvdmlkZXIge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHByb3ZpZGVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TYW1sUHJvdmlkZXJBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc2FtbFByb3ZpZGVyQXJuOiBzdHJpbmcpOiBJU2FtbFByb3ZpZGVyIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElTYW1sUHJvdmlkZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNhbWxQcm92aWRlckFybiA9IHNhbWxQcm92aWRlckFybjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBzYW1sUHJvdmlkZXJBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2FtbFByb3ZpZGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKHByb3BzLm5hbWUgJiYgIVRva2VuLmlzVW5yZXNvbHZlZChwcm9wcy5uYW1lKSAmJiAhL15bXFx3Kz0sLkAtXXsxLDEyOH0kLy50ZXN0KHByb3BzLm5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgU0FNTCBwcm92aWRlciBuYW1lLiBUaGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nIG9mIGNoYXJhY3RlcnMgY29uc2lzdGluZyBvZiB1cHBlciBhbmQgbG93ZXJjYXNlIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIHdpdGggbm8gc3BhY2VzLiBZb3UgY2FuIGFsc28gaW5jbHVkZSBhbnkgb2YgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBfKz0sLkAtLiBMZW5ndGggbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEyOCBjaGFyYWN0ZXJzLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHNhbWxQcm92aWRlciA9IG5ldyBDZm5TQU1MUHJvdmlkZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICAgIHNhbWxNZXRhZGF0YURvY3VtZW50OiBwcm9wcy5tZXRhZGF0YURvY3VtZW50LnhtbCxcbiAgICB9KTtcblxuICAgIHRoaXMuc2FtbFByb3ZpZGVyQXJuID0gc2FtbFByb3ZpZGVyLnJlZjtcbiAgfVxufVxuIl19