import { CustomResource } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Construct, Output } from '@aws-cdk/cdk';
import path = require('path');
import { CertificateImportProps, CertificateProps, ICertificate } from './certificate';

export interface DNSValidatedCertificateProps extends CertificateProps {
    /**
     * Route 53 Hosted Zone used to perform DNS validation of the request.  The zone
     * must be authoritative for the domain name specified in the Certificate Request.
     */
    hostedZone: IHostedZone;
}

/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 */
export class DNSValidatedCertificate extends Construct implements ICertificate {
    public readonly certificateArn: string;
    private normalizedZoneName: string;
    private hostedZoneId: string;
    private domainName: string;

    constructor(scope: Construct, id: string, props: DNSValidatedCertificateProps) {
        super(scope, id);

        this.domainName = props.domainName;
        this.normalizedZoneName = props.hostedZone.zoneName;
        // Remove trailing `.` from zone name
        if (this.normalizedZoneName.endsWith('.')) {
            this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
        }

        // Remove any `/hostedzone/` prefix from the Hosted Zone ID
        this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, '');

        const requestorFunction = new Function(this, 'CertificateRequestorFunction', {
            code: new AssetCode(path.join(__dirname, 'dns_validated_certificate_handler')),
            handler: 'index.certificateRequestHandler',
            runtime: Runtime.NodeJS810,
            timeout: 15 * 60 // 15 minutes
        });
        requestorFunction.addToRolePolicy(
            new PolicyStatement()
                .addActions('acm:RequestCertificate', 'acm:DescribeCertificate', 'acm:DeleteCertificate')
                .addResource('*')
        );
        requestorFunction.addToRolePolicy(
            new PolicyStatement()
                .addActions('route53:GetChange')
                .addResource('*')
        );
        requestorFunction.addToRolePolicy(
            new PolicyStatement()
                .addActions('route53:changeResourceRecordSets')
                .addResource(`arn:aws:route53:::hostedzone/${this.hostedZoneId}`)
        );

        const certificate = new CustomResource(this, 'CertificateRequestorResource', {
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
            certificateArn: new Output(this, 'Arn', { value: this.certificateArn }).makeImportValue().toString()
        };
    }

    public validate(): string[] {
        const errors: string[] = [];
        // Ensure the zone name is a parent zone of the certificate domain name
        if (!this.domainName.endsWith('.' + this.normalizedZoneName)) {
            errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.domainName}`);
        }
        return errors;
    }
}
