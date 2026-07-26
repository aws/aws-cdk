import type { Construct } from 'constructs';
import type { ILogGroup } from './log-group';
import { CfnDeliveryDestination } from './logs.generated';
import type { OutputFormat } from './output-format';
import * as iam from '../../aws-iam';
import type * as firehose from '../../aws-kinesisfirehose';
import type * as s3 from '../../aws-s3';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack } from '../../core';
import * as cdk from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type {
  IDeliveryDestinationRef,
  DeliveryDestinationReference,
  IDeliverySourceRef,
} from '../../interfaces/generated/aws-logs-interfaces.generated';

// ---------------------------------------------------------------------------
// DeliveryDestinationTarget
// ---------------------------------------------------------------------------

/**
 * Configuration returned by `DeliveryDestinationTarget.bind()`.
 */
export interface DeliveryDestinationTargetConfig {
  /** ARN of the destination resource (S3 bucket, CloudWatch Logs log group, or Firehose stream). */
  readonly destinationResourceArn: string;
  /** Output format for log records delivered to this destination. */
  readonly outputFormat?: OutputFormat;
}

/**
 * The target resource for log delivery.
 *
 * Use the static factory methods to specify the destination type.
 *
 * @example
 * // S3 bucket
 * logs.DeliveryDestinationTarget.fromBucket(myBucket, logs.OutputFormat.JSON)
 * // CloudWatch Logs log group
 * logs.DeliveryDestinationTarget.fromLogGroup(myLogGroup)
 * // Kinesis Data Firehose delivery stream
 * logs.DeliveryDestinationTarget.fromDeliveryStream(stream)
 */
export abstract class DeliveryDestinationTarget {
  /**
   * Deliver logs to an Amazon S3 bucket.
   *
   * @param bucket The S3 bucket to deliver logs to.
   * @param outputFormat The format for log records. Defaults to the source service default.
   */
  public static fromBucket(bucket: s3.IBucket, outputFormat?: OutputFormat): DeliveryDestinationTarget {
    return new S3DeliveryTarget(bucket, outputFormat);
  }

  /**
   * Deliver logs to a CloudWatch Logs log group.
   *
   * @param logGroup The log group to deliver logs to.
   * @param outputFormat The format for log records. Defaults to the source service default.
   */
  public static fromLogGroup(logGroup: ILogGroup, outputFormat?: OutputFormat): DeliveryDestinationTarget {
    return new CloudWatchLogsDeliveryTarget(logGroup, outputFormat);
  }

  /**
   * Deliver logs to a Kinesis Data Firehose delivery stream.
   *
   * AWS automatically creates the `AWSServiceRoleForLogDelivery` service-linked role.
   *
   * @param stream The Kinesis Data Firehose delivery stream.
   * @param outputFormat The format for log records. Defaults to `RAW`.
   */
  public static fromDeliveryStream(stream: firehose.IDeliveryStream, outputFormat?: OutputFormat): DeliveryDestinationTarget {
    return new FirehoseDeliveryTarget(stream, outputFormat);
  }

  /**
   * Returns the ARN and output format for the target resource.
   * Called by the `DeliveryDestination` constructor.
   */
  public abstract bind(scope: Construct): DeliveryDestinationTargetConfig;

  /**
   * Sets up the resource policy on the target so that `delivery.logs.amazonaws.com`
   * can write logs on behalf of the given source.
   * Called by `DeliveryDestination.grantWrite()`.
   */
  public abstract grantWrite(scope: Construct, source: IDeliverySourceRef): void;
}

// Private concrete implementations

class S3DeliveryTarget extends DeliveryDestinationTarget {
  constructor(
    private readonly bucket: s3.IBucket,
    private readonly outputFormat?: OutputFormat,
  ) {
    super();
  }

  public bind(_scope: Construct): DeliveryDestinationTargetConfig {
    return {
      destinationResourceArn: this.bucket.bucketArn,
      outputFormat: this.outputFormat,
    };
  }

