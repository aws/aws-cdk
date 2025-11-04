import { Construct } from 'constructs';
import { CfnSigningProfile } from './signer.generated';
import { Duration, FeatureFlags, IResource, Resource, Stack } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import * as cxapi from '../../cx-api';

// Feature flag is defined in cx-api

/**
 * Platforms that are allowed with signing config.
 * @see https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html
 */
export class Platform {
  /**
   * Specification of signature format and signing algorithms for AWS IoT Device.
   */
  public static readonly AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA = Platform.of('AWSIoTDeviceManagement-SHA256-ECDSA');

  /**
   * Specification of signature format and signing algorithms for AWS Lambda.
   */
  public static readonly AWS_LAMBDA_SHA384_ECDSA = Platform.of('AWSLambda-SHA384-ECDSA');

  /**
   * Specification of signature format and signing algorithms with
   * SHA1 hash and RSA encryption for Amazon FreeRTOS.
   */
  public static readonly AMAZON_FREE_RTOS_TI_CC3220SF = Platform.of('AmazonFreeRTOS-TI-CC3220SF');

  /**
   * Specification of signature format and signing algorithms with
   * SHA256 hash and ECDSA encryption for Amazon FreeRTOS.
   */
  public static readonly AMAZON_FREE_RTOS_DEFAULT = Platform.of('AmazonFreeRTOS-Default');

  /**
   * Specification of signature format and signing algorithms with
   * SHA256 hash and ECDSA encryption for container registries with notation.
   */
  public static readonly NOTATION_OCI_SHA384_ECDSA = Platform.of('Notation-OCI-SHA384-ECDSA');

  /**
   * Custom signing profile platform.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
   *
   * @param platformId - The id of signing platform.
   */
  public static of(platformId: string): Platform {
    return new Platform(platformId);
  }

  /**
   *
   * @param platformId - The id of signing platform.
   */
  private constructor(public readonly platformId: string) {
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
   * @attribute ProfileName
   */
  readonly signingProfileName: string;

  /**
   * The version of signing profile.
   * @attribute ProfileVersion
   */
  readonly signingProfileVersion: string;

  /**
   * The ARN of signing profile version.
   * @attribute ProfileVersionArn
   */
  readonly signingProfileVersionArn: string;
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
  readonly signatureValidity?: Duration;

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
  readonly signingProfileName: string;

  /**
   * The version of signing profile.
   */
  readonly signingProfileVersion: string;
}

/**
 * Defines a Signing Profile.
 *
 * @resource AWS::Signer::SigningProfile
 */
@propertyInjectable
export class SigningProfile extends Resource implements ISigningProfile {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-signer.SigningProfile';

  /**
   * Creates a Signing Profile construct that represents an external Signing Profile.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `SigningProfileAttributes` object.
   */
  public static fromSigningProfileAttributes(scope: Construct, id: string, attrs: SigningProfileAttributes): ISigningProfile {
    class Import extends Resource implements ISigningProfile {
      public readonly signingProfileArn: string;
      public readonly signingProfileName = attrs.signingProfileName;
      public readonly signingProfileVersion = attrs.signingProfileVersion;
      public readonly signingProfileVersionArn: string;

      constructor(signingProfileArn: string, signingProfileProfileVersionArn: string) {
        super(scope, id);
        this.signingProfileArn = signingProfileArn;
        this.signingProfileVersionArn = signingProfileProfileVersionArn;
      }
    }
    const signingProfileArn = Stack.of(scope).formatArn({
      service: 'signer',
      resource: '',
      resourceName: `/signing-profiles/${attrs.signingProfileName}`,
    });
    const SigningProfileVersionArn = Stack.of(scope).formatArn({
      service: 'signer',
      resource: '',
      resourceName: `/signing-profiles/${attrs.signingProfileName}/${attrs.signingProfileVersion}`,
    });
    return new Import(signingProfileArn, SigningProfileVersionArn);
  }

  public readonly signingProfileArn: string;
  public readonly signingProfileName: string;
  public readonly signingProfileVersion: string;
  public readonly signingProfileVersionArn: string;

  constructor(scope: Construct, id: string, props: SigningProfileProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const useProfileNameInCfn = FeatureFlags.of(this).isEnabled(cxapi.SIGNER_PROFILE_NAME_PASSED_TO_CFN);

    const resource = new CfnSigningProfile(this, 'Resource', {
      platformId: props.platform.platformId,
      profileName: useProfileNameInCfn ? props.signingProfileName : undefined,
      signatureValidityPeriod: props.signatureValidity ? {
        type: 'DAYS',
        value: props.signatureValidity?.toDays(),
      } : {
        type: 'MONTHS',
        value: 135,
      },
    });

    this.signingProfileArn = resource.attrArn;
    this.signingProfileName = resource.attrProfileName;
    this.signingProfileVersion = resource.attrProfileVersion;
    this.signingProfileVersionArn = resource.attrProfileVersionArn;
  }
}
