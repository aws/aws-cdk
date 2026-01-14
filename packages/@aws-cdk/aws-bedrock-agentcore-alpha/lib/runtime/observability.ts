import { Lazy, Names, Stack, Tags } from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal, PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { IDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as xray from 'aws-cdk-lib/aws-xray';
import { Construct } from 'constructs';

/**
 * Maximum length for delivery source and destination names
 */
const MAX_DELIVERY_NAME_LENGTH = 60;

/**
 * Log types for AgentCore Runtime observability
 */
export enum LogType {
  /**
   * Application logs for agent runtime invocations
   */
  APPLICATION_LOGS = 'APPLICATION_LOGS',

  /**
   * Usage logs for session-level resource consumption
   */
  USAGE_LOGS = 'USAGE_LOGS',
}

/**
 * Configuration for logging with log type and destination
 */
export interface LoggingConfig {
  /**
   * The type of logs to deliver
   */
  readonly logType: LogType;

  /**
   * The destination for logs
   */
  readonly destination: LoggingDestination;
}

/**
 * Configuration returned by LoggingDestination.bind()
 * @internal
 */
export interface LoggingDestinationBindConfig {
  /**
   * The delivery destination construct
   */
  readonly deliveryDestination: logs.CfnDeliveryDestination;
}

/**
 * Represents a logging destination for AgentCore Runtime
 *
 * Use the static factory methods to create instances:
 * - `LoggingDestination.cloudWatchLogs(logGroup)` - Send logs to CloudWatch Logs
 * - `LoggingDestination.s3(bucket)` - Send logs to S3
 * - `LoggingDestination.firehose(stream)` - Send logs to Kinesis Data Firehose
 */
export abstract class LoggingDestination {
  /**
   * Create a logging destination that sends logs to a CloudWatch Log Group
   *
   * @param logGroup The CloudWatch Log Group to send logs to
   */
  public static cloudWatchLogs(logGroup: logs.ILogGroup): LoggingDestination {
    return new CloudWatchLogsDestination(logGroup);
  }

  /**
   * Create a logging destination that sends logs to an S3 bucket
   *
   * @param bucket The S3 bucket to send logs to
   */
  public static s3(bucket: s3.IBucket): LoggingDestination {
    return new S3Destination(bucket);
  }

  /**
   * Create a logging destination that sends logs to a Kinesis Data Firehose delivery stream
   *
   * @param stream The Firehose delivery stream to send logs to
   */
  public static firehose(stream: IDeliveryStream): LoggingDestination {
    return new FirehoseDestination(stream);
  }

  /**
   * Bind this destination to a scope and create the delivery destination resource
   *
   * @param scope The construct scope
   * @param id The construct id
   * @internal
   */
  public abstract _bind(scope: Construct, id: string): LoggingDestinationBindConfig;
}

/**
 * CloudWatch Logs destination implementation
 */
class CloudWatchLogsDestination extends LoggingDestination {
  constructor(private readonly logGroup: logs.ILogGroup) {
    super();
  }

  public _bind(scope: Construct, id: string): LoggingDestinationBindConfig {
    const stack = Stack.of(scope);

    // Get or create a singleton resource policy for logs delivery
    const policyId = 'CdkLogGroupLogsDeliveryPolicy';
    let resourcePolicy = stack.node.tryFindChild(policyId) as logs.ResourcePolicy | undefined;

    if (!resourcePolicy) {
      resourcePolicy = new logs.ResourcePolicy(stack, policyId);
    }

    // Grant permissions for this specific log group
    // @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-infrastructure-V2-CloudWatchLogs.html
    resourcePolicy.document.addStatements(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${this.logGroup.logGroupArn}:log-stream:*`],
      conditions: {
        StringEquals: {
          'aws:SourceAccount': stack.account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:*`,
        },
      },
    }));

    const deliveryDestination: logs.CfnDeliveryDestination = new logs.CfnDeliveryDestination(scope, `${id}Dest`, {
      name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliveryDestination, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
      deliveryDestinationType: 'CWL',
      destinationResourceArn: this.logGroup.logGroupArn,
    });

    deliveryDestination.node.addDependency(resourcePolicy);

    return { deliveryDestination };
  }
}

/**
 * S3 destination implementation
 */
class S3Destination extends LoggingDestination {
  constructor(private readonly bucket: s3.IBucket) {
    super();
  }

  public _bind(scope: Construct, id: string): LoggingDestinationBindConfig {
    const stack = Stack.of(scope);

    // Add bucket policy for logs delivery
    // @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-infrastructure-V2-S3.html
    this.bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${this.bucket.bucketArn}/AWSLogs/${stack.account}/*`],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
          'aws:SourceAccount': stack.account,
        },
        ArnLike: {
          'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:delivery-source:*`,
        },
      },
    }));

    const deliveryDestination: logs.CfnDeliveryDestination = new logs.CfnDeliveryDestination(scope, `${id}Dest`, {
      name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliveryDestination, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
      deliveryDestinationType: 'S3',
      destinationResourceArn: this.bucket.bucketArn,
    });

    return { deliveryDestination };
  }
}

/**
 * Firehose destination implementation
 */
class FirehoseDestination extends LoggingDestination {
  constructor(private readonly stream: IDeliveryStream) {
    super();
  }

  public _bind(scope: Construct, id: string): LoggingDestinationBindConfig {
    // Firehose uses a service-linked role that requires this tag to grant access
    // @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-infrastructure-V2-Firehose.html
    Tags.of(this.stream).add('LogDeliveryEnabled', 'true');

    const deliveryDestination: logs.CfnDeliveryDestination = new logs.CfnDeliveryDestination(scope, `${id}Dest`, {
      name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliveryDestination, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
      deliveryDestinationType: 'FH',
      destinationResourceArn: this.stream.deliveryStreamArn,
    });

    return { deliveryDestination };
  }
}

/**
 * Internal X-Ray resource policy wrapper that allows adding statements after creation.
 * This is similar to logs.ResourcePolicy but for X-Ray.
 */
class XRayResourcePolicy extends Construct {
  public readonly document: PolicyDocument;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.document = new PolicyDocument();

    new xray.CfnResourcePolicy(this, 'ResourcePolicy', {
      policyName: Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 128 }),
      }),
      policyDocument: Lazy.string({
        produce: () => JSON.stringify(this.document.toJSON()),
      }),
    });
  }
}

