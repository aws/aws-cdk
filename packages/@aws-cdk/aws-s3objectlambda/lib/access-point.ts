import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnAccessPoint } from './s3objectlambda.generated';

/**
 * The interface that represents the AccessPoint resource.
 */
export interface IAccessPoint extends core.IResource {
  /**
   * The ARN of the access point.
   * @attribute
   */
  readonly accessPointArn: string;

  /**
   * The creation data of the access point.
   * @attribute
   */
  readonly accessPointCreationDate: string;

  /**
   * The IPv4 DNS name of the access point.
   */
  readonly domainName: string;

  /**
   * The regional domain name of the access point.
   */
  readonly regionalDomainName: string;

  /**
   * The virtual hosted-style URL of an S3 object through this access point.
   * Specify `regional: false` at the options for non-regional URL.
   * @param key The S3 key of the object. If not specified, the URL of the
   *      bucket is returned.
   * @param options Options for generating URL.
   * @returns an ObjectS3Url token
   */
  virtualHostedUrlForObject(key?: string, options?: s3.VirtualHostedStyleUrlOptions): string;
}

/**
  * The S3 object lambda access point configuration.
  */
export interface AccessPointProps {
  /**
   * The bucket to which this access point belongs.
   */
  readonly bucket: s3.IBucket;

  /**
   * The Lambda function used to transform objects.
   */
  readonly handler: lambda.IFunction;

  /**
   * The name of the S3 object lambda access point.
   *
   * @default a unique name will be generated
   */
  readonly accessPointName?: string;

  /**
   * Whether CloudWatch metrics are enabled for the access point.
   *
   * @default false
   */
  readonly cloudWatchMetricsEnabled?: boolean;

  /**
   * Whether the Lambda function can process `GetObject-Range` requests.
   *
   * @default false
   */
  readonly supportsGetObjectRange?: boolean;

  /**
   * Whether the Lambda function can process `GetObject-PartNumber` requests.
   *
   * @default false
   */
  readonly supportsGetObjectPartNumber?: boolean;

  /**
   * Additional JSON that provides supplemental data passed to the
   * Lambda function on every request.
   *
   * @default - No data.
   */
  readonly payload?: { [key: string]: any };
}

abstract class AccessPointBase extends core.Resource implements IAccessPoint {
  public abstract readonly accessPointArn: string;
  public abstract readonly accessPointCreationDate: string;
  public abstract readonly accessPointName: string;

  /** Implement the `IAccessPoint.domainName` field. */
  get domainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    return `${this.accessPointName}-${this.env.account}.s3-object-lambda.${urlSuffix}`;
  }

  /** Implement the `IAccessPoint.regionalDomainName` field. */
  get regionalDomainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    const region = this.env.region;
    return `${this.accessPointName}-${this.env.account}.s3-object-lambda.${region}.${urlSuffix}`;
  }

  /** Implement the `IAccessPoint.virtualHostedUrlForObject` method. */
  public virtualHostedUrlForObject(key?: string, options?: s3.VirtualHostedStyleUrlOptions): string {
    const domainName = options?.regional ?? true ? this.regionalDomainName : this.domainName;
    const prefix = `https://${domainName}`;
    if (!key) {
      return prefix;
    }
    if (key.startsWith('/')) {
      key = key.slice(1);
    }
    if (key.endsWith('/')) {
      key = key.slice(0, -1);
    }
    return `${prefix}/${key}`;
  }
}

/**
 * The access point resource attributes.
 */
export interface AccessPointAttributes {
  /**
   * The ARN of the access point.
   */
  readonly accessPointArn: string

  /**
   * The creation data of the access point.
   */
  readonly accessPointCreationDate: string;
}

/**
 * Checks the access point name against the rules in https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-access-points.html#access-points-names
 * @param name The name of the access point
 */
function validateAccessPointName(name: string): void {
  if (name.length < 3 || name.length > 50) {
    throw new Error('Access point name must be between 3 and 50 characters long');
  }
  if (name.endsWith('-s3alias')) {
    throw new Error('Access point name cannot end with the suffix -s3alias');
  }
  if (name[0] === '-' || name[name.length - 1] === '-') {
    throw new Error('Access point name cannot begin or end with a dash');
  }
  if (!/^[0-9a-z](.(?![\.A-Z_]))+[0-9a-z]$/.test(name)) {
    throw new Error('Access point name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods');
  }
}

/**
  * An S3 object lambda access point for intercepting and
  * transforming `GetObject` requests.
  */
export class AccessPoint extends AccessPointBase {
  /**
   * Reference an existing AccessPoint defined outside of the CDK code.
   */
  public static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint {
    const arn = core.Arn.split(attrs.accessPointArn, core.ArnFormat.SLASH_RESOURCE_NAME);
    if (!arn.resourceName) {
      throw new Error('Unable to parse acess point name');
    }
    const name = arn.resourceName;
    class Import extends AccessPointBase {
      public readonly accessPointArn: string = attrs.accessPointArn;
      public readonly accessPointCreationDate: string = attrs.accessPointCreationDate;
      public readonly accessPointName: string = name;
    }
    return new Import(scope, id);
  }

  /**
   * The ARN of the access point.
   */
  public readonly accessPointName: string

  /**
   * The ARN of the access point.
   * @attribute
   */
  public readonly accessPointArn: string

  /**
   * The creation data of the access point.
   * @attribute
   */
  public readonly accessPointCreationDate: string

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id, {
      physicalName: props.accessPointName,
    });

    if (props.accessPointName) {
      validateAccessPointName(props.accessPointName);
    }

    const supporting = new s3.CfnAccessPoint(this, 'SupportingAccessPoint', {
      bucket: props.bucket.bucketName,
    });

    const allowedFeatures = [];
    if (props.supportsGetObjectPartNumber) {
      allowedFeatures.push('GetObject-PartNumber');
    }
    if (props.supportsGetObjectRange) {
      allowedFeatures.push('GetObject-Range');
    }

    const accessPoint = new CfnAccessPoint(this, id, {
      name: this.physicalName,
      objectLambdaConfiguration: {
        allowedFeatures,
        cloudWatchMetricsEnabled: props.cloudWatchMetricsEnabled,
        supportingAccessPoint: supporting.attrArn,
        transformationConfigurations: [
          {
            actions: ['GetObject'],
            contentTransformation: {
              AwsLambda: {
                FunctionArn: props.handler.functionArn,
                FunctionPayload: props.payload ? JSON.stringify(props.payload) : undefined,
              },
            },
          },
        ],
      },
    });
    this.accessPointName = accessPoint.ref;
    this.accessPointArn = accessPoint.attrArn;
    this.accessPointCreationDate = accessPoint.attrCreationDate;

    props.handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3-object-lambda:WriteGetObjectResponse'],
        resources: ['*'],
      }),
    );
  }
}
