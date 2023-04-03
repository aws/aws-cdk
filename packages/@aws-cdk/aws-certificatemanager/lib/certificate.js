"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMethod = exports.Certificate = exports.CertificateValidation = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const certificate_base_1 = require("./certificate-base");
const certificatemanager_generated_1 = require("./certificatemanager.generated");
const util_1 = require("./util");
/**
 * Name tag constant
 */
const NAME_TAG = 'Name';
/**
 * How to validate a certificate
 */
class CertificateValidation {
    /** @param props Certification validation properties */
    constructor(props) {
        this.props = props;
        this.method = props.method ?? ValidationMethod.EMAIL;
    }
    /**
     * Validate the certificate with DNS
     *
     * IMPORTANT: If `hostedZone` is not specified, DNS records must be added
     * manually and the stack will not complete creating until the records are
     * added.
     *
     * @param hostedZone the hosted zone where DNS records must be created
     */
    static fromDns(hostedZone) {
        return new CertificateValidation({
            method: ValidationMethod.DNS,
            hostedZone,
        });
    }
    /**
     * Validate the certificate with automatically created DNS records in multiple
     * Amazon Route 53 hosted zones.
     *
     * @param hostedZones a map of hosted zones where DNS records must be created
     * for the domains in the certificate
     */
    static fromDnsMultiZone(hostedZones) {
        return new CertificateValidation({
            method: ValidationMethod.DNS,
            hostedZones,
        });
    }
    /**
     * Validate the certificate with Email
     *
     * IMPORTANT: if you are creating a certificate as part of your stack, the stack
     * will not complete creating until you read and follow the instructions in the
     * email that you will receive.
     *
     * ACM will send validation emails to the following addresses:
     *
     *  admin@domain.com
     *  administrator@domain.com
     *  hostmaster@domain.com
     *  postmaster@domain.com
     *  webmaster@domain.com
     *
     * For every domain that you register.
     *
     * @param validationDomains a map of validation domains to use for domains in the certificate
     */
    static fromEmail(validationDomains) {
        return new CertificateValidation({
            method: ValidationMethod.EMAIL,
            validationDomains,
        });
    }
}
exports.CertificateValidation = CertificateValidation;
_a = JSII_RTTI_SYMBOL_1;
CertificateValidation[_a] = { fqn: "@aws-cdk/aws-certificatemanager.CertificateValidation", version: "0.0.0" };
/**
 * A certificate managed by AWS Certificate Manager
 */
class Certificate extends certificate_base_1.CertificateBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_certificatemanager_CertificateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Certificate);
            }
            throw error;
        }
        let validation;
        if (props.validation) {
            validation = props.validation;
        }
        else { // Deprecated props
            if (props.validationMethod === ValidationMethod.DNS) {
                validation = CertificateValidation.fromDns();
            }
            else {
                validation = CertificateValidation.fromEmail(props.validationDomains);
            }
        }
        // check if domain name is 64 characters or less
        if (!core_1.Token.isUnresolved(props.domainName) && props.domainName.length > 64) {
            throw new Error('Domain name must be 64 characters or less');
        }
        const allDomainNames = [props.domainName].concat(props.subjectAlternativeNames || []);
        let certificateTransparencyLoggingPreference;
        if (props.transparencyLoggingEnabled !== undefined) {
            certificateTransparencyLoggingPreference = props.transparencyLoggingEnabled ? 'ENABLED' : 'DISABLED';
        }
        const cert = new certificatemanager_generated_1.CfnCertificate(this, 'Resource', {
            domainName: props.domainName,
            subjectAlternativeNames: props.subjectAlternativeNames,
            domainValidationOptions: renderDomainValidation(validation, allDomainNames),
            validationMethod: validation.method,
            certificateTransparencyLoggingPreference,
        });
        core_1.Tags.of(cert).add(NAME_TAG, props.certificateName || this.node.path.slice(0, 255));
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
exports.Certificate = Certificate;
_b = JSII_RTTI_SYMBOL_1;
Certificate[_b] = { fqn: "@aws-cdk/aws-certificatemanager.Certificate", version: "0.0.0" };
/**
 * Method used to assert ownership of the domain
 */
