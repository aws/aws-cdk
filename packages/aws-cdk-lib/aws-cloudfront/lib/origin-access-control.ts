import { Construct } from 'constructs';
import { CfnOriginAccessControl } from './cloudfront.generated';
import { IResource, Resource, Names } from '../../core';

/**
 * Represents a CloudFront Origin Access Control
 */
export interface IOriginAccessControl extends IResource {
  /**
   * The unique identifier of the origin access control.
   * @attribute
   */
  readonly originAccessControlId: string;
}

/**
 * Common properties for creating a Origin Access Control resource.
 */
export interface OriginAccessControlBaseProps {
  /**
   * A description of the origin access control.
   *
   * @default - no description
   */
  readonly description?: string;
  /**
   * A name to identify the origin access control, with a maximum length of 64 characters.
   *
   * @default - a generated name
   */
  readonly originAccessControlName?: string;
  /**
   * Specifies which requests CloudFront signs and the signing protocol.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-originaccesscontrol-originaccesscontrolconfig.html#cfn-cloudfront-originaccesscontrol-originaccesscontrolconfig-signingbehavior
   *
   * @default SIGV4_ALWAYS
   */
  readonly signing?: Signing;
}

/**
 * The level of permissions granted to the CloudFront Distribution when configuring OAC
 */
export enum AccessLevel {
  /**
   * Grants read permissions to CloudFront Distribution
   */
  READ = 'READ',
  /**
   * Grants write permission to CloudFront Distribution
   */
  WRITE = 'WRITE',
  /**
   * Grants delete permission to CloudFront Distribution
   */
  DELETE = 'DELETE',
}

/**
 * Properties for creating a S3 Origin Access Control resource.
 */
export interface S3OriginAccessControlProps extends OriginAccessControlBaseProps { }

/**
 * Properties for creating a Lambda Function URL Origin Access Control resource.
 */
export interface FunctionUrlOriginAccessControlProps extends OriginAccessControlBaseProps { }

/**
 * Origin types supported by Origin Access Control.
 */
export enum OriginAccessControlOriginType {
  /**
   * Uses an Amazon S3 bucket origin.
   */
  S3 = 's3',
  /**
   * Uses a Lambda function URL origin.
   */
  LAMBDA = 'lambda',
  /**
   * Uses an AWS Elemental MediaStore origin.
   */
  MEDIASTORE = 'mediastore',
  /**
   * Uses an AWS Elemental MediaPackage v2 origin.
   */
  MEDIAPACKAGEV2 = 'mediapackagev2',
}

/**
 * Options for which requests CloudFront signs.
 * The recommended setting is `always`.
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
 * The signing protocol of the Origin Access Control.
 */
export enum SigningProtocol {
  /**
   * The AWS Signature Version 4 signing protocol.
   */
  SIGV4 = 'sigv4',
}

/**
 * Options for how CloudFront signs requests.
 */
export class Signing {
  /**
   * Sign all origin requests using the AWS Signature Version 4 signing protocol.
   */
  public static readonly SIGV4_ALWAYS = new Signing(SigningProtocol.SIGV4, SigningBehavior.ALWAYS);

  /**
   * Sign only if the viewer request doesn't contain the Authorization header
   * using the AWS Signature Version 4 signing protocol.
   */
  public static readonly SIGV4_NO_OVERRIDE = new Signing(SigningProtocol.SIGV4, SigningBehavior.NO_OVERRIDE);

  /**
   * Do not sign any origin requests.
   */
  public static readonly NEVER = new Signing(SigningProtocol.SIGV4, SigningBehavior.NEVER);

  /**
   * The signing protocol
   */
  public readonly protocol: SigningProtocol;

  /**
   * Which requests CloudFront signs.
   */
  public readonly behavior: SigningBehavior;

  public constructor(protocol: SigningProtocol, behavior: SigningBehavior) {
    this.protocol = protocol;
    this.behavior = behavior;
  }
}

/**
 * An Origin Access Control.
 * @internal
 */
export abstract class OriginAccessControlBase extends Resource implements IOriginAccessControl {
  /**
   * The Id of the origin access control
   * @attribute
   */
  public abstract readonly originAccessControlId: string;
}

/**
 * An Origin Access Control for Amazon S3 origins.
 * @resource AWS::CloudFront::OriginAccessControl
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export class S3OriginAccessControl extends OriginAccessControlBase {
  /**
   * Imports an S3 origin access control from its id.
   */
  public static fromOriginAccessControlId(scope: Construct, id: string, originAccessControlId: string): IOriginAccessControl {
    class Import extends Resource implements IOriginAccessControl {
      public readonly originAccessControlId = originAccessControlId;
      public readonly originAccessControlOriginType = OriginAccessControlOriginType.S3;
    }
    return new Import(scope, id);
  }

  /**
   * The unique identifier of this Origin Access Control.
   * @attribute
   */
  public readonly originAccessControlId: string;

  constructor(scope: Construct, id: string, props: S3OriginAccessControlProps = {}) {
    super(scope, id);

    const resource = new CfnOriginAccessControl(this, 'Resource', {
      originAccessControlConfig: {
        description: props.description,
        name: props.originAccessControlName ?? Names.uniqueResourceName(this, {
          maxLength: 64,
        }),
        signingBehavior: props.signing?.behavior ?? SigningBehavior.ALWAYS,
        signingProtocol: props.signing?.protocol ?? SigningProtocol.SIGV4,
        originAccessControlOriginType: OriginAccessControlOriginType.S3,
      },
    });

    this.originAccessControlId = resource.attrId;
  }
}

/**
 * An Origin Access Control for Lambda Function URLs.
 * @resource AWS::CloudFront::OriginAccessControl
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-originaccesscontrol.html
 */
export class FunctionUrlOriginAccessControl extends OriginAccessControlBase {
  /**
   * Imports a Lambda Function URL origin access control from its id.
   */
  public static fromOriginAccessControlId(scope: Construct, id: string, originAccessControlId: string): IOriginAccessControl {
    class Import extends Resource implements IOriginAccessControl {
      public readonly originAccessControlId = originAccessControlId;
      public readonly originAccessControlOriginType = OriginAccessControlOriginType.LAMBDA;
    }
    return new Import(scope, id);
  }

  /**
   * The unique identifier of this Origin Access Control.
   * @attribute
   */
  public readonly originAccessControlId: string;

  constructor(scope: Construct, id: string, props: FunctionUrlOriginAccessControlProps = {}) {
    super(scope, id);

    const resource = new CfnOriginAccessControl(this, 'Resource', {
      originAccessControlConfig: {
        description: props.description,
        name: props.originAccessControlName ?? Names.uniqueResourceName(this, { maxLength: 64 }),
        signingBehavior: props.signing?.behavior ?? SigningBehavior.ALWAYS,
        signingProtocol: props.signing?.protocol ?? SigningProtocol.SIGV4,
        originAccessControlOriginType: OriginAccessControlOriginType.LAMBDA, // Lambda specific OAC
      },
    });

    this.originAccessControlId = resource.attrId;
  }
}