/**
 * Configure X-Ray tracing delivery for a runtime
 *
 * @param scope The construct scope
 * @param sourceArn The ARN of the source resource (runtime)
 * @internal
 */
export function configureTracingDelivery(
  scope: Construct,
  sourceArn: string,
): logs.CfnDelivery {
  const stack = Stack.of(scope);

  // Create delivery source for traces
  const deliverySource: logs.CfnDeliverySource = new logs.CfnDeliverySource(scope, 'TracesDeliverySource', {
    name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliverySource, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
    logType: 'TRACES',
    resourceArn: sourceArn,
  });

  // Get or create X-Ray resource policy (singleton per stack)
  const policyId = 'CdkXRayLogsDeliveryPolicy';
  let xrayPolicy = stack.node.tryFindChild(policyId) as XRayResourcePolicy | undefined;

  if (!xrayPolicy) {
    xrayPolicy = new XRayResourcePolicy(stack, policyId);
  }

  // Grant permissions for this specific source resource
  // @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-infrastructure-V2-XRAY.html
  xrayPolicy.document.addStatements(new PolicyStatement({
    sid: 'CDKLogsDeliveryWrite',
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal('delivery.logs.amazonaws.com')],
    actions: ['xray:PutTraceSegments'],
    resources: ['*'],
    conditions: {
      'ForAllValues:ArnLike': {
        'logs:LogGeneratingResourceArns': [sourceArn],
      },
      StringEquals: {
        'aws:SourceAccount': stack.account,
      },
      ArnLike: {
        'aws:SourceArn': `arn:${stack.partition}:logs:${stack.region}:${stack.account}:delivery-source:*`,
      },
    },
  }));

  // Create delivery destination for X-Ray
  const deliveryDestination: logs.CfnDeliveryDestination = new logs.CfnDeliveryDestination(scope, 'TracesDeliveryDest', {
    name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliveryDestination, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
    deliveryDestinationType: 'XRAY',
  });

  deliveryDestination.node.addDependency(xrayPolicy);

  // Create delivery to connect source and destination
  const delivery = new logs.CfnDelivery(scope, 'TracesDelivery', {
    deliverySourceName: deliverySource.name!,
    deliveryDestinationArn: deliveryDestination.attrArn,
  });

  delivery.node.addDependency(deliverySource);
  delivery.node.addDependency(deliveryDestination);

  return delivery;
}

/**
 * Configure logging delivery for a runtime
 *
 * @param scope The construct scope
 * @param sourceArn The ARN of the source resource (runtime)
 * @param loggingConfigs Array of logging configurations
 * @internal
 */
export function configureLoggingDelivery(
  scope: Construct,
  sourceArn: string,
  loggingConfigs: LoggingConfig[],
): logs.CfnDelivery[] {
  const deliveries: logs.CfnDelivery[] = [];

  // Group configs by log type to create one source per log type
  const configsByLogType = new Map<LogType, LoggingConfig[]>();
  for (const config of loggingConfigs) {
    const existing = configsByLogType.get(config.logType) ?? [];
    existing.push(config);
    configsByLogType.set(config.logType, existing);
  }

  // Create delivery sources and deliveries for each log type
  for (const [logType, configs] of configsByLogType) {
    // Convert log type to PascalCase for construct IDs (e.g., APPLICATION_LOGS → ApplicationLogs)
    const logTypeId = logType.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join('');

    // Create a delivery source for this log type
    const deliverySource: logs.CfnDeliverySource = new logs.CfnDeliverySource(scope, `${logTypeId}DeliverySource`, {
      name: Lazy.string({ produce: (): string => Names.uniqueResourceName(deliverySource, { maxLength: MAX_DELIVERY_NAME_LENGTH }) }),
      logType: logType,
      resourceArn: sourceArn,
    });

    // Create delivery for each destination
    configs.forEach((config, index) => {
      const id = configs.length === 1 ? logTypeId : `${logTypeId}${index}`;
      const bindConfig = config.destination._bind(scope, id);

      const delivery = new logs.CfnDelivery(scope, `${id}Delivery`, {
        deliverySourceName: deliverySource.name!,
        deliveryDestinationArn: bindConfig.deliveryDestination.attrArn,
      });

      delivery.node.addDependency(deliverySource);
      delivery.node.addDependency(bindConfig.deliveryDestination);

      if (deliveries.length > 0) {
        delivery.node.addDependency(deliveries[deliveries.length - 1]);
      }

      deliveries.push(delivery);
    });
  }

  return deliveries;
}
