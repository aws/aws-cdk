import * as acm from '@aws-cdk/aws-certificatemanager';
/**
 * A certificate source for an ELBv2 listener
 */
export interface IListenerCertificate {
    /**
     * The ARN of the certificate to use
     */
    readonly certificateArn: string;
}
/**
 * A certificate source for an ELBv2 listener
 */
export declare class ListenerCertificate implements IListenerCertificate {
    /**
     * Use an ACM certificate as a listener certificate
     */
    static fromCertificateManager(acmCertificate: acm.ICertificate): ListenerCertificate;
    /**
     * Use any certificate, identified by its ARN, as a listener certificate
     */
    static fromArn(certificateArn: string): ListenerCertificate;
    /**
     * The ARN of the certificate to use
     */
    readonly certificateArn: string;
    protected constructor(certificateArn: string);
}
