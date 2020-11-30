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
 * Interface which all CertificateAuthority based class must implement
 */
export abstract class CertificateAuthorityBase extends cdk.Resource implements ICertificateAuthority {
  /**
   * The Amazon Resource Name of the Certificate
   */
  public abstract readonly certificateAuthorityArn: string;
}

/**
 * Basic Properties of a Certificate
 */
export interface CertificateAuthorityProps {
  /**
   * The Amazon Resource Name of the Certificate
   */
  readonly certificateAuthorityArn: string;
}

/**
 * Defines a Certificate for ACMPCA
 *
 * @resource AWS::ACMPCA::CertificateAuthority
 */
export class CertificateAuthority extends CertificateAuthorityBase {
  /**
   * Import an existing Certificate given an ARN
   */
  public static fromCertificateAuthorityArn(scope: Construct, id: string, certificateAuthorityArn: string): ICertificateAuthority {
    return new class extends CertificateAuthorityBase {
      readonly certificateAuthorityArn = certificateAuthorityArn;
    }(scope, id);
  }
  /**
   * The Amazon Resource Name belonging to the Certificate
   */
  public readonly certificateAuthorityArn: string;

  constructor(scope: Construct, id: string, props: CertificateAuthorityProps) {
    super(scope, id, {
      physicalName: props.certificateAuthorityArn || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });
    this.certificateAuthorityArn = props.certificateAuthorityArn;
  }
}


