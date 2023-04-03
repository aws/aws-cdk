"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateAuthority = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
/**
 * Defines a Certificate for ACMPCA
 *
 * @resource AWS::ACMPCA::CertificateAuthority
 */
class CertificateAuthority {
    constructor() {
    }
    /**
     * Import an existing Certificate given an ARN
     */
    static fromCertificateAuthorityArn(scope, id, certificateAuthorityArn) {
        return new class extends cdk.Resource {
            constructor() {
                super(...arguments);
                this.certificateAuthorityArn = certificateAuthorityArn;
            }
        }(scope, id);
    }
}
exports.CertificateAuthority = CertificateAuthority;
_a = JSII_RTTI_SYMBOL_1;
CertificateAuthority[_a] = { fqn: "@aws-cdk/aws-acmpca.CertificateAuthority", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUtYXV0aG9yaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2VydGlmaWNhdGUtYXV0aG9yaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQXFDO0FBZXJDOzs7O0dBSUc7QUFDSCxNQUFhLG9CQUFvQjtJQVUvQjtLQUNDO0lBVkQ7O09BRUc7SUFDSSxNQUFNLENBQUMsMkJBQTJCLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsdUJBQStCO1FBQ3JHLE9BQU8sSUFBSSxLQUFNLFNBQVEsR0FBRyxDQUFDLFFBQVE7WUFBMUI7O2dCQUNBLDRCQUF1QixHQUFHLHVCQUF1QixDQUFDO1lBQzdELENBQUM7U0FBQSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNkOztBQVJILG9EQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIHdoaWNoIGFsbCBDZXJ0aWZpY2F0ZUF1dGhvcml0eSBiYXNlZCBjbGFzcyBtdXN0IGltcGxlbWVudFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDZXJ0aWZpY2F0ZUF1dGhvcml0eSBleHRlbmRzIGNkay5JUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIG9mIHRoZSBDZXJ0aWZpY2F0ZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjZXJ0aWZpY2F0ZUF1dGhvcml0eUFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBDZXJ0aWZpY2F0ZSBmb3IgQUNNUENBXG4gKlxuICogQHJlc291cmNlIEFXUzo6QUNNUENBOjpDZXJ0aWZpY2F0ZUF1dGhvcml0eVxuICovXG5leHBvcnQgY2xhc3MgQ2VydGlmaWNhdGVBdXRob3JpdHkge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIENlcnRpZmljYXRlIGdpdmVuIGFuIEFSTlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2VydGlmaWNhdGVBdXRob3JpdHlBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY2VydGlmaWNhdGVBdXRob3JpdHlBcm46IHN0cmluZyk6IElDZXJ0aWZpY2F0ZUF1dGhvcml0eSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElDZXJ0aWZpY2F0ZUF1dGhvcml0eSB7XG4gICAgICByZWFkb25seSBjZXJ0aWZpY2F0ZUF1dGhvcml0eUFybiA9IGNlcnRpZmljYXRlQXV0aG9yaXR5QXJuO1xuICAgIH0oc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gIH1cbn1cbiJdfQ==