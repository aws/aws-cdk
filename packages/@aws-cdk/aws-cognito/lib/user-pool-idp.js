"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProvider = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * User pool third-party identity providers
 */
class UserPoolIdentityProvider {
    constructor() { }
    /**
     * Import an existing UserPoolIdentityProvider
     */
    static fromProviderName(scope, id, providerName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.providerName = providerName;
            }
        }
        return new Import(scope, id);
    }
}
exports.UserPoolIdentityProvider = UserPoolIdentityProvider;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProvider[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProvider", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWlkcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXItcG9vbC1pZHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3Q0FBb0Q7QUFjcEQ7O0dBRUc7QUFDSCxNQUFhLHdCQUF3QjtJQWFuQyxpQkFBd0I7SUFYeEI7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsWUFBb0I7UUFDL0UsTUFBTSxNQUFPLFNBQVEsZUFBUTtZQUE3Qjs7Z0JBQ2tCLGlCQUFZLEdBQVcsWUFBWSxDQUFDO1lBQ3RELENBQUM7U0FBQTtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlCOztBQVhILDREQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIHByaW1hcnkgaWRlbnRpZmllciBvZiB0aGlzIGlkZW50aXR5IHByb3ZpZGVyXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFVzZXIgcG9vbCB0aGlyZC1wYXJ0eSBpZGVudGl0eSBwcm92aWRlcnNcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVByb3ZpZGVyTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm92aWRlck5hbWU6IHN0cmluZyk6IElVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmcgPSBwcm92aWRlck5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxufSJdfQ==