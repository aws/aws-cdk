import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Platforms that are allowed with signing config.
 * @see https://docs.aws.amazon.com/signer/latest/developerguide/gs-platform.html
 */
export declare class Platform {
    /**
     * Specification of signature format and signing algorithms for AWS IoT Device.
     */
    static readonly AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA: Platform;
    /**
     * Specification of signature format and signing algorithms for AWS Lambda.
     */
    static readonly AWS_LAMBDA_SHA384_ECDSA: Platform;
    /**
     * Specification of signature format and signing algorithms with
     * SHA1 hash and RSA encryption for Amazon FreeRTOS.
     */
    static readonly AMAZON_FREE_RTOS_TI_CC3220SF: Platform;
    /**
     * Specification of signature format and signing algorithms with
     * SHA256 hash and ECDSA encryption for Amazon FreeRTOS.
     */
    static readonly AMAZON_FREE_RTOS_DEFAULT: Platform;
    /**
     * The id of signing platform.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-signer-signingprofile.html#cfn-signer-signingprofile-platformid
     */
    readonly platformId: string;
    private constructor();
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
export declare class SigningProfile extends Resource implements ISigningProfile {
    /**
     * Creates a Signing Profile construct that represents an external Signing Profile.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs A `SigningProfileAttributes` object.
     */
    static fromSigningProfileAttributes(scope: Construct, id: string, attrs: SigningProfileAttributes): ISigningProfile;
    readonly signingProfileArn: string;
    readonly signingProfileName: string;
    readonly signingProfileVersion: string;
    readonly signingProfileVersionArn: string;
    constructor(scope: Construct, id: string, props: SigningProfileProps);
}
