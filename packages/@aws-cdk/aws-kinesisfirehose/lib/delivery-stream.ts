import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { RegionInfo } from '@aws-cdk/region-info';
import { Construct, Node } from 'constructs';
import { IDestination } from './destination';
import { FirehoseMetrics } from './kinesisfirehose-canned-metrics.generated';
import { CfnDeliveryStream } from './kinesisfirehose.generated';

const PUT_RECORD_ACTIONS = [
  'firehose:PutRecord',
  'firehose:PutRecordBatch',
];

/**
 * Represents a Kinesis Data Firehose delivery stream.
 */
export interface IDeliveryStream extends cdk.IResource, iam.IGrantable, ec2.IConnectable {
  /**
   * The ARN of the delivery stream.
   *
   * @attribute
   */
  readonly deliveryStreamArn: string;

  /**
   * The name of the delivery stream.
   *
   * @attribute
   */
  readonly deliveryStreamName: string;

  /**
   * Grant the `grantee` identity permissions to perform `actions`.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the `grantee` identity permissions to perform `firehose:PutRecord` and `firehose:PutRecordBatch` actions on this delivery stream.
   */
  grantPutRecords(grantee: iam.IGrantable): iam.Grant;

  /**
   * Return the given named metric for this delivery stream.
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of bytes ingested successfully into the delivery stream over the specified time period after throttling.
   *
   * By default, this metric will be calculated as an average over a period of 5 minutes.
   */
  metricIncomingBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of records ingested successfully into the delivery stream over the specified time period after throttling.
   *
   * By default, this metric will be calculated as an average over a period of 5 minutes.
   */
  metricIncomingRecords(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of bytes delivered to Amazon S3 for backup over the specified time period.
   *
   * By default, this metric will be calculated as an average over a period of 5 minutes.
   */
  metricBackupToS3Bytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the age (from getting into Kinesis Data Firehose to now) of the oldest record in Kinesis Data Firehose.
   *
   * Any record older than this age has been delivered to the Amazon S3 bucket for backup.
   *
   * By default, this metric will be calculated as an average over a period of 5 minutes.
   */
  metricBackupToS3DataFreshness(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of records delivered to Amazon S3 for backup over the specified time period.
   *
   * By default, this metric will be calculated as an average over a period of 5 minutes.
   */
  metricBackupToS3Records(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Base class for new and imported Kinesis Data Firehose delivery streams.
 */
abstract class DeliveryStreamBase extends cdk.Resource implements IDeliveryStream {

  public abstract readonly deliveryStreamName: string;

  public abstract readonly deliveryStreamArn: string;

  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * Network connections between Kinesis Data Firehose and other resources, i.e. Redshift cluster.
   */
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: cdk.ResourceProps = {}) {
    super(scope, id, props);

    this.connections = setConnections(this);
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      resourceArns: [this.deliveryStreamArn],
      grantee: grantee,
      actions: actions,
    });
  }

  public grantPutRecords(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...PUT_RECORD_ACTIONS);
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Firehose',
      metricName: metricName,
      dimensionsMap: {
        DeliveryStreamName: this.deliveryStreamName,
      },
      ...props,
    }).attachTo(this);
  }

  public metricIncomingBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(FirehoseMetrics.incomingBytesSum, props);
  }

  public metricIncomingRecords(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(FirehoseMetrics.incomingRecordsSum, props);
  }

  public metricBackupToS3Bytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(FirehoseMetrics.backupToS3BytesSum, props);
  }

  public metricBackupToS3DataFreshness(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(FirehoseMetrics.backupToS3DataFreshnessAverage, props);
  }

  public metricBackupToS3Records(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(FirehoseMetrics.backupToS3RecordsSum, props);
  }

  private cannedMetric(fn: (dims: { DeliveryStreamName: string }) => cloudwatch.MetricProps, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      ...fn({ DeliveryStreamName: this.deliveryStreamName }),
      ...props,
    }).attachTo(this);
  }
}

/**
 * Options for server-side encryption of a delivery stream.
 */
export enum StreamEncryption {
  /**
   * Data in the stream is stored unencrypted.
   */
  UNENCRYPTED,

  /**
   * Data in the stream is stored encrypted by a KMS key managed by the customer.
   */
  CUSTOMER_MANAGED,

