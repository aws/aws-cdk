import { Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnSigningProfile } from './signer.generated';

/**
 * Platforms that are allowed with signing config.
 * @see https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html
 */
export class Platform {
  /**
   * Specification of signature format and signing algorithms for AWS IoT Device.
   */
  public static readonly AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA = new Platform('AWSIoTDeviceManagement-SHA256-ECDSA');

  /**
   * Specification of signature format and signing algorithms for AWS Lambda.
   */
  public static readonly AWS_LAMBDA_SHA384_ECDSA = new Platform('AWSLambda-SHA384-ECDSA');

  /**
   * Specification of signature format and signing algorithms with
   * SHA1 hash and RSA encryption for Amazon FreeRTOS.
   */
  public static readonly AMAZON_FREE_RTOS_TI_CC3220SF = new Platform('AmazonFreeRTOS-TI-CC3220SF');

  /**
   * Specification of signature format and signing algorithms with
   * SHA256 hash and ECDSA encryption for Amazon FreeRTOS.
   */
  public static readonly AMAZON_FREE_RTOS_DEFAULT = new Platform('AmazonFreeRTOS-Default');

  /**
   * The id of signing platform.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
   */
  public readonly platformId: string;

  private constructor(platformId: string) {
    this.platformId = platformId;
  }
}

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
   * The Signing Platform available for signing profile.
   * @see https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html
   */
  readonly platform: Platform;

  /**
   * The validity period for signatures generated using
   * this signing profile.
   *
   * @default - 135 months
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
      platformId: props.platform.platformId,
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