  public grantWrite(scope: Construct, source: IDeliverySourceRef): void {
    const stack = Stack.of(scope);
    const sourceArn = source.deliverySourceRef.deliverySourceArn;

    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:GetBucketAcl', 's3:ListBucket'],
      resources: [this.bucket.bucketArn],
      conditions: {
        StringEquals: { 'aws:SourceAccount': stack.account },
        ArnLike: { 'aws:SourceArn': sourceArn },
      },
    }));

    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [this.bucket.arnForObjects(`AWSLogs/${stack.account}/*`)],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': stack.account,
        },
        ArnLike: { 'aws:SourceArn': sourceArn },
      },
    }));
  }
}

class CloudWatchLogsDeliveryTarget extends DeliveryDestinationTarget {
  constructor(
    private readonly logGroup: ILogGroup,
    private readonly outputFormat?: OutputFormat,
  ) {
    super();
  }

  public bind(_scope: Construct): DeliveryDestinationTargetConfig {
    return {
      destinationResourceArn: this.logGroup.logGroupArn,
      outputFormat: this.outputFormat,
    };
  }

  public grantWrite(scope: Construct, source: IDeliverySourceRef): void {
    const stack = Stack.of(scope);
    const sourceArn = source.deliverySourceRef.deliverySourceArn;
    const logStreamArn = stack.formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `${this.logGroup.logGroupName}:log-stream:*`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.logGroup.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [logStreamArn],
      conditions: {
        StringEquals: { 'aws:SourceAccount': stack.account },
        ArnLike: { 'aws:SourceArn': sourceArn },
      },
    }));
  }
}

class FirehoseDeliveryTarget extends DeliveryDestinationTarget {
  constructor(
    private readonly stream: firehose.IDeliveryStream,
    private readonly outputFormat?: OutputFormat,
  ) {
    super();
  }

  public bind(_scope: Construct): DeliveryDestinationTargetConfig {
    return {
      destinationResourceArn: this.stream.deliveryStreamArn,
      outputFormat: this.outputFormat,
    };
  }

  public grantWrite(_scope: Construct, _source: IDeliverySourceRef): void {
    // No-op: AWS automatically creates the AWSServiceRoleForLogDelivery service-linked role
    // and the required LogDeliveryEnabled tag on the stream.
  }
}

// ---------------------------------------------------------------------------
// IDeliveryDestination
// ---------------------------------------------------------------------------

/**
 * A log delivery destination.
 */
export interface IDeliveryDestination extends IResource, IDeliveryDestinationRef {
  /**
   * Grant the CloudWatch Logs delivery service permission to write to this destination,
   * scoped to the given delivery source.
   *
   * This is called automatically by the `Delivery` constructor — you do not need to call
   * it explicitly.
   *
   * - **S3**: Adds `s3:GetBucketAcl`, `s3:ListBucket`, and `s3:PutObject` to the bucket policy.
   * - **CloudWatch Logs**: Adds `logs:CreateLogStream` and `logs:PutLogEvents` to a log group resource policy.
   * - **Firehose**: No-op — AWS auto-creates the required service-linked role and tags.
   */
  grantWrite(source: IDeliverySourceRef): void;
}

// ---------------------------------------------------------------------------
// DeliveryDestinationProps
// ---------------------------------------------------------------------------

/**
 * Properties for a DeliveryDestination
 */
export interface DeliveryDestinationProps {
  /**
   * The target resource to deliver logs to.
   *
   * Use `DeliveryDestinationTarget.fromBucket()`, `fromLogGroup()`, or `fromDeliveryStreamArn()`.
   */
  readonly target: DeliveryDestinationTarget;

  /**
   * The name for this delivery destination.
   *
   * @default Automatically generated
   */
  readonly deliveryDestinationName?: string;
}

// ---------------------------------------------------------------------------
// DeliveryDestination
// ---------------------------------------------------------------------------

/**
 * Define a CloudWatch Logs delivery destination.
 *
 * A delivery destination specifies the target resource (S3, CloudWatch Logs, or Firehose)
 * that will receive log records. Use together with `DeliverySource` and `Delivery` to
 * configure log delivery.
 *
 * Resource policies on the target are configured automatically when a `Delivery`
 * construct links a source to this destination.
 *
 * @resource AWS::Logs::DeliveryDestination
 */
@propertyInjectable
export class DeliveryDestination extends Resource implements IDeliveryDestination {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.DeliveryDestination';