  /**
   * Data in the stream is stored encrypted by a KMS key owned by AWS and managed for use in multiple AWS accounts.
   */
  AWS_OWNED,
}

/**
 * Properties for a new delivery stream.
 */
export interface DeliveryStreamProps {
  /**
   * The destinations that this delivery stream will deliver data to.
   *
   * Only a singleton array is supported at this time.
   */
  readonly destinations: IDestination[];

  /**
   * A name for the delivery stream.
   *
   * @default - a name is generated by CloudFormation.
   */
  readonly deliveryStreamName?: string;

  /**
   * The Kinesis data stream to use as a source for this delivery stream.
   *
   * @default - data must be written to the delivery stream via a direct put.
   */
  readonly sourceStream?: kinesis.IStream;

  /**
   * The IAM role associated with this delivery stream.
   *
   * Assumed by Kinesis Data Firehose to read from sources and encrypt data server-side.
   *
   * @default - a role will be created with default permissions.
   */
  readonly role?: iam.IRole;

  /**
   * Indicates the type of customer master key (CMK) to use for server-side encryption, if any.
   *
   * @default StreamEncryption.UNENCRYPTED - unless `encryptionKey` is provided, in which case this will be implicitly set to `StreamEncryption.CUSTOMER_MANAGED`
   */
  readonly encryption?: StreamEncryption;

  /**
   * Customer managed key to server-side encrypt data in the stream.
   *
   * @default - no KMS key will be used; if `encryption` is set to `CUSTOMER_MANAGED`, a KMS key will be created for you
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A full specification of a delivery stream that can be used to import it fluently into the CDK application.
 */
export interface DeliveryStreamAttributes {
  /**
   * The ARN of the delivery stream.
   *
   * At least one of deliveryStreamArn and deliveryStreamName must be provided.
   *
   * @default - derived from `deliveryStreamName`.
   */
  readonly deliveryStreamArn?: string;

  /**
   * The name of the delivery stream
   *
   * At least one of deliveryStreamName and deliveryStreamArn  must be provided.
   *
   * @default - derived from `deliveryStreamArn`.
   */
  readonly deliveryStreamName?: string;

  /**
   * The IAM role associated with this delivery stream.
   *
   * Assumed by Kinesis Data Firehose to read from sources and encrypt data server-side.
   *
   * @default - the imported stream cannot be granted access to other resources as an `iam.IGrantable`.
   */
  readonly role?: iam.IRole;
}

/**
 * Create a Kinesis Data Firehose delivery stream
 *
 * @resource AWS::KinesisFirehose::DeliveryStream
 */
export class DeliveryStream extends DeliveryStreamBase {
  /**
   * Import an existing delivery stream from its name.
   */
  static fromDeliveryStreamName(scope: Construct, id: string, deliveryStreamName: string): IDeliveryStream {
    return this.fromDeliveryStreamAttributes(scope, id, { deliveryStreamName });
  }

  /**
   * Import an existing delivery stream from its ARN.
   */
  static fromDeliveryStreamArn(scope: Construct, id: string, deliveryStreamArn: string): IDeliveryStream {
    return this.fromDeliveryStreamAttributes(scope, id, { deliveryStreamArn });
  }

