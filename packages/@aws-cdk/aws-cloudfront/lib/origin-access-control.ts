import * as cdk from '@aws-cdk/core';
import { md5hash } from '@aws-cdk/core/lib/helpers-internal';
import { Construct } from 'constructs';
import { CfnOriginAccessControl } from './cloudfront.generated';

/**
 * AWS service for which CloudFront Origin Access Control should sign requests
 */
export enum OriginAccessControlOriginType {
  /**
   * AWS Elemental MediaStore
   */
  MEDIASTORE = 'mediastore',
  /**
   * Amazon S3
   */
  S3 = 's3',
}

/**
 * Configuration of when CloudFront Origin Access Control will sign requests
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#oac-advanced-settings
 */
export enum OriginAccessControlSigningBehavior {
  /**
   * Always sign requests, replacing any existing `Authorization` header
   */
  ALWAYS = 'always',
  /**
   * Never sign requests, effectively disabling Origin Access Control
   */
  NEVER = 'never',
  /**
   * Sign requests only if an `Authorization` header is not already set
   *
   * *WARNING: You must add the `Authorization` header to the [cache key](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) policy for all associated origins.*
   */
  NO_OVERRIDE = 'no-override',
}

/**
 * Signature protocol used by CloudFront Origin Access Control to sign requests
 */
export enum OriginAccessControlSigningProtocol {
  /**
   * SIGV4 is the only supported signature type at this time
   */
  SIGV4 = 'sigv4',
}

/**
 * Properties of CloudFront Origin Access Control
 */
export interface OriginAccessControlProps {
  /**
   * A name which uniquely identifies this Origin Access Control within your account
   *
   * @default - A unique name will be generated from the construct ID
   */
  readonly originAccessControlName?: string;

  /**
   * An optional description of this Origin Access Control
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * AWS service for which CloudFront Origin Access Control should sign requests
   */
  readonly originType: OriginAccessControlOriginType;

  /**
   * Configuration of when CloudFront Origin Access Control will sign requests
   *
   * @default OriginAccessControlSigningBehavior.ALWAYS
   */
  readonly signingBehavior?: OriginAccessControlSigningBehavior;

  /**
   * Signature protocol used by CloudFront Origin Access Control to sign requests
   *
   * @default OriginAccessControlSigningProtocol.SIGV4
   */
  readonly signingProtocol?: OriginAccessControlSigningProtocol;
}

/**
 * Interface for CloudFront Origin Access Control
 */
export interface IOriginAccessControl extends cdk.IResource {
  /**
   * The Origin Access Control ID (Physical ID in CloudFormation)
   *
   * @attribute
   */
  readonly originAccessControlId: string;
}

/**
 * An Origin Access Control is a set of parameters used to control how CloudFront
 * distributions authenticate requests to the origin. This functionality replaces
 * the older Origin Access Identity authentication feature.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-origin.html
 *
 * @resource AWS::CloudFront::OriginAccessControl
 */
export class OriginAccessControl extends cdk.Resource implements IOriginAccessControl {
  /**
   * Imports an existing Origin Access Control by ID
   */
  public static fromOriginAccessControlId(
    scope: Construct,
    id: string,
    originAccessControlId: string): IOriginAccessControl {

    class Import extends cdk.Resource implements IOriginAccessControl {
      public readonly originAccessControlId: string;
      constructor(s: Construct, i: string, oacId: string) {
        super(s, i, { physicalName: oacId });
        this.originAccessControlId = oacId;
      }
    }

    return new Import(scope, id, originAccessControlId);
  }

  /**
   * Creates an Origin Access Control which signs Amazon S3 requests. If no
   * logical construct ID is specified, this will create and manage a singleton
   * Origin Access Control within the stack which has suitable default values
   * for accessing S3 buckets.
   */
  public static fromS3Defaults(
    scope: Construct,
    id?: string,
    behaviorOverride?: OriginAccessControlSigningBehavior): IOriginAccessControl {

    const props = {
      originType: OriginAccessControlOriginType.S3,
      signingBehavior: behaviorOverride,
    };
    if (id === undefined) {
      return OriginAccessControl.fromSingleton(cdk.Stack.of(scope), props);
    } else {
      return new OriginAccessControl(scope, id, props);
    }
  }

  /**
   * Creates an Origin Access Control which signs MediaStore requests. If no
   * logical construct ID is specified, this will create and manage a singleton
   * Origin Access Control within the stack which has suitable default values
   * for accessing MediaStore origins.
   */
  public static fromMediaStoreDefaults(
    scope: Construct,
    id?: string,
    behaviorOverride?: OriginAccessControlSigningBehavior): IOriginAccessControl {

    const props = {
      originType: OriginAccessControlOriginType.MEDIASTORE,
      signingBehavior: behaviorOverride,
    };
    if (id === undefined) {
      return OriginAccessControl.fromSingleton(cdk.Stack.of(scope), props);
    } else {
      return new OriginAccessControl(scope, id, props);
    }
  }

  /**
   * Creates or returns an existing Origin Access Control in the target stack
   * which matches the given properties. The CDK construct id and CloudFormation
   * physical id are both derived from a hash of the properties.
   */
  public static fromSingleton(stack: cdk.Stack, props: OriginAccessControlProps) {
    props = OriginAccessControl.assignDefaultValues(props);
    const hash = md5hash(`OACStackSingleton-${props.originType}-${props.signingProtocol}-${props.signingBehavior}`);
    const id = `OriginAccessControl${hash.toUpperCase()}`;
    const existing = stack.node.tryFindChild(id);
    if (existing) {
      return existing as OriginAccessControl;
    }
    return new OriginAccessControl(stack, id, props);
  }

  private static assignDefaultValues(props: OriginAccessControlProps): OriginAccessControlProps {
    const ret = { ...props };
    ret.signingBehavior = ret.signingBehavior ?? OriginAccessControlSigningBehavior.ALWAYS;
    ret.signingProtocol = ret.signingProtocol ?? OriginAccessControlSigningProtocol.SIGV4;
    return ret;
  }

  /**
   * The Origin Access Control Id
   *
   * @attribute
   */
  public readonly originAccessControlId: string;

  /**
   * CDK L1 resource
   */
  private readonly resource: CfnOriginAccessControl;

  constructor(scope: Construct, id: string, props: OriginAccessControlProps) {
    super(scope, id, { physicalName: props.originAccessControlName });

    props = OriginAccessControl.assignDefaultValues(props);

    this.resource = new CfnOriginAccessControl(this, 'Resource', {
      originAccessControlConfig: {
        name: props.originAccessControlName ?? cdk.Names.uniqueResourceName(this, { maxLength: 64 }),
        description: props.description,
        originAccessControlOriginType: props.originType,
        signingBehavior: props.signingBehavior!,
        signingProtocol: props.signingProtocol!,
      },
    });
    this.originAccessControlId = this.getResourceNameAttribute(this.resource.ref);
  }
}
