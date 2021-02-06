import { Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnSigningProfile } from './signer.generated';

/**
 * A Signer Profile
 */
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
  readonly signingProfileProfileName: string;

  /**
   * The version of signing profile.
   * @attribute
   */
  readonly signingProfileProfileVersion: string;

  /**
   * The ARN of signing profile version.
   * @attribute
   */
  readonly signingProfileProfileVersionArn: string;
}

/**
 * Construction properties for a Signing Profile object
 */
export interface SigningProfileProps {
  /**
   * The ID of a platform that is available for use by a signing profile.
   */
  readonly platformId: string;

  /**
   * The validity period override for any signature generated using
   * this signing profile. If unspecified, the default is 135 months.
   *
   * @default - 135 MONTHS
   */
  readonly signatureValidityPeriod?: Duration;

  /**
   * Physical name of this Signing Profile.
   *
   * @default - Assigned by CloudFormation (recommended).
   */
  readonly signingProfileName?: string;
}

/**
 * A reference to a Signing Profile
 */
export interface SigningProfileAttributes {
  /**
   * The name of signing profile.
   */
  readonly signingProfileProfileName: string;

  /**
   * The version of signing profile.
   */
  readonly signingProfileProfileVersion: string;
}

/**
 * Defines a Signing Profile.
 *
 * @resource AWS::Signer::SigningProfile
 */
export class SigningProfile extends Resource implements ISigningProfile {
  /**
   * Creates a Signing Profile construct that represents an external Signing Profile.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `SigningProfileAttributes` object.
   */
  public static fromSigningProfileAttributes( scope: Construct, id: string, attrs: SigningProfileAttributes): ISigningProfile {
    class Import extends Resource implements ISigningProfile {
      public readonly signingProfileArn: string;
      public readonly signingProfileProfileName = attrs.signingProfileProfileName;
      public readonly signingProfileProfileVersion = attrs.signingProfileProfileVersion;
      public readonly signingProfileProfileVersionArn: string;

      constructor(signingProfileArn: string, signingProfileProfileVersionArn: string) {
        super(scope, id);
        this.signingProfileArn = signingProfileArn;
        this.signingProfileProfileVersionArn = signingProfileProfileVersionArn;
      }
    }
    const signingProfileArn = Stack.of(scope).formatArn({
      service: 'signer',
      resource: '',
      resourceName: `/signing-profiles/${attrs.signingProfileProfileName}`,
    });
    const signingProfileProfileVersionArn = Stack.of(scope).formatArn({
      service: 'signer',
      resource: '',
      resourceName: `/signing-profiles/${attrs.signingProfileProfileName}/${attrs.signingProfileProfileVersion}`,
    });
    return new Import(signingProfileArn, signingProfileProfileVersionArn);
  }

  public readonly signingProfileArn: string;
  public readonly signingProfileProfileName: string;
  public readonly signingProfileProfileVersion: string;
  public readonly signingProfileProfileVersionArn: string;

  constructor(scope: Construct, id: string, props: SigningProfileProps) {
    super(scope, id, {
      physicalName: props.signingProfileName,
    });

    const resource = new CfnSigningProfile( this, 'Resource', {
      platformId: props.platformId,
      signatureValidityPeriod: props.signatureValidityPeriod ? {
        type: 'DAYS',
        value: props.signatureValidityPeriod?.toDays(),
      } : {
        type: 'MONTHS',
        value: 135,
      },
    } );

    this.signingProfileArn = resource.attrArn;
    this.signingProfileProfileName = resource.attrProfileName;
    this.signingProfileProfileVersion = resource.attrProfileVersion;
    this.signingProfileProfileVersionArn = resource.attrProfileVersionArn;
  }
}
