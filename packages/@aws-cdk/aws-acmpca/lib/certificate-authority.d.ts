import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Interface which all CertificateAuthority based class must implement
 */
export interface ICertificateAuthority extends cdk.IResource {
    /**
     * The Amazon Resource Name of the Certificate
     *
     * @attribute
     */
    readonly certificateAuthorityArn: string;
}
/**
 * Defines a Certificate for ACMPCA
 *
 * @resource AWS::ACMPCA::CertificateAuthority
 */
export declare class CertificateAuthority {
    /**
     * Import an existing Certificate given an ARN
     */
    static fromCertificateAuthorityArn(scope: Construct, id: string, certificateAuthorityArn: string): ICertificateAuthority;
    private constructor();
}