var ValidationMethod;
(function (ValidationMethod) {
    /**
     * Send email to a number of email addresses associated with the domain
     *
     * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html
     */
    ValidationMethod["EMAIL"] = "EMAIL";
    /**
     * Validate ownership by adding appropriate DNS records
     *
     * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html
     */
    ValidationMethod["DNS"] = "DNS";
})(ValidationMethod = exports.ValidationMethod || (exports.ValidationMethod = {}));
// eslint-disable-next-line max-len
function renderDomainValidation(validation, domainNames) {
    const domainValidation = [];
    switch (validation.method) {
        case ValidationMethod.DNS:
            for (const domainName of getUniqueDnsDomainNames(domainNames)) {
                const hostedZone = validation.props.hostedZones?.[domainName] ?? validation.props.hostedZone;
                if (hostedZone) {
                    domainValidation.push({ domainName, hostedZoneId: hostedZone.hostedZoneId });
                }
            }
            break;
        case ValidationMethod.EMAIL:
            for (const domainName of domainNames) {
                const validationDomain = validation.props.validationDomains?.[domainName];
                if (!validationDomain && core_1.Token.isUnresolved(domainName)) {
                    throw new Error('When using Tokens for domain names, \'validationDomains\' needs to be supplied');
                }
                domainValidation.push({ domainName, validationDomain: validationDomain ?? util_1.apexDomain(domainName) });
            }
            break;
        default:
            throw new Error(`Unknown validation method ${validation.method}`);
    }
    return domainValidation.length !== 0 ? domainValidation : undefined;
}
/**
 * Removes wildcard domains (*.example.com) where the base domain (example.com) is present.
 * This is because the DNS validation treats them as the same thing, and the automated CloudFormation
 * DNS validation errors out with the duplicate records.
 */
