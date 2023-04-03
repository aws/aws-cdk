"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateCertificate = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const certificate_base_1 = require("./certificate-base");
const certificatemanager_generated_1 = require("./certificatemanager.generated");
/**
 * A private certificate managed by AWS Certificate Manager
 *
 * @resource AWS::CertificateManager::Certificate
 */
class PrivateCertificate extends certificate_base_1.CertificateBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_certificatemanager_PrivateCertificateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PrivateCertificate);
            }
            throw error;
        }
        const cert = new certificatemanager_generated_1.CfnCertificate(this, 'Resource', {
            domainName: props.domainName,
            subjectAlternativeNames: props.subjectAlternativeNames,
            certificateAuthorityArn: props.certificateAuthority.certificateAuthorityArn,
        });
        this.certificateArn = cert.ref;
    }
    /**
     * Import a certificate
     */
    static fromCertificateArn(scope, id, certificateArn) {
        class Import extends certificate_base_1.CertificateBase {
            constructor() {
                super(...arguments);
                this.certificateArn = certificateArn;
            }
        }
        return new Import(scope, id);
    }
}
exports.PrivateCertificate = PrivateCertificate;
_a = JSII_RTTI_SYMBOL_1;
PrivateCertificate[_a] = { fqn: "@aws-cdk/aws-certificatemanager.PrivateCertificate", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS1jZXJ0aWZpY2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaXZhdGUtY2VydGlmaWNhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EseURBQXFEO0FBQ3JELGlGQUFnRTtBQTRCaEU7Ozs7R0FJRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsa0NBQWU7SUFpQnJELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBOEI7UUFDdEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQWxCUixrQkFBa0I7Ozs7UUFvQjNCLE1BQU0sSUFBSSxHQUFHLElBQUksNkNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2hELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1Qix1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCO1lBQ3RELHVCQUF1QixFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyx1QkFBdUI7U0FDNUUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ2hDO0lBMUJEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGNBQXNCO1FBQ25GLE1BQU0sTUFBTyxTQUFRLGtDQUFlO1lBQXBDOztnQkFDa0IsbUJBQWMsR0FBRyxjQUFjLENBQUM7WUFDbEQsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBVkgsZ0RBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYWNtcGNhIGZyb20gJ0Bhd3MtY2RrL2F3cy1hY21wY2EnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQ2VydGlmaWNhdGUgfSBmcm9tICcuL2NlcnRpZmljYXRlJztcbmltcG9ydCB7IENlcnRpZmljYXRlQmFzZSB9IGZyb20gJy4vY2VydGlmaWNhdGUtYmFzZSc7XG5pbXBvcnQgeyBDZm5DZXJ0aWZpY2F0ZSB9IGZyb20gJy4vY2VydGlmaWNhdGVtYW5hZ2VyLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgeW91ciBwcml2YXRlIGNlcnRpZmljYXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJpdmF0ZUNlcnRpZmljYXRlUHJvcHMge1xuICAvKipcbiAgICogRnVsbHktcXVhbGlmaWVkIGRvbWFpbiBuYW1lIHRvIHJlcXVlc3QgYSBwcml2YXRlIGNlcnRpZmljYXRlIGZvci5cbiAgICpcbiAgICogTWF5IGNvbnRhaW4gd2lsZGNhcmRzLCBzdWNoIGFzIGBgKi5kb21haW4uY29tYGAuXG4gICAqL1xuICByZWFkb25seSBkb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFsdGVybmF0aXZlIGRvbWFpbiBuYW1lcyBvbiB5b3VyIHByaXZhdGUgY2VydGlmaWNhdGUuXG4gICAqXG4gICAqIFVzZSB0aGlzIHRvIHJlZ2lzdGVyIGFsdGVybmF0aXZlIGRvbWFpbiBuYW1lcyB0aGF0IHJlcHJlc2VudCB0aGUgc2FtZSBzaXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgRlFETnMgd2lsbCBiZSBpbmNsdWRlZCBhcyBhbHRlcm5hdGl2ZSBkb21haW4gbmFtZXMuXG4gICAqL1xuICByZWFkb25seSBzdWJqZWN0QWx0ZXJuYXRpdmVOYW1lcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIGNlcnRpZmljYXRlIGF1dGhvcml0eSAoQ0EpIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGlzc3VlIHRoZSBjZXJ0aWZpY2F0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlQXV0aG9yaXR5OiBhY21wY2EuSUNlcnRpZmljYXRlQXV0aG9yaXR5O1xufVxuXG4vKipcbiAqIEEgcHJpdmF0ZSBjZXJ0aWZpY2F0ZSBtYW5hZ2VkIGJ5IEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZVxuICovXG5leHBvcnQgY2xhc3MgUHJpdmF0ZUNlcnRpZmljYXRlIGV4dGVuZHMgQ2VydGlmaWNhdGVCYXNlIGltcGxlbWVudHMgSUNlcnRpZmljYXRlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhIGNlcnRpZmljYXRlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DZXJ0aWZpY2F0ZUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nKTogSUNlcnRpZmljYXRlIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBDZXJ0aWZpY2F0ZUJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGNlcnRpZmljYXRlQXJuID0gY2VydGlmaWNhdGVBcm47XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUncyBBUk5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjZXJ0aWZpY2F0ZUFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQcml2YXRlQ2VydGlmaWNhdGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBjZXJ0ID0gbmV3IENmbkNlcnRpZmljYXRlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6IHByb3BzLmRvbWFpbk5hbWUsXG4gICAgICBzdWJqZWN0QWx0ZXJuYXRpdmVOYW1lczogcHJvcHMuc3ViamVjdEFsdGVybmF0aXZlTmFtZXMsXG4gICAgICBjZXJ0aWZpY2F0ZUF1dGhvcml0eUFybjogcHJvcHMuY2VydGlmaWNhdGVBdXRob3JpdHkuY2VydGlmaWNhdGVBdXRob3JpdHlBcm4sXG4gICAgfSk7XG5cbiAgICB0aGlzLmNlcnRpZmljYXRlQXJuID0gY2VydC5yZWY7XG4gIH1cbn1cbiJdfQ==