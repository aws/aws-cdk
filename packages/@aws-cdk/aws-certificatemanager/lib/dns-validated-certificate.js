"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsValidatedCertificate = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const certificate_base_1 = require("./certificate-base");
/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 *
 * @resource AWS::CertificateManager::Certificate
 * @deprecated use {@link Certificate} instead
 */
class DnsValidatedCertificate extends certificate_base_1.CertificateBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-certificatemanager.DnsValidatedCertificate", "use {@link Certificate} instead");
            jsiiDeprecationWarnings._aws_cdk_aws_certificatemanager_DnsValidatedCertificateProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DnsValidatedCertificate);
            }
            throw error;
        }
        this.region = props.region;
        this.domainName = props.domainName;
        // check if domain name is 64 characters or less
        if (!core_1.Token.isUnresolved(props.domainName) && props.domainName.length > 64) {
            throw new Error('Domain name must be 64 characters or less');
        }
        this.normalizedZoneName = props.hostedZone.zoneName;
        // Remove trailing `.` from zone name
        if (this.normalizedZoneName.endsWith('.')) {
            this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
        }
        // Remove any `/hostedzone/` prefix from the Hosted Zone ID
        this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, '');
        this.tags = new cdk.TagManager(cdk.TagType.MAP, 'AWS::CertificateManager::Certificate');
        let certificateTransparencyLoggingPreference;
        if (props.transparencyLoggingEnabled !== undefined) {
            certificateTransparencyLoggingPreference = props.transparencyLoggingEnabled ? 'ENABLED' : 'DISABLED';
        }
        const requestorFunction = new lambda.Function(this, 'CertificateRequestorFunction', {
            code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'lambda-packages', 'dns_validated_certificate_handler', 'lib')),
            handler: 'index.certificateRequestHandler',
            runtime: lambda.Runtime.NODEJS_14_X,
            timeout: cdk.Duration.minutes(15),
            role: props.customResourceRole,
        });
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['acm:RequestCertificate', 'acm:DescribeCertificate', 'acm:DeleteCertificate', 'acm:AddTagsToCertificate'],
            resources: ['*'],
        }));
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['route53:GetChange'],
            resources: ['*'],
        }));
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['route53:changeResourceRecordSets'],
            resources: [`arn:${cdk.Stack.of(requestorFunction).partition}:route53:::hostedzone/${this.hostedZoneId}`],
            conditions: {
                'ForAllValues:StringEquals': {
                    'route53:ChangeResourceRecordSetsRecordTypes': ['CNAME'],
                    'route53:ChangeResourceRecordSetsActions': props.cleanupRoute53Records ? ['UPSERT', 'DELETE'] : ['UPSERT'],
                },
                'ForAllValues:StringLike': {
                    'route53:ChangeResourceRecordSetsNormalizedRecordNames': [
                        addWildcard(props.domainName),
                        ...(props.subjectAlternativeNames ?? []).map(d => addWildcard(d)),
                    ],
                },
            },
        }));
        const certificate = new cdk.CustomResource(this, 'CertificateRequestorResource', {
            serviceToken: requestorFunction.functionArn,
            properties: {
                DomainName: props.domainName,
                SubjectAlternativeNames: cdk.Lazy.list({ produce: () => props.subjectAlternativeNames }, { omitEmpty: true }),
                CertificateTransparencyLoggingPreference: certificateTransparencyLoggingPreference,
                HostedZoneId: this.hostedZoneId,
                Region: props.region,
                Route53Endpoint: props.route53Endpoint,
                RemovalPolicy: cdk.Lazy.any({ produce: () => this._removalPolicy }),
                // Custom resources properties are always converted to strings; might as well be explict here.
                CleanupRecords: props.cleanupRoute53Records ? 'true' : undefined,
                Tags: cdk.Lazy.list({ produce: () => this.tags.renderTags() }),
            },
        });
        this.certificateArn = certificate.getAtt('Arn').toString();
        this.node.addValidation({ validate: () => this.validateDnsValidatedCertificate() });
    }
    applyRemovalPolicy(policy) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-certificatemanager.DnsValidatedCertificate#applyRemovalPolicy", "use {@link Certificate} instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyRemovalPolicy);
            }
            throw error;
        }
        this._removalPolicy = policy;
    }
    validateDnsValidatedCertificate() {
        const errors = [];
        // Ensure the zone name is a parent zone of the certificate domain name
        if (!cdk.Token.isUnresolved(this.normalizedZoneName) &&
            this.domainName !== this.normalizedZoneName &&
            !this.domainName.endsWith('.' + this.normalizedZoneName)) {
            errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.domainName}`);
        }
        return errors;
    }
}
exports.DnsValidatedCertificate = DnsValidatedCertificate;
_a = JSII_RTTI_SYMBOL_1;
DnsValidatedCertificate[_a] = { fqn: "@aws-cdk/aws-certificatemanager.DnsValidatedCertificate", version: "0.0.0" };
// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html
function addWildcard(domainName) {
    if (domainName.startsWith('*.')) {
        return domainName;
    }
    return `*.${domainName}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5zLXZhbGlkYXRlZC1jZXJ0aWZpY2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRucy12YWxpZGF0ZWQtY2VydGlmaWNhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFFOUMscUNBQXFDO0FBQ3JDLHdDQUFzQztBQUd0Qyx5REFBcUQ7QUF1RHJEOzs7Ozs7R0FNRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsa0NBQWU7SUFlMUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQztRQUMzRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7OytDQWhCUix1QkFBdUI7Ozs7UUFrQmhDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDekUsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3BELHFDQUFxQztRQUNyQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDcEc7UUFDRCwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLFlB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QUFrQixDQUFDO1lBQ2xELElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLGtCQUFrQjtZQUMzQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLGtCQUFrQixxREFBcUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDeEg7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmOztBQXhHSCwwREF5R0M7OztBQUVELDZGQUE2RjtBQUM3RixTQUFTLFdBQVcsQ0FBQyxVQUFrQjtJQUNyQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDL0IsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxPQUFPLEtBQUssVUFBVSxFQUFFLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENlcnRpZmljYXRlUHJvcHMsIElDZXJ0aWZpY2F0ZSB9IGZyb20gJy4vY2VydGlmaWNhdGUnO1xuaW1wb3J0IHsgQ2VydGlmaWNhdGVCYXNlIH0gZnJvbSAnLi9jZXJ0aWZpY2F0ZS1iYXNlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGNyZWF0ZSBhIEROUyB2YWxpZGF0ZWQgY2VydGlmaWNhdGUgbWFuYWdlZCBieSBBV1MgQ2VydGlmaWNhdGUgTWFuYWdlclxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZVByb3BzIGV4dGVuZHMgQ2VydGlmaWNhdGVQcm9wcyB7XG4gIC8qKlxuICAgKiBSb3V0ZSA1MyBIb3N0ZWQgWm9uZSB1c2VkIHRvIHBlcmZvcm0gRE5TIHZhbGlkYXRpb24gb2YgdGhlIHJlcXVlc3QuICBUaGUgem9uZVxuICAgKiBtdXN0IGJlIGF1dGhvcml0YXRpdmUgZm9yIHRoZSBkb21haW4gbmFtZSBzcGVjaWZpZWQgaW4gdGhlIENlcnRpZmljYXRlIFJlcXVlc3QuXG4gICAqL1xuICByZWFkb25seSBob3N0ZWRab25lOiByb3V0ZTUzLklIb3N0ZWRab25lO1xuICAvKipcbiAgICogQVdTIHJlZ2lvbiB0aGF0IHdpbGwgaG9zdCB0aGUgY2VydGlmaWNhdGUuIFRoaXMgaXMgbmVlZGVkIGVzcGVjaWFsbHlcbiAgICogZm9yIGNlcnRpZmljYXRlcyB1c2VkIGZvciBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbnMsIHdoaWNoIHJlcXVpcmUgdGhlIHJlZ2lvblxuICAgKiB0byBiZSB1cy1lYXN0LTEuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSByZWdpb24gdGhlIHN0YWNrIGlzIGRlcGxveWVkIGluLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBlbmRwb2ludCBvZiBSb3V0ZTUzIHNlcnZpY2UsIHdoaWNoIGlzIG5vdCBuZWNlc3NhcnkgYXMgQVdTIFNESyBjb3VsZCBmaWd1cmVcbiAgICogb3V0IHRoZSByaWdodCBlbmRwb2ludHMgZm9yIG1vc3QgcmVnaW9ucywgYnV0IGZvciBzb21lIHJlZ2lvbnMgc3VjaCBhcyB0aG9zZSBpblxuICAgKiBhd3MtY24gcGFydGl0aW9uLCB0aGUgZGVmYXVsdCBlbmRwb2ludCBpcyBub3Qgd29ya2luZyBub3csIGhlbmNlIHRoZSByaWdodCBlbmRwb2ludFxuICAgKiBuZWVkIHRvIGJlIHNwZWNpZmllZCB0aHJvdWdoIHRoaXMgcHJvcC5cbiAgICpcbiAgICogUm91dGU1MyBpcyBub3QgYmVlbiBvZmZpY2lhbGx5IGxhdW5jaGVkIGluIENoaW5hLCBpdCBpcyBvbmx5IGF2YWlsYWJsZSBmb3IgQVdTXG4gICAqIGludGVybmFsIGFjY291bnRzIG5vdy4gVG8gbWFrZSBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSB3b3JrIGZvciBpbnRlcm5hbCBhY2NvdW50c1xuICAgKiBub3csIGEgc3BlY2lhbCBlbmRwb2ludCBuZWVkcyB0byBiZSBwcm92aWRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgQVdTIFNESyB3aWxsIGRldGVybWluZSB0aGUgUm91dGU1MyBlbmRwb2ludCB0byB1c2UgYmFzZWQgb24gcmVnaW9uXG4gICAqL1xuICByZWFkb25seSByb3V0ZTUzRW5kcG9pbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJvbGUgdG8gdXNlIGZvciB0aGUgY3VzdG9tIHJlc291cmNlIHRoYXQgY3JlYXRlcyB0aGUgdmFsaWRhdGVkIGNlcnRpZmljYXRlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuZXcgcm9sZSB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGN1c3RvbVJlc291cmNlUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogV2hlbiBzZXQgdG8gdHJ1ZSwgd2hlbiB0aGUgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUgaXMgZGVsZXRlZCxcbiAgICogdGhlIGFzc29jaWF0ZWQgUm91dGU1MyB2YWxpZGF0aW9uIHJlY29yZHMgYXJlIHJlbW92ZWQuXG4gICAqXG4gICAqIENBVVRJT046IElmIG11bHRpcGxlIGNlcnRpZmljYXRlcyBzaGFyZSB0aGUgc2FtZSBkb21haW5zIChhbmQgc2FtZSB2YWxpZGF0aW9uIHJlY29yZHMpLFxuICAgKiB0aGlzIGNhbiBjYXVzZSB0aGUgb3RoZXIgY2VydGlmaWNhdGVzIHRvIGZhaWwgcmVuZXdhbCBhbmQvb3Igbm90IHZhbGlkYXRlLlxuICAgKiBOb3QgcmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gdXNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2xlYW51cFJvdXRlNTNSZWNvcmRzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNlcnRpZmljYXRlIG1hbmFnZWQgYnkgQVdTIENlcnRpZmljYXRlIE1hbmFnZXIuICBXaWxsIGJlIGF1dG9tYXRpY2FsbHlcbiAqIHZhbGlkYXRlZCB1c2luZyBETlMgdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBzcGVjaWZpZWQgUm91dGUgNTMgaG9zdGVkIHpvbmUuXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZVxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGluayBDZXJ0aWZpY2F0ZX0gaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUgZXh0ZW5kcyBDZXJ0aWZpY2F0ZUJhc2UgaW1wbGVtZW50cyBJQ2VydGlmaWNhdGUsIGNkay5JVGFnZ2FibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY2VydGlmaWNhdGVBcm46IHN0cmluZztcblxuICAvKipcbiAgKiBSZXNvdXJjZSBUYWdzLlxuICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNlcnRpZmljYXRlbWFuYWdlci1jZXJ0aWZpY2F0ZS5odG1sI2Nmbi1jZXJ0aWZpY2F0ZW1hbmFnZXItY2VydGlmaWNhdGUtdGFnc1xuICAqL1xuXG4gIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBub3JtYWxpemVkWm9uZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBob3N0ZWRab25lSWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBkb21haW5OYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgX3JlbW92YWxQb2xpY3k/OiBjZGsuUmVtb3ZhbFBvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnJlZ2lvbiA9IHByb3BzLnJlZ2lvbjtcbiAgICB0aGlzLmRvbWFpbk5hbWUgPSBwcm9wcy5kb21haW5OYW1lO1xuICAgIC8vIGNoZWNrIGlmIGRvbWFpbiBuYW1lIGlzIDY0IGNoYXJhY3RlcnMgb3IgbGVzc1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmRvbWFpbk5hbWUpICYmIHByb3BzLmRvbWFpbk5hbWUubGVuZ3RoID4gNjQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRG9tYWluIG5hbWUgbXVzdCBiZSA2NCBjaGFyYWN0ZXJzIG9yIGxlc3MnKTtcbiAgICB9XG4gICAgdGhpcy5ub3JtYWxpemVkWm9uZU5hbWUgPSBwcm9wcy5ob3N0ZWRab25lLnpvbmVOYW1lO1xuICAgIC8vIFJlbW92ZSB0cmFpbGluZyBgLmAgZnJvbSB6b25lIG5hbWVcbiAgICBpZiAodGhpcy5ub3JtYWxpemVkWm9uZU5hbWUuZW5kc1dpdGgoJy4nKSkge1xuICAgICAgdGhpcy5ub3JtYWxpemVkWm9uZU5hbWUgPSB0aGlzLm5vcm1hbGl6ZWRab25lTmFtZS5zdWJzdHJpbmcoMCwgdGhpcy5ub3JtYWxpemVkWm9uZU5hbWUubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIC8vIFJlbW92ZSBhbnkgYC9ob3N0ZWR6b25lL2AgcHJlZml4IGZyb20gdGhlIEhvc3RlZCBab25lIElEXG4gICAgdGhpcy5ob3N0ZWRab25lSWQgPSBwcm9wcy5ob3N0ZWRab25lLmhvc3RlZFpvbmVJZC5yZXBsYWNlKC9eXFwvaG9zdGVkem9uZVxcLy8sICcnKTtcbiAgICB0aGlzLnRhZ3MgPSBuZXcgY2RrLlRhZ01hbmFnZXIoY2RrLlRhZ1R5cGUuTUFQLCAnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJyk7XG5cbiAgICBsZXQgY2VydGlmaWNhdGVUcmFuc3BhcmVuY3lMb2dnaW5nUHJlZmVyZW5jZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGlmIChwcm9wcy50cmFuc3BhcmVuY3lMb2dnaW5nRW5hYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlID0gcHJvcHMudHJhbnNwYXJlbmN5TG9nZ2luZ0VuYWJsZWQgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3RvckZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnQ2VydGlmaWNhdGVSZXF1ZXN0b3JGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLXBhY2thZ2VzJywgJ2Ruc192YWxpZGF0ZWRfY2VydGlmaWNhdGVfaGFuZGxlcicsICdsaWInKSksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguY2VydGlmaWNhdGVSZXF1ZXN0SGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICAgIHJvbGU6IHByb3BzLmN1c3RvbVJlc291cmNlUm9sZSxcbiAgICB9KTtcbiAgICByZXF1ZXN0b3JGdW5jdGlvbi5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydhY206UmVxdWVzdENlcnRpZmljYXRlJywgJ2FjbTpEZXNjcmliZUNlcnRpZmljYXRlJywgJ2FjbTpEZWxldGVDZXJ0aWZpY2F0ZScsICdhY206QWRkVGFnc1RvQ2VydGlmaWNhdGUnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuICAgIHJlcXVlc3RvckZ1bmN0aW9uLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3JvdXRlNTM6R2V0Q2hhbmdlJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgICByZXF1ZXN0b3JGdW5jdGlvbi5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydyb3V0ZTUzOmNoYW5nZVJlc291cmNlUmVjb3JkU2V0cyddLFxuICAgICAgcmVzb3VyY2VzOiBbYGFybjoke2Nkay5TdGFjay5vZihyZXF1ZXN0b3JGdW5jdGlvbikucGFydGl0aW9ufTpyb3V0ZTUzOjo6aG9zdGVkem9uZS8ke3RoaXMuaG9zdGVkWm9uZUlkfWBdLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0VxdWFscyc6IHtcbiAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNSZWNvcmRUeXBlcyc6IFsnQ05BTUUnXSxcbiAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNBY3Rpb25zJzogcHJvcHMuY2xlYW51cFJvdXRlNTNSZWNvcmRzID8gWydVUFNFUlQnLCAnREVMRVRFJ10gOiBbJ1VQU0VSVCddLFxuICAgICAgICB9LFxuICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0xpa2UnOiB7XG4gICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzTm9ybWFsaXplZFJlY29yZE5hbWVzJzogW1xuICAgICAgICAgICAgYWRkV2lsZGNhcmQocHJvcHMuZG9tYWluTmFtZSksXG4gICAgICAgICAgICAuLi4ocHJvcHMuc3ViamVjdEFsdGVybmF0aXZlTmFtZXMgPz8gW10pLm1hcChkID0+IGFkZFdpbGRjYXJkKGQpKSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG5ldyBjZGsuQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0NlcnRpZmljYXRlUmVxdWVzdG9yUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IHJlcXVlc3RvckZ1bmN0aW9uLmZ1bmN0aW9uQXJuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBEb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lLFxuICAgICAgICBTdWJqZWN0QWx0ZXJuYXRpdmVOYW1lczogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHByb3BzLnN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzIH0sIHsgb21pdEVtcHR5OiB0cnVlIH0pLFxuICAgICAgICBDZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlOiBjZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlLFxuICAgICAgICBIb3N0ZWRab25lSWQ6IHRoaXMuaG9zdGVkWm9uZUlkLFxuICAgICAgICBSZWdpb246IHByb3BzLnJlZ2lvbixcbiAgICAgICAgUm91dGU1M0VuZHBvaW50OiBwcm9wcy5yb3V0ZTUzRW5kcG9pbnQsXG4gICAgICAgIFJlbW92YWxQb2xpY3k6IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuX3JlbW92YWxQb2xpY3kgfSksXG4gICAgICAgIC8vIEN1c3RvbSByZXNvdXJjZXMgcHJvcGVydGllcyBhcmUgYWx3YXlzIGNvbnZlcnRlZCB0byBzdHJpbmdzOyBtaWdodCBhcyB3ZWxsIGJlIGV4cGxpY3QgaGVyZS5cbiAgICAgICAgQ2xlYW51cFJlY29yZHM6IHByb3BzLmNsZWFudXBSb3V0ZTUzUmVjb3JkcyA/ICd0cnVlJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgVGFnczogY2RrLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMudGFncy5yZW5kZXJUYWdzKCkgfSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jZXJ0aWZpY2F0ZUFybiA9IGNlcnRpZmljYXRlLmdldEF0dCgnQXJuJykudG9TdHJpbmcoKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSgpIH0pO1xuICB9XG5cbiAgcHVibGljIGFwcGx5UmVtb3ZhbFBvbGljeShwb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5KTogdm9pZCB7XG4gICAgdGhpcy5fcmVtb3ZhbFBvbGljeSA9IHBvbGljeTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8vIEVuc3VyZSB0aGUgem9uZSBuYW1lIGlzIGEgcGFyZW50IHpvbmUgb2YgdGhlIGNlcnRpZmljYXRlIGRvbWFpbiBuYW1lXG4gICAgaWYgKCFjZGsuVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMubm9ybWFsaXplZFpvbmVOYW1lKSAmJlxuICAgICAgdGhpcy5kb21haW5OYW1lICE9PSB0aGlzLm5vcm1hbGl6ZWRab25lTmFtZSAmJlxuICAgICAgIXRoaXMuZG9tYWluTmFtZS5lbmRzV2l0aCgnLicgKyB0aGlzLm5vcm1hbGl6ZWRab25lTmFtZSkpIHtcbiAgICAgIGVycm9ycy5wdXNoKGBETlMgem9uZSAke3RoaXMubm9ybWFsaXplZFpvbmVOYW1lfSBpcyBub3QgYXV0aG9yaXRhdGl2ZSBmb3IgY2VydGlmaWNhdGUgZG9tYWluIG5hbWUgJHt0aGlzLmRvbWFpbk5hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cbn1cblxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL1JvdXRlNTMvbGF0ZXN0L0RldmVsb3Blckd1aWRlL3NwZWNpZnlpbmctcnJzZXQtY29uZGl0aW9ucy5odG1sXG5mdW5jdGlvbiBhZGRXaWxkY2FyZChkb21haW5OYW1lOiBzdHJpbmcpIHtcbiAgaWYgKGRvbWFpbk5hbWUuc3RhcnRzV2l0aCgnKi4nKSkge1xuICAgIHJldHVybiBkb21haW5OYW1lO1xuICB9XG4gIHJldHVybiBgKi4ke2RvbWFpbk5hbWV9YDtcbn1cbiJdfQ==