  /**
   * Import an existing delivery stream from its attributes.
   */
  static fromDeliveryStreamAttributes(scope: Construct, id: string, attrs: DeliveryStreamAttributes): IDeliveryStream {
    if (!attrs.deliveryStreamName && !attrs.deliveryStreamArn) {
      throw new Error('Either deliveryStreamName or deliveryStreamArn must be provided in DeliveryStreamAttributes');
    }
    const deliveryStreamName = attrs.deliveryStreamName ??
      cdk.Stack.of(scope).splitArn(attrs.deliveryStreamArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!deliveryStreamName) {
      throw new Error(`No delivery stream name found in ARN: '${attrs.deliveryStreamArn}'`);
    }
    const deliveryStreamArn = attrs.deliveryStreamArn ?? cdk.Stack.of(scope).formatArn({
      service: 'firehose',
      resource: 'deliverystream',
      resourceName: attrs.deliveryStreamName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends DeliveryStreamBase {
      public readonly deliveryStreamName = deliveryStreamName!;
      public readonly deliveryStreamArn = deliveryStreamArn;
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
    }
    return new Import(scope, id);
  }

  readonly deliveryStreamName: string;

  readonly deliveryStreamArn: string;

  readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: DeliveryStreamProps) {
    super(scope, id, {
      physicalName: props.deliveryStreamName,
    });

    if (props.destinations.length !== 1) {
      throw new Error(`Only one destination is allowed per delivery stream, given ${props.destinations.length}`);
    }

    const role = props.role ?? new iam.Role(this, 'Service Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    this.grantPrincipal = role;

    if (
      props.sourceStream &&
        (props.encryption === StreamEncryption.AWS_OWNED || props.encryption === StreamEncryption.CUSTOMER_MANAGED || props.encryptionKey)
    ) {
      throw new Error('Requested server-side encryption but delivery stream source is a Kinesis data stream. Specify server-side encryption on the data stream instead.');
    }
    if ((props.encryption === StreamEncryption.AWS_OWNED || props.encryption === StreamEncryption.UNENCRYPTED) && props.encryptionKey) {
      throw new Error(`Specified stream encryption as ${StreamEncryption[props.encryption]} but provided a customer-managed key`);
    }
    const encryptionKey = props.encryptionKey ?? (props.encryption === StreamEncryption.CUSTOMER_MANAGED ? new kms.Key(this, 'Key') : undefined);
    const encryptionConfig = (encryptionKey || (props.encryption === StreamEncryption.AWS_OWNED)) ? {
      keyArn: encryptionKey?.keyArn,
      keyType: encryptionKey ? 'CUSTOMER_MANAGED_CMK' : 'AWS_OWNED_CMK',
    } : undefined;
    /*
     * In order for the service role to have access to the encryption key before the delivery stream is created, the
     * CfnDeliveryStream below should have a dependency on the grant returned by the function call below:
     * > `keyGrant?.applyBefore(resource)`
     * However, an error during synthesis is thrown if this is added:
     * > ${Token[PolicyDocument.###]} does not implement DependableTrait
     * Data will not be lost if the permissions are not granted to the service role immediately; Firehose has a 24 hour
     * period where data will be buffered and retried if access is denied to the encryption key. For that reason, it is
     * acceptable to omit the dependency for now. See: https://github.com/aws/aws-cdk/issues/15790
     */
    encryptionKey?.grantEncryptDecrypt(role);

    const sourceStreamConfig = props.sourceStream ? {
      kinesisStreamArn: props.sourceStream.streamArn,
      roleArn: role.roleArn,
    } : undefined;
    const readStreamGrant = props.sourceStream?.grantRead(role);

    const destinationConfig = props.destinations[0].bind(this, {});

    const resource = new CfnDeliveryStream(this, 'Resource', {
      deliveryStreamEncryptionConfigurationInput: encryptionConfig,
      deliveryStreamName: props.deliveryStreamName,
      deliveryStreamType: props.sourceStream ? 'KinesisStreamAsSource' : 'DirectPut',
      kinesisStreamSourceConfiguration: sourceStreamConfig,
      ...destinationConfig,
    });

    destinationConfig.dependables?.forEach(dependable => resource.node.addDependency(dependable));
    if (readStreamGrant) {
      resource.node.addDependency(readStreamGrant);
    }

    this.deliveryStreamArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'kinesis',
      resource: 'deliverystream',
      resourceName: this.physicalName,
    });
    this.deliveryStreamName = this.getResourceNameAttribute(resource.ref);
  }
}

function setConnections(scope: Construct) {
  const stack = cdk.Stack.of(scope);

  const mappingId = '@aws-cdk/aws-kinesisfirehose.CidrBlocks';
  let cfnMapping = Node.of(stack).tryFindChild(mappingId) as cdk.CfnMapping;

  if (!cfnMapping) {
    const mapping: {[region: string]: { FirehoseCidrBlock: string }} = {};
    RegionInfo.regions.forEach((regionInfo) => {
      if (regionInfo.firehoseCidrBlock) {
        mapping[regionInfo.name] = {
          FirehoseCidrBlock: regionInfo.firehoseCidrBlock,
        };
      }
    });
    cfnMapping = new cdk.CfnMapping(stack, mappingId, {
      mapping,
      lazy: true,
    });
  }

  const cidrBlock = cfnMapping.findInMap(stack.region, 'FirehoseCidrBlock');

  return new ec2.Connections({
    peer: ec2.Peer.ipv4(cidrBlock),
  });
}
