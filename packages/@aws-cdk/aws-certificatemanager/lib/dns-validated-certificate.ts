import cfn = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import { CertificateImportProps, CertificateProps, ICertificate } from './certificate';

export interface DnsValidatedCertificateProps extends CertificateProps {
    /**
     * Route 53 Hosted Zone used to perform DNS validation of the request.  The zone
     * must be authoritative for the domain name specified in the Certificate Request.
     */
    readonly hostedZone: route53.IHostedZone;
}

/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 */
export class DnsValidatedCertificate extends cdk.Construct implements ICertificate {
    public readonly certificateArn: string;
    private normalizedZoneName: string;
    private hostedZoneId: string;
    private domainName: string;

    constructor(scope: cdk.Construct, id: string, props: DnsValidatedCertificateProps) {
        super(scope, id);

        this.domainName = props.domainName;
        this.normalizedZoneName = props.hostedZone.zoneName;
        // Remove trailing `.` from zone name
        if (this.normalizedZoneName.endsWith('.')) {
            this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
        }

        // Remove any `/hostedzone/` prefix from the Hosted Zone ID
        this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, '');

        const requestorFunction = new lambda.Function(this, 'CertificateRequestorFunction', {
            code: lambda.Code.asset(path.resolve(__dirname, '..', 'lambda-packages', 'dns_validated_certificate_handler', 'lib')),
            handler: 'index.certificateRequestHandler',
            runtime: lambda.Runtime.NodeJS810,
            timeout: 15 * 60 // 15 minutes
        });
        requestorFunction.addToRolePolicy(
            new iam.PolicyStatement()
                .addActions('acm:RequestCertificate', 'acm:DescribeCertificate', 'acm:DeleteCertificate')
                .addResource('*')
        );
        requestorFunction.addToRolePolicy(
            new iam.PolicyStatement()
                .addActions('route53:GetChange')
                .addResource('*')
        );
        requestorFunction.addToRolePolicy(
            new iam.PolicyStatement()
                .addActions('route53:changeResourceRecordSets')
                .addResource(`arn:aws:route53:::hostedzone/${this.hostedZoneId}`)
        );

        const certificate = new cfn.CustomResource(this, 'CertificateRequestorResource', {
            lambdaProvider: requestorFunction,
            properties: {
                DomainName: props.domainName,
                SubjectAlternativeNames: props.subjectAlternativeNames,
                HostedZoneId: this.hostedZoneId
            }
        });

        this.certificateArn = certificate.getAtt('Arn').toString();
    }

    /**
     * Export this certificate from the stack
     */
    public export(): CertificateImportProps {
        return {
            certificateArn: new cdk.CfnOutput(this, 'Arn', { value: this.certificateArn }).makeImportValue().toString()
        };
    }

    protected validate(): string[] {
        const errors: string[] = [];
        // Ensure the zone name is a parent zone of the certificate domain name
        if (this.domainName !== this.normalizedZoneName && !this.domainName.endsWith('.' + this.normalizedZoneName)) {
            errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.domainName}`);
        }
        return errors;
    }
}