function getUniqueDnsDomainNames(domainNames) {
    return domainNames.filter(domain => {
        return core_1.Token.isUnresolved(domain) || !domain.startsWith('*.') || !domainNames.includes(domain.replace('*.', ''));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZXJ0aWZpY2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSx3Q0FBdUQ7QUFFdkQseURBQXFEO0FBQ3JELGlGQUFnRTtBQUNoRSxpQ0FBb0M7QUFFcEM7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBVyxNQUFNLENBQUM7QUErSGhDOztHQUVHO0FBQ0gsTUFBYSxxQkFBcUI7SUE4RGhDLHVEQUF1RDtJQUN2RCxZQUFvQyxLQUFtQztRQUFuQyxVQUFLLEdBQUwsS0FBSyxDQUE4QjtRQUNyRSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0tBQ3REO0lBaEVEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFnQztRQUNwRCxPQUFPLElBQUkscUJBQXFCLENBQUM7WUFDL0IsTUFBTSxFQUFFLGdCQUFnQixDQUFDLEdBQUc7WUFDNUIsVUFBVTtTQUNYLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQTBEO1FBQ3ZGLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQztZQUMvQixNQUFNLEVBQUUsZ0JBQWdCLENBQUMsR0FBRztZQUM1QixXQUFXO1NBQ1osQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBb0Q7UUFDMUUsT0FBTyxJQUFJLHFCQUFxQixDQUFDO1lBQy9CLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLO1lBQzlCLGlCQUFpQjtTQUNsQixDQUFDLENBQUM7S0FDSjs7QUF2REgsc0RBa0VDOzs7QUFFRDs7R0FFRztBQUNILE1BQWEsV0FBWSxTQUFRLGtDQUFlO0lBaUI5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9E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LElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBJUmVzb3VyY2UsIFRva2VuLCBUYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENlcnRpZmljYXRlQmFzZSB9IGZyb20gJy4vY2VydGlmaWNhdGUtYmFzZSc7XG5pbXBvcnQgeyBDZm5DZXJ0aWZpY2F0ZSB9IGZyb20gJy4vY2VydGlmaWNhdGVtYW5hZ2VyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBhcGV4RG9tYWluIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBOYW1lIHRhZyBjb25zdGFudFxuICovXG5jb25zdCBOQU1FX1RBRzogc3RyaW5nID0gJ05hbWUnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjZXJ0aWZpY2F0ZSBpbiBBV1MgQ2VydGlmaWNhdGUgTWFuYWdlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDZXJ0aWZpY2F0ZSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUncyBBUk5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2VydGlmaWNhdGVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBEYXlzVG9FeHBpcnkgbWV0cmljIGZvciB0aGlzIEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyXG4gICAqIENlcnRpZmljYXRlLiBCeSBkZWZhdWx0LCB0aGlzIGlzIHRoZSBtaW5pbXVtIHZhbHVlIG92ZXIgMSBkYXkuXG4gICAqXG4gICAqIFRoaXMgbWV0cmljIGlzIG5vIGxvbmdlciBlbWl0dGVkIG9uY2UgdGhlIGNlcnRpZmljYXRlIGhhcyBlZmZlY3RpdmVseVxuICAgKiBleHBpcmVkLCBzbyBhbGFybXMgY29uZmlndXJlZCBvbiB0aGlzIG1ldHJpYyBzaG91bGQgcHJvYmFibHkgdHJlYXQgbWlzc2luZ1xuICAgKiBkYXRhIGFzIFwiYnJlYWNoaW5nXCIuXG4gICAqL1xuICBtZXRyaWNEYXlzVG9FeHBpcnkocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB5b3VyIGNlcnRpZmljYXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2VydGlmaWNhdGVQcm9wcyB7XG4gIC8qKlxuICAgKiBGdWxseS1xdWFsaWZpZWQgZG9tYWluIG5hbWUgdG8gcmVxdWVzdCBhIGNlcnRpZmljYXRlIGZvci5cbiAgICpcbiAgICogTWF5IGNvbnRhaW4gd2lsZGNhcmRzLCBzdWNoIGFzIGBgKi5kb21haW4uY29tYGAuXG4gICAqL1xuICByZWFkb25seSBkb21haW5OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFsdGVybmF0aXZlIGRvbWFpbiBuYW1lcyBvbiB5b3VyIGNlcnRpZmljYXRlLlxuICAgKlxuICAgKiBVc2UgdGhpcyB0byByZWdpc3RlciBhbHRlcm5hdGl2ZSBkb21haW4gbmFtZXMgdGhhdCByZXByZXNlbnQgdGhlIHNhbWUgc2l0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIEZRRE5zIHdpbGwgYmUgaW5jbHVkZWQgYXMgYWx0ZXJuYXRpdmUgZG9tYWluIG5hbWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgc3ViamVjdEFsdGVybmF0aXZlTmFtZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogV2hhdCB2YWxpZGF0aW9uIGRvbWFpbiB0byB1c2UgZm9yIGV2ZXJ5IHJlcXVlc3RlZCBkb21haW4uXG4gICAqXG4gICAqIEhhcyB0byBiZSBhIHN1cGVyZG9tYWluIG9mIHRoZSByZXF1ZXN0ZWQgZG9tYWluLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFwZXggZG9tYWluIGlzIHVzZWQgZm9yIGV2ZXJ5IGRvbWFpbiB0aGF0J3Mgbm90IG92ZXJyaWRkZW4uXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgdmFsaWRhdGlvbmAgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHZhbGlkYXRpb25Eb21haW5zPzoge1tkb21haW5OYW1lOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0aW9uIG1ldGhvZCB1c2VkIHRvIGFzc2VydCBkb21haW4gb3duZXJzaGlwXG4gICAqXG4gICAqIEBkZWZhdWx0IFZhbGlkYXRpb25NZXRob2QuRU1BSUxcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGB2YWxpZGF0aW9uYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdGlvbk1ldGhvZD86IFZhbGlkYXRpb25NZXRob2Q7XG5cbiAgLyoqXG4gICAqIEhvdyB0byB2YWxpZGF0ZSB0aGlzIGNlcnRpZmljYXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRW1haWwoKVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdGlvbj86IENlcnRpZmljYXRlVmFsaWRhdGlvbjtcblxuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgdHJhbnNwYXJlbmN5IGxvZ2dpbmcgZm9yIHRoaXMgY2VydGlmaWNhdGVcbiAgICpcbiAgICogT25jZSBhIGNlcnRpZmljYXRlIGhhcyBiZWVuIGxvZ2dlZCwgaXQgY2Fubm90IGJlIHJlbW92ZWQgZnJvbSB0aGUgbG9nLlxuICAgKiBPcHRpbmcgb3V0IGF0IHRoYXQgcG9pbnQgd2lsbCBoYXZlIG5vIGVmZmVjdC4gSWYgeW91IG9wdCBvdXQgb2YgbG9nZ2luZ1xuICAgKiB3aGVuIHlvdSByZXF1ZXN0IGEgY2VydGlmaWNhdGUgYW5kIHRoZW4gY2hvb3NlIGxhdGVyIHRvIG9wdCBiYWNrIGluLFxuICAgKiB5b3VyIGNlcnRpZmljYXRlIHdpbGwgbm90IGJlIGxvZ2dlZCB1bnRpbCBpdCBpcyByZW5ld2VkLlxuICAgKiBJZiB5b3Ugd2FudCB0aGUgY2VydGlmaWNhdGUgdG8gYmUgbG9nZ2VkIGltbWVkaWF0ZWx5LCB3ZSByZWNvbW1lbmQgdGhhdCB5b3UgaXNzdWUgYSBuZXcgb25lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hY20vbGF0ZXN0L3VzZXJndWlkZS9hY20tYmVzdHByYWN0aWNlcy5odG1sI2Jlc3QtcHJhY3RpY2VzLXRyYW5zcGFyZW5jeVxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSB0cmFuc3BhcmVuY3lMb2dnaW5nRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBDZXJ0aWZjYXRlIG5hbWUuXG4gICAqXG4gICAqIFNpbmNlIHRoZSBDZXJ0aWZjYXRlIHJlc291cmNlIGRvZXNuJ3Qgc3VwcG9ydCBwcm92aWRpbmcgYSBwaHlzaWNhbCBuYW1lLCB0aGUgdmFsdWUgcHJvdmlkZWQgaGVyZSB3aWxsIGJlIHJlY29yZGVkIGluIHRoZSBgTmFtZWAgdGFnXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBmdWxsLCBhYnNvbHV0ZSBwYXRoIG9mIHRoaXMgY29uc3RydWN0XG4gICAqL1xuICByZWFkb25seSBjZXJ0aWZpY2F0ZU5hbWU/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjZXJ0aWZpY2F0ZSB2YWxpZGF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2VydGlmaWNhdGlvblZhbGlkYXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBWYWxpZGF0aW9uIG1ldGhvZFxuICAgKlxuICAgKiBAZGVmYXVsdCBWYWxpZGF0aW9uTWV0aG9kLkVNQUlMXG4gICAqL1xuICByZWFkb25seSBtZXRob2Q/OiBWYWxpZGF0aW9uTWV0aG9kO1xuXG4gIC8qKlxuICAgKiBIb3N0ZWQgem9uZSB0byB1c2UgZm9yIEROUyB2YWxpZGF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdXNlIGVtYWlsIHZhbGlkYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGhvc3RlZFpvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lO1xuXG4gIC8qKlxuICAgKiBBIG1hcCBvZiBob3N0ZWQgem9uZXMgdG8gdXNlIGZvciBETlMgdmFsaWRhdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVzZSBgaG9zdGVkWm9uZWBcbiAgICovXG4gIHJlYWRvbmx5IGhvc3RlZFpvbmVzPzogeyBbZG9tYWluTmFtZTogc3RyaW5nXTogcm91dGU1My5JSG9zdGVkWm9uZSB9O1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0aW9uIGRvbWFpbnMgdG8gdXNlIGZvciBlbWFpbCB2YWxpZGF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXBleCBkb21haW5cbiAgICovXG4gIHJlYWRvbmx5IHZhbGlkYXRpb25Eb21haW5zPzogeyBbZG9tYWluTmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogSG93IHRvIHZhbGlkYXRlIGEgY2VydGlmaWNhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIENlcnRpZmljYXRlVmFsaWRhdGlvbiB7XG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGUgY2VydGlmaWNhdGUgd2l0aCBETlNcbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiBgaG9zdGVkWm9uZWAgaXMgbm90IHNwZWNpZmllZCwgRE5TIHJlY29yZHMgbXVzdCBiZSBhZGRlZFxuICAgKiBtYW51YWxseSBhbmQgdGhlIHN0YWNrIHdpbGwgbm90IGNvbXBsZXRlIGNyZWF0aW5nIHVudGlsIHRoZSByZWNvcmRzIGFyZVxuICAgKiBhZGRlZC5cbiAgICpcbiAgICogQHBhcmFtIGhvc3RlZFpvbmUgdGhlIGhvc3RlZCB6b25lIHdoZXJlIEROUyByZWNvcmRzIG11c3QgYmUgY3JlYXRlZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRG5zKGhvc3RlZFpvbmU/OiByb3V0ZTUzLklIb3N0ZWRab25lKSB7XG4gICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24oe1xuICAgICAgbWV0aG9kOiBWYWxpZGF0aW9uTWV0aG9kLkROUyxcbiAgICAgIGhvc3RlZFpvbmUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhlIGNlcnRpZmljYXRlIHdpdGggYXV0b21hdGljYWxseSBjcmVhdGVkIEROUyByZWNvcmRzIGluIG11bHRpcGxlXG4gICAqIEFtYXpvbiBSb3V0ZSA1MyBob3N0ZWQgem9uZXMuXG4gICAqXG4gICAqIEBwYXJhbSBob3N0ZWRab25lcyBhIG1hcCBvZiBob3N0ZWQgem9uZXMgd2hlcmUgRE5TIHJlY29yZHMgbXVzdCBiZSBjcmVhdGVkXG4gICAqIGZvciB0aGUgZG9tYWlucyBpbiB0aGUgY2VydGlmaWNhdGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURuc011bHRpWm9uZShob3N0ZWRab25lczogeyBbZG9tYWluTmFtZTogc3RyaW5nXTogcm91dGU1My5JSG9zdGVkWm9uZSB9KSB7XG4gICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24oe1xuICAgICAgbWV0aG9kOiBWYWxpZGF0aW9uTWV0aG9kLkROUyxcbiAgICAgIGhvc3RlZFpvbmVzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBjZXJ0aWZpY2F0ZSB3aXRoIEVtYWlsXG4gICAqXG4gICAqIElNUE9SVEFOVDogaWYgeW91IGFyZSBjcmVhdGluZyBhIGNlcnRpZmljYXRlIGFzIHBhcnQgb2YgeW91ciBzdGFjaywgdGhlIHN0YWNrXG4gICAqIHdpbGwgbm90IGNvbXBsZXRlIGNyZWF0aW5nIHVudGlsIHlvdSByZWFkIGFuZCBmb2xsb3cgdGhlIGluc3RydWN0aW9ucyBpbiB0aGVcbiAgICogZW1haWwgdGhhdCB5b3Ugd2lsbCByZWNlaXZlLlxuICAgKlxuICAgKiBBQ00gd2lsbCBzZW5kIHZhbGlkYXRpb24gZW1haWxzIHRvIHRoZSBmb2xsb3dpbmcgYWRkcmVzc2VzOlxuICAgKlxuICAgKiAgYWRtaW5AZG9tYWluLmNvbVxuICAgKiAgYWRtaW5pc3RyYXRvckBkb21haW4uY29tXG4gICAqICBob3N0bWFzdGVyQGRvbWFpbi5jb21cbiAgICogIHBvc3RtYXN0ZXJAZG9tYWluLmNvbVxuICAgKiAgd2VibWFzdGVyQGRvbWFpbi5jb21cbiAgICpcbiAgICogRm9yIGV2ZXJ5IGRvbWFpbiB0aGF0IHlvdSByZWdpc3Rlci5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRpb25Eb21haW5zIGEgbWFwIG9mIHZhbGlkYXRpb24gZG9tYWlucyB0byB1c2UgZm9yIGRvbWFpbnMgaW4gdGhlIGNlcnRpZmljYXRlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FbWFpbCh2YWxpZGF0aW9uRG9tYWlucz86IHsgW2RvbWFpbk5hbWU6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIG5ldyBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24oe1xuICAgICAgbWV0aG9kOiBWYWxpZGF0aW9uTWV0aG9kLkVNQUlMLFxuICAgICAgdmFsaWRhdGlvbkRvbWFpbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHZhbGlkYXRpb24gbWV0aG9kXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbWV0aG9kOiBWYWxpZGF0aW9uTWV0aG9kO1xuXG4gIC8qKiBAcGFyYW0gcHJvcHMgQ2VydGlmaWNhdGlvbiB2YWxpZGF0aW9uIHByb3BlcnRpZXMgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcHJvcHM6IENlcnRpZmljYXRpb25WYWxpZGF0aW9uUHJvcHMpIHtcbiAgICB0aGlzLm1ldGhvZCA9IHByb3BzLm1ldGhvZCA/PyBWYWxpZGF0aW9uTWV0aG9kLkVNQUlMO1xuICB9XG59XG5cbi8qKlxuICogQSBjZXJ0aWZpY2F0ZSBtYW5hZ2VkIGJ5IEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBDZXJ0aWZpY2F0ZSBleHRlbmRzIENlcnRpZmljYXRlQmFzZSBpbXBsZW1lbnRzIElDZXJ0aWZpY2F0ZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBjZXJ0aWZpY2F0ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2VydGlmaWNhdGVBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY2VydGlmaWNhdGVBcm46IHN0cmluZyk6IElDZXJ0aWZpY2F0ZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQ2VydGlmaWNhdGVCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjZXJ0aWZpY2F0ZUFybiA9IGNlcnRpZmljYXRlQXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNlcnRpZmljYXRlJ3MgQVJOXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2VydGlmaWNhdGVBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2VydGlmaWNhdGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBsZXQgdmFsaWRhdGlvbjogQ2VydGlmaWNhdGVWYWxpZGF0aW9uO1xuICAgIGlmIChwcm9wcy52YWxpZGF0aW9uKSB7XG4gICAgICB2YWxpZGF0aW9uID0gcHJvcHMudmFsaWRhdGlvbjtcbiAgICB9IGVsc2UgeyAvLyBEZXByZWNhdGVkIHByb3BzXG4gICAgICBpZiAocHJvcHMudmFsaWRhdGlvbk1ldGhvZCA9PT0gVmFsaWRhdGlvbk1ldGhvZC5ETlMpIHtcbiAgICAgICAgdmFsaWRhdGlvbiA9IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0aW9uID0gQ2VydGlmaWNhdGVWYWxpZGF0aW9uLmZyb21FbWFpbChwcm9wcy52YWxpZGF0aW9uRG9tYWlucyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgZG9tYWluIG5hbWUgaXMgNjQgY2hhcmFjdGVycyBvciBsZXNzXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuZG9tYWluTmFtZSkgJiYgcHJvcHMuZG9tYWluTmFtZS5sZW5ndGggPiA2NCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb21haW4gbmFtZSBtdXN0IGJlIDY0IGNoYXJhY3RlcnMgb3IgbGVzcycpO1xuICAgIH1cblxuICAgIGNvbnN0IGFsbERvbWFpbk5hbWVzID0gW3Byb3BzLmRvbWFpbk5hbWVdLmNvbmNhdChwcm9wcy5zdWJqZWN0QWx0ZXJuYXRpdmVOYW1lcyB8fCBbXSk7XG5cbiAgICBsZXQgY2VydGlmaWNhdGVUcmFuc3BhcmVuY3lMb2dnaW5nUHJlZmVyZW5jZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmIChwcm9wcy50cmFuc3BhcmVuY3lMb2dnaW5nRW5hYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlID0gcHJvcHMudHJhbnNwYXJlbmN5TG9nZ2luZ0VuYWJsZWQgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnO1xuICAgIH1cblxuICAgIGNvbnN0IGNlcnQgPSBuZXcgQ2ZuQ2VydGlmaWNhdGUodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZG9tYWluTmFtZTogcHJvcHMuZG9tYWluTmFtZSxcbiAgICAgIHN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBwcm9wcy5zdWJqZWN0QWx0ZXJuYXRpdmVOYW1lcyxcbiAgICAgIGRvbWFpblZhbGlkYXRpb25PcHRpb25zOiByZW5kZXJEb21haW5WYWxpZGF0aW9uKHZhbGlkYXRpb24sIGFsbERvbWFpbk5hbWVzKSxcbiAgICAgIHZhbGlkYXRpb25NZXRob2Q6IHZhbGlkYXRpb24ubWV0aG9kLFxuICAgICAgY2VydGlmaWNhdGVUcmFuc3BhcmVuY3lMb2dnaW5nUHJlZmVyZW5jZSxcbiAgICB9KTtcblxuICAgIFRhZ3Mub2YoY2VydCkuYWRkKE5BTUVfVEFHLCBwcm9wcy5jZXJ0aWZpY2F0ZU5hbWUgfHwgdGhpcy5ub2RlLnBhdGguc2xpY2UoMCwgMjU1KSk7XG5cbiAgICB0aGlzLmNlcnRpZmljYXRlQXJuID0gY2VydC5yZWY7XG4gIH1cbn1cblxuLyoqXG4gKiBNZXRob2QgdXNlZCB0byBhc3NlcnQgb3duZXJzaGlwIG9mIHRoZSBkb21haW5cbiAqL1xuZXhwb3J0IGVudW0gVmFsaWRhdGlvbk1ldGhvZCB7XG4gIC8qKlxuICAgKiBTZW5kIGVtYWlsIHRvIGEgbnVtYmVyIG9mIGVtYWlsIGFkZHJlc3NlcyBhc3NvY2lhdGVkIHdpdGggdGhlIGRvbWFpblxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hY20vbGF0ZXN0L3VzZXJndWlkZS9ncy1hY20tdmFsaWRhdGUtZW1haWwuaHRtbFxuICAgKi9cbiAgRU1BSUwgPSAnRU1BSUwnLFxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBvd25lcnNoaXAgYnkgYWRkaW5nIGFwcHJvcHJpYXRlIEROUyByZWNvcmRzXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FjbS9sYXRlc3QvdXNlcmd1aWRlL2dzLWFjbS12YWxpZGF0ZS1kbnMuaHRtbFxuICAgKi9cbiAgRE5TID0gJ0ROUycsXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG5mdW5jdGlvbiByZW5kZXJEb21haW5WYWxpZGF0aW9uKHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbiwgZG9tYWluTmFtZXM6IHN0cmluZ1tdKTogQ2ZuQ2VydGlmaWNhdGUuRG9tYWluVmFsaWRhdGlvbk9wdGlvblByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICBjb25zdCBkb21haW5WYWxpZGF0aW9uOiBDZm5DZXJ0aWZpY2F0ZS5Eb21haW5WYWxpZGF0aW9uT3B0aW9uUHJvcGVydHlbXSA9IFtdO1xuXG4gIHN3aXRjaCAodmFsaWRhdGlvbi5tZXRob2QpIHtcbiAgICBjYXNlIFZhbGlkYXRpb25NZXRob2QuRE5TOlxuICAgICAgZm9yIChjb25zdCBkb21haW5OYW1lIG9mIGdldFVuaXF1ZURuc0RvbWFpbk5hbWVzKGRvbWFpbk5hbWVzKSkge1xuICAgICAgICBjb25zdCBob3N0ZWRab25lID0gdmFsaWRhdGlvbi5wcm9wcy5ob3N0ZWRab25lcz8uW2RvbWFpbk5hbWVdID8/IHZhbGlkYXRpb24ucHJvcHMuaG9zdGVkWm9uZTtcbiAgICAgICAgaWYgKGhvc3RlZFpvbmUpIHtcbiAgICAgICAgICBkb21haW5WYWxpZGF0aW9uLnB1c2goeyBkb21haW5OYW1lLCBob3N0ZWRab25lSWQ6IGhvc3RlZFpvbmUuaG9zdGVkWm9uZUlkIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFZhbGlkYXRpb25NZXRob2QuRU1BSUw6XG4gICAgICBmb3IgKGNvbnN0IGRvbWFpbk5hbWUgb2YgZG9tYWluTmFtZXMpIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdGlvbkRvbWFpbiA9IHZhbGlkYXRpb24ucHJvcHMudmFsaWRhdGlvbkRvbWFpbnM/Lltkb21haW5OYW1lXTtcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uRG9tYWluICYmIFRva2VuLmlzVW5yZXNvbHZlZChkb21haW5OYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV2hlbiB1c2luZyBUb2tlbnMgZm9yIGRvbWFpbiBuYW1lcywgXFwndmFsaWRhdGlvbkRvbWFpbnNcXCcgbmVlZHMgdG8gYmUgc3VwcGxpZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBkb21haW5WYWxpZGF0aW9uLnB1c2goeyBkb21haW5OYW1lLCB2YWxpZGF0aW9uRG9tYWluOiB2YWxpZGF0aW9uRG9tYWluID8/IGFwZXhEb21haW4oZG9tYWluTmFtZSkgfSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHZhbGlkYXRpb24gbWV0aG9kICR7dmFsaWRhdGlvbi5tZXRob2R9YCk7XG4gIH1cblxuICByZXR1cm4gZG9tYWluVmFsaWRhdGlvbi5sZW5ndGggIT09IDAgPyBkb21haW5WYWxpZGF0aW9uIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgd2lsZGNhcmQgZG9tYWlucyAoKi5leGFtcGxlLmNvbSkgd2hlcmUgdGhlIGJhc2UgZG9tYWluIChleGFtcGxlLmNvbSkgaXMgcHJlc2VudC5cbiAqIFRoaXMgaXMgYmVjYXVzZSB0aGUgRE5TIHZhbGlkYXRpb24gdHJlYXRzIHRoZW0gYXMgdGhlIHNhbWUgdGhpbmcsIGFuZCB0aGUgYXV0b21hdGVkIENsb3VkRm9ybWF0aW9uXG4gKiBETlMgdmFsaWRhdGlvbiBlcnJvcnMgb3V0IHdpdGggdGhlIGR1cGxpY2F0ZSByZWNvcmRzLlxuICovXG5mdW5jdGlvbiBnZXRVbmlxdWVEbnNEb21haW5OYW1lcyhkb21haW5OYW1lczogc3RyaW5nW10pIHtcbiAgcmV0dXJuIGRvbWFpbk5hbWVzLmZpbHRlcihkb21haW4gPT4ge1xuICAgIHJldHVybiBUb2tlbi5pc1VucmVzb2x2ZWQoZG9tYWluKSB8fCAhZG9tYWluLnN0YXJ0c1dpdGgoJyouJykgfHwgIWRvbWFpbk5hbWVzLmluY2x1ZGVzKGRvbWFpbi5yZXBsYWNlKCcqLicsICcnKSk7XG4gIH0pO1xufVxuIl19