  /**
   * Import an existing DeliveryDestination by its ARN.
   *
   * Note: `grantWrite()` is a no-op on imported destinations — resource policies
   * must be configured manually on the target resource.
   */
  public static fromDeliveryDestinationArn(scope: Construct, id: string, deliveryDestinationArn: string): IDeliveryDestination {
    const deliveryDestinationName = cdk.Stack.of(scope).splitArn(
      deliveryDestinationArn,
      ArnFormat.COLON_RESOURCE_NAME,
    ).resourceName!;
    class Import extends Resource implements IDeliveryDestination {
      public get deliveryDestinationRef(): DeliveryDestinationReference {
        return { deliveryDestinationName, deliveryDestinationArn };
      }
      public grantWrite(_source: IDeliverySourceRef): void {
        // No-op: imported destination — resource policies must be configured manually.
      }
    }
    return new Import(scope, id, { environmentFromArn: deliveryDestinationArn });
  }

  /**
   * Import an existing DeliveryDestination by its name.
   *
   * Note: `grantWrite()` is a no-op on imported destinations — resource policies
   * must be configured manually on the target resource.
   */
  public static fromDeliveryDestinationName(scope: Construct, id: string, deliveryDestinationName: string): IDeliveryDestination {
    class Import extends Resource implements IDeliveryDestination {
      public get deliveryDestinationRef(): DeliveryDestinationReference {
        const arn = cdk.Stack.of(this).formatArn({
          service: 'logs',
          resource: 'delivery-destination',
          resourceName: deliveryDestinationName,
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        });
        return { deliveryDestinationName, deliveryDestinationArn: arn };
      }
      public grantWrite(_source: IDeliverySourceRef): void {
        // No-op: imported destination — resource policies must be configured manually.
      }
    }
    return new Import(scope, id);
  }

  private readonly resource: CfnDeliveryDestination;
  private readonly target: DeliveryDestinationTarget;
  private readonly deliveryDestinationPolicyDocument = new iam.PolicyDocument();

  /**
   * The ARN of this delivery destination.
   * @attribute
   */
  @memoizedGetter
  public get deliveryDestinationArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'logs',
      resource: 'delivery-destination',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * The name of this delivery destination.
   * @attribute
   */
  @memoizedGetter
  public get deliveryDestinationName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  public get deliveryDestinationRef(): DeliveryDestinationReference {
    return {
      deliveryDestinationName: this.deliveryDestinationName,
      deliveryDestinationArn: this.deliveryDestinationArn,
    };
  }

  constructor(scope: Construct, id: string, props: DeliveryDestinationProps) {
    super(scope, id, {
      physicalName: props.deliveryDestinationName ??
        cdk.Lazy.string({ produce: () => this.generateUniqueName() }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.target = props.target;
    const config = props.target.bind(this);

    this.resource = new CfnDeliveryDestination(this, 'Resource', {
      name: this.physicalName!,
      destinationResourceArn: config.destinationResourceArn,
      outputFormat: config.outputFormat?.value,
    });
  }

  /**
   * Add a statement to the delivery destination policy.
   *
   * The delivery destination policy controls which principals in other accounts
   * can link their `DeliverySource` to this `DeliveryDestination` (cross-account delivery).
   * For same-account delivery, this is not required.
   */
  @MethodMetadata()
  public addToDeliveryDestinationPolicy(statement: iam.PolicyStatement): void {
    this.deliveryDestinationPolicyDocument.addStatements(statement);
    this.resource.deliveryDestinationPolicy = {
      deliveryDestinationName: this.physicalName,
      deliveryDestinationPolicy: this.deliveryDestinationPolicyDocument,
    };
  }

  /**
   * Grant the CloudWatch Logs delivery service permission to write to this destination,
   * scoped to the given delivery source.
   *
   * Called automatically by the `Delivery` constructor.
   */
  @MethodMetadata()
  public grantWrite(source: IDeliverySourceRef): void {
    this.target.grantWrite(this, source);
  }

  private generateUniqueName(): string {
    return cdk.Stack.of(this).stackName + '-' + this.resource.logicalId;
  }
}
