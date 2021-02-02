import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnSigningProfile } from './signer.generated';

export interface ISigningProfile extends IResource {
  /**
   * The ARN of the signing profile.
   * @attribute
   */
  readonly signingProfileArn: string;

  /**
   * The name of signing profile.
   * @attribute
   */
  readonly signingProfileName: string;

  /**
   * The version of signing profile.
   * @attribute
   */
  readonly signingProfileVersion: string;

  /**
   * The ARN of signing profile version.
   * @attribute
   */
  readonly signingProfileVersionArn: string;
}

export enum SignatureValidityPeriodTypes {
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

class SignatureValidityPeriodProperty {
  readonly type: SignatureValidityPeriodTypes;
  readonly value: number;

  constructor(type: SignatureValidityPeriodTypes, value: number) {
    this.type = type;
    this.value = value;
  }
}

export interface SigningProfileProps {
  /*
   * The ID of a platform that is available for use by a signing profile.
   */
  readonly platformId: string;

  /*
   * The validity period override for any signature generated using
   * this signing profile. If unspecified, the default is 135 months.
   */
  readonly signatureValidityPeriod?: SignatureValidityPeriodProperty;
}

export class SigningProfile extends Resource implements ISigningProfile {
  public readonly signingProfileArn: string;
  public readonly signingProfileName: string;
  public readonly signingProfileVersion: string;
  public readonly signingProfileVersionArn: string;

  constructor(scope: Construct, id: string, props: SigningProfileProps) {
    super(scope, id);

    const resource = new CfnSigningProfile( this, 'Resource', {
      platformId: props.platformId,
      signatureValidityPeriod: props.signatureValidityPeriod,
    } );

    this.signingProfileArn = resource.attrArn;
    this.signingProfileName = resource.attrProfileName;
    this.signingProfileVersion = resource.attrProfileVersion;
    this.signingProfileVersionArn = resource.attrProfileVersionArn;
  }
}
