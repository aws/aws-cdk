import type { Construct } from 'constructs';
import type { IDeliveryDestination } from './delivery-destination';
import { CfnDelivery } from './logs.generated';
import type { IResource } from '../../core';
import { Resource } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type {
  IDeliveryRef,
  DeliveryReference,
  IDeliverySourceRef,
} from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * A log delivery.
 */
export interface IDelivery extends IResource, IDeliveryRef {}

/**
 * Properties for a Delivery
 */
export interface DeliveryProps {
  /**
   * The delivery source that emits the logs.
   */
  readonly source: IDeliverySourceRef;

  /**
   * The delivery destination that receives the logs.
   *
   * Resource policies on the target are configured automatically.
   */
  readonly destination: IDeliveryDestination;

  /**
   * The field delimiter to use between record fields in the final output, when the
   * delivery's log source outputs records in `Plain`, `W3C`, or `Raw` format.
   *
   * @default - service default
   */
  readonly fieldDelimiter?: string;

  /**
   * The list of record fields to deliver to the destination, in order.
   *
   * If the log source has mandatory fields, they must be included.
   *
   * @default - all available fields
   */
  readonly recordFields?: string[];

  /**
   * When `true`, the S3 objects that contain delivered logs use a prefix structure
   * that enables integration with Apache Hive.
   *
   * Only applicable when delivering to Amazon S3.
   *
   * @default false
   */
  readonly s3EnableHiveCompatiblePath?: boolean;

  /**
   * A suffix path that is appended to the S3 object key for delivered log objects.
   *
   * The valid variable names vary per log source. Use `DescribeConfigurationTemplates`
   * to find the allowed suffix path fields for a given source.
   *
   * Only applicable when delivering to Amazon S3.
   *
   * @default - no suffix path
   */
  readonly s3SuffixPath?: string;
}

/**
 * Define a CloudWatch Logs delivery.
 *
 * A delivery connects exactly one `DeliverySource` to one `DeliveryDestination`.
 * Resource policies on the destination target (S3 bucket, CloudWatch Logs log group)
 * are configured automatically.
 *
 * @resource AWS::Logs::Delivery
 */
@propertyInjectable
export class Delivery extends Resource implements IDelivery {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.Delivery';

  private readonly resource: CfnDelivery;

  /**
   * The ARN of this delivery.
   * @attribute
   */
  @memoizedGetter
  public get deliveryArn(): string {
    return this.resource.attrArn;
  }

  /**
   * The unique ID of this delivery.
   * @attribute
   */
  @memoizedGetter
  public get deliveryId(): string {
    return this.resource.attrDeliveryId;
  }

  public get deliveryRef(): DeliveryReference {
    return {
      deliveryArn: this.deliveryArn,
      deliveryId: this.deliveryId,
    };
  }

  constructor(scope: Construct, id: string, props: DeliveryProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    props.destination.grantWrite(props.source);

    this.resource = new CfnDelivery(this, 'Resource', {
      deliverySourceName: props.source.deliverySourceRef.deliverySourceName,
      deliveryDestinationArn: props.destination.deliveryDestinationRef.deliveryDestinationArn,
      fieldDelimiter: props.fieldDelimiter,
      recordFields: props.recordFields,
      s3EnableHiveCompatiblePath: props.s3EnableHiveCompatiblePath,
      s3SuffixPath: props.s3SuffixPath,
    });
  }
}
