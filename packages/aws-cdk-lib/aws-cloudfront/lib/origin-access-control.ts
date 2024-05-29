import { Construct } from 'constructs';
import { CfnOriginAccessControl } from './cloudfront.generated';
import { IResource, Resource, Stack, Names } from '../../core';
/**
 * Interface for CloudFront origin access controls
 */
// extends iam.IGrantable??
export interface IOriginAccessControl extends IResource {
  /**
   * The unique identifier of the origin access control.
   * @attribute
   */
  readonly originAccessControlId: string;
}

abstract class OriginAccessControlBase extends Resource implements IOriginAccessControl {
  public abstract readonly originAccessControlId: string;
}

/**
 * Properties for creating a OriginAccessControl resource.
 */
export interface OriginAccessControlProps {
  /**
   * A description of the origin access control.
   * @default - no description
   */
  readonly description?: string;
  /**
   * A name to identify the origin access control. You can specify up to 64 characters.
   * @default - a generated name
   */
  readonly originAccessControlName?: string;
  /**
   * The type of origin that this origin access control is for.
   * @default s3
   */
  readonly originAccessControlOriginType?: OriginAccessControlOriginType;
  /**
   * Specifies which requests CloudFront signs.
   * @default always
   */
  readonly signingBehavior?: SigningBehavior;
  /**
   * The signing protocol of the origin access control.
   * @default sigv4
   */
  readonly signingProtocol?: SigningProtocol;
}

/**
 * Origin types supported by origin access control.
 */
export enum OriginAccessControlOriginType {
  /**
   * Uses an Amazon S3 bucket origin.
   */
  S3 = 's3',
  /**
   * Uses an AWS Elemental MediaStore origin.
   */
  MEDIASTORE = 'mediastore',
  /**
   * Uses a Lambda function URL origin.
   */
  LAMBDA = 'lambda',
  /**
   * Uses an AWS Elemental MediaPackage v2 origin.
   */
  MEDIAPACKAGEV2 = 'mediapackagev2',
}

/**
 * Options for which requests CloudFront signs.
 * Specify `always` for the most common use case.
 */
export enum SigningBehavior {
  /**
   * Sign all origin requests, overwriting the Authorization header
   * from the viewer request if one exists.
   */
  ALWAYS = 'always',
  /**
   * Do not sign any origin requests.
   * This value turns off origin access control for all origins in all
   * distributions that use this origin access control.
   */
  NEVER = 'never',
  /**
   * Sign origin requests only if the viewer request
   * doesn't contain the Authorization header.
   */
  NO_OVERRIDE = 'no-override',
}

/**
 * The signing protocol of the origin access control.
 */
export enum SigningProtocol {
  /**
   * The AWS Signature Version 4 signing protocol.
   */
  SIGV4 = 'sigv4',
}

/**
 * An Origin Access Control.
 * @resource AWS::CloudFront::OriginAccessControl
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export class OriginAccessControl extends OriginAccessControlBase {
  /**
   * Imports an origin access control from its id.
   */
  public static fromOriginAccessControlId(scope: Construct, id: string, originAccessControlId: string): IOriginAccessControl {
    class Import extends OriginAccessControlBase {
      public readonly originAccessControlId = originAccessControlId;
      constructor(s: Construct, i: string) {
        super(s, i);

        this.originAccessControlId = originAccessControlId;
      }
    }
    return new Import(scope, id);
  }

  public readonly originAccessControlId: string;
  constructor(scope: Construct, id: string, props: OriginAccessControlProps = {}) {
    super(scope, id);

    const resource = new CfnOriginAccessControl(this, 'Resource', {
      originAccessControlConfig: {
        description: props.description,
        name: props.originAccessControlName ?? this.generateName(),
        signingBehavior: props.signingBehavior ?? SigningBehavior.ALWAYS,
        signingProtocol: props.signingProtocol ?? SigningProtocol.SIGV4,
        originAccessControlOriginType: props.originAccessControlOriginType ?? OriginAccessControlOriginType.S3,
      },
    });

    this.originAccessControlId = resource.attrId;
  }

  private generateName(): string {
    const name = Stack.of(this).region + Names.uniqueId(this);
    if (name.length > 64) {
      return name.substring(0, 32) + name.substring(name.length - 32);
    }
    return name;
  }

}