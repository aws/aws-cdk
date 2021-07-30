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
  readonly accessPointArn: string

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
  * Creates an S3 Object Lambda Access Point, which can intercept
  * and transform `GetObject` requests.
  *
  * @param fn The Lambda function
  * @param props Configuration for this Access Point
  */
export interface AccessPointProps {
  /**
   * The bucket to which this access point belongs.
   */
  readonly bucket: s3.IBucket

  /**
   * The Lambda function used to transform objects.
   */
  readonly fn: lambda.IFunction

  /**
   * The name of the access point access point.
   */
  readonly accessPointName: string

  /**
   * Whether CloudWatch metrics are enabled for the access point.
   *
   * @default false
   */
  readonly cloudWatchMetricsEnabled?: boolean

  /**
   * Whether the Lambda function can process `GetObject-Range` requests.
   *
   * @default false
   */
  readonly supportsGetObjectRange?: boolean

  /**
   * Whether the Lambda function can process `GetObject-PartNumber` requests.
   *
   * @default false
   */
  readonly supportsGetObjectPartNumber?: boolean

  /**
   * Additional JSON that provides supplemental data passed to the
   * Lambda function on every request.
   *
   * @default - No data.
   */
  readonly payload?: string
}

abstract class AccessPointBase extends core.Resource implements IAccessPoint {
  public abstract readonly accessPointArn: string
  public abstract readonly accessPointCreationDate: string

  protected abstract readonly name: string;

  /** Implement the {@link IAccessPoint.domainName} field. */
  get domainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    return `${this.name}-${this.stack.account}.s3-object-lambda.${urlSuffix}`;
  }

  /** Implement the {@link IAccessPoint.regionalDomainName} field. */
  get regionalDomainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    const region = this.stack.region;
    return `${this.name}-${this.stack.account}.s3-object-lambda.${region}.${urlSuffix}`;
  }

  /** Implement the {@link IAccessPoint.virtualHostedUrlForObject} method. */
  public virtualHostedUrlForObject(key?: string, options?: s3.VirtualHostedStyleUrlOptions): string {
    const domainName = options?.regional ?? true ? this.regionalDomainName : this.domainName;
    const prefix = `https://${domainName}`;
    if (typeof key !== 'string') {
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
  * An S3 Object Lambda Access Point for intercepting and
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
      protected name: string = name;
    }
    return new Import(scope, id);
  }

  private readonly accessPoint: CfnAccessPoint
  protected readonly name: string

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
    super(scope, id);

    const supporting = new s3.CfnAccessPoint(this, 'AccessPoint', {
      bucket: props.bucket.bucketName,
    });
    supporting.addPropertyOverride('Name', `${props.accessPointName}-access-point`);

    const allowedFeatures = [];
    if (props.supportsGetObjectPartNumber) {
      allowedFeatures.push('GetObject-PartNumber');
    }
    if (props.supportsGetObjectRange) {
      allowedFeatures.push('GetObject-Range');
    }

    this.name = props.accessPointName.toLowerCase();
    this.accessPoint = new CfnAccessPoint(this, 'LambdaAccessPoint', {
      name: this.name,
      objectLambdaConfiguration: {
        allowedFeatures,
        cloudWatchMetricsEnabled: props.cloudWatchMetricsEnabled,
        supportingAccessPoint: supporting.getAtt('Arn').toString(),
        transformationConfigurations: [
          {
            actions: ['GetObject'],
            contentTransformation: {
              AwsLambda: {
                FunctionArn: props.fn.functionArn,
                FunctionPayload: props.payload ?? '',
              },
            },
          },
        ],
      },
    });
    this.accessPoint.addDependsOn(supporting);

    this.accessPointArn = this.accessPoint.attrArn;
    this.accessPointCreationDate = this.accessPoint.attrCreationDate;

    props.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['s3-object-lambda:WriteGetObjectResponse'],
        resources: ['*'],
      }),
    );
  }

  /** Implement the {@link IAccessPoint.domainName} field. */
  get domainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    return `${this.accessPoint.name}-${this.stack.account}.s3-object-lambda.${urlSuffix}`;
  }

  /** Implement the {@link IAccessPoint.regionalDomainName} field. */
  get regionalDomainName(): string {
    const urlSuffix = this.stack.urlSuffix;
    const region = this.stack.region;
    return `${this.accessPoint.name}-${this.stack.account}.s3-object-lambda.${region}.${urlSuffix}`;
  }

  /** Implement the {@link IAccessPoint.virtualHostedUrlForObject} method. */
  public virtualHostedUrlForObject(key?: string, options?: s3.VirtualHostedStyleUrlOptions): string {
    const domainName = options?.regional ?? true ? this.regionalDomainName : this.domainName;
    const prefix = `https://${domainName}`;
    if (typeof key !== 'string') {
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